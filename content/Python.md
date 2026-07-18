
---
title: Python
draft: false
description:
date: 2026-07-11
tags: python

---

## `Python 2.x` v.s. `Python 3.x`

- Python3: 語法更簡潔，Unicode 支援與強大內建函示庫。
- Python2: 支援主要作業環境，第三方函式庫主要支援版本。
- 語法差異

  Python 3 | Python 2
  ---------|---------
  print('hello world') | print 'hello world'
  hello world | hello world

- 在 `Python2` 下執行 `Python3` 用法:
  `from__future__import print_function` 取代原本在 `python2` 的 `print`

## Anaconda 安裝

[Anaconda](https://www.anaconda.com/products/individual) 支援 `python` 安裝第三方套件，易於解決 C 編譯器在各平台執行不同差異性問題。
-   支援 `Linux`、`Windows`、`Mac` 平台
-   支援 `Python 2.x` 及 `Python 3.x`，且可自由切換
-   內建 `Spyder` 編輯器
-   包含 `Jupyter notebook` 環境
## `python` 與  `Java` 的差異

- 語法上

  ```java
  public static void main(){
    for(int i=0; i < 11; i++){
      System.out.println(i);
    }
  }
  ```
  ```python
  for i in range(1,11):
    print(i)
  ```

- 其他

  Java | Python
  :------|:-------
  `Java` 執行速度較快 | 但 `Python` 開發較快
  使用 `{}` 分隔區塊  | 使用(`縮排`)
  可以透過 `Compiler` 檢查錯誤 | 只能在 `runtime` 檢查錯誤
  使用 `/*...*/` 作註解 | 使用 `"""...."""` 作註解

## Python 是直譯式語言

- 不用透過編譯器(`Compiler`)編譯，即時看到結果

  ```python
  C:\python\python3>python
  >>> print("hello world")
  hello world
  >>>exit()
  ```

## Python 是動態語言

- 不用宣告型態，更簡易使用

  ```python
  >>> a =2
  >>> b = 3
  >>> a+b

- Python 因無先編譯的關係，所以無法直接做**字串**與**數值**的相加，錯誤的發生也只能發現於執行期階段。

  ```python
  >>>a = 1 +  "hello"
  >>>print(a)
  ```

## Python 開發工具

- [PyCharm](https://www.jetbrains.com/pycharm/download)

- [Visual Studio Code](https://code.visualstudio.com/Download)
   ![python_enviroment_install1](https://pic.allen5183.synology.me/python_enviroment_install1.png#w60))


## IPython 交談式命令視窗

`IPython` 命令視窗是 `Python` 命令視窗的加強進階功能，除了可用交談模式立即執行使用這輸入的 `Python` 指令碼，還提供了進階功能。

終端機下直接執行 `IPython` 即可開啟 `IPython` 命令視窗，在 `IPython` 命令視窗中輸入 `Python` 程式碼，按 `Enter` 鍵後會立刻執行並顯示執行結果。

![IPython](https://pic.allen5183.synology.me/IPython.png#w60)

每一列程式碼皆有延續性，假如下圖設定兩個變數，再列印兩數總和:
![IPython](https://pic.allen5183.synology.me/Ipython_2.png#w60)

**重覆使用程式碼**
若要輸入的程式碼與曾經輸入過的程式碼雷同，可以修改曾經輸入過的的程式碼，按 `↑` 鍵可顯示上衣列程式碼，按 `↓` 鍵可顯示下一列程式碼，找到程式碼後加以修改，按 **Enter** 鍵就會執行。

**觀看全部程式碼**
當程式碼數量較多時，常會忘記前面曾經輸入過的程式碼。此時可執行 `history` 命令觀看全部程式碼。
![IPython_history](https://pic.allen5183.synology.me/IPython_history.png#w60)

**查詢使用說明**
`IPython` 命令視窗提供非常強大的查詢使用說明功能，只在變數、命令、函式、套件等名稱加上 `?`，就會顯示該項目的使用說明。

![IPython_help](https://pic.allen5183.synology.me/IPython_help.png#w60)
**<center> print 使用說明</center>**

![IPython_help](https://pic.allen5183.synology.me/Ipython_help2.png#w60)

**<center> 變數 a 使用說明</center>**

**簡易智慧輸入**
加快輸入速度，也減少使用者輸入時產生錯誤。`IPython` 命令視窗也提供簡易的智慧輸入功能，可用於變數、命令、函式、套件等，減少輸入錯誤。

透過 `tab` 鍵，自動補全未輸入的文字。

**執行 Python 程式檔案**
`IPython` 命令視窗執行 `Python` 程式檔案的命令為:
`run Python_程式檔案路徑`，例如: `run c:\python\source\hello.p`。

**結束 Python 程式檔案**
`IPython` 命令視窗執行 `quit`，然後按 `Enter` 鍵。

## Spyder 編輯器

1. 按 [開始] \ [Anaconda3] \ [Spyder]，啟動 Spyder：
   ![spyder](https://pic.allen5183.synology.me/spyder.png#w60)
   `1`: `Python` 的版本。
   `2`: 檔案路徑: 預設路徑為: `c:\Users\使用者名稱\檔名.py`
   `3`: 程式編輯區
   `4`: 說明、變數總管、繪圖、檔案總管: 這個區域可以用來查看說明、管理變數、檢視繪圖與管理檔案
   `5`: `IPython` 窗格: 這個區域是 `IPython` 互動模式，可以用來顯示程式編輯區的執行結果，也可以用來輸入並執行 `Python` 程式。
2. 程式編輯區
   程式編輯區可以用來輸入、儲存並執行 `Python` 程式：
   ![spyder](https://pic.allen5183.synology.me/spyder2.png#w60)

3. `IPython` 窗格
   `IPython` 是一個互動式 `Python` 開發環境，不僅能夠讓使用者在互動模式執行 `Python` 程式，還提供顏色標示、歷史記錄、智慧輸入、自動完成、說明、偵錯等功能。
   ![spyder](https://pic.allen5183.synology.me/spyder3.png#w60)

4. 說明窗格
   可以在說明窗格中查看物件的說明。如下圖示點取 `Help` 標籤切換到說明窗格，然後在 `Object` 欄位輸入 `print`，就會顯示 `print()` 函式的說明: 或者，也可以在程式編輯區中加插入點移到要查看說明的文件，例如 `print`，然後按 `Ctrl+I` 鍵，一樣會顯示 `print()` 函式的說明。
   ![spyder](https://pic.allen5183.synology.me/spyder4.png#w60)

5. 變數總管窗格(`Variable Explorer`)
   可以在變數總管窗格中檢視已經建立的變數。例如下圖是點取 `Variable Explorer` 標籤切換到變數總管窗格，然後執行程式，就會顯示程式所建立的變數 `a`。
   ![spyder5](https://pic.allen5183.synology.me/spyder5.png#w60)

6. 繪圖窗格
   可以在繪圖窗格中檢視繪圖結果。例如下圖是點取 `Plots` 標籤，切換到繪圖窗格檢視程式繪製的圖表，若要同時顯示在 `Ipython` 窗格，可以在選項功能表中取消 `Mute Inline Plotting`。
   ![spyder6](https://pic.allen5183.synology.me/spyder6.png#w60)

7. 檔案總管窗格
   可以在檔案總管窗格中管理檔案。例如下圖是點取 `Files` 標籤，切換到檔案總管窗格，然後在檔案按一下滑鼠右鍵，就可以開新檔案、開新資料夾、複製、搬移、刪除、重新命名或執行檔案。
   ![spyder7](https://pic.allen5183.synology.me/spyder7.png#w60)

## Google Cloab 雲端開發環境

若沒有安裝 `Python` 開發環境，可以改用線上 [Google Cloud](https://colab.research.google.com/)，這是一個在雲端運行的開發環境，由 `Google` 提供虛擬機器，支援 `Python` 程式與資料科學、機器學習等套件，只要夠過瀏覽器就可以撰寫並執行 `Python` 程式，同時具備下列優點:

-   不必進行任何設定
-   免費使用 `GPU(Graphics Processing Unit)
-   輕鬆共用

`Colab` 用來儲存文字或程式碼的島案格式比較特別，其附檔名是 `.ipynb`，也就是所謂的**筆記本**(`notebook`)，可以在單一文件中結合可執行的程式碼和 `RFT` 格式，並附帶圖片、`HTML`、`LaTex` 等其他格式的內容。

1. 新增筆記本
   開啟瀏覽器登入 `Google` 帳號，連線到 `https://colab.research.google.com/`， 然後按 [新增筆記本]。
   ![Colab1](https://pic.allen5183.synology.me/Colab_1.png#w60)

    出現如下畫面，可以在此編輯文字或程式碼，而你所建立的 `Colab` 筆記本將會儲存到 `Google` 雲端硬碟，方便你將 `Colab` 筆記本與同事或朋友共用，讓他們在筆記本上註解或進行編輯。
    ![Colab2](https://pic.allen5183.synology.me/Colab_2.png#w60)
    **[檔案]**功能表的選項可以用來新增、開啟、上傳、重新命名、移動、移至垃圾桶、儲存或下載記事本，而且下載格式有 `.ipynb` 和 `.py` 兩種。
    ![Colab3](https://pic.allen5183.synology.me/Colab_3.png#w60)

2. 在儲存格輸入並執行程式
   在筆記本的畫面中有 `圓圈圈箭頭` 符號的地方稱為程式碼儲存格(`code cell`)，可以在此輸入程式碼，例如: `print("Hello World")`，然後點取圖式 `(2)`，會執行得到結果。
   ![Colab4](https://pic.allen5183.synology.me/Colab_4.png#w60)

    - 要刪除儲存格，可以在儲存格按滑鼠右鍵，然後選取 `刪除`
    - 要在目前的儲存格下面新增程式碼儲存格，可以選取 `插入` > `程式碼儲存格`
    - 要執行目前的儲存格並新增程式碼儲存格，可以按 `shift+enter` 鍵；若要執行所有儲存格，可以按下 `Ctrl+F9` 鍵。
    - 若要在目前的儲存格下面新增文字儲存格(`text cell`)，可以選取 `插入` > `文字儲存格`，就會出現如下面的儲存格讓你輸入文字。
      ![Colab5](https://pic.allen5183.synology.me/Colab_5.png#w60)

3. 使用 `Colab AI` 生成程式碼
   `Colab` 的生成式 `AI` 功能可以生程式碼，要注意的是 `Google` 會蒐集相關的提示與生成的程式碼，用來改善開發 `Google` 產品，所以請勿在提示中加入你的敏感資料或個人資料，此外，該功能屬於實驗性技術，有時可能會生成不正確的資訊，請審慎使用並適時加以驗證。
   使用 `Colab AI` 生成程式碼的步驟如下:
   ![Colab6](https://pic.allen5183.synology.me/Colab_6.png#w60)
   儲存格內點擊 `生成` 連結，

    `幫我寫一個1加到100計算總合的 Python 程式碼`
    ![Colab7](https://pic.allen5183.synology.me/Colab_7.png#w60)
    ![Colab8](https://pic.allen5183.synology.me/Colab_8.png#w60)

4. 重新命名、儲存、開啟與下載筆記本

5. 上傳筆記本

## Conda

| 指令                                        | 用途                                               | 補充                                                 |
| ------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| `conda list`                                | 顯示已安裝套件                                     | 無                                                   |
| `conda update 套件名稱`                     | 更新套件                                           | `easy_install -U 套件名稱`、`pip update 套件名稱`    |
| `conda install` 套件名稱                    | 安裝套件                                           | `pip install 套件名稱`、`easy_install 套件名稱`      |
| `conda uninstall` 套件名稱                  | 移除套件                                           | `easy_install -m 套件名稱`、`pip uninstall 套件名稱` |
| `conda create -n 虛擬環境名稱 python=版本`  | 安裝虛擬環境                                       | 無                                                   |
| `conda create -n 虛擬環境名稱 --clone root` | 建立一個與現有 `Python` 虛擬環境完全相同的虛擬環境 | 無                                                   |
| `activate 虛擬環境名稱`                     | 啟動虛擬環境                                       | 無                                                   |
| `deactivate`                                | 關閉虛擬環境                                       | 無                                                   |
| `conda info -e`                             | 查看目前所有虛擬環境名稱                           | 無                                                   |
| `conda remove -n 虛擬環境名稱 --all`        | 移除指定的虛擬環境                                 | 無                                                   |

> `CONDA_ENVS_PATH=虛擬環境安裝位置`

---

## 虛擬環境設置

@import "./markdown/虛擬環境設置.md"

---
