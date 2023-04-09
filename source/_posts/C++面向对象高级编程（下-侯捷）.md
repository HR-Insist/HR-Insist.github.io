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

### 4、pointer-like classes （仿指针）

**（1）智能指针**

**（2）迭代器**

### 5、function-like classes (仿函数)

所谓仿函数就是： 一个类，**重载操作符()之后**，表现的像一个函数。

### 6、namespace经验谈

namespace的主要用途就是为了避免命名冲突，在大型工程中尤为常见，避免A写的代码与B写的代码有重名的class或function。

自己在写一些测试代码时也可以使用命名空间封装起来。

### 7、class template 类模板

使用时加上<参数type>

### 8、Function template 函数模板

函数模板在使用时不需要加参数类型，编译器会自动推导参数的类型。

### 9、member template 成员模板

成员模板是指：在一个模板类里面的一个成员依旧是一个模板形式。

### 10、specialization（模板特化）

将泛化的模板指定为固定的模板参数类型

```c++
template <class Key> // 泛化
struct hash{...};

template<> // 特化
struct hash<long>{
    size_ t operator() (long x) const {return x; }
};
 cout << hash<long>()(1000); // 使用(全)特化模板
```



### 11、partial specialization （模板偏特化）

1. 个数上的偏特化

   即将模板中的某个/些参数提前绑定（赋予）默认值。

   ！！！注意：只能提前绑定靠后的模板参数，例：假设有五个模板参数，只能绑定3/4/5，不能绑定1/3/5

2. 范围上的偏特化

   例如：将**什么类型都可以**传的模板，偏特化为**只有指针类型能**传的模板。

   ```c++
   template <typename T>
   class C{...};
   // 偏特化
   template <typename T>
   classC<T*>{...}
   
   C<string> obj1; // 使用上面的模板
   C<string*>  obj2; // 使用下面的偏特化模板（特别含有指针的模板）
   ```

### 12、模板模板参数

1. 模板模板参数就是模板的参数又是一个模板，如：

   ```c++
   template<typename T, template<typename U> class Container>
   class XCls
   {
       private:
           Container<U> c;
   };
   ```

   模板的第一个参数是`T`类型，第二个参数是一个`Container`，他是一个可以指定一个`U`类型的变量。

   那么如何使用他呢？

   ```c++
   template<typename T>
   class test
   {
       private:
           T t;
   };
   ```

   ```c++
   int main(void)
   {
       XCls<std::string, test> mylst1;
       return 0;
   }
   ```

   我们可以定义一个模板类，然后将其如上方式传入就可以了。

   但是如果传入一个容器呢？比如：`list`

   ```c++
   XCls<string, list> mylst1;
   ```

   如果这样，编译就会报错。分析如下：

   将`string` 和 `list`传入到类`XCls`中，然后就会定义一个`list<string>`的c变量，这样看起来是可以的，因此我们使用list容器的时候就是`list<一个类型>`，但是这里为什么就不行呢？是因为list容器实质上是有第二参数的，虽然第二参数有默认的参数，正如我们平常使用的那样，只需要指定一个参数，但是在这里无法通过编译，因此，我们使用如下解决办法：

   ```c++
   template<typename T>
   using Lst = std::list<T, std::allocator<T>>;
   
   XCls<std::string, Lst> mylst2;
   // 编译时需要加上std=c++11
   ```

   使用`C++11`的`using`关键字的新功能，来定义一个类型的别名，而且使用在模板的情况下，因此我们编译时要指定`std=c++11`。

   然后我们将`list`的别名`Lst`传入进入，就可以编译通过。

2. 这不是模板模板参数

   ```c++
   template<typename T, typename Sequence = list<T>>
   class stack
   {
       private:
           Sequence c;
   };
   stack<int> s1;
   stack<int, deque<int>> s2; 
   stack<int, deque> s3; 
   ```

   第一种，只指定了第一个模板参数，使用第二个默认的模板参数，第三个可以仅指定容器类型而不需要再次指定元素类型。

   第二种，指定了两个模板参数。

   但是！**这不是模板模板参数**。因为，一旦指定了第一个模板参数，那么第二个参数的类型就会确定，而真正的模板模板参数，第二个模板参数和第一个模板参数的类型是没有关系的，可以指定为第一个模板参数的类型，也可以指定为其他类型。因此，这不是模板模板参数！！！

### 13、C++标准库

侯捷老师提到，一定要多多使用、了解、学习C++的标准库！最好是自己亲自动手编程使用那些标准库，不需要自己再次编程实现标准库，因为你实现的没它实现的好，只需要学习怎么使用就行。











































