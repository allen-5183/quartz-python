@echo off
rem ============================================================
rem  quartz-python publish script
rem    1. Clean content\ (remove orphaned files/assets folders)
rem    2. Mirror sync from Obsidian "Python Vault" into content\
rem    3. npx quartz build
rem    4. git add / commit / push  -> Cloudflare Pages auto-deploy
rem
rem  NOTE: keep this file's comments/messages plain ASCII.
rem  Chinese text inside rem/echo lines has been shown to cause
rem  cmd.exe to corrupt/merge lines under chcp 65001 on this
rem  machine (non-deterministic, shifts with file content) and
rem  once caused content\ to be wiped and pushed empty. Chinese
rem  is only safe here as short quoted argument data (e.g. the
rem  "mo ban" folder name below), not as comment/echo prose.
rem ============================================================

for /f "tokens=2 delims=:" %%c in ('chcp') do set "OLDCP=%%c"
chcp 65001 >nul

setlocal

set "PROJECT=C:\cloud\project\quartz-python"
set "VAULT=C:\Users\allen\Obsidian Vault\Python Vault"

cd /d "%PROJECT%" || goto :fail

echo ====================
echo Clean Content
echo ====================

attrib +h "%PROJECT%\content\index.md" /S
del /S /Q "%PROJECT%\content\*" >nul
attrib -h "%PROJECT%\content\index.md" /S
for /f "delims=" %%d in ('dir /s /b /ad "%PROJECT%\content" ^| findstr /i /e "\assets"') do rmdir /s /q "%%d"
ver >nul

echo ====================
echo Sync Vault
echo ====================

robocopy "%VAULT%" "%PROJECT%\content" /MIR /XD ".obsidian" "模板" /XF "index.md"
if errorlevel 8 (
    echo [ERROR] robocopy sync failed. Check Vault path and Google Drive sync status.
    goto :fail
)
ver >nul

if exist "%PROJECT%\content\模板" rmdir /s /q "%PROJECT%\content\模板"

echo ====================
echo Safety Check
echo ====================

rem Guard against a broken sync silently emptying content\ and
rem still getting committed/pushed. Count .md files; abort if
rem the count looks implausibly low instead of proceeding to
rem build/git.
set "MDCOUNT=0"
for /f %%n in ('dir /s /b /a-d "%PROJECT%\content\*.md" 2^>nul ^| find /c /v ""') do set "MDCOUNT=%%n"
echo content\ has %MDCOUNT% .md files.
if %MDCOUNT% LSS 50 (
    echo [ERROR] .md file count too low ^(under 50^), sync looks broken.
    echo         Aborting before build/commit/push.
    echo         Check content\ and the Vault path, then re-run.
    goto :fail
)

echo ====================
echo Quartz Build
echo ====================

call npx quartz build
if errorlevel 1 (
    echo [ERROR] Quartz build failed. Publish aborted.
    goto :fail
)

echo ====================
echo Git Push
echo ====================

echo.
echo [!] Before pushing, confirm the Google Drive tray icon shows fully synced.
echo     Pushing while it is still syncing can give GitHub an incomplete
echo     file tree, causing Cloudflare to deploy stale or broken content.
echo.
echo     Press any key to continue, or Ctrl+C to abort.
pause >nul

git add .
if errorlevel 1 goto :fail

rem git commit returns errorlevel 1 when there is nothing to commit
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "update notes"
    if errorlevel 1 goto :fail
) else (
    echo No changes to commit, skipping commit.
)

git push
if errorlevel 1 (
    echo [ERROR] git push failed.
    echo         If stuck on a lock file, run:
    echo           Stop-Process -Name git -Force
    echo           Remove-Item -Force .git\index.lock
    goto :fail
)

echo.
echo ====================
echo Publish complete
echo ====================
echo Cloudflare Pages will auto-redeploy in a few tens of seconds:
echo   https://quartz-python.pages.dev/
goto :done

:fail
echo.
echo ******** Publish aborted ********

:done
endlocal
if defined OLDCP chcp %OLDCP% >nul
pause
