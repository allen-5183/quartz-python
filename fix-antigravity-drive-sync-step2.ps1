<#
  fix-antigravity-drive-sync-step2.ps1

  前面已經手動做完的部分：
    - 移除了 %AppData%\Antigravity IDE 整資料夾的舊 Junction
    - 把 Drive 上的內容複製回本機，%AppData%\Antigravity IDE 現在是真正的本機資料夾

  這支腳本只做剩下的部分：
    把 User\globalStorage（AI Agent 交談紀錄）與 User\snippets 搬去 Drive，
    只針對這兩個資料夾建立 Junction，其餘（Cache/GPUCache/workspaceStorage/logs...）
    維持純本機、不同步。

  已確認：本機版 globalStorage\state.vscdb（344KB）就是要保留的那份，
  Drive 上原本較大的版本（363KB 的 AI Agent 紀錄）已備份到桌面
  antigravity-globalstorage-backup-* 資料夾，這支腳本會直接覆蓋 Drive 上的版本。

  執行前必須：完全關閉 Antigravity IDE（所有視窗＋背景程序），
  否則 state.vscdb 會被鎖住，Move-Item 會失敗。
#>

$ErrorActionPreference = "Stop"

$AppDataTarget = "$env:APPDATA\Antigravity IDE"
$DriveRoot     = "$env:USERPROFILE\Google 雲端硬碟檔案串流\我的雲端硬碟\Antigravity\Antigravity IDE"

Write-Host "=== 安全檢查 ===" -ForegroundColor Cyan
$proc = Get-Process | Where-Object { $_.ProcessName -match "Antigravity" }
if ($proc) {
  Write-Host "[X] Antigravity 還在跑，請先完全關閉再重新執行：" -ForegroundColor Red
  $proc | Select-Object ProcessName, Id | Format-Table
  exit 1
}

$relPaths = @("User\globalStorage", "User\snippets")

foreach ($relPath in $relPaths) {
  $localPath = Join-Path $AppDataTarget $relPath
  $drivePath = Join-Path $DriveRoot $relPath

  Write-Host "`n處理 $relPath ..." -ForegroundColor Cyan

  $localItem = Get-Item -LiteralPath $localPath -Force -ErrorAction SilentlyContinue
  if ($localItem -and $localItem.LinkType -eq "Junction") {
    Write-Host "  [OK] 已經是 Junction 了，跳過。" -ForegroundColor Yellow
    continue
  }

  if (Test-Path $drivePath) {
    Remove-Item -LiteralPath $drivePath -Recurse -Force
  }

  Move-Item -LiteralPath $localPath -Destination $drivePath
  cmd /c mklink /J "$localPath" "$drivePath" | Out-Null

  $check = Get-Item -LiteralPath $localPath -Force
  if ($check.LinkType -eq "Junction") {
    Write-Host "  [OK] $relPath => Junction 建立成功" -ForegroundColor Green
  } else {
    Write-Host "  [X] $relPath Junction 建立失敗，請手動檢查！" -ForegroundColor Red
  }
}

Write-Host "`n=== 完成，可以重新開啟 Antigravity IDE 了 ===" -ForegroundColor Cyan
Get-Item -LiteralPath "$AppDataTarget\User\globalStorage" -Force | Select-Object FullName, LinkType
Get-Item -LiteralPath "$AppDataTarget\User\snippets" -Force | Select-Object FullName, LinkType
