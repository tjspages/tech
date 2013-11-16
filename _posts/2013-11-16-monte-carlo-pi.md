---
title: 蒙地卡罗法求 PI
author: Stephen
layout: post
tags:
- puzzle
---
假设有一个圆半径为1，那么四分之一圆面积就为 $\frac{\pi}{4}$，而包括此四分之一圆的正方形面积就为1，如下图[^monte]：

![](http://mathfaculty.fullerton.edu/mathews//n2003/montecarlopi/MonteCarloPiMod/Images/MonteCarloPiMod_gr_25.gif)

[^monte]: [http://mathfaculty.fullerton.edu/mathews//n2003/montecarlopimod.html](http://mathfaculty.fullerton.edu/mathews//n2003/montecarlopimod.html)

如果随意的在正方形中投点，坐标为 $x, y$, 则这些点有些会落于四分之一圆内，假设所投射的点有 m 点，在圆内的点有 n 点，则 $\frac{n}{m}\times4=\pi$，如果 $x, y$满足 $x^2 + y^2 \leq 1$ 则该点落在了圆内。
<!--more-->

代码[^code]：

[^code]: [http://www.dartmouth.edu/~rc/classes/soft_dev/C_simple_ex.html](http://www.dartmouth.edu/~rc/classes/soft_dev/C_simple_ex.html)
{% highlight c linenos %}
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <string.h>
#define SEED 35791246

main(int argc, char* argv)
{
    int niter=0;
    double x,y;
    int i,count=0; /* # of points in the 1st quadrant of unit circle */
    double z;
    double pi;

    printf("Enter the number of iterations used to estimate pi: ");
    scanf("%d",&niter);

    /* initialize random numbers */
    srand(SEED);
    count=0;
    for ( i=0; i<niter; i++) {
        x = (double)rand()/RAND_MAX;
        y = (double)rand()/RAND_MAX;
        z = x*x+y*y;
        if (z<=1) count++;
    }
    pi=(double)count/niter*4;
    printf("# of trials= %d , estimate of pi is %g \n",niter,pi);
}
{% endhighlight %}

如果将上述代码中的 SEED 用 time 函数替代，每次同样的 niter 都会得到不同的结果。
取 10000 的三次结果：

<pre>
# of trials= 10000 , estimate of pi is 3.1388
# of trials= 10000 , estimate of pi is 3.1552
# of trials= 10000 , estimate of pi is 3.1468 
# of trials= 10000 , estimate of pi is 3.1224 
# of trials= 1000000 , estimate of pi is 3.14172
# of trials= 1000000 , estimate of pi is 3.14066
# of trials= 1000000 , estimate of pi is 3.14018 
</pre>

如果不是用随机落点的方式，而是对这个正方形进行从有限到无穷的切割成小正方形，每一个小正方形视为一个点则有下面的代码：

{% highlight c linenos %}
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(int argc, char *argv[])
{
    time_t start, end;
    int R = atoi(argv[1]);
    unsigned long R2 = R * R;
    time(&start);
    unsigned long x, y;
    unsigned long total = 0, miss = 0;
    unsigned long y2[R];
    unsigned long x2;
    for(y = 0; y < R; y++){
        y2[(int)y] = y * y;
    }
    for (x = 0; x < R; x++)
    {
        x2 = x * x;
        for(y = 0; y < R; y++){
            total++;
            if(x2 + y2[(int)y] > R2){
                miss++;
            }
        }
    }
    time(&end);
    printf("R = %d\tPI = %f\ttime consume:%f\n", R, (double)4 * (total - miss) / total, difftime(end, start));
    return 0;
}
{% endhighlight %}

测试结果：

<pre>
R = 10  PI = 3.520000   time consume:0.000000
R = 100 PI = 3.181200   time consume:0.000000
R = 1000    PI = 3.145544   time consume:0.000000
R = 10000   PI = 3.141990   time consume:1.000000
R = 30000   PI = 3.141726   time consume:4.000000
R = 40000   PI = 3.141692   time consume:8.000000
</pre>

如果不计算随机数生成的消耗，第一种方法的复杂度是 $O(n)$，而后一种的是 $O(n^2)$.  第一种利用了随机生成器提高了运行效率，同时也降低了精度。第一种算法取100万级的数压力也不算大，第二种取到10万已经很囧了。但是后一种算法对于人来说和随机的方法没什么区别，如果有足够的耐心，用手也可以求出精度较高 $\pi$ 值;-)
