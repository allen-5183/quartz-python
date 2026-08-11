
---
title: python 例外處理
draft: false
description:
date: 2026-07-14
tags: python

---

# `python` 例外處理

## 例外处理

`Python` 直譯器(`interpreter`) 當執行程式發生錯誤時會引發例外(`exception`) 並中斷程式執行，例如:變數不存在、資料型別不符等。甚至有些錯誤並不全然是程式的邏輯錯誤，例如程式中打算開啟檔案，但檔名並不存在，這種情況下，我們需要的是引發例外後的處理動作，而非中止程式的執行。

例如: 下列以 `div()` 目訂函式求兩數相除的連算中，第 `4` 和第 `6` 列語法是正確的，原本應該是可以正常執行的，但因為第 `5` 列的 `「3/0」` 的運算中，除數為 `0`，執行時會產生 `「ZeroDivisionError division by zero」` 的錯誤，使得程式中斷，以致第 `6` 列程式碼未被正確的執行。

`diy.py`

```python
def div(a,b):
    return a/b

print(div(6,2))  # 3.0
print(div(3,0))  # 中止程式
print(div(4,2))  # 未被執行
```

### 1. `try...except...else...finally` 語法

`try...except...finally` 的語法構如下:

```python
try:
    可能引發例外的程式區塊
except 例外情形-[as 參數]:
    處理例外的程式區塊一
except 例外情形二[as 參數]:
    處理例外的程式區塊二
except Exception[as 參數]:
    處理所有其他可能發生的例外
except:
    處理所有其他可能發生的例外,包括了所有的系統例外
else:
    try 指令正確時執行的程式區塊
finally:
    一定會執行的程式區塊
```

1. 在 `try...except` 中**最少必須有一個 `except` 敘述**，將可能引發錯誤的程式碼寫在 `try` 叙述中，當有錯發生時，就會引發例外執行 `except` 程式區塊。`finally` 則是選擇性的，若加入 `finally` 關鍵字，則無論例外有沒有發生都會執行 `finally` 後的程式區塊。
2. `try...except` 取得 **例外必須由小範圍而後大範圍**，如果有想要特別捕捉的例外訊息就先寫在前方的 `except` 中。
3. `except Exception [as 參數]` 中，`Exception` 是 `BaseException(父類別)` 的**子類別**，可以捕捉除了**系統例外以外的所有例外**，利用 **參數** 可以**傳遞錯誤的資訊**。
4. 如果有捕捉多個 `except` 例外，必須將 `except` 放在最後，表示前方沒有列出的例外都在這裡進行相關的處理。 `except` 後若不接上任何例外型態，則表示捕捉所有例外，也包括了所有的系統例外。
5. `else` 設定當 `try` 內指令正確時(**沒發生錯誤**)就執行 `else` 內的程式區塊。
6. `finally` 是在 `try...except` 完成後一定會執行的動作，一般都是使用在**刪除物件**或**關閉檔案**等。
7. 透過「參數」可以取得錯誤資訊，例如: `print(參數)` 顯示錯誤資訊，方便追蹤發生錯誤的原因。

### 2. `try...except...else...finally` 使用方式

1. `try⋯except`
   最簡單的方式是只有 `try...except`，因為 `except` 可以捕捉所有例外，也包括了所有的系統例外。

   例如: 在 `try` 叙述中顯示 `n`，但因為變數 `n` 並不存在，執行時將會引發例外，執行 `except` 中的程式區塊，因此會顯示 `「變數n不存在!」` 訊息。

   `nano `

   ```python
   try:
       print(n)
   except:
       print("變數 n 不存在!")
   ```

   **結果:**

   ```yaml
   變數 n 不存在!
   ```

2. `try...except...else`
   若加入 `else` 的參數，當 `try` 内指令正確時(**沒發生錯誤**)就可以執行 `else` 內的程式區塊。

   `nano try2.py`

   ```pyton
   n=2
   try:
       n+=1
   except:
       print("變數 n 不存在!")
   else:
       print("n=",n) # n=3
   ```

   **結果:**

   ```yaml
   n= 3
   ```

3. `try...except Exception as e`
   以 `except Exception` 可以捕捉**除了系統之外的所有例外狀況**，若加入 `except` 的參數 `e` 就可以觀察錯誤訊息。

   例如: 以 `as` 加入參數 `e` 後，可看到產生 `name 'n' is not defined` 的錯誤訊息。

   ```try3.py
    try:
        print(n)
    except Exception as e:
        print(e)  # name 'n' is not defined
   ```

   **結果:**

   ```yaml
   name 'n' is not defined
   ```

4. `try...except...finally`
   若加入另一個關鍵字 `finally`， **無論例外有沒有發生** 都會執行`finally` 後的程式區塊。

   例如: 下列程式會引發例外，同時也會執行 `finally` 中的程式區塊。

   `nano try4.py`

   ```python
   try:
       print(n)
   except:
       print("變數 n 不存在!")
   finally:
       print("一定會執行的程式區塊")
   ```

   **結果:**

   ```yaml
   變數 n 不存在!
   一定會執行的程式區塊
   ```

5. **練習:** 輸入兩個正整數求和，捕捉輸入的錯誤
   輸入兩個正整數，求兩數之和，若輸入非數值資料，以 `try...except` 捕捉發生的錯誤。

   ![exception](https://pic.allen5183.synology.me/python_exception_1.png#w40)

   **解答:** `tryadd.py`

## `try...except` 常用例外錯誤表

有時候對於例外捕捉希望更精準些，例如: 以 `2%b` 求兩數的餘數時，會因為除數 `b` 為非整數發生 `輸入非數值的錯誤!`，輸入 `2%` 則會因為除數為 `0` 發生 `分母為0的錯誤!`。 此時只要在`except` 後面明確他指定錯誤型別即可。 以下是常用例外錯誤表:

**例外錯誤表:**

錯誤名稱|說明
--|--
`AttributeError`|物件無此屬性。
`Exception`|所有的錯誤。
`FileNotFoundError`|`open()` 開啟檔案時找不檔案的錯誤。
`IOError`|輸入 / 輸出錯誤。
`IndexEror`|索引超出範圍。
`MemoryError`|記憶體空間不足。
`NameError`|變數名稱未宣告的錯誤。
`SyntaxError`|語法錯誤。
`TypeError`|資料型別的錯誤。
`ValueError`|傳入無效的參數，產生數值錯誤。
`ZeroDivisionError`|除數為 `0` 的錯誤。

例如: 想要以 `ValueError` 捕捉 **輸入非數值的錯誤!**、以`ZeroDivisionError` 捕捉 **分母為 `0` 的錯誤!**。

```python
except ValueError:
    print("輸入非數值的錯誤!")
except ZeroDivisionError:
    print("分母為 0 的錯誤!")
```

**練習:** `捕捉非數值資料和除數為 0 的錯誤`

輸入兩個正整數，求兩數之餘數時，並以 `try⋯except` 捕捉發生的例外，包括輸入非數值資料和除數為 `0` 的例外。

![](https://pic.allen5183.synology.me/python_exception_2.png#w40) &nbsp; ![](https://pic.allen5183.synology.me/python_exception_3.png#w40)

![](https://pic.allen5183.synology.me/python_exception_4.png#w40)

**正解:** `trymod.py`

## 捕捉多個例外

`Python` 也允許以一個 `except` 同時捕捉多個例外。

### 1. 使用一個 `except` 捕捉多個例外

以一個 `except` 捕捉多個例外的語法如下:

```python
try:
    可能引發例外的程式區塊
except(例外一，例外二，⋯)[as e]:
    處理例外的程式區塊
```

>參數 `e` 可有可無，利用參數可以傳遞錯誤的資訊。

**練習**: 同時捕捉非數值資料和除數為的錯誤

輸入兩個正整數，求兩數之餘數時，並以 `try...except` 同時捕捉輸入非數值資料和除數為 `0` 的錯誤。

![](https://pic.allen5183.synology.me/python_exception_5.png#w40) &nbsp; ![](https://pic.allen5183.synology.me/python_exception_6.png#w40)

![](https://pic.allen5183.synology.me/python_exception_7.png#w40)

**正解:** `trymod2.py`

### 2. 顯示多個內建的錯誤訊息

透過 `「參數」` 可以取得多個內建的錯誤資訊。

**範例:** 同時顯示非數值資料和除數為 `0` 內建的錯誤訊息輸入兩個正整數，求兩數之餘數時，並以 `try...except...as e` 同時捉輸入非輸入非數資料和除數為 `0` 內建的錯誤訊息。

![](https://pic.allen5183.synology.me/python_exception_8.png#w40) &nbsp; ![](https://pic.allen5183.synology.me/python_exception_9.png#w40)

**正解:** `trymod3.py`

## `raise` 拋出例外

可以在指定的條件下，主動拋出例外。

### 1. 抛出系統内建的例外

可以使用 `raise` 語句拋出例外，語法如下:

```python
raise[例外類型[(e)]]
```

- 例外類型，可以是系統內建的例外類型(例如: `Exception`)，也可以是自己定義的例外類型。
- `e` 是自己提供的參數，可以傳遞例外的資訊。

直接用例子來說明:

**範例:** 主動拋出速度過快或太慢例外

高速公路設定速限為 `70~110`，如果速度過快或太慢，就主動拋出例外，提醒用路人注意安全。

![](https://pic.allen5183.synology.me/python_exception_10.png#w40)

**正解:** `raise1.py`

### 2. 抛出自訂的例外

也可以拋出自訂的例外，但必須自行定義例外的類別，且定義的類別必須繼承 `RuntimeError` 類別。

例如: 建立 `MyException` 繼承 `RuntimeError` 類別，並建立建構式接收參數參數 `arg`。

```python
class MyException(RuntimeError):
    def __init__(self, arg):
        self.args = arg
```

**範例:** 主動拋出速度過快，太慢和自訂例外

同上例，如果速度過快或太慢，就主動拋出例外；如果速度正常，就以自訂例外，拋出「快樂駕駛，平安返家!」訊息，給駕駛按個讚。

![](https://pic.allen5183.synology.me/python_exception_10.png#w40)

**正解:** `raise2.py`

## `Traceback` 記錄字串

利用 `traceback` 模組的 `format_exc()` 方法，可以將例外引發資訊的過程記錄在檔案中，以利追縱錯誤引發的過程。

**範例:** 記錄例外引發的資訊

高速公路設定速限為 `70〜110`，如果速度過快或太慢，就將主動拋出例外資訊的過程記録在 `err.txt` 檔案中。

![](https://pic.allen5183.synology.me/python_exception_11.png#w40)

**正解:** `Traceback.py`

## `assert` 斷言

`assert` 主要用途是在程式開發階段，協助程式設計師檢查程式是否有指定的錯誤。

### 1. `assert` 程式斷言

`assert` 程式斷言
`assert` 的語法:

```python
assert 條件式，參數
```

程式執行時會檢查條件式，如果條件式為 `True`，程式會繼續往下執行；如果條件式為 `False` (斷言失敗)，程式終止並抛出 `AssertionError` 的例外。

先看看下列程式， `Car` 類別以建構式設定初速，也 `Turbo()` 方法增加速度 `n`。

```python {.line-numbers}
class Car ( ) :
    def __init__(self, speed):
        self.speed = speed

    def Turbo(self,n): # 増加速度 n
#         assert speed >= 0, '速度不可能為負 !'
        self.speed += n

for speed in (60,-20):
    bus=Car(speed)
    print("初速=",bus.speed,end="")
    bus.Turbo(50)
    print("加速後,速度=",bus.speed)
```

**執行結果如下:**
![](https://pic.allen5183.synology.me/python_exception_12.png#w40)

初速 `60` 加速 `50` 後得到速度 `110`，同理初速 `-20` 加速 `50` 後得到速度 `30`，但程式設計知道，速度 `<0` 顯然不合理 `(-20)`。

利用第 `6` 列的 `assert` 斷言就可以找出問題。

**範例:** `assert` 斷言速度不可為為負


建立 `Car` 類別並以建構式設定初速，`Turbo()` 以增加速度度 `n`，若初速，以 `assert` 斷此速度不可為為負的例外。

![](https://pic.allen5183.synology.me/python_exception_13.png#w40)

**正解:** `Assert.py`

### 2. 停用斷言

程式中如果到處充斥著 `assert`，其實和用 `print` 印出錯誤問題相比也好不到哪去。 可以在啟動 `Python` 直譯器時可以用 `-O` 引數來關閉 `assert`。

**語法:**

```python
python -O 程式檔.py
```

本例來說,請開啟命令視窗,切換到該目錄。輸入:

`python -O Assert.py`

![](https://pic.allen5183.synology.me/python_exception_14.png#w40)




