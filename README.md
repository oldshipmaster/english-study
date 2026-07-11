# StoryStage 家庭英语剧场

StoryStage 是面向 9–11 岁小学基础孩子与家长的家庭英语角色扮演应用。家庭可以选择六个短故事，为 2–3 位演员分配角色，在排练和演出模式间切换，并以彩色 A4 纸质练习为主完成词汇、句型、开口和间隔复习。

在线体验：https://oldshipmaster.github.io/english-study/#top

源码位于 `/Volumes/extfastdata01/english-study`，公开仓库为 https://github.com/oldshipmaster/english-study 。

## 本地开发

需要 Node.js 22.13 或更新版本。

```bash
npm install
npm run dev
```

验证命令：

```bash
npm test -- --run
npm run lint
npm run build
npm run build:pages
npm run audit:print
```

`npm run build:pages` 会在 `pages-dist/` 生成供 GitHub Pages 发布的静态站点。

将已经提交并推送到 `main` 的当前版本发布到 GitHub Pages：

```bash
./scripts/deploy-pages.sh
```

部署脚本只接受干净工作区。它从当前 `HEAD` 重新构建，在隔离的临时 worktree 中仅提交 `pages-dist/` 内容，并将完整源码 SHA 写入 `gh-pages` 提交消息；推送使用基于已获取远端部署提交的 `--force-with-lease`，并发更新时会安全失败。

## 内容原则

教材与分级读物可以用于校准故事难度、词汇范围和学习目标，但 StoryStage 不复制受版权保护的教材原文。

## 功能

- 六个适合 9–11 岁小学基础学习者的原创双语故事
- 2 人或 3 人角色分配与本地恢复
- 角色台词量、孩子推荐角色和简单家庭道具提示
- 排练中文、词汇和发音提示，以及临时演出提示
- 键盘、按钮和横向滑动台词导航
- 演后理解挑战与无障碍反馈
- 完整家庭剧本和 3 页角色打印版：保留全部 18 句、只重点突出自己的台词，并提供个人行数、三遍排练、兼演换角提示和演后反馈
- 一张 A4 的六课成长地图：记录规定词、句型和孩子主动收集生词的第 0/2/7 天表现
- 六张 A4 的 48 词 + 12 句型累计复习本：遮答案主动回忆、间隔复习、换词造句、个人语法错题和 12 个自选生词收藏
- 四张 A4 的家庭原创剧本工坊：自主选择 8 个词和 2 个句型，为 2–3 人写三场 18 句毕业剧，并完成逐句语法自检、连接词扩句与谢幕问答

## 彩色纸质学习包

每个故事默认生成 17 页 A4 彩色学习包，只需打印一次，按第 0、2、7 天反复使用。每次练习控制在 8–10 分钟，首演可拆成词汇与女儿台词、分场排练、全家演出三个小段。

学习包包含：

- 家庭任务、学习目标、角色和道具建议
- 8 个本课词、生词救援表、词性和拆读提示
- 按三个场景分页的完整剧本、动作提示和分场小检查
- 女儿台词三遍开口、重读/意群/语调标记和自我纠错
- 两个故事专属句型、可剪句子拼图和语法小侦探
- 开口挑战、30–60 秒故事复述和三张生活化家庭聊天卡
- 8 张本课词卡、2 张自制生词卡、2 张句型卡及红黄绿卡盒
- 看盖写查拼写、声音成长对比、跨故事旧词和家长答案

用于 A4 打印质量检查的直接预览地址：

```text
http://localhost:4174/english-study/?print=moonlight-picnic&players=2
http://localhost:4174/english-study/?print=moonlight-picnic&players=2&person=daughter
http://localhost:4174/english-study/?journey=1
http://localhost:4174/english-study/?wordbank=1
http://localhost:4174/english-study/?creator=1
```

打印验证要求为 A4、100% 缩放、开启背景图形；每次修改纸质布局后，应实际生成 PDF 并逐页检查裁切、页脚和可读性。`npm run audit:print` 使用 Chrome、`pdfinfo` 和 `pdftotext` 检查全部六个故事的 2 人与 3 人学习包、30 份合法人数/家庭成员组合的完整 18 句角色剧本、累计词句本、成长地图和原创剧本工坊；可通过 `CHROME_BIN`、`PDFINFO_BIN`、`PDFTOTEXT_BIN` 指定本机工具路径。

## 技术栈

React 19、Next.js 16、vinext、TypeScript、Vitest 和 Testing Library。生产构建由 `vinext build` 生成，Sites 配置保留在 `.openai/hosting.json`。
