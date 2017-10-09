---
title: Chrome 的预连接机制是如何破坏 Haproxy HTTP 请求的
author: Stephen
layout: post
tags:
    - Chrome
    - haproxy
    - HTTP
---
最近使用 Chrom 访问生产环境经常得到 408 错误，经查这样的请求都没有到 nginx, 只请求到了 Haproxy。Google 后找到原因：

chrome 有一个预连接页面中 server 以加速浏览的特性。就是加载页面后对页面里链接中的 server 建立一个 tcp 连接(但不真正发出请求)，在用户真正发起请求前完成 TCP 握手，这样就可省掉了另一个往返的延迟，大大提高访问速度。通过访问 chrome://dns 可以看到 TCP 预连接的使用情况。

haproxy 在 socket 建立了之后严格按照调置和 http 协议中的约定，当 sockets 建立之后等待一定时间，没有 http 请求上来就会产生一个 408 错误，这时真正的 http 请求通过这个 socket 上来时就会直接收到 haproxy 发出的这个错误.

将 408 错误重定向到 /dev/null 后，haproxy 将不再对 408 错误做出提示，也就是出现 408 之后不返回错误给 client 而是直接关闭 socket。这时当使用 chrome 真正请求资源时，chrome 的预连接已经被关闭，chrome 只能重新发起一个全新的 tcp 完成一次 http 请求，暂避免这个现象。这是一个变通的解决办法。

Chrome 的这个机制 3 年前就有了，为什么最近各 LB 突然出现这个问题，文章中没有给出原因。
<!--more-->

http://www.technize.net/chrome-extra-bandwidth/ 给出了关闭 chrome 预连接的方法

详细：[http://www.copernica.com/en/blog/how-chromes-pre-connect-breaks-haproxy-and-http](http://www.copernica.com/en/blog/how-chromes-pre-connect-breaks-haproxy-and-http)

参考：[http://www.nowamagic.net/academy/detail/48110864](http://www.nowamagic.net/academy/detail/48110864)
