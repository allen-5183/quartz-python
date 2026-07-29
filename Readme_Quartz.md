# Readme_Quartz — 專案完整說明文件

> 本文件說明 `quartz-python` 這個專案的定位、架構、設定、客製化內容、建置部署流程與維護方式。
> 目標讀者：本專案的維護者（或未來接手的自己）。

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術棧與執行環境](#2-技術棧與執行環境)
3. [目錄結構](#3-目錄結構)
4. [內容架構（課程大綱）](#4-內容架構課程大綱)
5. [設定檔剖析：quartz.config.yaml](#5-設定檔剖析quartzconfigyaml)
6. [外掛系統](#6-外掛系統)
7. [本專案對 Quartz 原始碼的客製化修改](#7-本專案對-quartz-原始碼的客製化修改)
8. [建置流程（Build Pipeline）](#8-建置流程build-pipeline)
9. [部署架構](#9-部署架構)
10. [日常維護 SOP](#10-日常維護-sop)
11. [Obsidian 撰寫規範（Quartz 相容）](#11-obsidian-撰寫規範quartz-相容)
12. [問題排除](#12-問題排除)
13. [周邊檔案說明](#13-周邊檔案說明)

---

## 1. 專案概述

| 項目 | 內容 |
| :--- | :--- |
| **專案名稱** | `quartz-python` |
| **性質** | 以 [Quartz v5](https://quartz.jzhao.xyz/) 為引擎的靜態網站產生器（SSG）專案 |
| **用途** | 將 Obsidian 中的「**Python Vault**」筆記，發布為線上 Python 程式語言課程輔助教材 |
| **網站標題** | 課程名稱： Python 程式語言 |
| **正式網址** | `https://quartz-python.pages.dev/` |
| **語系** | `zh-TW`（繁體中文） |
| **上游專案** | [jackyzha0/quartz](https://github.com/jackyzha0/quartz) v5.0.0（MIT） |
| **本專案 Repo** | `https://github.com/allen-5183/quartz-python` |
| **本機路徑** | `C:\cloud\project\quartz-python`（位於 Google Drive 同步目錄） |

### 專案定位

這**不是**一個一般的部落格，而是一套「**教材發布管線**」：

```
Obsidian Vault (Python Vault)
        │  robocopy /MIR 鏡像同步
        ▼
   content/  （71 個 Markdown 檔）
        │  npx quartz build
        ▼
   public/   （靜態 HTML/CSS/JS）
        │  git push → Cloudflare Pages 自動建置
        ▼
https://quartz-python.pages.dev/
```

專案由 `C:\cloud\project\quartz`（Allen 個人筆記庫）複製衍生而來，兩者共用同一套 Quartz 引擎與客製化程式碼，差別在於 `content/` 接的是不同的 Obsidian Vault。

---

## 2. 技術棧與執行環境

### 核心技術

| 層級 | 技術 |
| :--- | :--- |
| **靜態網站引擎** | Quartz v5.0.0 |
| **執行環境** | Node.js `>= 22`（本機鎖定 `v22.16.0`，見 `.node-version`） |
| **套件管理** | npm `>= 10.9.2` |
| **語言** | TypeScript 5.9 + Preact（JSX 元件） |
| **打包工具** | esbuild 0.27 |
| **樣式** | SCSS（`esbuild-sass-plugin`）+ LightningCSS 壓縮 |
| **Markdown 管線** | unified / remark-parse / remark-rehype |
| **平行處理** | `workerpool`（多核心平行渲染） |
| **熱重載** | `chokidar` 檔案監看 + `ws` WebSocket |
| **Git 操作** | `@napi-rs/simple-git` + `isomorphic-git` |
| **圖片處理** | `sharp`（OG image 產生） |
| **圖片檢視器** | `viewerjs` + `medium-zoom` |

### 關鍵相依套件（節錄自 `package.json`）

```
preact / preact-render-to-string    → SSR 渲染元件
unified / remark-* / rehype-*       → Markdown → HTML 轉換管線
@myriaddreamin/rehype-typst         → Typst 數學排版
esbuild-sass-plugin / lightningcss  → 樣式編譯與壓縮
workerpool                          → 平行建置
serve-handler                       → 本機預覽伺服器
yargs / @clack/prompts              → CLI 介面
react-resizable-panels              → 可調整面板
yet-another-react-lightbox          → 圖片燈箱
```

### npm scripts

| 指令 | 作用 |
| :--- | :--- |
| `npm run quartz` | 直接呼叫 CLI（`./quartz/bootstrap-cli.mjs`） |
| `npm run check` | `tsc --noEmit` 型別檢查 + Prettier 格式檢查 |
| `npm run format` | Prettier 自動格式化整個專案 |
| `npm test` | `tsx --test` 執行單元測試 |
| `npm run install-plugins` | 安裝／同步 `.quartz/plugins/` 下的外掛 |
| `npm run prebuild` | 建置前自動執行 `install-plugins` |
| `npm run profile` | 用 `0x` 產生建置效能火焰圖 |

### 常用 CLI 指令

```bash
npx quartz build                  # 建置到 public/
npx quartz build --serve          # 建置並啟動本機預覽（含熱重載）
npx quartz build --serve -d docs  # 指定其他內容目錄
npx quartz plugin install         # 安裝設定檔中宣告的外掛
npx quartz sync                   # 同步（commit / push / pull）
npx quartz update                 # 升級 Quartz 本體
```

CLI 支援的主要參數（見 `quartz/cli/args.js`）：
`-d/--directory`、`-o/--output`、`-v/--verbose`、`--concurrency`、`--serve`、`--watch`、`--port`、`--wsPort`、`--baseDir`、`--bundleInfo`。

---

## 3. 目錄結構

```
quartz-python/
├── content/                    ★ 內容來源（由 Obsidian Python Vault 鏡像同步）
│   ├── index.md                  首頁
│   ├── assets/                   圖片等附件
│   └── 0.~12. 各章節資料夾/
│
├── quartz/                     ★ Quartz 引擎本體（含本專案客製化修改）
│   ├── bootstrap-cli.mjs         CLI 進入點
│   ├── bootstrap-worker.mjs      Worker 進入點
│   ├── build.ts                  建置主流程
│   ├── worker.ts                 平行建置 worker
│   ├── cfg.ts                    設定型別定義
│   ├── cli/                      CLI 指令實作（args / handlers / helpers）
│   ├── components/               Preact UI 元件
│   │   ├── Head.tsx                <head> 區塊（客製化：注入自訂腳本）
│   │   ├── frames/DefaultFrame.tsx 版面框架（客製化：側欄拖曳把手）
│   │   └── scripts/                前端 inline 腳本
│   │       └── tableCopy.inline.ts 客製化：表格複製按鈕
│   ├── plugins/                  核心外掛機制
│   │   ├── loader/                 外掛下載／連結／設定載入
│   │   └── emitters/               輸出產生器
│   ├── processors/               Markdown 處理流程
│   ├── static/                   靜態資源
│   │   ├── sidebar-resize.js       客製化：側欄拖曳邏輯
│   │   └── viewer-init.js          客製化：圖片檢視器初始化
│   ├── styles/                   全站樣式
│   │   └── custom.scss             ★ 本專案主要視覺客製化集中處
│   └── i18n/                     多語系字串
│
├── .quartz/
│   └── plugins/                ★ 38 個社群外掛的實際安裝位置（由 lock 檔還原）
│
├── public/                     建置產物（已被 .gitignore 排除，不進版控）
│
├── quartz.config.yaml          ★ 本專案的主設定檔
├── quartz.config.default.yaml  上游預設設定（作為比對基準）
├── quartz.lock.json            外掛版本鎖定（commit hash + 安裝時間）
├── quartz.ts                   設定載入進入點
│
├── publish.bat                 一鍵同步 + 建置 + 推送腳本
├── Dockerfile                  容器化建置
├── .github/workflows/          CI/CD 工作流程
├── .vscode/                    編輯器與終端機設定
│
└── 文件/
    ├── README.md                       上游原始 README
    ├── Readme_Quartz.md                ★ 本文件
    ├── Quartz-python 維護.md            維護 SOP
    ├── Quartz-python Q&A.md             常見問題
    ├── quartz-build-troubleshooting.md  建置問題排除備忘錄
    ├── quartz-obsidian-layout-guide.md  側欄拖曳客製化實作教學
    └── Obsidian 撰寫規則（Quartz 相容）.md  撰寫規範
```

### 版控範圍（`.gitignore`）

不進版控的項目：`node_modules`、`public`（建置產物）、`prof`、`tsconfig.tsbuildinfo`、`.obsidian`、`.quartz-cache`、`private/`、`.DS_Store`，以及關鍵的一行：

```gitignore
# Prevent plugin .git dirs from being treated as submodules
.quartz/plugins/**/.git
```

這行阻止 38 個外掛各自的 `.git` 目錄被 Git 誤判為 submodule（詳見[問題排除](#12-問題排除)）。

---

## 4. 內容架構（課程大綱）

`content/` 共 **71 個 Markdown 檔**：**65 篇課程文章** + 5 個章節 `index.md` + 1 個網站首頁 `index.md`。

章節資料夾採「**數字前綴 + 中文名稱**」命名，Quartz 會依此產生排序穩定的導覽結構。

| # | 章節 | 篇數 | 內容主題 |
| :-- | :--- | :-- | :--- |
| 0 | 自動化 | 3 | VS Code 自動開啟專案環境、Python 除錯設定、Snippets 生成 |
| 1 | Python 環境設置 | 4 | VS Code 擴充套件推薦、pip 套件管理、虛擬環境、多版本執行 |
| 2 | 基本程式設計 | 6 | 內建資料型別、常值、變數、運算子、型別轉換、`print()` |
| 3 | 字串與格式化輸出入 | 3 | 字串型別、字串運算子、格式化輸出 |
| 4 | 選擇結構 | 4 | 結構化程式設計、關係運算式、邏輯運算式、選擇結構 |
| 5 | 重複結構 | 4 | `for` 迴圈、`while` 迴圈、`continue`/`break`、巢狀與無窮迴圈 |
| 6 | 串列 | 6 | 何謂串列、一維串列、迴圈操作、函式與方法、排序、二維串列 |
| 7 | 函式 | 7 | 何謂函式、內建函式、自定函式、引數傳遞、串列引數、變數作用域、遞迴 |
| 8 | 元組、字典、集合 | 4 | 元組、字典、集合、三者比較與使用時機 |
| 9 | 檔案與例外處理 | 5 | 檔案概論、資料夾建立刪除、開檔關檔、文字檔讀寫、例外處理 |
| 10 | 繪製圖表 | 4 | matplotlib、線條圖、柱狀圖、圓餅圖 |
| 11 | 視窗應用程式 | 10 | tkinter、Label、版面配置、Button、Entry、messagebox、Radiobutton、Checkbutton、PhotoImage、遊戲銷售統計實作 |
| 12 | 網頁資料擷取分析 | 5 | 網路爬蟲、urllib、requests、BeautifulSoup、爬蟲應用實例 |

### 文章 Frontmatter 慣例

```yaml
---
title: 1. 內建資料型別      # 必須包含數字前綴，與檔名一致
draft: false               # true 則不發布（remove-draft 外掛處理）
description:               # 可留空，會由 description 外掛自動摘要
date: 2026-07-14
tags: python
---
```

> **重點**：Quartz 顯示頁面標題時優先採用 `title` 欄位而非檔名，所以 `title` 少了 `1. ` 前綴，網站上就會失去編號。這是本專案最常見的踩雷點（見 `Quartz-python Q&A.md`）。

### 章節 `index.md` 範例

```yaml
---
title: 1. Python 環境設置
draft: false
---

## Python 環境設置

本章節說明如何安裝與設定 Python 開發環境，包含套件管理與虛擬環境等相關工具。
```

### 首頁 `content/index.md`

```yaml
---
title: Python 程式設計
---

# 歡迎來到我的的知識庫

## 分類

- [[Python]]
```

---

## 5. 設定檔剖析：quartz.config.yaml

設定檔分為三大區塊：`configuration`（全站設定）、`plugins`（外掛清單）、`layout`（版面群組與頁型規則）。檔首帶有 JSON Schema 註解，VS Code 可提供自動補全：

```yaml
# yaml-language-server: $schema=./quartz/plugins/quartz-plugins.schema.json
```

### 5.1 `configuration` 全站設定

| 設定 | 值 | 說明 |
| :--- | :--- | :--- |
| `pageTitle` | `課程名稱： Python 程式語言` | 網站標題 |
| `pageTitleSuffix` | `""` | 標題後綴（不使用） |
| `enableSPA` | **`false`** | **關閉** SPA 導航（上游預設為 `true`） |
| `enablePopovers` | `true` | 開啟連結預覽浮窗 |
| `analytics.provider` | `plausible` | 分析服務 |
| `locale` | `zh-TW` | 繁體中文語系 |
| `baseUrl` | `quartz-python.pages.dev` | 站台基底網址 |

`ignorePatterns`（排除不發布的目錄，使用 glob）：

```yaml
- "**/筆記軟件/**"
- "**/每日筆記/**"
- "**/模板/**"
- "**/private/**"
- "**/templates/**"
- "**/.obsidian/**"
```

### 5.2 主題與字體

```yaml
theme:
  fontOrigin: googleFonts      # 由 Google Fonts 載入
  cdnCaching: true
  typography:
    header: Noto Sans TC
    body:   Noto Sans TC
    code:   JetBrains Mono
```

明暗兩套色盤皆有完整定義（`light` / `lightgray` / `gray` / `darkgray` / `dark` / `secondary` / `tertiary` / `highlight` / `textHighlight`）：

| Token | 亮色模式 | 暗色模式 |
| :--- | :--- | :--- |
| `light` | `#faf8f8` | `#161618` |
| `dark` | `#2b2b2b` | `#ebebec` |
| `secondary` | `#284b63` | `#7b97aa` |
| `tertiary` | `#84a59d` | `#84a59d` |
| `textHighlight` | `#fff23688` | `#b3aa0288` |

> 註：`custom.scss` 會再以 `!important` 覆寫字體堆疊，實際生效的是 `Inter + Noto Sans TC` 的中英混排組合（見[第 7 節](#7-本專案對-quartz-原始碼的客製化修改)）。

### 5.3 `layout` 版面規則

定義了一個名為 `toolbar` 的橫向元件群組（搜尋 / 深色模式 / 閱讀模式擠在同一列）：

```yaml
layout:
  groups:
    toolbar:
      priority: 35
      direction: row
      gap: 0.5rem
```

並針對不同頁型調整側欄：

| 頁型 | 規則 |
| :--- | :--- |
| `404` | 清空 `beforeBody` / `left` / `right`，呈現極簡錯誤頁 |
| `content` | 使用預設完整版面 |
| `folder` | 排除 `reader-mode`，右側欄清空 |
| `tag` | 排除 `reader-mode`，右側欄清空 |
| `canvas` / `bases` | 預設 |

---

## 6. 外掛系統

### 6.1 運作機制

Quartz v5 的外掛不放在 `node_modules`，而是**從 GitHub 直接下載到 `.quartz/plugins/`**：

1. `quartz.config.yaml` 的 `plugins:` 區塊宣告要用哪些外掛（`source: github:quartz-community/xxx`）。
2. `npm run install-plugins`（或 `prebuild` 自動觸發）讀取設定，由 `quartz/plugins/loader/gitLoader.ts` 逐一 clone。
3. 版本鎖定寫入 `quartz.lock.json`（記錄 `resolved` URL、`commit` hash、`installedAt`）。
4. `linkPeerDependencies()` 把外掛需要的 peer 相依從主專案連結／拷貝過去。
5. 產生 `.quartz/plugins/index.ts` 索引，供 esbuild 打包時解析。

設定檔共宣告 **46 個外掛條目**：**38 個啟用**、8 個停用。已安裝於 `.quartz/plugins/` 的有 38 個目錄。

### 6.2 外掛分類總覽

**Markdown 解析與轉換（`order` 決定執行順序）**

| 外掛 | order | 說明 |
| :--- | :-- | :--- |
| `note-properties` | 5 | 在文章上方顯示 frontmatter 屬性表（可摺疊，只顯示 description/tags/aliases/date） |
| `created-modified-date` | 10 | 建立／修改日期（優先序：frontmatter → git → filesystem） |
| `syntax-highlighting` | 20 | 程式碼高亮（亮 `github-light` / 暗 `github-dark`），**開啟複製按鈕** |
| `spacer` | 25 | 版面間隔（僅手機版） |
| `obsidian-flavored-markdown` | 30 | Obsidian 語法：wikilinks、callouts、mermaid、tag、箭頭、區塊引用、YouTube/影片嵌入、checkbox |
| `github-flavored-markdown` | 40 | GFM 表格、刪除線、任務清單 |
| `unlisted-pages` | 45 | 不列入索引的頁面 |
| `bases-page` | 50 | Obsidian Bases 資料庫頁 |
| `obsidian-plugin-excalidraw` | 50 | Excalidraw 手繪圖（互動式、自動明暗、留白 20） |
| `table-of-contents` | 50 | 目錄（右側欄，priority 30） |
| `crawl-links` | 60 | 連結解析（`markdownLinkResolution: shortest`） |
| `description` | 70 | 自動產生頁面描述 |
| `latex` | 80 | 數學公式（KaTeX） |
| `hard-line-breaks` | 90 | 單一換行即斷行 |

**頁面產生器（Emitters）**

`content-page`、`folder-page`、`tag-page`、`canvas-page`、`content-index`（sitemap + RSS）、`alias-redirects`、`og-image`、`favicon`、`cname`、`fonts`、`remove-draft`、`encrypted-pages`（PBKDF2 600,000 次迭代的密碼保護頁）。

**UI 元件與位置**

| 外掛 | 位置 | priority | 備註 |
| :--- | :--- | :-- | :--- |
| `page-title` | left | 10 | 站名 |
| `search` | left | 20 | 屬 `toolbar` 群組，`grow: true` |
| `darkmode` | left | 30 | 屬 `toolbar` 群組 |
| `reader-mode` | left | 35 | 屬 `toolbar` 群組 |
| `explorer` | left | 50 | 檔案樹瀏覽器 |
| `graph` | right | 10 | 關聯圖譜 |
| `table-of-contents` | right | 30 | 目錄 |
| `backlinks` | right | 50 | 反向連結 |
| `breadcrumbs` | beforeBody | 5 | 麵包屑（`condition: not-index`） |
| `article-title` | beforeBody | 10 | 文章標題 |
| `note-properties` | beforeBody | 15 | 屬性表 |
| `content-meta` | beforeBody | 20 | 日期／閱讀時間／**瀏覽人數** |
| `footer` | — | — | 頁尾（`links: {}` 清空上游預設連結） |

**佈景主題**

```yaml
- source:
    name: quartz-themes
    repo: github:saberzero1/quartz-themes
    subdir: plugin
  enabled: true
  options:
    theme: dracula-for-obsidian
```

套用 Obsidian 社群的 **Dracula** 主題。注意此主題以高權重 CSS 寫死字體，因此 `custom.scss` 需用 `html body { ... !important }` 才能覆蓋。

### 6.3 停用的外掛（8 個）

`citations`、`ox-hugo`、`roam`、`explicit-publish`、`stacked-pages`、`comments`（giscus）、`recent-notes`、`tag-list`。

保留設定但停用，日後需要時把 `enabled` 改成 `true` 即可。

---

## 7. 本專案對 Quartz 原始碼的客製化修改

這是本專案與上游 Quartz 最大的差異區。所有修改都直接改在 `quartz/` 目錄內（非 fork 分支），升級 Quartz 時需注意衝突。

### 7.1 Obsidian 風格可拖曳滿版側欄

完整實作教學見 `quartz-obsidian-layout-guide.md`，涉及四個檔案：

| 檔案 | 修改內容 |
| :--- | :--- |
| `quartz/components/frames/DefaultFrame.tsx` | 在左右側欄各插入一個 `.sidebar-resize-handle` 拖曳把手 `<div>`（帶 `role="separator"`、`aria-orientation="vertical"`） |
| `quartz/static/sidebar-resize.js` | 拖曳邏輯：`mousedown` → `mousemove` 計算寬度 → 寫入 CSS 變數 → `mouseup` 存 LocalStorage；**雙擊重置**為 320px；寬度限制 150–500px；載入前先讀 LocalStorage 避免 FOUC |
| `quartz/components/Head.tsx` | 於 `<head>` 引入 `/static/sidebar-resize.js` |
| `quartz/styles/custom.scss` | 把手視覺樣式 + 解除 `#quartz-body` 的 `max-width: min(100%, 1500px)` 限制，改為 `grid-template-columns: var(--left-sidebar-width, 320px) 1fr var(--right-sidebar-width, 320px) !important` |

中間文章區另限制 `max-width: 800px` 並置中，兼顧滿版側欄與 Obsidian 式的可讀行長。手機版透過 `@media all and ($mobile)` 隱藏把手。

> 為什麼不能用 Quartz 內建的 `desktop-only`？因為它包含 `display: contents`，會讓把手失去實體寬高而無法點擊。

### 7.2 表格複製按鈕

- **新檔**：`quartz/components/scripts/tableCopy.inline.ts`
  為每個 `.table-container > table` 動態掛上複製按鈕，點擊後把表格序列化為 **Markdown 表格語法**寫入剪貼簿，成功後圖示切換為打勾（Lucide Copy / Check SVG）。監聽 Quartz 的 `nav` 事件以支援 SPA 導航。
- **註冊點**：`quartz/plugins/emitters/componentResources.ts` 的 `addGlobalPageResources()` 中 `componentResources.afterDOMLoaded.push(tableCopyScript)`。
- **樣式**：`custom.scss` 的 `.table-copy-btn`（預設 `opacity: 0`，滑鼠移入 `.table-container` 才浮現）。

### 7.3 瀏覽人數計數器（Vercount）

於 `componentResources.ts` 注入一段腳本，串接 **Vercount**（不蒜子相容服務，`https://vercount.one/js`）：

- 以 `sessionStorage` 的 `pv_session_<pathname>` 標記，**避免 F5 重整重複 +1**。
- 以 `localStorage` 的 `pv_cache_<pathname>` 快取數字，重整時先顯示舊值再更新。
- 用 `MutationObserver` 監聽數字節點變化並回寫快取。
- 同時在載入與 `nav` 事件觸發。

顯示位置在 `.quartz/plugins/content-meta/src/components/ContentMeta.tsx`：

```tsx
<span id="busuanzi_container_page_pv">
  瀏覽人數 <span id="busuanzi_value_page_pv">--</span> 次
</span>
```

> 原本使用不蒜子（Busuanzi）CDN，後於 commit `675652b` 改為 Vercount，變數名稱沿用不蒜子的慣例以維持相容。

### 7.4 圖片檢視器

`quartz/static/viewer-init.js` 在 `DOMContentLoaded` 時對 `<article>` 初始化 ViewerJS（工具列開啟、可移動／縮放／旋轉／縮放比例），由 `Head.tsx` 引入。

### 7.5 字體最佳化（`custom.scss`）

| 項目 | 修改前 | 修改後 |
| :--- | :--- | :--- |
| 英文/數字字體 | Noto Sans TC（兼顧英文，非最佳） | **Inter**（UI/閱讀優化） |
| 中文字體 | Noto Sans TC | Noto Sans TC（保留） |
| 不存在的字體 | `"Taipei Sans TC"`（Google Fonts 無此字體） | 已移除 |
| 系統備援 | 無 | `PingFang TC`(Mac) / `Microsoft JhengHei`(Win) |
| 行高 | 瀏覽器預設 | 內文 `1.8`、標題 `1.3` |
| 字距 | 未設定 | 內文 `0.01em`、標題 `0.02em` |
| 字體渲染 | 未設定 | `antialiased` + `optimizeLegibility` |
| 程式連字 | 未開啟 | 開啟（`->`、`=>`、`!=` 自動合字） |

原理：CSS 字體堆疊的 fallback 機制讓不含 CJK 字元的 Inter 優先渲染英數，中文自動回落到 Noto Sans TC，兩者視覺重量相近，是中英混排的常見最佳解。

```scss
--headerFont: "Inter", "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", sans-serif !important;
--bodyFont:   同上;
--codeFont:   "JetBrains Mono", "Fira Code", "Cascadia Code", "Source Code Pro", "Consolas", monospace !important;
```

### 7.6 其他 CSS 修正（皆在 `custom.scss`）

| 區塊 | 解決的問題 |
| :--- | :--- |
| **TOC 摺疊修正** | 預設把摺疊後的 TOC 高度寫死 `1.4rem`，但全域 `h3` 的 margin 使標題超過此高度導致文字被裁切消失。改為取消固定高度、直接 `display: none` 隱藏內容清單、重置 `h3` margin |
| **自訂捲軸** | 把 Windows 預設的白色粗捲軸改為 6px 暗色細捲軸（`scrollbar-width: thin` + `::-webkit-scrollbar`） |
| **圖片寬度控制** | 支援 Obsidian/HackMD 風格的 URL hash 縮放語法：`![](圖片#w50)` → 顯示 50% 寬，提供 `#w10` ~ `#w100` |
| **Note Properties 修正** | 屬性表改 `table-layout: fixed`，key 欄固定 120px 不換行，value 欄自動 |
| **Markdown 表格優化** | 加上垂直與水平格線、增加內距 `0.6rem 1rem`、表頭淺色底、`word-break: normal` 避免中文被過度切斷、每格 `min-width: 100px` |
| **Callout 內程式碼修正** | 修復 Callout 內程式碼區塊右框線與複製按鈕被裁切；複製按鈕縮小為 1.2rem、`opacity 0.6`、hover 全顯 |
| **段落排版** | `overflow-wrap: break-word` + `text-wrap: pretty`，改善中文換行與孤行 |

### 7.7 建置器修正（`gitLoader.ts`）

針對 **Windows + Google Drive** 環境的兩處關鍵修改，詳見[第 12 節](#12-問題排除)：

- `trySymlink()`：Windows 下任何連結建立錯誤都退回 `junction` 或 `fs.cpSync` 拷貝（原本只處理 `EPERM`，Google Drive 拋的是 `EISDIR`）。
- `linkPeerDependencies()`：加入**快取跳過機制**，相依目錄已存在且非空就跳過拷貝——建置時間從 7 分鐘降到 11 秒。

### 7.8 `install-plugins.ts` 修正

原本會 import `quartz.ts`，間接載入含 `import "./base.scss"` 的元件，導致 Node/TSX 拋 `ERR_UNKNOWN_FILE_EXTENSION`。改為用 `yaml` 解析器直接讀 `quartz.config.yaml` 取出外掛清單，不再載入 `quartz.ts`。

---

## 8. 建置流程（Build Pipeline）

`quartz/build.ts` 的 `buildQuartz()` 主要階段：

```
1. glob      掃描 content/ 取得所有 Markdown 路徑
             → 輸出 "Found N input files from `content`"
2. parse     unified 管線：remark-parse → transformers → remark-rehype
             （由 workerpool 平行處理）
3. filter    套用 filters（remove-draft、explicit-publish…）
4. emit      執行所有 emitters 產生 HTML / CSS / JS / RSS / sitemap / OG image
             → 輸出 "Emitted N files to `public`"
```

搭配 `--serve` 時額外啟動：

- `startWatching()`：`chokidar` 監看 `content/`。
- `rebuild()`：增量重建變更的檔案。
- WebSocket（預設 `--wsPort`）通知瀏覽器熱重載。
- `serve-handler` 提供本機靜態伺服器（預設 `http://localhost:8080`）。

建置快取存於 `quartz/.quartz-cache/`（已 gitignore）。

---

## 9. 部署架構

### 9.1 正式站：Cloudflare Pages

```
本機 content/ 更新
      ↓ git push
GitHub: allen-5183/quartz-python (main)
      ↓ webhook 觸發
Cloudflare Pages 自動建置（執行 npx quartz build）
      ↓ 數十秒
https://quartz-python.pages.dev/
```

**重點**：`public/` 被 `.gitignore` 排除，**不進版控**。Cloudflare 是拉取原始碼後在雲端自行建置的，本機的 `public/` 只用於預覽。`public/CNAME` 內容為 `quartz-python.pages.dev`，由 `cname` 外掛在建置時產生。

### 9.2 `publish.bat` 一鍵發布

腳本三階段：

```bat
1. Sync Vault   robocopy "Python Vault" → content\（/MIR 鏡像）
2. Quartz Build npx quartz build
3. Git Push     git add . → git commit -m "update notes" → git push
```

關鍵設計與注意事項：

| 項目 | 說明 |
| :--- | :--- |
| **字碼頁** | 檔案為 UTF-8（無 BOM）且含中文路徑，開頭以 `chcp 65001` 切換，結束時還原原本字碼頁。否則 cmd 會以 CP950 解讀而讓 `模板` 變亂碼 |
| **換行字元** | 必須是 **CRLF**。`cmd.exe` 解析 LF-only 的 `.bat` 時，`goto`／標籤與 `( )` 區塊可能誤判。`.gitattributes` 已加上 `*.bat text eol=crlf` 確保 checkout 後不被還原成 LF |
| **`/XF "index.md"`** | **關鍵**。首頁與 5 個章節目錄頁只存在於 `content\`，Vault 內並沒有；若不排除，`/MIR` 會把這 6 個 `index.md` 全部刪光 |
| **`/XD ".obsidian" "模板"`** | 排除的目錄「不同步也不刪除」，所以之後仍要用 `if exist ... rmdir` 手動清掉殘留的 `content\模板` |
| **robocopy 離開碼** | 0–7 皆屬正常（本專案穩定回傳 **2**＝偵測到 6 個 index.md 屬「額外檔案」），**8 以上**才是真失敗，故判斷式為 `if errorlevel 8` |
| **errorlevel 清除** | robocopy 正常結束仍留下非 0 的 errorlevel，其後以 `ver >nul` 重置，避免後續指令被誤判為失敗 |
| **空提交處理** | 先用 `git diff --cached --quiet` 判斷有無暫存變更，避免「沒有變更」時 `git commit` 回傳 1 而中斷腳本 |
| **推送前確認** | Git Push 前會暫停並提醒確認 Google Drive 已同步完成（見 10.3），可按 Ctrl+C 中止 |

### 9.3 Docker

```dockerfile
FROM node:22-slim AS builder
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json* .
COPY quartz/ ./quartz/
COPY quartz.lock.json .
RUN npm ci; npx quartz plugin install

FROM node:22-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ /usr/src/app/
COPY . .
CMD ["npx", "quartz", "build", "--serve"]
```

多階段建置：第一階段裝相依與外掛（可利用 layer 快取），第二階段複製內容並啟動預覽伺服器。

### 9.4 GitHub Actions（沿用上游）

| 工作流程 | 用途 |
| :--- | :--- |
| `ci.yaml` | Build and Test |
| `build-preview.yaml` | Build Preview Deployment |
| `deploy-preview.yaml` | Upload Preview Deployment |
| `deploy-v5.yaml` | Deploy v5 Preview |
| `docker-build-push.yaml` | Docker build & push image |

這些是上游 Quartz 的 CI，本專案實際部署靠 Cloudflare Pages，非 Actions。

---

## 10. 日常維護 SOP

### 10.1 更新內容（最常用）

**Step 1 — 清空 content 但保留各層 `index.md`**

```cmd
attrib +h "c:\cloud\project\quartz-python\content\index.md" /S && del /S /Q "c:\cloud\project\quartz-python\content\*" && attrib -h "c:\cloud\project\quartz-python\content\index.md" /S && for /f "delims=" %d in ('dir /s /b /ad "c:\cloud\project\quartz-python\content" ^| findstr /i /e "\assets"') do rmdir /s /q "%d"
```

**Step 2 — 從 Obsidian Vault 鏡像同步**

```cmd
robocopy "C:\Users\allen\Obsidian Vault\Python Vault" "C:\cloud\project\quartz-python\content" /MIR /XD ".obsidian" "模板" /XF "index.md"
rmdir /s /q "C:\cloud\project\quartz-python\content\模板"
```

| 參數 | 意義 |
| :--- | :--- |
| `/MIR` | 鏡像複製（來源沒有的檔案，目的地會被自動刪除，所以其實不必事先手動清空） |
| `/XD ".obsidian" "模板"` | 排除目錄（eXclude Directory） |
| `/XF "index.md"` | 排除檔案（eXclude File），保留已編輯好的首頁 |

**Step 3 — 本機驗證**

```bash
npx quartz build --serve
```

開 `http://localhost:8080` 檢查版面是否正常。

**Step 4 — 推送**

```bash
git add .
git commit -m "update notes"
git push
```

**Step 5 — 等待 Cloudflare 自動重新部署**（數十秒），確認 `https://quartz-python.pages.dev/` 已更新。

### 10.2 從既有專案複製出新站台

1. **複製 quartz 專案**
   ```bash
   robocopy "c:\cloud\project\quartz" "c:\cloud\project\quartz-python"
   ```
2. **刪除 `.git`**，避免繼承舊歷史。
3. **清空 `content/`**
   ```cmd
   attrib +h "...\content\index.md" && del /S /Q "...\content\*" && for /D %p in ("...\content\*") do rmdir /S /Q "%p" & attrib -h "...\content\index.md"
   ```
4. **接入新的 Vault**（同 10.1 Step 2）。
5. **建立首頁** `content/index.md`。
6. **發布到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "first publish"
   git remote add origin https://github.com/allen-5183/quartz-python.git
   git branch -M main
   git push -u origin main
   git remote -v          # 驗證 remote
   ```

### 10.3 Google Drive 同步注意事項

專案位於 Google Drive 同步目錄，檔案處於「雲端串流」狀態，常因同步時間差導致本機／GitHub／Cloudflare 三方脫節。

- ✅ **推送前務必確認 Google Drive 圖示顯示「已同步完成」**。若還在轉圈圈，`.git` 的隱藏索引檔尚未上傳完畢，強行 `git push` 會讓 GitHub 收到不完整的檔案結構，Cloudflare 便抓到舊資料。
- ⚠️ Git 在雲端串流目錄下可能因檔案鎖定（Locking）或虛擬路徑問題，讓 `git rm` / `git status` 偵測不到或拒絕存取。
- 🛟 **終極解法**：把整個專案複製到非同步目錄（如桌面或 `C:\` 根目錄），在該處執行 Git 清理與 `push`，等 Cloudflare 部署成功後再複製回 Google Drive 覆蓋。

---

## 11. Obsidian 撰寫規範（Quartz 相容）

完整內容見 `Obsidian 撰寫規則（Quartz 相容）.md`。核心觀念：

| 工具 | Markdown 解析器 | 特性 |
| :--- | :--- | :--- |
| Obsidian | 自訂（寬鬆） | 容忍縮排不一致、非標準語法 |
| Quartz | **CommonMark** 標準 | 嚴格遵守縮排與語法規則 |

**Obsidian 顯示正常 ≠ Quartz 一定正常。** 撰寫時一律以 CommonMark 為準。

### 規則一：編號清單 + 程式碼區塊，中間不能有空行

CommonMark 規定空行會中斷列表，程式碼區塊會脫離清單變成頂層區塊。

```markdown
❌  1. `.vscode/settings.json`
                              ← 這行空行會讓清單斷掉
       ```json ... ```

✅  1. `.vscode/settings.json`
       ```json ... ```
```

程式碼區塊縮排 **3 個空格**（對齊 `1. ` 之後的內容起點）。

### 規則二：編號清單 + 圖片，同樣不能有空行

```markdown
✅  1. 開啟命令面板
       ![[assets/screenshot.png]]

    2. 選擇允許
```

### 規則三：Frontmatter 的 `title` 必須含編號前綴

```yaml
❌  title: 在 Visual Studio Code IDE 自動開啟專案環境設置
✅  title: "1. 在 Visual Studio Code IDE 自動開啟專案環境設置"
```

Quartz 優先使用 `title` 而非檔名顯示頁面標題。

### 規則四：巢狀清單統一用 3 個空格縮排，不混用 Tab

### 規則五：Callout 語法兩端通用，可安心使用

`> [!NOTE]`、`> [!TIP]`、`> [!WARNING]`、`> [!IMPORTANT]`、`> [!example]`、`> [!info]` 皆支援。

### 規則六：圖片語法

| 用途 | Obsidian 寫法 | Quartz 支援 |
| :--- | :--- | :--- |
| 一般圖片 | `![[image.png]]` | ✅ |
| 指定寬度 | `![[image.png\|500]]` | ✅ |
| 標準 Markdown | `![alt](path/to/image.png)` | ✅ 最相容 |

另可用本專案自訂的 hash 語法縮放：`![](image.png#w50)` → 50% 寬。

### 推送前快速檢查清單

- [ ] Frontmatter 的 `title` 含正確編號前綴
- [ ] 編號清單中，項目文字與程式碼區塊／圖片之間**沒有空白行**
- [ ] 清單內程式碼區塊縮排 **3 個空格**（不是 Tab）
- [ ] 巢狀清單使用 **3 個空格**縮排，不混用 Tab

---

## 12. 問題排除

完整內容見 `quartz-build-troubleshooting.md`。以下為在 **Windows + Google Drive（或其他虛擬／慢速雲端硬碟）**環境下的已知問題。

### 快速排除指令

**清除 Git 鎖定與殘留程序**（`Ctrl+C` 中斷建置後常見）：

```powershell
Stop-Process -Name git -Force
Remove-Item -Force .git/index.lock -ErrorAction SilentlyContinue
```

**重建外掛索引**（esbuild 報 `Could not resolve "../../.quartz/plugins"`）：

1. 建立臨時腳本 `scratch_gen_index.ts`：
   ```typescript
   import { regeneratePluginIndex } from "./quartz/plugins/loader/gitLoader.js"
   regeneratePluginIndex({ verbose: true }).catch(console.error)
   ```
2. 執行 `npx tsx scratch_gen_index.ts`，成功後刪除該檔。

### 已知問題與修復原理

| # | 問題現象 | 根本原因 | 已採取的修復 |
| :-- | :--- | :--- | :--- |
| 1 | 外掛載入失敗 `Failed to instantiate plugin...` / `Cannot find package '@napi-rs/simple-git'`，外掛的 `node_modules` 為空或損壞 | Google Drive 虛擬磁碟不支援 Windows symlink 與 junction；原程式碼的 fallback 只判斷 `EPERM`，但 Google Drive 拋的是 `EISDIR` | 修改 `gitLoader.ts` 的 `trySymlink()`，Windows 下遇到任何建立連結錯誤一律退回 `junction` 或 `fs.cpSync`；`installPlugin` 在外掛已下載時也會執行連結檢查修復 |
| 2 | `npx quartz build` 卡在 `Quartz v5.0.0` 數分鐘無輸出 | 因不支援 symlink，外掛相依是實體拷貝；原程式碼每次建置都刪除並重新拷貝，在 Google Drive 上對 38 個外掛重複拷貝數萬個小檔案 | 在 `linkPeerDependencies()` 加入快取跳過機制：目錄已存在且非空即跳過。**建置時間 7 分鐘 → 11 秒** |
| 3 | `npm run install-plugins` 報 `ERR_UNKNOWN_FILE_EXTENSION: Unknown file extension ".scss"` | `install-plugins.ts` 原本 import `quartz.ts`，間接載入含 `import "./base.scss"` 的元件，Node 無法解析 scss | 改用 `yaml` 解析器直接讀 `quartz.config.yaml` 取外掛清單，不再載入 `quartz.ts` |
| 4 | `publish.bat` 卡在 Git Push 階段，游標一直閃爍 | 前面步驟被中斷導致 `.git/index.lock` 未清理，或終端機背景認證卡住 | 強制結束殘留 git 程序並清理 `index.lock` |
| 5 | GitHub 網頁上 `.quartz/plugins/` 底下的資料夾（如 `crawl-links`）變成帶白色箭頭、點不進去的綠色圖示 | Git 把外掛目錄當成 submodule | 在 `.gitignore` 加上 `.quartz/plugins/**/.git` |

### 網站標題沒有編號

見 `Quartz-python Q&A.md`：Quartz 渲染標題時優先使用 frontmatter 的 `title`，`title` 沒寫 `1. ` 前綴，網站上自然就沒編號。解法是替每個檔案的 `title` 補上對應數字前綴。

---

## 13. 周邊檔案說明

### 文件檔

| 檔案 | 內容 |
| :--- | :--- |
| `README.md` | 上游 Quartz 原始 README（未改動） |
| `Readme_Quartz.md` | **本文件** |
| `Quartz-python 維護.md` | 維護 SOP：本機啟動、樣板複製、日後更新、Google Drive 注意事項、字體最佳化對照表 |
| `Quartz-python Q&A.md` | Q&A：標題編號消失問題 |
| `quartz-build-troubleshooting.md` | 建置與部署問題排除備忘錄 |
| `quartz-obsidian-layout-guide.md` | 可拖曳滿版側欄的完整實作教學（四步驟，含完整程式碼） |
| `CODE_OF_CONDUCT.md` / `LICENSE.txt` | 上游附帶（MIT） |

### 設定與型別檔

| 檔案 | 用途 |
| :--- | :--- |
| `quartz.config.yaml` | 主設定檔 |
| `quartz.config.default.yaml` | 上游預設設定（保留作為比對基準，方便 diff 出自己改了什麼） |
| `quartz.lock.json` | 38 個外掛的版本鎖定（source / resolved / commit / installedAt） |
| `quartz.ts` | 載入設定與版面的進入點 |
| `tsconfig.json` / `globals.d.ts` / `index.d.ts` | TypeScript 設定與全域型別宣告 |
| `.prettierrc` / `.prettierignore` | 格式化規則 |
| `.node-version` | `v22.16.0` |
| `.npmrc` / `.gitattributes` | npm 與 Git 屬性設定 |

### VS Code 工作區設定

`.vscode/settings.json`：

```json
{
  "terminal.integrated.defaultProfile.windows": "quartz-python",
  "terminal.integrated.enablePersistentSessions": true,
  "terminal.integrated.fontFamily": "Consolas, 'Microsoft JhengHei', monospace",
  "terminal.integrated.fontSize": 18,
  "editor.fontSize": 18,
  "editor.lineHeight": 1.8,
  "files.encoding": "utf8",
  "files.autoGuessEncoding": true,
  "markdown.preview.fontFamily": "'Microsoft JhengHei', 'PingFang TC', sans-serif"
}
```

`.vscode/tasks.json`：定義 `Auto Terminal` 任務，`runOn: folderOpen` 讓每次開啟專案時自動開一個已 `cd` 到專案根目錄的 cmd 終端機。

### 除錯用臨時腳本（可安全刪除）

| 檔案 | 用途 |
| :--- | :--- |
| `test-path.cjs` | 驗證 Windows 路徑 vs POSIX 路徑在 `fs.lstatSync` 下的行為差異（中文 URL encode 路徑問題） |
| `test-article.cjs` | 模擬 `serve-handler` 的路徑解析邏輯，並對本機 8080 埠發 HTTP 請求驗證文章網址 |
| `test-server.cjs` | 批次測試各章節資料夾 URL 的 HTTP 狀態碼與重導向 |
| `scratch_robo/` | robocopy 與 UTF-8 批次檔測試沙箱（`src/`、`dst/`、`test_utf8.bat`） |
| `scratch_test/` | 資料夾操作測試沙箱（`folder1/`、`folder2/`） |

這三支 `test-*.cjs` 是為了排查「中文資料夾名稱經 URL encode 後，本機預覽伺服器回 404」而寫的一次性診斷腳本，非專案測試套件。

---

## 附錄：常用指令速查

```bash
# 本機開發
npx quartz build --serve            # 建置 + 預覽 (http://localhost:8080)
npx quartz build                    # 只建置到 public/

# 外掛
npm run install-plugins             # 安裝／同步外掛
npx quartz plugin install           # 同上（CLI 版）

# 品質檢查
npm run check                       # tsc 型別檢查 + Prettier 檢查
npm run format                      # Prettier 自動格式化
npm test                            # 單元測試

# 內容同步（Windows cmd）
robocopy "C:\Users\allen\Obsidian Vault\Python Vault" "C:\cloud\project\quartz-python\content" /MIR /XD ".obsidian" "模板" /XF "index.md"

# 發布
git add . && git commit -m "update notes" && git push

# 卡住時的急救
Stop-Process -Name git -Force
Remove-Item -Force .git/index.lock -ErrorAction SilentlyContinue
```
