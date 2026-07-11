# StoryStage GitHub Pages 迁移设计

## 1. 背景与目标

当前 StoryStage Sites 生产地址对未授权访问返回 HTTP 403。该部署采用仅所有者可访问的私有策略，因此无法作为家庭成员可直接打开的公开网站。

本次迁移增加一个与 `oldshipmaster/math-study` 相同模式的 GitHub Pages 静态发布目标。最终公开地址固定为：

`https://oldshipmaster.github.io/english-study/#top`

## 2. 方案选择

采用“双构建、单产品代码”方案：保留现有 vinext/Sites 构建以便兼容既有工程，同时新增独立 Vite 静态入口供 GitHub Pages 使用。两个构建复用同一套 React 页面组件、故事数据、业务逻辑与全局样式，不复制产品实现。

不把整个项目改写为普通 Vite，也不依赖修改 Sites 访问策略解决公开访问问题。

## 3. 静态站点结构

- `static-site/index.html`：GitHub Pages HTML 外壳，包含中文语言、视口、主题色、标题、描述和分享图信息。
- `static-site/src/main.tsx`：挂载 React 客户端应用并导入现有全局样式。
- `app/StoryStageApp.tsx`：从现有页面中抽取的可复用客户端应用入口；vinext 页面与 GitHub Pages 静态入口都使用它。
- `vite.pages.config.ts`：静态构建配置，`base` 固定为 `/english-study/`，输出到 `pages-dist`。

静态版本不得调用服务端 API、`next/headers`、账号系统或云端存储。当前产品只使用本地故事数据和浏览器存储，适合纯静态部署。

## 4. 路径与元信息

所有构建资源必须以 `/english-study/` 为基础路径，保证 CSS、JavaScript 和 `og.png` 在项目子路径下正确加载。

页面根元素提供 `id="top"`，因此目标地址中的 `#top` 可稳定定位。浏览器刷新任意当前界面时重新加载静态入口；产品状态根据已有本地偏好恢复，不依赖服务器路由。

静态 HTML 使用：

- 标题：`StoryStage | 家庭英语剧场`
- 描述：`适合 9–11 岁孩子的家庭英语角色扮演故事，支持 2–3 人排练与打印。`
- 分享图：`https://oldshipmaster.github.io/english-study/og.png`

## 5. GitHub 仓库与发布

创建公开仓库 `oldshipmaster/english-study`，以本地 `main` 为源码分支。不得覆盖同名既有仓库；若仓库已存在，先确认归属和内容再推送。

构建命令为 `npm run build:pages`。输出目录仅包含 GitHub Pages 所需的静态文件，并包含 `.nojekyll`。使用 `gh-pages` 分支根目录作为 Pages 来源，启用 HTTPS。

发布流程必须保持源码提交与部署产物可追溯。发布后可继续从 `/Volumes/extfastdata01/english-study` 修改源码并重复构建、发布。

## 6. 测试与验收

迁移完成前必须验证：

- 现有单元与体验测试全部通过。
- vinext/Sites 生产构建仍通过。
- GitHub Pages 静态构建通过。
- `pages-dist/index.html` 的资源路径包含 `/english-study/`。
- 静态输出包含分享图和 `.nojekyll`。
- GitHub Pages 返回 HTTP 200，CSS 与 JavaScript 资源可访问。
- 页面可显示六个故事，并支持故事选择、2/3 人角色分配、排练、挑战和打印入口。
- 公开网址无需登录即可访问。

## 7. 异常处理

- GitHub 仓库创建或推送失败时，不修改或删除本地源码。
- GitHub Pages 构建失败时保留 `main` 源码分支，并根据构建错误修正后重新发布。
- 若同名仓库已存在且内容与本项目不一致，停止覆盖并请求用户确认。
- 现有 Sites 部署保留为备用，不作为 GitHub Pages 迁移成功的判断依据。
