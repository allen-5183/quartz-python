
---
title: python 模組與套件
draft: false
description:
date: 2026-07-14
tags: python

---

## `Python` 模組與套件

## 模組與套件

### 模組

1. 可以使用 `from … import …` 從模組匯入特定的類別或函式，其語法如下：

   ```python
   form modulename import classname/functionname
   ```

   **範例:**


### 套件




## 建立 Python 專案

使用`Spyder`除了建立檔案，也可以建立專案，然後在專案中再建立目錄和檔案，以實例來說明。

1. 建立新的專案
   - 建立專案
     點選功能表 `Projects` \ `New Project`...，`Project name` 輸入專案名稱，`Location` 設
定儲存目錄，然後按 `Create` 鈕即可以建立專案。例如:輸入`「projectHello」`建立 `projectHello` 專案。
     ![spyder_project](https://pic.allen5183.synology.me/spyder_project1.png#w60)
     ![spyder_project](https://pic.allen5183.synology.me/spyder_project2.png#w60)

   - 建立目錄
     接著在 `projectHello` 專案建立一個 `mypackage` 目錄。請在 `spyder` 右上方的檔案總管視窗上按右鍵，在右鍵功能表中選 `New` \ `Folder`...，
     `Folder name` 欄位輸入目錄名稱。例如:輸入 `「mypackage」`，完成後就會在左邊的專案中看到建立的目錄。
     ![spyder](https://pic.allen5183.synology.me/spyder_project3.png#w60)

   - 建立模組的 `__init__` 檔
     每個模組裡都必須在模組所在的目錄中建立一個 `__init__py` 檔案，它的目的是告訴 `Python` 將這個**目錄**當做**模組**來對待。`__init__.py` 可以是空的，也可以放一些變數或程式。請在要建立檔案的目錄按右鍵，選擇 `New` \ `File`..，選擇儲存的路徑(本例為
`projectHello\mypackage`)，然然後輸入檔案名稱 `__init__.py` 再按存檔 `(S)` 鈕。完成後就會在 `mypackage` 目錄中看到建立的檔案。
     ![spyder](https://pic.allen5183.synology.me/spyder_project4.png#w60)
     ![spyder](https://pic.allen5183.synology.me/spyder_project5.png#w60)
     ![spyder](https://pic.allen5183.synology.me/spyder_project6.png#w60)

   - 建立檔案
     在`mypackage` 目錄建立 `Hello.py`，在 `projectHello` 目錄建立 `index.py`。
     ![spyder](https://pic.allen5183.synology.me/spyder_project7.png#w60)
     ![spyder](https://pic.allen5183.synology.me/spyder_project8.png#w60)

   - 建立模組
     `Hello.py` 定義 `SayHello`自訂函式顯示`「Hello」訊息`。

     ```python
     # Hello.py
     def sayHello():
         print("Hello")
     ```

   - 使用模組
     `SayHello` 自訂函式是在 `mypackage` 目錄的`Hello.py` 中，必須以 `from mypackage.Hello import sayHello` 匯入該模組。

     `nano index.py`

     ```python
     from mypackage.Hello import sayHello
     sayHello()
     ```

     ![spyder](https://pic.allen5183.synology.me/spyder_project9.png#w60)

2. 建立含有**類別**專案
   也可以將類別加入到專案中，以前面範例「計算面積」為例，我們將它建立成為 `projectArea` 專案。參考前面的操作，建立 `projectArea專案`，並建立 `areapackage` 目錄，在 `areapackage` 目錄建立 `__init__.py`、`myClass.py`檔，同時在 `projectArea` 目錄建立 `index.py`檔。

   完成後檔案架構如下圖:
   ![spyder](https://pic.allen5183.synology.me/spyder_project10.png#w60)

   然後加入 `myClass.py` 和 `index.py` 檔的程式碼。

   `nano myClass.py`

   ```python
   class Rectangle(): #定義父類別
        def __init__(self, width,height):
            self.width = width  # 定義共用屬性
            self.height= height # 定義共用屬性
        def area(self):         #定義共用方法
            return self.width * self.height

   class Triangle(Rectangle): # 定義子额別
        def area2(self): #定義子類別的共用方法
            return (self.width * self.height)/2
   ```

   `nano index.py`

   ```python{.line-numbers}
   from areapackage.myClass import Triangle

   triangle = Triangle(5,6)#建立 triangle 物件
   print("矩形面積=",triangle.area()) #30
   print("三角形面積=",triangle.area2()) #15.0
   ```

   **程式說明**
   ⬜ 1-3 必須匯入 `Triangle` 類別才能建立 `Triangle` 類別物件。
   ⬜ 4-5 計算矩形面積、三角形面積。

## 打造自己的模組

一個較大型專案，程式是由許多類別或函式組成，為了程式的分工和維護，可以適度地將程式分割成許多的模組，再匯入並呼叫這些模組。

1. 准備工作
   下列程式包含計算兩數相加、兩數相減的兩個函式，可以直接呼叫 `add`、`sub` 函式執行兩數相加、相減的運算。

   `nano module-1.py`

   ```python {.line-numbers}
   def add(n1,n2):
       return n1+n2

   def sub(n1,n2):
       return n1-n2

   print(add(5,2)) # 7
   print(sub(5,2))  # 3
   ```

   >有時為了程式的分工和維護，我們會將程式分割成模組。

2. 打造自己的模組
   首先我們將 `add`、`sub` 兩個個函式建立成一個獨立的模組，模組名稱為 `calculate.py` 。

   ```python
   def add(n1,n2):
       return n1+n2

   def sub(n1,n2):
       return n1-n2
   ```

3. 匯入自己建立的模組
   可以使用下列不同的 `import` 方法匯入並呼叫模組內的函式。
   - `import 模組名稱`
     以 `import` 匯入自己建立的模組後，即可以呼叫使用這些模組內的函式。
     匯入自己建立的模組語法:

     ```python
     import 模組名稱
     ```

     例如: 匯入 `calculate` 模組。

     ```python
     import calculate
     ```

     這種方式呼叫函式時，必須加上模組名稱，語法:

     ```python
     模組名稱.函式名稱
     ```

     範例: 匯入 `calculate.py` 模組並呼叫模組内的 `add`、`sub` 函式。

     `nano modelu-2.py`

     ```python
     import calculate

     print(calculate.add(5,2))
     print(calculate.sub(5,2))
     ```

   - `匯入模組內函式`
     每次使用模組內的函式都要輸入模組名稱非常麻煩，下列`import` 的方法可改善此種情況，語法為:

     ```python
     from 模组名稱 import 函式名稱1[,函式名稱2,...,函式名稱 n]
     ```

     這種方式呼叫函式時，可以省略模組名稱，直接以函式名稱呼叫。

     **範例: 匯入 `calculate.py` 模組内的 `add`、`sub` 函式，並呼叫模組内 `add`、`sub` 函式。

     `nano module-3.py`

     ```python{.line-numbers}
     from calculate import add,sub

     print(add(5,2)) # 7
     print(sub(5,2)) # 3
     ```

     第 `1` 列以 `from calculate import add, sub` 同時匯入 `add`、`sub` 函式，第 `3~4` 列執行時就可以直接以 `add`、`sub` 呼叫函式。

     但請注意: 下列程式第`1`列並未 `import sub` 函式，因此第`4`列呼叫`sub`函式時，將會出現 `
     「NameError:name 'sub' is not defined」`
      的錯誤。

     `nano module-4.py`

     ```python
     from calculate import add

     print(add(5,2)) # 7
     print(sub(5,2)) # NameError: name 'sub' is not defined
     ```

   - 匯入模組內所有函式
     如果要匯入模組內所有函式，語法如下:

     ```python
     from 模組名稱 import *
     ```

     範例: 以 `import *` 匯入 `calculate.py` 模組内的所有函式。

     `nano module-5.py`

     ```python{.line-numbers}
     from calculate import *

     print(add(5,2)) # 7
     print(sub(5,2)) # 3
     ```

     這種方法雖然方便，卻隱藏著極大風險:因為每一個模組擁有眾多函式，若兩個模組具有相同名稱的函式，由於未輸入模組名稱，使用函式時將會造成錯誤。

   - 使用 `as` 指定函式別名
     如果不同模組中的函式名稱相同，或是函式名稱大長，也可自行指定別名。語法為:

     ```python
     from 模组名稱 import 函式名稱 as 函式別名
     ```

     這樣一來，使用函式時就可用**「函式別名」**呼叫。例如:以別名 `a` 替代 `add` 函式。

     `nano module-6.py`

     ```python
     from calculate import add as a

     print(a(5,2))  # 7
     ```

   - 使用 `as` 指定模組別名
     如果模組的名稱太長，也可以將模組另取一個簡短的別名。語法為:

     ```python{.line-numbers}
     import 模組名稱 as 別名
     ```

     這樣一來，使用函式時使用「別名，函式名稱」呼叫，就可避免輸入較長的模組名稱。
     例如: 以別名 `cal` 替代 `calculate` 模組。

     `nano module-7.py`

     ```python{.line-numbers}
     import calculate as calculate 模組·並取別名為 cal

     print(cal.add(5,2)) #7
     print(cal.sub(5,2)) #3
     ```

4. 將自建的專案存成多個模組
   前面的 `projectArea` 專案，其實已經將 `Rectangle`、`Triangle` 等類別存在 `areapackage` 目錄的 `myClass.py` 模組組檔案中，主程式 `index.py` 要建立
`Rectangle`、`Triangle` 等類別物件就必須以 `「from areapackage.myClass import
Rectangle,Triangle」` 匯入該類別。
    當一個模組內包含太多類別時，可以將該模組再拆成更多的模組，如果拆開後不同類別的模組間有繼承關係，則子類別的模組中必須要匯入父類別，否則執行會出現錯誤。
    **範例:模組匯入另一個模組**
    建立 `projectArea2` 專案，並在 `projectArea2` 建立 `areapackage2` 目錄，在
`areapackage2` 目録建立 `__init__.py`、`Rectangle.py`、`Triangle.py` 檔，同時在 `projectArea2` 目錄建立 `index.py` 檔。

    `nano Rectangle.py`

    ```python{.line-numbers}
    class Rectangle(): # 定義父類別
          def __init__(self, width,height):
              self.width = width #定義共用屬性
              self.height=height ## 定義共用屬性
          def area(self): #定義共用方法
              return self.width * self.height
    ```

    **程式說明**
    ⬜ 1-6 建立父類別 `Rectangle` 和 `area` 方法計算矩形面積

    `nano Triangle.py`

    ```python{.line-numbers}
    from areapackage2.Rectangle import Rectangle

    class Triangle(Rectangle):#定義子類別
        def area2(self): #定義子類別的共用方法
            return (self.width * self.height)/2
    ```

    **程式說明**
        ⬜ 1 子類別必須匯入 `Rectangle` 父類別。

    `nano index.py`

    ```python {.line-numbers}
    from areapackage2.Rectangle import Rectangle
    from areapackage2.Triangle import Triangle

    triangle = Triangle(5,6) # 建立 triangle 物件
    print("矩形面積=",triangle.area()) # 30
    print("三角形面積=",triangle.area2()) # 15.0
    ```

    **程式說明**
    ⬜ 1-2 必須匯入 `Rectangle`、`Triangle` 類別才能建立 `Rectangle`、`Triangle` 類別物件，本例中並未建立 `Rectangle` 類別物件，因此第`1`列其實也可以省略。

    >開啟專案
    可以 `Projects` `\` `Open project` 後在對話框中選取專案的路徑，開啟已經建立的專案，或是從 `Projects` `\` `Recent project` 中選取最近開啟的專案。

5. 在別的專案使用自己的模組
   在 `projectArea2`專案中，主程式 `index.py` 檔和 `areapackage2` 目錄建立 `init_py`、`Rectangle.py`、`Triangle.py` 檔都是在同一個專案， 因此執行時不會有問題。
   現在我們獨立建立一個 `CallModule.py`，這個檔案不在 `projectArea2`專案中， 例如: `C:\Python\code`。 執行後當然會產生錯誤，因為它找不到相關模組。

   `nano c:\Python\code\CallModule.py`

   ```python
   from areapackage2.Rectangle import Rectangle
   from areapackage2.Triangle import Triangle

   triangle = Triangle(5,6)#建立 triangle 物件
   print("矩形面積=",triangle.area()) #30
   print("三角形面積=",triangle.area2()) #15.0
   ```

   ![module](https://pic.allen5183.synology.me/module_error.png#w60)

   那不同的專案怎麽使用自建的模組呢?
   以使用 `projectArea2` 專案 `areapackage2` 目錄中的 `Rectangle.py`、`Triangle.py` 模組為例，其實只要將包含模組的這個 `areapackage2` 目錄全部複製到 `Anoconda3` 中的 `Lib` 目錄下即可。

   例如: 如果路徑為 `C:\ProgramData\Anaconda3\Lib`，`Python` 執行時會到 `C:\ProgramData\Anaconda3\Lib` 目錄及它的子目錄搜尋指定的模組。

   由於 `Lib` 目錄放置的是 `Python` 内建的模組，若以`pip install 模組` 安装時模組檔案是放在 `C:\ProgramData\Anaconda3\Lib\isite-packages` 目錄，因此建議將 `areapackage2` 目錄全部複製到`C:\ProgramData\Anaconda3\Lib\site-packages`
   目錄。(注意: 不是複製 `projectArea2` 專案目錄)

   複製完成後重新執行 `CallModule.py`，如下:

