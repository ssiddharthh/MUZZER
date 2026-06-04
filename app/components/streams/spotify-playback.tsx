"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: (() => void) | undefined;
    Spotify: any;
  }
}

export function SpotifyPlayback() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const playerRef = useRef<any | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [track, setTrack] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const loadSdk = () => {
      if (window.Spotify) return onSdkReady();

      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = onSdkReady;
    };

    function onSdkReady() {
      const player = new window.Spotify.Player({
        name: "Muzzer Player",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token);
        },
      });

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        setDeviceId(device_id);
        setIsReady(true);
        // Remember SDK device, but do not force transfer — allow user to choose
        setSelectedDevice(device_id);
      });

      player.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        setIsPaused(state.paused);
        setTrack(state.track_window?.current_track ?? null);
      });

      player.addListener("not_ready", ({ device_id }: { device_id: string }) => {
        setIsReady(false);
        setDeviceId(null);
      });

      player.connect();
      playerRef.current = player;
    }

    loadSdk();

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;

    async function fetchDevices() {
      try {
        const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setDevices(data.devices ?? []);
      } catch (e) {
        // ignore
      }
    }

    fetchDevices();
  }, [token]);

  async function transferToDevice(device_id: string) {
    if (!token) return;
    try {
      const res = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device_ids: [device_id], play: false }),
      });

      if (res.ok) {
        setSelectedDevice(device_id);
        setDeviceId(device_id);
      }
    } catch (e) {
      // ignore
    }
  }

  if (!token) {
    return <p className="text-sm text-muted">Connect Spotify to enable in-browser playback.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="text-sm text-muted">Device</div>
          <div className="font-medium">{isReady ? `Connected (${deviceId?.slice(0, 6)})` : "Not ready"}</div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedDevice ?? ""}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="rounded border border-border px-2 py-1 text-sm"
          >
            <option value="">Select device</option>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} {d.is_active ? "(active)" : ""}
              </option>
            ))}
          </select>
          <Button onClick={() => selectedDevice && transferToDevice(selectedDevice)}>Transfer</Button>
        </div>
      </div>

      {track ? (
        <div className="flex items-center gap-3">
          {track.album?.images?.[2] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={track.album.images[2].url} alt="" className="h-12 w-12 rounded" />
          ) : null}
          <div>
            <div className="font-medium">{track.name}</div>
            <div className="text-sm text-muted">{track.artists?.map((a: any) => a.name).join(", ")}</div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted">No track currently playing.</div>
      )}
    </div>
  );
}
