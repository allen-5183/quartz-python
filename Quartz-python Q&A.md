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

2. **務必同步修正 Obsidian Vault（`C:\Users\allen\Obsidian Vault\Python Vault`）裡的同名檔案**，不能只改 `content/`！因為 `publish.bat` 每次都會用 `robocopy /MIR` 把 vault 鏡像同步進 `content/`，如果只改 `content/` 沒改 vault，下次發布時舊的 `title` 又會被蓋回來。
3. 照正常流程跑 `publish.bat`（build 檢查 → 確認 Google Drive 已同步完成 → git push），確認網站上標題已更新。

## Q3:
為什麼跑 `publish.bat` 的時候，終端機畫面上出現一堆亂碼、`'...' is not recognized as an internal or external command` 這類錯誤，而且事後發現 GitHub 上的 `content/` 整個被清空、網站也跟著壞掉了？

## A3:
根本原因：這台機器的 `cmd.exe` 在 `chcp 65001`（UTF-8 字碼頁）底下解析含有大段中文的 `.bat` 檔案時，會不定期把相鄰兩行「黏」在一起、切錯指令邊界，導致某一行的中文註解或指令被腰斬，殘留片段被當成一個不存在的指令去執行，出現 `'XXX' is not recognized as an internal or external command`。

這個 bug 有兩個特性，透過反覆實測才確認：

1. **非固定位置**：同一份檔案改一點內容（哪怕只是縮短一段中文註解），下次亂掉的地方就換了，不是某一行特定文字寫錯。
2. **跟解法無關**：試過「先 `chcp 65001` 再呼叫 `.bat`」「幫檔案加 UTF-8 BOM」都沒用，唯一有效的是把 `.bat` 檔案裡所有 `rem` 註解和 `echo` 訊息**全部改成純 ASCII 英文**，中文只留在必要的引號參數值裡（例如資料夾名稱 `模板`），連續跑 5 次才確認穩定不再亂碼。

這次真正造成事故的關鍵是：`publish.bat` 原本的流程是「先清空 `content\`，再用 `robocopy` 從 Obsidian Vault 同步回來」。清空那一步正常執行了，但緊接著的 `robocopy` 那一行，連同它後面 `if errorlevel 8 (...)` 的失敗檢查，一起被上述亂碼問題吃掉、沒有真的執行/攔截，於是「已清空但沒同步回來」的空 `content\` 資料夾就直接被 `git add / commit / push` 上去，GitHub 和 Cloudflare Pages 都拿到了空的網站內容。

**解決方案**:

1. 用 `git checkout <上一個正常的 commit> -- content/` 把工作目錄的 `content/` 復原，再手動重新跑一次 `robocopy` 對齊 Vault 最新內容（不要透過壞掉的 `publish.bat`，直接在 PowerShell 下手動下指令）。
2. 重寫 `publish.bat`：所有 `rem` 註解、`echo` 狀態與錯誤訊息改成純英文 ASCII，只保留像 `模板` 這種必要的中文參數值。
3. 在 `Sync Vault` 之後新增一道 **Safety Check**：直接數 `content\` 底下 `.md` 檔案數量，低於 50 個就視為同步異常、直接中止，不會進入 `quartz build` 或 `git commit/push`。這是最後一道防線——就算未來又出現其他未知問題導致同步失敗，也不會再讓空的網站內容被發布上線。
4. 提醒：改完 `publish.bat` 這類會自動 `git push` 的腳本後，最好先用「跑到 push 前一步就停下來」的方式做過幾次穩定性測試，再實際串上 `git commit/push`，避免像這次一樣直接把壞掉的中間狀態推上線。



## prompt

```plaintext
這個專案可以幫我打包變成一個 Quartz 網站用的公版嗎，另外產生一個新專案叫做 Quartz，拷貝至用這個 Quartz 網站用的公版 (Quartz-template)，修改專案資料夾名稱後(例如 Quartz-django)，爾後我只要將 Obsidian 的某一倉庫下(例如 django) 的 content 資料夾 ，拷貝到 Quartz-django 專案下的 content 資料夾內，就可以用
```

