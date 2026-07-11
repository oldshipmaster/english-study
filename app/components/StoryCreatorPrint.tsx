const sceneNames = ["开场 · 人物和地点", "问题 · 尝试和合作", "结局 · 解决和庆祝"];
const starterFrames = ["There is...", "I can...", "Let us...", "I will...", "We must...", "...is too...for...", "I... and...", "I... because..."];

export function StoryCreatorPrint() {
  return (
    <section className="creator-print" role="region" aria-label="家庭原创剧本工坊">
      <article className="creator-page">
        <header className="creator-header"><div><p className="eyebrow">StoryStage · Graduation project</p><h1>家庭原创剧本工坊</h1></div><p>小编剧：________　日期：________</p></header>
        <div className="creator-rule"><strong>毕业任务：</strong>从六课材料里挑词和句型，但故事必须是你自己的。先说想法，再写；写完一定要全家演出来。</div>
        <section className="creator-plan"><h2>1 · 我的故事地图</h2><div className="creator-plan-grid"><p><strong>英文标题</strong>________________________________</p><p><strong>故事地点</strong>________________________________</p><p><strong>发生的问题</strong>____________________________</p><p><strong>怎样解决</strong>________________________________</p><p><strong>最后结局</strong>________________________________</p><p><strong>想表达的心情</strong>____________________________</p></div></section>
        <section className="creator-cast"><h2>2 · 2–3 人分角色</h2>{["女儿", "家长 1", "家长 2（可选；2 人时由家长 1 兼演）"].map((person, index) => <div key={person}><strong>{index + 1}. {person}</strong><span>英文角色名：____________</span><span>人物特点 / 动作：____________________</span></div>)}</section>
        <section><h2>3 · 我主动选择的 8 个词</h2><p className="creator-help">优先选仍在红色或黄色盒里的词；至少 2 个动作词，至少 1 个来自我的生词救援站。</p><div className="creator-word-grid">{Array.from({ length: 8 }, (_, index) => <div className="creator-word-row" key={index}><b>{index + 1}</b><span>英文：__________</span><span>意思：________</span><span>词性：______</span><span>我要放在第 __ 句</span></div>)}</div></section>
        <section><h2>4 · 我选择的 2 个句型</h2>{Array.from({ length: 2 }, (_, index) => <div className="creator-pattern-row" key={index}><strong>句型 {index + 1}</strong><span>句型骨架：________________________________________</span><span>我的新句：________________________________________</span></div>)}</section>
        <section className="creator-starter-bank"><h2>卡住 30 秒再看 · 句型求助条</h2><p>只选一个开头，把人物、动作、地点或物品换成自己故事里的内容。</p><div>{starterFrames.map((frame) => <span className="creator-starter" key={frame}>{frame}</span>)}</div></section>
        <footer>StoryStage 家庭原创剧本工坊 · 1 / 4</footer>
      </article>
      {sceneNames.map((sceneName, sceneIndex) => (
        <article className="creator-page creator-scene-page" key={sceneName}>
          <header className="creator-scene-header"><div><p className="eyebrow">My family story</p><h1>Scene {sceneIndex + 1}</h1><p>{sceneName}</p></div><div><span>地点：____________</span><span>道具：____________</span><span>本场目标：________________</span></div></header>
          <div className="creator-scene-guide">每句先大声说一遍，再写下来。至少写 1 个动作提示；用圆圈标重点词，用下划线标本课句型。</div>
          {Array.from({ length: 6 }, (_, lineIndex) => {
            const number = sceneIndex * 6 + lineIndex + 1;
            return <div className="creator-line" key={number}><b className="creator-line-number">#{number}</b><div><p>角色：____________　动作 / 表情：________________________________________</p><p><strong>English:</strong> ________________________________________________________</p><p className="creator-grammar-check">中文意思 / 关键词：________________________　自检 □ 谁 / 人称　□ 时间词　□ 动词形式</p></div></div>;
          })}
          {sceneIndex === 2 ? <section className="creator-performance"><h2>写完就演：两遍毕业演出</h2><div><p><strong>第 0 天首演 · 可看稿</strong>　□ 18 句完整　□ 8 个词都用到　□ 2 个句型都用到　□ 每场有 and / because</p><p><strong>第 7 天重演 · 只看关键词</strong>　□ 声音清楚　□ 有动作　□ 说错能重来</p></div><p>原创词句还能独立说出：8 个词 __/8　2 个句型 __/2　家长：I / H / A</p><p>孩子最满意的一句：____________　家长两颗星：________ / ________　一个愿望：________</p><div className="creator-curtain-call"><strong>谢幕问答 · 我先回答，再反问家长</strong><p>家长用 Who / Where / Why 问：________________________________________</p><p>我的回答：________________________　我反问家长：________________________</p></div></section> : <div className="creator-scene-check">□ 6 句写完　□ 连续演一遍　□ 圈出本场用到的词　□ 检查关键语法形式　□ 每场至少 1 句用 and / because</div>}
          <footer>StoryStage 家庭原创剧本工坊 · {sceneIndex + 2} / 4</footer>
        </article>
      ))}
    </section>
  );
}
