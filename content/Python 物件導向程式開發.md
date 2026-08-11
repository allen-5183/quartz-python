
---
title: python 物件導向程式開發
draft: false
description:
date: 2026-07-14
tags: python

---

# `python` 物件導向程式開發

## 認識物件導向

1. 物件導向的優點是物件可以在不同的應用程式中被重複使用，`Windows` 本身就是一個物件導向的例子。下面是幾個常見的名詞：
   - **物件**(`object`) 或**實體** (`instance`) 就像在生活中所看到的各種物體，在 `Python` 中，物件是資料與程式碼的組合，它可以是整個應用程式或應用程式的一部分。
   - **屬性** (`attribute`) 或**成員變數** (`member variable`) 是用來描述物件的特質。
   - **方法** (`method`) 或**成員函式** (`member function`) 是用來定義物件的動作。
   - **類別** (`class`) 是物件的分類，就像物件的藍圖或樣板，隸屬於相同類別的物件具有相同的屬性與方法，但屬性的值則不一定相同。

   ![](https://pic.allen5183.synology.me/python_object1.png#w30)
   ![](https://pic.allen5183.synology.me/python_object2.png#w30)

2. 物件導向程式設計 (OOP，Object Oriented Programming) 主要有下列幾個特點：
   - **封裝** (`encapsulation`)：物件導向程式設計將資料與用來處理資料的函式放在一起成為一個類別，稱為「封裝」，著重於物件與物件之間的操作。
   - **繼承** (`inheritance`)：繼承指的是從既有的類別定義出新的類別，這個既有的類別叫做父類別 (`parent class`)，而這個新的類別則叫做子類別 (`child class`、`subclass`)。
   - **多型** (`polymorphism`)：多型指的是當不同的物件收到相同的訊息時，會以各自的方法來做處理。
   ![](https://pic.allen5183.synology.me/python_object3.png#w30)

   - `Python` 中的所有資料都是物件 (`object`)，而物件的型別定義於類別 (`class`)，類別就像物件的藍圖或樣板，裡面定義了物件的資料，以及用來操作物件的函式，前者稱為屬性 (`attribute`)，後者稱為方法 (`method`)。
   - 物件是類別的**實體** (`instance`)，我們可以根據相同的類別建立多個物件，這個建立物件的動作稱為實體化 (`instantiation`)。
   - `Python` 中的物件都有**編號** (`id`)、**型別** (`type`) 與**值** (`value`)，可以透過下列函式取得這些資訊：
     - `id(x)`
     - `type(x)`
     - `print(x)`

## 類別與物件

較完整的應用程式通常由許多類別組成，`Python` 其實是一種物件導向(`Object Oriented Programming`) 程式語言,可以建立類別後再根據類別建立物件。

1. 建立類別
   - 建立類別
     以 `class` 可以建立類別，類別名稱的第一個字元建議使用大寫字元。語法:

     ```python
     class 類別名稱():
     ```

     例如: 建立類別 `Animal`，其中 `「()」`也可以省略，寫成 `「class Animal:」`

     ```python
     class Animal():
     ```
   - 類別的**屬性**和**方法**
     類別中通常會建立屬性 `(attribute)` 和方法 `(method)`，提供物件使用，類別中的屬性其實就是一般的變數，而方法則是函式，但在類別中不以變數和函式稱呼，而是稱為屬性和方法。定義的方法中第一個參數必須是 `self`，第二個以後的參數則可依實際需要增加或省略。

     例如: 建立類別`Animal`，並在類別建立`name` 屬性和`sing`方法。

     **`nano class01.py`**

     ```python {.line-numbers}
     # 定義類別
     class Animal(): #定義類別
         name="小鳥" #定義屬性，向右縮排至少一個空白，同時縮排要對齊
         def sing(self):#定義方法
             print("很會唱歌!")

     # 建立物件, Animal([parameters]) 代表一個物件，令變數 bird 參照一個 Animal 物件
     bird=Animal() # 建立一個名叫 bird 的 Animal 物件
     print(bird.name) # 小鳥
     bird.sing() # 很會唱歌!
     ```

     以類別名稱即可建立物件 `(object)`。語法:

     ```python
     物件=類別()
     ```

     然後以物件執行其屬性和方法。

     ```python
     物件.屬性
     物件.方法()
     ```

     例如: 依據類別`Animal`建立物件`bird`，取得`name` 屬性和執行`sing`方法。

2. 類別的建構式
   建立類別時必須對類別初始化，因此必須建立一個特殊的方法: `__init__`，這個初始化的方法稱為**建構式**，建立建構式的語法:
   `def __init__(self[,參數1,參數2,...]):`

   建構式必須使用 `__init__()`函式，參數 `self` 是必須的，同時需要放在最前面，代表建立的物件，其餘的參數是可選擇性的。如此在類別中就可以 `self.屬性`、`self.方法` 執行類別的屬性和方法。

   例如:建立`Animal`類別，並建立 `__init__()` 建構式和`sing` 方法。

   **`nano class02.py`**

   ```python{.line-numbers}
   class Animal(): # 定義類別
       def __init__(self, name):
           self.name=name # 定義屬性
       def sing(self): # 定義方法
           print(self.name+",很會唱歌!")

   bird=Animal("鹦鹉") # 以 Animal 類別,建立一個名叫鹦鹉的bird物件
   print(bird.name) # 鹦鹉
   bird.sing() # 鹦鵡,很會唱歌!
   ```

   **程式說明**
   - `4`  `def sing(self)` 方法中因為只有一個參數`self`，因此第 `9` 列 `bird.sing()` 呼叫時不必傳入任何參數
   - `7`  建立 `Animal` 物件時必須傳入一個參數給第 `2`列`__init__()`中的參數 `name`，在類別中就可以 `self.name` 存取`name` 屬性。

   >`__int__()`建構式既然這麼重要，那為什麼 `class01.py` 中並沒有這個建構式呢?
   那是因為系統預設已隱含建立了一個 `__init__(seff)` 的建構式，因為這個預設的建構式只有 `self` 參數，以 `bird=Animal()` 建立物件時就不可以傳入參數。

3. 屬性初始值的設定

   `class01.py` 第 `3` 列 `「name="小鳥"」` 可以設定`name` 的初始值，但無法在建立物件時就直接初始化，如果將初始化的動作放在 `__init()__` 建構式中，這樣我們就可以在建立物件時，透過參數設定其初始值。
   例如: 建立物件 `bird`，預設屬性 `name="鸚鵡"`、`age=1`。

   **`nano class03.py`**

   ```python {.line-numbers}
   class Animal(): # 定義類別
       def __init__(self, name,age):
           self.name = name # 定義屬性
           self.age = age
       def sing(self): # 定義方法
           print(self.name + str(self.age)+"歲,很會唱歌!")
       def grow(self,year): # 定義方法
           self.age += year

   bird =Animal("鹦鹉",1) # 以 Animal 類別·建立一個名叫鹦鹉、1歲大的 bird物件
   bird.grow(1) # 長大1歲
   bird.sing() # 鹦鹉2歲,很會唱歌!
   ```

4. **匿名物件**
   通常會先建立物件，然後將物件指派給變數，再透過這個變數存取物件，但其實 `Python` 允許我們在沒有將物件指派給變數的情況下存取物件，稱為 **匿名物件** (`anonymous object`)，例如：

   ```python
   class Animal():      #定義類別
       def __init__(self, name,age):
           self.name = name  #定義屬性
           self.age = age
       def sing(self):       #定義方法
           print(self.name + str(self.age) + "歲，很會唱歌   !")
       def grow(self,year):  #定義方法
           self.age += year

   # bird = Animal("鸚鵡",1) #以 Animal 類別，建立一個名叫鸚鵡、1歲大的 bird 物件
   # bird.grow(1)     #長大1歲
   # bird.sing()      #鸚鵡2歲，很會唱歌!
   (Animal("鸚鵡",1).grow(1))   # 不用 bird
   (Animal("鸚鵡",1).sing())
   ```

   >因為是全新物件 → `grow` 後的結果不會留存 → `sing` 看不到變化

## 類別封裝

在 `class03.py` 程式中，可以 `bird.age` 存取 `age` 屬性，因此就可以設定 `bird.age=-1` 設定 `bird` 年齡為 `-1` 歲，這樣直接從外部設定 `年齢<0` 的方式其實並不合理，因此必須對 `age` 屬性作適度的保護。
類別中可以讓外部引用的屬性稱為共用 `(public)` 屬性、方法稱為共用方法，在 `class03.py` 程式中，年齡 `age` 應該以 `bird.grow()` 方法增加，不可以從外部以 `bird.age` 直接設定。
`Python` 提供私用 `(private)` 屬性和私用方法，這種**私用屬性**和**私用方法**只有**類別內內部**可以使用，類別外部並無法使用，這樣的觀念稱為 `封裝(encapsulation)`。
在屬性和方法前面加上 `__` (兩個 `__` 字元)，就就成為 **私用屬性** 和 **方法**。例如: 類別中建立 `__name`、`__age` 屬性和 `__sing`方法。

- 範例
  **`nano class04.py`**

  ```python {.line-numbers}
      class Animal(): #定義類別
       def __init__(self, name, age):
          self.__name = name # 定義私用屬性
          self.__age = age
      def __sing (self) : #定義私用方法
          print(self.__name + str(self.__age),end= "  歲,很會唱歌,")
      def talk(self): #定義共用方法
          self.__sing() #使用私用方法
          print("也會模仿人類說話!")

  bird=Animal("灰鹦鹉",2) # 以Animal類別,建立一個名叫灰  鸚鵡、2歲大的 bird物件
  bird.talk() # 灰鹦鹉2歲,很會唱歌,也會模仿人類說話!

  bird.__age = -1 # 設定無效
  bird.talk()     # 灰鸚鵡2歲,很會唱歌,也會模仿人類說話!
  #bird.__sing()   # 執行出現錯誤
  ```

  類別外部並無法使用**私用屬性**和**方法**，因此如果在第 `14`列行 `bird.__age =-1` 無效，第`16`列執行`bird.__sing()`將會產生錯誤。

## 類別繼承

類別可以繼承，被繼承的類別稱為父類別 `(parent class)` 或基底類別`(base class)`，繼承的類別稱為子類別 `(child class)`或衍生類別 `(derived class)`，子類別可以繼承父
類別中所有共用屬性和共用方法。在程式設計時，請注意父類別必須放在子類別的前面。

1. 建立子類別
   建立子類別的語法:

   ```python
   class 類別名稱(父類別):
   ```

   例如: 建立類別 `Bird` 繼承 `Animal` 類別，其中 `Animal`是父類別，`Bird` 是子類別。

   ```python
   class Bird(Animal):
   ```

   **子類別**會繼承**父類別**的所有共用屬性和方法，也可以建立屬於自己的屬性和方法。
   ![object](https://pic.allen5183.synology.me/object.png#w50)

   例如: 建立父類別 `Animal`，包含 `name`、`fly` 共用屬性和方法，再建立子類別 `Bird` 繼承 `Animal` 類別，並在`Bird` 類別中建立另一個共用方法 `sing`。

   **`nano class05.py`**
   ```python {.line-numbers}
   class Animal():      #定義父類別
       def __init__(self, name):
           self.name = name  #定義共用屬性
       def fly(self):        #定義共用方法
           print(self.name + "很會飛!")

   class Bird(Animal):      #定義子類別
       def __init__(self, name):
           self.name = "粉紅色" + name  #覆寫父類別的建構式
       def sing(self):       #定義子類別的方法
           print(self.name + "也愛唱歌!")

   pigeon = Animal("小白鴿")#以 Animal 類別，建立一個名叫小白鴿的 pigeon 物件
   pigeon.fly()  #小白鴿很會飛!

   parrot = Bird("小鸚鵡")  #以 Bird 類別，建立一個名叫小鸚鵡的 parrot 物件
   parrot.fly()  #粉紅色小鸚鵡很會飛!
   parrot.sing() #粉紅色小鸚鵡也愛唱歌!
   ```

   **程式說明**
   ⬜ 7 `Bird` 繼承 `Animal` 類別，也繼承了 `name`、`fly`共用屬性和方法。
   ⬜ 9 覆寫父類別的建構式。
   ⬜ 10-11 建立專屬於 `Bird` 子類別的方法 `sing`。
   ⬜ 13 以 `Animal`類別,建立一個名叫小白鴿的 `pigeon` 物件。
   ⬜ 14 執行 `Animal` 父類別的`fly` 方法。
   ⬜ 16 `以Bird`類別,建立一個名叫小鸚鵡的 `parrot` 物件。
   ⬜ 17 執行繼承 `Animal` 父類別的 `fly`方法。
   ⬜ 18 執行 `Bird` 子類別的 `sing` 方法。

2. 子類別和父類別擁有相同的屬性和方法
   有的時侯會碰到子類別和父類別擁有相同的屬性和方法，此時子類別會先尋找子類別中是否有此名稱的屬性和方法，如果有找到就使用子類別的的屬性和方法，否則就使用父類別的的屬性和方法。

   子類別也可用 `super()` 方法執行父類別的方法。
   例如: 建立類別 `Bird` 繼承類別 `Animal`，子類別 `Bird` 再以 `super()` 方法覆寫 `__init__()` 和 `fly()` 方法。

   **`nano class06.py`**

   ```python{.line-numbers}
   class Animal(): #定義父類別
       def __init__(self,name):
           self.name = name # 定義共用屬性
       def fly(self): #定義共用方法
           print(self.name+"很會飛!")

   class Bird(Animal): #定義子類別
       def __init__(self,name,age):
           super().__init__(name) # 執行父類別的__init__()方法
           self.age = age #定義子類別共用屬性
       def fly(self): #定義子類別共用方法
           print(str(self.age)+"歲", end="")
           super().fly() # 執行父類別的 fly方法

   if __name__ == "__main__":
       pigeon = Animal("小白鴿") # 以Animal類別建立一個名叫小白鴿的pigeon物件
       pigeon.fly() # 小白鴿很會飛!
       parrot = Bird("小鸚鵡",2) # 以Bird類別建立一個名叫小鸚鵡、2歲大的parrot物件
       parrot.fly() # 2歲小鸚鵡很會飛!
   ```

   **程式說明**
   ⬜ 8-10 `def__init_(self,name,age)`: 接收兩個參數，其中`age`為年齡，`super().__init_(name)` 執行父類別的`__init__()`方法。
   ⬜ 11-13 `def fly(self):` 以 `super().fly()`執行父類別的 `fly`方法。
   ⬜ 15-16 執行的是 `Animal` 父類別的 `fly`方法。
   ⬜ 18-19 執行的是 `Bird子` 類別的的 `fly`方法。

3. 鏈狀繼承
   ![](https://pic.allen5183.synology.me/python_object_link_inherit.png#w40)

   **`nano class07.py`**

   ```python
   class A:
       x = 1

   class B(A):
       y = 2

   class C(B):
       z = 3

   obj = C()
   print("x屬性的值為", obj.x)
   print("y屬性的值為", obj.y)
   print("z屬性的值為", obj.z)
   ```

4. 多重繼承
   `Python` 支援多重繼承，一個子類別可以繼承多個父類別，語法:

   ```python
   class 子類別名稱(父類別1,父類別2,...,父類別n)
   ```

  如果父類別擁有相同名稱的屬性或方法時，就要注意搜尋的順序，是從子類別開始，接著是同一階層父類別由左至右搜尋。

  ![](https://pic.allen5183.synology.me/python_object_multi_inherit.png#w40)

  **`nano class08.py`**

   ```python
   class Father():         #定義父類別
       def say(self):      #定義共用方法
           print("明天會更好!")

   class Mother():         #定義父類別
       def say(self):      #定義共用方法
           print("包容、尊重!")

   class Child(Father,Mother): #定義子類別
       pass

   child = Child() #建立 child 物件
   child.say()     #明天會更好!
   ```

   **程式說明**
   ⬜ 13 執行的是 `Animal` 類別的 `fly` 方法。
   `child.say()` 會優先尋找 `Child` 的 `say`方法，如果找不到再尋找 `Father` 的 `say` 方法，最後才尋找 `Mother` 的 `say` 方法。 因此本例會執行 `Father` 的 `say` 方法。

## 多型

前面不同類別中擁有相同的方法名稱，這樣的觀念稱為多型`(polymorphism)`，但其實多型不一定要有繼承關係，它的好處是同一個方法名稱卻可以產生不同的功能。

例如: 定義 `Bird` 繼別承`Animal`類別，再定義另一個 `Plane`類別，這`3`類別都擁有`fly`方法,此外也建立了一個`fly`函式。

```python{.line-numbers}
class Animal:  # 定義父類別
    def fly(self):
        print("時速 20公里!")

class Bird(Animal):  # 定義子類別
    def fly(self, speed):  # 覆寫父類別方法
        print("時速 " + str(speed) + "公里!")

class Plane:  # 定義類別
    def fly(self):  # 方法1
        print("時速 1000 公里!")

    def fly_mile(self, speed):
        print("時速 " + str(speed) + "英哩!")

animal = Animal()
animal.fly()  # 時速 20公里!

bird = Bird()
bird.fly(60)  # 時速 60公里!

plane = Plane()
plane.fly()  # 時速 1000 公里!
plane.fly_mile(5)  # 時速 5英哩!
```

**程式說明**
⬜ 16-17 執行的是`Animal` 類別的 `fly` 方法。
⬜ 19-20 執行的是`Bird` 類別的 `fly`方法。
⬜ 22-23 執行的是 `Plane` 類別的`fly`方法。
⬜ 25    執行的是第 `13-14` 列的 `fly` 函式。

**取得父類別的私用屬性**
基於對私用屬性的保護,類別之外並無法取得類別內的私用屬性，包括它的子類別也無法讀取，如果一定非取得不可,就只能以「return 私用屬性」的方式,將私用屬性傳回。 例如: 在子類別中以`super().getEye()`取得父類別的私用屬性`「self.___eye 」` o

```python{.line-numbers}
# getPrivateAttribute.py
class Father():      #定義父類別
    def __init__(self,name):
        self.name = name
        self.__eye="黑色" #定義私用屬性
    def getEye(self):     #定義共用方法傳回私用屬性
        return self.__eye

class Child(Father):      #定義子類別
    def __init__(self,name,eye):
        super().__init__(name)
        self.eye=eye
        self.fatherEye=super().getEye() #取得私用屬性

joe = Child("小華","棕色") #建立子類別物件 joe
print(joe.name+"眼睛是"+joe.eye+"，他的父親則是"+joe.fatherEye)
# 執行結果：小華眼睛是棕色，他的父親則是黑色
```

## 介面 `Interface`

`Python` 本身沒有像 `Java`、`C#` 那種正式的 `interface` 關鍵字
但！ `Python` 仍然可以用好幾種方式達成 **「介面」** 的效果：

**方法：** 使用 `abc` 模組（最正式、最接近 interface）

`Python` 的

```python
from abc import ABC, abstractmethod
```

可以創建「抽象類別」(`abstract class`)，等同於介面。
**範例：**
- 定義介面
  ```python
  from abc import ABC, abstractmethod
  class Animal(ABC):  # 介面（抽象類別）
      @abstractmethod
      def sound(self):
          pass
  ```
- 實作介面
  ```python
  class Dog(Animal):
      def sound(self):
          return "汪汪"
  class Cat(Animal):
      def sound(self):
          return "喵喵"
  ```
 - 使用
   ```python
   d = Dog()
   print(d.sound())
   ```
## 類別應用

**範例: 計算面積**

定義`Rectangle`、`Triangle` 兩個類別，父類別 `Rectangle`定義共用屬性 `width`、`height`
和`area()`方法計算矩形面積。`Triangle` 子類別繼承 `Rectangle` 類別並增加一個計算三角形面積的方法`area2()`。

`nano myClass.py`

```python{.line-numbers}
class Rectangle(): #定義父類別
     def __init__(self, width,height):
         self.width = width  # 定義共用屬性
         self.height= height # 定義共用屬性
     def area(self):         #定義共用方法
         return self.width * self.height

class Triangle(Rectangle): # 定義子额別
     def area2(self): #定義子類別的共用方法
         return (self.width * self.height)/2

triangle = Triangle(5,6)#建立 triangle 物件
print("矩形面積=",triangle.area())  # 30
print("三角形面積=",triangle.area2()) # 15.0
```

**程式說明**
⬜ 1-6 建立父類別 `Rectangle`。
⬜ 2-4 建立父類別建構式。
⬜ 5-6 建立 `area` 方法計算矩面積。
⬜ 8-10 建立子類別 `Triangle` 繼承 `Rectangle` 類別。
⬜ 9-10 建立 `area2` 方法計算三角形面積。
⬜ 12 `Triangle(5,6)`建立子類別的物件`striangle`，並初始化。
⬜ 13-14 計算矩形面積、三角形面積。



