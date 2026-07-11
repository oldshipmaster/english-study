"use client";

import { useState } from "react";

import type { RoleAssignment, Story } from "../types";
import { LEARNING_PACK_PAGE_COUNT, LearningPackPrint } from "./LearningPackPrint";

type PrintScriptProps = {
  story: Story;
  assignments: RoleAssignment[];
  selectedPersonId?: RoleAssignment["personId"];
};

const personNames: Record<RoleAssignment["personId"], string> = {
  daughter: "女儿",
  parent1: "家长 1",
  parent2: "家长 2",
};

export function PrintScript({ story, assignments, selectedPersonId }: PrintScriptProps) {
  const [printMode, setPrintMode] = useState<"learning-pack" | "script">(selectedPersonId ? "script" : "learning-pack");
  const [selectedPerson, setSelectedPerson] = useState<RoleAssignment["personId"] | null>(selectedPersonId ?? null);
  const focusRoleIds = selectedPerson ? assignments.find(({ personId }) => personId === selectedPerson)?.roleIds ?? [] : [];
  const focusLineCount = story.lines.filter(({ roleId }) => focusRoleIds.includes(roleId)).length;
  const printLabel = printMode === "learning-pack" ? "彩色故事学习包" : selectedPerson ? `${personNames[selectedPerson]}的角色剧本` : "完整家庭剧本";
  const scenes = Array.from({ length: Math.ceil(story.lines.length / 6) }, (_, index) => story.lines.slice(index * 6, index * 6 + 6));
  const [printError, setPrintError] = useState(false);

  function printScript() {
    setPrintError(false);
    try {
      if (typeof window.print !== "function") throw new Error("Printing unavailable");
      window.print();
    } catch {
      setPrintError(true);
    }
  }

  return (
    <section className="print-panel">
      <div className="print-controls">
        <div>
          <p className="eyebrow">带到纸上</p>
          <h2>打印家庭学习材料</h2>
          <p>推荐彩色学习包，也可打印完整或角色剧本。</p>
        </div>
        <div className="print-choice-list" aria-label="选择打印版本">
          <button type="button" aria-pressed={printMode === "learning-pack"} onClick={() => setPrintMode("learning-pack")}>选择彩色故事学习包</button>
          <button type="button" aria-pressed={printMode === "script" && selectedPerson === null} onClick={() => { setPrintMode("script"); setSelectedPerson(null); }}>选择完整家庭剧本</button>
          {assignments.map(({ personId }) => (
            <button key={personId} type="button" aria-pressed={printMode === "script" && selectedPerson === personId} onClick={() => { setPrintMode("script"); setSelectedPerson(personId); }}>
              选择{personNames[personId]}的剧本
            </button>
          ))}
        </div>
        <button className="print-action primary-control" type="button" onClick={printScript}>打印{printLabel}</button>
        <div className="print-settings-note"><strong>A4 · 彩色 · 100% 缩放 · 开启背景图形</strong><span>{printMode === "learning-pack" ? `完整学习包共 ${LEARNING_PACK_PAGE_COUNT} 页；打印词卡时关闭双面打印。` : selectedPerson ? "角色剧本保留全部 18 句，只重点标出所选角色。" : "完整家庭剧本保留全部 18 句和故事上下文。"}</span></div>
        {printMode === "learning-pack" ? <details className="pack-page-guide"><summary>{LEARNING_PACK_PAGE_COUNT} 页怎么用？打印一次，7 天复用</summary><div><span>第 1–2 页：任务路线、8 个本课词和生词救援</span><span>第 3–5 页：三场彩色完整剧本，不在场景中间跨页</span><span>第 6–9 页：女儿台词、句型、拼图和语法侦探</span><span>第 10–12 页：开口挑战、复述和家庭聊天</span><span>第 13–14 页：可折叠词卡与句型卡</span><span>第 15–16 页：间隔复习与跨故事旧词</span><span>第 17 页：家长答案和第 0/2/7 天记录</span></div></details> : null}
        {printError ? <p className="print-fallback" role="alert">无法自动打开打印窗口，请使用浏览器菜单中的“打印”。</p> : null}
      </div>

      {printMode === "learning-pack" ? <LearningPackPrint story={story} assignments={assignments} /> : <article className="print-sheet" role="region" aria-label={printLabel}>
        <header className="print-title">
          <p className="eyebrow">StoryStage · {printLabel}</p>
          <h1>{story.title}</h1>
          <p>{story.chineseTitle} · {story.minutes} 分钟{selectedPerson ? ` · 我的台词 ${focusLineCount} 句` : ""}</p>
        </header>
        {selectedPerson ? <p className="focus-legend">★ 粗框和下划线是我的台词；其他台词完整保留，用来听提示、接下一句和理解故事。</p> : null}
        <section className="print-cast" aria-label="演员表">
          <h2>演员表</h2>
          <ul>{story.roles.map((role) => {
            const owner = assignments.find(({ roleIds }) => roleIds.includes(role.id));
            return <li key={role.id}><span aria-hidden="true">{role.emoji}</span> <strong>{role.name}</strong> — {owner ? personNames[owner.personId] : "待分配"}</li>;
          })}</ul>
        </section>
        <div className="print-scenes">
          {scenes.map((lines, sceneIndex) => (
            <section className="print-scene" key={sceneIndex} aria-label={`第 ${sceneIndex + 1} 场`}>
              <h2>Scene {sceneIndex + 1}</h2>
              {lines.map((line, lineIndex) => {
                const role = story.roles.find(({ id }) => id === line.roleId)!;
                const isFocusLine = selectedPerson !== null && focusRoleIds.includes(line.roleId);
                const globalLineIndex = sceneIndex * 6 + lineIndex;
                const previousFocusLine = story.lines.slice(0, globalLineIndex).findLast(({ roleId }) => focusRoleIds.includes(roleId));
                const isRoleSwitch = isFocusLine && focusRoleIds.length > 1 && previousFocusLine !== undefined && previousFocusLine.roleId !== line.roleId;
                return (
                  <div className={`print-line${isFocusLine ? " is-focus-line" : ""}`} key={`${sceneIndex}-${lineIndex}`}>
                    <p className="print-speaker"><b className="print-line-number">#{globalLineIndex + 1}</b><span aria-hidden="true">{role.emoji}</span> {role.name}{isFocusLine ? " · 我的台词" : ""}{isRoleSwitch ? <span className="role-switch">↻ 换角色</span> : null}</p>
                    {line.stageDirection ? <p className="print-direction">提示：{line.stageDirection}</p> : null}
                    <p className="print-english">{line.english}</p>
                    {line.pronunciation ? <p className="print-pronunciation">发音：{line.pronunciation}</p> : null}
                    <p className="print-chinese">{line.chinese}</p>
                  </div>
                );
              })}
              {selectedPerson ? <div className="role-rehearsal-check"><strong>本场三遍排练 · 先给自己的每句圈 1–3 个关键词</strong><span>□ 看完整台词</span><span>□ 只看圈词</span><span>□ 不看稿</span><em>先听到上一句再开口</em></div> : null}
            </section>
          ))}
        </div>
        <section className="print-vocabulary" aria-label="故事词汇">
          <h2>故事词汇</h2>
          <dl>{Object.entries(story.vocabulary).map(([word, meaning]) => <div key={word}><dt>{word}</dt><dd>{meaning}</dd></div>)}</dl>
        </section>
        {selectedPerson ? <section className="role-performance-note"><strong>演后 30 秒 · 两颗星 + 一个愿望</strong><p>我的自评：□ 听到提示再开口　□ 声音清楚　□ 说错能从句首重来</p><p>家长：⭐ __________________　⭐ __________________　🌱 下次试试 __________________</p></section> : null}
        <footer className="print-footer">StoryStage 家庭英语剧场 · 一起读，一起演。</footer>
      </article>}
    </section>
  );
}
