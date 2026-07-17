
---
title: Python 使用 Chat API
draft: false
description:
date: 2026-07-15
tags: python

---


## 安裝 `OpenAI` 套件和取得 `API Key`

1. `OpenAI` 帳戶需要設定成付費帳戶後，我們才能呼叫 `ChatGPT API`，其費用是以`Tokens` 為單位，`1000` 個 `Tokens` 大約等於 `750` 個單字，其費用詳情請參考 `https://openai.com/pricing` 網頁。

2. 設定 `OpenAI` 付費帳戶
   進入 [OpenAI 平台](https://platform.openai.com)，然後按下左下角**註冊**鈕註冊 `OpenAI` 帳戶，就可以登入 [OpenAI 平台](https://platform.openai.com) 首頁，接這點選右上方的 **Settings** 設定圖示來設定為 OpenAI 付費帳戶，如下圖所示:
   ![openai_settings](https://pic.allen5183.synology.me/openai_settings.png#w60)

   在左邊選 `Billing` 後，按 `Add payment details` 鈕，即可選擇 `Individual` 個人 或 `Company` 公司，接著輸入付款的信用卡資料來成為付費帳戶，並且需要預付美金 `$5 ~ $95` 元，同時啟用 `Auto recharge`，如下圖所示:
   ![openai_billings](https://pic.allen5183.synology.me/openai_Billings.png#w60)
   ![openai_billings_10](https://pic.allen5183.synology.me/openai_Billings_10.png#w60)

3. 取得 `OpenAI` 帳戶的 `API Key`
   - 在回到 `OpenAI` 的設定圖示頁面，點選 `API keys` (`Usage` 命令可以查詢目前的用量)。
     ![openai_get_apikey](https://pic.allen5183.synology.me/openai_get_apikey.png#w60)
   - 按下右上角 `+ Create new secret key` 鈕產生 `API Key`。
     ![openai_new_secret_key](https://pic.allen5183.synology.me/openai_new_secret_key.png#w60)
   - 可以看到產生的 `API Key`，因為只會產生一次，記得按欄位後的 `Copy` 按鈕複製並保存好 `API Key`，再按 `Done` 鈕。
   - 在 `API Keys` 區段可以看到已產生的 `SECRET KEY` 清單，如下圖所示:
     ![T:\openai_new_secret_key_map](https://pic.allen5183.synology.me/openai_new_secret_key_map.png#w60)

4. 安裝 `OpenAI` 套件
   在 `Python` 虛擬環境 `ai` 安裝 `OpenAI` 套件的命令列指令，如下所示

   ```bash
   workon ai Enter
   (ai) $  pip install openai 
   ```  

5. 完整程式碼
   在取得 `API KEY` 和安裝 `OpenAI` 套件後，就可以整合 `Python` 程式和`ChatGPT API` 來建立 `ChatGPT` 相關應用，例如：建立一個簡單的 `ChatGPT` 客服機器人。

   ```python
   from openai import OpenAI
   
   api_key = "<API-KEY>"
   # 儲存 ChatGPT 回應的訊息內容
   reply_msg = "客戶你好..."
   #建立 OpenAI 物件 client，需傳入一 apikey
   client = OpenAI(api_key=api_key)
   
   #對話聊天的迴圈
   while True:
       #input() 取得輸入問題
       input_msg = input("你: ")
       '''
       呼叫 client.chat.completions.create() 來取得 ChatGPT 的 response 回應內容
       - model 參數: 指定 ChatGPT API 使用的語言模型
       - messages 參數: 一個字典串列，每一個訊息是一個字典，擁有 2 個鍵:
         - role 鍵: 是角色
         - content 鍵: 是訊息內容。
         
         每一個 messages(訊息)可以指定三種角色值:
         - "system": 此角色是指定 ChatGPT API 表現出的回應行為，以此例是一個客服機器人。
         - "user": 此角色是你輸入的問題，可以是單一字典, 也可以是多個字典的訊息。
         - "assistant": 此角色是助理，可以協助 ChatGPT 語言模型來回應答案，在實作上，我們可以將上一次對話的回應內容，再送給語言模型，如此一來 ChatGPT 就會記得上一次聊了什麼。
        - max_tokes 參數: ChatGPT 回應的最大 Tokens 數的整數值
        - temperature 參數: 控制 ChatGPT 回應的隨機程度，其值是 `0~2`(預設值是 1), 值越高回應的越隨機, ChatGPT 越會亂回答。
       '''
       response = client.chat.completions.create(
         model = "gpt-3.5-turbo",      
         messages = [
               {"role": "system", "content": "你是一位客服機器人"},
               {"role": "assistant", "content": reply_msg},
               {"role": "user", "content": input_msg}
                    ]
       )
   
       # response 會得到一個 Json 物件，所以用下列方式取得回應內容
       reply_msg = response.choices[0].message.content
       #顯示回應內容讓我們可以跟聊天機器人對話
       print(reply_msg)
   ```


## 使用 Ollama 本地模型

1. `Ollama` 本地 `API`
   `Ollama` 預設提供 `RESTful API`，端點通常是 `http://localhost:11434/api/chat` 或 `http://localhost:11434/api/generate`。

   `deepseek-r1:1.5b` 屬於 `chat` 型模型，建議用 `/api/chat` 端點。

2. `API` 請求格式
   `model`: 指定  `"deepseek-r1:1.5b"`
   `messages`: 與 `OpenAI/DeepSeek` 類似，為 `list of dicts`，包含 `role（system/user/assistant）` 與 `content`。
3. 程式流程
   - 匯入 `requests`
   - 設定 `API URL`
   - 設定初始 `messages`
   - 進入 `while` 迴圈，取得使用者輸入，組成 `messages`
   - 發送 `POST` 請求到 `Ollama`
   - 解析回應，取得 `assistant` 回覆，並印出
   - 將 `user/assistant` 訊息 `append` 到 `messages`，維持對話上下文
  
4. 你將會得到的程式特色
   - 不需 `API key`
   - 直接與本地 `Ollama` 服務溝通
   - 支援多輪對話上下文
  
5. 完整代碼

   ```python
   import requests
   
   api_url = "http://localhost:11434/api/chat"
   model = "deepseek-r1:1.5b"
   messages = [
       {"role": "system", "content": "你是一位客服機器人"},
       {"role": "assistant", "content": "客戶你好..."}
   ]
   
   while True:
       input_msg = input("你: ")
       messages.append({"role": "user", "content": input_msg})
       payload = {
           "model": model,
           "messages": messages,
           "stream": False
       }
       response = requests.post(api_url, json=payload)
       response_json = response.json()
       reply_msg = response_json["message"]["content"]
       print(reply_msg)
       messages.append({"role": "assistant", "content": reply_msg})       
   ```



   ```python
   import requests

   api_url = "http://localhost:11434/api/chat"
   model = "deepseek-r1:1.5b"
   messages = [
       {"role": "system", "content": "你是一位客服機器人，請直接針對用戶的問題給出具體、簡明的解答，不要自我介紹。"}
]

   while True:
       input_msg = input("你: ")
       messages.append({"role": "user", "content": input_msg})
       payload = {
           "model": model,
           "messages": messages,
           "stream": False
       }
       response = requests.post(api_url, json=payload)
       response_json = response.json()
       reply_msg = response_json["message"]["content"]
       print(reply_msg)
       messages.append({"role": "assistant", "content": reply_msg})
    ```
    
6. 問題
   這個錯誤訊息代表 Ollama 回傳的不是標準的單一 JSON，而是「多行 JSON」或「streaming」格式（通常是多個 JSON 物件以換行分隔），這是 Ollama 預設的行為。

   解決方式
   將 response.text 印出來觀察格式
   只取第一行 JSON 或將多行合併處理
   或在 payload 加上 "stream": False，讓 Ollama 回傳單一 JSON 物件（推薦）

   解決:
   在 payload 增加 "stream": False
   解析 response.json() 即可

   已經修正程式，現在 Ollama 會回傳單一 JSON 格式，不會再出現 `JSONDecodeError`。
   請直接執行新版程式，應可正常對話！

