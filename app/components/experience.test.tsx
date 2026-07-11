import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { stories } from "../data/stories";
import Home from "../page";
import { RoleAssignmentView } from "./RoleAssignment";
import { ChallengePanel } from "./ChallengePanel";
import { ScriptPlayer } from "./ScriptPlayer";
import { PrintScript } from "./PrintScript";

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

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
    expect(screen.getByText("提出一起做的建议")).toBeTruthy();
    expect(screen.getByText("说出自己将要做什么")).toBeTruthy();
    expect(screen.getAllByText("本课会说")).toHaveLength(6);

    await user.click(screen.getByRole("button", { name: "学校" }));
    expect(screen.getAllByTestId("story-card")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "The Missing Lunchbox" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "The Class Talent Show" })).toBeTruthy();
  });

  it("opens and prints a six-story paper learning journey", async () => {
    const user = userEvent.setup();
    const print = vi.spyOn(window, "print").mockImplementation(() => undefined);
    render(<Home />);
    await user.click(screen.getByRole("button", { name: "打开 6 课成长地图" }));
    const journey = screen.getByRole("region", { name: "6 课英语成长地图" });
    expect(journey.querySelectorAll(".journey-story")).toHaveLength(6);
    expect(journey.textContent).toContain("第 0 天");
    expect(journey.textContent).toContain("第 2 天");
    expect(journey.textContent).toContain("第 7 天");
    await user.click(screen.getByRole("button", { name: "打印 6 课成长地图" }));
    expect(print).toHaveBeenCalledOnce();
    print.mockRestore();
  });

  it("renders a direct print preview URL for A4 quality checks", () => {
    window.history.replaceState({}, "", "/?print=moonlight-picnic&players=2");
    render(<Home />);
    expect(screen.getByRole("article", { name: "彩色故事学习包" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "打印彩色故事学习包" })).toBeTruthy();
  });

  it("renders a direct journey preview URL for A4 quality checks", () => {
    window.history.replaceState({}, "", "/?journey=1");
    render(<Home />);
    expect(screen.getByRole("region", { name: "6 课英语成长地图" })).toBeTruthy();
  });

  it("gives every printable learning word an independent pronunciation cue", () => {
    stories.forEach((story) => story.learningPack.words.forEach((item) => expect(item.pronunciation.trim()).not.toBe("")));
  });

  it("labels every current and review word with a usable part of speech", () => {
    stories.forEach(({ learningPack }) => [...learningPack.words, ...learningPack.reviewWords].forEach((item) => expect(item.partOfSpeech).toMatch(/名词|动词|形容词|副词/)));
  });

  it("keeps all eight current-story words and three review words in separate pools", () => {
    stories.forEach((story, index) => {
      expect(story.learningPack.words.map(({ word }) => word)).toEqual(Object.keys(story.vocabulary));
      expect(story.learningPack.reviewWords).toHaveLength(3);
      expect(story.learningPack.reviewWords.every(({ review }) => review)).toBe(true);
      expect(story.learningPack.reviewWords.every(({ sourceStory }) => Boolean(sourceStory))).toBe(true);
      if (index >= 3) expect(new Set(story.learningPack.reviewWords.map(({ sourceStory }) => sourceStory)).size).toBe(3);
    });
  });

  it("uses natural elementary English instead of avoidable split compounds or stiff passives", () => {
    const script = stories.flatMap(({ lines }) => lines.map(({ english }) => english)).join(" ");
    expect(script).not.toContain("book shelf");
    expect(script).not.toContain("story books");
    expect(script).not.toContain("The lunchbox is found.");
    expect(script).not.toContain("The last letter is safely delivered.");
  });

  it("adds a small set of purposeful stage directions to every story", () => {
    stories.forEach((story) => expect(story.lines.filter(({ stageDirection }) => stageDirection)).toHaveLength(4));
  });

  it("gives every story a complete retelling scaffold", () => {
    stories.forEach(({ learningPack }) => {
      expect(learningPack.retell.settingHint).not.toBe("");
      expect(learningPack.retell.problemHint).not.toBe("");
      expect(learningPack.retell.actionHints).toHaveLength(2);
      expect(learningPack.retell.endingHint).not.toBe("");
    });
  });

  it("gives every grammar pattern a distinct common mistake and correction", () => {
    stories.forEach(({ learningPack }) => learningPack.patterns.forEach((pattern) => {
      expect(pattern.commonMistake).not.toBe(pattern.correction);
      expect(pattern.correction).not.toBe("");
    }));
  });

  it("gives every story three personal conversation prompts with answer starters", () => {
    stories.forEach(({ learningPack }) => {
      expect(learningPack.conversationPrompts).toHaveLength(3);
      learningPack.conversationPrompts.forEach((prompt) => {
        expect(prompt.question).not.toBe("");
        expect(prompt.chinese).not.toBe("");
        expect(prompt.starter).not.toBe("");
      });
    });
  });

  it("opens role assignment for The Moonlight Picnic", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByRole("button", { name: "选择 The Moonlight Picnic" }));

    expect(screen.getByRole("heading", { name: "分配角色" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "2 人" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "3 人" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "1 人" })).toBeNull();
    expect(screen.getByRole("button", { name: "先打印纸质学习包" })).toBeTruthy();
    expect(screen.getAllByText("7 句 · 推荐给孩子").length).toBeGreaterThan(0);
    expect(screen.getAllByText("6 句").length).toBeGreaterThan(0);
  });

  it("opens the paper learning pack directly from role assignment", async () => {
    const user = userEvent.setup();
    render(<RoleAssignmentView story={moonlightStory} onBack={() => undefined} onStart={() => undefined} />);
    await user.click(screen.getByRole("button", { name: "先打印纸质学习包" }));
    expect(screen.getByRole("article", { name: "彩色故事学习包" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "打印彩色故事学习包" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "收起打印区" })).toBeTruthy();
  });

  it("starts two-player mode with every story role covered", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    const story = stories.find(({ title }) => title === "The Moonlight Picnic");
    expect(story).toBeDefined();

    render(<RoleAssignmentView story={story!} onBack={() => undefined} onStart={onStart} />);
    await user.click(screen.getByRole("button", { name: "2 人" }));
    expect(screen.getByText(/兼演/)).toBeTruthy();
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

  it("reveals and hides a temporary performance hint without changing rehearsal preferences", async () => {
    const user = userEvent.setup();
    const onShowHintsChange = vi.fn();
    render(<ScriptPlayer story={moonlightStory} assignments={twoPlayerAssignments} mode="performance" showHints={false} onShowHintsChange={onShowHintsChange} onComplete={() => undefined} onExit={() => undefined} />);

    await user.click(screen.getByRole("button", { name: "查看本句提示" }));
    expect(screen.getByText("今天是我们的野餐日！")).toBeTruthy();
    expect(screen.getByRole("region", { name: "重点词汇" }).textContent).toContain("picnic");
    expect(screen.getByText(/PIC-nik/)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "隐藏本句提示" }));
    expect(screen.queryByText("今天是我们的野餐日！")).toBeNull();
    expect(onShowHintsChange).not.toHaveBeenCalled();
  });

  it("resets temporary performance help on keyboard navigation and mode re-entry", async () => {
    const user = userEvent.setup();
    render(<ScriptPlayer story={moonlightStory} assignments={twoPlayerAssignments} mode="performance" showHints={false} onComplete={() => undefined} onExit={() => undefined} />);

    await user.click(screen.getByRole("button", { name: "查看本句提示" }));
    expect(screen.getByText("今天是我们的野餐日！")).toBeTruthy();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("2 / 18")).toBeTruthy();
    expect(screen.queryByText("我们来装好篮子吧。")).toBeNull();

    await user.click(screen.getByRole("button", { name: "查看本句提示" }));
    await user.click(screen.getByRole("button", { name: "切换到排练模式" }));
    await user.click(screen.getByRole("button", { name: "切换到演出模式" }));
    expect(screen.queryByText("我们来装好篮子吧。")).toBeNull();
    expect(screen.getByRole("button", { name: "查看本句提示" })).toBeTruthy();
  });

  it("navigates on horizontal pointer swipes, ignores vertical movement, and respects boundaries", () => {
    render(<ScriptPlayer story={moonlightStory} assignments={twoPlayerAssignments} mode="rehearsal" showHints={false} onComplete={() => undefined} onExit={() => undefined} />);
    const stage = screen.getByRole("region", { name: "台词舞台" });

    fireEvent.pointerDown(stage, { clientX: 240, clientY: 100, pointerId: 1 });
    fireEvent.pointerUp(stage, { clientX: 100, clientY: 110, pointerId: 1 });
    expect(screen.getByText("2 / 18")).toBeTruthy();
    fireEvent.pointerDown(stage, { clientX: 100, clientY: 100, pointerId: 2 });
    fireEvent.pointerUp(stage, { clientX: 120, clientY: 220, pointerId: 2 });
    expect(screen.getByText("2 / 18")).toBeTruthy();
    fireEvent.pointerDown(stage, { clientX: 100, clientY: 100, pointerId: 3 });
    fireEvent.pointerUp(stage, { clientX: 240, clientY: 110, pointerId: 3 });
    fireEvent.pointerDown(stage, { clientX: 100, clientY: 100, pointerId: 4 });
    fireEvent.pointerUp(stage, { clientX: 240, clientY: 110, pointerId: 4 });
    expect(screen.getByText("1 / 18")).toBeTruthy();
  });

  it("shows pronunciation help when supplied and omits it when absent", async () => {
    const user = userEvent.setup();
    render(<ScriptPlayer story={moonlightStory} assignments={twoPlayerAssignments} mode="rehearsal" showHints onComplete={() => undefined} onExit={() => undefined} />);
    expect(screen.getByText(/PIC-nik/)).toBeTruthy();
    await user.keyboard("{ArrowRight}");
    expect(screen.queryByText(/PIC-nik/)).toBeNull();
  });

  it("prints the complete family script with every line in stable scene and line blocks", async () => {
    const user = userEvent.setup();
    render(<PrintScript story={moonlightStory} assignments={twoPlayerAssignments} />);
    await user.click(screen.getByRole("button", { name: "选择完整家庭剧本" }));

    const printableScript = screen.getByRole("region", { name: "完整家庭剧本" });
    expect(printableScript.querySelectorAll(".print-scene")).toHaveLength(3);
    expect(printableScript.querySelectorAll(".print-line")).toHaveLength(moonlightStory.lines.length);
    moonlightStory.lines.forEach(({ english }) => expect(printableScript.textContent).toContain(english));
    expect(screen.getByRole("button", { name: "打印完整家庭剧本" })).toBeTruthy();
  });

  it("shows reliable color A4 printer settings before printing", () => {
    render(<PrintScript story={moonlightStory} assignments={twoPlayerAssignments} />);
    expect(screen.getByText("A4 · 彩色 · 100% 缩放 · 开启背景图形")).toBeTruthy();
    expect(screen.getByText(/完整学习包共 17 页/)).toBeTruthy();
    expect(screen.getByText("17 页怎么用？打印一次，7 天复用")).toBeTruthy();
    expect(screen.getByText("第 3–5 页：三场彩色完整剧本，不在场景中间跨页")).toBeTruthy();
    expect(screen.getByText("第 15–16 页：间隔复习与跨故事旧词")).toBeTruthy();
  });

  it("offers a seventeen-page color learning pack without dropping script lines or cards", () => {
    render(<PrintScript story={moonlightStory} assignments={twoPlayerAssignments} />);
    const pack = screen.getByRole("article", { name: "彩色故事学习包" });
    expect(pack.querySelectorAll(".learning-pack-page")).toHaveLength(17);
    expect(pack.querySelectorAll(".pack-script-line")).toHaveLength(moonlightStory.lines.length);
    expect(pack.querySelectorAll(".pack-script-scene")).toHaveLength(3);
    expect(pack.querySelectorAll(".scene-check")).toHaveLength(3);
    expect(pack.textContent).toContain("用一句中文总结本场");
    expect(pack.textContent).toContain("盖住中文连续演");
    expect(pack.querySelectorAll(".pack-direction")).toHaveLength(4);
    expect(pack.querySelectorAll(".memory-card")).toHaveLength(10);
    expect(pack.textContent).toContain("演前词汇热身");
    expect(pack.textContent).toContain("7 天家庭学习路线");
    expect(pack.textContent).toContain("每次 8–10 分钟");
    expect(pack.textContent).toContain("短休息");
    expect(pack.textContent).not.toContain("25–30 分钟");
    expect(pack.textContent).toContain("本课学习目标");
    expect(pack.querySelectorAll(".mission-goal")).toHaveLength(2);
    expect(pack.textContent).toContain("第 0 天 · 首演");
    expect(pack.textContent).toContain("第 2 天 · 唤醒");
    expect(pack.textContent).toContain("第 7 天 · 迁移");
    expect(pack.querySelectorAll(".week-path-step")).toHaveLength(3);
    expect(pack.textContent).toContain("句型与语法发现");
    expect(pack.textContent).toContain("说 → 换 → 写 → 再说");
    expect(pack.textContent).toContain("我的新句子");
    expect(pack.querySelectorAll(".pattern-transfer")).toHaveLength(2);
    expect(pack.querySelectorAll(".pattern-self-check")).toHaveLength(2);
    expect(pack.textContent).toContain("可剪句子拼图");
    expect(pack.textContent).toContain("拼回故事原句");
    expect(pack.textContent).toContain("换掉一张词卡");
    expect(pack.querySelectorAll(".sentence-puzzle")).toHaveLength(2);
    expect(pack.querySelectorAll(".word-tile").length).toBeGreaterThan(8);
    expect(pack.textContent).toContain("先演完，再反馈");
    expect(pack.textContent).toContain("孩子自评");
    expect(pack.textContent).toContain("家长观察");
    expect(pack.textContent).toContain("两颗星 + 一个愿望");
    expect(pack.querySelectorAll(".performance-feedback-column")).toHaveLength(2);
    expect(pack.textContent).toContain("故事复述地图");
    expect(pack.textContent).toContain("First → Then → Finally");
    expect(pack.textContent).toContain("不看剧本讲 30–60 秒");
    expect(pack.querySelectorAll(".retell-stage")).toHaveLength(4);
    expect(pack.textContent).toContain("语法小侦探");
    expect(pack.textContent).toContain("语法侦探答案");
    expect(pack.textContent).toContain("句子拼图答案");
    expect(pack.querySelectorAll(".grammar-detective-case")).toHaveLength(2);
    expect(pack.textContent).toContain("家庭英语聊天卡");
    expect(pack.textContent).toContain("先回答自己真实的想法");
    expect(pack.querySelectorAll(".conversation-card")).toHaveLength(3);
    expect(pack.textContent).toContain("可折叠记忆卡");
    expect(pack.textContent).toContain("家长抽查页");
    expect(pack.textContent).toContain("我的复习护照");
    expect(pack.textContent).toContain("三遍开口阶梯");
    expect(pack.textContent).toContain("台词表达标记");
    expect(pack.textContent).toContain("圈出重读词");
    expect(pack.textContent).toContain("用 / 划分意群");
    expect(pack.textContent).toContain("问句末尾画 ↑");
    expect(pack.textContent).toContain("第 1 遍 · 看完整台词");
    expect(pack.textContent).toContain("第 2 遍 · 只看关键词");
    expect(pack.textContent).toContain("第 3 遍 · 不看台词");
    expect(pack.textContent).toContain("停一下 → 从句首重说 → 继续演");
    expect(pack.querySelectorAll(".daughter-line .fluency-round")).toHaveLength(21);
    expect(pack.querySelectorAll(".daughter-action")).toHaveLength(4);
    expect(pack.textContent).toContain("I = 独立说出");
    expect(pack.textContent).toContain("H = 给提示后说出");
    expect(pack.textContent).toContain("A = 看答案后重说");
    expect(pack.textContent).toContain("当天基线");
    expect(pack.querySelectorAll(".parent-evidence tbody tr")).toHaveLength(3);
    expect(pack.textContent).toContain("旧词滚动挑战");
    expect(pack.textContent).toContain("间隔 10 分钟后");
    expect(pack.textContent).toContain("旧词 + 新词");
    expect(pack.querySelectorAll(".rolling-review-word")).toHaveLength(3);
    expect(pack.querySelectorAll(".review-source")).toHaveLength(3);
    expect(pack.textContent).toContain("第二天");
    expect(pack.textContent).toContain("第七天");
    expect(pack.textContent).toContain("看 → 盖 → 写 → 查");
    expect(pack.textContent).toContain("只练我自己选的难词");
    expect(pack.querySelectorAll(".spelling-practice tbody tr")).toHaveLength(4);
    expect(pack.querySelectorAll(".mastery-row")).toHaveLength(8);
    expect(pack.querySelectorAll(".mastery-row .word-type")).toHaveLength(8);
    expect(pack.textContent).toContain("我的记词工具箱");
    expect(pack.textContent).toContain("本次我主动选的 3 个难词");
    expect(pack.textContent).toContain("画小图");
    expect(pack.textContent).toContain("做动作");
    expect(pack.querySelectorAll(".memory-hook")).toHaveLength(8);
    expect(pack.textContent).toContain("我的生词救援站");
    expect(pack.textContent).toContain("先猜意思");
    expect(pack.textContent).toContain("查证后");
    expect(pack.textContent).toContain("我自己的句子");
    expect(pack.querySelectorAll(".unknown-word-journal tbody tr")).toHaveLength(4);
    expect(pack.querySelectorAll(".word-memory-card .card-front")).toHaveLength(8);
    expect(pack.querySelectorAll(".word-memory-card .card-back")).toHaveLength(8);
    expect(pack.querySelectorAll(".word-memory-card .word-pronunciation")).toHaveLength(8);
    expect(pack.querySelectorAll(".word-memory-card .word-type")).toHaveLength(8);
    expect(pack.textContent).toContain("先回答，再沿中线翻卡");
    expect(pack.textContent).toContain("我不会盒");
    expect(pack.textContent).toContain("练习中盒");
    expect(pack.textContent).toContain("已掌握盒");
    expect(screen.getByRole("button", { name: "打印彩色故事学习包" })).toBeTruthy();
  });

  it("keeps cue lines and emphasizes only the daughter's roles in her printable script", async () => {
    const user = userEvent.setup();
    render(<PrintScript story={moonlightStory} assignments={twoPlayerAssignments} />);

    await user.click(screen.getByRole("button", { name: "选择女儿的剧本" }));
    const printableScript = screen.getByRole("region", { name: "女儿的角色剧本" });
    const daughterRoleIds = twoPlayerAssignments.find(({ personId }) => personId === "daughter")!.roleIds;
    const expectedFocusLines = moonlightStory.lines.filter(({ roleId }) => daughterRoleIds.includes(roleId)).length;
    expect(printableScript.querySelectorAll(".print-line.is-focus-line")).toHaveLength(expectedFocusLines);
    expect(printableScript.querySelectorAll(".print-line:not(.is-focus-line)")).toHaveLength(moonlightStory.lines.length - expectedFocusLines);
    expect(printableScript.textContent).toContain(moonlightStory.lines[0].english);
    expect(printableScript.textContent).toContain(moonlightStory.lines[1].english);
    expect(printableScript.textContent).toContain("粗框和下划线是我的台词");
    expect(printableScript.textContent).toContain("其他台词完整保留");
    expect(screen.getByRole("button", { name: "打印女儿的角色剧本" })).toBeTruthy();
  });

  it("uses the browser print action for both complete and role-specific scripts", async () => {
    const user = userEvent.setup();
    const print = vi.spyOn(window, "print").mockImplementation(() => undefined);
    render(<PrintScript story={moonlightStory} assignments={twoPlayerAssignments} />);

    await user.click(screen.getByRole("button", { name: "选择完整家庭剧本" }));
    await user.click(screen.getByRole("button", { name: "打印完整家庭剧本" }));
    await user.click(screen.getByRole("button", { name: "选择女儿的剧本" }));
    await user.click(screen.getByRole("button", { name: "打印女儿的角色剧本" }));
    expect(print).toHaveBeenCalledTimes(2);
    print.mockRestore();
  });

  it("shows browser-menu fallback instructions when printing is unavailable or fails", async () => {
    const user = userEvent.setup();
    const print = vi.spyOn(window, "print").mockImplementation(() => { throw new Error("blocked"); });
    render(<PrintScript story={moonlightStory} assignments={twoPlayerAssignments} />);
    await user.click(screen.getByRole("button", { name: "选择完整家庭剧本" }));
    await user.click(screen.getByRole("button", { name: "打印完整家庭剧本" }));
    expect(screen.getByRole("alert").textContent).toContain("浏览器菜单");
    print.mockRestore();
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

  it("announces correct and incorrect challenge feedback while retaining encouragement", async () => {
    const user = userEvent.setup();
    render(<ChallengePanel questions={moonlightStory.challenges} onRestart={() => undefined} onChooseStory={() => undefined} />);
    await user.click(screen.getByRole("button", { name: "It is raining" }));
    expect(screen.getByRole("status").textContent).toContain("还差一点");
    expect(screen.getByRole("status").textContent).toContain("Great listening!");
    await user.click(screen.getByRole("button", { name: "下一题" }));
    await user.click(screen.getByRole("button", { name: "In a tree" }));
    expect(screen.getByRole("status").textContent).toContain("答对了");
    expect(screen.getByRole("status").textContent).toContain("Wonderful work!");
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
      assignments: [
        { personId: "daughter", roleIds: ["mia"] },
        { personId: "parent1", roleIds: ["dad"] },
        { personId: "parent2", roleIds: ["grandma"] },
      ],
    });
    firstRender.unmount();
    render(<Home />);
    expect(screen.getByText("Today is our picnic day!")).toBeTruthy();
    expect(screen.getByText("1 / 18")).toBeTruthy();
    expect(screen.getByText("今天是我们的野餐日！")).toBeTruthy();
  });
});
