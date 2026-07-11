"use client";

import { useState } from "react";

import type { ChallengeQuestion } from "../types";

type ChallengePanelProps = {
  questions: ChallengeQuestion[];
  onRestart: () => void;
  onChooseStory: () => void;
};

export function ChallengePanel({ questions, onRestart, onChooseStory }: ChallengePanelProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);

  if (complete) {
    return (
      <main className="challenge-shell challenge-complete">
        <p className="eyebrow">Story complete</p>
        <h1>今晚的故事演完啦！</h1>
        <p>谢谢每一位演员。再来一遍，或者挑一个新故事吧。</p>
        <div className="completion-actions">
          <button className="primary-control" type="button" onClick={onRestart}>再演一次</button>
          <button type="button" onClick={onChooseStory}>选择新故事</button>
        </div>
      </main>
    );
  }

  const question = questions[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;
  return (
    <main className="challenge-shell">
      <header className="challenge-heading">
        <div><p className="eyebrow">After-show challenge</p><h1>故事小挑战</h1></div>
        <p className="line-progress">{questionIndex + 1} / {questions.length}</p>
      </header>
      <section className="question-card" aria-live="polite">
        <h2>{question.prompt}</h2>
        <div className="answer-grid">
          {question.options.map((option, index) => (
            <button
              className={selectedAnswer === index ? "answer-selected" : ""}
              disabled={selectedAnswer !== null}
              key={option}
              onClick={() => setSelectedAnswer(index)}
              type="button"
            >
              <span aria-hidden="true">{String.fromCharCode(65 + index)}</span>{option}
            </button>
          ))}
        </div>
        {selectedAnswer !== null ? (
          <div className="encouragement">
            <p>{question.encouragement}</p>
            <button
              className="primary-control"
              type="button"
              onClick={() => {
                if (isLastQuestion) setComplete(true);
                else {
                  setQuestionIndex((current) => current + 1);
                  setSelectedAnswer(null);
                }
              }}
            >{isLastQuestion ? "查看完成页" : "下一题"}</button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
