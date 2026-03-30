---
layout: home
permalink: /
---

<div class="hero">
  <h1><span style="color: #62bb47;">mini</span><span style="color: #e594ac;">-a</span></h1>
  <p class="tagline">Your goals. Your LLM. One command.</p>
  <p class="hero-description">
    A minimalist autonomous agent framework built on OpenAF. Connect any LLM,
    use 25+ built-in MCP servers, and orchestrate delegated multi-agent
    workflows with proxy-backed tools, streaming, and worker registration
    from the terminal, a web UI, or your own code.
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
    <img src="{{ '/assets/images/screenshots/s1-web-ui.jpg' | relative_url }}" alt="Web UI showing a multi-step task with streaming output" style="border-radius:8px; border:1px solid rgba(160,174,192,0.3);">
    <p style="text-align:center"><em>Web interface with real-time streaming</em></p>
  </div>
  <div>
    <img src="{{ '/assets/images/screenshots/s2-console-interactive-goal.jpg' | relative_url }}" alt="Console interactive goal execution" style="border-radius:8px; border:1px solid rgba(160,174,192,0.3);">
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
    <span class="number">25+</span>
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
    <h3>25+ MCP Servers, Ready to Run</h3>
    <p>Time, finance, databases, web, email, Kubernetes, office docs, OpenAF helpers, and more ship as built-in MCP servers.</p>
  </div>
  <div class="feature-card">
    <h3>Multi-Agent Orchestration</h3>
    <p>Enable delegation to split goals into subtasks and run them across local child agents, remote workers, or self-registering worker pools.</p>
  </div>
  <div class="feature-card">
    <h3>40-60% Fewer Tokens</h3>
    <p>Automatic context optimization, conversation compaction, and smart summarization keep costs low.</p>
  </div>
  <div class="feature-card">
    <h3>Proxy and Script-Friendly Tools</h3>
    <p>Aggregate tools behind one `proxy-dispatch` interface or expose them through a localhost bridge for programmatic MCP calls from generated scripts.</p>
  </div>
  <div class="feature-card">
    <h3>Console. Web. Library. Docker.</h3>
    <p>Use it as a CLI tool, web app, JavaScript library, or Docker container — whatever fits your workflow.</p>
  </div>
  <div class="feature-card">
    <h3>Secure by Default</h3>
    <p>Shell access off by default, prompt normalization, untrusted-input labeling, prompt-size limits, read-only mode, and encrypted key storage.</p>
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

  <pre><code class="language-bash">mini-a useshell=true
</code></pre>

  <div class="step">
    <span class="step-number">3</span>
    <strong>Give it a goal</strong>
  </div>

  <pre><code>&gt; list all JavaScript files in this project and count the lines of code in each
</code></pre>

<div id="s3-player" style="border-radius:8px; overflow:hidden; border:1px solid rgba(160,174,192,0.3);"></div>
<script>
  AsciinemaPlayer.create('{{ "/assets/images/screenshots/s3-quick-start.cast" | relative_url }}', document.getElementById('s3-player'));
</script>

</div>

---
## How It Works
{: .section}
mini-a follows a simple loop: **understand the goal → plan steps → execute tools → validate results → report back**.

```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐
│  Your   │────▶│  LLM    │────▶│  Tools   │────▶│  Result  │
│  Goal   │     │  Engine │     │  (MCP)   │     │  Output  │
└─────────┘     └─────────┘     └──────────┘     └──────────┘
                     │                │
                     ▼                ▼
                ┌──────────┐     ┌──────────┐
                │ Planning │     │  Shell   │
                │ & Memory │     │ Commands │
                └──────────┘     └──────────┘
```

<img src="{{ '/assets/images/screenshots/s4-architecture.svg' | relative_url }}" alt="mini-a architecture diagram showing entry points, orchestrator, and subsystems" style="border-radius:8px; border:1px solid rgba(160,174,192,0.3); width:100%;">

---

<div class="cta-section">
  <h2>Ready to Get Started?</h2>
  <p>Install mini-a in under a minute and run your first autonomous task.</p>
  <div class="cta-buttons">
    <a href="{{ '/getting-started' | relative_url }}" class="btn btn-primary">Get Started</a>
    <a href="{{ '/examples' | relative_url }}" class="btn btn-secondary">See Examples</a>
  </div>
</div>
