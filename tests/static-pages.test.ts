import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("GitHub Pages static source contract", () => {
  it("configures the repository base path", () => {
    const config = readSource("vite.pages.config.ts");

    expect(config).toContain('base: "/english-study/"');
    expect(config).toContain('publicDir: "../public"');
  });

  it("provides exact static metadata and a React root", () => {
    const html = readSource("static-site/index.html");

    expect(html).toContain("<title>StoryStage | 家庭英语剧场</title>");
    expect(html).toContain("适合 9–11 岁孩子的家庭英语角色扮演故事，支持 2–3 人排练与打印。");
    expect(html).toContain("https://oldshipmaster.github.io/english-study/og.png");
    expect(html).toContain('id="root"');
  });

  it("uses StoryStageApp in both application entries", () => {
    const staticEntry = readSource("static-site/src/main.tsx");
    const vinextEntry = readSource("app/page.tsx");
    const app = readSource("app/StoryStageApp.tsx");

    expect(staticEntry).toContain('import { StoryStageApp } from "../../app/StoryStageApp"');
    expect(staticEntry).toContain("<StoryStageApp />");
    expect(vinextEntry).toContain('import { StoryStageApp } from "./StoryStageApp"');
    expect(vinextEntry).toContain("<StoryStageApp />");
    expect(app).toContain('id="top"');
  });
});
