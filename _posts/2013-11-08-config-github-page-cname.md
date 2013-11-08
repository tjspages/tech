---
title: Github Pages 的域名定制
author: Stephen
layout: post
tags:
    - github pages
---
在 CNAME 中设置好域名后给定制的域名设置个 cname 到 xxx.github.io 就可以了，xxx可以是任意字母。Github 会自动找到它设给这个域名的一个 CNAME 然后解析到正确的 IP 地址。即使 Github 的 IP 发生了变化也会自己调整。

tech.tjs.im 的域名查询如下：
{% highlight bash %}
$ dig tech.tjs.im +nostats +nocomments +nocmd
; <<>> DiG 9.8.5-P1 <<>> tech.tjs.im +nostats +nocomments +nocmd
;; global options: +cmd
;tech.tjs.im.           IN  A
tech.tjs.im.        300 IN  CNAME   xxx.github.io.
xxx.github.io.      538 IN  CNAME   github.map.fastly.net.
github.map.fastly.net.  30  IN  A   103.245.222.133
{% endhighlight %}
