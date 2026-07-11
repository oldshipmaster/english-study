"use client";

import { useState } from "react";

import { assignRoles } from "../lib/session";
import type { PlayerCount, RoleAssignment, Story } from "../types";

type RoleAssignmentViewProps = {
  story: Story;
  onBack: () => void;
  onStart: (assignments: RoleAssignment[]) => void;
};

const people = {
  daughter: { name: "女儿", note: "小小主角", emoji: "👧" },
  parent1: { name: "家长 1", note: "一起入戏", emoji: "🧑" },
  parent2: { name: "家长 2", note: "加入演出", emoji: "👨" },
} as const;

function swapRoleOwners(
  story: Story,
  assignments: RoleAssignment[],
  roleId: string,
  nextPersonId: RoleAssignment["personId"],
): RoleAssignment[] | null {
  const currentOwner = assignments.find((assignment) => assignment.roleIds.includes(roleId));
  const nextOwner = assignments.find((assignment) => assignment.personId === nextPersonId);
  if (!currentOwner || !nextOwner || currentOwner.personId === nextPersonId) return assignments;

  const roleToSwap = nextOwner.roleIds[0];
  if (!roleToSwap) return null;

  const candidate = assignments.map((assignment) => {
    if (assignment.personId === currentOwner.personId) {
      return { ...assignment, roleIds: assignment.roleIds.map((id) => id === roleId ? roleToSwap : id) };
    }
    if (assignment.personId === nextOwner.personId) {
      return { ...assignment, roleIds: assignment.roleIds.map((id) => id === roleToSwap ? roleId : id) };
    }
    return assignment;
  });
  const coveredRoleIds = candidate.flatMap((assignment) => assignment.roleIds);
  const daughter = candidate.find((assignment) => assignment.personId === "daughter");
  const parent1 = candidate.find((assignment) => assignment.personId === "parent1");
  const isThreePlayerCast = candidate.length === 3 && candidate.every((assignment) => assignment.roleIds.length === 1);
  const daughterRole = story.roles.find((role) => role.id === daughter?.roleIds[0]);
  const isTwoPlayerCast = candidate.length === 2
    && daughter?.roleIds.length === 1
    && daughterRole?.childFriendly === true
    && parent1?.roleIds.length === 2;
  const hasEveryRoleOnce = coveredRoleIds.length === story.roles.length
    && new Set(coveredRoleIds).size === story.roles.length;

  return hasEveryRoleOnce && (isThreePlayerCast || isTwoPlayerCast) ? candidate : null;
}

export function RoleAssignmentView({ story, onBack, onStart }: RoleAssignmentViewProps) {
  const [playerCount, setPlayerCount] = useState<PlayerCount>(2);
  const [assignments, setAssignments] = useState<RoleAssignment[]>(() => assignRoles(story, 2));

  function choosePlayerCount(count: PlayerCount) {
    setPlayerCount(count);
    setAssignments(assignRoles(story, count));
  }

  function changeRoleOwner(roleId: string, personId: RoleAssignment["personId"]) {
    setAssignments((current) => swapRoleOwners(story, current, roleId, personId) ?? current);
  }

  return (
    <main className="assignment-shell">
      <header className="site-header assignment-header">
        <button className="back-button" onClick={onBack} type="button">← 返回故事</button>
        <span className="brand"><span aria-hidden="true">✦</span> StoryStage</span>
      </header>

      <section className="assignment-intro">
        <p className="eyebrow">Cast your family</p>
        <h1>分配角色</h1>
        <p><strong>{story.title}</strong> · {story.chineseTitle}</p>
      </section>

      <section className="player-choice" aria-labelledby="player-choice-title">
        <div><h2 id="player-choice-title">今晚有几位演员？</h2><p>每个角色都会有人演。</p></div>
        <div className="segmented" aria-label="演员人数">
          {([2, 3] as const).map((count) => (
            <button aria-pressed={playerCount === count} key={count} onClick={() => choosePlayerCount(count)} type="button">{count} 人</button>
          ))}
        </div>
      </section>

      <section className={`people-grid people-grid--${playerCount}`} aria-label="家庭角色分配">
        {assignments.map((assignment) => {
          const person = people[assignment.personId];
          return (
            <article className="person-card" key={assignment.personId}>
              <div className="person-heading"><span className="person-emoji" aria-hidden="true">{person.emoji}</span><div><h2>{person.name}</h2><p>{person.note}</p></div></div>
              <div className="role-list">
                {assignment.roleIds.map((roleId, index) => {
                  const role = story.roles.find((item) => item.id === roleId)!;
                  return <div className="role-chip" key={role.id}><span aria-hidden="true">{role.emoji}</span><span><strong>{role.name}</strong>{playerCount === 2 && assignment.personId === "parent1" && index === 1 ? <small>兼演</small> : null}</span></div>;
                })}
              </div>
            </article>
          );
        })}
      </section>

      <section className="role-controls" aria-labelledby="adjust-title">
        <div><h2 id="adjust-title">想换角色？</h2><p>为每个故事角色选择演员，角色不会落空。</p></div>
        <div className="role-selects">
          {story.roles.map((role) => {
            const owner = assignments.find((assignment) => assignment.roleIds.includes(role.id))!;
            return (
              <label key={role.id}><span>{role.emoji} {role.name}</span><select value={owner.personId} onChange={(event) => changeRoleOwner(role.id, event.target.value as RoleAssignment["personId"])}>
                {assignments.map((assignment) => (
                  <option
                    disabled={swapRoleOwners(story, assignments, role.id, assignment.personId) === null}
                    value={assignment.personId}
                    key={assignment.personId}
                  >{people[assignment.personId].name}</option>
                ))}
              </select></label>
            );
          })}
        </div>
      </section>

      <footer className="start-bar"><p>全员就位，故事马上开始。</p><button className="start-button" onClick={() => onStart(assignments)} type="button">开始演出 <span aria-hidden="true">→</span></button></footer>
    </main>
  );
}
