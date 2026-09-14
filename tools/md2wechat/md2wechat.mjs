#!/usr/bin/env node
/**
 * md2wechat —— 把 _posts 下的 Jekyll Markdown 转成微信公众号可直接粘贴的 HTML。
 *
 * 公众号编辑器会丢掉 <style>、class 和 <script>，所以：
 *   1. 所有样式必须内联到每个标签的 style 属性上；
 *   2. LaTeX 公式必须在本地预渲染成内联 SVG（不能靠前端 MathJax/KaTeX 脚本）。
 *
 * 公式用 MathJax 4 的 SVG 输出，开启 displayOverflow: 'linebreak'，
 * 按手机屏宽（--math-width，默认 340px）自动折行；万一还是超宽，
 * 外层 section 有 overflow-x: auto，可以左右拖动。
 *
 * 用法（默认输出到 ~/Downloads，产物不进仓库）：
 *   node md2wechat.mjs ../../_posts/2026-09-14-xxx.md
 *   node md2wechat.mjs ../../_posts/*.md --out-dir /some/dir
 *   node md2wechat.mjs post.md --math-width 300 --color "#B76E79" --with-title
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import MarkdownIt from 'markdown-it';
import footnotePlugin from 'markdown-it-footnote';

import { mathjax } from '@mathjax/src/js/mathjax.js';
import { TeX } from '@mathjax/src/js/input/tex.js';
import { SVG } from '@mathjax/src/js/output/svg.js';
import { liteAdaptor } from '@mathjax/src/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from '@mathjax/src/js/handlers/html.js';
import { MathJaxNewcmFont } from '@mathjax/mathjax-newcm-font/js/svg.js';
import '@mathjax/src/js/input/tex/base/BaseConfiguration.js';
import '@mathjax/src/js/input/tex/ams/AmsConfiguration.js';
import '@mathjax/src/js/input/tex/newcommand/NewcommandConfiguration.js';
import '@mathjax/src/js/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import '@mathjax/src/js/input/tex/textmacros/TextMacrosConfiguration.js';

// ---------------------------------------------------------------- 参数解析

const argv = process.argv.slice(2);
const opts = {
  files: [],
  outDir: null,
  out: null,
  width: 750, // 预览容器宽度，公众号里实际按屏宽走
  mathWidth: 340, // 公式折行参考宽度（手机一屏约 375px，留出边距）
  color: '#B76E79', // 主题色
  text: '#3f3f3f', // 正文颜色
  fontSize: 16,
  withTitle: false, // 是否把 front matter 的标题渲染成 h1
};

for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--out' || a === '-o') opts.out = argv[++i];
  else if (a === '--out-dir') opts.outDir = argv[++i];
  else if (a === '--width') opts.width = Number(argv[++i]);
  else if (a === '--math-width') opts.mathWidth = Number(argv[++i]);
  else if (a === '--color') opts.color = argv[++i];
  else if (a === '--text-color') opts.text = argv[++i];
  else if (a === '--font-size') opts.fontSize = Number(argv[++i]);
  else if (a === '--with-title') opts.withTitle = true;
  else if (a === '-h' || a === '--help') {
    console.log(fs.readFileSync(new URL('./README.md', import.meta.url), 'utf8'));
    process.exit(0);
  } else if (a.startsWith('-')) {
    console.error(`未知参数：${a}`);
    process.exit(1);
  } else opts.files.push(a);
}

if (opts.files.length === 0) {
  console.error('用法：node md2wechat.mjs <post.md> [-o out.html] [--out-dir dir]');
  process.exit(1);
}

// ---------------------------------------------------------------- 样式表

const FONT_FAMILY =
  '-apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif';

const base = `text-align: left; line-height: 1.75; font-family: ${FONT_FAMILY}; font-size: ${opts.fontSize}px`;

const css = {
  section: base,
  p: `${base}; margin: 1.5em 8px; letter-spacing: 0.1em; color: ${opts.text}`,
  h1: `${base}; font-size: ${opts.fontSize * 1.5}px; text-align: center; margin: 2em 8px 1em; color: ${opts.text}; font-weight: bold`,
  h2: `${base}; line-height: 1.2; font-size: ${opts.fontSize * 1.3}px; margin: 2em 8px 0.75em 0; padding: 0.3em 0.8em; color: #fff; background: ${opts.color}; border-radius: 4px; display: inline-block; font-weight: bold`,
  h3: `${base}; line-height: 1.2; font-size: ${opts.fontSize * 1.2}px; padding-left: 12px; border-left: 4px solid ${opts.color}; margin: 2em 8px 0.75em 0; color: ${opts.text}; font-weight: bold; border-bottom: 1px dashed ${opts.color}`,
  h4: `${base}; line-height: 1.2; font-size: ${opts.fontSize * 1.1}px; margin: 1.5em 8px 0.6em 0; color: ${opts.color}; font-weight: bold`,
  strong: `${base}; font-size: inherit; color: ${opts.color}; font-weight: bold`,
  em: `${base}; font-size: inherit; font-style: italic; color: ${opts.text}`,
  del: `${base}; font-size: inherit; color: #999; text-decoration: line-through`,
  a: `${base}; font-size: inherit; color: ${opts.color}; text-decoration: none; border-bottom: 1px solid ${opts.color}`,
  blockquote: `${base}; margin: 1.5em 8px; padding: 1em; border-left: 4px solid ${opts.color}; background: rgba(0, 0, 0, 0.03); color: #6a6a6a; border-radius: 0 4px 4px 0`,
  blockquoteP: `${base}; margin: 0; letter-spacing: 0.1em; color: #6a6a6a`,
  ul: `${base}; margin: 1.5em 8px; padding-left: 1.5em; color: ${opts.text}; list-style-type: disc`,
  ol: `${base}; margin: 1.5em 8px; padding-left: 1.5em; color: ${opts.text}; list-style-type: decimal`,
  li: `${base}; margin: 0.4em 0; letter-spacing: 0.1em; color: ${opts.text}`,
  code: `font-family: Menlo, Operator Mono, Consolas, Monaco, monospace; font-size: 90%; background: rgba(27, 31, 35, 0.05); padding: 2px 4px; border-radius: 3px; color: #c7254e; word-break: break-all`,
  preWrap: `margin: 1.5em 8px; border-radius: 6px; overflow-x: auto; background: #f7f7f7`,
  pre: `font-family: Menlo, Operator Mono, Consolas, Monaco, monospace; font-size: 14px; line-height: 1.6; margin: 0; padding: 1em; display: block; overflow-x: auto; color: #333; background: #f7f7f7`,
  tableWrap: `margin: 1.5em 8px; overflow-x: auto; -webkit-overflow-scrolling: touch`,
  table: `${base}; color: ${opts.text}; border-collapse: separate; border-spacing: 0; border-radius: 8px; margin: 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden`,
  thead: `${base}; font-weight: bold`,
  th: `${base}; border: 1px solid #dfdfdf; padding: 0.25em 0.5em; color: ${opts.text}; word-break: keep-all; background: rgba(0, 0, 0, 0.05)`,
  td: `${base}; border: 1px solid #dfdfdf; padding: 0.5em 1em; color: ${opts.text}; word-break: keep-all`,
  hr: `border: none; border-top: 1px solid #dfdfdf; margin: 2em 8px`,
  img: `display: block; max-width: 100%; margin: 1.5em auto; border-radius: 4px`,
  // 公式：块级用可横向滚动的容器兜底，行内跟着文字走
  mathBlock: `margin: 1.5em 8px; text-align: center; overflow-x: auto; -webkit-overflow-scrolling: touch; line-height: 1`,
  mathInline: `display: inline-block; line-height: 1; vertical-align: middle; max-width: 100%; overflow-x: auto`,
  footnoteSection: `${base}; margin: 2em 8px 0; padding-top: 1em; border-top: 1px solid #dfdfdf; font-size: ${opts.fontSize - 2}px; color: #888`,
  footnoteItem: `${base}; font-size: ${opts.fontSize - 2}px; margin: 0.5em 0; color: #888; word-break: break-all`,
  footnoteRef: `font-size: 75%; color: ${opts.color}; vertical-align: super; line-height: 0`,
};

// ---------------------------------------------------------------- MathJax

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const mathDoc = mathjax.document('', {
  InputJax: new TeX({ packages: ['base', 'ams', 'newcommand', 'boldsymbol', 'textmacros'] }),
  OutputJax: new SVG({
    fontCache: 'none', // 不用 <use>/<defs> 引用，每个公式自包含，粘贴到公众号才不会丢字形
    font: new MathJaxNewcmFont(),
    displayOverflow: 'linebreak', // 关键：太长的展示式自动折行
    linebreaks: { inline: true, width: '100%', lineleading: 0.25 },
  }),
});

function renderMath(tex, display) {
  const node = mathDoc.convert(tex, {
    display,
    em: opts.fontSize,
    ex: opts.fontSize / 2,
    containerWidth: display ? opts.mathWidth : opts.mathWidth * 2,
  });
  // 只取 <svg>，丢掉 <mjx-container>（公众号不认自定义标签）
  return adaptor.innerHTML(node).replace(/<mjx-assistive-mml[\s\S]*?<\/mjx-assistive-mml>/g, '');
}

// ---------------------------------------------------------------- 公式占位

const mathStore = [];
const MATH_TOKEN = (i) => `%%MJXMATH${i}%%`;

/** 把 $$...$$ 和 $...$ 摘出来换成占位符，跳过代码块和行内代码 */
function stashMath(src) {
  const re =
    /(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)|(\$\$[\s\S]+?\$\$)|(\$(?!\s)(?:\\[\s\S]|[^$\\\n])+?\$)/g;
  return src.replace(re, (m, code, block, inline) => {
    if (code) return code;
    const tex = block ? block.slice(2, -2) : inline.slice(1, -1);
    mathStore.push({ tex: tex.trim(), display: Boolean(block) });
    return MATH_TOKEN(mathStore.length - 1);
  });
}

/** 渲染完 markdown 之后把占位符换回 SVG */
function unstashMath(html) {
  // 独占一段的展示式：整个 <p> 换成可滚动的 section
  html = html.replace(
    /<p[^>]*>\s*%%MJXMATH(\d+)%%\s*<\/p>/g,
    (_, i) => mathSection(mathStore[Number(i)])
  );
  // 其余（行内公式，或和文字混排的）
  return html.replace(/%%MJXMATH(\d+)%%/g, (_, i) => {
    const item = mathStore[Number(i)];
    if (item.display) return mathSection(item);
    return `<span style="${css.mathInline}">${renderMath(item.tex, false)}</span>`;
  });
}

function mathSection(item) {
  return `<section style="${css.mathBlock}">${renderMath(item.tex, true)}</section>`;
}

// ---------------------------------------------------------------- markdown-it

const md = new MarkdownIt({ html: true, breaks: false, linkify: false, typographer: false });
md.use(footnotePlugin);

function styleTag(tag, style) {
  return (tokens, idx, options, env, self) => {
    tokens[idx].attrSet('style', style);
    return self.renderToken(tokens, idx, options);
  };
}

const R = md.renderer.rules;
R.paragraph_open = (tokens, idx, options, env, self) => {
  // 引用块里的段落用更收敛的样式
  const inQuote = env.__inQuote > 0;
  tokens[idx].attrSet('style', inQuote ? css.blockquoteP : css.p);
  return self.renderToken(tokens, idx, options);
};
R.heading_open = (tokens, idx, options, env, self) => {
  const style = css[tokens[idx].tag] || css.h3;
  tokens[idx].attrSet('style', style);
  return self.renderToken(tokens, idx, options);
};
R.strong_open = styleTag('strong', css.strong);
R.em_open = styleTag('em', css.em);
R.s_open = styleTag('s', css.del);
R.link_open = styleTag('a', css.a);
R.bullet_list_open = styleTag('ul', css.ul);
R.ordered_list_open = styleTag('ol', css.ol);
R.list_item_open = styleTag('li', css.li);
R.hr = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('style', css.hr);
  return self.renderToken(tokens, idx, options);
};
R.image = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('style', css.img);
  return self.renderToken(tokens, idx, options);
};
R.blockquote_open = (tokens, idx, options, env, self) => {
  env.__inQuote = (env.__inQuote || 0) + 1;
  tokens[idx].attrSet('style', css.blockquote);
  return self.renderToken(tokens, idx, options);
};
R.blockquote_close = (tokens, idx, options, env, self) => {
  env.__inQuote = Math.max(0, (env.__inQuote || 1) - 1);
  return self.renderToken(tokens, idx, options);
};
R.table_open = () => `<section style="${css.tableWrap}"><table style="${css.table}">`;
R.table_close = () => '</table></section>';
R.thead_open = styleTag('thead', css.thead);
R.th_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('style', css.th);
  return self.renderToken(tokens, idx, options);
};
R.td_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('style', css.td);
  return self.renderToken(tokens, idx, options);
};
R.code_inline = (tokens, idx) =>
  `<code style="${css.code}">${md.utils.escapeHtml(tokens[idx].content)}</code>`;
R.fence = R.code_block = (tokens, idx) =>
  `<section style="${css.preWrap}"><pre style="${css.pre}"><code>${md.utils.escapeHtml(
    tokens[idx].content
  )}</code></pre></section>`;

// 脚注
R.footnote_ref = (tokens, idx, options, env, self) => {
  const n = Number(tokens[idx].meta.id + 1).toString();
  const id = `fn${n}`;
  return `<sup style="${css.footnoteRef}"><a href="#${id}" style="${css.a}; border: none">[${n}]</a></sup>`;
};
R.footnote_block_open = () =>
  `<section style="${css.footnoteSection}"><p style="${css.footnoteItem}; font-weight: bold">参考与注释</p>`;
R.footnote_block_close = () => '</section>';
R.footnote_open = (tokens, idx) => {
  const n = Number(tokens[idx].meta.id + 1).toString();
  return `<p id="fn${n}" style="${css.footnoteItem}">[${n}] `;
};
R.footnote_close = () => '</p>';
R.footnote_anchor = () => '';

// ---------------------------------------------------------------- 主流程

function parseFrontMatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv && kv[2]) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: src.slice(m[0].length) };
}

function convert(file) {
  mathStore.length = 0;
  const raw = fs.readFileSync(file, 'utf8');
  const { meta, body } = parseFrontMatter(raw);

  let src = body
    .replace(/^\s*<!--\s*more\s*-->\s*$/gm, '') // 公众号不需要摘要分隔符
    .replace(/^\s*<img[^>]*class=["']headimg["'][^>]*>\s*$/gm, (m) =>
      // 题图：保留但套上居中样式，src 是站内相对路径时提醒一下
      m.replace(/<img/, `<img style="${css.img}"`)
    );

  src = stashMath(src);
  let html = md.render(src);
  html = unstashMath(html);

  // 首段去掉上边距，贴过去更紧凑
  html = html.replace(/<p style="([^"]*)"/, '<p style="$1;margin-top: 0"');

  const title = opts.withTitle && meta.title ? `<h1 style="${css.h1}">${meta.title}</h1>` : '';

  return `<html><head><meta charset="utf-8" /></head><body><div style="width: ${opts.width}px; margin: auto;"><section style="${css.section}">
${title}
${html}
</section></div></body></html>`;
}

for (const file of opts.files) {
  const abs = path.resolve(file);
  const out =
    opts.out ||
    path.join(
      opts.outDir ? path.resolve(opts.outDir) : path.join(os.homedir(), 'Downloads'),
      path.basename(abs).replace(/\.md$/i, '.html')
    );
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const html = convert(abs);
  fs.writeFileSync(out, html, 'utf8');
  const localImgs = (html.match(/src="\/(?:assets|images)\/[^"]*"/g) || []).length;
  console.log(`✓ ${path.basename(abs)} → ${out}  (${mathStore.length} 个公式${localImgs ? `，${localImgs} 张站内图片需手动上传` : ''})`);
}
