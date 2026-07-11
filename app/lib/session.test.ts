import { describe, expect, it } from "vitest";

import type { Story } from "../types";
import { assignRoles, parsePreferences } from "./session";

const story: Story = {
  id: "test-story",
  title: "Test Story",
  chineseTitle: "测试故事",
  category: "family",
  minutes: 10,
  level: "Elementary",
  vocabulary: {},
  roles: [
    { id: "child", name: "Child", emoji: "🧒", childFriendly: true },
    { id: "helper", name: "Helper", emoji: "🧑", childFriendly: false },
    { id: "friend", name: "Friend", emoji: "👩", childFriendly: true },
  ],
  lines: [],
  challenges: [],
};

describe("assignRoles", () => {
  it("assigns one role to each person in three-player mode", () => {
    expect(assignRoles(story, 3)).toEqual([
      { personId: "daughter", roleIds: ["child"] },
      { personId: "parent1", roleIds: ["helper"] },
      { personId: "parent2", roleIds: ["friend"] },
    ]);
  });

  it("assigns every supporting role to the parent in two-player mode", () => {
    expect(assignRoles(story, 2)).toEqual([
      { personId: "daughter", roleIds: ["child"] },
      { personId: "parent1", roleIds: ["helper", "friend"] },
    ]);
  });
});

describe("parsePreferences", () => {
  it("returns null for malformed JSON", () => {
    expect(parsePreferences("{not-json")).toBeNull();
  });

  it("accepts preferences only when every field has a valid type", () => {
    expect(
      parsePreferences(
        JSON.stringify({ storyId: "picnic", playerCount: 2, showHints: true }),
      ),
    ).toEqual({ storyId: "picnic", playerCount: 2, showHints: true });

    expect(
      parsePreferences(
        JSON.stringify({ storyId: "picnic", playerCount: 4, showHints: true }),
      ),
    ).toBeNull();
    expect(
      parsePreferences(
        JSON.stringify({ storyId: "picnic", playerCount: 2, showHints: "yes" }),
      ),
    ).toBeNull();
  });
});
