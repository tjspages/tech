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
- **Concise and direct** expression, avoiding redundancy
- **Accurate technical terminology** with clear concept explanations
- **Colloquial elements** including internet slang

**Structure Patterns:**
- **Clear, focused titles** pointing directly to core topics
- **`<!--more-->` tags** for article excerpt separation
- **Clean paragraph breaks** with extensive use of h3 headings
- **Rich visual content** with technical diagrams and illustrations

**Technical Article Style:**
- **Practical orientation**: Concrete command-line examples and code snippets
- **Progressive depth**: Complex concepts explained through simple examples
- **Mathematical notation**: MathJax-rendered formulas when appropriate
- **Comprehensive references**: Extensive external links and footnotes

**Investment Article Style:**
- **Rational analysis**: Data-driven and logic-based reasoning
- **Personal reflection**: Honest documentation of investment mistakes and lessons
- **Clear value positions**: Definitive stance on speculation and market phenomena
- **Practical experience**: Sharing specific investment strategies and operations

**Expression Approach:**
- **Objective and calm**: Fact-based analysis avoiding emotional language
- **Logical rigor**: Clear argumentation process with evidence-based conclusions
- **Self-critical**: Willingness to acknowledge errors and limitations
- **Pragmatic attitude**: Focus on practical effects and actionable insights

### Content Writing Guidelines
When creating new content for this blog:
- Use Chinese as primary language with English technical terms when appropriate
- Structure articles with clear h3 sections and `<!--more-->` excerpt breaks
- Include relevant code examples, mathematical formulas, or data visualizations
- Maintain objective, analytical tone with personal insights
- Add appropriate tags reflecting the article's technical domain or investment theme
- Reference external sources with links and footnotes
- Use images stored in `assets/imgs/` directory with descriptive alt text