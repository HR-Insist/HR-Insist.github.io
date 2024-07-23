---
title: Dubbo参数校验
date: 2024-07-23 09:58:40
categories: Java
tags: 
  - java
  - Dubbo
keywords: Dubbo,参数校验
description: 记录Dubbo如何进行参数校验，如果校验失败，返回统一结果
top_img: false
cover: Java/Dubbo参数校验/cover.png
toc_style_simple:
toc_number: false
---

# 一、前言

由于Dubbo默认的JSR303参数校验在未通过校验时，所返回的结果（ConstraintViolationException）并没有实现序列化，导致消费者调用服务时报错。且项目对于服务调用结果使用统一的Result对象，因此Dubbo默认的参数校验无法满足项目要求，故对Dubbo的参数校验进行改造。

# 二、解决方案

## 2.1 Maven依赖

在公共模块的pom文件下引入以下依赖

```pom

<dependency>
    <groupId>javax.validation</groupId>
    <artifactId>validation-api</artifactId>
    <version>2.0.1.Final</version>
</dependency>
 
<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.2.0.Final</version>
</dependency>
```

## 2.2定义接口

### 2.2.1 定义接口参数

在公共模块中定义接口参数，并使用参数校验注解

```java
@Data
public class AddAuthForm implements Serializable {

    private static final long serialVersionUID = 1L;

    // 用户ID
    @NotNull(message = "请输入用户ID")
    @Pattern(regexp = "^GHCD\\d{5}$", message = "用户ID不合法!")
    private String userId;
    // 权限ID

    @NotEmpty(message = "权限不能为空!")
    @ValidAuthIdList(min = 1, max = 6, message = "权限不合法!") // 自定义校验规则
    private List<Integer> authIds;

    // 操作人的ID
    @NotNull(message = "请输入操作人员ID")
    @Pattern(regexp = "^GHCD\\d{5}$", message = "操作人员ID不合法!")
    private String operatorId;

}
```

### 2.2.2 定义接口

```java
void addAuth(AddAuthForm addAuthForm);
```

### 2.2.3 定义全局异常类

在公共模块中定义全局异常类

```java
/**
 * 自定义异常
 */
public class GlobalException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	
    private String msg;
    private int code = 500;
    
    public GlobalException(String msg) {
		super(msg);
		this.msg = msg;
	}
	
	public GlobalException(String msg, Throwable e) {
		super(msg, e);
		this.msg = msg;
	}
	
	public GlobalException(String msg, int code) {
		super(msg);
		this.msg = msg;
		this.code = code;
	}
	
	public GlobalException(String msg, int code, Throwable e) {
		super(msg, e);
		this.msg = msg;
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}
	
}
```

### 2.2.4 定义异常处理器（重点）

**在Consumer中定义异常出路Handler**，这是重点！！！！

```java 
/**
 * 异常处理器
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
	private Logger logger = LoggerFactory.getLogger(getClass());


	/**
	 * 处理自定义异常
	 */
	@ExceptionHandler(GlobalException.class)
	public R handleGlobalException(GlobalException e){
		R r = new R();
		r.put("code", e.getCode());
		r.put("msg", e.getMessage());
		logger.error(e.getMessage(), e);
		return r;
	}
    
    // 数据参数读取异常，比如Integer收到String或者float
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public R handleHttpMessageNotReadableException(HttpMessageNotReadableException e){
		logger.error(e.getMessage(), e);
		return R.error("输入数据不合法");
	}

	// 参数校验异常！！！！重点！！！！
	@ExceptionHandler(ConstraintViolationException.class)
	public R handleConstraintViolationException(ConstraintViolationException e){
		logger.error(e.getMessage(), e);
		Set<ConstraintViolation<?>> violations = e.getConstraintViolations();
		if (CollectionUtils.isNotEmpty(violations)) {
			ConstraintViolation<?> violation = violations.iterator().next();// 取第一个进行提示就行了
			return R.error(violation.getMessage()); // 自定义统一返回结果类
		}
		return R.error("输入数据不合法!");
	}


	@ExceptionHandler(Exception.class)
	public R handleException(Exception e){
		logger.error(e.getMessage(), e);
		return R.error();
	}
}

```

## 2.3 Dubbo服务提供者端配置

Dubbo服务提供者端必须作这个validation="true"的配置，具体示例配置如下

```yaml
dubbo:
  provider:
    validation: true
```

## 2.4 Dubbo服务消费者端配置

Dubbo服务消费者端一般也建议作这个validation="true"的配置，具体示例配置如下

```yaml
dubbo:
  consumer:
    validation: true
```

## 2.5 消费者Controller

```java
/**
 * 新增
 */
@RequestMapping("/save")
public R save(@RequestBody AddAuthForm addAuthForm){
    userAuthService.addAuth(addAuthForm);
    return R.ok();
}
```

http调用save接口时，传入AddAuthForm参数，即可校验。

## 2.6 测试

例如，为传入`userId`这参数，即传入参数为：

```json
{
    "authIds": [1,3],
    "operatorId": "GHCD20241"
}
```

返回结果为：

```jso
{
    "msg": "请输入用户ID",
    "code": 500
}
```

符合预期结果。

# 三、服务端异常处理 

从前面内容我们可以很看到，当Dubbo消费端开启参数校验时，参数如果不合法就会抛出相关异常信息，并且返回给前端统一的返回结果。

但是如果是Dubbo服务提供端报错，则会出现问题。1. Consumer端收到的是RuntimeException。2. 错误信息过去复杂，不符合要求。

## 3.1 针对问题1

是因为Dubbo本身异常处理的一些问题，具体处理方案可以参考这篇文章[Dubbo异常处理](/java/Dubbo异常处理/)

## 3.2 针对问题2

从异常堆栈内容我们可以看出这个异常信息返回是由ValidationFilter抛出的，从名字我们可以猜到这个是采用Dubbo的Filter扩展机制的一个内置实现，当我们对Dubbo服务接口启用参数校验时（即前文Dubbo服务配置中的validation="true")，该Filter就会真正起作用，会把复杂的错误信息包装起来。我们看一下源码分析：

### 3.2.1 ValidationFilter

```java
@Override
public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
    if (validation != null && !invocation.getMethodName().startsWith("$")
            && ConfigUtils.isNotEmpty(invoker.getUrl().getMethodParameter(invocation.getMethodName(), VALIDATION_KEY))) {
        try {
            Validator validator = validation.getValidator(invoker.getUrl());
            if (validator != null) {
                // 注1
                validator.validate(invocation.getMethodName(), invocation.getParameterTypes(), invocation.getArguments());
            }
        } catch (RpcException e) {
            throw e;
        } catch (ValidationException e) {
            // 注2
            return AsyncRpcResult.newDefaultAsyncResult(new ValidationException(e.getMessage()), invocation);
        } catch (Throwable t) {
            return AsyncRpcResult.newDefaultAsyncResult(t, invocation);
        }
    }
    return invoker.invoke(invocation);
}
```

从前文的异常堆栈信息我们可以知道异常信息是由上述代码「注2」处所产生，这边是因为捕获了ValidationException，通过走读代码或者调试可以得知，该异常是由「注1」处valiator.validate方法所产生。

而Validator接口在Dubbo框架中实现只有JValidator，当然调试代码也可以很轻松定位到。

### 3.2.2 JValidator

```java
@Override
public void validate(String methodName, Class<?>[] parameterTypes, Object[] arguments) throws Exception {
    List<Class<?>> groups = new ArrayList<>();
    Class<?> methodClass = methodClass(methodName);
    if (methodClass != null) {
        groups.add(methodClass);
    }
    Set<ConstraintViolation<?>> violations = new HashSet<>();
    Method method = clazz.getMethod(methodName, parameterTypes);
    Class<?>[] methodClasses;
    if (method.isAnnotationPresent(MethodValidated.class)){
        methodClasses = method.getAnnotation(MethodValidated.class).value();
        groups.addAll(Arrays.asList(methodClasses));
    }
    groups.add(0, Default.class);
    groups.add(1, clazz);
 
    Class<?>[] classgroups = groups.toArray(new Class[groups.size()]);
 
    Object parameterBean = getMethodParameterBean(clazz, method, arguments);
    if (parameterBean != null) {
        // 注1
        violations.addAll(validator.validate(parameterBean, classgroups ));
    }
 
    for (Object arg : arguments) {
        // 注2
        validate(violations, arg, classgroups);
    }
 
    if (!violations.isEmpty()) {
        // 注3
        logger.error("Failed to validate service: " + clazz.getName() + ", method: " + methodName + ", cause: " + violations);
        throw new ConstraintViolationException("Failed to validate service: " + clazz.getName() + ", method: " + methodName + ", cause: " + violations, violations);
    }
}
```

上述代码中可以看出当「注1」和注「2」两处代码进行参数校验时所得到的「违反约束」的信息都被加入到violations集合中，而在「注3」处检查到「违反约束」不为空时，就会抛出包含「违反约束」信息的ConstraintViolationException，该异常继承自ValidationException，这样也就会被ValidationFilter中方法所捕获，进而向调用方返回相关异常信息。

### 3.2.3 自定义参数校验异常返回

在provider下新建CustomValidationFilter实现Filter接口，代码如下：

```java

@Activate(group = {CONSUMER, PROVIDER}, value = "customValidationFilter", order = 10000)
public class CustomValidationFilter implements Filter {

    private Validation validation;

    public void setValidation(Validation validation) { this.validation = validation; }

    public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
        if (validation != null && !invocation.getMethodName().startsWith("$")
                && ConfigUtils.isNotEmpty(invoker.getUrl().getMethodParameter(invocation.getMethodName(), VALIDATION_KEY))) {
            try {
                Validator validator = validation.getValidator(invoker.getUrl());
                if (validator != null) {
                    validator.validate(invocation.getMethodName(), invocation.getParameterTypes(), invocation.getArguments());
                }
            } catch (RpcException e) {
                throw e;
            } catch (ConstraintViolationException e) {// 这边细化了异常类型
                // 注1
                Set<ConstraintViolation<?>> violations = e.getConstraintViolations();
                if (CollectionUtils.isNotEmpty(violations)) {
                    ConstraintViolation<?> violation = violations.iterator().next();// 取第一个进行提示就行了
                    return AsyncRpcResult.newDefaultAsyncResult(new GlobalException(violation.getMessage()), invocation); // 参数为自定义异常，该异常继承了RuntimeException
                }
                return AsyncRpcResult.newDefaultAsyncResult(new ValidationException("参数不合法!"), invocation);
            } catch (Throwable t) {
                return AsyncRpcResult.newDefaultAsyncResult(t, invocation);
            }
        }
        return invoker.invoke(invocation);
    }
}
```

定义filter与内置的ValidationFilter唯一不同的地方就在于「注1」处所新增的针对特定异常ConstraintViolationException的处理，从异常对象中获取包含的「违反约束」信息，并取其中第一个参数校验错误信息，返回自定义异常类。配合**问题1的解决方案**就可以实现Consumer端接收到指定异常。

### 3.2.4 自定义Filter的配置

1. 在resources下新建二级目录：META-INF/dubbo

2. 再新建一个文件名org.apache.dubbo.rpc.Filter

3. 文件中配置内容为：customValidationFilter=com.xxx.demo.dubbo.filter.CustomValidationFilter

4. 配置provider的application.yml文件

   ```yam
   dubbo:
     provider:
       validation: true
       filter: -exception,-validation,dubboExceptionFilter,customValidationFilter
   ```

# 四、如何扩展校验注解

在实际开发中有时候会遇到默认内置的注解无法满足校验需求，这时就需要自定义一些校验注解去满足需求，方便开发。例如，我需要给一个List\<Integer>类型的属性设置最大值和最小值。

## 4.1 定义校验注解

```java
@Constraint(validatedBy = ListIntegerValidator.class)
@Target({ ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidAuthIdList{

    String message() default "权限未找到!";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    int min() default 1;
    int max() default 6;
}
```

## 4.2 创建校验器

```java

public class ListIntegerValidator implements ConstraintValidator<ValidAuthIdList, List<Integer>> {
    private int min;
    private int max;

    @Override
    public void initialize(ValidAuthIdList constraintAnnotation) {
        this.min = constraintAnnotation.min();
        this.max = constraintAnnotation.max();
    }

    @Override
    public boolean isValid(List<Integer> value, ConstraintValidatorContext context) {

        for (int num : value) {
            if (num < min || num > max) {
                return false; // 列表中有不符合要求的值
            }
        }
        return true; // 列表符合要求
    }
}

```

## 4.3 用法

1. 参考2.2.4小节中创建异常处理器，处理`ConstraintViolationException`异常。

2. 在要校验的字段上加`@ValidAuthIdList(min = 1, max = 6, message = "权限不合法!")`，如下：

   ```java
   @Data
   public class AddAuthForm implements Serializable {
   
       private static final long serialVersionUID = 1L;
   
     	// ......
       
       @NotEmpty(message = "权限不能为空!")
       @ValidAuthIdList(min = 1, max = 6, message = "权限不合法!") // 自定义校验规则
       private List<Integer> authIds;
       
       // ......
   
   }
   ```

   此时，如果我们传入的参数有大于6或小于1的值，则会抛出ConstraintViolationException异常。

# 五、总结

本文主要介绍了使用Dubbo框架时如何使用优雅点方式完成参数的校验，首先演示了如何利用Dubbo框架默认支持的校验实现参数校验，并且返回统一的数据格式；然后针对服务端异常处理的两个问题给出来相应的解决方案；最后介绍了下如何进行自定义校验注解的实现，方便进行后续自行扩展实现，希望能在实际工作中有一定的帮助。
