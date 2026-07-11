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
          <footer>StoryStage 六课词句累计复习本 · {pageIndex + 1} / 6</footer>
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
          <footer>StoryStage 六课词句累计复习本 · {pageIndex + 3} / 6</footer>
        </article>
      ))}
      <article className="word-bank-page pattern-error-page">
        <header className="word-bank-header"><div><p className="eyebrow">StoryStage · My grammar repairs</p><h1>我的语法错题本</h1></div><div className="word-bank-name">姓名：________　日期：________</div></header>
        <div className="word-bank-method"><strong>只记自己真正说错或写错的句子：</strong>先保留原句，再改正并写出规则；隔一天和隔一周遮住答案重说。I = 独立，H = 提示，A = 看答案。</div>
        <div className="pattern-error-types">我常见的错误：□ 动作词形式　□ be 动词　□ 词序　□ 介词　□ 单复数　□ 句末标点</div>
        <section className="pattern-error-log"><h2>说错不是失败，是下一次能自己改正的线索</h2>{Array.from({ length: 6 }, (_, index) => <div className="pattern-error-row" key={index}><b>{index + 1}</b><div><p>我原来说 / 写：____________________________________________________________</p><p>改正后：__________________________________________________________________</p><p>我发现的规则：________________________________　第 2 天 I/H/A　　第 7 天 I/H/A</p></div></div>)}</section>
        <div className="pattern-error-finish"><strong>最后检查</strong><p>从上面选 2 句，换一个人物、动作、地点或物品，再说新句。</p><p>新句 1：________________________________________________　□ 不看提示</p><p>新句 2：________________________________________________　□ 不看提示</p></div>
        <footer>StoryStage 六课词句累计复习本 · 5 / 6</footer>
      </article>
      <article className="word-bank-page personal-word-page">
        <header className="word-bank-header"><div><p className="eyebrow">StoryStage · Words I chose</p><h1>我的生词收藏册</h1></div><div className="word-bank-name">姓名：________　开始日期：________</div></header>
        <div className="word-bank-method"><strong>先猜，再查，再用：</strong>遇到想学的词先根据故事猜意思，再用可靠词典核对；写一个自己的记忆钩子，并在当天、第 2 天、第 7 天遮住答案说出来。</div>
        <div className="personal-word-legend"><strong>收词标准：</strong>□ 我真的遇到过　□ 我想在生活里说　□ 我能写自己的句子　　I = 独立　H = 提示　A = 看答案</div>
        <section className="personal-word-log" aria-label="12 个自选生词">
          {Array.from({ length: 12 }, (_, index) => <div className="personal-word-row" key={index}><b>{index + 1}</b><div><p><strong>Word</strong> __________　意思 ________　我在哪里遇到它 ____________________</p><p>我的记忆钩子 __________________　我的句子 ______________________________</p></div><span>0天 I/H/A<br />2天 I/H/A<br />7天 I/H/A</span></div>)}
        </section>
        <div className="personal-word-finish"><strong>本页毕业挑战：</strong>任选 3 个词，不看答案讲一个 3 句小故事。　□ 完成　家长听到的词：________ / ________ / ________</div>
        <footer>StoryStage 六课词句累计复习本 · 6 / 6</footer>
      </article>
    </section>
  );
}
