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

    const assignments = Array.isArray(candidate.assignments) && candidate.assignments.every((assignment) => {
      if (typeof assignment !== "object" || assignment === null) return false;
      const item = assignment as Record<string, unknown>;
      return (item.personId === "daughter" || item.personId === "parent1" || item.personId === "parent2")
        && Array.isArray(item.roleIds) && item.roleIds.every((roleId) => typeof roleId === "string");
    }) ? candidate.assignments as RoleAssignment[] : undefined;

    return {
      storyId: candidate.storyId,
      playerCount: candidate.playerCount,
      showHints: candidate.showHints,
      ...(assignments ? { assignments } : {}),
    };
  } catch {
    return null;
  }
}

export function restoreAssignments(story: Story, preferences: LocalPreferences): RoleAssignment[] {
  const fallback = assignRoles(story, preferences.playerCount);
  const assignments = preferences.assignments;
  if (!assignments || assignments.length !== preferences.playerCount) return fallback;

  const expectedPeople = preferences.playerCount === 2
    ? ["daughter", "parent1"]
    : ["daughter", "parent1", "parent2"];
  const peopleAreExact = expectedPeople.every((personId) => assignments.filter((item) => item.personId === personId).length === 1);
  const roleIds = assignments.flatMap(({ roleIds: ids }) => ids);
  const storyRoleIds = story.roles.map(({ id }) => id);
  const rolesAreExact = roleIds.length === storyRoleIds.length
    && new Set(roleIds).size === storyRoleIds.length
    && storyRoleIds.every((roleId) => roleIds.includes(roleId));
  const countsFit = preferences.playerCount === 2
    ? assignments.find(({ personId }) => personId === "daughter")?.roleIds.length === 1
      && assignments.find(({ personId }) => personId === "parent1")?.roleIds.length === story.roles.length - 1
    : assignments.every(({ roleIds: ids }) => ids.length === 1);

  return peopleAreExact && rolesAreExact && countsFit ? assignments : fallback;
}
