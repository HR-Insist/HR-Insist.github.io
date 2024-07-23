---
title: 关于SpringBoot
date: 2023-08-04 09:20:38
categories: Java
tags:
  - Java
keywords: Java, SpringBoot
description: 记录一些学习Springboot的知识点
top_img: false
cover: Java/关于SpringBoot/cover.png
toc_style_simple:
toc_number: false
---

{% note info flat %}

本文是学习Springboot时的一些笔记。

面向注解开发！！！

{% endnote %}

## 零、pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.5</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    
    <dependencies>
        <!--web起步依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--mybatis起步依赖-->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.2.2</version>
        </dependency>

        <!--mysql驱动-->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!--springboot单元测试-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!--PageHelper分页插件-->
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper-spring-boot-starter</artifactId>
            <version>1.4.2</version>
        </dependency>

        <!--阿里云OSS-->
        <dependency>
            <groupId>com.aliyun.oss</groupId>
            <artifactId>aliyun-sdk-oss</artifactId>
            <version>3.15.1</version>
        </dependency>
        <dependency>
            <groupId>javax.xml.bind</groupId>
            <artifactId>jaxb-api</artifactId>
            <version>2.3.1</version>
        </dependency>
        <dependency>
            <groupId>javax.activation</groupId>
            <artifactId>activation</artifactId>
            <version>1.1.1</version>
        </dependency>
        <!-- no more than 2.3.3-->
        <dependency>
            <groupId>org.glassfish.jaxb</groupId>
            <artifactId>jaxb-runtime</artifactId>
            <version>2.3.3</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
        </dependency>

        <!--JWT令牌-->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.9.1</version>
        </dependency>

        <!--fastJSON-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.76</version>
        </dependency>

        <!--AOP-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>

    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>

```



## 一、注解

### 1.1 Controller层

```java
@RestController   // 必需；等价于@Controller+@ResponseBody
@Slf4j           // 控制台输出注释，且需在application.yml中配置
@RequiredArgsConstructor  // 自动装配，替代@Autowired 
@RequestMapping("/depts") // web访问路径
```

### 1.2 GET、POST、DELETE、PUT、PATCCH等

```java
@GetMapping("/depts")
@PostMapping
@DeleteMapping("/{deptId}")  // deptId为路径参数
@PutMapping
@PatchMapping
```

### 1.3 Server层

```java
@Service  // 必需；
@RequiredArgsConstructor
```

### 1.4 Mapper层

```java
@Mapper  // 必需；
```

### 1.5 pojo实现类

```java
@Data   // Getter+Setter+toString()
@NoArgsConstructor  // 无参构造
@AllArgsConstructor  // 全参构造
```

## 二、application.yml

```yaml
# Web服务
server:
  port: 8090
# spring的配置
spring:
  datasource:  # 数据库
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/springboot
    username: root
    password: root
  servlet: 
    multipart:
      max-file-size: 1MB # 单个文件上传最大内存
      max-request-size: 10MB  # 单次上传最大内存
# mybatis配置
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl # 控制台输出日志，与@Slf4j配合
    map-underscore-to-camel-case: true # 驼峰与下划线 互转；user_id <=>userId

# 阿里云OSS配置，公共读写情况写才行
aliyun:
  oss:
    endpoint: https://oss-cn-chengdu.aliyuncs.com # 节点地址
    accessKeyId: # 自己的OSS id
    accessKeySecret: # 自己的OSS secret
    bucketName: hrui-zym # bucket名字

#  开启 事务管理 日志
logging:
  level:
    org.springframework.jdbc.support.JdbcTransactionManager: debug

```

## 三、统一返回实现类

在 pojo 包下实现 *Result.class*

```java
package com.herui.springbootcase.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    private Boolean status;
    private String desc;
    private Object data;

    public static Result success(){
        return new Result(true, "successful", null);
    }

    public static Result success(String msg){
        return new Result(true, msg, null);
    }

    public static Result success(String msg, Object data){
        return new Result(true, msg, data);
    }

    public static Result success(Object data){
        return new Result(true, "successful", data);
    }

    public static Result error(String msg){
        return new Result(false, msg, null);
    }
}
```

## 四、跨域请求

### 方法1：过滤器实现跨域

创建 *config* 包，在此包下创建 *CorsConfig.class*

```java
package com.herui.springbootcase.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        // 使用通配符* 允许所有的域请求
        corsConfiguration.addAllowedOrigin("http://localhost:9528/");
        // 使用通配符* 允许所有请求头字段
        corsConfiguration.addAllowedHeader("*");
        // 使用通配符* 允许所有请求头方法类型
        corsConfiguration.addAllowedMethod("*");
        //加上了这一句，大致意思是可以携带 cookie
        //最终的结果是可以 在跨域请求的时候获取同一个 session
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 处理请求映射, 配置 可以访问的地址
        source.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(source);
    }
}
```

### **方法2：局部跨域**

Controller层在需要跨域的类或者方法上加上**@CrossOrigin**该注解即可。

```java
@CrossOrigin(origins = {"/*"},maxAge = 3600) // 可以指定多个路径
@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/depts")
public class DeptController {

    private final DeptService deptService;

    @GetMapping
    public Result getDeptList(){
        log.info("查询全部的部门数据");
        List<Dept> deptList = deptService.getDeptList();
        return Result.success(deptList);
    }
}
```

## 五、登录拦截

只有携带token的用户才能访问资源

### 方法1：JWT令牌+过滤器

注解：@WebFilter(urlPatterns = {"/*"})

```java
package com.herui.springbootcase.filter;

import com.alibaba.fastjson.JSONObject;
import com.herui.springbootcase.pojo.Result;
import com.herui.springbootcase.utils.JwtUtils;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.io.IOException;

@Slf4j
@WebFilter(urlPatterns = {"/*"})
public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;  // 强转
        String url = request.getRequestURL().toString(); // 获取请求URL地址
        log.info("请求的URL：{}", url);

        // 判断是否是登录请求，
        // 如果是登录请求，就不拦截；否则就拦截并判断token
        if(url.contains("login")){
            filterChain.doFilter(servletRequest,servletResponse);
        }else {
            String token = request.getHeader("token");
            if( !StringUtils.hasLength(token)){
                log.info("请求头的token为空，用户未登录");
                Result error = Result.error("NOT_LOGIN");
                String notLogin = JSONObject.toJSONString(error);
                servletResponse.getWriter().write(notLogin);
            }
            else {
                try {
                    JwtUtils.parseJWT(token);
                    log.info("令牌合法");
                    filterChain.doFilter(servletRequest,servletResponse);
                } catch (Exception e) {
                    e.printStackTrace();
                    log.info("解析令牌失败，返回未登录错误信息!");
                    Result error = Result.error("NOT_LOGIN");
                    String notLogin = JSONObject.toJSONString(error);
                    servletResponse.getWriter().write(notLogin);
                }
            }
        }
    }
}
```

[JWT令牌](https://jwt.io/) 的生成与解析

```java
package com.herui.springbootcase.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.Map;

public class JwtUtils {

    private static final String signKey = "cmVnZ2llX3Rha2VvdXRfdG9rZW5faGVydWlfand0X3NlY3JldGtleQ==";// Base64编码
    private static final Long expire = 30000L;

    /**
     * 生成自定义 Key
     * @return 密钥
     */
    private static SecretKey generateKeyByDecoders() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(signKey));
    }

    /**
     * 生成JWT令牌
     * @param claims JWT第二部分负载 payload 中存储的内容
     * @return jwt令牌
     */
    public static String generateJwt(Map<String, Object> claims){

        return Jwts.builder()
                .addClaims(claims)
                .signWith(generateKeyByDecoders())
                .setExpiration(new Date(System.currentTimeMillis() + expire))
                .compact();
    }

    /**
     * 解析JWT令牌
     * @param jwt JWT令牌
     * @return JWT第二部分负载 payload 中存储的内容
     */
    public static Claims parseJWT(String jwt){
        return Jwts.parserBuilder()
                .setSigningKey(generateKeyByDecoders())
                .build()
                .parseClaimsJws(jwt)
                .getBody();
    }
}

```

**在Application.java 启动类中添加@ServletComponentScan**

```java
@ServletComponentScan
@SpringBootApplication
public class SpringbootCaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootCaseApplication.class, args);
    }

}
```

### 方法2： JWT令牌+Interceptor（拦截器）

**编写拦截器**

```java
package com.herui.springbootcase.interceptor;

import com.alibaba.fastjson.JSONObject;
import com.herui.springbootcase.pojo.Result;
import com.herui.springbootcase.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
@Slf4j
public class AuthInterceptor implements HandlerInterceptor {
    @Override  //目标资源方法运行前运行，返回true：继续执行；false：不放行
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("preHandle......");
        String url = request.getRequestURL().toString();
        log.info("请求的URL：{}", url);

        String token = request.getHeader("token");
        if( !StringUtils.hasLength(token)){
            log.info("请求头的token为空，用户未登录");
            Result error = Result.error("NOT_LOGIN");
            String notLogin = JSONObject.toJSONString(error);
            response.getWriter().write(notLogin);
            return false;
        }
        else {
            try {
                JwtUtils.parseJWT(token);
                log.info("令牌合法");
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                log.info("解析令牌失败，返回未登录错误信息!");
                Result error = Result.error("NOT_LOGIN");
                String notLogin = JSONObject.toJSONString(error);
                response.getWriter().write(notLogin);
                return false;
            }
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("postHandle......");;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("afterCompletion......");;
    }
}

```

**注册拦截器**

```java
package com.herui.springbootcase.config;

import com.herui.springbootcase.interceptor.AuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration  // 配置类
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor).addPathPatterns("/**").excludePathPatterns("/login");  // login不拦截
    }
}
```

**在Application.java 启动类中添加@ServletComponentScan**

```java
@ServletComponentScan
@SpringBootApplication
public class SpringbootCaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootCaseApplication.class, args);
    }

}
```

## 六、全局异常处理类

注解：@RestControllerAdvice

```java
package com.herui.springbootcase.exception;

import com.herui.springbootcase.pojo.Result;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 */
@RestControllerAdvice  // 异常处理注解 等价于：@ControllerAdvice+@ResponseBody
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)  // 捕获所有异常
    public Result ex(Exception exception){
        exception.printStackTrace();
        return Result.error("对不起，操作失败，请联系管理员!");
    }
}

```

## 七、事务回滚

注解：@Transactional(rollbackFor = Exception.class)

业务要求：删除部门的时候，把部门下的员工也一起删除。

实现方法：使用逻辑外键

异常情况：删除了部门，但是此时出现异常，导致该部门下的员工没有删除。出现数据不一致的情况。

在service实现类中，业务代码如下：

```java
@Override
@Transactional(rollbackFor = Exception.class)  // 开启事务回滚；处理所有异常；默认是RuntimeException.class
public void deleteDeptById(Integer deptId) {
    Log log = new Log();
    log.setCreateTime(LocalDateTime.now());
    try {
        deptMapper.deleteDeptById(deptId);
        empMapper.deleteEmpByDeptId(deptId);
    } catch (Exception e) {
        e.printStackTrace();
        log.setDesc("执行解散ID为: "+deptId+" 的部门操作!失败!");
        throw e; // ！！必须在catch中再次抛出异常
    } finally {
        if(log.getDesc().length() == 0){
            log.setDesc("执行解散ID为: "+deptId+" 的部门操作!成功!");
        }
        logService.insertLog(log);  // 向数据库中写入本次操作的日志
    }
}
```

！！！**注意：**如果异常被try｛｝catch｛｝了，事务就不回滚了，如果想让事务回滚必须再往外抛try｛｝catch｛throw Exception｝。因为一旦你try｛｝catch｛｝了。系统会认为你已经手动处理了异常，就不会进行回滚操作。

**添加新的事务**

```java
@Override
@Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRES_NEW) 
// propagation，这个属性是用来配置事务的传播行为的。
// REQUIRED: 【默认值】需要事务，有则加入，无则创建新事务
// REQUIRES_NEW: 需要新事务，无论有无，总是创建新事务
public void insertLog(Log log) {
    logMapper.insertLog(log);
}
```

## 八、阿里云OSS文件上传

在阿里云OSS对象存储服务中创建对应的bucket。并且引入相关依赖。

属性类: *AliOSSProperties.java*

```java
package com.herui.springbootcase.utils;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "aliyun.oss") // 在application.yml文件中配置aliyun.oss的下面四个属性
public class AliOSSProperties {

    private String endpoint;
    private String accessKeyId;
    private String accessKeySecret;
    private String bucketName;

}
```

文件上传实现类：*AliOSSUtils.java*

```java
package com.herui.springbootcase.utils;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.util.UUID;

/**
 * 阿里云 OSS 工具类
 */
@Data
@Component
@RequiredArgsConstructor
public class AliOSSUtils {

    private final AliOSSProperties aliOSSProperties;

    /**
     * 实现上传图片到OSS
     */
    public String upload(MultipartFile file) throws IOException {
        String endpoint = aliOSSProperties.getEndpoint();
        String accessKeyId = aliOSSProperties.getAccessKeyId();
        String bucketName = aliOSSProperties.getBucketName();
        String accessKeySecret = aliOSSProperties.getAccessKeySecret();

        // 获取上传的文件的输入流
        InputStream inputStream = file.getInputStream();

        // 避免文件覆盖
        String originalFilename = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + originalFilename.substring(originalFilename.lastIndexOf("."));

        //上传文件到 OSS
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        ossClient.putObject(bucketName, fileName, inputStream);

        //文件访问路径
        String url = endpoint.split("//")[0] + "//" + bucketName + "." + endpoint.split("//")[1] + "/" + fileName;
        // 关闭ossClient
        ossClient.shutdown();
        return url;// 把上传到oss的路径返回
    }

}
```

使用类：*UploadController.java*

 ```java
 package com.herui.springbootcase.controller;
 
 import com.herui.springbootcase.pojo.Result;
 import com.herui.springbootcase.utils.AliOSSUtils;
 import lombok.RequiredArgsConstructor;
 import lombok.extern.slf4j.Slf4j;
 import org.springframework.web.bind.annotation.*;
 import org.springframework.web.multipart.MultipartFile;
 
 import java.io.IOException;
 
 @RestController
 @Slf4j
 @RequiredArgsConstructor
 public class UploadController {
 
     private final AliOSSUtils aliOSSUtils;
 
     @PostMapping("/upload")
     public Result uploadFile(MultipartFile image) throws IOException {
         log.info("文件上传， 文件名: {}", image.getOriginalFilename());
         String url = aliOSSUtils.upload(image);
         log.info("文件上传成功，访问路径: {}", url);
         return Result.success("file upload successfully", url);
     }
 }
 ```

## 九、分页查询

业务要求：根据（姓名、性别、入职时间）(以上三个可以没有)查询员工信息，并分页展示

pojo 实体类: *PageBean.class*

```java
package com.herui.springbootcase.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 分页查询结果的封装类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageBean {

    private Long total; // 总记录数
    private List<Emp> rows;  // 数据

}
```

Controller:

```java
@GetMapping
public Result getEmpListByPage(String name, Short gender,
                               @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate begin,
                               @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate end,
                               @RequestParam(defaultValue = "1") Integer pageNumber,
                               @RequestParam(defaultValue = "5") Integer pageSize){
    log.info("分页查询，参数: {}, {}, {}, {}, {}, {}",name, gender, begin, end, pageNumber, pageSize);
    PageBean empListByPage = empService.getEmpListByPage(name, gender, begin, end, pageNumber, pageSize);
    return Result.success("select successfully!", empListByPage);
}
```

service：

```java
@Override
public PageBean getEmpListByPage(String name, Short gender, LocalDate begin, LocalDate end, Integer pageNumber, Integer pageSize) {
    PageHelper.startPage(pageNumber, pageSize);
    List<Emp> empList = empMapper.getEmpList(name, gender, begin, end);
    Page<Emp> page = (Page<Emp>) empList;
    return new PageBean(page.getTotal(), page.getResult());
}
```



Mapper

```java
/**
 * 查询员工总记录数
 */
@Select("select count(*) from sb_emp;")
public Integer getCount();

/**
 * 查询员工列表
 * @return
 */
public List<Emp> getEmpList(String name, Short gender, LocalDate begin, LocalDate end);

```

mapper.xml

```xml
<select id="getEmpList" resultType="com.herui.springbootcase.pojo.Emp">
    select * from sb_emp
    <where>
        <if test="name != null and name != ''">
            <!--避免sql注入，所以建议不使用${}；推荐使用#{},再用concat连接字符串-->
            emp_name like concat('%', #{name}, '%')
        </if>
        <if test="gender != null and gender != ''">
            and emp_gender = #{gender}
        </if>
        <if test="begin != null and end != null">
            and emp_entryDate between #{begin} and #{end}
        </if>
    </where>
    order by update_time desc
</select>
```

## 十、AOP（面向切面编程）

> AOP的作用：在程序运行期间在不修改源代码的基础上对已有方法进行增强（无侵入性: 解耦）

**注解：**

@Compoent  ：注册为spring组件

@Aspect  ：注册切面类

@Order(number) : 【可选】执行顺序；对于@Before，数字越小越先执行；对于@After，数字越小越后执行

**导入依赖：**

pom.xml

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

Spring中AOP的通知类型：

- @Around：环绕通知，此注解标注的通知方法在目标方法前、后都被执行【**重点掌握**】
- @Before：前置通知，此注解标注的通知方法在目标方法前被执行
- @After ：后置通知，此注解标注的通知方法在目标方法后被执行，无论是否有异常都会执行
- @AfterReturning ： 返回后通知，此注解标注的通知方法在目标方法后被执行，有异常不会执行
- @AfterThrowing ： 异常后通知，此注解标注的通知方法发生异常后执行

**切入点表达式**

### 1、execution

```
execution(访问修饰符?  返回值  包名.类名.?方法名(方法参数) throws 异常?)
```

示例：

```java
@Before("execution(void com.itheima.service.impl.DeptServiceImpl.delete(java.lang.Integer))")

execution(* com.itheima.service.impl.DeptServiceImpl.delete(*))
    
execution(* com..*.*(..))
```

```java
@Slf4j
@Component
@Aspect
public class MyAspect7 {
	// 切入点；定义后在后面的通知中就可以直接使用
    @Pointcut("@annotation(com.itheima.anno.MyLog)")
    private void pt(){}
   
    //前置通知
    @Before("pt()")  // 使用了切入点方法
    public void before(JoinPoint joinPoint){
        log.info(joinPoint.getSignature().getName() + " MyAspect7 -> before ...");
    }
    
    //后置通知
    @Before("pt()")
    public void after(JoinPoint joinPoint){
        log.info(joinPoint.getSignature().getName() + " MyAspect7 -> after ...");
    }

    //环绕通知
    @Around("pt()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        //获取目标类名
        String name = pjp.getTarget().getClass().getName();
        log.info("目标类名：{}",name);

        //目标方法名
        String methodName = pjp.getSignature().getName();
        log.info("目标方法名：{}",methodName);

        //获取方法执行时需要的参数
        Object[] args = pjp.getArgs();
        log.info("目标方法参数：{}", Arrays.toString(args));

        //执行原始方法
        Object returnValue = pjp.proceed();

        return returnValue;
    }
}
```

###  2、annotation

**自定义注解**：MyLog

~~~java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyLog {
}
~~~

在业务类要做为连接点的方法上添加自定义注解

**业务类**：DeptServiceImpl

```java
@Service
public class DeptServiceImpl implements DeptService {
    @Autowired
    private DeptMapper deptMapper;

    @Override
    @MyLog //自定义注解（表示：当前方法属于目标方法）
    public List<Dept> list() {
        List<Dept> deptList = deptMapper.list();
        //模拟异常
        //int num = 10/0;
        return deptList;
    }
}
```

**切面类**：LogAspect

```java
@Component  // 【必需】
@Aspect  // 【必需】
public class MyAspect6 {
    
    //针对list方法、delete方法进行前置通知和后置通知

    //前置通知
    @Before("@annotation(com.itheima.anno.MyLog)")
    public void before(){
        log.info("MyAspect6 -> before ...");
    }

    //后置通知
    @After("@annotation(com.itheima.anno.MyLog)")
    public void after(){
        log.info("MyAspect6 -> after ...");
    }
}
```

















