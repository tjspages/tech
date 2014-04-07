---
title: Rails 的单表继承
author: Stephen
layout: post
tags:
    - Rails
    - Web
---
Rails 内置了非常棒的单表继承 （Single Table Inheritance, STI） 机制。

##单表继承
单表继承就是面向对象的继承关系在关系型数据库中的一种表现方法。当数据库中的表映射到代码中的类时 (ORM)，代码中的继承关系的不同类可以保存在同一张数据表中。约定的特定中列的内容可以指示出这条记录属于哪个具体继承的类，在 Rails 中，这个列的名字是 type。

##如何在 Rails 中实现单表继承

<pre>
class Company < ActiveRecord::Base; end
class Firm < Company; end
class Client < Company; end
class PriorityClient < Client; end
</pre>
很直观，当用上面的类创建数据时， companies 表中的 type 会设置成相应的类名。如果没有 type 列，单表继承不会触发，只是写一条普通并区分不开的记录到 companies 表中。
<!--more-->

##优缺点
使用单表继承，用一张表可以记录所有相关类的信息，不需要为每一个子类建一张表，数据库的设计可以简洁很多。

缺点是会出现所有子类的属性，造成一定的冗余。相应的，增减类可能都会带来数据表结构的修改。

##参考
* [wiki: Single Table Inheritance](http://en.wikipedia.org/wiki/Single_Table_Inheritance)
* [Active Record Basics](http://guides.rubyonrails.org/active_record_basics.html)
* [Rails: Single table inheritance](http://api.rubyonrails.org/classes/ActiveRecord/Base.html#label-Single+table+inheritance)

