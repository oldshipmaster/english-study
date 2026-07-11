export type PlayerCount = 2 | 3;
export type StoryCategory = "family" | "school" | "fantasy";
export type StoryRole = { id: string; name: string; emoji: string; childFriendly: boolean };
export type ScriptLine = { roleId: string; english: string; chinese: string; vocabulary?: string[]; pronunciation?: string; stageDirection?: string };
export type ChallengeQuestion = { prompt: string; options: string[]; answerIndex: number; encouragement: string };
export type LearningWord = { word: string; meaning: string; pronunciation: string; review: boolean; example: string; sourceStory?: string };
export type SentencePattern = { title: string; purpose: string; example: string; template: string; substitutions: string[]; grammarTip: string; tasks: string[] };
export type SpeakingChallenge = { prompt: string; hint: string };
export type LearningPack = { words: LearningWord[]; reviewWords: LearningWord[]; patterns: SentencePattern[]; speakingChallenges: SpeakingChallenge[]; parentPrompts: string[] };
export type Story = {
  id: string; title: string; chineseTitle: string; category: StoryCategory;
  minutes: number; level: "Elementary"; vocabulary: Record<string, string>;
  roles: StoryRole[]; lines: ScriptLine[]; challenges: ChallengeQuestion[]; learningPack: LearningPack;
};
export type RoleAssignment = { personId: "daughter" | "parent1" | "parent2"; roleIds: string[] };
export type LocalPreferences = { storyId: string; playerCount: PlayerCount; showHints: boolean; assignments?: RoleAssignment[] };
