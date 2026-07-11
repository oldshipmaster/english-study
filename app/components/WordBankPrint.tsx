import type { Story } from "../types";

type WordBankPrintProps = {
  stories: Story[];
};

export function WordBankPrint({ stories }: WordBankPrintProps) {
  const pageStories = [stories.slice(0, 3), stories.slice(3, 6)];

  return (
    <section className="word-bank-print" role="region" aria-label="六课累计词汇本">
      {pageStories.map((group, pageIndex) => (
        <article className="word-bank-page" key={pageIndex}>
          <header className="word-bank-header">
            <div><p className="eyebrow">StoryStage · 48-word challenge</p><h1>六课累计词汇本</h1></div>
            <div className="word-bank-name">姓名：________　日期：________</div>
          </header>
          <div className="word-bank-method"><strong>先遮答案，再主动想：</strong>看中文 → 说英文 → 写英文 → 选一个词放进句子。不会时先看首字母，不要立刻翻答案。</div>
          {group.map((story, storyIndex) => (
            <section className="word-bank-story" key={story.id}>
              <div className="word-bank-story-title"><span>{pageIndex * 3 + storyIndex + 1}</span><div><h2>{story.title}</h2><p>{story.chineseTitle}</p></div></div>
              <div className="word-bank-grid">
                {Object.entries(story.vocabulary).map(([word, meaning]) => (
                  <div className="word-bank-item" key={word}>
                    <strong>{meaning}</strong>
                    <span className="word-bank-recall">{word[0].toUpperCase()} {"_".repeat(Math.max(3, word.length - 1))}</span>
                    <span>第 0 天 □　第 2 天 □　第 7 天 □</span>
                  </div>
                ))}
              </div>
              <p className="word-bank-sentence"><strong>任选 2 个词说新句子：</strong>________________________________________________________</p>
              <div className="word-bank-answer"><strong>折线下方是答案 · 做完再看：</strong> {Object.keys(story.vocabulary).join(" · ")}</div>
            </section>
          ))}
          <footer>StoryStage 六课累计词汇本 · {pageIndex + 1} / 2</footer>
        </article>
      ))}
    </section>
  );
}
