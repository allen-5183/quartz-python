import os
import re
import sys

# 設定輸出編碼為 UTF-8 相容
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

# 設定 code-toggle.js 檔案路徑
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CODE_TOGGLE_PATH = os.path.join(SCRIPT_DIR, "quartz", "static", "code-toggle.js")

def get_current_password(content):
    """提取當前密碼"""
    match = re.search(r'const\s+CORRECT_PASSWORD\s*=\s*["\']([^"\']+)["\']', content)
    return match.group(1) if match else None

def update_password(new_password):
    """更新密碼並寫回檔案"""
    if not os.path.exists(CODE_TOGGLE_PATH):
        print(f"[X] 找不到目標檔案：{CODE_TOGGLE_PATH}")
        return False

    with open(CODE_TOGGLE_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    current_pwd = get_current_password(content)
    if current_pwd is None:
        print("[X] 密碼設定變數 (CORRECT_PASSWORD) 格式未找到！")
        return False

    # 替代舊密碼
    new_content = re.sub(
        r'const\s+CORRECT_PASSWORD\s*=\s*["\']([^"\']+)["\']',
        f'const CORRECT_PASSWORD = "{new_password}"',
        content
    )

    with open(CODE_TOGGLE_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"[OK] 密碼修改成功！")
    print(f"     原密碼：{current_pwd}")
    print(f"     新密碼：{new_password}")
    print(f"     已更新檔案：{CODE_TOGGLE_PATH}")
    return True

def main():
    print("=" * 50)
    print(" Quartz 程式碼保護密碼修改工具")
    print("=" * 50)

    if not os.path.exists(CODE_TOGGLE_PATH):
        print(f"[X] 錯誤：找不到 {CODE_TOGGLE_PATH}")
        return

    with open(CODE_TOGGLE_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    current_pwd = get_current_password(content)
    print(f"目前設定的授權密碼為：【 {current_pwd} 】\n")

    # 如果有命令列參數，直接使用參數作為新密碼
    if len(sys.argv) > 1:
        new_pwd = sys.argv[1].strip()
    else:
        try:
            new_pwd = input("請輸入想要設定的新密碼 (輸入空白則取消)：").strip()
        except KeyboardInterrupt:
            print("\n已取消操作。")
            return

    if not new_pwd:
        print("未輸入新密碼，操作已取消。")
        return

    update_password(new_pwd)

if __name__ == "__main__":
    main()
