---
title: More Effective C++阅读笔记
date: 2023-05-08 16:40:00
categories: C++
tags: C++ 
keywords: C++, effective C++
description: "More Effective C++阅读笔记"
top_img: false
cover: C/More_Effective_C++阅读笔记/MoreEffectiveC++.jpg
toc_style_simple:
toc_number: false
---

{% note info flat %}

- 《More Effective C++》是侯捷老师翻译的C++必读书籍之一。
- 工欲善其事，必先利其器！

{% endnote %}

## 基础议题（Basics）

### 条款1：仔细区别 pointers 和 references

&emsp;&emsp;没有所谓的 *null reference*。一个 *reference* 必须代表某个对象。所以如果你有一个变量，其目的是用来指向（代表）另一个对象，但是也**有可能不指向（代表）任何对象，那么你应该使用 *pointer*，因为你可以将 *pointer* 设为 *null*。**换个角度，如果这个变量总是必须代表一个对象，也即是说**如果你的设计并不允许这个变量为 *null*，那么你应该使用 *reference*。**

&emsp;&emsp;`char *pc = 0;   // 将 pointer 设定为 null。`

&emsp;&emsp;`char& rc = *pc; // 让reference 代表 null pointer 的解引值。`

&emsp;&emsp;上述两行是有害的行为，其结果不可预期（C++对此没有定义），编译器可以产生任何可能的输出。**！！！C++ 要求 *reference* 必须有初值。**

### 条款2：最好使用 C++ 转型操作符

C++ 导入了4个新的转型操作符：

- **static_cast**：转换变量类型。只能完成可以进行类型转换的转型，例 int->double。不能：struct->int

  ```c++
  int first, second;
  double res = ((double)first) / second; // 旧式C语言风格
  // 等价于
  double res = static_cast<double>(first) / second; // C++ 风格
  ```

- **const_cast**：改变某物的常量性或易变性。

- **dynamic_cast**：用来执行继承体系中“安全的**向下转型**或**跨系转型**动作”。利用 dynamic_cast 将“指向 base class objects 的 **pointers **或 **reference**“ 转型为 ”指向 derived（或sibling base）class objects 的 pointers 或 references”，并得知转型是否成功。如果转型失败，会以一个 null指针（当转型对象是指针）或一个 exception（当转型对象是reference）表现出来。

- **reinterpret_cast**：它的最常用用途是转换“函数指针”类型。

### 条款3：绝对不要以多态（polymorphically）方式处理数组

1. 对于数组作为参数的传递只有按**引用传递**或者传递**首元素的地址**，不存在按值传递。

2. 当把子类的数组传递给基类数组时除了第一个对象会发生对象切片外，其他的对象都无法有效解析，从而出现运行错误。

   ```c++
   class BST{...};
   class BalancedBST: public BST{...}
   void printBSTArray(ostream& s, const BST array[], int numElements){
       for(int i=0; i<numElements; ++i){
       	s << array[i];
       }
   }
   BST BSTArray[10];
   // do something
   printBSTArray(std::cout, BSTArray, 10); // 运行良好
   ```

   ```c++
   BalancedBST bBSTArray[10];
   // do something
   printBSTArray(std::cout, bBSTArray, 10); // 运行错误
   ```

   错误原因在于 for 循环中的  `s << array[i];`。

   **！！！**array[i] 其实是一个指针算术表达式的简写，它代表的其实是 \*(array+i)，array 是一个指向数组起始处的指针。array 所指内存和array+i 所指内存两者相距：**i\*sizeof(数组中对象)**，因为array[0] 和 array[i] 之间有 i 个对象。

   array 在 printBSTArray 函数中被声明为“类型为BST”的数组。所以编译器默认数组中的每个元素类型必然为BST类型，距离为 **i\*sizeof(BST)**。然而，当你传入 BalancedBST类型的数组时，实际距离应该为  **i\*sizeof(BalancedBST)**，从而导致不可预期的错误。

3. 如果你尝试通过一个 base class 指针，删除一个由 derived class objects 组成的数组，那么上述问题还是会以另一种不同面貌出现。即：析构函数的调用时出现问题。

### 条款4：非必要不提供 default constructor

缺少default constructor会出现几个问题：

1. 在产生数组的时候，没有任何办法可以为数组中的对象指定 constructor 自变量。
2. 他们将不适用于许多 template-based container classes。



## 操作符（Operator）

### 条款5：对定制的“类型转换函数”保持警惕

1. C++ 允许内置数据类型之间(例如char和int，int和double等)进行隐式转换，对于内置类型之间的隐式转换有详细的规则，但不管怎样，这些都是语言提供的，既相对安全，我们又无法更改。

   对于自定义的类类型，隐式转换可以通过**带单一自变量的构造函数**和**隐式类型转换操作符**来实现。所谓"单一自变量指的是可以有多个参数，但除了第一个参数其他参数必须有默认实参)。所谓隐式类型转换操作符，是一个 member function：关键词operator 之后加一个类型名称，例如：`operator double() const;`

   ```c++
   class Rational {
   public:
   	...
       operator double() const; // 将Rational 转换为 double
   }
   ```

   这个函数会在以下情况被自动调用：

   ```c++
   Rational r(1, 2);  // r的值是 1/2
   double d = 0.5 * r; // 将r的值转换为double，然后执行运算。
   ```

2. 但是下面这个情况就会出问题：`std::cout << r;`

   如果你忘了为 Rational 类重载一个 *operator<<*，那么按道理应该打印不成功。但是编译器面对上述动作，它会想尽办法（包括找出一系列可接受的隐式类型转换）让函数调用动作成功。此时编译器发现 **只需调用 Rational::operator double， 将 r 转换为 double**，就可以成功调用 `std::cout << r;`，以浮点数的形式输出。

   **解决办法**就是**以功能对等的另一个函数取代类型转换操作符**。即：定义一个 `doube asDouble() const;`函数。虽然使用时有些许不便，但“可因为不再默默调用那些不打算调用的函数而获得弥补”。C++ 标准库中的 string 类从没有 string 到 char*  的隐式类型转换操作符而采用 c_str 函数可能就是这个原因。

3. 拥有单个参数（或除第一个参数外都有默认值的多参数）构造函数的类，很容易被隐式类型转换，最好加上 explicit 防止隐式类型转换。

   ```c++
   template<class T>
   class Array{
   public:
   	Array(int size);
   	T& operator[](int index);
   };
   
   bool operator==(const Array<int> &lhs, const Array<int> & rhs);
   Array<int> a(10), b(10);
   for(int i=0; i<10; ++i){
       if(a == b[i]){ //想要写 a[i] == b[i]，但是这时候编译器并不会报错
           //  do something
       } 
       else{
           // do something
       }
   }
   ```

   `if(a == b[i])` 并不会报错。因为编译器发现只要调用 Array\<int\> constructor（需一个 int 作为自变量），就可以把 int 转为 Array\<int\> object。就会产生类似这样的代码：

   `if( a == static_cast<Array<int> >(b[i]))` 将 b[i] 转为 Array。此时程序会正常运行，但是结果却不尽人意。

   解决办法就是使用 C++ 特性：关键词 explicit。这个特性之所以被导入，就是为了解决隐式类型转换带来的问题。` explict Array(int size);`

   还有一种被称为 ***proxy classes*** 的方法：

   ```c++
   class Array {
   public:
       class ArraySize { // 这个类是新的
       public:
       	ArraySize(int numElements):theSize(numElements){}
       	int size() const { return theSize;}
       private:
       	int theSize;
       };
   	Array(int lowBound, int highBound);
   	Array(ArraySize size); // 注意新的声明
   ...
   };
   ```

   这样写的代码在 Array\<int\> a(10); 的时候，编译器会先通过类型转换将 int 转换成 ArraySize，然后再进行构造，虽然麻烦很多，效率也低了很多，但是在一定程度上可以避免隐式转换带来的问题。

   对于自定义类型的类型转换，有一个规则：”**没有任何一个转换程序可以内含一个以上的‘用户定制转换行为’(亦即单自变量constructor亦即隐式类型转换操作符)**“，也就是说，必要的时候编译器可以先进行内置类型之间的转换再调用带单自变量的构造函数或者先调用隐式类型转换操作符在进行内置类型之间的转换，**但不可能连续进行两次用户定制的类型转换**！

   所以 此时`if(a == b[i])` 就会报错。不能从 int 转换成 ArraySize，再从 ArraySize 转为 Array。

4. 总结允许编译器执行隐式转换弊大于利，所以**非必要不要提供转换函数**！ 

### 条款6：区别 increment/decrement 操作符的前置和后置形式

1. 由于 increment/decrement 操作符的前置和后置式都是一元运算符，没有参数。因此重载时通过在后置式中加一个 int 型参数(哑元参数)加以区分，当后置式被调用时，编译器自动在为该参数指定一个0值。

   ```c++
   class UPInt{
   public:
       UPInt& operator++();          // 前置式++
       const UPInt operator++(int);  // 后置式++
       UPInt& operator--();          // 前置式--
       const UPInt operator++(int);  // 前置式--
   }
   ```

   **前置式返回 reference，后置式返回 const 对象**！

   后置 operator++(int) 的叠加是不允许的，即：i++++。

   原因有两个：一是与内建类型行为不一致（内建类型支持前置叠加)；二是其效果跟调用一次 operator++(int) 效果一样，这是违反直觉的。另外，后置式操作符使用 operator++(int)，参数的唯一目的只是为了区别前置式和后置式而已，当函数被调用时，编译器传递一个0作为int参数的值传递给该函数。

2. 处理用户定制类型时，应该**尽可能使用前置式**。

3. 后置式操作符的实现应以前置式为基础。

### 条款7：千万不要重载&&，|| 和，操作符

&emsp;&emsp;C++ 对于“真假值表达式” 采用所谓的“骤死式” 评估方式。意思是一旦该表达式的真价值确定，及时表达式中还以后部分尚未检验，整个评估工作仍然结束。

```c++
char* p;
// ...
if (p != 0 && strlen(p) > 10){} 
```

&emsp;&emsp;你无需担心调用 strlen 时 p 是否为 null 指针，因为如果 “p 是否为 0“ 的结果是否定的，那么 strlen 就绝对不会被调用。（对一个 null 指针调用 strlen，结果不可预期。）

&emsp;&emsp;当你自己重载&&，|| 和，操作符时，你无法控制一个函数的自变量评估顺序，不一定会从左往右。然而正确的评估顺序应该是从左往右。

&emsp;&emsp;你不能重载以下操作符：

|             |              |            |                  |
| :---------- | :----------- | ---------- | ---------------- |
| .           | .*           | ::         | ?:               |
| new         | delete       | sizeof     | typeid           |
| static_cast | dynamic_cast | const_cast | reinterpret_cast |

### 条款8：了解各种不同意义的 new 和 delete

- **new operator**：new操作符，用于动态分配内存并进行初始化;

  **operator new**：标准库的函数，只分配内存不进行初始化(或者传递一个可用的内存地址)，可以自己进行重载，也可以主动调用。

  **placement new**(定位new)：new operator的另外一种用法 ，在已分配的内存上构造对象; 

  注意：new operator是操作符，placement new是这个操作符的一种用法，而operator new是标准库中的函数，new operator调用了 operator new。 

- new operator，不能被重载

  当你写出这样的代码：

  string \*ps = new string("Memory Mangement");

  你所使用的 new 是所谓的 ***new operator***。它的动作分为两个方面：1、分配足够的内存，用来放置某类型的对象；2、调用 constructor，为刚才的内存中的那个对象设定初值。

- 和 malloc 一样，operator new 的唯一任务就是**分配内存**。

  `void *rawMemory = operator new(sizeof(string));`  返回值类型是 **void\***   ！！！

  可以重载 operator new，但是第一个参数类型必须总是 size_t。

- `string *ps = new string("Memory Mangement");`

  等价于

  ```c++
  void *rawMemory = operator new(sizeof(string));   // 取得原始内存，用来存放有一个string对象
  call string::string("Memory Mangement") on *memory; // 将内存中的对象初始化
  string *ps = static_cast<string*>(memory); // 让ps 指向新完成的对象
  ```

- 将对象产生与 heap，请使用 new operator。它不但分配内存而且为该对象调用一个 constructor。

- 如果你只是打算分配内存，请调用 operator new，那就没有任何 constructor 会被调用。

- 如果你打算在 heap objects 产生时自己决定内存分配方式，请写一个自己的 operator new，并使用 new operator，它会自动调用你所写的 operator new。

- 如果你打算在已分配并拥有指针的内存中构造对象，请使用 placement new。

- ！！**new operator 与 delete operator 配合使用。**

- ！！**operator new 与 operator delete 配合使用。**千万不能错误搭配。





















































