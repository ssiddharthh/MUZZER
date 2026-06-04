import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";

import { prisma } from "@/app/lib/prisma";
import { Provider as PrismaProvider } from "@/app/generated/prisma/client";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for authentication.`);
  }

  return value;
}

function getOptionalEnv(name: string) {
  return process.env[name] || null;
}

async function refreshSpotifyAccessToken(token: any) {
  try {
    const clientId = getRequiredEnv("SPOTIFY_CLIENT_ID");
    const clientSecret = getRequiredEnv("SPOTIFY_CLIENT_SECRET");

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ...token, error: "RefreshAccessTokenError" };
    }

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

const spotifyClientId = getOptionalEnv("SPOTIFY_CLIENT_ID");
const spotifyClientSecret = getOptionalEnv("SPOTIFY_CLIENT_SECRET");

const providers = [
  GoogleProvider({
    clientId: getRequiredEnv("GOOGLE_CLIENT_ID"),
    clientSecret: getRequiredEnv("GOOGLE_CLIENT_SECRET"),
  }),
] as any[];

if (spotifyClientId && spotifyClientSecret) {
  providers.push(
    SpotifyProvider({
      clientId: spotifyClientId,
      clientSecret: spotifyClientSecret,
      authorization: {
        params: {
          scope:
            "streaming user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-private user-read-email playlist-read-private",
        },
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      const provider = account?.provider === "spotify"
        ? PrismaProvider.Spotify
        : PrismaProvider.Google;

      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          provider,
        },
      });

      return true;
    },

    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : null,
          provider: account.provider,
        };
      }

      // Return previous token if the access token has not expired yet
      if (
        typeof token.accessTokenExpires === "number" &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      // If provider is spotify, attempt to refresh
      if (token.provider === "spotify") {
        return await refreshSpotifyAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
        (session as any).provider = token.provider;
      }

      return session;
    },
  },
};
