<p align="center">
  <img src="public/logos/blog-xj.svg" width="64" height="64" alt="Logo" />
</p>

<h1 align="center">⚡ 全栈成神之路 · 📖 面试知识库</h1>

<p align="center">
  <strong>持续更新的前端/全栈面试知识体系</strong>
</p>

<p align="center">
  <a href="https://xiuji008.github.io/xjdoc-interview/" target="_blank">
    📚 在线阅读
  </a>
  &nbsp;|&nbsp;
  <a href="https://github.com/xiuji008/xjdoc-interview" target="_blank">
    💻 GitHub 仓库
  </a>
</p>

---

## 📋 项目简介

**面试知识库** 是一个基于 React + Vite 构建的文档型单页应用，以 Markdown 文件管理面试知识点，涵盖前端、后端、AI、工程化等多个方向。支持全文搜索、Mermaid 图表、KaTeX 数学公式、阅读量统计与 Giscus 评论等功能。

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 本地开发（需先配置 .env，详见下文）
npm run dev

# 3. 构建生产版本
npm run build

# 4. 预览构建结果
npm run preview
```

## 📁 项目结构

```
xjdoc-interview/
├── CHANGELOG.md                 # 项目更新日志
├── docs/                        # 文档目录（Markdown 源文件）
│   ├── ai/                      # AI / 机器学习
│   ├── css/                     # CSS 相关知识
│   ├── java/                    # Java 后端
│   ├── 修炼指南.md              # 修仙系统说明书
│   └── 更新日志.md              # 知识库内容更新记录
├── public/                      # 静态资源
│   ├── logos/                   # 各平台 logo 图标
│   ├── avatar.png               # 项目图标
│   └── docs-manifest.json       # 自动生成的文档清单
├── scripts/
│   └── build-manifest.js        # 文档清单生成脚本
├── src/
│   ├── components/
│   │   ├── AboutModal.jsx       # 关于作者弹窗
│   │   ├── ArticleHeader.jsx    # 文章元信息头部
│   │   ├── ArticleView.jsx      # 文章阅读页面
│   │   ├── ChartBlock.jsx       # 数据图表（recharts）
│   │   ├── Comments.jsx         # Giscus 评论组件
│   │   ├── CultivationManual.jsx # 修炼说明书弹窗
│   │   ├── CultivationPanel.jsx # 修仙境界面板
│   │   ├── CultivationTimeline.jsx # 成神时间线
│   │   ├── EmojiPicker.jsx      # 常用 Emoji 选择器
│   │   ├── ErrorBoundary.jsx    # React 错误边界
│   │   ├── LevelUpAnimation.jsx # 突破升级动画
│   │   ├── MarkdownRenderer.jsx # Markdown 渲染引擎
│   │   ├── MermaidBlock.jsx     # Mermaid 图表渲染
│   │   ├── PageViews.jsx        # 阅读量统计
│   │   └── Sidebar.jsx          # 左侧文档树 + 搜索
│   ├── hooks/
│   │   ├── useDocContent.js     # Markdown 内容加载
│   │   └── useDocManifest.js    # 文档清单加载
│   ├── utils/
│   │   ├── cultivationEngine.js # 修仙引擎（修为计算 + 境界判定）
│   │   ├── gistCounter.js       # 阅读量计数 API
│   │   └── gistCultivation.js   # 修仙历程 Gist 持久化
│   ├── App.jsx                  # 根组件（路由 + 布局）
│   ├── App.css                  # 全局样式
│   └── main.jsx                 # 入口文件
├── index.html
├── vite.config.js
└── package.json
```

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 📚 **文档树导航** | 左侧边栏按目录层级展示，支持展开/折叠 |
| 🔍 **全文搜索** | 实时搜索文档标题 |
| 📝 **Markdown 渲染** | 基于 react-markdown，支持 GFM 扩展 |
| 📊 **数据图表** | 使用 recharts 渲染柱状图、饼图、折线图等 |
| 🧮 **数学公式** | KaTeX 渲染 LaTeX 公式 |
| 🧩 **Mermaid 图表** | 流程图、时序图、类图等 |
| 🏷️ **文章元信息** | 标题、标签、分类、创建/更新日期 |
| 💬 **评论系统** | 基于 Giscus（GitHub Discussions） |
| 👁️ **阅读量统计** | GitHub Gist + Cloudflare Worker |
| 😊 **Emoji 选择器** | 常用 Emoji 快捷复制 |
| 👨‍💻 **关于作者** | 作者信息与各平台链接 |
| ⚡ **修仙成神系统** | 修为值计算、境界晋级、道纹徽章、突破动画、历程时间线 |

## ⚡ 修仙成神系统

知识库内置一套完整的修仙晋级体系，将学习过程可视化：

**修为值公式：**
```
修为 = 文档数 × 0.3 + 顶级分类 × 0.2 + 子分类 × 0.1 + 标签数 × 0.05
```

**境界翻倍规则：**

| 大境界 | 修为范围 | 小层级 |
|--------|---------|--------|
| 练气期 | 0 ~ 19 | 灵气感知 → 半步筑基（13层） |
| 筑基期 | 20 ~ 59 | 初期 → 大圆满 |
| 金丹期 | 60 ~ 139 | 初期 → 大圆满 |
| 元婴期 | 140 ~ 299 | 初期 → 大圆满 |
| 化神期 | 300 ~ 619 | 初期 → 大圆满 |
| 炼虚期 | 620 ~ 1,259 | 初期 → 大圆满 |
| 合体期 | 1,260 ~ 2,539 | 初期 → 大圆满 |
| 大乘期 | 2,540 ~ 5,099 | 初期 → 半步渡劫 |
| 渡劫期 | 5,100 ~ 10,219 | 第一波天劫 → 最终天劫 |
| **飞升成神** | **10,220+** | 无上限 |

境界越高、分类体系越完善、标签越丰富，成长越快。每篇文档、每个分类都在为「成神」积累修为。

> 📖 详见 [`docs/修炼指南.md`](docs/修炼指南.md)

## 🧪 技术栈

- **框架**: React 18 + React Router 6
- **构建**: Vite 5
- **渲染**: react-markdown 9 + rehype-raw
- **图表**: recharts 2 / Mermaid 10
- **公式**: KaTeX + remark-math + rehype-katex
- **评论**: Giscus (GitHub Discussions)

## ⚙️ 配置

### 1. 阅读量计数器（GitHub Gist）

项目使用 GitHub Gist 存储页面阅读量数据，需要配置两个环境变量。

**本地开发：**

```bash
# 复制 .env.example 为 .env
cp .env.example .env
```

编辑 `.env`，填入真实值：

```
VITE_GIST_ID=your_gist_id
VITE_GIST_TOKEN=ghp_xxxxxxxxxxxx
```

| 变量 | 说明 | 获取方式 |
|------|------|---------|
| `VITE_GIST_ID` | Gist 的 ID | 创建 Gist 后从 URL 获取（`https://gist.github.com/xxx/{GIST_ID}`） |
| `VITE_GIST_TOKEN` | GitHub Personal Access Token | GitHub **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**，权限仅勾选 `gist` |

> `VITE_` 前缀是 Vite 注入环境变量的要求，必须以 `VITE_` 开头才会在客户端代码中可用。

**生产部署（GitHub Pages）：**

1. 进入 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**，添加以下两个 Secret：

| Secret 名 | 值 |
|-----------|-----|
| `VITE_GIST_ID` | 你的 Gist ID |
| `VITE_GIST_TOKEN` | 你的 GitHub Personal Access Token |

3. GitHub Actions 工作流（`.github/workflows/deploy.yml`）会自动将 Secrets 注入为构建时的环境变量：

```yaml
env:
  VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}
  VITE_GIST_TOKEN: ${{ secrets.VITE_GIST_TOKEN }}
```

4. 构建日志中会输出 Secrets 校验结果：

```bash
VITE_GIST_ID: OK     # 或 MISSING
VITE_GIST_TOKEN: OK  # 或 MISSING
```

> 如果 Secrets 未配置，阅读量功能会静默降级，不影响站点其他功能。

### 2. Giscus 评论系统

评论系统基于 [Giscus](https://giscus.app/)（GitHub Discussions），已内置在 `src/components/Comments.jsx` 中：

```js
// Giscus 配置（已预填当前仓库）
const GISCUS_CONFIG = {
  repo: 'xiuji008/xjdoc-interview',
  repoId: 'R_kgDOSoPcRg',
  category: 'Announcements',
  categoryId: 'DIC_kwDOSoPcRs4C94wU',
}
```

> Giscus 配置为**硬编码**，不需要环境变量。

**如 fork 本仓库后需自行配置：**

1. 进入 [giscus.app](https://giscus.app/)
2. 输入你的 GitHub 仓库名，点击 **生成**
3. 将生成的 `repo`、`repoId`、`category`、`categoryId` 填入 `src/components/Comments.jsx`
4. 确保目标仓库已启用 **GitHub Discussions**（仓库 **Settings** → **Features** → ✅ **Discussions**）
5. 在 Discussions 中创建对应的 Category（名称需与 `category` 一致）

### 3. GitHub Pages 部署配置

项目通过 GitHub Actions 自动部署到 GitHub Pages。

**启用步骤：**

1. 推送代码到 GitHub 仓库
2. 仓库 **Settings** → **Pages** → **Source** 选择 **GitHub Actions**
3. 每次向 `main` 分支推送代码，或手动触发 **Actions** → **Deploy to GitHub Pages** → **Run workflow**，都会自动构建并部署

**工作流文件：** `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    env:
      VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}
      VITE_GIST_TOKEN: ${{ secrets.VITE_GIST_TOKEN }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - uses: actions/deploy-pages@v4
```

## 📄 文档编写

所有文档以 Markdown 格式存放在 `docs/` 目录下，支持 YAML Front Matter：

```markdown
---
title: 文章标题
emoji: 📝
tags: [标签1, 标签2]
category: 分类名称
created: 2024-01-01
updated: 2024-01-15
description: 文章简介
---

# 正文内容从这里开始...
```

### 支持的扩展语法

- **图表**: 使用 `chart` 代码块，支持 bar / pie / line 等类型
- **流程图**: 使用 `mermaid` 代码块
- **数学公式**: 使用 `$...$` 行内公式或 `$$...$$` 块级公式（LaTeX 语法）
- **提示块**: 使用 `note` / `tip` / `warning` / `important` / `caution` 标记

## 🌐 在线访问

- **面试知识库**: https://xiuji008.github.io/xjdoc-interview/
- **作者博客**: https://xiuji008.github.io/

## 📋 更新日志

详见 [CHANGELOG.md](CHANGELOG.md) 和 [docs/更新日志.md](docs/更新日志.md)。

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来补充/修正知识点。

## 📄 许可

MIT
