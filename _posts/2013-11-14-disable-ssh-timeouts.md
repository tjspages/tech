---
title: 禁用 ssh 的登录超时
author: Stephen
layout: post
tags:
    - ssh
---
如下在 /etc/ssh/sshd_config 中设置，可以完全禁用 ssh 的登录超时功能：
<pre>
TCPKeepAlive yes
ClientAliveInterval 30
ClientAliveCountMax 99999
</pre>

* TCPKeepAlive: 不必多说，有疑问可以查看这里：[TCP Keepalive HOWTO](http://www.tldp.org/HOWTO/html_single/TCP-Keepalive-HOWTO/)
* ClientAliveInterval: 服务器在多少秒没有收到向客户端数据后发送一个空包给客户端以保持连接。如果设 0 则禁用此功能，长时间空闲时会断掉连接。默认为 0.
* ClientAliveCountMax: 服务器发出多少连接探包后关闭连接。默认是 3.

这里的 30 秒 × 99999 次就是保持连接 2083 天。

修改之后重启 sshd.

sshd 配置的说明：[http://unixhelp.ed.ac.uk/CGI/man-cgi?sshd_config+5](http://unixhelp.ed.ac.uk/CGI/man-cgi?sshd_config+5)

    
