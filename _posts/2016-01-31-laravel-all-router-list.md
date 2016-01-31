---
title: Laravel 取出所有的 router 信息列表
author: Stephen
layout: post
tags:
    - Laravel
    - Web
---
在做后台权限系统的时候需要将所有在框架中注册的 Router Names 同步到数据库中以便后台配置权限，可以使用 Laravel 中全局变量 $app 中获取到相关信息：

<pre>
global $app;

//Illuminate\Routing\Router Object
$routers = $app['router'];

//Illuminate\Routing\RouteCollection Object
$router_collection = $routers->getRoutes();
</pre>
取出 Route Collection 后就可以遍历取出 Illuminate Routing Route 对象，读出需要的信息。比如：
<pre>
$router->domain();
$router->getName();
</pre>
具体可以参考 API 文档：[https://laravel.com/api/5.2/Illuminate/Routing/Route.html](https://laravel.com/api/5.2/Illuminate/Routing/Route.html)
