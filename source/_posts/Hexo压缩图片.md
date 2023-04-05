---
title: Hexo+Gulp压缩图片
date: 2022-09-13 21:36:17
tags: Hexo
categories: Hexo
keywords: Hexo,压缩图片,gulp
description: 使用gulp压缩图片等静态资源，加快博客访问速度
top_img: 
cover: /Hexo/Hexo压缩图片/Hexo-Gulp.jpg
---

## 概述

由于博客使用的插件较多，文章内包含的图片越多越大，会影响到博客的加载速度，影响访问效果。本博客是基于Github上进行访问的，为此开始从资源文件大小上进行优化，了解到可以使用Gulp对博客的js、css、img、html等静态资源文件进行压缩，从而加速对博客的访问。

## 安装 gulp

```shell
npm install gulp -g
npm install gulp-minify-css gulp-uglify gulp-htmlmin gulp-htmlclean gulp-imagemin@7.1.0 --save
# 在安装过程中，高版本的gulp-imagemin在使用过程中出错了，所以降版本安装7.1.0的
```

## 创建gulpfile.js文件

在`Hexo`根目录下新建`gulpfile.js`文件，内容如下：

``` javascript
// 引入需要的模块
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');

// 压缩public目录下所有html文件, minify-html是任务名, 设置为default，启动gulp压缩的时候可以省去任务名
gulp.task('minify-html', function () {
    return gulp.src('./public/**/*.html') // 压缩文件所在的目录
        .pipe(htmlclean())
        .pipe(htmlmin({
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        }))
        .pipe(gulp.dest('./public')) // 输出的目录
});

// 压缩css
gulp.task('minify-css', function () {
    return gulp.src(['./public/**/*.css', '!./public/js/**/*min.css'])
        .pipe(minifycss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('./public'));
});
// 压缩js
gulp.task('minify-js', function () {
    return gulp.src(['./public/**/.js', '!./public/js/**/*min.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
});
// 压缩图片
gulp.task('minify-images', function () {
    return gulp.src(['./public/**/*.png', './public/**/*.PNG',
        './public/**/*.jpg', './public/**/*.JPG',
        './public/**/*.jpeg', './public/**/*.JPEG',
        './public/**/*.gif', './public/**/*.GIF'])
        .pipe(imagemin(
            [imagemin.gifsicle({ 'optimizationLevel': 3 }),
            imagemin.mozjpeg({ 'progressive': true }),
            imagemin.optipng({ 'optimizationLevel': 5 }),
            imagemin.svgo()],
            { 'verbose': true }))
        .pipe(gulp.dest('./public'))
});

// gulp 4.0 适用的方式
gulp.task('default', gulp.parallel('minify-html', 'minify-css', 'minify-js', 'minify-images'
), function () {
    console.log("----------gulp Finished----------");
});
```

## 压缩指令

``` shell
hexo clean	// 清除public文件夹（缓存）
hexo generate	// 生成博客
gulp	// 执行压缩
hexo deploy		// 若压缩完成无错误，就可以发布了
```

## 效果

执行`gulp`命令后，正确的效果如下：

```shell
[21:34:06] Using gulpfile D:\Tools\Hexo\gulpfile.js
[21:34:06] Starting 'default'...
[21:34:06] Starting 'minify-html'...
[21:34:06] Starting 'minify-css'...
[21:34:06] Starting 'minify-js'...
[21:34:06] Starting 'minify-images'...
[21:34:06] Finished 'minify-js' after 322 ms
[21:34:06] Finished 'minify-css' after 743 ms
[21:34:06] gulp-imagemin: ✔ img\favicon.png (already optimized)
[21:34:07] Finished 'minify-html' after 1.01 s
[21:34:07] gulp-imagemin: ✔ Hexo\Hexo博客部署\在_config.yml配置deploy.png (saved 45 kB - 81.1%)
[21:34:08] gulp-imagemin: ✔ photos\honey\6.png (saved 25 kB - 10.6%)
[21:34:08] gulp-imagemin: ✔ photos\honey\7.png (saved 29.4 kB - 9.8%)
[21:34:08] gulp-imagemin: ✔ photos\honey\8.png (saved 20.3 kB - 10.2%)
[21:34:08] gulp-imagemin: ✔ img\404.jpg (saved 5.04 kB - 30.7%)
[21:34:08] gulp-imagemin: ✔ photos\honey\9.png (saved 38.3 kB - 9.7%)
[21:34:08] gulp-imagemin: ✔ img\avatar.jpg (saved 28.8 kB - 58.6%)
[21:34:08] gulp-imagemin: ✔ images\category_img.jpg (saved 1.43 MB - 82.6%)
[21:34:08] gulp-imagemin: ✔ Git\Git安装\ssh-t.jpg (already optimized)
[21:34:08] gulp-imagemin: ✔ images\log_img.jpg (saved 964 kB - 82%)
[21:34:08] gulp-imagemin: ✔ img\friend_404.gif (saved 15.6 kB - 23.9%)
[21:34:40] gulp-imagemin: Minified 27 images (saved 10.4 MB - 58.7%)
[21:34:40] Finished 'minify-images' after 34 s
[21:34:40] Finished 'default' after 34 s
```

