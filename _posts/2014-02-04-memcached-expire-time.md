---
title: Memcached 的过期时间
author: Stephen
layout: post
tags:
    - memcached
    - yii
---
在 Memcached 中和过期时间相关的有如下的代码
<pre>
#define REALTIME_MAXDELTA 60*60*24*30

/*
 * given time value that's either unix time or delta from current unix time, return
 * unix time. Use the fact that delta can't exceed one month (and real time value can't
 * be that low).
 */

static rel_time_t realtime(const time_t exptime) {
    /* no. of seconds in 30 days - largest possible delta exptime */
 
    if (exptime == 0) return 0; /* 0 means never expire */
 
    if (exptime > REALTIME_MAXDELTA) {
        /* if item expiration is at/before the server started, give it an
           expiration time of 1 second after the server started.
           (because 0 means don't expire).  without this, we'd
           underflow and wrap around to some large value way in the
           future, effectively making items expiring in the past
           really expiring never */
        if (exptime <= process_started)
            return (rel_time_t)1;
        return (rel_time_t)(exptime - process_started);
    } else {
        return (rel_time_t)(exptime + current_time);
    }
}
</pre>
<!--more-->

可以看出 memcached 定义了一个常量 REALTIME_MAXDELTA，时间是 30 天的时间。如果传来的数字大于这个常量，就认为是发来的是 unix timestamp 的绝对时间；如果小于这个时间就认为是相对于当前时间的相对时间。

如果 memcached 服务器与应用服务器时间不一致，甚至差的多的时候则有可能出现比较严重问题。

在 yii 和 memcache 相关的代码中 set 和 add 过期时间是这样处理的

<pre>
framework/caching/CMemCache.php

/**
     * Stores a value identified by a key in cache.
     * This is the implementation of the method declared in the parent class.
     *
     * @param string $key the key identifying the value to be cached
     * @param string $value the value to be cached
     * @param integer $expire the number of seconds in which the cached value will expire. 0 means never expire.
     * @return boolean true if the value is successfully stored into cache, false otherwise
     */
    protected function setValue($key,$value,$expire)
    {
        if($expire>0)
            $expire+=time();
        else
            $expire=0;

        return $this->useMemcached ? $this->_cache->set($key,$value,$expire) : $this->_cache->set($key,$value,0,$expire);
    }
</pre>

这里如果过期时间大于 0，yii 将设置的过期时间都转换成了***应用服务器上的***绝对过期时间。如果将这里改成取 expire 和 0 的最大值则可将这个参数和 php 代码中的 exprie[^ft][^ft2] 代码意思一至了。

[^ft]: [Memcache::set](http://www.php.net/manual/en/memcache.set.php)
[^ft2]: [Expiration Times](http://www.php.net/manual/en/memcached.expiration.php)

