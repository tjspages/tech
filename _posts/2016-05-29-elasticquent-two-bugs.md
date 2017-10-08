---
title: Elasticquent 的两个bug
author: Stephen
layout: post
tags:
    - Laravel
    - Elasticsearch
---

[Elasticquent](https://github.com/elasticquent/Elasticquent) 是与 Larave Model Eloquent 结合的 Elasticsearch 客户端，它可以轻松的将 Eloquent 中定义好的数据和关系映射并同步到 Elasticsearch 中。
<!--more-->


## Eloquent 关系数据不存在时报错

Eloquent 关系数据不存在时会将对应的 attribute 设置成 null, 从 ES 中取出数据时， Elasticquent 处理从ES 中取出的数据时，loadRelationsAttributesRecursive 方法会报错。修复方法： [https://github.com/sdpfoue/Elasticquent/commit/89083c1ab4f8acca85f52de33121c1dd2d45e739](https://github.com/sdpfoue/Elasticquent/commit/89083c1ab4f8acca85f52de33121c1dd2d45e739)

## complex search 搜索结果错误

complex search 的搜索对所有的 index 的 type 进行搜索，而没有指定 index 和 type，一次返回结果会带出很多不需要的结果。修复方法： [https://github.com/sdpfoue/Elasticquent/commit/73b0c2a90f3d55edf6deb62f79ebaa5e4d3d26d5](https://github.com/sdpfoue/Elasticquent/commit/73b0c2a90f3d55edf6deb62f79ebaa5e4d3d26d5)
