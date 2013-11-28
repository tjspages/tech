---
title: 约定优于配置（Convention over configuration）
author: Stephen
layout: post
tags:
    - pattern
---
最早知道 Convention over configuration (CoC) 的说法是看 RoR 的教程，介绍说这个思想是 RoR 的设计哲学之一[^dry]。

[^dry]: 另外一个是 DRY，[Don't Repeat Yourself](http://en.wikipedia.org/wiki/Don%27t_Repeat_Yourself)

约定优于配置是一种软件设计范式，是为了尽量减少开发人员需要做的决定，在不失去灵活性的前提下减少复杂性。
<!--more-->

假如写一个 PHP 的 MVC 框架，通过 autoload 对 controller, model 等类的加载。可以扫描整个工程目录；可以在某文件中将类与文件的映射写好，像 yii main.php 中的 import 项；

在以前的公司中也使用过这样的框架，每次手写好新类后手动执行一遍脚本，脚本会自动扫描工程并生成一个类与文件的映射配置表。

约定优于配置的做法可以理解成通过约定好的类的命名规则到特定的目录中找文件，比如：所有的 model 都约定必须以 Model 结尾，ProductModel, 当框架看到这种特征的文件就直接去找 model/ProduceModel.php 文件。


参考：

* [stackoverflow: Do you find convention over configuration good or bad?](http://stackoverflow.com/questions/1166539/do-you-find-convention-over-configuration-good-or-bad)
* [YiiBase.php](https://github.com/yiisoft/yii/blob/c3dc6a11964acb8042ee0f58bd21785640d87572/framework/YiiBase.php)
* [Yii Conventions](http://www.yiiframework.com/doc/guide/1.1/en/basics.convention* [Conventions)
