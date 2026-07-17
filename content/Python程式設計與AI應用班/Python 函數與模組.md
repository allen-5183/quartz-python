
---
title: python 函數與模組
draft: false
description:
date: 2026-07-14
tags: python

---

## python_函數與模組

## 自訂函式

1. **建立自訂函式**
   格式:

   ```python
   def 函數名稱([參數 1, 參數 2, ......])
       程式區塊
       [rerurn 回傳值 1, 回傳值 2, ......]
   ```

   - 函式建立後必須在主程式中呼叫函式後才會執行。
   - 函式回傳值可以使用變數來儲存返回值。

     ```python
     def GetArea(width, height):
         area = width * height
         return area
     ret1 = GetArea(6,9) # ret1=54
     ```

   - 函式回傳值有多個時，必須使用相同數量的變數來儲存返回值，變數之間用逗號 `，` 分開:

     ```python
     """
     test 模組
     這個模組包含 Circle() 函式，用於計算圓的面積與周長。
     """

     def circle(radius: float) -> tuple[float, float]:
         """
         計算圓的面積與周長。

         參數：
             radius (float): 圓的半徑。

         回傳：
             tuple[float, float]:
                 傳回一個包含兩個值的 tuple。
                 - 第一個是圓面積 (area)
                 - 第二個是圓周長 (length)
         """
         area = radius * radius * 3.14  # 計算面積
         length = 2 * radius * 3.14  # 計算周長
         return area, length


     area1, length1 = circle(5)
     print(f"面積 = {area1}, 周長 = {length1}")
     ```

     >`Python` 是 動態型別語言（`dynamically typed language`），
      因此變數型別是在 程式執行時（`runtime`） 才決定，而不是在程式撰寫階段。

   - 函式可以使用指定參數名稱方式，避免參數輸入錯值

     ```python
     def GetArea(width, height):
         return width * height
     ret1 = GetArea(6,9)                # ret1=54
     ret2 = GetArea(width=6, height=9)  # ret2=54
     ret3 = GetArea(height=9, width=6)  # ret3=54
     ```

   - **練習: 範例:攝氏溫度轉華氏溫度** ``
     攝氏轉華氏公式: `華氏 =攝氏*1.8+32`。 約翰由美國來台遊學,習慣華氏溫度,設計程式讓約翰輸入攝氏溫度,就會顯示華氏溫度。

2. **參數預設值**
   若函式中某些參數是必填的，為了怕執行時忽略設定造成錯誤，在建立函式時可以為參數設定預設值。當呼叫函式時遇到沒有設定該參數的情況時，就會使用預設值。
   參數設定預設值的方法為「參數=值」,例如:

   ```python
   def GetArea(width, height=12) : # 計算長方形面積
       return width * height
   ret1 = GetArea(6)    # ret1=72 (6*12)
   ret1 = GetArea(6, 9) # ret1=54 (6*9)
   ```

   >注意: 設定預設值的參數必須置於參數串列最後，否則執行時會產生錯誤，例如:

   ```python
   def GetArea(width, height=12) : # 正確
   def GetArea(width=18, height):  # 錯誤,需將「width=18」移到後面
   ```

3. **變數有效範圍**
   變數依照其有效範圍分為**全域變數**及**區域變數**:
   **全域變數**: 定義在函式外的變數，其有效範圍是整個 `Python` 檔案。
   **區域變數**: 定義在一個函式中的變數，其有效範圍是在該函式內。

   **全域變數與區域變數的差別**
   若有相同名稱的全域變數與區域變數，在函式內，會使用區域變數，在函式外，因區域變數不存在，所以使用全域變數，例如:

   ```python
   def scope():
       var1 = 1          # 區域變數 var1
       # 在函式內會優先使用區域變數,var1的值為「1」;因為函式中沒有 var2變數,所以使用全域變數,其值為「20」。
       print(var1, var2) # 1 20

   var1 = 10             # 建立全域變數 var1
   var2 = 20
   scope ( )
   # 在函式外區域變數不存在,所以都是全域變數,值為「1020」。
   print(varl, var2)
   ```

   **`global` 定義全域變數**
   如果要在函式內使用全域變數，需在函式中以 `global` 宣告。

   ```python
   def scope():
       global var1 # 宣告函式内的 var1 是全域變數,
       var1 = 1    # 將全域變數 var1 的值改為 1
       var2 = 2
       # 列印的是全域變數 var1 及區域變數 var2， 其值為「1，2」
       print(var1, var2) #1 2

   var1 = 10
   var2 = 20
   scope ( )
   # 在函式外,都使用全域變數,此時 var1 的值已在函式中被修改為 「1」，所以列印值為 「1，20」。
   print(varl, var2) #1 20
   ```

## 4. **函數的參數傳遞**




## 數值函式

凡是在程式中需要反覆執行的程式碼就可以寫成函式,當要執行時只需呼叫函式即可。但每一項功能都由設計者自行撰寫函式,將是一份龐大的工作。Python 內達了
許多功能強大的函式,設計者可以直接使用,只要符合函式的規則,設計者等於擁有眾多功能強的工具,可以輕鬆設計出符合需求的應用程式。事實上,前面已使用了許多內建函式,如 `print()`、`int()`、`str()`等。

內建的數值函式用於處理數值相關的功能，例如絕對值、四捨六入等。

1. **數值函式整理**
   `Python` 中常用的數值函式有:

   函式|功能|範例|範例結果
   ---|---|---|---
   `abs(x)` |取得`x`的絕對值|`abs(-5)`| `5`
   `chr(x)` |取得整數`x`的字元|`chr(65)`|`A`
   `divmod(x, y)` |取得`x`除以`y`的商及餘數的元組|`divmod(44, 6)`|`(7,2)`
   `float(x)` |將`x`轉換成浮點數|`float("56")`|`56.0`
   `hex(x)` |將`x`轉換成十六進位數字|`hex(34)`|`0x22`
   `int(x)` |將`x`轉換成整數|`int(34.21)`|`34`
   `len(x)` |取得元素個數 |`len([1,3,5,7])`|`4`
   `max(參數串列)` |取得參數串列中的最大值| `max(1,3,5,7)`｜`7`
   `min(參數串列)` |取得參數串列中的最小值 `min(1,3,5,7)` |`1`
   `oct(x)` |將`x`轉換成八進位數字 `oct(34)`|`0042`
   `ord(x)` |回傳字元`x`的`Unicode`編碼值 `ord("我")`|`25105`
   `pow(x, y)` |取得`x`的`y`次方|`pow(2,3)`|`8`
   `round(x)` |以四捨六入法取得`x`的近似值|`round(45.8)`|`46`
   `sorted(串列)`| 由小到大排序 `sorted([3,1,7,5])`|`[1,3,5,7]`
   `str(x)` |將x轉換成字串|`str(56)`|`56(字串)`
   `sum(串列)`| 計算串列元素的總和|`sum([1,3,5,7])`|`16`

2. **指數、商數、餘數及四捨六入**
   - `pow` 函式
     `pow` 函式不但可以做數運算，還可以計算餘數，語法為:

     ```python
     pow(x, y[, z])
     ```

     如果只有`x`及`y`參數，傳回值為`x`的`y`次方，例如: $3^4$ =81

     ```python
     pow(3, 4) # 81
     ```

     若有`z`參數，意義為`x`的`y`次方除以`z`的餘數，例如:

     ```python
     pow(3, 4, 7) # 4
     ```

     `3`的`4`次方為`81`，`81`除以`7`為`11`余`4`,結果為`「4」`。

   - `divmod` 函式
     `divmod` 函式會同時傳回**商數**及**餘數**，語法為:

     ```python
     divmod(x, y)
     ```

     商數及餘數是以元組型態傳回，可使用元組分別取得商數及餘數，例如:

     ```python
     ret = divmod(44, 6)
     print(ret[0], ret[1]) # 72，ret[0]是商，ret[1]是餘數
     ```

   - `round` 函式
     `round` 函式以四捨六入法取得`x`的近似值,語法為:

     ```python
     round(x[， y])
     ```

     四捨六入是`4`以下(含)捨去，`6`以上(含)進位，`5`則視前一位數而定:前一位數是偶數就將`5`捨去,前一位數是奇數就將其進位。
     如果只有`x`參數，傳回值為`x`的四捨六入整數值，例如:

     ```python
     round(3.4) # 3
     round(3.6) # 4
     round(3.5) # 4，前一位是奇數,進位
     round(4.5) # 4，前一位是偶數,捨去
     ```

     若有`y`參數，`y`是設定小數位數，例如:

     ```python
     round(3.75, 1) # 3.8
     round(3.65, 1) # 3.6
     ```


   - **範例**: 學生均分蘋果
     今天學校營養午餐的水果是蘋果: 設計程式輸入學生人數及蘋果總數,將蘋果平均分給學生，每個學生分到的蘋果數量必須相同，計算每個學生分到的蘋果數及剩餘的蘋果數。

3. 最大值、最小值、總和及排序
   - `最大值及最小值`
     `max`函式可取得一群數值的最大值，`min` 函式可取得一群數值的最小值，兩者用法相同。以`max`函式為例，其參數可以是多個參數，也可以是串列，語法為:

     ```python
     max(数值1,數值2,······) #或者
     max(串列)
     ```

     例如:

     ```python
     print(max(1,3,5,7))   # 7， 多個參數
     print(max([1,3,5,7])) # 7，串列
     ```

   - `計算總和`
     `sum` 函式可計串列中所有數值的總和，語法為:

     ```python
     sum(串列[，额外數值])
     ```

     如果有傳入「額外數值」參數，則此額外數值也會被加入總和之中，例如:

     ```python
     print(sum([1,3,5,7])) #16
     print(sum([1,3,5,7], 10)) #26
     ```

     第`1`列總和為`16`，第`2`列加入額外数值`「10」`，所以`16`再加`10`為`26`。

   - `排序`
     `sorted` 函式可將串列中的值排序， 語法為:

     ```python
     sorted(串列[,reverse=True|False])
     ```

     `reverse` 參數的預設值 `False`，即沒有傳入`reverse` 參數時，預設是由小到大排序。
     若是以`「reverse-True」`做為第`2`個參數傳入，就會由大到小排序,例如:

     ```python
     print(sorted([3,1,7,5])) #[1,3,5,7]
     print(sorted([3,1,7,5], reverse=True)) #[7,5,3,1]
     ```

  - **範例:** 電費統計及排序
    為了達到節能減碳目的，爸爸要了解家中最近幾個月用電量情況:設計程式讓爸爸輸入電費,若輸入`「-1」`表示輸入資料結束，以內建函式顯示最多電費、最少電費、電費總和及將電費由大到小排序。

## 字串函式

內建的字串函式用於處理字串相關的功能，例如轉換大小寫、字串分割等。

1. 字串函式整理
   `Python` 中常用的字串函式有:

   函式|功能|範例|範例結果
   ----|----|----|-------
   `center(n)`     |  將字串擴充為`n`個字元且置中                  | `"book".center(8)`         | `"  book  "`
   `find(s)`        |  搜尋s字串在字串中的位置                     | `"book".find("k")`         | `3`
   `endswith(s)`    |  字串是否以`s`字串結尾                       | `"abc".endswith("c")`      | `True`
   `islower()`      |  `False` 字串是否都是小寫字母                | `"Yes".islower()`          | `False`
   `isupper()`      |  `True` 字串是否都是大寫字母                 | `"YES".isupper()`          | `True`
   `s.join(list)`   |  將串列中元素以`s`字串做為連接字元組成一個字    | `"#".join (["ab", "cd"])`   | `ab#cd`
   `len(字串)`      |  取得字串長度                                | `len("book")`              | `4`
   `ljust(n)`       |  將字串擴充為`n`個字元且靠左                 | `"book".ljust(8)`          | `"book    "`
   `lower()`        |  將字串字元都轉為小寫字母                    | `"YEs".lower()`            | `yes`
   `lstrip()`       |  移除字串左方的空白字元                      | `"book ".lstrip()`         | `"book  "`
   `replace(s1,s2)` |  將字串中的`s1`字串以`s2`字串                | `"book".replace("o","a")`  | `baak`
   `rjust(n)`       |  將字串擴充為`n`個字元且靠右                 | `"book".rjust(8)`          | `"book"`
   `rstrip()`       |  移除字串右方的空白字元                      | `"book ".rstrip()`         | `"book"`
   `split(s)`       |  將字串以`s`字串為分隔字元分割為串列         | `"ab#cd".split("#")`         | `["ab","cd"]`
   `startswith(s)`|字串是否以`s`字串開頭                       | `"abc".startswith("a")`    | `True`
   `strip()`        |  移除字串左右方的空白字元                    | `"book ".strip()`          | `"book"`
   `upper()`        |  將字串字元都轉為大寫字母                    | `"Yes".upper()`            | `YES`

2. 連接及分割字串
   - `join`函式
     `join` 函式可將串列中元素連接組成一個字串，語法為:
     `連接字串.join(串列)`
     `join` 函式會在元素之間插入「連接字串」來組成一個字串,例如:

     ```python
     list1 = ["This", "is", "a", "book."]
     print(" ".join(listl)) #This is a book.
     print("zzz".join(list1)) #Thiszzzziszzzazzzbook.
     ```

   - `split`函式
     `split`函式的功能與`join`函式相反，是將一個字串以指定方式分割為串列，語法為:
     `字串.split([分隔字串])`

     「分隔字串」可有可無，若未傳入分隔字串，其預設值為`1`個空白字元，例如:

     ```python
     str1 = "This is a book."
     print(str1.split(" ")) #['This', 'is', 'a', 'book.']
     print(str1.split()) #['This', 'is', 'a', 'book.'],與上列程式結果相同
     ```

     使用其他分隔字串的例子:

     ```python
     str1 = "Thiszzziszzzazzzbook"
     print(str1.split("zzz")) #['This', 'is', 'a', 'book.']
     ```

3. 檢查起始或結束字串
   - `startswith` 函式
     `startswith` 函式是檢查字串是否以指定字串開頭,語法為:
     `字串.startswith(起始字串)`

     如果字串是以`「起始字串」`開頭就傳回`True`，否則就傳回`False`，例如:

     ```python
     str1 = "mailto:test@e-happy.com.tw"
     print(str1.startswith("mailto:")) #True,以「mailto:」開頭
     print(str1.startswith("to:")) #False,不是以「to:」開頭
     ```

   - `endswith` 函式
     `endswith` 函式的功能與 `startswith` 函式雷同，只是 `endswith` 函式檢查的是字串是否以指定字串結束，語法為:
     `字串.endswith(結尾字串)`
     如果字串是以`「結尾字串」`結束就傳回 `True`，否則就傳回`False`，例如:

     ```python
     str1 = "mailto:test@e-happy.com.tw"
     print(str1.endswith(".tw")) #True,以「.tw」結尾
     print(str1.startswith(".cn")) #False,不是以「.cn」結尾
     ```

   - 範例: 檢查網址格式 `startswith.py`
     設計程式讓使用者輸入網址，程式會檢查輸入的網址格式是否正確。

4. 字串排版相關函式
   - `ljust` 函式
     `ljust` 函式是將字串擴充為指定長度，原始字串會置於新字串的左方，語法為:
     `字串.ljust(字串長度[,填充字元])`
     - 字串長度: 設定新字串的長度，如果字串長度小於原始字串的長度，則設定的字串長度無效。
     - 填充字串: 設定新字串多出的字元以`「填充字元」`取代，預設值為**空白**字元。`「填充字元」`只能有一個字元，若為兩個字元(含)以上會產生錯誤。

     `ljust` 函式的範例實作:

     ```python
     str1 = "python"
     print(str1.ljust(12)) # python 右方有6個空白字元
     print(str1.ljust(12, "$")) # python$$$$
     print(str1.ljust(4, "$")) #字串長度小於原始字串長度,無效
     print(str1.ljust(12, "$@"))#產生錯誤,因填充字元超過一個
     ```

   - `rjust` 及 `center` 函式
     `rjust`及`center` 函式的語法與 `just` 函式完全相同: 只是`just`函式會將原始字串置於新字串的右方，填充字元加在新字串左方；`center`函式會將原始字串置於新字串的中央，填充字元平均加在新字串的左、右方。

     **rjust 函式的範例實作:**

     ```python
     str1 = "python"
     print(str1.rjust(12))      # python 左方有6個空白字元
     print(str1.rjust(12, "$")) # $$$$$spython
     print(str1.rjust(4, "$"))  # 字串長度小於原始字串長度,無效
     ```

     **center 函式的範例實作:**

     ```python
     str1 = "python"
     print(str1.center(12, "$")) # $$$python$$
     print(str1.center(12)) #python 左、右方各有3個空白字元
     print(str1.center(4, "$"))#字串長度小於原始字串長度,無效
     ```

   - `lstrip`、`rstrip`及`strip` 函式
     `lstrip` 函式可除字串左方的空白字元，語法為:
     `字串.lstrip()`

     `rstrip` 函式可除字串右方的空白字元，`strip` 函式則是同移除字串左、右方的?
字元。注意:在文字之間的空白字元不會移除。

     移除空白字元的範例實作:

     ```python
     str1 = "  I love python. " #I love python.左、右方各有3個空白字元
     print(str1.lstrip()) #I love python. ,I love python.右方有3白字元
     print(str1.rstrip()) # I love python., I love python.左方有 3個字元
     print(str1.strip()) #I love python., I love python.左右方皆無空白字元
     ```

   - 範例: 以字串排版函式列印成績單
     一年三班有三位同學,請設計程式幫老師以riust及jiust函式整齊列印出班成績!

5. 搜尋及取代字串
   - `find` 函式
     `find` 函式是尋找搜尋串在字串的位置，語法為:
     `字串.find(搜尋字串)`
     執行結果是搜尋字串在字串中的位置，注意位置是由`「0」`開始計數。如果搜尋字串
在字串中不存在，會傳回`「-1」`。例如:

     ```python
     str1 = "I love python."
     print(str1.find("o")) #3
     print(str1.find("python")) #7
     print(str1.find("x")) #-1
     ```

   - `replace` 函式
     `replace` 函式是將字串中特定字串替換為另一個字串,語法為:
     `字串.replace`(被取代字串,取代字串[，最大次數])
     「最大次數」為最多取代次數。如果省略「最大次數」，則字串中所有「被取代字串」都會替換為「取代字串」，例如:

     ```python
     str1 = "I love python."
     print(str1.replace("o","&")) #I l&ve pyth&n.
     print(str1.replace("o","&", 1)) #I l&ve python.,只取代1次
     print(str1.replace("python","django")) #I love django.
     ```

     如果將「取代字串」設為空字串`(*)`，其效果就是移除字串中的「被取代字串」，例如:

     ```python
     str1 = "I love python."
     print(str1.replace("o","")) #I lve pythn.,移除所有字母「o」
     ```

   - **範例:轉換日期格式** `replace.py`
     爺爺看不懂以`「-」`為分隔的日期格式，請設計程式將日期`「2017-8-23」`轉換為讓爺爺看得懂的`「西元2017年8月23日」`。

## 亂數模組

`Python` 最為人稱道的優勢就是擁有許多模組`(module)`，使得 `Python` 功能可以無限
擴充。

`Python` 的亂亂數模組功能非常強大，不但可以產生整數或浮點數的亂數，還可以一次取得多個亂數，甚至可以為串列洗牌。

1. `import` 模組
   模組只要使用`「import」`命令就可匯入，`import`命令的語法為:
   `import 模組名稱`
   例如亂數模組的模組名稱為 `random`，匯入亂數模組的程式為:
   `import random`
   通常模組中有許多函式供設計者使用，使用這些函式的語法為:
   `模組名稱.函式名稱`
   例如`random 模組`有`randint`、`random`、`choice`等函式，使用`randint` 函式的程式語法為:

   `random.randint(参数)`

   每次使用模組函式都要輸入模組名稱非常麻煩，有些模組名稱很長，更造成輸入的
   困擾，也增加程式錯誤的機會。`import`命令的第二種語法可改善此種情況，語法為:
   `from 模組名稱 import*`
   以此種語法匯入模組後，使用模組函式就不必輸入模組名稱，直接使用函式即可，例如:

   ```python
   from random import *
   randint(参数)
   ```

   此種方法雖然方便，卻隱藏著極大風險: 每一個模組擁有眾多函式，若兩個模組具有相同名稱的函式，由於未輸入模組名稱，使用函式時可能造成錯誤。為兼顧便利性及安全性，可為模組名稱另取一個簡短的別名，語法為:

   ```python
   import 模組名稱 as 別名
   ```

   這樣一來，使用函式時就用「別名.函式名稱」呼叫，既可避免輸入較長的模組名稱，又可避免不同模組中相同函式名稱問題，例如:

   ```python
   import random as r
   r.randint(参数)
   ```

2. 亂數模組函式整理
   `Python` 中常用的亂數模組函式有(範例中的`「r」`為亂數模組的別名，`str1="abcdefg"， list1=["ab"， "cd", "ef"]`)

   | 函式 | 功能 | 範例 | 範例結果 |
   |------|------|------|-----------|
   | `choice(字串)` | 由字串中隨機取得一個字元 | `r.choice(str1)` | `b` |
   | `randint(n1, n2)` | 由 `n1` 到 `n2` 之間隨機取得一個整數 | `r.randint(1，10)` | `7` |
   | `random()` | 由 `0` 到 `1` 之間隨機取得一個浮點數 | `r.random()` | `0.893398…` |
   | `randrange(n1, n2, n3)`| 由 `n1` 到 `n2` 之間每隔 `n3` 的數隨機取得一個整數 | `r.randrange(0,11,2)` | `8`（偶數） |
   | `sample(字串, n)` | 由字串中隨機取得 `n` 個字元 | `r.sample(str1,3)` | `['c', 'a', 'd']` |
   | `shuffle(串列)` | 為串列洗牌 | `r.shuffle(list1)` | `['ef', 'ab', 'cd']` |
   | `uniform(f1, f2)` | 由 `f1` 到 `f2` 之間隨機取得一個浮點數 | `r.uniform(1,10)` | `6.351865…` |

3. 產生整數或浮點數的亂數函式
   - `randint` 函式
     `randint` 函式的功能是由指定範圍產生一個整數亂數，語法為:
     `亂數模組别名.randint(起始值,终止值)`

     執行後會產生一個在起始值(含)和終止值(含)之間的整數亂數,注意產生的亂數可能是起始值或終止值，例如:

     ```python
     import random as r
     for i in range(0,5):#執行5次,產生5個整數亂數
         print(r.randint(1,10), end=",") #9,8,1,10,4,
     ```

     上例中，`1`與`10`都是可能產生的亂數。

   - `randrange` 函式
     `randrange` 函式的功能與 `randint`雷同,也是產生一個整數亂數，只是其多了一個遞增值,語法為:
     `亂数模組別名.randrange(起始值,終止值[,遞增值])`
     執行後會產生一個在起始值(含)和終止值(不含)之間，且每次增加遞增值的整數亂數，遞增值非必填,預設值為1。特別注意產生的亂數可能是起始值，但不包含終止值，例如:

     ```python
     import random as r
     for i in range(0,5):#執行5次,產生5個整數亂數
         print(r.randrange(0,12,2),end=",") # 8,0,10,6,6,
     ```

     由於從`0`開始，每次遞增`2`，且不包含`12`(終止值)，所以產生的亂數是「0、2、4、6、8、10」六個數其中之一。

   - `random` 函式
     `random` 函式的功能是產生一個0到1之間的浮點數亂數,語法為:
     `亂数模組別名.random()`
     例如:

     ```python
     import random as r
     print(r.random()) #0.5236730771512399
     ```

   - `uniform` 函式
     `uniform` 函式的功能是產生一個指定範圍的浮點數亂數，語法為:
     `亂數模組别名.uniform(起始值,终止值)`

     執行後會產生一個在起始值和終止值之間的浮點數亂數,例如:

     ```python
     import random as r
     print(r.uniform(3,10)) #6.063374013178429
     ```

   - **範例:擲骰子遊戲** `randint.py`
     阿寶想玩擲骰子遊戲,但手邊沒有骰子,設計程式讓阿寶按任意鍵再按`Enter` 鍵擲骰子,會顯示`1`到`6`之間的整數亂數代表骰子點數,直接按`Enter`鍵會結束遊戲。

4. 隨機取得字元或串列元素
   - `choice` 函式
     `choice` 函式的功能是隨機取得一個字元或串列元素,語法為:
     `亂数模组别名.choice(字串或串列)`

     如果參數是字串，就隨機由字串中取得一個字元，例如:

     ```python
     import random as r
     for i in range(0,5): #執行5次,產生5個字元亂數
         print(r.choice("abcdefg"), end=",") #f,a,g,g,d,
     ```

     如果參數是串列，就隨機由串列中取得一個元素，例如:

     ```python
     import random as r
     for i in range(0,5):#執行5次,產生5個整數亂數
         print(r.choice([1,2,3,4,5,6,7]),end=",") #1,1,2,7,6,
     ```

   - `sample` 函式
     `sample` 函式的功能與`choice` 雷同，只是 `sample` 函式可以隨機取得多個字元或串列元素，語法為:
     `亂數模組別名.sample(字串或串列,數量)`

     如果參數是字串,就隨機由字串中取得指定數量的字元;如果參數是串列,就隨機由串列中取得指定數量的元素，例如:

     ```python
     import random as r
     print(r.sample("abcdefg",3)) # ['f', 'b', 'g']
     print(r.sample([1,2,3,4,5,6,7],3)) # [3, 1,4]
     ```

     需注意「數量」參數的值不能大於字串長度或串列元素個數，也不能是負數，否則執行時會產生錯誤，例如:

     ```python
     import random as r
     print(r.sample([1,2,3,4,5,6,7],8)) #錯誤,數量大於串列元素個數
     ```

     `sample` 函式最重要的用途是可以由串列中取得指定數量且不重複的元素，這使得設計樂透開獎應用程式變得輕鬆愉快。

  - **範例:大樂透中獎號碼**
    大樂透中獎號碼為`6`個`1`到`49之`間的數字加1個特別號:撰寫程式取得大樂透中獎號碼，並由小到大顯示方便對獎。

## 時間模組

應用程式常需使用時間相關的訊息,例如取得目前系統時間、計算兩個事件經過的
時間等。

1. 時間模組函式整理
   `time` 是 `Python` 中較常使用的時間功能模組,要使用需先匯入時間模組，程式為:

   `import time`

   `Python` 中常用的時間模組函式有:

   | 函式 | 功能 |
   |------|------|
   |`ctime([時間數值])`| 以傳入的時間數值來取得時間字串。 |
   |`localtime([時間數值])`| 以傳入的時間數值來取得時間元組資`訊。 |
   |`sleep(n)`| 程式暫時停止執行 `n` 秒。 |
   |`time()`| 取得目前時間數值。 |

2. 程式暫停和取得目前間數值
   - `sleep()` 函式
     `sleepl()` 函式可以參數`n`設定程式暫停的時間，參數`n`的單位是秒。設定後`CPU`會暫時停止執行`n`秒，直到設定時間結束再繼續執行。語法為:
     `time.sleep()`
     例如:暫時停止執行1秒鐘。

     ```python
     import time
     print(time.sleep(1)) # 暫停1秒鐘
     ```

   - `time()` 函式
     `Python` 的時間是以`tick`為單位，長度為百萬分之一秒(微秒)。計時是從 `1970`年`1`月`1`日零時開始的秒數，此數值即為「時間數值」，是一個精確到小數點六位數的浮點數，`time()`函式可取得此時間數值，語法為:
     `time.time( )`

     例如:

     ```python
     import time
     print(time.time()) #1503869642.5474029
     ```

     表示從`1970`年`1`月`1`日零時到現在經過了`150386969642.5474029`秒。

   - **範例:計算執行時間** ``
     許多的資訊競賽會使用演算法，除了比程式執行的正確性，也會比程式執行的時間，下列程式會執行迴圈`100`次，並在每次迴圈中暫停`0.001`秒，模擬程式執行總共花費的時間。

3. 取得時區的日期及時間資訊
   - `localtime()` 函式
     其實取得「時間數值」對使用者沒有太大意義，因為使用者從時間數值自行計算來得到日期及時間的過程非常複雜。
     `localtime` 函式可以得使用者時區的日期及時間資訊，語法為:
     `time.localtime([時間數值])`

     `「時間數值」`參數非必填，若省略`「時間數值」`參數則是取得目前日期及時間，返回值是以元組資料型態傳回，例如:

     ```python
     import time
     print(time.localtime())
     #time.struct time(tm year-2021, tm mon-3, tm mday=17, tm hour=11,
     tm_min=26, tm sec-25, tm_wday=2, tm_yday=76, tm_isdst=0)
     print(time.localtime(time.time()))#傳入時間數值參數,結果與與前一程式列相同
     ```

   - `localtime` 函式傳回的元組資料，其意義為:

     | 序號 | 名稱 | 意義 |
     |------|------|------|
     | 0 | `tm_year` | 西元年 |
     | 1 | `tm_mon` | 月份 (1 到 12) |
     | 2 | `tm_mday` | 日數 (1 到 31) |
     | 3 | `tm_hour` | 小時 (0 到 23) |
     | 4 | `tm_min` | 分鐘 (0 到 59) |
     | 5 | `tm_sec` | 秒數 (0 到 60，可能是閏秒) |
     | 6 | `tm_wday` | 星期幾 (0 到 6，星期一為 0，……，星期日為 6) |
     | 7 | `tm_yday` | 一年中的第幾天 (1 到 366，可能是閏年) |
     | 8 | `tm_isdst` | 時光節約時間 (1 為有時光節約時間，0 為無時光節約時間) |

     取得單一項目值的方式有兩種:一種為「物件.名稱」,另一種為「元組「索引」,
     例如取得西元年的值:

     ```python
     import time
     time1 = time.localtime(time.time())
     print(time1.tm_year) #使用「物件.名稱」
     print(time1[0]) #使用「元組[索引]」
     ```

   - `ctime()` 函式
     `ctime` 函式的功能及用法皆與 `localtime` 函式相同，不同處在於 `ctime` 函式的傳回值為字串。`ctime` 函式的語法為:

     ```python
     time.ctime([時間數值])
     ```

     `ctime` 函式的傳回值格式為:

     ```python
     星期幾月份日數小時:分鐘:秒數西元年
     ```

     當然，文字部分是以英文呈現，例如:

     ```python
     import time as t
     print(t.ctime()) #Wed Mar 17 11:37:19 2021
     print(t.ctime(t.time())) #Wed Mar 17 11:37:19 2021
     ```

   - **範例:**

    大賽看板上需顯示以中華民國年份表示的現在時刻,給比賽選手做為參考。請設計程式以時間模組列印以中華民國年份表示的現在時刻及節約時間資訊。




