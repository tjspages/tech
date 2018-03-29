---
title: XeLaTeX 在 Mac 上报 Font xxx does not contain script 'CJK' 的解决办法
author: Stephen
layout: post
tags:
    - XeLaTeX
---
在新的 Mbp 上新装的 XeLaTeX，编译一个之前写好的文档，报 `Font 'Songti SC' does not contain script 'CJK'`。打开 Mac 的 Font Book 应用，试了几种中文字体都不行。Google 了一下，[这里](https://en.wikipedia.org/wiki/List_of_CJK_fonts)列出了所有支持 CJK 的字体。下载了其中列举的文泉驿和网上找到的微软字体都有一些问题，特别是微软的字体，放到 Mac 中都是方块。

Wiki 中提到了微软的 Office 中是有简体中心字体的，搜索一下本机：`locate ttf|grep -i song|grep -i micro`，得到以下结果：
<pre>
/Applications/Microsoft Excel.app/Contents/Resources/DFonts/Fangsong.ttf
/Applications/Microsoft OneNote.app/Contents/Resources/DFonts/Fangsong.ttf
/Applications/Microsoft PowerPoint.app/Contents/Resources/DFonts/Fangsong.ttf
/Applications/Microsoft Word.app/Contents/Resources/DFonts/Fangsong.ttf
</pre>

`open /Applications/Microsoft\ Word.app/Contents/Resources/DFonts/Fangsong.ttf` 打开字体文件，点击安装，忽略报错，直接安装。拿到 PostScript 名称 `FangSong`，放到代码中，编译成功。
