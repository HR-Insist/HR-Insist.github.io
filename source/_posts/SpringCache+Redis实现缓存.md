---
title: SpringCache+Redis实现缓存
date: 2023-08-16 09:55:16
categories: Java
tags: Java
keywords: Java, SpringBoot, Redis, SpringCache, 缓存
description: 在Springboot项目中使用SpringCache+Redis做缓存
top_img: false
cover: Java/SpringCache+Redis实现缓存/cover.jpg
toc_style_simple:
toc_number: true
---

## 导入Maven依赖

导入 spring-boot-starter-data-redis 和 spring-boot-starter-cache 这两个依赖

```xml
<!--    spring boot 中操作redis-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

## 配置application.yml

```yml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      database: 0
      password: # 如果有密码就配置，没有就不用
      jedis:
        pool:
          max-active: 8
          max-wait: 1ms
          max-idle: 8
          min-idle: 0
  cache:
    redis:
      time-to-live: 1800000ms # 设置缓存过期时间为30分钟
      redis.cache-null-values: true  #是否缓存空值，可以防止缓存穿透
```

## 配置启动类

在启动类上加入**@EnableCaching**注解，开启缓存注解功能

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@Slf4j
@SpringBootApplication
@EnableCaching  // 开启SpringCache缓存
public class Application {

    public static void main(String[] args) {

        SpringApplication.run(Application.class, args);
        log.info("The project run successfully!");

    }
}
```

## 配置Redis序列化器

```java
@Configuration
public class RedisConfig{
    /**
     * 配置redisTemplate针对不同key和value场景下不同序列化的方式
     * @param factory Redis连接工厂
     * @return 序列化器
     */
    @Primary
    @Bean(name = "redisTemplate")
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringRedisSerializer);
        template.setHashKeySerializer(stringRedisSerializer);

        Jackson2JsonRedisSerializer<Object> redisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);
        template.setValueSerializer(redisSerializer);
        template.setHashValueSerializer(redisSerializer);
        template.afterPropertiesSet();
        return template;
    }
}
```

## 操作缓存

在Controller或者serviceImp的方法上加入 @Cacheable、@CacheEvict等注解，进行缓存

| 注解        | 说明         | 使用场景                     |
| :--------- | ------- | :-----------            |
| @Cacheable  | 在方法执行前，spring先查看缓存中是否有数据，如果有数据，则直接返回缓存数据；否则，执行方法并将返回结果放到缓存中 | list等查询方法 |
| @CachePut   | 将方法的返回值放到缓存中                                   | 新增、修改等方法 |
| @CacheEvict | 将一条或多条数据从缓存中删除                                | 删除等方法 |
| @Caching | 可以为一个方法定义提供基于`@Cacheable`、`@CacheEvict`或者`@CachePut`注解的数组 | 同时操作多个缓存 |
| @CacheConfig | 提取这个类下需要操作缓存的注解的公共元素。类似于@RestController | 提取公共元素 |

### @Cacheable

`@Cacheable`指定了被注解方法的返回值是可被缓存的。其工作原理是就是AOP机制，实际上，Spring 首先查找的是缓存，缓存中没有再查询的数据库。

`@Cacheable`：当重复使用相同参数调用方法的时候，方法本身不会被调用执行，即方法本身被略过了，取而代之的是方法的结果直接从缓存中找到并返回了。

| 属性名              | 作用与描述                                                   |
| ------------------- | ------------------------------------------------------------ |
| value  / cacheNames | 指定缓存的名字，缓存使用CacheManager管理多个缓存Cache，这些Cache就是根据该属性进行区分。对缓存的真正增删改查操作在Cache中定义，每个缓存Cache都有自己唯一的名字。 |
| key                 | 缓存数据时的key的值，默认是使用方法所有入参的值。1、可以使用SpEL表达式表示key的值。2、可以使用字符串，3、可以使用方法名 |
| keyGenerator        | 缓存的生成策略（键生成器），和key二选一，作用是生成键值key，keyGenerator可自定义。 |
| cacheManager        | 指定缓存管理器(例如ConcurrentHashMap、Redis等)。             |
| cacheResolver       | 和cacheManager作用一样，使用时二选一。                       |
| condition           | 指定缓存的条件（对参数判断，满足什么条件时才缓存），可用SpEL表达式，例如：方法入参为对象user则表达式可以写为`condition = "#user.age>18"`，表示当入参对象user的属性age大于18才进行缓存。 |
| unless              | 否定缓存的条件（对结果判断，满足什么条件时不缓存），即满足unless指定的条件时，对调用方法获取的结果不进行缓存，例如：`unless = "result==null"`，表示如果结果为null时不缓存。 |
| sync                | 是否使用异步模式进行缓存，默认false。                        |

示例：

```java
@Cacheable(value = "employeeCache", key = "#id", condition = "#id != 0")
public Result getById(@PathVariable Long id){
    Employee employee = employeeService.getById(id);
    return Result.success(employee);
}
```

### CachePut

`@CachePut`的注解属性就比`@Cacheable` 少了一个`sync`，其余都一样。

`@CachePut`：可以确保方法被执行，同时方法的返回值也被记录到缓存中。

```java
@CachePut(value = "employeeCache", key = "#employee.id")
public Result save(@RequestBody Employee employee){
    employeeService.save(employee);
    return Result.success(employee);
}
```

### @CacheEvict

`@CacheEvict`注解负责从给定的缓存中移除一个值。大多数缓存框架都提供了缓存数据的有效期，使用该注解可以显式地从缓存中删除失效的缓存数据。

| 属性名                                                       | 作用与描述                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| cacheNames/value、key、keyGenerator、cacheManager、cacheResolver、condition | 这些和上面一样的属性就不说了。                               |
| allEntries                                                   | 布尔类型的，用来表示是否需要清除这个缓存分区中的的所有元素。默认值为false,表示不需要。 |
| beforeInvocation                                             | 清除操作默认是在对应方法执行成功后触发的（beforeInvocation = false），即方法如果因为抛出异常而未能成功返回时则不会触发清除操作。使用beforeInvocation属性可以改变触发清除操作的时间。当指定该属性值为true时，Spring会在调用该方法之前清除缓存中的指定元素。 |

```java
// 指定删除employeeCache::id 这个缓存
@CacheEvict(value = "employeeCache", key = "#id")
public Result deleteById(@PathVariable Long id){
    employeeService.removeById(id);
    return Result.success();
}

// allEntries=true,此时会删除employeeCache下的所有缓存
@CacheEvict(value = "employeeCache", allEntries = true)
public Result deleteById(@PathVariable Long id){
    employeeService.removeById(id);
    return Result.success();
}
```

### @Caching

总结来说，`@Caching`是一个组注解，可以为一个方法定义提供基于`@Cacheable`、`@CacheEvict`或者`@CachePut`注解的数组。

| 属性名    | 作用与描述                                                   |
| --------- | ------------------------------------------------------------ |
| cacheable | 取值为基于`@Cacheable`注解的数组，定义对方法返回结果进行缓存的多个缓存。 |
| put       | 取值为基于`@CachePut`注解的数组，定义执行方法后，对返回方的方法结果进行更新的多个缓存。 |
| evict     | 取值为基于`@CacheEvict`注解的数组。定义多个移除缓存。        |

你如果使用`@CacheEvict(value = "test",key = "#id")`这条注解，只能清理某一个分区的缓存，test::id下所缓存的数据，你没办法再清理其他分区的缓存。

使用了`@Caching`就可以一次清理多个。

```java
@Caching(evict = {
     @CacheEvict(value = "test",key = "'id1'"),
     @CacheEvict(value = "test",key = "'id2'"),
     @CacheEvict(value = "test",key = "'id3'"),
 })
```

### @CacheConfig

`@CacheConfig`注解属性一览：`cacheNames`、`keyGenerator`、`cacheManager`、`cacheResolver`。注意：没有`value`属性。

提取这个类下的公共缓存属性。例如：提取`cacheNames = "employeeCache"`

```java
@CacheConfig(cacheNames = "employeeCache")
public class EmployeeServiceImpl {

    @CachePut( key = "#employee.id")
    public Result update(@RequestBody Employee employee){
        return Result.success();
    }

    @Cacheable(key = "#id")
    public Result getById(@PathVariable Long id){
        return Result.success();
    }

    @CacheEvict(key = "", allEntries = true)
    public Result deleteById(@PathVariable Long id){
        return Result.success();
    }
}
```

##  注意事项

1. 不建议缓存分页查询的结果
2. `@Cache`注解的方法必须为 `public`
3. 默认情况下，`@CacheEvict`标注的方法执行期间抛出异常，则不会清空缓存。如果需要清空缓存，设置`beforeInvocation = true`
