# StoryStage 家庭英语剧场

StoryStage 是面向 9–11 岁孩子与家长的家庭英语角色扮演应用。家庭可以选择六个短故事，为 2–3 位演员分配角色，在排练和演出模式间切换，并打印完整或角色高亮剧本。

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

- 六个适合初级学习者的双语故事
- 2 人或 3 人角色分配与本地恢复
- 排练中文、词汇和发音提示，以及临时演出提示
- 键盘、按钮和横向滑动台词导航
- 演后理解挑战与无障碍反馈
- 完整家庭剧本和全台词角色高亮打印版

## 技术栈

React 19、Next.js 16、vinext、TypeScript、Vitest 和 Testing Library。生产构建由 `vinext build` 生成，Sites 配置保留在 `.openai/hosting.json`。
