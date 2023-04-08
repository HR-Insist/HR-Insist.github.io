---
title: C++面向对象高级编程（下-侯捷）
date: 2023-04-06 22:04:47
categories: C++
tags: C++
keywords:
description:
top_img: false
cover:
toc_style_simple:
toc_number: false
---

{% note info flat %}

- 本文是学习侯捷老师的C++面向对象高级编程（下）的课程笔记。

{% endnote %}

### 1、导读

侯捷老师提到这个课程应该称为C++程序设计Ⅱ兼谈对象模型，因为他并没有过多的叙述面向对象编程，而是在上篇的基础上探讨一些没有讨论过的主题。

- 在先前基础课程所培养的正规、大器的编程素养上，继续探讨更多技术。
- 泛型编程(Generic Programming)和面向对象编程(Object-Oriented Programming)虽然分属不同思维但它们正是C++的技术主线，所以本课程也讨论template (模板)。
- 深入探索面向对象之继承关伪(inheritance)所形成的对象模型(Object Model)，包括隐藏于底层的this指针,vptr (虚指针), vtbl (虚表), virtual mechanism (虚机制),以及虚函数(virtual functions)造成polymorphism (多态)效果。

### 2、conversion function转换函数

作用：把一个class的类型转换成你想要的、自认为合理的类型，但是如何转换有自己在函数体内设计。

格式：`operator double() const{...}`

 注意事项：

1. 不能加返回类型，且要有关键字`double`；
2. 一般情况下都要加`const`；
3. 只要你认为合理，可以写多个转换函数，如`operator double() const{...}`, `operator string() const{...}`

```C++
class Fraction{
public: 
	Fraction (int num, int den= 1 ) : m_numerator(num)，m_denominator(den) { }
	operator double() const{  // 注意：不能有返回类型
		return (double) (m_numerator/ m_denominator);
    }
private :
	int m_numerator; //分子
	int m_denominator; // 分母
};
Fraction f(3,5) ;
double d=4+f; //调用operator double()将变量f的类型转换为double，值为0.6
```

### 3、non-explicit-one-argument constructor

non-explicit-one-argument ctor(非显式的一个实参的构造函数)其实与转换函数的功能**相反**，它的作用是：**把其他类型转换成该class的类型。**

如果**转换函数**和**non-explicit-one-argument ctor同时出现**，可能会**引起歧义**！

```c++
class Fraction{
public: 
	Fraction (int num, int den= 1 ) : m_numerator(num)，m_denominator(den) { }
	operator double() const{  // 注意：不能有返回类型
		return (double) (m_numerator/ m_denominator);
    }
    Fraction operator+ (const Fraction& f) { // +操作符
		return Fraction(...) 
    }
private :
	int m_numerator; //分子
	int m_denominator; // 分母
};
Fraction f(3,5);
Fraction d2=f+4; // [Error] ambiguous
```

- 此时编译器**可以**通过 non-explicit-one-argument ctor 把 4 转换成 Fraction 类型，再与f相加。**也可以**通过转换函数把 Fraction 类型的f转换成 0.6，再与 4 相加。编译器发现有**多条路**可以走通，则引起了**二义性（歧义）**。

解决办法：把**non-explicit**-one-argument ctor声明为**explicit**-one-argument ctor，这样就禁止默认转换了。

```c++
class Fraction{
 public:
	explicit Fraction (int num, int den= 1 ) : m_numerator(num)，m_denominator(den) { }
    //.....
}  
Fraction f(3,5);
Fraction d2=f+4; // [Error] conversion from 'double' to 'Fraction' requested
```

- 此时4无法转换为Fraction类型，那么就只有 f 可以转换为 double 类型，消除了二义性。但是f+4=4.6 得到一个double类型的结果，然而double类型的值无法转换为Fraction类型，所以依然导致报错。















