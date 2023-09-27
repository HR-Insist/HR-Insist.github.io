---
title: 解决Postgres-xl集群update not supported
date: 2023-08-29 18:01:55
categories: SQL
tags: SQL
keywords: postgres-xl, update not supported
description: 解决PostgreSql-xl集群update not supported
top_img:
cover: SQL/Postgres-xl集群update-not-supported/index.jpg
toc_style_simple: 
toc_number: true
---

## 项目背景

在分布式项目中，服务端数据库使用Postgres-xl集群，本地开发数据库使用的是Postgresql。

部署项目到服务器上时，使用 Postgres-XL后发现有些功能出现问题，比如用户编辑保存失败（数据库执行 update 操作）。

## 错误提示

Caused by: org.postgresql.util.PSQLException: ERROR: could not plan this distributed delete

详细：correlated UPDATE or updating distribution column currently not supported in Postgres-XL.

## 可能原因

postgres-xl的分布式限制导致，一般是分片表引起，pg-xl默认建表是hash建表。

## 解决方案

方案：将表的分片模式改为复制模式：

```sql
ALTER TABLE 表名 distribute BY REPLICATION;
```

参考地址：https://blog.csdn.net/wangnan1117/article/details/127439323
