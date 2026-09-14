# md2wechat

把 `_posts/` 下的 Jekyll Markdown 转成**微信公众号可以直接粘贴**的 HTML。

样式对齐 doocs/md 的玫瑰金主题（`#B76E79`）：三级标题左侧竖线 + 虚线下划线，加粗字主题色，表格圆角带阴影。

## 为什么不能用 KaTeX / 前端 MathJax

公众号编辑器会**丢掉 `<style>`、`class` 和 `<script>`**，只保留标签上的 `style` 内联属性。所以：

- **KaTeX** 输出的是 HTML + 一大堆 class，样式全靠外部 CSS → 粘进去直接散架；
- **前端 MathJax / KaTeX 脚本**根本不会执行；
- 唯一可靠的做法是**在本地把公式预渲染成内联 SVG**，SVG 自带全部字形路径，不依赖任何外部资源。

本脚本用 **MathJax 4（`@mathjax/src`）的 SVG 输出**，配置两点：

| 配置 | 作用 |
|---|---|
| `displayOverflow: 'linebreak'` | 超过 `--math-width` 的展示式**自动折行**（MathJax 3 不支持，必须 v4） |
| `fontCache: 'none'` | 字形直接内联，不走 `<defs>/<use>` 引用，粘贴后不会掉字 |

再套一层 `overflow-x: auto` 的 `<section>` 兜底：万一某个公式折不开（比如一个超长的连乘），在手机上可以左右拖动，不会撑破版心。

实测本仓库那篇 21 个公式的文章，`--math-width 340` 下最宽的一个是 318px，iPhone 竖屏一屏放得下。

## 安装

```bash
cd tools/md2wechat
npm install
```

## 用法

```bash
# 默认输出到 ~/Downloads/<同名>.html，产物不进仓库
node md2wechat.mjs ../../_posts/2026-09-14-prosperity-is-delta-not-level.md

# 指定输出
node md2wechat.mjs ../../_posts/xxx.md -o /tmp/preview.html

# 批量
node md2wechat.mjs ../../_posts/2026-*.md --out-dir ~/Downloads
```

| 参数 | 默认 | 说明 |
|---|---|---|
| `-o, --out` | — | 输出文件路径 |
| `--out-dir` | `~/Downloads` | 输出目录 |
| `--width` | `750` | 预览容器宽度（公众号里实际按屏宽走，只影响本地预览） |
| `--math-width` | `340` | 公式折行参考宽度，按手机屏宽留边距；想让公式更紧凑就调小 |
| `--color` | `#B76E79` | 主题色（标题竖线、加粗字、链接） |
| `--text-color` | `#3f3f3f` | 正文颜色 |
| `--font-size` | `16` | 正文字号 px |
| `--with-title` | 关 | 把 front matter 的 `title` 渲染成居中 h1 |

## 粘贴到公众号

1. 浏览器打开生成的 HTML；
2. `Ctrl+A` 全选 → `Ctrl+C`；
3. 公众号后台编辑器里 `Ctrl+V`。

注意：

- **图片不会跟着过去**。文中 `/assets/imgs/...` 是站内相对路径，粘贴后是坏图，需要在公众号编辑器里重新上传（脚本会在输出末尾提示有几张）。
- 脚本已自动去掉 `<!--more-->`。
- 脚注会渲染成文末「参考与注释」小字块；公众号不支持页内锚点跳转，脚注只能靠编号对照。

## 处理的 Markdown 语法

段落、`h1`–`h4`、加粗、斜体、删除线、链接、行内代码、代码块、引用、有序/无序列表、表格（自带横向滚动）、分割线、图片、脚注、行内 `$...$` 与展示 `$$...$$` 公式、以及原文里直接写的 HTML（如题图 `<img class="headimg">`）。
