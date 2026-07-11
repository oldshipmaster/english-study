import type { Metadata } from "next";

const title = "StoryStage | 家庭英语剧场";
const description = "适合 9–11 岁孩子的家庭英语角色扮演故事，支持 2–3 人排练与打印。";

export function createStoryMetadata(host: string | null, forwardedProtocol: string | null): Metadata {
  const protocol = forwardedProtocol === "http" || forwardedProtocol === "https" ? forwardedProtocol : "https";
  let imageUrl: string | null = null;
  if (host) {
    try {
      imageUrl = new URL("/og.png", `${protocol}://${host}`).toString();
    } catch {
      imageUrl = null;
    }
  }

  return {
    title, description,
    openGraph: { title, description, type: "website", ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: "StoryStage 家庭英语剧场" }] } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(imageUrl ? { images: [imageUrl] } : {}) },
  };
}
