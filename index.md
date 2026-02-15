---
layout: home
permalink: /
---

<div class="hero">
  <h1><span style="color: #62bb47;">mini</span><span style="color: #e594ac;">-a</span></h1>
  <p class="tagline">Your goals. Your LLM. One command.</p>
  <p class="hero-description">
    A minimalist autonomous agent framework built on OpenAF. Connect any LLM,
    use 20+ built-in MCP tool servers, and let mini-a figure out how to
    achieve your goals — from the terminal, a web UI, or your own code.
  </p>
  <div class="cta-buttons">
    <a href="{{ '/getting-started' | relative_url }}" class="btn btn-primary">Get Started</a>
    <a href="https://github.com/OpenAF/mini-a" class="btn btn-secondary">GitHub</a>
  </div>
</div>

---

## See It in Action
{: .section}

<div class="screenshots-grid">
  <div>
    <div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S1 — Web UI showing a multi-step task with streaming output]</div>
    <p style="text-align:center"><em>Web interface with real-time streaming</em></p>
  </div>
  <div>
    <div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S2 — Console interactive goal execution]</div>
    <p style="text-align:center"><em>Interactive console mode</em></p>
  </div>
</div>

---

<div class="numbers-bar">
  <div class="number-item">
    <span class="number">10+</span>
    <span class="label">LLM Providers</span>
  </div>
  <div class="number-item">
    <span class="number">20+</span>
    <span class="label">MCP Servers</span>
  </div>
  <div class="number-item">
    <span class="number">100+</span>
    <span class="label">Parameters</span>
  </div>
  <div class="number-item">
    <span class="number">50-70%</span>
    <span class="label">Cost Savings</span>
  </div>
  <div class="number-item">
    <span class="number">4</span>
    <span class="label">Interfaces</span>
  </div>
</div>

---

## Features
{: .section}

<div class="feature-grid">
  <div class="feature-card">
    <h3>Any LLM, Your Choice</h3>
    <p>OpenAI, Google, Anthropic, Ollama, AWS Bedrock, GitHub Models — switch providers with one config line.</p>
  </div>
  <div class="feature-card">
    <h3>Cut Costs by 70%</h3>
    <p>Dual-model architecture routes simple tasks to cheaper models automatically. Pay less, get the same results.</p>
  </div>
  <div class="feature-card">
    <h3>20+ Tools, Zero Code</h3>
    <p>Built-in MCP servers for time, finance, databases, web, email, Kubernetes, and more — ready to use.</p>
  </div>
  <div class="feature-card">
    <h3>40-60% Fewer Tokens</h3>
    <p>Automatic context optimization, conversation compaction, and smart summarization keep costs low.</p>
  </div>
  <div class="feature-card">
    <h3>Console. Web. Library. Docker.</h3>
    <p>Use it as a CLI tool, web app, JavaScript library, or Docker container — whatever fits your workflow.</p>
  </div>
  <div class="feature-card">
    <h3>Secure by Default</h3>
    <p>Shell access off by default, read-only mode, command allowlists, encrypted key storage.</p>
  </div>
</div>

---

## Quick Example
{: .section}

<div class="quick-example">
  <div class="step">
    <span class="step-number">1</span>
    <strong>Configure your model</strong>
  </div>

  <pre><code class="language-bash">export OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')"
</code></pre>

  <div class="step">
    <span class="step-number">2</span>
    <strong>Run mini-a</strong>
  </div>

  <pre><code class="language-bash">mini-a
</code></pre>

  <div class="step">
    <span class="step-number">3</span>
    <strong>Give it a goal</strong>
  </div>

  <pre><code>&gt; List all JavaScript files in this project and count the lines of code in each
</code></pre>

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S3 — Terminal recording showing a 30-second quick start]</div>

</div>

---

## How It Works
{: .section}

mini-a follows a simple loop: **understand the goal → plan steps → execute tools → validate results → report back**.

```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐
│  Your    │────▶│  LLM    │────▶│  Tools   │────▶│  Result  │
│  Goal    │     │  Engine  │     │  (MCP)   │     │  Output  │
└─────────┘     └─────────┘     └──────────┘     └──────────┘
                     │                │
                     ▼                ▼
                ┌─────────┐     ┌──────────┐
                │ Planning │     │  Shell   │
                │ & Memory │     │ Commands │
                └─────────┘     └──────────┘
```

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S4 — Architecture diagram (SVG preferred)]</div>

---

<div class="cta-section">
  <h2>Ready to Get Started?</h2>
  <p>Install mini-a in under a minute and run your first autonomous task.</p>
  <div class="cta-buttons">
    <a href="{{ '/getting-started' | relative_url }}" class="btn btn-primary">Get Started</a>
    <a href="{{ '/examples' | relative_url }}" class="btn btn-secondary">See Examples</a>
  </div>
</div>
