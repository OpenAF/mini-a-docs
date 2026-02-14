# Plan: Build mini-a Documentation Site

## Context

The `mini-a-docs` repository is currently empty (all previous content was removed in commit 6e84343). We need to build a fresh static documentation site for **mini-a** — a minimalist autonomous agent framework built on OpenAF that uses LLMs, shell commands, and MCP servers to achieve user-defined goals. The site should use Jekyll + Minima theme, deploy to GitHub Pages, and follow a progressive disclosure pattern (simple first, detailed later). Screenshot placeholders will be used until real screenshots are captured.

---

## Site Structure

```
Navigation order (header):
  Home → Getting Started → Features → Examples → Cheatsheet → Advanced → Configuration

Additional pages (linked from content, not in nav):
  MCP Catalog | Use Cases | FAQ | 404
```

**10 content pages + infrastructure files + TODO.md**

---

## Files to Create

### 1. Infrastructure (create first)

| File | Purpose |
|------|---------|
| `_config.yml` | Jekyll config: title "mini-a", tagline, baseurl `/mini-a-docs`, Minima theme with auto skin, header_pages navigation, plugins (feed, seo-tag) |
| `Gemfile` | Jekyll ~3.10, minima from GitHub, kramdown-parser-gfm, jekyll-feed, jekyll-seo-tag |
| `.gitignore` | Standard Jekyll ignores (_site, .sass-cache, vendor, Gemfile.lock, .DS_Store) |
| `.github/workflows/jekyll.yml` | GitHub Actions: build Jekyll on push to main, deploy to Pages |
| `_includes/head-custom.html` | Favicon link, Open Graph meta, Twitter Card tags, SEO keywords |
| `assets/css/_style.scss` | Custom styles: hero, feature-grid, screenshot placeholders, cheatsheet layout, comparison tables, number bar, print styles, responsive breakpoints |
| `assets/images/favicon.svg` | Simple SVG favicon (terminal/agent icon) |

### 2. Content Pages

#### `index.md` — Landing Page (layout: home)
- **Hero**: Title "mini-a", tagline *"Your goals. Your LLM. One command."*, description, CTA buttons (Get Started + GitHub)
- **Screenshots section**: 2-column grid with `[SCREENSHOT-PLACEHOLDER]` for Web UI and Console
- **Numbers bar**: "10+ LLM Providers | 20+ MCP Servers | 100+ Parameters | 50-70% Cost Savings"
- **Feature cards** (3x2 grid): Multi-Model Support, Cost Optimization (70% savings), MCP Integration (20+ servers), Performance (40-60% fewer tokens), Flexible Interfaces (console/web/library/docker), Security First
- **Quick Example**: 3-step code walkthrough (set model → run → give goal), `[SCREENSHOT-PLACEHOLDER]` for terminal recording
- **How It Works**: Architecture overview with `[SCREENSHOT-PLACEHOLDER]` for diagram
- **CTA section**: "Ready to Get Started?"

#### `getting-started.md` — Quick Start Guide (layout: page)
- Prerequisites (OpenAF + API key)
- Installation (3 numbered steps)
- Model configuration table (6 providers: openai, google, anthropic, ollama, bedrock, github — one-line config each)
- `[SCREENSHOT-PLACEHOLDER]` for model manager TUI
- First Run — 3 interfaces: Console, Direct goal, Web UI — each with `[SCREENSHOT-PLACEHOLDER]`
- Docker Quick Start
- Basic console commands table
- File inclusion `@` syntax
- Mode presets table (shell, chatbot, internet, poweruser, etc.)
- Common issues / troubleshooting
- Next steps links

#### `features.md` — Feature Overview (layout: page)
- Multi-Model Support (provider list + config examples)
- Dual-Model Cost Optimization (concept, setup, savings table)
- Automatic Performance Optimizations
- MCP Integration (what is MCP, STDIO vs HTTP, link to catalog)
- Flexible Tool System (shell, utilities, custom)
- Multiple Interfaces (console, web, library, worker API) with `[SCREENSHOT-PLACEHOLDER]`s
- Planning & Delegation
- Chatbot Mode
- Custom Skills & Commands
- Docker Support
- Security Features
- Streaming Responses
- Conversation Management (/compact, /summarize)
- Metrics & Usage Tracking
- Visual Outputs (ASCII, charts, diagrams, maps)

#### `examples.md` — Recipes & Use Cases (layout: page)
- **Basic**: File operations, data processing, text tasks (copy-pasteable commands)
- **MCP Examples**: Time/date, database, web search, multiple MCPs with proxy
- **Advanced**: Chatbot, Git workflows, code generation, documentation
- **Integration**: Docker, oJob pipelines
- **Real-world teasers** (link to use-cases.md): Log analysis, code audit, data migration
- **Performance tips**: Low-cost models, dual-model, context management

#### `cheatsheet.md` — Quick Reference Card (layout: page) **[NEW]**
Dense, table-heavy, minimal prose — designed for daily use/bookmarking:
- Installation (1 command)
- Model Setup table (6 providers, one-line each)
- Common Commands table (~10 entries)
- Console Slash Commands table (~10 entries)
- Key Parameters table (~15 entries)
- File Inclusion syntax
- Mode Presets table
- Dual-Model Setup (3-line env block)
- Docker One-Liners
- MCP Quick Reference (5 most common servers)

#### `advanced.md` — Power User Guide (layout: page)
- Dual-Model Setup deep dive
- MCP Advanced: Proxy mode, custom servers, remote HTTP MCPs
- Performance tuning: context management, token optimization
- Advanced Shell: allowlists, Docker isolation
- Library Integration: JavaScript API, oJob workflows
- Planning Workflows: planstyle, planfile, validation
- Custom Tools (JS + YAML definitions)
- Delegation: local child agents, remote workers, dynamic registration
- Model Manager: encrypted storage, import/export
- Web Interface Advanced: auth, reverse proxy, branding
- Provider-Specific Guides: Bedrock, GitHub Models, Ollama
- Debugging: debug=true, log levels, metrics

#### `configuration.md` — Parameter Reference (layout: page)
Complete reference organized by category with tables (parameter | default | description):
1. Model Configuration
2. Core Parameters (goal, useshell, chatbotmode, maxsteps)
3. MCP Configuration (mcp, mcpproxy, mcpdynamic, mcplazy)
4. Tool Configuration (useutils, usetools, libs)
5. Context Management (maxcontext, maxtokens)
6. Planning (useplanning, planstyle, planfile, usethinking)
7. Shell Access (useshell, readwrite, shellallow, shellban)
8. Visual & Output (useascii, usemaps, usediagrams, usecharts, usestream, format)
9. Delegation (usedelegation, workers, maxconcurrent)
10. Web Interface (onport, auth, cors)
11. Knowledge & Persona (knowledge, youare, rules)
12. Rate Limiting (rpm, tpm)
13. Docker Environment Variables
14. Console Commands Reference
15. Mode Presets

#### `mcp-catalog.md` — MCP Server Directory (layout: page) **[NEW]**
Catalog of all 22 built-in MCPs from the `mcps/` directory:
- Summary table: Name | Description | Type | Key Tools
- Per-server sections with: description, arguments, tools list, copy-paste example
- Covers: mcp-time, mcp-db, mcp-file, mcp-web, mcp-shell, mcp-ssh, mcp-s3, mcp-net, mcp-fin, mcp-rss, mcp-email, mcp-kube, mcp-math, mcp-random, mcp-telco, mcp-weather, mcp-ch, mcp-mini-a, mcp-proxy, mcp-oaf, mcp-oafp, mcp-office
- STDIO vs HTTP usage patterns
- How to create custom MCPs (link to CREATING.md concepts)

#### `use-cases.md` — Real-World Scenarios (layout: page) **[NEW]**
Longer-form walkthroughs, each self-contained:
1. DevOps: Automated Log Analysis
2. Development: Code Review Assistant
3. Documentation: Auto-generate Project Docs
4. Data Engineering: CSV/JSON Processing
5. Security: Code Audit
6. Education: Interactive Learning (chatbot mode)
7. Integration: CI/CD Pipeline with oJob
8. Cost Optimization: Enterprise Dual-Model Strategy

Each with: context, commands, expected output, `[SCREENSHOT-PLACEHOLDER]`

#### `faq.md` — FAQ & Troubleshooting (layout: page) **[NEW]**
- General: What is mini-a? How does it compare to LangChain/AutoGPT/CrewAI? Is it free?
- Installation: OpenAF issues, platform support
- Models: Which model? Local models? API keys?
- MCP: What is MCP? Testing? Custom servers?
- Security: Shell safety, Docker isolation
- Performance: Token usage, cost tips
- Troubleshooting: Common error messages + fixes
- Includes comparison table (mini-a vs LangChain vs AutoGPT vs CrewAI)

#### `404.md` — Error Page (layout: default)
- Friendly message, links to popular pages

### 3. `TODO.md` — Screenshot Tracking

List of all screenshot placeholders with IDs, descriptions, recommended dimensions, and priority:

| ID | Page | What to Capture | Priority |
|----|------|----------------|----------|
| S1 | index | Web UI multi-step task with streaming | HIGH |
| S2 | index | Console interactive goal execution | HIGH |
| S3 | index | Terminal recording of 30s quick start | HIGH |
| S4 | index | Architecture diagram (SVG) | HIGH |
| S5 | getting-started | Model manager TUI | MEDIUM |
| S6 | getting-started | Console first-run step-by-step | HIGH |
| S7 | getting-started | Web UI first-run streaming | MEDIUM |
| S8 | features | Token stats with dual-model cost breakdown | MEDIUM |
| S9 | features | MCP test console listing tools | MEDIUM |
| S10 | features | Web UI with session management | LOW |
| S11 | features | Console with tab completion | LOW |
| S12 | examples | MCP proxy combining multiple servers | MEDIUM |
| S13 | examples | Before/after auto-generated docs | LOW |
| S14 | advanced | Debug output showing model escalation | LOW |
| S15 | advanced | MCP proxy aggregation diagram | MEDIUM |
| S16-S23 | use-cases | Terminal output for each scenario (8) | LOW |

---

## Marketing / Advertisement Suggestions

**Tagline options** (pick one for hero):
1. *"Your goals. Your LLM. One command."* — emphasizes simplicity
2. *"The autonomous agent that fits in your terminal."* — emphasizes minimalism
3. *"10+ LLMs. 20+ tools. Zero dependencies."* — emphasizes breadth

**Feature card copy** (punchy, benefit-focused):
- "Any LLM, your choice" — Switch providers with one config line
- "Cut costs by 70%" — Dual-model routes simple tasks cheaply
- "20+ tools, zero code" — MCP servers for time, finance, data, and more
- "40-60% fewer tokens" — Built-in optimization, fully automatic
- "Console. Web. Library. Docker." — Use it however you want
- "Secure by default" — Shell off, read-only, keys encrypted

**Comparison table** (FAQ page): mini-a vs LangChain vs AutoGPT vs CrewAI across setup complexity, lines to first agent, provider count, cost optimization, MCP support, footprint

**Numbers bar** (landing page): `10+ LLM Providers | 20+ MCP Servers | 100+ Parameters | 50-70% Cost Savings | 4 Interfaces`

---

## Implementation Order

1. Infrastructure: `_config.yml`, `Gemfile`, `.gitignore`, `.github/workflows/jekyll.yml`
2. Styling: `assets/css/_style.scss`, `_includes/head-custom.html`, `assets/images/favicon.svg`
3. Landing page: `index.md`
4. Core flow: `getting-started.md` → `features.md` → `examples.md`
5. Quick reference: `cheatsheet.md`
6. Deep content: `advanced.md` → `configuration.md`
7. New pages: `mcp-catalog.md` → `use-cases.md` → `faq.md`
8. Utility: `404.md`
9. Tracking: `TODO.md`

---

## Verification

1. Run `bundle install && bundle exec jekyll serve` locally to verify the site builds and renders
2. Check all navigation links work
3. Verify responsive layout on mobile widths
4. Confirm screenshot placeholders render visibly
5. Validate all code examples are syntactically correct
6. Ensure dark/light mode toggle works (Minima auto skin)
