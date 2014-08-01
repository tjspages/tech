---
title: 利用 MySQL 的计算函数 TRUNCATE 对以某单位分段的区间中的每个区间做数据统计
author: Stephen
layout: post
tags:
    - SQL
---
### TRUNCATE 方法
> Returns the number X, truncated to D decimal places. If D is 0, the result has no decimal point or fractional part. D can be negative to cause D digits left of the decimal point of the value X to become zero.

[http://dev.mysql.com/doc/refman/4.1/en/mathematical-functions.html#function_truncate](http://dev.mysql.com/doc/refman/4.1/en/mathematical-functions.html#function_truncate)

<!--more-->

### 对以某单位分段的区间中的每个区间做数据统计
比如统计 7 月 28 号到 31 号这 4 天每天每样商品出售了多少做统计。售出时间以 timestamp 形式保存在数据库。

<pre>
select product_id, count(1), TRUNCATE((create_time - unix_timestamp('2014-7-28'))/86400 + 28, 0) as date from products where time between unix_timestamp('2014-7-28') and unix_timestamp('2014-8-1') group by product_id order by date
</pre>
