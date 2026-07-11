import type { Story } from "../types";

export function JourneyPrint({ stories }: { stories: Story[] }) {
  return (
    <section className="journey-print" role="region" aria-label="6 课英语成长地图">
      <header><p className="eyebrow">StoryStage · My English Journey</p><h1>6 课英语成长地图</h1><p>每完成一次练习就涂一颗星。目标不是一次全会，而是隔几天还能自己说出来。</p></header>
      <div className="journey-grid">{stories.map((story, index) => <article className="journey-story" key={story.id}><div className="journey-story-heading"><span>{index + 1}</span><div><h2>{story.title}</h2><p>{story.chineseTitle}</p></div></div><div className="journey-goals"><strong>我会说</strong>{story.learningPack.patterns.map((pattern) => <span key={pattern.title}>□ {pattern.title}</span>)}</div><p><strong>8 个词：</strong>当天 ☆☆☆　第二天 ☆☆☆　第七天 ☆☆☆</p><div className="journey-dates"><span>第 0 天：____</span><span>第 2 天：____</span><span>第 7 天：____</span></div><p>我最喜欢的台词：________________________________</p></article>)}</div>
      <footer><strong>六课完成庆祝：</strong>我能选一个故事，不看中文提示演给家人看。　日期：________　家长签名：____________</footer>
    </section>
  );
}
