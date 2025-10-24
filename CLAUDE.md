# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Technology Stack

This is a Jekyll static site blog using Jekyll-Bootstrap framework with the following key components:
- **Jekyll**: Static site generator
- **Ruby**: Jekyll is built on Ruby with Rake build tasks
- **Markdown**: Content written in Markdown with Kramdown parser
- **Liquid**: Templating engine for Jekyll
- **Bootstrap**: Frontend framework (version 2.2.2)
- **Google Code Prettify**: Syntax highlighting for code blocks
- **MathJax**: Mathematical notation rendering
- **jQuery**: JavaScript library

## Common Development Commands

### Building and Previewing
```bash
# Preview the site locally with auto-regeneration
rake preview
# Alternative: jekyll --auto --server

# Build site without preview
jekyll --no-auto --safe
```

### Content Creation
```bash
# Create a new blog post
rake post title="Post Title" [date="2023-12-01"] [tags="[tag1,tag2]"]

# Create a new page
rake page name="page-name.html"
```

### Theme Management
```bash
# Switch between available themes
rake theme:switch name="stephen"        # Current active theme
rake theme:switch name="the-minimum"
rake theme:switch name="the-program" 
rake theme:switch name="twitter"
rake theme:switch name="mark-reid"

# Install new theme from git
rake theme:install git="https://github.com/jekyllbootstrap/theme-name.git"

# Package existing theme
rake theme:package name="theme-name"
```

## Architecture Overview

### Jekyll-Bootstrap Structure
- `_config.yml`: Main configuration with site settings, theme configuration, and plugin settings
- `_posts/`: Blog posts in Markdown format following `YYYY-MM-DD-title.md` naming convention
- `_includes/`: Reusable template components organized by functionality:
  - `JB/`: Core Jekyll-Bootstrap helpers (analytics, comments, sharing, navigation)
  - `themes/`: Theme-specific templates for different visual designs
  - `custom/`: Custom overrides for default helpers
  - `ever/`: Additional custom helpers
- `_layouts/`: Page layout templates that wrap content
- `assets/`: Static assets (CSS, JS, images) organized by theme
- `_site/`: Generated static site (excluded from version control)

### Theme System
The site uses a sophisticated theme switching system:
- Current active theme: "stephen" (Chinese/English bilingual tech blog)
- Themes are stored in `_includes/themes/` and `assets/themes/`
- Each theme has its own layouts, CSS, and assets
- Theme switching is handled via Rake tasks that update `_layouts/`

### Content Organization
- **Posts**: Technical articles covering programming, infrastructure, and finance topics
- **Pages**: Static pages like About, Archive, Tags
- **Multilingual**: Content primarily in Chinese with some English
- **Categories/Tags**: Content is organized using Jekyll's tagging system
- **Pagination**: 6 posts per page configured

### Key Features
- **Syntax Highlighting**: Google Code Prettify with multiple language support
- **Math Rendering**: MathJax for mathematical notation
- **Comments**: Disqus integration (short_name: makeadifferencetech)
- **Analytics**: Google Analytics (tracking_id: UA-8816834-6)
- **Responsive Design**: Bootstrap-based responsive layouts
- **SEO**: Sitemap, RSS/Atom feeds, meta descriptions

### Git Workflow
- **Main Branch**: `gh-pages` (GitHub Pages deployment)
- **Hooks**: Custom Jekyll build hook in `_hooks/jekyll.sh` for automated deployment
- **Generated Files**: `_site/` directory contains built static files

### Development Notes
- Posts support Chinese and English content
- Images stored in `assets/imgs/` and `images/` directories
- Custom JavaScript for table of contents (`toc.js`) and image lazy loading
- Site uses CDN resources (apps.bdimg.com) for Bootstrap and jQuery
- Google verification file and Baidu analytics integration present

## Content Style and Writing Guidelines

### Content Evolution
**2013-2018 (Technical Phase):**
- System tools and debugging (strace, nginx configuration)
- Programming languages and frameworks (PHP, Laravel, Rails)
- Algorithms and data structures (Bloom Filter, stock profit algorithms)
- Web development technologies (Jekyll, Git workflows)
- Performance optimization and troubleshooting

**2021 (Investment Phase):**
- Financial market analysis (social media impact on markets)
- Investment strategies and risk management (fund investing, options trading)
- Personal investment reviews and reflections
- Views on emerging asset classes (Bitcoin, cryptocurrency)

### Writing Style Characteristics

**Language Features:**
- **Primary Chinese** with English technical terms and quotes
- **Chinese full-width punctuation**: All Chinese text must use Chinese full-width punctuation marks (。、,;:?!)
- **Proper quotation marks**: Use matched pairs of ""for double quotes and ''for single quotes in Chinese text
- **Concise and direct** expression, avoiding redundancy
- **Accurate technical terminology** with clear concept explanations
- **Colloquial elements**: Natural conversational tone including internet slang and everyday expressions (e.g., "把投资玩成了赌博", "抄作业")

**Structure Patterns:**
- **Clear, focused titles** pointing directly to core topics, often using descriptive phrases or questions
- **`<!--more-->` tag** placed after the opening hook/introduction (typically within first 2-3 paragraphs)
- **Hierarchical headings**: Use `###` for section headers (h3), numbered lists for subsections
- **Clean paragraph breaks**: Short paragraphs with blank lines between them for better readability
- **Rich visual content**: Lead images with `class="headimg"`, inline diagrams, charts, and screenshots
- **Image placement**: Centered images often wrapped in `<p style="text-align:center">` or `<p align="center">` tags

**Technical Article Style (2013-2018):**
- **Practical orientation**: Concrete command-line examples in `<pre>` blocks
- **Tool-focused**: Real-world usage scenarios and parameter explanations
- **Progressive depth**: Start with simple use cases, build to complex scenarios
- **Code snippets**: Command examples with actual output
- **Mathematical notation**: MathJax-rendered formulas with LaTeX syntax (e.g., $formula$)
- **Comprehensive references**: Bullet-pointed reference lists at the end with Chinese and English sources
- **Debugging mindset**: Focus on problem-solving and troubleshooting approaches

**Investment Article Style (2021-2025):**
- **Structured analysis**: Multi-section format with clear numbered/titled sections
- **Data-driven arguments**: Specific numbers, percentages, dates, and historical data
- **Personal reflection**: Honest documentation of mistakes and lessons learned (e.g., "二万元的学费")
- **Clear value positions**: Definitive stance on speculation and market phenomena
- **Practical experience**: Sharing specific investment strategies with implementation details
- **Risk disclosure**: Explicit warnings about risks, often with bold text emphasis
- **Scholarly rigor**: Extensive footnote citations using `[^1]` format with full reference list
- **Metaphorical explanations**: Complex concepts explained through analogies (e.g., "房租式生意")
- **Summary sections**: Concluding thoughts that distill key insights

**Expression Approach:**
- **Objective and calm**: Fact-based analysis avoiding emotional language
- **Logical rigor**: Clear argumentation process with evidence-based conclusions
- **Reliable sources**: All arguments and claims must be supported by credible citations and references
- **Self-critical**: Willingness to acknowledge errors and limitations (e.g., "贪婪", "犯了错误")
- **Pragmatic attitude**: Focus on practical effects and actionable insights
- **Reader empathy**: Addressing common concerns and misconceptions directly
- **Balanced perspective**: Presenting multiple viewpoints before concluding

### Content Writing Guidelines

**Article Structure Template:**
```markdown
---
title: [清晰直接的标题]
author: Stephen
layout: post
tags:
    - [主要标签]
    - [次要标签]
---

<img src="/assets/imgs/[图片文件名]" alt="[描述]" class="headimg" />

[开篇段落：直接切入主题，提出问题或观点]

<!--more-->

### [一级小标题]
[内容段落...]

### [二级小标题]
[内容段落...]

## [参考文献或总结]
[相关链接和引用]
```

**Writing Best Practices:**

1. **Opening Hook**: Start with a compelling scenario, question, or observation that immediately engages readers
2. **Use `<!--more-->` correctly**: Place after 1-3 opening paragraphs to create an effective excerpt
3. **Section organization**:
   - Use `###` (h3) for main sections
   - Use numbered lists (一、二、三) or clear titles for subsections
   - Keep sections focused with 3-5 paragraphs each
4. **Paragraph style**:
   - Short paragraphs (2-4 sentences)
   - Double line breaks between paragraphs for readability
   - One idea per paragraph
5. **Code and commands** (for technical articles):
   - Wrap in `<pre>` blocks for command-line examples
   - Show actual output when helpful
   - Add brief explanations before or after code blocks
6. **Mathematical formulas** (when needed):
   - Use inline LaTeX: `$formula$`
   - Display mode for important equations: `$$formula$$`
   - Explain formulas in plain language
7. **Images**:
   - Store in `assets/imgs/` directory
   - Lead image: `<img src="/assets/imgs/file.jpg" alt="description" class="headimg" />`
   - Centered images: Wrap in `<p style="text-align:center">` or `<p align="center">`
   - Always provide descriptive alt text
8. **References and citations**:
   - Use footnote format `[^1]` for investment/research articles
   - Include full reference list at end with `[^1]:` format
   - For technical articles, use bullet-pointed reference section
9. **Tone and voice**:
   - Write conversationally but maintain professionalism
   - Use "我" for personal experiences and lessons
   - Address reader directly when appropriate ("你可以...", "如果...")
   - Be honest about mistakes and limitations
10. **Tags selection**:
    - 2-4 tags per article
    - Technical articles: tool names, technologies, concepts
    - Investment articles: 投资, 风险管理, 复盘, etc.
    - Be consistent with existing tag taxonomy
11. **Formatting emphasis**:
    - **Bold** for key concepts and important warnings
    - *Italics* sparingly
    - Use bullet points for lists and key takeaways
    - Block quotes `>` for important citations
12. **Final review checklist**:
    - [ ] Chinese full-width punctuation throughout
    - [ ] Proper quotation marks ("" not "")
    - [ ] `<!--more-->` tag present
    - [ ] Images properly referenced and alt text provided
    - [ ] All links and references verified
    - [ ] Tags appropriate and consistent
    - [ ] Spelling and grammar checked