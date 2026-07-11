"use client";

import { useState } from "react";

import type { RoleAssignment, Story } from "../types";
import { LearningPackPrint } from "./LearningPackPrint";

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
        <div className="print-settings-note"><strong>A4 · 彩色 · 100% 缩放 · 开启背景图形</strong><span>完整学习包共 15 页；打印词卡时关闭双面打印。</span></div>
        {printError ? <p className="print-fallback" role="alert">无法自动打开打印窗口，请使用浏览器菜单中的“打印”。</p> : null}
      </div>

      {printMode === "learning-pack" ? <LearningPackPrint story={story} assignments={assignments} /> : <article className="print-sheet" role="region" aria-label={printLabel}>
        <header className="print-title">
          <p className="eyebrow">StoryStage · {printLabel}</p>
          <h1>{story.title}</h1>
          <p>{story.chineseTitle} · {story.minutes} 分钟</p>
        </header>
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
                return (
                  <div className={`print-line${isFocusLine ? " is-focus-line" : ""}`} key={`${sceneIndex}-${lineIndex}`}>
                    <p className="print-speaker"><span aria-hidden="true">{role.emoji}</span> {role.name}{isFocusLine ? " · 我的台词" : ""}</p>
                    {line.stageDirection ? <p className="print-direction">提示：{line.stageDirection}</p> : null}
                    <p className="print-english">{line.english}</p>
                    {line.pronunciation ? <p className="print-pronunciation">发音：{line.pronunciation}</p> : null}
                    <p className="print-chinese">{line.chinese}</p>
                  </div>
                );
              })}
            </section>
          ))}
        </div>
        <section className="print-vocabulary" aria-label="故事词汇">
          <h2>故事词汇</h2>
          <dl>{Object.entries(story.vocabulary).map(([word, meaning]) => <div key={word}><dt>{word}</dt><dd>{meaning}</dd></div>)}</dl>
        </section>
        <footer className="print-footer">StoryStage 家庭英语剧场 · 一起读，一起演。</footer>
      </article>}
    </section>
  );
}
