
---
title: python 檔案存取
draft: false
description:
date: 2026-07-14
tags: python

---

## 檔案存取

### 認識檔案路徑

無論是文字、圖形或程式，均以檔案 (`file`) 的形式存放在儲存裝置，而且使用者還可以將數個檔案存放在目錄 (`directory`) 或資料夾 (`folder`)。
目錄具有階層式結構，下圖是 `Windows` 檔案總管，左窗格會顯示樹狀目錄，右窗格會顯示目前資料夾的內容，只要按一下網址列，就會顯示目前資料夾的路徑。

![文件資料夾](https://pic.allen5183.synology.me/文件資料夾.png#w60)

檔案路徑的指定方式有下列兩種：

- 絕對路徑 (`absolute path`)：這種方式必須寫出根目錄、所有子目錄及檔案名稱，例如 `C:\Program Files\Microsoft Office\Office\Excel.exe`。
- 相對路徑 (`relative path`)：這種方式必須寫出從目前目錄到檔案所經過的子目錄，舉例來說，假設目前目錄為 `C:\Program Files\Microsoft Office`，若要以相對路徑表示檔案 `Excel.exe`，可以寫成 `\Office\Excel.exe`。

### 寫入檔案

可以使用 `Python` 內建的 `open()` 函式建立檔案物件，其語法如下，當建立成功時，會傳回檔案物件，相反的，當建立失敗時，會發生錯誤：

```python
open(檔案名稱[,模式][,編碼])
```

`open` 函式全部有 `8` 個參數，最常使用的是**檔案名稱**、**模式**和**編碼**參數，其中只有第一個檔案名稱是不可省略，其他的參數都可以省略，省略時會使用**預設值**。

■ 檔案名稱: 設定檔案的名稱，它是**字串型態**，可以是**相對路徑**或**絕對路徑**，如果沒有設定路徑，則會預設為目前執行程式的目錄。

■ 模式:設定檔案開啟的模式，它也是**字串型型態**。省略將預設為**讀取模式**。

模式|説明|模式|説明
--|--|--|--
`r`|讀取模式，此為預設模式。|`r+`|可讀寫模式，指標會置於檔頭。
`w`|寫入模式，若檔案已存在，內容將會被覆蓋。|`w+`|可讀寫模式，指定檔案不存在時會建立檔案再寫入檔案。若檔案已存在，寫入內容會覆蓋原內容。
`a`|附加模式，若檔案已存在，內容會被附加至檔案尾端。|`a+`|可讀寫模式,指定檔案不存在時會建立檔案再寫入檔案，若檔案已存在，寫入內容會附加至檔案尾端。

**檔案指標(file pointer)**
是一個特殊的標記，用來指向目前檔案的位置，資料做讀或寫時，這個檔案指標就會往前移動。
**檔案路徑表達:**
使用跳脫序列 `\\` 來表示 `\:`

```python
fileObject = open("E:\\temp\\test.txt", "r")
```

檔案開啟變成**物件**後，方便之後進行存取。

**也可以寫成:**
在絕對路徑前面加上 `r(raw)`，表示原始字串(`raw string`)，就可以不使用跳脫序列 `\\` 來表示 `\:`

```python
fileObject = open(r"E:\temp\test.txt ", "r")
```

- 檔案開啟不存在時，報錯 `FileNotFoundError`
- 寫入時，檔案不存在會建立

`open` 函式會建立一個物件，利用這個物件就可以處理檔案，檔案處理結束也會以 `close` 函式關閉檔案。

```python
f=open('file1.txt',r)
...
f.close()
```

**省略模式**時預設為**文字模式t**，也可以在模式後面加 `t` 或 `b` 表示要以**文字模式**或**二進位模式**開啟檔案。

1. 例如: 開啟 `file1.txt` 文字檔為**寫入模式**，並將資料寫入檔案中。

   `nano filewrite1.py`

   ```python{.line-numbers}
   content = '''Hello Python
   中文字測試
   Welcome
   '''

   f=open('file1.txt','w',encoding='utf-8')
   f.write(content)
   f.close()
   ```

   上例以 `「'''...'''」` 定義 `content` 變數，兩個 `「'''」` 字元間的內容會保留原來格式輸出,
   因此 `content` 變數的內容為:

   ```yaml
   Hello Python
   中文字測試
   Welcome
   ```

   執行完畢後,用記事本開啟 `file1.txt` 文字檔，内容如下:

   ```yaml
   Hello Python
   中文字測試
   Welcome
   ```

   > 按另存新檔，會發現中文 `Windows` 系統預設的編碼是 `ANSI`。

2. 例如: 寫入二進位檔案 `file.bin` 二進位檔為 `b`，在模式 `w` 後面加上 `b`。

   ```python
   # binarywrite.py
   content='''Hello Python
   中文字測試
   Welcome
   '''

   content=content.encode("utf-8") #轉成 bytes
   with open('file.bin','wb') as f:
       f.write(content)
   ```

   >二進位檔案的資料是 `bytes` 位元組串列的格式，因此若是字串必須以 `encode()` 函式轉換為 `byte` 位元組串列。

3. 例如: 讀取二進位檔案 `file.bin` 二進位檔為 `b`，在模式 `r` 後面加上 `b`。

   **範例:** `binaryread.py`

■ 編碼: 指定檔案的編碼模式，一般可設定 `ANSI/繁體中文(cpcp 950)` 或 `UTF-8(chcp 65001)`(大小寫都可以)。
  如果是用 `Spyder` 儲存的檔案，預設編碼為 `UTF-8`，若是繁體中文 `Windows` 系統，編碼依作業系統而定，預設的編碼是`cp950`，也就是記事本儲存為 `ANSI` 的編碼。
  可以在 `.py` 程式中以下列程式取得目前作業系統設定的編號。

  `「ANSI 編碼」` 不是一種固定的編碼，其實 `ANSI` 是 `Windows` 對「系統預設編碼」的統稱。
  也就是說：

  `ANSI` = 依你電腦的語系而不同的編碼

  在不同語系 `Windows`：

  | `Windows` 語系 | `ANSI` 實際使用的編碼        |
  | ---------- | ------------------- |
  | 中文（台灣）     | `**Big5` / `CP950**`    |
  | 中文（香港）     | `**HKSCS**`（`Big5` 擴充版） |
  | 日本 `Windows` | `Shift-JIS`           |
  | 韓文 `Windows` | `EUC-KR`              |
  | 英文 `Windows` | `CP1252`              |

  所以：
  臺灣人的電腦 → `ANSI` 就等於 `Big5（CP950）`
  不是國際標準、不是 `UTF-8`，更不是 `Unicode`。

  **ANSI（Big5） vs UTF-8 有什麼差別？**

  | 項目    | `ANSI（Big5）`  | `UTF-8`               |
  | ----- | ----------- | ------------------- |
  | 本質    | 舊式地方編碼      | `Unicode` 全球統一編碼      |
  | 可顯示語言 | 很有限（只有繁體中文） | 幾乎所有語言（含符號 & `emoji`） |
  | 中文佔用  | `2 bytes`     | `3 bytes`（有時 `4`）       |
  | 亂碼風險  | 高（跨平台必亂碼）   | 幾乎不會                |
  | 跨平台   | 差           | 最佳                  |


 ❗ 為什麼常看到亂碼？
   因為：
  - 你用 `ANSI（Big5）` 保存檔案
  - `Python` / `VS Code` / `Git` 以 `UTF-8` 開啟
  - `Big5` 與 `UTF-8` 完全不相容 → 亂碼

   ✔ 如何解決？使用 `UTF-8` 編輯檔案
   在 `VS Code`、`Notepad++`、`PyCharm` 都要選： `UTF-8`

   `VS Code` 右下角可看到：

   ```nginx
   Big5 → 點它 → UTF-8
   ```

   `Python` 程式也建議宣告 `UTF-8`：

   ```python
   # -*- coding: utf-8 -*-
   ```

  📌 結論（最簡短）
  - `ANSI` 是 `Windows` 依語系變動的本地編碼，`台灣 = Big5`。
  - 繁體中文編碼（`Big5`）是舊式編碼，不支援全球文字。
  - `UTF-8` 才是現代、跨平台、不亂碼的標準。

```python
import locale
print(locale.getpreferredencoding())
```

>請注意: 在中文 `Windows` 系統中開啟一個純文字檔案，用「記事本」編輯的話，預設是用 `ANSI` 編碼儲存，因此可以使用下列語法開啟 `ANSI` 編碼的檔案。

```python
f=open('file1.txt', 'r')
```

或明確指定檔案編碼是 `cp950`

```python
f=open('file1.txt','r', encoding = 'cp950')
```

`file.txt` 是 `UTF-8` 編碼型態，若使用 `encoding ='cp950'` 去讀取,會顯示資料內容會出現錯誤。

```python
f=open('file.txt','r',encoding ='cp950')
```

必須將 `encoding` 指定為 `UTF-8` 才可順利讀取和顯示。

```python
f=open('file.txt','r',encoding ='UTF-8')
```

由於國際間通行的編碼以及許多 `Linux` 系統,預設都是使用 `UTF-8` 編碼，因此建議將檔案另存為 `UTF-8`(不要使用 `ANSI`)

### 讀取檔案

1. 從檔案讀取資料的步驟如下：
   - 開啟檔案：使用 `open()` 函式建立檔案物件。
   - 讀取檔案：使用檔案物件提供的 `read()`、`readline()` 或 `readlines()` 方法讀取資料。

     - `read()`
       - 格式: `read(n)`: 從檔案指標讀取 `n` 個字元。
       - 範例: 讀整篇文章 `ch07_7_3_1.py`

         ```python{.line-numbers}
         fileObject = open("C:\\project\\python\\ch7\\poem.txt", "r")
         content = fileObject.read()
         print(content)
         fileObject.close()
         ```

       - 結果

         ```yaml
         登金陵鳳凰台
         鳳凰臺上鳳凰遊，鳳去臺空江自流。
         吳宮花草埋幽徑，晉代衣冠成古邱。
         三山半落青又外，二水中分白鷺洲。
         總為浮雲能蔽日，長安不見使人愁。
         ```

       - 範例: 讀幾個字元 `ch07_7_3_2.py`

         ```python{.line-numbers}
         fileObject = open(r"C:\project\python\ch7\poem.txt", "r") # 開檔
         str1 = fileObject.read(6) # 從檔案指標處讀取 6 個字
         print(str1) # 印出剛剛讀取的文字
         str2 = fileObject.read(8) # 從檔案指標處讀取 8 個字
         print(str2) # 印出剛剛讀取的文字
         fileObject.close() # 關檔
         ```

       - 結果:

         ```yaml
         登金陵鳳凰台

         鳳凰臺上鳳凰遊
         ```

       - 檔案物件的操作:
         - `seek(offset[,whence])`: 將檔案指標移動到第 `offset+1` 個位元組，ex: `seek(0)` 移動到第一個位元組，即檔案開頭。 操作失敗回傳 `-1`

           - `offset`: 從 `whence` 位置開始算起，相對的編移位置。
           - `whence`: `0` 表示從文件最前端開始算起，`1` 代表從目前位置開始算起，`2` 代表從文件末尾算起。

           範例: `ch07_7_3_3.py`

           ```python
           fileObject = open(r"C:\project\python\ch7\poem.txt", "r") # 開檔
           fileObject.seek(4) # 將檔案指標移動到第 5 個位元組
           print(fileObject.read(1)) # 讀取 1 個字。  輸出: 陵
           fileObject.seek(0) # 將檔案指標移動到第 1 個位元組，offset 須為 0,2,4,6,... 偶數，因為中文字為 2 個位元組
           print(fileObject.read(1)) # 讀取 1 個字。  輸出: 登
           fileObject.close() # 關檔
           ```

         - `tell()`: 傳回文件目前的索引位置

           範例: 開啟 `file.bin` 二進位檔為讀取模式，配合 `seek` 函式讀取指定的資料。
                `fileseek.py`

     - `readline()`: 從檔案讀取一行資料後，回傳一個**字串**，讀到檔尾會回傳一個**空字串**。

       **範例:** `readline1.py`
     - `readlines()`: 從檔案讀取所有行資料，然後以**串列**方式回傳。
       **範例:** `readlines.py`

   - 關閉檔案：使用檔案物件提供的 `close()` 方法關閉檔案。


### `with` 敘述

在結束存取檔案後，必須呼叫 `close()` 方法關閉檔案物件，若是怕遺漏這個步驟，可以使用 `with` 敘述將存取檔案的動作包裝在一個區塊，其語法如下，一旦程式執行的動作離開區塊，就會自動關閉檔案物件

- 語法

  ```python
  with open(file, mode) as 檔案物件名稱:
      ....     # 存取檔案的動作
  ```

- 範例: `ch07_7_4.py`

> 注意: `with` 敘述内的程式必須縮排。

### 管理檔案與資料夾

日常生活中有太多的時間都是在處理檔案和資料， `Python` 提供 `os`、`shutil` 和 `glob` 等
實用的模組，方便操作檔案和目錄。

1. 檢查檔案或資料夾是否存在
   我們可以使用 `os.path` 模組提供的 `exists(path)` 函式檢查參數 `path` 指定的檔案或資料夾是否存在，例如：

   ```python
   os.path.exists("C:\\")        # 檢查 C:\ 是否存在 => True
   os.path.exists("C:\\f1.txt")  # 檢查 C:\f1.txt 是否存在 => False
   ```

2. 檢查路徑是否為存在的檔案或資料夾
   可以使用 `os.path` 模組提供的 `isfile(path)`、`isdir(path)` 函式檢查參數 `path` 指定的路徑是否為檔案或資料夾，例如：

   ```python
   os.path.isdir("C:\\")  # 檢查 C:\ 是否為資料夾， True 表示是
   os.path.isfile("C:\\") # 檢查 C:\ 是否為檔案， False 表示否
   os.path.isdir("poem.txt") # 檢查 poem.txt 是否為資料夾， False 表示否
   os.path.isfile("poem.txt") # 檢查 poem.txt 是否為檔案， True 表示否
   ```

   **應用:**
   檔案操作時先判斷是否存在在執行。

   `ch07_7_4.py`

3. 取得檔案的完整路徑
   可以使用 `os.path` 模組提供的 `abspath(file)` 函式取得參數 `file` 指定之檔案的完整路徑，例如：

   ```python
   import os.path
   print(os.path.abspath(r"C:\project\python\ch7\poem.txt")) # C:\project\python\ch7\poem.txt
   ```

4. 取得目前的工作目錄

   ```python
   import os
   print(os.getcwd())
   ```

5. 取得檔案的大小
   `os.path` 用以處理檔案路徑和名稱，檢查檔案或路徑是否存在，也可以計算檔案的大小。 `os.path` 包含在 `os` 模組內，匯入 `os` 模組即可使用:

   ```python
   import os
   ```

   `os.path` 提供下列的函式:

   函式|説明
   --|--
   `abspath()`|傳回檔案完整的路徑名稱。
   `basename()`|傳回檔案路徑名稱最後的檔案或路徑名稱。如果測試的是檔案會傳回檔名，測試的是路徑會傳回路徑。
   `dirname()`|傳回指定檔案完整的目錄路徑，`dirname(__file__)` 則可以取得目前的目錄路徑。
   `exists()`|檢查指定的檔案或路徑是否存在。
   `getsize()`|取得指定檔案的大小(`Bytes`)。
   `isabs()`|檢查指定路徑是否為完整路徑名稱。
   `isfile()`|檢查指定路徑是否為檔案。
   `isdir()`|檢查指定路徑是否為目錄。
   `split()`|分割檔案路徑名稱為目錄路徑和檔案。
   `splitdrive()`|分割檔案路徑名稱為磁碟機和檔案路徑名稱。
   `join()`|將路徑和檔案名稱結合為完整路徑。

   - `os.path.exists()`:
     檢查指定的檔案或路徑是否存在。 `osexists.py`

     ```python
     import os
     filename=os.path.abspath("osexists.py")
     if os.path.exists(filename): #檢查檔案是否存在
         print("完整路徑名稱：" + filename)
         print("檔案大小：" , os.path.getsize(filename))
     ```

   - `os.path.dirname()`:
     `dirname()` 函式傳回指定檔案完整的目錄路徑，`dirname(__file__)` 則可以取得目前的目錄路徑。 `osdirname.py`

     ```python
     import os
     cur_path=os.path.dirname(__file__) # 取得目前目錄路徑
     print("現在目錄路徑："+cur_path)
     ```

   - `os.path.join()`:
     `join` 函式可以將參數內的字串結合成一個檔案路徑，參數可以 `2` 個或 `2` 個以上。
     例如: 取得最後的檔案或路徑名稱、目前檔案目錄路徑、偵測是否為目錄、將路徑分解為路徑和檔名、取得磁碟機名稱以及檔案路徑結合等。 `ospath.py`

     ```python
     import os
     filename=os.path.abspath("ospath.py")
     if os.path.exists(filename):
         basename=os.path.basename(filename)
         print("最後的檔案或路徑名稱：" + basename)

         dirname=os.path.dirname(filename)
         print("目前檔案目錄路徑：" + dirname)

         print("是否為目錄：",os.path.isdir(filename))

         fullpath,fname=os.path.split(filename)
         print("目錄路徑：" + fullpath)
         print("檔名：" + fname)

         Drive,fpath=os.path.splitdrive(filename)
         print("磁碟機：" + Drive)
         print("路徑名稱：" + fpath)

         fullpath = os.path.join(fullpath, fname)
         print("組合路徑= " + fullpath)
     ```

   - `os.path.getsize(file)`:
     可以取得參數 `file` 指定之檔案的大小 (單位為位元組)，例如：

     ```python
     import os.path
     print(os.path.getsize(r"C:\project\python\ch7\poem.txt")) # 148
     ```

6. `os.remove()`: 刪除檔案
   可以使用 `os` 模組提供的 `remove(file)` 函式刪除參數 `file` 指定的檔案，例如：

   **範例:** `remove.py`

7. `os.mkdir()`: 建立資料夾
   可以使用 `os` 模組提供的 `mkdir(dir) `函式建立參數 `dir` 指定的資料夾，

   **範例:** `mkdir.py`

8. `os.rmdir()`: 刪除目錄
   可以使用 `os` 模組提供的 `rmdir(dir)` 函式刪除參數 `dir` 指定的資料夾，例如：

   **範例:** `rmdir.py`

9. 複製檔案
   - 方法一: 使用 `f.read()` 與 `f.write()`。 例如: `copyfile.py`

   - 方法二: 可以使用使用 `shutil` 模組提供的 `copy(src, dst)` 函式將參數 `src` 指定的檔案複製到參數 `dst` 指定的檔案或資料夾，例如: `copy.py`

10. `shutil` 模組:
    `shutil` 是一個可跨平台的檔案處理模組，它提供一些函式，可以在 `Python` 程式中執行檔案或目錄的複製、刪除或搬移。首先必須匯入 `shutil` 模組:

    ```python
    import shutil
    ```

    **常用的函式如下:**

    屬性或函式|說明
    ------|-----
    `copy(來源檔案,目的檔案)` |複製來源檔案及其權限到目的檔案。
    `copyfile(來源檔案，目的檔案)`| 複製來源檔案到目的檔案。
    `copytree(來源目錄，目的目錄)`| 將來源目錄及其中所有檔案新增到目的目錄。
    `rmtree(目錄)`| 刪除指定目錄及其中所有檔案。
    `move(來源檔案或目錄，目的地)`| 將來源檔案或目錄搬移到目的地。

    >和 `os` 的函式相比較，`shutil` 提供更強的處理能力，而且可以跨平台。

    - `os.shutil.copy`、`os.shutil.copyfile`:
      `copy` 和 `copyfle` 函式都可以複製來源檔案到指定的目的檔案，執行時必須確定來源檔案已存在。

      範例: `shutila.py`

    - `os.shutil.copytree`: 複製資料夾，`copytree` 和 `copy` 相似，但它複製的是目錄，複製時來源目錄底下的子目錄和檔案也會被複製,執行時必須確定來源目錄已存在。 可以使用 `shutil` 模組提供的 `copytree(src, dst)` 函式將參數 `src` 指定的資料夾複製到參數 `dst` 指定的資料夾，例如： `copydir.py`

      範例: `copytree`

    - `os.shutil.move`: 搬移檔案或資料夾
      可以使用 `shutil` 模組提供的 `move(src, dst)` 函式將參數 `src` 指定的檔案或資料夾搬移到參數 `dst` 指定的檔案或資料夾，傳回值是目的路徑，例如： `shutilmove.py`

    - `os.shutil.rmtree()`:
      `os` 模組的 `rmdir` 只能刪刪除空的目錄，而 `rmtree` 則可以刪指定目錄及目錄底下的子目錄和檔案，執行時必須確定要刪除的目錄已存在。

      範例: `rmtree.py`

11. 取得符合條件的檔案名稱
   可以使用 `glob` 模組提供的 `glob(path)` 函式在參數 `path` 指定的路徑取得符合條件的檔案名稱，例如： `filesearch.py`

   > `*` 星號為萬用字元，表示任意零個以上的字元，`[]` 表示在字元範圍中的任一字元，例如 `[a-c]` 表示字元 `a`、`b`、`c`

12. 執行作業系統命令

   ```python
   import os
   cur_path=os.getcwd() # 取得目前路徑
   os.system("cls")  # 清除螢幕
   os.system("mkdir dir2")  # 建立 dir2 目錄
   os.system("copy ossystem.py dir2\copyfile.py") # 複製檔案
   file=cur_path + "\dir2\copyfile.py"
   os.system("notepad " + file)  # 以記事本開啟 copyfile.py 檔
   ```

13. 搜尋指定目錄以及子目錄
    `os.walk()` 可以搜尋指定目錄以及其子目錄，它會傳回一個包含 `3` 個元素的元組，分別是目錄名稱(`dirname`)、下一層目錄串列(`subdir`)和目前目錄中所有檔案串列(`fles`)。

    由於它具有類似遞迴方式的處理能力，可以遍歷所有的子目錄，功能非常強大。

    本例先將 `oswalk` 目錄下，該目錄包含了 `Dir` 目錄和 `oswalk.py`、`oswalk1.txt` 檔，並在 `Dir` 目錄下又建立了 `SubDir` 目錄和 `<Dirl.txt`、`Dir2.txt` 同時在在 `SubDir` 目錄也建立了檔案 `SubDir1.txt` 檔。
    架構如下:

    ![](https://pic.allen5183.synology.me/python_osgetwalk.png#w60)

    **範例:** `osgetwalk.py`

    1. 首先取得的檔案路徑是 `oswalk`，該路路徑包含一個 `Dir` 目錄串列和 `oswalk.py`、`oswalk1.txt` 檔。
    2. 接著進入子目錄 `Dir`,`Dir` 目錄下包含了 `SubDir` 目錄和 `Dir1.txt`、`Dir2.txt` 檔。
    3. 最後進入 `SubDir` 目錄，該目錄串列為 `[]` 表示已無子目錄，同時顯示包含了 `SubDir1.txt` 檔。

