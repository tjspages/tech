---
title: MySQL 执行计划
author: Stephen
layout: post
tags:
    - MySQL
---

执行 SQL query 时，MySQL 会为 SQL 的执行尝试一个最优的执行计划。通过在查询命令前加 EXPLAIN 就可以看到 MySQL 的执行计划。EXPLAIN 是了解和优化 MySQL 查询的利器之一。
<!--more-->

##EXPLAIN 的输出

<pre>
EXPLAIN SELECT * FROM users\G
</pre>

<pre>
********************** 1. row **********************
           id: 1
  select_type: SIMPLE
        table: users
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: 
1 row in set (0.00 sec)
</pre>

上面 10 个返回值的意思分别是：

* `id` 每个 SELECT 查询标识
* `select_type` SELECT 的类型，可能有的值：
    * `SIMPLE` 只是简单查询，没有子查询或 UNION
    * `PRIMARY` 最外层的 SELECT 有 JOIN
    * `DERIVED` SELECT 是 FROM 后的一个子查询
    * `SUBQUERY` 子查询中的第一个 SELECT
    * `DEPENDENT SUBQUERY` 一个子查询，依赖外层的查询
    * `UNCACHEABLE SUBQUERY` 一个不能被缓存的子查询
    * `UNION` SELECT 是一个 UNION 第二个以后的查询
    * `DEPENDENT UNION` UNION 第二个之后个 SELECT 依赖于外层的查询
    * `UNION RESULT` SELECT 是一个 UNION 的结果
* `table` 查询到的行所在的表
* `type` MySQL 怎样 join 各表的。这是输出结果中最重要的结果之一。它可以看出是否有缺失的索引或者查询是否需要重写。
    * `system` 表只有 0 行或 1 行。
    * `const` 表中只有 1 行匹配并且被索引。这是 join 中最快的类型，因为表只被读了一次并且列的值在 join 其它表的时候是一个常量。
    * `eq_ref` 索引所有的部分都被使用，并且索引是主键或者不为空的唯一索引。这是第二好的 join 类型。
    * `ref` 非唯一性索引扫描，返回匹配某个单独值的所有行。常见于使用非唯一索引即唯一索引的非唯一前缀进行的查找。
    * `full_text` join 使用了表的 `FULLTEXT` 索引   
    * `ref_or_null` 这个和 `ref` 一样，但是它的列中包含 null
    * `index_merge` join 使用了一系列的索引来生成结果。EXPLAIN 的 key 输出项将标明哪些索引被用到
    * `uniq_subquery` 一个 IN 的子查询只返回了一个结果并且使用了主键
    * `index_subquery` 和 `uniq_subquery` 一样，不过返回多于一条结果
    * `range` 索引被用来在某一指定范围内查找，特别是索引的列作为条件来和常数做比较，像 BETWEEN, IN 或 <, > 等
    * `index` 整个索引都被扫描了一遍
    * `all` 整个表被扫了一遍才找出 join 后匹配的结果。这是 join 最坏的结果，一般说明表缺少合适的索引。
* `possible_keys` 显示可以被 MySQL 利用的索引来查找结果，但是它们可能真正被使用了，也可能没被用到。这个结果如果是 NULL，通常可以帮助优化查询，它说明没有找到相关的索引。
* `key` 指出真正被 MySQL 用到的索引。这里可能列出没有列在 `possible_keys` 结果项中的索引。MySQL 通常会找一个最优的索引来进行查找。当 join 很多表时，它可能会找到一些没有列在 `possible_key` 中的，但是更优化的索引。
* `key_len` 查询优化器[^qo]所选择的索引的长度。比如，key_len 为 4 则说明它需要在内存中保存 4 个字符。
* `ref` 哪些列或常数与列在 key 项中的索引进行比较，并从表中选出结果
* `rows` 查出最终结果一共检查了多少记录。这是另一个非常值得注意用来优化查询的指标，特别对于 join 和子查询的情况。
* `Extra` 包含了执行计划的额外信息

可以在 EXPLAIN 后加上 EXTENDED, 这会显示执行计划的额外信息。在执行 `EXPLAIN` 后执行 `SHOW WARNINGS` 。这个东西可以看到被查询优化器优化后的样子。

<pre>
EXPLAIN EXTENDED SELECT City.Name FROM City
JOIN Country ON (City.CountryCode = Country.Code)
WHERE City.CountryCode = 'IND' AND Country.Continent = 'Asia'\G
</pre>

<pre>
********************** 1. row **********************
           id: 1
  select_type: SIMPLE
        table: Country
         type: const
possible_keys: PRIMARY
          key: PRIMARY
      key_len: 3
          ref: const
         rows: 1
     filtered: 100.00
        Extra: 
********************** 2. row **********************
           id: 1
  select_type: SIMPLE
        table: City
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4079
     filtered: 100.00
        Extra: Using where
2 rows in set, 1 warning (0.00 sec)
</pre>

<pre>
SHOW WARNINGSG
</pre>

<pre>
********************** 1. row **********************
  Level: Note
   Code: 1003
Message: select `World`.`City`.`Name` AS `Name` from `World`.`City` join `World`.`Country` where ((`World`.`City`.`CountryCode` = 'IND'))
1 row in set (0.00 sec)
</pre>

##参考
* [EXPLAIN Output Format](http://dev.mysql.com/doc/refman/5.1/en/explain-output.html)

[^qo]:  Query Optimizer



















