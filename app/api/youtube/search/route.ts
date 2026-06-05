import { NextResponse } from "next/server";
import youtubeSearchApi from "youtube-search-api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json({ error: "q is required" }, { status: 400 });
    }

    const result = await youtubeSearchApi.GetListByKeyword(q, false, 10, [{type: "video"}]);
    
    // Format the response to be simple
    const formatted = result.items.filter((item: any) => item.type === 'video').map((item: any) => ({
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail?.thumbnails?.[0]?.url || "",
      channelTitle: item.channelTitle || "",
      url: `https://youtube.com/watch?v=${item.id}`
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("YouTube search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
