---
title: Effective C++阅读笔记
date: 2023-03-09 14:46:43
categories: C++
tags: C++ 
keywords: C++, effective C++
description: "Effective C++阅读笔记"
top_img: false
cover: C++/EffectiveC++阅读笔记/EffectiveC++.jpg
toc_style_simple:
toc_number: 
---

{% note info flat %}

- 《Effective C++》是侯捷老师翻译的C++必读书籍之一。
- 工欲善其事，必先利其器！

{% endnote %}

### 一、让自己习惯C++

#### 条款01：视C++为一个语言联邦



#### 条款04：确定独享被使用前已先被初始化

确保每个构造函数都将对象的每一个成员**初始化**。不要混淆赋值和初始化。

base classes更早于其derived classes被初始化，而class的成员变量总是以其**声明次序**被初始化。

函数内的static对象被称为**local static对象**（因为它对函数而言是local的），其他的static对象称为**non-local static对象**（该对象位于global或位于namespace作用域内，或者在class内或file作用域内被声明的static）。

**编译单元（translation unit）**是指产出单一目标文件的那些源码。基本上它是单一源码问价 加上其所含入的头文件（#include files）。

问题：如果编译单元内的某个non-local static对象的初始化动作使用了另一编译单元内的某个non-local static对象，它所用到的这个对象可能**尚未初始化**，因为C++对“定义于不同编译单元内的non-local static对象”的初始化次序并无明确定义。

解决：将每个non-local static对象搬到自己的专属函数内（该对象在此函数内被声明为static）。这些函数返回一个reference指向它所含的对象。然后用户调用这些函数，而不是直接使用这些对象。（Singleton设计模式）

- 为内置型对象进行手工初始化，因为C++不保证初始化它们。
- 构造函数最好使用成员初值列，而不要在构造函数本体内使用赋值操作。初值列列出的成员变量，其排列次序应该和它们在class中的声明次序相同。
- 为免除“跨编译单元的初始化次序问题”，请以local static对象替换non-local static对象。

### 二、构造/析构/赋值运算



### 四、设计与声明

#### 条款18：让接口容易被正确使用，不易被误用

”一致性“

使用智能指针，避免资源泄露

如果客户忘记使用智能指针怎么办？较佳接口的设计原则是先发制人，就令factory函数返回一个智能指针

shared_ptr支持定制型删除器：shared_ptr&lt;Class&gt;  pointer(classValue,  **deleter**)  

**转型(cast)**可以将 *内置类型* 转换为 *指针* 

例：把整型0 --> 指针 static_cast<Pointer*>(0)

#### 条款19：设计class犹如设计type



#### 条款20：宁以pass-by-reference-to-const 替换 pass-by-value

**切割问题**：当一个derived class对象以**by-value方式**传递并被视为一个base class对象，base class的copy构造函数会被调用，而derived class特有的那些性质全被**切割**掉了，仅仅留下一个base class对象。

- 尽量以pass-by-reference-to-const替换pass-by-value。前者比较高效，并可以避免切割问题（slicing problem)。
- 但是对于*内置类型* 以及*STL的迭代器和函数对象*，pass-by-value往往比较适当。

#### 条款21：必须返回对象时，别妄想返回其reference

- 绝不要返回pointer或reference指向一个local stack对象，或返回reference指向一个heap-allocated对象，或返回pointer或reference指向一个local static对象而有可能同时需要多个这样的对象。

#### 条款22：将成员变量声明为private

第一：private, public, protected 访问标号的访问范围。

- private：只能由1.该类中的函数、2.其友元函数访问。不能被任何其他访问，该类的对象也不能访问。

- protected：可以被1.该类中的函数、2.子类的函数、以及3.其友元函数访问。但不能被该类的对象访问。

- public：可以被1.该类中的函数、2.子类的函数、3.其友元函数访问，也可以由4.该类的对象访问。

  注：友元函数包括3种：设为友元的普通的非成员函数；设为友元的其他类的成员函数；设为友元类中的所有成员函数。

第二：类的继承后方法属性变化。

- private 属性不能够被继承。

- 使用private继承，父类的protected和public属性在子类中变为private；

- 使用protected继承，父类的protected和public属性在子类中变为protected；

- 使用public继承，父类中的protected和public属性不发生改变;如下所示：public: protected: private:

- public继承 public protected 不可用

- protected继承 protected protected 不可用

- private继承 private private 不可用

- protected继承和private继承能降低访问权限。

#### 条款23：宁以non-member、non-friend替换member函数

- 宁可拿non-member、non-friend函数替换门儿函数。这样做可以增加封装性、包裹弹性和机能扩充性。

#### 条款24：若所有参数皆需类型转换，请为此采用non-member函数

例：operator*() 作为member函数

~~~ c++
class Rational {
public:
    Rational(int numerator=0, int denominator=1);
    int numerator() const;
    int denominator() const;
private:
    int numerator;
    int denominator;
}
~~~

``` c++
Rational oneHalf(1,2);
Rational oneThree(1,3);
Rantional result = oneHalf * oneThree;  // 正确√
result = oneHalf * 2;  //2发生了隐式转换   // 正确√
result = 2 * oneHalf;                   // 错误×
// 乘法应该满足交换律
```

**解决办法：让operator*成为一个non-member函数，允许编译器在每个实参身上执行隐士类型转换，是否需要成为Rational class的一个friend函数，需要考虑一下是否必要。**

``` c++
class Rational{
    ...
}
const Rational operator*(const Rational& lhs, const Rational& rhs){
    return Rational(lhs.numerator() * rhs.numerator(),    // 现在operator* 成为了一个
                    lhs.denominator() rhs.denominator()); // non-member函数   
}
Rational oneHalf(1,2);
Rational oneThree(1,3);
Rantional result = oneHalf * oneThree;  // 正确√
result = oneHalf * 2;  //2发生了隐式转换   // 正确√
result = 2 * oneHalf;                   // 正确√  满足乘法交换律了！！！
```

#### 条款25：考虑写出一个不抛异常的swap函数

- 模板全特化：所谓模板全特化限定死模板实现的所有参数具体类型；
- 模板偏特化：如果这个模板有多个类型，那么**只限定其中的一部分**;
- **！！注意：**C++只允许对class templates偏特化，不能对function templates偏特化。！！！

``` c++
// 普通模板
template<class T1,class T2>
class Test
{
public:
 Test(T1 a, T2 b):_a(a),_b(b)
 {
  cout << "模板化" << endl;
 }
private:
 T1 _a;
 T2 _b;
};

//类模板全特化 
template<>
class Test<int,int>
{
public:
 Test(int a, int b) :_a(a), _b(b)
 {
  cout << "模板全特化" << endl;
 }
private:
 int _a;
 int _b;
};

//类模板偏特化
template<class T>
class Test<int,T>
{
public:
 Test(int a, T b) :_a(a), _b(b)
 {
  cout << "模板偏特化" << endl;
 }
private:
 int _a;
 T _b;
};

int main()                                                                                             
{
 Test<double, double> t1(1.01, 1.01);
 Test<int, int> t2(1, 1);
 Test<int, char*> t3(1, "111");
 return 0;
}
```

- 当std::swap对你的类型效率不高时，提供一个swap成员函数，并确定这个函数不抛出异常。
- 如果你提供一个member swap，也该提供一个non-member swap来调用前者。
- 调用swap时应该针对std::swap使用using声明式，以便让std::swap在你的函数内曝光，然后调用swap并且不带任何“命名空间资格修饰”。
- 为“用户自定义类型”进行std templates全特化是好的，但是恰完不要尝试在std内加入某些对std而言全新的对象。

### 五、实现

#### 条款26：尽可能延后变量定义式的出现时间

“通过default构造函数出一个对象然后对它赋值”比“直接在构造时指定初值”效率差。前者需要一次构造+一次赋值，后者只需要一次构造。

你不只应该延后变量的定义，直到非得使用该变量的前一刻为止，甚至应该尝试延后这份定义直到能够给它初始值为止。

- 尽可能延后变量定义式的出现。这样做可以增加程序的清晰度并改善程序效率。

#### 条款27：尽量少做转型（cast）动作



#### 条款28：避免返回 handles 指向对象内部成分

成员变量的封装性最多只等于“返回其reference”的函数的访问级别。例：虽然 ulhc 和 lrhc 都被声明为 private，但他们实际上确实 public，因为public 函数 upperLeft 和 lowerRight 传出了它们额reference。

如果const 成员函数传出一个 reference，后者所指数据与对象自身有关联，而它又被存储于对象之外，那么这个函数的调用者可以修改那笔数据。

Reference、指针和迭代器都是所谓的 handles（号码牌，用来取得某个对象），而返回一个“代表对象内部数据”的 handle，随之而来的便是“降低对象封装性”的风险。同时可能导致“虽然调用 const 成员函数却造成对象状态被更改”。

应该刘鑫不要返回内部成员的 handles。这意味着你绝对不该令成员函数返回一个指针指向“访问级别较低（protected，private）”的成员函数。否则后者的实际访问级别机会提高如同前者（访问级别较高者），因为客户可以取得一个指针指向那个“访问级别较低”的函数，然后通过指针调用它。

可能导致dangling handles（空悬的号码牌）：这种handles所指东西（的所属对象）不复存在。这种“不复存在的对象”最常见的来源就是函数返回值。

#### 条款29：为“异常安全”而努力是值得的

























































