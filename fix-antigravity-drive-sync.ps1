<#
  fix-antigravity-drive-sync.ps1

  問題：
    %AppData%\Antigravity IDE 目前整個資料夾用 mklink /J 指向 Google Drive，
    導致 Electron/Chromium 引擎快取（Cache/GPUCache/Code Cache/Crashpad/
    Network/Service Worker...）跟上百個專案的 workspaceStorage 也一起被同步，
    造成「一開 IDE 就狂同步」。

  目的：
    只保留「全局設定」與「AI Agent 交談紀錄/Session」這兩塊真正需要跨裝置
    同步的資料繼續連到 Google Drive，其餘快取/log/per-專案狀態改回純本機。

    - User\globalStorage  -> 保留同步（AI Agent 對話紀錄存在這裡的 state.vscdb，
                              鍵值 antigravityUnifiedStateSync.trajectorySummaries）
    - User\snippets       -> 保留同步（自訂程式碼片段）
    - 其餘（Cache/GPUCache/workspaceStorage/logs/...）-> 改回純本機，不再同步

  注意：
    - settings.json / keybindings.json 是單一檔案，Windows 檔案 symlink 需要
      系統管理員權限或開啟「開發人員模式」，這台機器目前都沒開，所以這個腳本
      "不會" 處理這兩個檔案，會維持在還原後的本機資料夾內（不跨裝置同步）。
      如果之後想連這兩個檔案也同步，請看腳本最後的提示。
    - 執行前請先完全關閉 Antigravity IDE（包含所有視窗與背景進程），
      避免檔案鎖定造成資料損壞。
#>

$ErrorActionPreference = "Stop"

$AppDataTarget = "$env:APPDATA\Antigravity IDE"
$DriveRoot     = "$env:USERPROFILE\Google 雲端硬碟檔案串流\我的雲端硬碟\Antigravity IDE"
$TempRestore   = "$env:TEMP\AntigravityIDE-restore-$(Get-Date -Format yyyyMMdd_HHmmss)"

Write-Host "=== Step 0: 安全檢查 ===" -ForegroundColor Cyan

# 0a. 確認 Antigravity 沒有在跑
$proc = Get-Process | Where-Object { $_.ProcessName -match "Antigravity" }
if ($proc) {
  Write-Host "[X] 偵測到 Antigravity 相關程序還在執行，請先完全關閉 Antigravity IDE 再重跑這個腳本：" -ForegroundColor Red
  $proc | Select-Object ProcessName, Id | Format-Table
  exit 1
}

# 0b. 確認目前確實是 junction
$item = Get-Item -LiteralPath $AppDataTarget -Force -ErrorAction SilentlyContinue
if (-not $item -or $item.LinkType -ne "Junction") {
  Write-Host "[X] $AppDataTarget 目前不是 Junction（可能已經處理過，或路徑不對），先手動確認再繼續。" -ForegroundColor Red
  exit 1
}
Write-Host "[OK] 確認 $AppDataTarget 目前是 Junction，指向 Drive。" -ForegroundColor Green

Write-Host "`n=== Step 1: 把目前 Drive 上的內容完整複製回本機暫存資料夾 ===" -ForegroundColor Cyan
Write-Host "來源：$AppDataTarget（經由 Junction 讀到的是 Drive 內容）"
Write-Host "目的：$TempRestore"
robocopy $AppDataTarget $TempRestore /E /R:2 /W:2 /NFL /NDL
if ($LASTEXITCODE -ge 8) {
  Write-Host "[X] robocopy 複製失敗（exit code $LASTEXITCODE），中止，不會動到原本的 Junction。" -ForegroundColor Red
  exit 1
}
Write-Host "[OK] 複製完成。" -ForegroundColor Green

Write-Host "`n=== Step 2: 移除舊的整資料夾 Junction（不會刪到 Drive 上的實際資料）===" -ForegroundColor Cyan
cmd /c rmdir "$AppDataTarget"
if (Test-Path -LiteralPath $AppDataTarget) {
  Write-Host "[X] 移除 Junction 失敗，中止。" -ForegroundColor Red
  exit 1
}
Write-Host "[OK] 舊 Junction 已移除。" -ForegroundColor Green

Write-Host "`n=== Step 3: 把暫存內容搬回去，變成真正的本機資料夾 ===" -ForegroundColor Cyan
Move-Item -LiteralPath $TempRestore -Destination $AppDataTarget
Write-Host "[OK] $AppDataTarget 現在是純本機資料夾了。" -ForegroundColor Green

Write-Host "`n=== Step 4: 只把 User\globalStorage 與 User\snippets 兩個資料夾接回 Drive ===" -ForegroundColor Cyan

function Link-OnlyThisFolder($relPath) {
  $localPath = Join-Path $AppDataTarget $relPath
  $drivePath = Join-Path $DriveRoot $relPath

  if (-not (Test-Path $drivePath)) {
    New-Item -ItemType Directory -Force -Path (Split-Path $drivePath -Parent) | Out-Null
  }

  if (Test-Path $drivePath) {
    Write-Host "  Drive 上已有 $relPath，先把本機版本合併過去（本機優先，因為剛從 Drive 還原）..." -ForegroundColor Yellow
    robocopy $localPath $drivePath /E /R:2 /W:2 /NFL /NDL | Out-Null
  } else {
    Write-Host "  Drive 上還沒有 $relPath，直接搬過去..." -ForegroundColor Yellow
    Move-Item -LiteralPath $localPath -Destination $drivePath
  }

  Remove-Item -LiteralPath $localPath -Recurse -Force -ErrorAction SilentlyContinue
  cmd /c mklink /J "$localPath" "$drivePath" | Out-Null
  Write-Host "  [OK] $relPath  =>  Junction 已建立" -ForegroundColor Green
}

Link-OnlyThisFolder "User\globalStorage"
Link-OnlyThisFolder "User\snippets"

Write-Host "`n=== 完成 ===" -ForegroundColor Cyan
Write-Host "現在只有 User\globalStorage（AI Agent 交談紀錄/Session）與 User\snippets 會同步到 Google Drive。"
Write-Host "Cache / GPUCache / Code Cache / Crashpad / Network / workspaceStorage / logs 等都已經變回純本機，不會再被 Drive 同步。"
Write-Host ""
Write-Host "如果之後也想讓 settings.json / keybindings.json 同步，需要先開啟「開發人員模式」" -ForegroundColor Yellow
Write-Host "（設定 -> 隱私權與安全性 -> 開發人員專用 -> 開發人員模式），開啟後再執行：" -ForegroundColor Yellow
Write-Host '  $u = "$env:APPDATA\Antigravity IDE\User"' -ForegroundColor DarkGray
Write-Host '  $d = "$env:USERPROFILE\Google 雲端硬碟檔案串流\我的雲端硬碟\Antigravity IDE\User"' -ForegroundColor DarkGray
Write-Host '  foreach ($f in "settings.json","keybindings.json") {' -ForegroundColor DarkGray
Write-Host '    if (-not (Test-Path "$d\$f")) { Copy-Item "$u\$f" "$d\$f" }' -ForegroundColor DarkGray
Write-Host '    Remove-Item "$u\$f" -Force' -ForegroundColor DarkGray
Write-Host '    New-Item -ItemType SymbolicLink -Path "$u\$f" -Target "$d\$f" | Out-Null' -ForegroundColor DarkGray
Write-Host '  }' -ForegroundColor DarkGray
Write-Host ""
Write-Host "確認沒問題後，就可以重新開啟 Antigravity IDE 了。"
