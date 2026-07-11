"use client";

import { useState, useSyncExternalStore } from "react";

import { ChallengePanel } from "./components/ChallengePanel";
import { RoleAssignmentView } from "./components/RoleAssignment";
import { ScriptPlayer } from "./components/ScriptPlayer";
import { StoryLibrary } from "./components/StoryLibrary";
import { stories } from "./data/stories";
import { assignRoles } from "./lib/session";
import type { LocalPreferences, PlayerCount, RoleAssignment, Story } from "./types";

const preferenceKey = "storystage.preferences";
const subscribeToHydration = () => () => undefined;

function readPreferences(): LocalPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(preferenceKey);
    if (!stored) return null;
    const value = JSON.parse(stored) as Partial<LocalPreferences>;
    if (typeof value.storyId !== "string" || (value.playerCount !== 2 && value.playerCount !== 3) || typeof value.showHints !== "boolean") return null;
    return { storyId: value.storyId, playerCount: value.playerCount, showHints: value.showHints };
  } catch {
    return null;
  }
}

function writePreferences(preferences: LocalPreferences) {
  try {
    window.localStorage.setItem(preferenceKey, JSON.stringify(preferences));
  } catch {
    // The experience remains usable when storage is blocked or full.
  }
}

export default function Home() {
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const restoredPreferences = hydrated ? readPreferences() : null;
  const restoredStory = restoredPreferences ? stories.find(({ id }) => id === restoredPreferences.storyId) ?? null : null;
  const [ignoreRestoredSession, setIgnoreRestoredSession] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [started, setStarted] = useState<RoleAssignment[] | null>(null);
  const [playerCount, setPlayerCount] = useState<PlayerCount | null>(null);
  const [showHints, setShowHints] = useState<boolean | null>(null);
  const [challenge, setChallenge] = useState(false);
  const activeStory = selectedStory ?? (ignoreRestoredSession ? null : restoredStory);
  const activeAssignments = started ?? (ignoreRestoredSession || !restoredStory || !restoredPreferences ? null : assignRoles(restoredStory, restoredPreferences.playerCount));
  const activePlayerCount = playerCount ?? restoredPreferences?.playerCount ?? 2;
  const activeShowHints = showHints ?? restoredPreferences?.showHints ?? false;

  function startStory(assignments: RoleAssignment[]) {
    const count = assignments.length as PlayerCount;
    setPlayerCount(count);
    setStarted(assignments);
    setChallenge(false);
    if (activeStory) writePreferences({ storyId: activeStory.id, playerCount: count, showHints: activeShowHints });
  }

  function changeHints(nextShowHints: boolean) {
    setShowHints(nextShowHints);
    if (activeStory) writePreferences({ storyId: activeStory.id, playerCount: activePlayerCount, showHints: nextShowHints });
  }

  function chooseNewStory() {
    setChallenge(false);
    setIgnoreRestoredSession(true);
    setStarted(null);
    setSelectedStory(null);
  }

  if (activeStory && activeAssignments && challenge) {
    return <ChallengePanel questions={activeStory.challenges} onRestart={() => setChallenge(false)} onChooseStory={chooseNewStory} />;
  }

  if (activeStory && activeAssignments) {
    return <ScriptPlayer story={activeStory} assignments={activeAssignments} mode="rehearsal" showHints={activeShowHints} onShowHintsChange={changeHints} onComplete={() => setChallenge(true)} onExit={() => {
      setIgnoreRestoredSession(true);
      setSelectedStory(activeStory);
      setStarted(null);
    }} />;
  }

  if (activeStory) {
    return <RoleAssignmentView story={activeStory} onBack={() => {
      setIgnoreRestoredSession(true);
      setSelectedStory(null);
    }} onStart={startStory} />;
  }

  return <StoryLibrary stories={stories} onSelect={(story) => {
    setIgnoreRestoredSession(true);
    setSelectedStory(story);
  }} />;
}
