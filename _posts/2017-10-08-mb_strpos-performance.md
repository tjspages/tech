---
title: Laravel 的一处严重性能问题
author: Stephen
layout: post
tags:
    - Laravel
    - Performance
    - PHP
---
### mb_strpos 的性能问题
最近发现 Laravel 在处理某类队列任务时时间超长，经排查发现 src/Illuminate/Queue/Jobs/Job.php 文件中的 rolveQueueableEntity 使用了 Illuminate Str 的 startsWith，此方法中使用了 mb_strpos 方法。mb_strpos 的性能非常差，在处理大 string （100M以上） 时会产生严重性能问题。<!--more-->参考文章：[Why is mb_strpos() so considerably slower than strpos()?](https://stackoverflow.com/questions/24344491/why-is-mb-strpos-so-considerably-slower-than-strpos)

由于 Laravel 已经停止对 5.2 版本的支持，只能自行修复此问题。修复方法：[fix bad performance of resolve queueable entity](https://github.com/laravel/framework/pull/21583/commits/da2303c519cb08cf6aedca73b33be029f9345066)

### 顺带一提
in_array 的性能比 isset 差很多。O(n) 的时间复杂度在数据量大的时候比 O(1) 的性能差的非常明显。
