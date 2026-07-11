import type { LocalPreferences, PlayerCount, RoleAssignment, Story } from "../types";

export function assignRoles(story: Story, playerCount: PlayerCount): RoleAssignment[] {
  const childRole = story.roles.find((role) => role.childFriendly) ?? story.roles[0];
  const remainingRoles = story.roles.filter((role) => role.id !== childRole?.id);

  if (playerCount === 2) {
    return [
      { personId: "daughter", roleIds: childRole ? [childRole.id] : [] },
      { personId: "parent1", roleIds: remainingRoles.map((role) => role.id) },
    ];
  }

  return [
    { personId: "daughter", roleIds: childRole ? [childRole.id] : [] },
    { personId: "parent1", roleIds: remainingRoles[0] ? [remainingRoles[0].id] : [] },
    { personId: "parent2", roleIds: remainingRoles[1] ? [remainingRoles[1].id] : [] },
  ];
}

export function parsePreferences(raw: string | null): LocalPreferences | null {
  if (raw === null) return null;

  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return null;
    const candidate = value as Record<string, unknown>;
    if (
      typeof candidate.storyId !== "string" ||
      (candidate.playerCount !== 2 && candidate.playerCount !== 3) ||
      typeof candidate.showHints !== "boolean"
    ) return null;

    return {
      storyId: candidate.storyId,
      playerCount: candidate.playerCount,
      showHints: candidate.showHints,
    };
  } catch {
    return null;
  }
}
