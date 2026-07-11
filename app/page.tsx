"use client";

import { useState } from "react";

import { RoleAssignmentView } from "./components/RoleAssignment";
import { StoryLibrary } from "./components/StoryLibrary";
import { stories } from "./data/stories";
import type { RoleAssignment, Story } from "./types";

export default function Home() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [started, setStarted] = useState<RoleAssignment[] | null>(null);

  if (selectedStory && started) {
    return <main className="ready-screen"><p className="eyebrow">Ready to play</p><h1>演员就位！</h1><p>{selectedStory.title} 即将开演。</p><button type="button" onClick={() => setStarted(null)}>返回角色分配</button></main>;
  }

  if (selectedStory) {
    return <RoleAssignmentView story={selectedStory} onBack={() => setSelectedStory(null)} onStart={setStarted} />;
  }

  return <StoryLibrary stories={stories} onSelect={setSelectedStory} />;
}
