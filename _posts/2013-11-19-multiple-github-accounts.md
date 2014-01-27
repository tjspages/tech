---
title: 多个 Github 账号的 key 管理
author: Stephen
layout: post
tags:
    - Github
    - ssh
---
按照[这篇文章](https://help.github.com/articles/generating-ssh-keys)的步骤创建一个新 key, 比如名字叫：id_rsa_second 和 id_rsa_second.pub.

ssh-add 刚刚生成的 ID.

在.ssh 目录下创建一个文件config, 内容是：
<pre>
Host github-second
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa_second
</pre>
Host 是随便起的一个别名，对应的真实的HostName在第二行设置： github.com

然后在添加第二个账号的 Repo 时把 URL 中对应的 github.com 部分换成 github-second, 剩下的就是正常的 Git 操作了。
