---
title: Hexo+butterfly主题的外挂标签
date: 2022-09-15 11:33:28
categories: Hexo
tags:
  - Hexo
  - Butterfly
keywords: "Hexo, Butterfly, Tag Plugins Plus"
description: 本文记录使用butterfly主题时的标签外挂
top_img:
cover:
toc_style_simple: false
password: ""
---

## Page Front-matter

| 写法                  | 解释                                                         |
| --------------------- | ------------------------------------------------------------ |
| title                 | 【必需】文章标题                                             |
| date                  | 【必需】文章创建日期                                         |
| updated               | 【可选】文章更新日期                                         |
| tags                  | 【可选】文章标籤                                             |
| categories            | 【可选】文章分类                                             |
| keywords              | 【可选】文章关键字                                           |
| description           | 【可选】文章描述                                             |
| top_img               | 【可选】文章顶部图片                                         |
| cover                 | 【可选】文章缩略图(如果没有设置top_img,文章页顶部将显示缩略图，可设为false/图片地址/留空) |
| comments              | 【可选】显示文章评论模块(默认 true)                          |
| toc                   | 【可选】显示文章TOC(默认为设置中toc的enable配置)             |
| toc_number            | 【可选】显示toc_number(默认为设置中toc的number配置)          |
| copyright             | 【可选】显示文章版权模块(默认为设置中post_copyright的enable配置) |
| copyright_author      | 【可选】文章版权模块的`文章作者`                             |
| copyright_author_href | 【可选】文章版权模块的`文章作者`链接                         |
| copyright_url         | 【可选】文章版权模块的`文章连结`链接                         |
| copyright_info        | 【可选】文章版权模块的`版权声明`文字                         |
| mathjax               | 【可选】显示 mathjax (当设置 mathjax 的 per_page: false时，才需要配置，默认 false) |
| katex                 | 【可选】显示 katex (当设置 katex 的 per_page: false 时，才需要配置，默认 false) |
| aplayer               | 【可选】在需要的页面加载 aplayer 的 js 和 css                |
| highlight_shrink      | 【可选】配置代码框是否展开(true/false)(默认为设置中highlight_shrink的配置) |
| aside                 | 【可选】显示侧边栏 (默认 true)                               |

## 分栏 tab

{% tabs  Columns %}
<!-- tab 标签语法 -->

```markdown
{% tabs Unique name, [index] %}
<!-- tab [Tab caption] [@icon] -->
Any content (support inline tags too).
<!-- endtab -->
<!-- tab [Tab caption] [@icon] -->
Any content (support inline tags too).
<!-- endtab -->
{% endtabs %}
```

<!-- endtab -->

<!-- tab 配置参数 -->

1. Unique name :
   - 选项卡块标签的唯一名称，不带逗号。
   - 将在#id中用作每个标签及其索引号的前缀。
   - 如果名称中包含空格，则对于生成#id，所有空格将由破折号代替。
   - 仅当前帖子/页面的URL必须是唯一的！
2. [index]:
   - 活动选项卡的索引号。
   - 如果未指定，将选择第一个标签（1）。
   - 如果index为-1，则不会选择任何选项卡。
   - 可选参数。
3. [Tab caption]:
   - 当前选项卡的标题。
   - 如果未指定标题，则带有制表符索引后缀的唯一名称将用作制表符的标题。
   - 如果未指定标题，但指定了图标，则标题将为空。
   - 可选参数。
4. [@icon]:
   - FontAwesome图标名称（全名，看起来像“ fas fa-font”）
   - 可以指定带空格或不带空格；
   - 例如’Tab caption @icon’ 和 ‘Tab caption@icon’.
   - 可选参数。

<!-- endtab -->

<!-- tab 样式预览 -->

{% note simple %}
Demo  - 自定义 Tab 名 + 只有 icon + icon 和 Tab 名
{% endnote %}

{% tabs test4 %}
<!-- tab 第一个Tab -->
**tab名字为第一个Tab**
<!-- endtab -->

<!-- tab @fab fa-apple-pay -->
**只有图标 没有Tab名字**
<!-- endtab -->

<!-- tab 炸弹@fas fa-bomb -->
**名字+icon**
<!-- endtab -->
{% endtabs %}

<!-- endtab -->

<!-- tab 示例代码 -->

```markdown
{% tabs test4 %}
<!-- tab 第一个Tab -->
**tab名字为第一个Tab**
<!-- endtab -->

<!-- tab @fab fa-apple-pay -->
**只有图标 没有Tab名字**
<!-- endtab -->

<!-- tab 炸弹@fas fa-bomb -->
**名字+icon**
<!-- endtab -->
{% endtabs %}
```

<!-- endtab -->

{% endtabs %}



## 标签外挂

标签外挂是 Hexo 独有的功能，并不是标准的 Markdown 格式。

以下的写法，只适用于Butterfly主题，用在其它主题上不会有效果，甚至可能会报错。

### Note

{% tabs Note %}
<!-- tab simple -->

```
{% note simple %}
默认 提示块标签
{% endnote %}

{% note default simple %}
default 提示块标签
{% endnote %}

{% note primary simple %}
primary 提示块标签
{% endnote %}

{% note success simple %}
success 提示块标签
{% endnote %}

{% note info simple %}
info 提示块标签
{% endnote %}

{% note warning simple %}
warning 提示块标签
{% endnote %}

{% note danger simple %}
danger 提示块标签
{% endnote %}
```

{% note simple %}
默认 提示块标签
{% endnote %}

{% note default simple %}
default 提示块标签
{% endnote %}

{% note primary simple %}
primary 提示块标签
{% endnote %}

{% note success simple %}
success 提示块标签
{% endnote %}

{% note info simple %}
info 提示块标签
{% endnote %}

{% note warning simple %}
warning 提示块标签
{% endnote %}

{% note danger simple %}
danger 提示块标签
{% endnote %}

<!-- endtab -->

<!-- tab modern-->

```markdown
{% note modern %}
默认 提示块标签
{% endnote %}

{% note default modern %}
default 提示块标签
{% endnote %}

{% note primary modern %}
primary 提示块标签
{% endnote %}

{% note success modern %}
success 提示块标签
{% endnote %}

{% note info modern %}
info 提示块标签
{% endnote %}

{% note warning modern %}
warning 提示块标签
{% endnote %}

{% note danger modern %}
danger 提示块标签
{% endnote %}
```

{% note modern %}
默认 提示块标签
{% endnote %}

{% note default modern %}
default 提示块标签
{% endnote %}

{% note primary modern %}
primary 提示块标签
{% endnote %}

{% note success modern %}
success 提示块标签
{% endnote %}

{% note info modern %}
info 提示块标签
{% endnote %}

{% note warning modern %}
warning 提示块标签
{% endnote %}

{% note danger modern %}
danger 提示块标签
{% endnote %}

<!-- endtab -->

<!-- tab flat-->

```markdown
{% note flat %}
默认 提示块标签
{% endnote %}

{% note default flat %}
default 提示块标签
{% endnote %}

{% note primary flat %}
primary 提示块标签
{% endnote %}

{% note success flat %}
success 提示块标签
{% endnote %}

{% note info flat %}
info 提示块标签
{% endnote %}

{% note warning flat %}
warning 提示块标签
{% endnote %}

{% note danger flat %}
danger 提示块标签
{% endnote %}
```

{% note flat %}
默认 提示块标签
{% endnote %}

{% note default flat %}
default 提示块标签
{% endnote %}

{% note primary flat %}
primary 提示块标签
{% endnote %}

{% note success flat %}
success 提示块标签
{% endnote %}

{% note info flat %}
info 提示块标签
{% endnote %}

{% note warning flat %}
warning 提示块标签
{% endnote %}

{% note danger flat %}
danger 提示块标签
{% endnote %}

<!-- endtab -->

<!-- tab disable -->

```markdown
{% note disabled %}
默认 提示块标签
{% endnote %}

{% note default disabled %}
default 提示块标签
{% endnote %}

{% note primary disabled %}
primary 提示块标签
{% endnote %}

{% note success disabled %}
success 提示块标签
{% endnote %}

{% note info disabled %}
info 提示块标签
{% endnote %}

{% note warning disabled %}
warning 提示块标签
{% endnote %}

{% note danger disabled %}
danger 提示块标签
{% endnote %}
```

{% note disabled %}
默认 提示块标签
{% endnote %}

{% note default disabled %}
default 提示块标签
{% endnote %}

{% note primary disabled %}
primary 提示块标签
{% endnote %}

{% note success disabled %}
success 提示块标签
{% endnote %}

{% note info disabled %}
info 提示块标签
{% endnote %}

{% note warning disabled %}
warning 提示块标签
{% endnote %}

{% note danger disabled %}
danger 提示块标签
{% endnote %}

<!-- endtab -->

<!-- tab no-icon-->

```markdown
{% note no-icon %}
默认 提示块标签
{% endnote %}

{% note default no-icon %}
default 提示块标签
{% endnote %}

{% note primary no-icon %}
primary 提示块标签
{% endnote %}

{% note success no-icon %}
success 提示块标签
{% endnote %}

{% note info no-icon %}
info 提示块标签
{% endnote %}

{% note warning no-icon %}
warning 提示块标签
{% endnote %}

{% note danger no-icon %}
danger 提示块标签
{% endnote %}
```

{% note no-icon %}
默认 提示块标签
{% endnote %}

{% note default no-icon %}
default 提示块标签
{% endnote %}

{% note primary no-icon %}
primary 提示块标签
{% endnote %}

{% note success no-icon %}
success 提示块标签
{% endnote %}

{% note info no-icon %}
info 提示块标签
{% endnote %}

{% note warning no-icon %}
warning 提示块标签
{% endnote %}

{% note danger no-icon %}
danger 提示块标签
{% endnote %}

<!-- endtab -->

{% endtabs %}

### 自定义icon的Note

{% tabs Note %}
<!-- tab icon-simple -->

```markdown
{% note 'fab fa-cc-visa' simple %}
你是刷 Visa 还是是 UnionPay
{% endnote %}
{% note red 'fas fa-bullhorn' simple %}
2021年快到了....
{% endnote %}
{% note pink 'fas fa-car-crash' simple %}
小心开车 安全至上
{% endnote %}
```

{% note 'fab fa-cc-visa' simple %}
你是刷 Visa 还是是 UnionPay
{% endnote %}
{% note red 'fas fa-bullhorn' simple %}
2021年快到了....
{% endnote %}
{% note pink 'fas fa-car-crash' simple %}
小心开车 安全至上
{% endnote %}

<!-- endtab -->

<!-- tab icon-modern -->

```markdown
{% note 'fab fa-cc-visa' modern %}
你是刷 Visa 还是是 UnionPay
{% endnote %}
{% note red 'fas fa-bullhorn' modern %}
2021年快到了....
{% endnote %}
{% note pink 'fas fa-car-crash' modern %}
小心开车 安全至上
{% endnote %}
```

{% note 'fab fa-cc-visa' modern %}
你是刷 Visa 还是是 UnionPay
{% endnote %}
{% note red 'fas fa-bullhorn' modern %}
2021年快到了....
{% endnote %}
{% note pink 'fas fa-car-crash' modern %}
小心开车 安全至上
{% endnote %}

<!-- endtab -->

<!-- tab icon-flat -->

```markdown
{% note green 'fas fa-fan' flat%}
这是三片呢？还是四片？
{% endnote %}
{% note orange 'fas fa-battery-half' flat %}
该充电了哦！
{% endnote %}
{% note purple 'far fa-hand-scissors' flat %}
剪刀石头布
{% endnote %}
```

{% note green 'fas fa-fan' flat%}
这是三片呢？还是四片？
{% endnote %}
{% note orange 'fas fa-battery-half' flat %}
该充电了哦！
{% endnote %}
{% note purple 'far fa-hand-scissors' flat %}
剪刀石头布
{% endnote %}

<!-- endtab -->

<!-- tab icon-disable -->

```markdown
{% note orange 'fas fa-battery-half' disabled  %}
该充电了哦！
{% endnote %}
{% note purple 'far fa-hand-scissors' disabled  %}
剪刀石头布
{% endnote %}
{% note blue 'fab fa-internet-explorer' disabled  %}
前端最讨厌的浏览器
{% endnote %}
```

{% note orange 'fas fa-battery-half' disabled  %}
该充电了哦！
{% endnote %}
{% note purple 'far fa-hand-scissors' disabled  %}
剪刀石头布
{% endnote %}
{% note blue 'fab fa-internet-explorer' disabled  %}
前端最讨厌的浏览器
{% endnote %}

<!-- endtab -->

<!-- tab icon-no-icons -->

``` markdown
{% note blue no-icon %}
2021年快到了....
{% endnote %}
{% note pink no-icon %}
小心开车 安全至上
{% endnote %}
{% note red no-icon %}
这是三片呢？还是四片？
{% endnote %}
```

{% note blue no-icon %}
2021年快到了....
{% endnote %}
{% note pink no-icon %}
小心开车 安全至上
{% endnote %}
{% note red no-icon %}
这是三片呢？还是四片？
{% endnote %}

<!-- endtab -->

{% endtabs %}

### Gallery相册图库

一个图库集合。新建一个page页：

``` shell
hexo n page "gallery"
# "gallery" 是想要新建的page页名称
```

{% tabs Note %}
<!-- tab 标签语法 -->

``` html
# 在新建的page页文件夹下的index.md文件中写:
<div class="gallery-group-main">
{% galleryGroup name description link img-url %}
{% galleryGroup name description link img-url %}
{% galleryGroup name description link img-url %}
</div>
```

- name：图库名字
- description：图库描述
- link：连接到对应相册的地址
- img-url：图库封面的地址

<!-- endtab -->

<!-- tab 样式预览 -->

<div class="gallery-group-main">
{% galleryGroup '壁纸' '收藏的一些壁纸' '/Gallery/wallpaper' https://i.loli.net/2019/11/10/T7Mu8Aod3egmC4Q.png %}
{% galleryGroup '漫威' '关于漫威的图片' '/Gallery/marvel' https://i.loli.net/2019/12/25/8t97aVlp4hgyBGu.jpg %}
{% galleryGroup 'OH MY GIRL' '关于OH MY GIRL的图片' '/Gallery/ohmygirl' https://i.loli.net/2019/12/25/hOqbQ3BIwa6KWpo.jpg %}
</div>
<!-- endtab -->

<!-- tab 示例源码 -->

``` html
<div class="gallery-group-main">
{% galleryGroup '壁纸' '收藏的一些壁纸' '/Gallery/wallpaper' https://i.loli.net/2019/11/10/T7Mu8Aod3egmC4Q.png %}
{% galleryGroup '漫威' '关于漫威的图片' '/Gallery/marvel' https://i.loli.net/2019/12/25/8t97aVlp4hgyBGu.jpg %}
{% galleryGroup 'OH MY GIRL' '关于OH MY GIRL的图片' '/Gallery/ohmygirl' https://i.loli.net/2019/12/25/hOqbQ3BIwa6KWpo.jpg %}
</div>
```

<!-- endtab -->

{% endtabs %}

### Gallery相册

相册是图库中的一个小图库。新建该相册的page页（可以将这个文件夹移到gallery图库的文件夹下）：

``` shell
hexo n page "name"
# "name" 是想要新建的page页名称
```

{% tabs Note %}
<!-- tab 标签语法 -->

 在page页的index.md中写:

```markdown
{% gallery %}
markdown 图片格式
{% endgallery %}
```

<!-- endtab -->

<!-- tab 样式预览 -->

{% gallery %}
![](https://i.loli.net/2019/12/25/Jj8FXuKVlOea4Ec.jpg)
![](https://i.loli.net/2019/12/25/eqBGrXx9tWsZOao.jpg)
![](https://i.loli.net/2019/12/25/LjW2CfNSD7OaY4v.jpg)
![](https://i.loli.net/2019/12/25/pGIhaPjxtl438U9.jpg)
![](https://i.loli.net/2019/12/25/hzjJBR2x5SEmsbC.jpg)
![](https://i.loli.net/2019/12/25/ucNDmUqQkrFfAWv.jpg)
![](https://i.loli.net/2019/12/25/oj1wAnGSKtFvXIJ.jpg)
{% endgallery %}

<!-- endtab -->

<!-- tab 示例源码 -->

``` markdown
{% gallery %}
![](https://i.loli.net/2019/12/25/Jj8FXuKVlOea4Ec.jpg)
![](https://i.loli.net/2019/12/25/eqBGrXx9tWsZOao.jpg)
![](https://i.loli.net/2019/12/25/LjW2CfNSD7OaY4v.jpg)
![](https://i.loli.net/2019/12/25/pGIhaPjxtl438U9.jpg)
![](https://i.loli.net/2019/12/25/hzjJBR2x5SEmsbC.jpg)
![](https://i.loli.net/2019/12/25/ucNDmUqQkrFfAWv.jpg)
![](https://i.loli.net/2019/12/25/oj1wAnGSKtFvXIJ.jpg)
{% endgallery %}
```

<!-- endtab -->

{% endtabs %}
