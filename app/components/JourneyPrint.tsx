import type { Story } from "../types";

export function JourneyPrint({ stories }: { stories: Story[] }) {
  return (
    <section className="journey-print" role="region" aria-label="6 课英语成长地图">
      <header><p className="eyebrow">StoryStage · My English Journey</p><h1>6 课英语成长地图</h1><p>建议每周 1 个故事，6 周走完；每次练习后填数字。目标不是一次全会，而是隔几天还能自己说出来。</p></header>
      <div className="journey-grid">{stories.map((story, index) => <article className="journey-story" key={story.id}><div className="journey-story-heading"><span>{index + 1}</span><div><h2>{story.title}</h2><p>{story.chineseTitle}</p></div></div><div className="journey-goals"><strong>我会说</strong>{story.learningPack.patterns.map((pattern) => <span key={pattern.title}>□ {pattern.title}</span>)}</div><p className="journey-score"><strong>独立说出：</strong>0 天 __/8　2 天 __/8　7 天 __/8</p><p className="journey-score"><strong>句型脱稿：</strong>0 天 __/2　2 天 __/2　7 天 __/2</p><div className="journey-dates"><span>第 0 天：____</span><span>第 2 天：____</span><span>第 7 天：____</span></div><p>我最喜欢的台词：________________________________</p></article>)}</div>
      <footer><strong>六课完成庆祝：</strong>我能选一个故事，不看中文提示演给家人看。　日期：________　家长签名：____________</footer>
    </section>
  );
}
