@echo off
rem ============================================================
rem  quartz-python 一鍵發布腳本
rem    1. 清空 content\（保留各層 index.md），並清掉孤兒 assets 資料夾
rem    2. 從 Obsidian「Python Vault」鏡像同步到 content\
rem    3. npx quartz build
rem    4. git add / commit / push  → Cloudflare Pages 自動部署
rem ============================================================

rem 本檔為 UTF-8 (無 BOM) 編碼，內含中文路徑，
rem 必須切到 UTF-8 字碼頁，否則 cmd 會以 CP950 解讀而變成亂碼。
for /f "tokens=2 delims=:" %%c in ('chcp') do set "OLDCP=%%c"
chcp 65001 >nul

setlocal

set "PROJECT=C:\cloud\project\quartz-python"
set "VAULT=C:\Users\allen\Obsidian Vault\Python Vault"

cd /d "%PROJECT%" || goto :fail

echo ====================
echo Clean Content
echo ====================

rem 先清空 content\（保留各層 index.md），並清掉孤兒 assets 資料夾。
rem robocopy /MIR 理論上會自己刪多餘檔案，但在 Google Drive 虛擬/串流磁碟上
rem 有時會因檔案鎖定或虛擬路徑問題而漏刪（尤其是筆記改名後留下的舊 assets 資料夾），
rem 所以比照 Quartz-python 維護.md 記錄的手動流程，先做一次全清再交給 robocopy 同步。
attrib +h "%PROJECT%\content\index.md" /S
del /S /Q "%PROJECT%\content\*" >nul
attrib -h "%PROJECT%\content\index.md" /S
for /f "delims=" %%d in ('dir /s /b /ad "%PROJECT%\content" ^| findstr /i /e "\assets"') do rmdir /s /q "%%d"
ver >nul

echo ====================
echo Sync Vault
echo ====================

rem /MIR : 鏡像同步（來源沒有的檔案，目的地會一併刪除）
rem /XD  : 排除目錄，不複製也不刪除
rem /XF  : 排除 index.md（首頁與各章節目錄頁只存在於 content\，
rem        Vault 內並沒有，若不排除會被 /MIR 全部刪光）
robocopy "%VAULT%" "%PROJECT%\content" /MIR /XD ".obsidian" "模板" /XF "index.md"
rem robocopy 的離開碼 0-7 皆屬正常，8 以上才是真的失敗
if errorlevel 8 (
    echo [ERROR] robocopy 同步失敗，請確認 Vault 路徑與 Google Drive 是否已同步完成。
    goto :fail
)
rem robocopy 正常結束時仍會留下非 0 的 errorlevel（例如偵測到 index.md 屬「額外檔案」
rem 而回傳 2），若不清掉，後續沒有自行設定離開碼的指令會誤判為失敗。
ver >nul

rem /XD 只是「不同步」，先前殘留的 模板 資料夾仍要手動清掉
if exist "%PROJECT%\content\模板" rmdir /s /q "%PROJECT%\content\模板"

echo ====================
echo Quartz Build
echo ====================

call npx quartz build
if errorlevel 1 (
    echo [ERROR] Quartz 建置失敗，已中止發布。
    goto :fail
)

echo ====================
echo Git Push
echo ====================

echo.
echo [!] 推送前請確認系統列的 Google Drive 圖示顯示「已同步完成」。
echo     若仍在同步中就 push，GitHub 會拿到不完整的檔案結構，
echo     導致 Cloudflare 部署到舊的或錯誤的資料。
echo.
echo     確認完成請按任意鍵繼續，要中止請按 Ctrl+C。
pause >nul

git add .
if errorlevel 1 goto :fail

rem git commit 在沒有變更時會回傳 errorlevel 1，需先判斷有無暫存內容
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "update notes"
    if errorlevel 1 goto :fail
) else (
    echo 沒有變更需要提交，略過 commit。
)

git push
if errorlevel 1 (
    echo [ERROR] git push 失敗。
    echo         若卡在鎖定檔，請執行：
    echo           Stop-Process -Name git -Force
    echo           Remove-Item -Force .git\index.lock
    goto :fail
)

echo.
echo ====================
echo 發布完成
echo ====================
echo Cloudflare Pages 會自動重新部署，數十秒後生效：
echo   https://quartz-python.pages.dev/
goto :done

:fail
echo.
echo ******** 發布中止 ********

:done
endlocal
if defined OLDCP chcp %OLDCP% >nul
pause
