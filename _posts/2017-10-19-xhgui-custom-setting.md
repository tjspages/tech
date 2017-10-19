---
title: XHProf 定制采样方法
author: Stephen
layout: post
tags:
    - Performance
    - PHP
---
### XHProf
XHProf 是 Facebook 开源出来的一个php轻量级的性能分析工具，跟Xdebug 类似，但性能开销更低，还可以用在生产环境中，也可以由程序开关来控制是否进行 profile。<!--more-->

由于 Facebook 转用自己开发的 HHVM，XHProf 的维护已经停止，XHProf 对高版本的 PHP 并不支持，可以使用 tideways 替代，下载地址：[https://github.com/tideways/php-profiler-extension](https://github.com/tideways/php-profiler-extension)

### XHGui
XHGui 提供了一套丰富的可视化工具，来展示 XHProf 搜集到的数据。

### tideways 和 XHGui 的安装
DigitalOcean 有详细的安装步骤：[https://www.digitalocean.com/community/tutorials/how-to-set-up-xhprof-and-xhgui-for-profiling-php-applications-on-ubuntu-14-04](https://www.digitalocean.com/community/tutorials/how-to-set-up-xhprof-and-xhgui-for-profiling-php-applications-on-ubuntu-14-04)

### 数据采样率的设定
profiling 工具即使再轻量也会对性能产生影响，所以是不可能对所有请求都开启的，默认是取样 1% 的数据。配置在 `config/config.default.php` 中
<pre>
'profiler.enable' => function() {
        return rand(1, 100) === 42;
    },
</pre>
也就是说，当随机数为 42 时取样。

如果想对某一个请求做分析，如果用纯随机方法就比较难以取样了。可以设定一个请求参数，当发现这个参数有某值时就 100% 触发 tideways
<pre>
    'profiler.enable' => function() {
        if(isset($_REQUEST['profile']) && $_REQUEST['profile'] == 1){
            return true;
        }
        return rand(1, 100) === 42;
    },</pre>

有些时候不想对所有的请求做记录，只想筛选出来执行超过一定时长的请求，可以在`external/header.php`文件头记录一个时间，在`register_shutdown_function` 的回调函数中用 global 取回此时间，再取一个当前时间，开始时间取差值，如果小于阈值直接 return 即可。
<pre>
register_shutdown_function(
    function () {
        global $time;
        $record=false;
        if(isset($_REQUEST['profile']) && $_REQUEST['profile'] == 1){
            $record = true;
        }
        $consume = microtime(true) - $time;
        if($consume < 1 && !$record){
            return;
        }
        if (extension_loaded('uprofiler')) {
            $data['profile'] = uprofiler_disable();
        } else if (extension_loaded('tideways')) {
            $data['profile'] = tideways_disable();
        } else {
            $data['profile'] = xhprof_disable();
        }
        ...
        </pre>


