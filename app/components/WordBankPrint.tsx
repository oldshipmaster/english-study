import type { Story } from "../types";

type WordBankPrintProps = {
  stories: Story[];
};

export function WordBankPrint({ stories }: WordBankPrintProps) {
  const pageStories = [stories.slice(0, 3), stories.slice(3, 6)];
  const patterns = stories.flatMap((story) => story.learningPack.patterns.map((pattern) => ({ story, pattern })));
  const patternPages = [patterns.slice(0, 6), patterns.slice(6, 12)];

  return (
    <section className="word-bank-print" role="region" aria-label="六课词句累计复习本">
      {pageStories.map((group, pageIndex) => (
        <article className="word-bank-page" key={pageIndex}>
          <header className="word-bank-header">
            <div><p className="eyebrow">StoryStage · 48-word challenge</p><h1>六课词句累计复习本</h1></div>
            <div className="word-bank-name">姓名：________　日期：________</div>
          </header>
          <div className="word-bank-method"><strong>先遮答案，再主动想：</strong>看中文 → 说英文 → 写英文 → 选一个词放进句子。圈出结果：I = 独立想起，H = 提示后想起，A = 看答案后重说。</div>
          {group.map((story, storyIndex) => (
            <section className="word-bank-story" key={story.id}>
              <div className="word-bank-story-title"><span>{pageIndex * 3 + storyIndex + 1}</span><div><h2>{story.title}</h2><p>{story.chineseTitle}</p></div></div>
              <div className="word-bank-grid">
                {Object.entries(story.vocabulary).map(([word, meaning]) => (
                  <div className="word-bank-item" key={word}>
                    <strong>{meaning}</strong>
                    <span className="word-bank-recall">{word[0].toUpperCase()} {"_".repeat(Math.max(3, word.length - 1))}</span>
                    <span>0天 I/H/A · 2天 I/H/A · 7天 I/H/A</span>
                  </div>
                ))}
              </div>
              <p className="word-bank-sentence"><strong>任选 2 个词说新句子：</strong>句型支架：{story.learningPack.patterns[0].template}　________________________</p>
              <div className="word-bank-answer"><strong>折线下方是答案 · 做完再看：</strong> {Object.keys(story.vocabulary).join(" · ")}</div>
            </section>
          ))}
          <footer>StoryStage 六课词句累计复习本 · {pageIndex + 1} / 4</footer>
        </article>
      ))}
      {patternPages.map((group, pageIndex) => (
        <article className="word-bank-page pattern-bank-page" key={`patterns-${pageIndex}`}>
          <header className="word-bank-header">
            <div><p className="eyebrow">StoryStage · 12 sentence patterns</p><h1>句型变身实验室</h1></div>
            <div className="word-bank-name">姓名：________　日期：________</div>
          </header>
          <div className="word-bank-method"><strong>例句不是背完就结束：</strong>先读原句，再换掉彩色词块，说出一个和自己生活有关的新句子；第 7 天完全遮住支架再说。I = 独立，H = 提示，A = 看答案。</div>
          <div className="pattern-bank-grid">
            {group.map(({ story, pattern }, index) => (
              <section className="pattern-bank-item" key={`${story.id}-${pattern.title}`}>
                <div className="pattern-bank-heading"><span>{pageIndex * 6 + index + 1}</span><div><small>{story.title}</small><h2>{pattern.title}</h2></div></div>
                <p className="pattern-bank-template">{pattern.template}</p>
                <p className="pattern-bank-notice">□ 圈人物/主语　□ 框动作词　□ 划出可替换词块</p>
                <p><strong>故事原句：</strong>{pattern.example}</p>
                <p><strong>换词盒：</strong>{pattern.substitutions.join(" / ")}</p>
                <p className="pattern-bank-tip"><strong>语法提醒：</strong>{pattern.grammarTip}</p>
                <p className="pattern-bank-write"><strong>我的新句：</strong>________________________________________________</p>
                <p className="pattern-bank-review">第 0 天 □ 看支架说　　第 2 天 □ 只看关键词　　第 7 天 □ 脱稿说　　家长：I / H / A</p>
              </section>
            ))}
          </div>
          <footer>StoryStage 六课词句累计复习本 · {pageIndex + 3} / 4</footer>
        </article>
      ))}
    </section>
  );
}
