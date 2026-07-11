export type PlayerCount = 2 | 3;
export type StoryCategory = "family" | "school" | "fantasy";
export type StoryRole = { id: string; name: string; emoji: string; childFriendly: boolean };
export type ScriptLine = { roleId: string; english: string; chinese: string; vocabulary?: string[]; stageDirection?: string };
export type ChallengeQuestion = { prompt: string; options: string[]; answerIndex: number; encouragement: string };
export type Story = {
  id: string; title: string; chineseTitle: string; category: StoryCategory;
  minutes: number; level: "Elementary"; vocabulary: Record<string, string>;
  roles: StoryRole[]; lines: ScriptLine[]; challenges: ChallengeQuestion[];
};
export type RoleAssignment = { personId: "daughter" | "parent1" | "parent2"; roleIds: string[] };
export type LocalPreferences = { storyId: string; playerCount: PlayerCount; showHints: boolean };
