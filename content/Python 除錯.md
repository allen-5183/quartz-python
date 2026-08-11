
---
title: python 除錯
draft: false
description:
date: 2026-07-14
tags: python

---

## python 除錯


### 1. `VS Code` 如何進行 `Debug`（不建立 `launch.json` 的情況）

`VS Code` 可以暫時不用 `launch.json`，直接按一下就開始除錯：

- 步驟 1：打開你的 `.py` 檔案
  例如 `main.py`
- 步驟 2：設定中斷點（`Breakpoint`）
  在行號左邊點一下，會出現紅點。
- 步驟 3：按 `F5` 或點左側`「Run and Debug」`
  - 左邊活動欄點 ▶️ `Run and Debug`
  - 出現選單 → 選 `Python Debugger`（如使用 `Python`）

這時 `VS Code` 會用自動產生的除錯設定執行。

![debug](https://pic.allen5183.synology.me/python_debug.png#w60)

### 2. 建立 `launch.json`（正式 `Debug` 配置）

當你需要：
- 自訂執行參數
- 設定環境變數
- 選擇不同的 `Python interpreter`
- 多個 `Debug` 設定

就需要 `launch.json`。

▶️ 建立 `launch.json` 的方法:

1. 方法 A： `F5` → `Add configuration`
   - 按 `F5`
   - 畫面上方彈出選項 → 填寫語言（如 `Python`）
   - `VS Code` 會自動建立：

     ```json
     .vscode/launch.json
     ```

2. 方法 B： `Run and Debug` 介面建立
   - 左側選單點 Run and Debug
   - 找到 `"create a launch.json file"` 或 `"Add Configuration"`
   - 選擇 `Python` → `VS Code` 自動產生範例配置

### 🎯 Python 的 launch.json 範例

下面是一個常用範例：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Current File",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "env": {
                "ENV": "dev"
            },
            "args": [
                "--debug"
            ]
        }
    ]
}
```

✨ 重點設定說明

| 欄位          | 說明                                  |
| ----------- | ----------------------------------- |
| **name**    | 視覺化顯示名稱，執行時會顯示在 Debug 選單            |
| **type**    | 語言（Python → `python`）               |
| **request** | `launch`（直接啟動）或 `attach`（連線到已在跑的程式） |
| **program** | 要執行的主程式，如 `${file}`                 |
| **console** | 執行位置（內建終端機）                         |
| **env**     | 自訂環境變數                              |
| **args**    | 執行參數，如 `python main.py --debug`     |

### 🧪 如何開始 Debug

完成後：
1. 左側選單點 `Run and Debug`
2. 在上方選單選剛剛的 `Python`: `Current File`
3. 點 `▶️` 執行

