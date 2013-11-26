---
title: 身份验证的 2 步验证
author: Stephen
layout: post
tags:
    - security
---
不久前 Github 账号遭到大面积的暴力破解攻击[^gh1]，Github 同时对弱口令账号做了处理[^gh2]。此事件后 2 步验证再次被频繁的提起。一般如果接入公司的 VPN 中，都会有 2 步验证的过程，某些银行也提供的类似服务，比如中国银行。
<!--more-->

我知道的最早提供 2 步验证的互联网服务商是 Google。

[^gh1]: [Github accounts compromised in brute force attack](http://www.theguardian.com/technology/2013/nov/21/github-accounts-compromised-in-brute-force-attack)

[^gh2]: [GitHub bans weak passwords after brute-force attack results in compromised accounts](http://www.pcworld.com/article/2065340/github-bans-weak-passwords-after-bruteforce-attack-results-in-compromised-accounts.html)

##两步验证
两步验证是一种需要经过 2 次身份验证来确认一个用户是否是合法的访问一个计算机或网络上的服务[^wiki_two_step]，一般第一次是固定密码，第 2 次验证是一个一次性密码（One Time Password - OTP）。

##OTP
一次性密码（OTP）只对一次的登录会话是有效的，它可以避免传统的固定密码的易破解的缺点

###OTP 算法

####HOTP

HOTP 是基于 HMAC 算法的 OTP 算法

它的实现依赖于 2 个元素：

* 作为密钥的 k
* 作为记数的 C

HOTP(K,C) = Truncate(HMAC-SHA-1(K,C))[^rfc_hotp]

[^rfc_hotp]: [http://www.ietf.org/rfc/rfc4226.txt](http://www.ietf.org/rfc/rfc4226.txt)


其中密钥只有令牌（token）和服务商知道。在验证身份的时候，令牌将计数加 1 并算出 HOTP 值，服务器算出的值如果和这个一致，则认证通过，同时服务器将计数加 1. 

计算器的同步：服务器只有在验证成功后才会增加计数，令牌则是每次用户请求都会增加，所以令牌和服务器中的计数有可能出现不同步的现象。对于这个问题，建议是在服务器上设置一个向后窗口，长度 s，如果值不匹配服务器则计算基于后面 counter 的 HOTP 值，直到算到窗口尽头或匹配为止，然后重设计数器。s 保证了服务器不会永远向下检查，以导致拒绝服务攻击，也有效的限制了攻击的范围。s 在不影响正常使用的前提下应当设置的尽可能小。


####TOTP
TOTP 是基于时间的一次性密码算法。它作为 HOTP 的一个补充出现，让 HOTP 支持以时间为向前的移动因子（计数器）。每个密码产生的时间间隔为 30 秒。目前市面上大多数是这种算法。

#####TOTP 的一种 PHP 实现
放在 Gist 上的一段代码（来自互联网）：[https://gist.github.com/sdpfoue/5128774](https://gist.github.com/sdpfoue/5128774)


###免费的 OTP 软件令牌[^github]
智能移动端的普及大大降低了 OTP 令牌的成本，如果想就可以不再依赖于 RSA 等大公司的硬件令牌了。下面是一些手机上的免费应用：
 
*    Google Authenticator (for Android/iPhone/BlackBerry)
*    Duo Mobile (for Android/iPhone)
*    Authenticator (for Windows Phone 7)

[^github]: [https://help.github.com/articles/about-two-factor-authentication#configuring-2FA-through-a-mobile-application](https://help.github.com/articles/about-two-factor-authentication#configuring-2FA-through-a-mobile-application)


###短信
字面意思就很好理解：每次登录的时候发一个随机密码到登记的手机上，只要手机在手里就认为是本人。这种一次性密码，由于我国的几大运营商补卡的不严谨流程，最近爆出很多用身份证号码加姓名办假身份证之后盗号的新闻：[百度新闻搜索](http://news.baidu.com/ns?cl=2&rn=20&tn=news&word=%E5%81%87%E8%BA%AB%E4%BB%BD%E8%AF%81%20%E6%89%8B%E6%9C%BA&ie=utf-8)。

至于你的姓名和身份证QQ手机号码等信息，如果有人想搞他们总有办法搞的到。

##支持 2 步验证的服务商[^wiki_two_step]

* Amazon
* Dropbox
* Evernote
* Facebook
* GitHub
* Lastpass
* LinkedIn
* Microsoft
* MyDigipass.com
* Twitter
* WordPress
* Yahoo! Mail
* eBay 

上面是维基上列出的服务，我还知道一家国内一家很早推出 2 步验证的服务商：坚果云。

##OTP 的本质
OTP 的本质是生成一个复杂的密钥，同时保存在服务商和令牌中，然后加入一个变化因子以应对重放攻击（replay attack[^wiki_replay]）。对于暴力破解攻击，相比来说 HOTP 的安全性会更高一些，它引入了 2 个未知值，一个是密钥，另一个是当前的计数。

而对于目前流利的 TOTP，由于当前的时间是一个共知的数值，所以变值其实只有一个就是密钥。那么针对 TOTP 的暴力攻击就可以落到对密钥的试探上，利用上面提到的 PHP 实现或其它任何什么语言的实现都可以，只不过增加了一点的破解成本。但是作为密钥，强度会大大强于多数的用户设置的密码，本质上 TOTP 对安全的增加还是落在密码强度的增加上[^fn1]。

[^fn1]: 当然作为对付暴力破解的一个非常有效有简单的方法就是限制一定时间内的试错数。

TOTP 对于一般用户体验上的提升是明显的：不再需要背下不同的大量的复杂密码（管理在令牌中），登录时只需要输入简单的 6 位数字密码即可。

[^wiki_replay]: [http://en.wikipedia.org/wiki/Replay_attack](http://en.wikipedia.org/wiki/Replay_attack)

## 中间人攻击
2 步验证无法防范中间人攻击。如果用户被引导到钓鱼网站，在上面输入了 OTP，攻击者可实时的利用此密码登录到真正的服务器中，并返回正常结果以迷惑用户。这也是有些银行声称令牌口令的安全性不如 U 盾的原因。

## 身份验证的未来
像马化腾所说，手机的便携性使其已经成为了人身体中的一部分[^mht]。但手机远远不是人体的一部分。作为身份验证的终极方案当然是基于生物特征的验证。手机上免费 OTP 软件可以增强几号的安全性，但体验无疑是变差了。iPhone 5s 在硬件上加上了指纹识别，这是个好的开始。虽然指纹这种东西作为身份标识已经不再可靠[^finger]，iPhone 5s 上的指纹识别被黑客们玩到崩坏[^ip_finger]。如果有一天基于可靠生物特征的廉价终端验证出现，并可以可靠的将验证结果传送给服务商才是身份验证的终极解决方案。

[^mht]: [马化腾演讲实录：腾讯若无微信可能面临灾难](http://tech.sina.com.cn/i/2013-11-16/12328920038.shtml)
[^ip_finger]: [https://203.208.46.145/search?hl=en&q=iphone5+finger+hack](https://203.208.46.145/search?hl=en&q=iphone5+finger+hack)

[^finger]: [Why Fingerprints Aren't the Proof We Thought They Were](http://www.psmag.com/legal-affairs/why-fingerprints-arent-proof-47079/)

如果将来实现了思想和身体的分离又该来如何验证身份，对人的某段思维来一个 md5 吗 ;-)？



[^wiki_two_step]: [http://en.wikipedia.org/wiki/Two-step_verification](http://en.wikipedia.org/wiki/Two-step_verification)



