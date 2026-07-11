"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { RoleAssignment, Story } from "../types";
import { PrintScript } from "./PrintScript";

type ScriptPlayerProps = {
  story: Story;
  assignments: RoleAssignment[];
  mode: "rehearsal" | "performance";
  showHints: boolean;
  onComplete: () => void;
  onExit: () => void;
  onShowHintsChange?: (showHints: boolean) => void;
};

const personNames: Record<RoleAssignment["personId"], string> = {
  daughter: "女儿",
  parent1: "家长 1",
  parent2: "家长 2",
};

export function ScriptPlayer({ story, assignments, mode: initialMode, showHints: initialShowHints, onComplete, onExit, onShowHintsChange }: ScriptPlayerProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [mode, setMode] = useState(initialMode);
  const [showHints, setShowHints] = useState(initialShowHints);
  const [showPrintPanel, setShowPrintPanel] = useState(false);
  const [showPerformanceHint, setShowPerformanceHint] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const line = story.lines[lineIndex];
  const role = story.roles.find(({ id }) => id === line.roleId)!;
  const assignment = assignments.find(({ roleIds }) => roleIds.includes(line.roleId));
  const lastLineIndex = story.lines.length - 1;
  const lineVocabulary = (line.vocabulary ?? []).flatMap((word) => story.vocabulary[word] ? [{ word, definition: story.vocabulary[word] }] : []);
  const helpIsVisible = mode === "rehearsal" ? showHints : showPerformanceHint;

  const moveLine = useCallback((direction: -1 | 1) => {
    setShowPerformanceHint(false);
    setLineIndex((current) => Math.max(0, Math.min(lastLineIndex, current + direction)));
  }, [lastLineIndex]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") moveLine(-1);
      if (event.key === "ArrowRight") moveLine(1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveLine]);

  function toggleHints() {
    const next = !showHints;
    setShowHints(next);
    onShowHintsChange?.(next);
  }

  function finishSwipe(clientX: number, clientY: number) {
    if (!pointerStart.current) return;
    const deltaX = clientX - pointerStart.current.x;
    const deltaY = clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    moveLine(deltaX < 0 ? 1 : -1);
  }

  return (
    <main className={`player-shell player-shell--${mode}`}>
      <header className="site-header player-header">
        <button className="back-button" type="button" onClick={onExit} aria-label="退出故事">← 退出</button>
        <span className="brand"><span aria-hidden="true">✦</span> StoryStage</span>
        <span className="player-mode-label">{mode === "rehearsal" ? "排练模式" : "演出模式"}</span>
      </header>

      <section className="script-stage" aria-label="台词舞台" aria-live="polite"
        onPointerDown={(event) => { pointerStart.current = { x: event.clientX, y: event.clientY }; }}
        onPointerCancel={() => { pointerStart.current = null; }}
        onPointerUp={(event) => finishSwipe(event.clientX, event.clientY)}>
        <div className="script-meta">
          <p className="eyebrow">{role.name} · {assignment ? personNames[assignment.personId] : "待分配"}</p>
          <p className="line-progress">{lineIndex + 1} / {story.lines.length}</p>
        </div>
        <div className="progress-track" aria-label={`故事进度 ${lineIndex + 1} / ${story.lines.length}`}><span style={{ width: `${((lineIndex + 1) / story.lines.length) * 100}%` }} /></div>
        <div className="speaker-mark" aria-hidden="true">{role.emoji}</div>
        <h1>{line.english}</h1>
        {helpIsVisible ? <p className="chinese-hint">{line.chinese}</p> : null}
        {helpIsVisible && line.pronunciation ? <p className="pronunciation-aid">发音提示：{line.pronunciation}</p> : null}
        {helpIsVisible && lineVocabulary.length > 0 ? (
          <section className="vocabulary-aid" aria-label="重点词汇">
            {lineVocabulary.map(({ word, definition }) => <p key={word}><strong>{word}</strong><span>{definition}</span></p>)}
          </section>
        ) : null}
        {line.stageDirection ? <p className="stage-direction">({line.stageDirection})</p> : null}
      </section>

      <section className="player-settings" aria-label="演出设置">
        {mode === "rehearsal" ? <button type="button" aria-pressed={showHints} onClick={toggleHints}>{showHints ? "隐藏中文提示" : "显示中文提示"}</button> :
          <button type="button" aria-pressed={showPerformanceHint} onClick={() => setShowPerformanceHint((current) => !current)}>{showPerformanceHint ? "隐藏本句提示" : "查看本句提示"}</button>}
        <button type="button" onClick={() => { setShowPerformanceHint(false); setMode((current) => current === "rehearsal" ? "performance" : "rehearsal"); }}>
          {mode === "rehearsal" ? "切换到演出模式" : "切换到排练模式"}
        </button>
      </section>

      <nav className="script-navigation" aria-label="台词导航">
        <button type="button" onClick={() => moveLine(-1)} disabled={lineIndex === 0}>上一句</button>
        <button className="primary-control" type="button" onClick={lineIndex === lastLineIndex ? onComplete : () => moveLine(1)}>
          {lineIndex === lastLineIndex ? "完成故事" : "下一句"}
        </button>
      </nav>
      <section className="print-launch">
        <button type="button" onClick={() => setShowPrintPanel((current) => !current)} aria-expanded={showPrintPanel}>
          {showPrintPanel ? "收起打印剧本" : "准备打印剧本"}
        </button>
      </section>
      {showPrintPanel ? <PrintScript story={story} assignments={assignments} /> : null}
    </main>
  );
}
