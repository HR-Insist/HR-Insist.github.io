---
title: Dubbo异常处理
date: 2024-07-22 23:40:58
categories: Java
tags: 
  - java
  - Dubbo
keywords: Dubbo,异常处理
description: 记录Dubbo如何处理异常，返回统一结果
top_img: false
cover: Java/Dubbo异常处理/cover.png
toc_style_simple:
toc_number: false
---

# 问题描述

Dubbo在Provider端抛出异常(包括但不限于自定义异常)的时候会自动转换成RuntimeException，异常信息会被放在RuntimeException的msg中，导致我们在Consumer端异常处理的时候不能正确获取到我们想要的异常或者信息。

# 原因分析

## Dubbo中的异常处理

```java
/*
 * Copyright 1999-2011 Alibaba Group.
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *      http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.alibaba.dubbo.rpc.filter;
 
import java.lang.reflect.Method;
 
import com.alibaba.dubbo.common.Constants;
import com.alibaba.dubbo.common.extension.Activate;
import com.alibaba.dubbo.common.logger.Logger;
import com.alibaba.dubbo.common.logger.LoggerFactory;
import com.alibaba.dubbo.common.utils.ReflectUtils;
import com.alibaba.dubbo.common.utils.StringUtils;
import com.alibaba.dubbo.rpc.Filter;
import com.alibaba.dubbo.rpc.Invocation;
import com.alibaba.dubbo.rpc.Invoker;
import com.alibaba.dubbo.rpc.Result;
import com.alibaba.dubbo.rpc.RpcContext;
import com.alibaba.dubbo.rpc.RpcException;
import com.alibaba.dubbo.rpc.RpcResult;
import com.alibaba.dubbo.rpc.service.GenericService;
 
/**
 * ExceptionInvokerFilter
 * <p>
 * 功能：
 * <ol>
 * <li>不期望的异常打ERROR日志（Provider端）<br>
 *     不期望的日志即是，没有的接口上声明的Unchecked异常。
 * <li>异常不在API包中，则Wrap一层RuntimeException。<br>
 *     RPC对于第一层异常会直接序列化传输(Cause异常会String化)，避免异常在Client出不能反序列化问题。
 * </ol>
 * 
 * @author william.liangf
 * @author ding.lid
 */
@Activate(group = Constants.PROVIDER)
public class ExceptionFilter implements Filter {
 
    private final Logger logger;
    
    public ExceptionFilter() {
        this(LoggerFactory.getLogger(ExceptionFilter.class));
    }
    
    public ExceptionFilter(Logger logger) {
        this.logger = logger;
    }
    
    public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
        try {
            Result result = invoker.invoke(invocation);
            if (result.hasException() && GenericService.class != invoker.getInterface()) {
                try {
                    Throwable exception = result.getException();
 
                    // 如果是checked异常，直接抛出
                    if (! (exception instanceof RuntimeException) && (exception instanceof Exception)) {
                        return result;
                    }
                    // 在方法签名上有声明，直接抛出
                    try {
                        Method method = invoker.getInterface().getMethod(invocation.getMethodName(), invocation.getParameterTypes());
                        Class<?>[] exceptionClassses = method.getExceptionTypes();
                        for (Class<?> exceptionClass : exceptionClassses) {
                            if (exception.getClass().equals(exceptionClass)) {
                                return result;
                            }
                        }
                    } catch (NoSuchMethodException e) {
                        return result;
                    }
 
                    // 未在方法签名上定义的异常，在服务器端打印ERROR日志
                    logger.error("Got unchecked and undeclared exception which called by " + RpcContext.getContext().getRemoteHost()
                            + ". service: " + invoker.getInterface().getName() + ", method: " + invocation.getMethodName()
                            + ", exception: " + exception.getClass().getName() + ": " + exception.getMessage(), exception);
 
                    // 异常类和接口类在同一jar包里，直接抛出
                    String serviceFile = ReflectUtils.getCodeBase(invoker.getInterface());
                    String exceptionFile = ReflectUtils.getCodeBase(exception.getClass());
                    if (serviceFile == null || exceptionFile == null || serviceFile.equals(exceptionFile)){
                        return result;
                    }
                    // 是JDK自带的异常，直接抛出
                    String className = exception.getClass().getName();
                    if (className.startsWith("java.") || className.startsWith("javax.")) {
                        return result;
                    }
                    // 是Dubbo本身的异常，直接抛出
                    if (exception instanceof RpcException) {
                        return result;
                    }
 
                    // 否则，包装成RuntimeException抛给客户端
                    return new RpcResult(new RuntimeException(StringUtils.toString(exception)));
                } catch (Throwable e) {
                    logger.warn("Fail to ExceptionFilter when called by " + RpcContext.getContext().getRemoteHost()
                            + ". service: " + invoker.getInterface().getName() + ", method: " + invocation.getMethodName()
                            + ", exception: " + e.getClass().getName() + ": " + e.getMessage(), e);
                    return result;
                }
            }
            return result;
        } catch (RuntimeException e) {
            logger.error("Got unchecked and undeclared exception which called by " + RpcContext.getContext().getRemoteHost()
                    + ". service: " + invoker.getInterface().getName() + ", method: " + invocation.getMethodName()
                    + ", exception: " + e.getClass().getName() + ": " + e.getMessage(), e);
            throw e;
        }
    }
 
}
```

从上面我们可以看出,dubbo的处理方式主要是:

1. 如果provider实现了GenericService接口,直接抛出
2. 如果是checked异常，直接抛出
3. 在方法签名上有声明，直接抛出
4. 异常类和接口类在同一jar包里，直接抛出
5. 是JDK自带的异常，直接抛出
6. 是Dubbo本身的异常，直接抛出
7. 否则，包装成RuntimeException抛给客户端

# 解决方案

## 第一步：修改源码

第一步：修改源码，在provider端新建`filter`包，创建`DubboExceptionFilter`类。我的自定义异常是 GlobalException

``` java
@Activate(group = {CommonConstants.CONSUMER, CommonConstants.PROVIDER})
public class DubboExceptionFilter implements Filter, Filter.Listener {
    private ErrorTypeAwareLogger logger = LoggerFactory.getErrorTypeAwareLogger(ExceptionFilter.class);

    @Override
    public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
        return invoker.invoke(invocation);
    }

    @Override
    public void onResponse(Result appResponse, Invoker<?> invoker, Invocation invocation) {
        if (appResponse.hasException() && GenericService.class != invoker.getInterface()) {
            try {
                Throwable exception = appResponse.getException();

                // directly throw if it's checked exception
                if (!(exception instanceof RuntimeException) && (exception instanceof Exception)) {
                    return;
                }
                // directly throw if the exception appears in the signature
                try {
                    Method method = invoker.getInterface().getMethod(invocation.getMethodName(), invocation.getParameterTypes());
                    Class<?>[] exceptionClasses = method.getExceptionTypes();
                    for (Class<?> exceptionClass : exceptionClasses) {
                        if (exception.getClass().equals(exceptionClass)) {
                            return;
                        }
                    }
                } catch (NoSuchMethodException e) {
                    return;
                }

                // for the exception not found in method's signature, print ERROR message in server's log.
                logger.error(CONFIG_FILTER_VALIDATION_EXCEPTION, "", "", "Got unchecked and undeclared exception which called by " + RpcContext.getServiceContext().getRemoteHost() + ". service: " + invoker.getInterface().getName() + ", method: " + invocation.getMethodName() + ", exception: " + exception.getClass().getName() + ": " + exception.getMessage(), exception);

                // directly throw if exception class and interface class are in the same jar file.
                String serviceFile = ReflectUtils.getCodeBase(invoker.getInterface());
                String exceptionFile = ReflectUtils.getCodeBase(exception.getClass());
                if (serviceFile == null || exceptionFile == null || serviceFile.equals(exceptionFile)) {
                    return;
                }
                // directly throw if it's JDK exception
                String className = exception.getClass().getName();
                if (className.startsWith("java.") || className.startsWith("javax.")) {
                    return;
                }
                // directly throw if it's dubbo exception
                if (exception instanceof RpcException) {
                    return;
                }

                // 自定义异常GlobalException直接返回
                if (exception instanceof GlobalException) {
                    return;
                }
				// 还可以添加其他你想抛出的异常
                // 数据库 重复key异常，直接返回
                if (exception instanceof DuplicateKeyException) {
                    return;
                }

                // otherwise, wrap with RuntimeException and throw back to the client
                appResponse.setException(new RuntimeException(StringUtils.toString(exception)));
            } catch (Throwable e) {
                logger.warn(CONFIG_FILTER_VALIDATION_EXCEPTION, "", "", "Fail to ExceptionFilter when called by " + RpcContext.getServiceContext().getRemoteHost() + ". service: " + invoker.getInterface().getName() + ", method: " + invocation.getMethodName() + ", exception: " + e.getClass().getName() + ": " + e.getMessage(), e);
            }
        }
    }

    @Override
    public void onError(Throwable e, Invoker<?> invoker, Invocation invocation) {
        logger.error(CONFIG_FILTER_VALIDATION_EXCEPTION, "", "", "Got unchecked and undeclared exception which called by " + RpcContext.getServiceContext().getRemoteHost() + ". service: " + invoker.getInterface().getName() + ", method: " + invocation.getMethodName() + ", exception: " + e.getClass().getName() + ": " + e.getMessage(), e);
    }

    // For test purpose
    public void setLogger(ErrorTypeAwareLogger logger) {
        this.logger = logger;
    }
}
```

## 第二步：新建文件

在provider的resources文件夹新建 `/META_INF/dubbo/org.apache.dubbo.rpc.Filter` 文件，内容为：

```
dubboExceptionFilter = com.***.provider.filter.DubboExceptionFilter
```

## 第三步：过滤器配置

在provider的 `applicatio.yml `文件中配置如下内容

```yaml
dubbo:
  provider:
    filter: -exception, dubboExceptionFilter
```

其中 `-exception`代表过滤Dubbo原本的exception方法，否则Dubbo自身默认的 **ExceptionFilter** 任然在工作（一个异常抛出会依次进入两个过滤器；`dubboExceptionFilter` 代表添加自己定义的Filter。

## 第四步：异常处理Handler

在Consumer中编写ExceptionHandler

``` java
package com.***.consumer.exception;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.ghrk.common.exception.GlobalException;
import com.ghrk.common.utils.R;
import org.apache.dubbo.common.utils.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.Set;

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
		R r = new R(); // 自定义统一返回类
		r.put("code", e.getCode());
		r.put("msg", e.getMessage());
		logger.error(e.getMessage(), e);
		return r;
	}
    
    // 还可以添加其他的异常处理Handler，比如：
    // 数据库重复key异常
    @ExceptionHandler(DuplicateKeyException.class)
	public R handleDuplicateKeyException(DuplicateKeyException e){
		logger.error(e.getMessage(), e);
		return R.error("已存在该记录");
	}

	// 运行时异常
	@ExceptionHandler(RuntimeException.class)
	public R handleException(RuntimeException e){
		logger.error(e.getMessage(), e);
		return R.error("运行异常，请重试!");
	}


	@ExceptionHandler(Exception.class)
	public R handleException(Exception e){
		logger.error(e.getMessage(), e);
		return R.error();
	}
}

```

