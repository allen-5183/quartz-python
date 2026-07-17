# Quartz-python 維護

## 網站樣板複製

1. 複製 `quartz` 專案
   
   ```bash
   robocopy ^"c:\cloud\project\quartz" ^"c:\cloud\project\quartz-python"    
   ```

2. 刪除 `c:\cloud\project\quartz-python` 專案下的資料夾 `.git`

   ```bash
   c:\cloud\project\quartz-python
   del .git   
   ```

3. 刪除 `c:\cloud\project\quartz-python\content` 下的所有資料

   ```bash
   attrib +h "c:\cloud\project\quartz-python\content\index.md" && del /S /Q "c:\cloud\project\quartz-python\content\*" && for /D %p in ("c:\cloud\project\quartz-python\content\*") do rmdir /S /Q "%p" & attrib -h "c:\cloud\project\quartz-python\content\index.md"
   ```

4. 接入 `Python Vault`
   將 `Python Vault` 內容放入 `quartz-python` 專案下的 `content`：

   ```bash
   robocopy "C:\Users\allen\Obsidian Vault\Python Vault" "C:\cloud\project\quartz-python\content" /MIR /XD ".obsidian" "模板" /XF "index.md"
   ```

5. 建立首頁 `content/index.md`，內容如下:

   ```yaml
   ---
   title: Allen 筆記庫
   ---

   # 線上輔助教材

   ## 分類

   - [[Python]]
   ```

6. 發布到 `GitHub`  (雲端同步完，在上傳)

   ```bash
   cd C:\cloud\project\quartz-python
   git init
   git add .
   git commit -m "first publish"
   git remote set-url origin https://github.com/你的帳號/quartz-python.git
   git remote add origin https://github.com/allen-5183/quartz-python.git
   git branch -M main
   git push -u origin main
   ```

   檢查 Git Remote

   ```bash
   git remote -v
   ```

   確認：

   ```text
   origin https://github.com/你的帳號/quartz-python.git
   ```

## 日後更新網站

1. 刪除 `c:\cloud\project\quartz-python\content` 下的所有資料

   ```bash
   attrib +h "c:\cloud\project\quartz-python\content\index.md" && del /S /Q "c:\cloud\project\quartz-python\content\*" && for /D %p in ("c:\cloud\project\quartz-python\content\*") do rmdir /S /Q "%p" & attrib -h "c:\cloud\project\quartz-python\content\index.md"
   ```

2. 接入 `Obsidian Vault`
   將 `Python Vault` 內容放入 `quartz` 專案下的 `content`：

   ```bash
   robocopy "C:\Users\allen\Obsidian Vault\Python Vault" "C:\cloud\project\quartz-python\content" /MIR /XD ".obsidian" "模板" /XF "index.md"
   ```

   參數說明：
   - `/MIR` ： 鏡像複製（來源沒有的檔案，目的地也會被自動刪除，所以您其實不需要事先手動清空資料夾！）
   - `/XD ".obsidian" "模板"`： 排除 (`eXclude Directory`) 這兩個資料夾
   - `/XF "index.md"`： 排除 (`eXclude File`) `index.md` 不去動它，這樣您剛編輯好的首頁就能完美保留。

3. `git` 操作

   ```bash
   git add .
   git commit -m "update notes"
   git push
   ```
4. `Cloudflare` 會自動重新部署。
   幾十秒後網站更新。

## 注意事項

1. 把 `Google Drive` 設為實體同步目錄，你的本機檔案其實是在「雲端串流」的狀態。在這種設定下，常常會因為同步時間差或 `Git` 無法正確讀取暫存快取，導致本機、`GitHub` 和 `Cloudflare` 三方同步脫節。

2. 為了確保執行完全正常，請注意以下兩點：
   - 務必確認 `Google Drive` 圖示「已同步完成」
   - 當你在本地電腦執行完 `git rm --cached` 和 `git commit` 後，請先看一下系統列（右下角）的 `Google Drive` 圖示。
     如果它還在轉圈圈（同步中）： 請先不要執行 `git push`。因為此時 `.git` 資料夾內的隱藏索引檔案還在同步上傳，如果這時候強行 `PUSH`，`GitHub` 拿到的檔案結構可能會是不完整的，進而導致 `Cloudflare` 抓到舊的或錯誤的資料。
     等它顯示「已是最新的狀態」： 再到終端機執行 `git push origin main`。

3. 雲端同步目錄（如 `Google Drive`）對 `Git` 的潛在小陷阱
   雖然把專案放在 `Google Drive` 可以隨時備份，但 `Git` 在這種雲端串流目錄下，有時候會因為檔案鎖定（`Locking`）或虛擬路徑問題，導致 `git rm` 或 `git status` 出現偵測不到、甚至拒絕存取的情況。

4. 如果同步完成後，執行指令還是怪怪的，可以這樣做：
   打開你的 `GitHub` 網頁端，直接點進去你的 `quartz-python` 儲存庫（`Repository`）。
   檢查 .quartz/plugins/ 資料夾。
   正常的狀態： 裡面應該是普通的資料夾。
   異常的狀態（如下圖）： 如果你在 `GitHub` 網頁上看到 `crawl-links` 資料夾變成一個帶有白色箭頭、點不進去的綠色圖示（如下圖所示），那就代表 `Git` 還是把它當作子模組。

5. 終極解決辦法
   如果雲端同步目錄一直搞不定這個殘留的 `Git` 紀錄，最快且最乾淨的方法是：
   先把整個 `quartz-python` 資料夾複製一份到非同步目錄（例如桌面或 C:\ 槽底下）。
   在桌面的那個資料夾裡，執行前面提到的 `Git` 清除指令與 `git push`。
   等 `Cloudflare` 部署成功後，再把檔案複製回你的 `Google Drive` 目錄覆蓋即可。這樣可以完全繞過雲端同步軟體對 `Git` 隱藏檔案的干擾！

6. `.gitignore`

   ```yaml
   # Prevent plugin .git dirs from being treated as submodules
   .quartz/plugins/**/.git
   ```
