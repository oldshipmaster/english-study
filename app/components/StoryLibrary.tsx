"use client";

import { useState } from "react";

import type { Story, StoryCategory } from "../types";
import { JourneyPrint } from "./JourneyPrint";
import { WordBankPrint } from "./WordBankPrint";

type StoryLibraryProps = {
  stories: Story[];
  onSelect: (story: Story) => void;
};

const filters: Array<{ label: string; value: "all" | StoryCategory }> = [
  { label: "全部", value: "all" },
  { label: "家庭", value: "family" },
  { label: "学校", value: "school" },
  { label: "奇幻", value: "fantasy" },
];

const categoryNames: Record<StoryCategory, string> = {
  family: "家庭时光",
  school: "校园故事",
  fantasy: "奇幻冒险",
};

export function StoryLibrary({ stories, onSelect }: StoryLibraryProps) {
  const [category, setCategory] = useState<"all" | StoryCategory>("all");
  const [showJourney, setShowJourney] = useState(false);
  const [showWordBank, setShowWordBank] = useState(false);
  const visibleStories = category === "all" ? stories : stories.filter((story) => story.category === category);

  return (
    <main className={`library-shell${showJourney ? " journey-print-mode" : ""}${showWordBank ? " word-bank-print-mode" : ""}`}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="StoryStage 首页"><span aria-hidden="true">✦</span> StoryStage</a>
        <span className="header-note">家庭英语小剧场</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Family story night</p>
          <h1>今晚，把英语故事演出来。</h1>
          <p>适合 9–11 岁小学基础 · 每次 8–10 分钟 · 以纸质练习为主</p>
        </div>
        <div className="hero-art" aria-hidden="true"><span>☾</span><span>📖</span><span>★</span></div>
      </section>

      <section className="catalog" aria-labelledby="catalog-title">
        <div className="catalog-heading">
          <div><p className="eyebrow">Choose a story</p><h2 id="catalog-title">今晚演哪一本？</h2></div>
          <div className="filters" aria-label="故事分类">
            {filters.map((filter) => (
              <button
                aria-pressed={category === filter.value}
                className="filter-chip"
                key={filter.value}
                onClick={() => setCategory(filter.value)}
                type="button"
              >{filter.label}</button>
            ))}
          </div>
        </div>

        <div className="story-grid">
          {visibleStories.map((story, index) => (
            <article className={`story-card story-card--${story.category}`} data-testid="story-card" key={story.id}>
              <div className="card-number" aria-hidden="true">0{index + 1}</div>
              <p className="category-label">{categoryNames[story.category]}</p>
              <h3>{story.title}</h3>
              <p className="chinese-title">{story.chineseTitle}</p>
              <div className="story-learning-focus"><strong>本课会说</strong>{story.learningPack.patterns.map((pattern) => <span key={pattern.title}>{pattern.title}</span>)}</div>
              <dl className="story-facts">
                <div><dt>时长</dt><dd>{story.minutes} 分钟</dd></div>
                <div><dt>难度</dt><dd>小学基础</dd></div>
                <div><dt>词汇</dt><dd>{Object.keys(story.vocabulary).length} 个</dd></div>
                <div><dt>人数</dt><dd>2–3 players</dd></div>
              </dl>
              <button className="select-story" onClick={() => onSelect(story)} type="button" aria-label={`选择 ${story.title}`}>
                选择故事 <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      </section>
      <section className="journey-launch"><div><h2>把六个故事连成一条学习路</h2><p>打印一张 A4 成长地图，记录第 0、2、7 天的复习。</p></div><button type="button" aria-expanded={showJourney} onClick={() => { setShowJourney((current) => !current); setShowWordBank(false); }}>{showJourney ? "收起 6 课成长地图" : "打开 6 课成长地图"}</button>{showJourney ? <button className="primary-control" type="button" onClick={() => window.print()}>打印 6 课成长地图</button> : null}</section>
      {showJourney ? <JourneyPrint stories={stories} /> : null}
      <section className="journey-launch word-bank-launch"><div><h2>把 48 个词和 12 个句型变成会说的英语</h2><p>四张 A4 累计复习：先主动回忆，再换词造句，最后脱稿说。</p></div><button type="button" aria-expanded={showWordBank} onClick={() => { setShowWordBank((current) => !current); setShowJourney(false); }}>{showWordBank ? "收起 48 词 + 12 句型复习本" : "打开 48 词 + 12 句型复习本"}</button>{showWordBank ? <button className="primary-control" type="button" onClick={() => window.print()}>打印 48 词 + 12 句型复习本</button> : null}</section>
      {showWordBank ? <WordBankPrint stories={stories} /> : null}
    </main>
  );
}
