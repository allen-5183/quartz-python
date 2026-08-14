# Quartz-python 維護


## 本機啟動

1. 修改完後，本機先做測試
2. 等待雲端同步完成
3. 執行 `npx quartz build --serve`

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

1. 刪除 `c:\cloud\project\quartz-python\content` 下的所有資料，但保留所有資料夾下的 `index.md` 文件。

   ```cmd
   attrib +h "c:\cloud\project\quartz-python\content\index.md" /S && del /S /Q "c:\cloud\project\quartz-python\content\*" && attrib -h "c:\cloud\project\quartz-python\content\index.md" /S && for /f "delims=" %d in ('dir /s /b /ad "c:\cloud\project\quartz-python\content" ^| findstr /i /e "\assets"') do rmdir /s /q "%d"
   ```

2. 接入 `Obsidian Vault`
   將 `Python Vault` 內容放入 `quartz` 專案下的 `content`：

   ```cmd
   robocopy "C:\Users\allen\Obsidian Vault\Python Vault" "C:\cloud\project\quartz-python\content" /MIR /XD ".obsidian" "模板" /XF "index.md"
   rmdir /s /q "C:\cloud\project\quartz-python\content\模板"
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
4. [Cloudflare](https://dash.cloudflare.com/login)
   會自動重新部署。
   幾十秒後網站更新。

   >`https://quartz-python.pages.dev/`

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


---

## 字體最佳化

| 項目 | 修改前 | 修改後 |
| :--- | :--- | :--- |
| **英文/數字字體** | Noto Sans TC（中文字體兼顧英文，非最佳） | **Inter**（專為 UI/閱讀優化的英文字體） |
| **中文字體** | Noto Sans TC | **Noto Sans TC**（保留，補足中文字形） |
| **不存在的字體** | `"Taipei Sans TC"`（Google Fonts 無此字體） | 已移除 |
| **系統備援** | 無 | `PingFang TC` (Mac) / `Microsoft JhengHei` (Windows) |
| **行高** | 未設定（沿用瀏覽器預設） | 內文 `1.8`、標題 `1.3` |
| **字距** | 未設定 | 內文 `0.01em`、標題 `0.02em` |
| **字體渲染** | 未設定 | `antialiased` + `optimizeLegibility` |
| **程式連字** | 未開啟 | 開啟（`->`, `=>`, `!=` 等自動合字） |

修改 `quartz\styles\custom.scss`




---

## 程式碼範例全域保護與密碼控管說明

本專案針對 Markdown 筆記中的範例程式碼區塊（`> [!example]` callout）提供了**權限密碼驗證**與**全域統一切換**功能。

### 1. 密碼存放位置與修改方式

- **密碼儲存檔案**：[`public/static/code-toggle.js`](file:///c:/cloud/project/quartz-python/public/static/code-toggle.js)（第 11 行）
- **預設密碼設定**：
  ```javascript
  const CORRECT_PASSWORD = "1234"
  ```

#### 方式 A：使用 Python 工具自動修改（推薦）
專案根目錄提供專用 Python 工具 [`change_password.py`](file:///c:/cloud/project/quartz-python/change_password.py)：

```bash
# 1. 互動式修改（會自動顯示目前密碼並提示輸入新密碼）：
python change_password.py

# 2. 或直接於 Terminal / CMD 帶入新密碼：
python change_password.py myNewPassword123
```

#### 方式 B：手動修改
1. 開啟 [`public/static/code-toggle.js`](file:///c:/cloud/project/quartz-python/public/static/code-toggle.js)。
2. 將第 11 行的 `const CORRECT_PASSWORD = "1234"` 修改為新密碼。
3. 存檔後重新發布即可生效。

---

### 2. 功能運作機制與防繞過保護

| 功能項目 | 說明與實現原理 |
| :--- | :--- |
| **全域統一控制器** | 畫面右下角提供浮動切換按鈕（`[ 展開程式碼 🔒 ]` / `[ 收合程式碼 ]`），一鍵切換全頁面所有範例程式碼。 |
| **密碼驗證 (Modal)** | 未驗證時，點擊右下角按鈕或點擊程式碼標題列會自動跳出 Modal 視窗，密碼驗證成功後解鎖。 |
| **雙層單一區塊硬鎖定** | 1. **CSS 實體鎖定**：對 `.callout[data-callout="example"] .callout-title` 設定 `pointer-events: none !important` 停用點擊，並隱藏折疊箭頭。<br/>2. **JS 全域捕獲攔截**：在 `document` 層級開啓 Capture Phase 捕獲點擊，完全禁止單獨展開，引導至全域控管按鈕。 |
| **狀態自動記憶** | 通過驗證後，使用者展開或收合程式碼的偏好設定會儲存於 `localStorage`，重新整理頁面時自動維持上一次的切換狀態。 |

---

### 3. 相關技術檔案對照

- **Python 密碼修改腳本**：[`change_password.py`](file:///c:/cloud/project/quartz-python/change_password.py)
- **前端控制與驗證邏輯**：[`public/static/code-toggle.js`](file:///c:/cloud/project/quartz-python/public/static/code-toggle.js)
- **鎖定與標籤視覺樣式**：[`quartz/styles/custom.scss`](file:///c:/cloud/project/quartz-python/quartz/styles/custom.scss) （定義 `.is-code-locked` 與 `.is-code-authed` 提示標籤）
- **頁面全域引入腳本**：[`quartz/components/Head.tsx`](file:///c:/cloud/project/quartz-python/quartz/components/Head.tsx) （引入 `<script src="/static/code-toggle.js"></script>`）
