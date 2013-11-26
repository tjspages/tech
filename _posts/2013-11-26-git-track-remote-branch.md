---
title: Git 本地分支追踪远程分支
author: Stephen
layout: post
tags:
    - git
---
假设本地的 foo 分支追踪仓库 upstream 中的 foo 分支:

1.8.0 版：
当前是 foo 分支
<pre>
git branch -u upstream/foo
</pre>
或
<pre>
git branch --set-upstream-to=upstream/foo
</pre>


foo 不是当前分支
<pre>
git branch -u upstream/foo foo
</pre>
或
<pre>
git branch --set-upstream-to=upstream/foo foo
</pre>

1.7.0 版本：
<pre>
git branch --set-upstream foo upstream/foo
</pre>

