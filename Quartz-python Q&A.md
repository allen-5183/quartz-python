# Quartz Python Q&A

## Q1:
為何 網站上沒有顯示出項目數字的編號，例如: 1. 在 Visual Studio Code IDE 自動開啟專案環境設置

## A1: 
根本原因：`Frontmatter` 的 `title` 設定。

```yaml
---
title: 在 Visual Studio Code IDE 自動開啟專案環境設置  ← 沒有 "1." 前綴！
draft: false
...
---

```

`Quartz` 渲染網頁標題時，優先使用 `title` 欄位的值，而不是檔案名稱。由於你的 `title` 沒有包含 `1.`，所以網站上顯示時就沒有編號。

**解決方案**:

只需在每個 `Markdown` 檔案的 `title frontmatter` 加上對應的數字前綴：

1. 在 Visual Studio Code IDE 自動開啟專案環境設置.md：

## Q2:
為何 content/ 資料夾裡的檔案已經改好了，網站上發布的標題卻還是舊的、跟 content 資料夾對不起來？（例如 MCP 資料夾下，網站顯示「1. MYSQL MCP」，但 content 裡根本沒有這個檔名，只有「2. Antigravity 環境中使用 MCP MySQL 與.md」）

## A2:
根本原因：跟 Q1 一樣，還是 `Frontmatter` 的 `title` 欄位，而不是 build/部署流程壞掉。

先排除「忘記 push」的可能：

```bash
git status   # working tree clean
git log      # 最新 commit 已經在 origin/main
```

確認 GitHub 上的內容跟本機 content/ 一致後，再比對每個檔案的 `title` 是不是跟檔名/內容對得上，才發現問題所在：

```yaml
---
title: 1. MYSQL MCP          ← 檔案曾經叫這個名字，但後來重新命名成檔案「2. Antigravity 環境中使用 MCP MySQL 與.md」
draft: false
...
---
```

`Quartz` 側欄與頁面標題永遠是用 `title frontmatter` 渲染，不是用檔名。重新命名或擴充檔案內容時，如果沒有同步把 `title` 也改掉，網站上顯示的還是改名前的舊標題，看起來就像「content 資料夾跟網站不同步」，但其實只是標題沒跟著更新，git/build/部署流程完全正常。

**解決方案**:

1. 把該檔案的 `title` 改成跟新檔名一致的完整標題：

```yaml
title: 2. Antigravity 環境中使用 MCP MySQL 與 MSSQL 服務
```

2. **務必同步修正 Obsidian Vault（`C:\Usersllen\Obsidian Vault\Python Vault`）裡的同名檔案**，不能只改 `content/`！因為 `publish.bat` 每次都會用 `robocopy /MIR` 把 vault 鏡像同步進 `content/`，如果只改 `content/` 沒改 vault，下次發布時舊的 `title` 又會被蓋回來。
3. 照正常流程跑 `publish.bat`（build 檢查 → 確認 Google Drive 已同步完成 → git push），確認網站上標題已更新。

## Q2:
為何 content/ 資料夾裡的檔案已經改好了，網站上發布的標題卻還是舊的、跟 content 資料夾對不起來？（例如 MCP 資料夾下，網站顯示「1. MYSQL MCP」，但 content 裡根本沒有這個檔名，只有「2. Antigravity 環境中使用 MCP MySQL 與.md」）

## A2:
根本原因：跟 Q1 一樣，還是 `Frontmatter` 的 `title` 欄位，而不是 build/部署流程壞掉。

先排除「忘記 push」的可能：

```bash
git status   # working tree clean
git log      # 最新 commit 已經在 origin/main
```

確認 GitHub 上的內容跟本機 content/ 一致後，再比對每個檔案的 `title` 是不是跟檔名/內容對得上，才發現問題所在：

```yaml
---
title: 1. MYSQL MCP          ← 檔案曾經叫這個名字，但後來重新命名成檔案「2. Antigravity 環境中使用 MCP MySQL 與.md」
draft: false
...
---
```

`Quartz` 側欄與頁面標題永遠是用 `title frontmatter` 渲染，不是用檔名。重新命名或擴充檔案內容時，如果沒有同步把 `title` 也改掉，網站上顯示的還是改名前的舊標題，看起來就像「content 資料夾跟網站不同步」，但其實只是標題沒跟著更新，git/build/部署流程完全正常。

**解決方案**:

1. 把該檔案的 `title` 改成跟新檔名一致的完整標題：

```yaml
title: 2. Antigravity 環境中使用 MCP MySQL 與 MSSQL 服務
```

2. **務必同步修正 Obsidian Vault（`C:\Users\allen\Obsidian Vault\Python Vault`）裡的同名檔案**，不能只改 `content/`！因為 `publish.bat` 每次都會用 `robocopy /MIR` 把 vault 鏡像同步進 `content/`，如果只改 `content/` 沒改 vault，下次發布時舊的 `title` 又會被蓋回來。
3. 照正常流程跑 `publish.bat`（build 檢查 → 確認 Google Drive 已同步完成 → git push），確認網站上標題已更新。
