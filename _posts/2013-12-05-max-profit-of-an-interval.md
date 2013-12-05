---
title: 某时间段股票的最大收益方案
author: Stephen
layout: post
tags:
    - puzzle
---
##问题
给出一段股票的趋势图，找出某区间最大收益的方案。

![stock](/assets/imgs/2013-12-05-stock.png)
<!--more-->

##模拟数据生成

<pre>
$data = array();

for($i = 0; $i <= 50; $i++){
    if(0 == $i){
        $data[] = mt_rand(1,50);
    }else{
        $data[] = mt_rand($data[$i-1] - 1, $data[$i-1] +1);
    }
}
</pre>

##数据输出点阵趋势图

<pre>
function time_chart($data){
    $flip_data = array();
    $max = max($data);
    $length = count($data);

    foreach($data as $k => $v){
        if(isset($flip_data[$v])){
            if(!is_array($flip_data[$v])){
                $flip_data[$v] = array($flip_data[$v]);
            }
            $flip_data[$v] = array_merge($flip_data[$v], array($k));
        }else{
            $flip_data[$v] = array($k);
        }
    }

    for($i = $max; $i >= 0; $i--){
        $data = isset($flip_data[$i]) ? $flip_data[$i] : array();
        echo "\t$i";
        for($j = 0; $j < $length; $j++){
            if(in_array($j, $data)){
                echo '.';
            }else{
                echo ' ';
            }
        }
        echo "\n";
    }
}
</pre>

###效果
![stimulation](/assets/imgs/2013-12-05-stimulation.png)

##分析

###幸运
如果最小值出现在最大值前面，那么结果就是它了。
<pre>
function max_profit($data){
    $origin_data = $data;
    arsort($data);
    reset($data);
    $max_key = key($data);
    end($data);
    $min_key = key($data);
    if($min_key < $max_key){
        $max_profit = $data[$max_key] - $data[$min_key];
        echo "lucky\n";
        echo "Buy date: $min_key\t Sell date: $max_key\tMax profit: $max_profit\n";
    }
}
</pre>

###不够幸运
最小值出现在最大值后。

####暴力解法
将每一个值与后面所有的数值做差，保存最大的差值直到最后。这个很直观，效率低下，可以用来验证其它算法的结果。

时间复杂度是 1 到 n 的等差数列和，也就是 $O(n^2)$。
<pre>
function not_lucky_force($data){
    $max_profit = 0;
    $max_key = 0;
    $min_key = 0;
    $length = count($data);
    foreach($data as $k => $v){
        for($i = $k+1; $i < $length; $i++){
            if($data[$i] - $data[$k] > $max_profit){
                $max_profit = $data[$i] - $data[$k];
                $max_key = $i;
                $min_key = $k;
            }
        }
    }
    return array($min_key, $max_key, $max_profit);
}
</pre>

####优化方法
按最小值和最大值划分 3 个区间。在第一个区间里找出最小值，求出此最小值与最大值的差值。在最后一个区间找出最大值，求此值与最小值的差值。中间区间的最小值如果出现在最大值前返回差值，比较三个差值，取最大的。如果中间区间的最小值出现在最大值前，重复上一过程。

时间复杂度为 $O(\log_3 n)$

<pre>
function not_lucky_optimised($data, &$step){
    $step++;
    $sorted_data = $data;
    arsort($sorted_data);
    reset($sorted_data);
    $max_key = key($sorted_data);
    end($sorted_data);
    $min_key = key($sorted_data);
    if($min_key < $max_key){
        return $data[$max_key] - $data[$min_key];
    }
    reset($data);
    $first_key = key($data);
    $first = array_slice($data, 0, $max_key + 1 - $first_key, TRUE);
    $middle = array_slice($data, $max_key + 1 - $first_key,
            $min_key - $max_key - 1, TRUE);
    if(count($middle) <= 2){
        $first = array_shift($middle);
        $second = array_shift($middle);
        $middle_max_profit =  max(0, $second - $first);
    }else{
        $middle_max_profit = not_lucky_optimised($middle, $step);
    }
    $last = array_slice($data, $min_key - $first_key, null, TRUE);
    if(count($first) <= 1){
        $first_max_profit = 0;
    }else{
        $first_max_profit = max($first) - min($first);
    }
    if(count($last) <= 1){
        $last_max_profit = 0;
    }else{
        $last_max_profit = max($last) - min($last);
    }
    return max(
            $first_max_profit,
            $last_max_profit,
            $middle_max_profit
            );
}
</pre>

##完整代码
[https://gist.github.com/sdpfoue/7808352](https://gist.github.com/sdpfoue/7808352)
