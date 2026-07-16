@echo off

echo ====================  
echo Sync Vault  
echo ====================  

rmdir /s /q "C:\cloud\project\quartz\content\模板"
rmdir /s /q "C:\cloud\project\quartz\content\每日行程"
rmdir /s /q "C:\cloud\project\quartz\content\每日筆記"
rmdir /s /q "C:\cloud\project\quartz\content\我的投資"

robocopy "C:\Users\allen\Obsidian Vault\Allen Vault" "C:\cloud\project\quartz\content" /MIR /XD .obsidian 模板 每日行程 每日筆記 我的投資

echo ====================  
echo Quartz Build  
echo ====================  

cd /d C:\cloud\project\quartz 

call npx quartz build

echo ====================  
echo Git Push  
echo ====================

git add .

git commit -m "update"

git push

pause