/*!
 * 文章目录
 *
 * 直接复用 kramdown 给标题生成的 id（#基本概念），不再自己插 #toc0 这种序号锚点。
 * 当前章节用 IntersectionObserver 触发、每次都读实时位置来判断，
 * 所以题图和 MathJax 公式渲染完导致正文高度变化后，高亮依然是准的。
 *
 * 无第三方依赖。取代原来的 jQuery toc 插件 (Greg Allen, 2013, MIT)。
 */
(function () {
    'use strict';

    var CONFIG = {
        toc: '#toc',
        content: '.post-full',
        headings: 'h2, h3',
        // 少于这么多标题就不显示目录
        minHeadings: 3,
        // 标题离视口顶部多近算"当前章节"，和 CSS 里的 scroll-margin-top 对应
        activeOffset: 90
    };

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function prefersMotion() {
        return !window.matchMedia ||
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // kramdown 正常都会给出 id，这里只是兜底（比如标题里全是标点）
    function slugify(text, used) {
        var base = text.trim().toLowerCase()
            .replace(/[\s　]+/g, '-')
            .replace(/[^0-9a-z一-龥_-]/g, '')
            .replace(/-{2,}/g, '-')
            .replace(/^-+|-+$/g, '') || 'section';
        var id = base;
        var n = 2;
        while (used[id]) {
            id = base + '-' + n++;
        }
        used[id] = true;
        return id;
    }

    ready(function () {
        var toc = document.querySelector(CONFIG.toc);
        var content = document.querySelector(CONFIG.content);
        if (!toc || !content) {
            return;
        }

        var headings = [].slice.call(content.querySelectorAll(CONFIG.headings));
        if (headings.length < CONFIG.minHeadings) {
            return;
        }

        var used = {};
        headings.forEach(function (h) {
            if (h.id) {
                used[h.id] = true;
            }
        });

        var nav = document.createElement('nav');
        nav.setAttribute('aria-label', '目录');

        var caption = document.createElement('p');
        caption.className = 'toc-caption';
        caption.textContent = '目录';

        var list = document.createElement('ul');

        var items = headings.map(function (h) {
            if (!h.id) {
                h.id = slugify(h.textContent, used);
            }
            var link = document.createElement('a');
            link.href = '#' + h.id;
            link.textContent = h.textContent.trim();
            link.setAttribute('data-target', h.id);

            var item = document.createElement('li');
            item.className = 'toc-' + h.tagName.toLowerCase();
            item.appendChild(link);
            list.appendChild(item);
            return item;
        });

        nav.appendChild(caption);
        nav.appendChild(list);
        toc.appendChild(nav);

        list.addEventListener('click', function (e) {
            var link = e.target;
            while (link && link !== list && link.tagName !== 'A') {
                link = link.parentNode;
            }
            if (!link || link.tagName !== 'A') {
                return;
            }
            var target = document.getElementById(link.getAttribute('data-target'));
            if (!target) {
                return;
            }
            e.preventDefault();
            // block:'start' 会尊重 CSS 的 scroll-margin-top，标题不会贴着视口顶边
            target.scrollIntoView({
                block: 'start',
                behavior: prefersMotion() ? 'smooth' : 'auto'
            });
            if (window.history && history.replaceState) {
                history.replaceState(null, '', link.getAttribute('href'));
            } else {
                location.hash = link.getAttribute('href');
            }
        });

        var activeItem = null;

        // 目录自身滚动时，别让高亮项跑到可视区外面去
        function keepVisible(item) {
            var box = toc.getBoundingClientRect();
            var row = item.getBoundingClientRect();
            if (row.top < box.top) {
                toc.scrollTop -= (box.top - row.top);
            } else if (row.bottom > box.bottom) {
                toc.scrollTop += (row.bottom - box.bottom);
            }
        }

        function setActive(item) {
            if (!item || item === activeItem) {
                return;
            }
            if (activeItem) {
                activeItem.classList.remove('toc-active');
            }
            item.classList.add('toc-active');
            activeItem = item;
            keepVisible(item);
        }

        function sync() {
            var index = 0;
            for (var i = 0; i < headings.length; i++) {
                // 每次都问实时位置，不缓存偏移量
                if (headings[i].getBoundingClientRect().top <= CONFIG.activeOffset) {
                    index = i;
                } else {
                    break;
                }
            }
            setActive(items[index]);
        }

        var scheduled = false;
        var raf = window.requestAnimationFrame || function (fn) { return setTimeout(fn, 16); };

        function schedule() {
            if (scheduled) {
                return;
            }
            scheduled = true;
            raf(function () {
                scheduled = false;
                sync();
            });
        }

        // IntersectionObserver 负责捕捉"内容重排"——图片、公式渲染完标题位置会变，
        // 这时并没有滚动事件，只有它会触发。
        if (window.IntersectionObserver) {
            var observer = new IntersectionObserver(schedule, {
                rootMargin: '-' + CONFIG.activeOffset + 'px 0px 0px 0px'
            });
            headings.forEach(function (h) {
                observer.observe(h);
            });
        }
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        window.addEventListener('load', schedule);
        schedule();
    });
})();
