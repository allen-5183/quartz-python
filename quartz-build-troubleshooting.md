# Quartz 建置與部署問題排除備忘錄 (Troubleshooting Memo)

本備忘錄記錄了在 **Windows + Google Drive (或其它虛擬/慢速雲端硬碟)** 環境下執行 Quartz 建置與發布時，可能遇到的常見問題、背後原因及對應的快速排除步驟。

---

## 📋 快速排除清單 (Quick Fixes)

若未來再次遇到建置停滯、報錯或 Git 卡住，請依序執行以下指令：

### 1. 清除 Git 鎖定與殘留程序
若因建置卡住而手動使用 `Ctrl+C` 中斷，會導致 Git 鎖定檔案殘留。請開啟 PowerShell 執行：
```powershell
# 1. 強制結束所有執行中的 Git 程序
Stop-Process -Name git -Force

# 2. 刪除殘留的 Git 鎖定檔
Remove-Item -Force .git/index.lock -ErrorAction SilentlyContinue
```

### 2. 重建外掛索引 (若 esbuild 報錯說找不到 `.quartz/plugins`)
若手動刪除過 `.quartz/plugins` 導致建置報錯 `Could not resolve "../../.quartz/plugins"`，請重新產生索引：
1. 建立一個臨時腳本 `scratch_gen_index.ts`：
   ```typescript
   import { regeneratePluginIndex } from "./quartz/plugins/loader/gitLoader.js"
   regeneratePluginIndex({ verbose: true }).catch(console.error)
   ```
2. 執行它：
   ```bash
   npx tsx scratch_gen_index.ts
   ```
3. 產生成功後，將 `scratch_gen_index.ts` 刪除即可。

---

## 🔍 問題與修復原理說明

### 問題一：Quartz 啟動時外掛載入失敗 (`Failed to instantiate plugin ...`)
* **錯誤現象**：顯示找不到包，例如 `Cannot find package '@napi-rs/simple-git'`，外掛目錄下的 `node_modules` 是空的或損壞。
* **根本原因**：Google Drive 虛擬磁碟不支援 Windows 的符號連結（Symlink）與聯接點（Junction），原先代碼的 fallback 判定僅限於 `EPERM` 錯誤，而 Google Drive 拋出的是 `EISDIR` 錯誤，導致無法正確退回到檔案拷貝。
* **已採取的修復**：修改了 [gitLoader.ts](file:///c:/cloud/project/quartz/quartz/plugins/loader/gitLoader.ts) 的 `trySymlink` 函數，只要在 Windows 環境下遇到建立連結錯誤，一律退回至 `junction` 或 `fs.cpSync` 檔案拷貝。同時讓 `installPlugin` 在外掛已下載時也自動執行連結檢查以修復損壞連結。

### 問題二：執行 `npx quartz build` 停滯不前 (卡在 `Quartz v5.0.0` 長達數分鐘)
* **錯誤現象**：啟動建置後，游標一直在 `Quartz v5.0.0` 下方閃爍，無任何新輸出。
* **根本原因**：因為不支援 symlink，外掛的依賴套件是以實體目錄拷貝（`fs.cpSync`）存在。原程式碼每次建置時都會強行將這些實體目錄刪除並重新拷貝一次。在 Google Drive 上對 38 個外掛重複拷貝數萬個小檔案，會導致建置卡住 7 分鐘以上。
* **已採取的修復**：在 [gitLoader.ts](file:///c:/cloud/project/quartz/quartz/plugins/loader/gitLoader.ts) 的 `linkPeerDependencies` 中加入了**快取跳過機制**：如果檢測到該依賴目錄已存在且不為空，說明先前已拷貝成功，直接跳過拷貝。優化後**建置時間由 7 分鐘縮短至 11 秒**。

### 問題三：執行 `npm run install-plugins` 報 `ERR_UNKNOWN_FILE_EXTENSION` (無法解析 `.scss`)
* **錯誤現象**：建置過程中報出 `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".scss"`。
* **根本原因**：`install-plugins.ts` 原本導入了 `quartz.ts`，這在 Node.js (TSX) 執行期會間接載入組件中含有 SCSS 導入（如 `import "./base.scss"`）的檔案，而 Node 原生無法解析 scss。
* **已採取的修復**：修改了 [install-plugins.ts](file:///c:/cloud/project/quartz/quartz/plugins/loader/install-plugins.ts)，不再載入 `quartz.ts`，改為使用 `yaml` 解析器直接載入 `quartz.config.yaml` 提取外掛清單。

### 問題四：執行 `publish.bat` 卡在 Git Push 階段
* **錯誤現象**：在 `Git Push` 後游標不斷閃爍，沒有完成。
* **根本原因**：通常是因為前面步驟被強制中斷導致 `.git/index.lock` 未被清理，或者是終端機背景認證被卡住。
* **已採取的修復**：強制殺掉殘留 git 程序並清理 `index.lock`。
