---
layout: home
title: Home
---

<div class="hero">
  <h1 class="hero-title">mini-a</h1>
  <p class="hero-subtitle"></p>
  <p class="hero-description"><i>A minimalist autonomous agent that uses LLMs, shell commands and/or MCP servers to achieve user-defined goals. Simple, flexible, and easy to use as a library, CLI tool, or embedded interface.</i></p>
  <div class="hero-buttons">
    <a href="{{ '/getting-started.html' | relative_url }}" class="btn btn-primary">Get Started</a> | 
    <a href="https://github.com/OpenAF/mini-a" class="btn btn-secondary">View on GitHub</a>
  </div>
  <br/>
</div>

<div class="screenshots">
  <h2>See it in Action</h2>
  <div class="screenshot-grid">
    <div class="screenshot-item">
      <img src="assets/images/mini-a-web-screenshot1.jpg" alt="mini-a Web Interface" />
      <div align="center"><i>Modern Web Interface</i></div>
    </div>
    <br/>
    <div class="screenshot-item">
      <img src="assets/images/mini-a-con-screenshot.png" alt="mini-a Console" />
      <div align="center"><i>Interactive Console</i></div>
    </div>
    <br/>
  </div>
</div>

<div class="features-overview">
  <h2>Key Features</h2>
  <div class="feature-grid">
    <div class="feature-card">
      <h3>🤖 Multi-Model Support</h3>
      <i>Works with OpenAI, Google Gemini, GitHub Models, AWS Bedrock, Ollama, and more</i>
      <br/>
    </div>
    <div class="feature-card">
      <h3>💰 Cost Optimization</h3>
      <i>Dual-model setup with automatic escalation reduces costs by 50-70%</i>
      <br/>
    </div>
    <div class="feature-card">
      <h3>🔌 MCP Integration</h3>
      <i>Seamless integration with Model Context Protocol servers (STDIO & HTTP)</i>
      <br/>
    </div>
    <div class="feature-card">
      <h3>⚡ Performance</h3>
      <i>Automatic optimizations reduce token usage by 40-60%</i>
      <br/>
    </div>
    <div class="feature-card">
      <h3>🛠️ Flexible Tools</h3>
      <i>Shell commands, MCP proxy, built-in utilities, and custom tools</i>
      <br/>
    </div>
    <div class="feature-card">
      <h3>🐳 Docker Ready</h3>
      <i>Run in containers for isolated execution and portability</i>
      <br/>
    </div>
  </div>
</div>

<div class="quick-example">
  <h2>Quick Example</h2>
  <div class="example-content">
    <div class="example-step">
      <h3>1. Set your model</h3>
      {% highlight bash %}
export OAF_MODEL="(type: openai, model: gpt-4o-mini, key: '...', timeout: 900000)"
      {% endhighlight %}
    </div>
    <div class="example-step">
      <h3>2. Run the console</h3>
      {% highlight bash %}
opack exec mini-a
      {% endhighlight %}
    </div>
    <div class="example-step">
      <h3>3. Give it a goal</h3>
      {% highlight bash %}
mini-a goal="list all JavaScript files in this directory" useshell=true
      {% endhighlight %}
    </div>
  </div>
  <p class="example-note">💡 <!--em>Suggestion: Add asciinema recording of a complete quick start session here</em--></p>
</div>

<div class="architecture">
  <h2>How it Works</h2>
  <div class="mermaid-diagram">
    <img src="assets/images/architecture-diagram.svg" alt="mini-a Architecture" onerror="this.style.display='none'" />
    <div class="architecture-text">
      <p><strong>mini-a</strong> orchestrates between you, LLM models, MCP servers, and optional shell commands:</p>
      <ul>
        <li><strong>User</strong> provides goals and parameters</li>
        <li><strong>LLM Models</strong> handle reasoning and planning (with smart dual-model optimization)</li>
        <li><strong>MCP Servers</strong> provide structured data and specialized tools</li>
        <li><strong>Shell</strong> executes commands when needed (opt-in)</li>
        <li><strong>Orchestrator</strong> manages the flow and delivers final responses</li>
      </ul>
    </div>
  </div>
</div>

<div class="cta-section">
  <h2>Ready to Get Started?</h2>
  <p>mini-a is easy to install and use. Get up and running in minutes.</p>
  <a href="{{ '/getting-started.html' | relative_url }}" class="btn btn-primary btn-large">Read the Getting Started Guide</a>
</div>
