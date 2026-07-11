import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { stories } from "../data/stories";
import Home from "../page";
import { RoleAssignmentView } from "./RoleAssignment";

afterEach(cleanup);

describe("StoryStage family story flow", () => {
  it("shows six stories and filters the library by category", async () => {
    const user = userEvent.setup();
    render(<Home />);

    expect(screen.getAllByTestId("story-card")).toHaveLength(6);
    expect(stories.map(({ title }) => title)).toEqual([
      "The Moonlight Picnic",
      "The Missing Lunchbox",
      "The Secret Tree House",
      "A Busy Morning",
      "The Class Talent Show",
      "The Cloud Postman",
    ]);
    expect(stories.every((story) => story.roles.length === 3 && story.lines.length === 18 && story.challenges.length === 3 && Object.keys(story.vocabulary).length === 8)).toBe(true);
    expect(screen.getByRole("heading", { name: "今晚，把英语故事演出来。" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "学校" }));
    expect(screen.getAllByTestId("story-card")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "The Missing Lunchbox" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "The Class Talent Show" })).toBeTruthy();
  });

  it("opens role assignment for The Moonlight Picnic", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByRole("button", { name: "选择 The Moonlight Picnic" }));

    expect(screen.getByRole("heading", { name: "分配角色" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "2 人" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "3 人" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "1 人" })).toBeNull();
  });

  it("starts two-player mode with every story role covered", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    const story = stories.find(({ title }) => title === "The Moonlight Picnic");
    expect(story).toBeDefined();

    render(<RoleAssignmentView story={story!} onBack={() => undefined} onStart={onStart} />);
    await user.click(screen.getByRole("button", { name: "2 人" }));
    expect(screen.getByText("兼演")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "开始演出" }));

    expect(onStart).toHaveBeenCalledOnce();
    const assignments = onStart.mock.calls[0][0];
    expect(new Set(assignments.flatMap((assignment) => assignment.roleIds))).toEqual(
      new Set(story!.roles.map((role) => role.id)),
    );
  });

  it("swaps owners without leaving a three-player actor roleless", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    const story = stories.find(({ title }) => title === "The Moonlight Picnic")!;
    render(<RoleAssignmentView story={story} onBack={() => undefined} onStart={onStart} />);

    await user.click(screen.getByRole("button", { name: "3 人" }));
    await user.selectOptions(screen.getByLabelText(/Mia/), "parent1");
    await user.click(screen.getByRole("button", { name: "开始演出" }));

    const assignments = onStart.mock.calls[0][0];
    expect(assignments.map((assignment) => assignment.roleIds)).toEqual([["dad"], ["mia"], ["grandma"]]);
  });

  it("keeps the daughter on one child-friendly role in two-player mode", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    const story = stories.find(({ title }) => title === "The Moonlight Picnic")!;
    render(<RoleAssignmentView story={story} onBack={() => undefined} onStart={onStart} />);

    const dadSelect = screen.getByLabelText(/Dad/) as HTMLSelectElement;
    expect((dadSelect.querySelector('option[value="daughter"]') as HTMLOptionElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "开始演出" }));

    const assignments = onStart.mock.calls[0][0];
    const daughter = assignments.find((assignment) => assignment.personId === "daughter");
    const daughterRole = story.roles.find((role) => role.id === daughter.roleIds[0]);
    expect(daughter.roleIds).toHaveLength(1);
    expect(daughterRole?.childFriendly).toBe(true);
    expect(assignments.find((assignment) => assignment.personId === "parent1").roleIds).toHaveLength(2);
  });
});
