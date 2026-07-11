"use client";

import { useState } from "react";

import type { Story, StoryCategory } from "../types";

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
  const visibleStories = category === "all" ? stories : stories.filter((story) => story.category === category);

  return (
    <main className="library-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="StoryStage 首页"><span aria-hidden="true">✦</span> StoryStage</a>
        <span className="header-note">家庭英语小剧场</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Family story night</p>
          <h1>今晚，把英语故事演出来。</h1>
          <p>选一个故事，全家一起开口说英语。</p>
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
                <div><dt>难度</dt><dd>{story.level}</dd></div>
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
    </main>
  );
}
