---
title: Expire Time of Memcached
author: Stephen
layout: post
tags:
    - memcached
    - yii
categories : [English]
---
Source code from Memcached refers to expire time:
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

It can be read, memcached defines a const REALTIME_MAXDELTA which is 30 days. If expire large than this const, memcached will treate it as the absolute unix timestamp. Or memcached will use it as the number of seconds starting from current time.

If the time on memcached server and app server differs a lot, it may cause something seriously unwanted.

Code about memcache expire from Yii framework[^ft3]:

[^ft3]: Until today. I just submitted a patch to yii. [https://github.com/yiisoft/yii/pull/3201](https://github.com/yiisoft/yii/pull/3201)

<pre>
#framework/caching/CMemCache.php

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

If expire is large than 0, Yii changes it to the ***ABSOLUTE TIME ON APP SERVER (NOT THE TIMESTAMP ON MEMCACHED SERVER)***. If we get the max value of 0 and expire, we can change the parameter just same as PHP memcache or memcached[^ft][^ft2].

[^ft]: [Memcache::set](http://www.php.net/manual/en/memcache.set.php)
[^ft2]: [Expiration Times](http://www.php.net/manual/en/memcached.expiration.php)

