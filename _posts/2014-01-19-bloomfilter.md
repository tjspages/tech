---
title: Bloom Filter
author: Stephen
layout: post
tags:
    - algorithm
---

##场景
判断某个元素是否已经存在于一个大的集合（亿级）中，并容许少量的误报的情况下使用。

##实现
初始化 m 位的位数组，被 0 填充。定义 k 个不同的 hash 函数，每个 hash 函数将一个输入元素映射到位数组的一个位上，一个确定的输入则有 k 个索引。
<!--more-->

###插入元素
将 k 个索引对应的位置全部置 1

###查询元素
算出输入元素的 k 个索引，查询这 k 个对应位置的状态，如果都为 1，则认为元素在 set 中。

事实上，如果 k 个对应的索引位都为 1，有可能该元素并不在集合中，也就是 false positive. 不会出现 fase nagitave 的情况，也就是只要有一位
为 0，则该元素一定不存在。

###删除元素
加入的元素很难删除，不知道会不会影响到其它元素。可以把位数组改为整数数组，加入元素时对应位的整数加 1，删除元素时将其减 1 （Counting Bloom Filter）. 单是单凭此过滤器无法确认要删除的元素是否真的在集合中。

##相关概念

###False Positive
假阳性，比如检测乙肝时结果呈阳性，但实际上是阴性，也就是误报。

###False Negative
假阴性，如果一个人是乙肝患者，检查结果却是阴性，就是假阴性，也就是漏报。

##False Positive 的概率
此算法如果所有 hash 的结果对应的索引位均为 0 则此元素一定不在集合中，所以这个算法不会出现 false negative （漏报）的情况。

那么出现误报，也就是元素不在集合中，却得出了相反的结论的概率是多少。

假设 hash 函数的结果落在每一个 m 的位上的概率是相等的，对应一个输入，某索引位没有命中的概率是 

$1-\frac{1}{m}$

假设有 k 个 hash 函数，都没有命中的概率是

$(1-\frac{1}{m})^k$

如果有 n 个元素，那么某一位一直都没有命中的概率就是

$(1-\frac{1}{m})^kn$

这一位命中的概率则是

$1-(1-\frac{1}{m})^kn$

如果对一个特定的元素存在误报，那么这个元素的经过 hash 函数所得到的k个索引全部都是1，概率也就是

$\left(1-\left[1-\frac{1}{m}\right]^{kn}\right)^k \approx \left( 1-e^{-kn/m} \right)^k$

这个算法假设了每一索引位的概率是独立的，所以结果并不完全准确但是可以作为近似值。从这个结果可以看出来，增加 m 的值将会降低误报率，增加 n 的值则会增加误报。

##参数选择

### hash 函数
好的 hash 函数应该以尽可能相待的概率将输入映射到每个位上

###位数组大小选择

$k = \frac{m}{n} \ln 2$
 
也就是

$2^{-k} \approx {0.6185}^{m/n}$

如果有 m 位数组，n 个元素，FP 的概率为 p，k 使用的是上述计算出的最佳值

$p = \left( 1-e^{-(m/n\ln 2) n/m} \right)^{(m/n\ln 2)}$

可以简化成

$\ln p = -\frac{m}{n} \left(\ln 2\right)^2$

结果是

$m=-\frac{n\ln p}{(\ln 2)^2}$

对于一个给定的 FP 概率 p, 数组 m 的长度和元素个数 n 应该成正比。上述公式在 m, n 趋于无穷时也同样适用，FP 的概率在 m, n, k 都接近无穷时

$\left( 1-e^{-k(n+0.5)/(m-1)} \right)^k$






##参考
* [布隆过滤器](http://zh.wikipedia.org/wiki/Bloom_filter)
* [大规模数据处理利器Bloom Filter介绍](http://wenku.baidu.com/view/4b015267f5335a8102d2202a.html)
* [Bloom Filter 算法简介 (增加 Counting Bloom Filter 内容)](http://my.oschina.net/kiwivip/blog/133498)
* [Bloom Filter概念和原理](http://blog.csdn.net/jiaomeng/article/details/1495500)
* [什么是False Positive和False Negative](http://simon.blog.51cto.com/80/73395/)
* [Wiki - Bloom filter](http://en.wikipedia.org/wiki/Bloom_filter)
