import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoryStage | 家庭英语剧场",
  description: "适合 9–11 岁孩子的家庭英语角色扮演故事，支持 2–3 人排练与打印。",
  openGraph: {
    title: "StoryStage | 家庭英语剧场",
    description: "适合 9–11 岁孩子的家庭英语角色扮演故事，支持 2–3 人排练与打印。",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StoryStage | 家庭英语剧场",
    description: "适合 9–11 岁孩子的家庭英语角色扮演故事，支持 2–3 人排练与打印。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
