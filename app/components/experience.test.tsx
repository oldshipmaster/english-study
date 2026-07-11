import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { stories } from "../data/stories";
import Home from "../page";
import { RoleAssignmentView } from "./RoleAssignment";
import { ChallengePanel } from "./ChallengePanel";
import { ScriptPlayer } from "./ScriptPlayer";

afterEach(cleanup);

const moonlightStory = stories.find(({ id }) => id === "moonlight-picnic")!;
const twoPlayerAssignments = [
  { personId: "daughter" as const, roleIds: ["mia"] },
  { personId: "parent1" as const, roleIds: ["dad", "grandma"] },
];

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

  it("lets two players choose a different daughter role without losing coverage", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    const story = stories.find(({ title }) => title === "The Moonlight Picnic")!;
    render(<RoleAssignmentView story={story} onBack={() => undefined} onStart={onStart} />);

    await user.selectOptions(screen.getByLabelText("女儿演哪个角色？"), "dad");
    await user.click(screen.getByRole("button", { name: "开始演出" }));

    const assignments = onStart.mock.calls[0][0];
    const daughter = assignments.find((assignment) => assignment.personId === "daughter");
    const parent = assignments.find((assignment) => assignment.personId === "parent1");
    expect(daughter.roleIds).toEqual(["dad"]);
    expect(parent.roleIds).toEqual(["mia", "grandma"]);
    expect(new Set(assignments.flatMap((assignment) => assignment.roleIds))).toEqual(
      new Set(story.roles.map((role) => role.id)),
    );
  });

  it("navigates the script, identifies the actor, and toggles hints and performance mode", async () => {
    const user = userEvent.setup();
    render(
      <ScriptPlayer
        story={moonlightStory}
        assignments={twoPlayerAssignments}
        mode="rehearsal"
        showHints={false}
        onComplete={() => undefined}
        onExit={() => undefined}
      />,
    );

    expect(screen.getByText("Mia · 女儿")).toBeTruthy();
    expect(screen.getByText("Today is our picnic day!")).toBeTruthy();
    expect(screen.getByText("1 / 18")).toBeTruthy();
    expect(screen.queryByText("今天是我们的野餐日！")).toBeNull();
    expect((screen.getByRole("button", { name: "上一句" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("button", { name: "下一句" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "显示中文提示" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "切换到演出模式" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "显示中文提示" }));
    expect(screen.getByText("今天是我们的野餐日！")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "切换到演出模式" }));
    expect(screen.getByText("演出模式")).toBeTruthy();
    expect(screen.queryByText("今天是我们的野餐日！")).toBeNull();

    await user.click(screen.getByRole("button", { name: "下一句" }));
    expect(screen.getByText("Dad · 家长 1")).toBeTruthy();
    expect(screen.getByText("2 / 18")).toBeTruthy();
    expect((screen.getByRole("button", { name: "上一句" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("supports ArrowLeft and ArrowRight without moving outside the script", async () => {
    const user = userEvent.setup();
    render(<ScriptPlayer story={moonlightStory} assignments={twoPlayerAssignments} mode="rehearsal" showHints onComplete={() => undefined} onExit={() => undefined} />);

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("1 / 18")).toBeTruthy();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(screen.getByText("3 / 18")).toBeTruthy();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("2 / 18")).toBeTruthy();
  });

  it("shows only the current line vocabulary with rehearsal hints and no empty panel", async () => {
    const user = userEvent.setup();
    render(<ScriptPlayer story={moonlightStory} assignments={twoPlayerAssignments} mode="rehearsal" showHints onComplete={() => undefined} onExit={() => undefined} />);

    const vocabulary = screen.getByRole("region", { name: "重点词汇" });
    expect(vocabulary.textContent).toContain("picnic");
    expect(vocabulary.textContent).toContain("野餐");
    expect(vocabulary.textContent).not.toContain("basket");

    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}");
    expect(screen.getByText("How will we see our picnic?")).toBeTruthy();
    expect(screen.queryByRole("region", { name: "重点词汇" })).toBeNull();
  });

  it("keeps vocabulary hidden by default in performance mode", () => {
    render(<ScriptPlayer story={moonlightStory} assignments={twoPlayerAssignments} mode="performance" showHints onComplete={() => undefined} onExit={() => undefined} />);

    expect(screen.queryByRole("region", { name: "重点词汇" })).toBeNull();
  });

  it("completes on the final line and exposes focusable named controls", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const shortStory = { ...moonlightStory, lines: moonlightStory.lines.slice(0, 2) };
    render(<ScriptPlayer story={shortStory} assignments={twoPlayerAssignments} mode="performance" showHints={false} onComplete={onComplete} onExit={() => undefined} />);

    const exit = screen.getByRole("button", { name: "退出故事" });
    const next = screen.getByRole("button", { name: "下一句" });
    expect(exit.tabIndex).toBe(0);
    expect(next.tabIndex).toBe(0);
    await user.click(next);
    await user.click(screen.getByRole("button", { name: "完成故事" }));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("locks each challenge answer and completes all three questions", async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();
    const onChooseStory = vi.fn();
    render(<ChallengePanel questions={moonlightStory.challenges} onRestart={onRestart} onChooseStory={onChooseStory} />);

    expect(screen.getByText("1 / 3")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "It is dark" }));
    expect(screen.getByText("Great listening!")).toBeTruthy();
    expect((screen.getByRole("button", { name: "It is raining" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "下一题" }));
    await user.click(screen.getByRole("button", { name: "In a tree" }));
    expect(screen.getByText("Wonderful work!")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "下一题" }));
    await user.click(screen.getByRole("button", { name: "Paper stars" }));
    expect(screen.getByText("You remembered it!")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "查看完成页" }));

    expect(screen.queryByText(/score|排名|得分/i)).toBeNull();
    await user.click(screen.getByRole("button", { name: "再演一次" }));
    await user.click(screen.getByRole("button", { name: "选择新故事" }));
    expect(onRestart).toHaveBeenCalledOnce();
    expect(onChooseStory).toHaveBeenCalledOnce();
  });

  it("persists only safe preferences and restores the story at line one", async () => {
    const user = userEvent.setup();
    window.localStorage.clear();
    const firstRender = render(<Home />);
    await user.click(screen.getByRole("button", { name: "选择 The Moonlight Picnic" }));
    await user.click(screen.getByRole("button", { name: "3 人" }));
    await user.click(screen.getByRole("button", { name: "开始演出" }));
    await user.click(screen.getByRole("button", { name: "显示中文提示" }));

    expect(JSON.parse(window.localStorage.getItem("storystage.preferences")!)).toEqual({
      storyId: "moonlight-picnic",
      playerCount: 3,
      showHints: true,
    });
    firstRender.unmount();
    render(<Home />);
    expect(screen.getByText("Today is our picnic day!")).toBeTruthy();
    expect(screen.getByText("1 / 18")).toBeTruthy();
    expect(screen.getByText("今天是我们的野餐日！")).toBeTruthy();
  });
});
