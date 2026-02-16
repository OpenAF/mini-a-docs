---
layout: page
title: Features
permalink: /features/
---

mini-a packs a comprehensive set of features into a minimalist framework. This page covers everything from model selection and cost optimization to security, tooling, and output formats.

---

## Multi-Model Support

mini-a works with **10+ LLM providers** out of the box. Switch between providers by changing a single environment variable — no code changes required.

| Provider | Prefix | Example Model |
|----------|--------|---------------|
| OpenAI | `openai:` | `gpt-5.2`, `gpt-5-mini` |
| Google Gemini | `google:` | `gemini-2.0-flash`, `gemini-1.5-pro` |
| Anthropic Claude | `anthropic:` | `claude-sonnet-4-20250514` |
| Ollama (local) | `ollama:` | `llama3`, `mistral`, `codellama` |
| AWS Bedrock | `bedrock:` | `anthropic.claude-v2` |
| GitHub Models | `github:` | `openai/gpt-5` |
| Deepseek | `deepseek:` | `deepseek-chat` |
| Groq | `groq:` | `llama3-70b-8192` |
| Cerebras | `cerebras:` | `llama3.1-70b` |
| Mistral | `mistral:` | `mistral-large-latest` |
| OpenRouter | `openrouter:` | `meta-llama/llama-3-70b` |

Switching is as simple as setting the environment variable:

```bash
export OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')"             # OpenAI
export OAF_MODEL="(type: gemini, model: gemini-2.0-flash, key: '...')"    # Google
export OAF_MODEL="(type: ollama, model: 'llama3', url: 'http://localhost:11434')"              # Local
```

Set credentials directly in `OAF_MODEL`/`OAF_LC_MODEL` using `key: '...'` so configuration stays in one place. Ollama runs locally and requires no key.

---

## Dual-Model Cost Optimization

One of mini-a's most powerful features is its **dual-model architecture**. You can assign a cheaper, faster model to handle simple tasks (routing, summarization, classification) while reserving a more capable model for complex reasoning.

```bash
export OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')"            # Main model — complex reasoning
export OAF_LC_MODEL="(type: openai, model: gpt-5-mini, key: '...')"      # Light model — simple tasks
```

The framework automatically decides which model to use for each subtask, optimizing cost without sacrificing quality where it matters.

### Estimated Savings

| Task Type | Model Used | Estimated Savings |
|-----------|------------|-------------------|
| Simple routing & classification | Light model (`OAF_LC_MODEL`) | ~70% cheaper |
| Summarization | Light model (`OAF_LC_MODEL`) | ~60% cheaper |
| Planning & step decomposition | Light model (`OAF_LC_MODEL`) | ~50% cheaper |
| Complex reasoning & analysis | Main model (`OAF_MODEL`) | 0% (full model needed) |

When both models are configured, mini-a reports separate token usage and cost estimates for each, so you can track exactly how much you are saving.

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S8 — Token stats with dual-model cost breakdown]</div>

---

## Automatic Performance Optimizations

mini-a includes several **built-in optimizations** that reduce token consumption and keep conversations within context limits without manual intervention.

- **Conversation compaction** — When the conversation grows too long, mini-a automatically compresses earlier turns while preserving essential context. Trigger manually with `/compact`.
- **Context summarization** — Long tool outputs and intermediate results are summarized to save tokens. Trigger manually with `/summarize`.
- **Token usage optimization** — The framework tracks token counts and adjusts behavior to stay within budget.
- **Smart prompt caching** — Repeated prompt patterns are cached where the provider supports it, reducing redundant API calls.

### Key Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `maxcontext` | Maximum context window size (tokens) | Model default |
| `maxtokens` | Maximum tokens per response | Model default |
| Auto-compact | Automatically compact when context exceeds threshold | Enabled |

```bash
# Example: constrain context and response size
mini-a maxcontext=32000 maxtokens=4096
```

---

## MCP Integration

**MCP (Model Context Protocol)** is an open standard that defines how LLMs discover and invoke external tools. Instead of hard-coding tool integrations, mini-a uses MCP servers that expose capabilities through a uniform interface.

mini-a ships with **20+ built-in MCP servers** covering common tasks — file operations, web browsing, databases, Kubernetes, finance, email, and more.

### STDIO vs HTTP Mode

| Mode | How It Works | Best For |
|------|-------------|----------|
| **STDIO** | Launches the MCP server as a local child process, communicating over stdin/stdout | Local tools, development, single-user setups |
| **HTTP** | Connects to a remote MCP server over HTTP/SSE | Shared servers, cloud deployments, team setups |

```bash
# STDIO mode (default for built-in servers)
mini-a usetools=true

# HTTP mode (connect to a remote MCP server)
mini-a usetools=true mcpserver="http://mcp.example.com:8080"
```

For a complete list of available MCP servers and their capabilities, see the [MCP Catalog]({{ '/mcp-catalog' | relative_url }}).

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S9 — MCP test console listing tools]</div>

---

## Flexible Tool System

mini-a provides **three categories of tools** that the agent can use to accomplish goals:

### 1. Shell Commands

When enabled, the agent can execute shell commands directly on the host system. Disabled by default for security.

```bash
mini-a useshell=true
```

### 2. Built-in Utilities

File operations, text search, directory listing, and other common utilities that do not require spawning a shell.  
When enabled, Mini Utils provides `init`, `filesystemQuery`, `filesystemModify`, and `markdownFiles`.

```bash
mini-a useutils=true
```

For docs-aware workflows, enable:

```bash
mini-a useutils=true mini-a-docs=true
```

### 3. MCP Tools

Extensible tools provided by MCP servers — both built-in and custom.

```bash
mini-a usetools=true
```

### Tool Configuration Summary

| Parameter | What It Enables | Default |
|-----------|----------------|---------|
| `useshell` | Shell command execution | `false` |
| `useutils` | Built-in file and search utilities | `true` |
| `mini-a-docs` | Auto-set docs root for Mini Utils `markdownFiles` when `utilsroot` is unset | `false` |
| `usetools` | MCP tool servers | `true` |

All three can be combined. When the agent receives a goal, it selects the appropriate tool type based on the task.

---

## Multiple Interfaces

mini-a can be used through **four distinct interfaces**, each suited to different workflows.

### Console (Interactive REPL)

The default mode. An interactive terminal session with tab completion, command history, and real-time streaming.

```bash
mini-a
```

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S11 — Console with tab completion]</div>

### Web UI

A browser-based interface with session management, conversation history, and streaming output.

```bash
mini-a web=true webport=8080
```

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S10 — Web UI with session management]</div>

### Library (JavaScript API)

Use mini-a programmatically from your own OpenAF scripts.

```javascript
loadLib("mini-a.js");

var agent = new MiniA({
  model: "(type: openai, model: gpt-5.2, key: '...')",
  usetools: true
});

var result = agent.ask("List all running Docker containers");
print(result);
```

### Worker API

Run mini-a as a remote agent that accepts goals via an API endpoint.

```bash
mini-a worker=true workerport=9090
```

Other agents or applications can then delegate tasks to this worker instance.

---

## Planning & Delegation

For complex goals, mini-a can **plan** a series of steps before executing them, and optionally **delegate** subtasks to child agents or remote workers.

### Planning Styles

| Style | Description |
|-------|-------------|
| `step` | Generates and executes one step at a time |
| `full` | Creates a complete plan upfront, then executes all steps |
| `validate` | Creates a full plan with validation checkpoints after each step |

```bash
# Enable planning with validation
mini-a useplanning=true planstyle=validate
```

### Delegation

When delegation is enabled, the main agent can spawn child agents to handle independent subtasks in parallel.

```bash
# Enable delegation to child agents
mini-a usedelegation=true
```

Delegation also works with remote workers — the main agent can send subtasks to mini-a instances running in worker mode on other machines.

---

## Chatbot Mode

Not every use case needs tools. **Chatbot mode** turns mini-a into a pure conversational assistant — no shell access, no file operations, no MCP tools. Just the LLM.

```bash
mini-a chatbotmode=true
```

This is useful for:

- **Q&A** — Answer questions using the model's training data
- **Education** — Explain concepts, tutor on topics
- **Brainstorming** — Generate ideas, explore possibilities
- **Drafting** — Write text, emails, documentation

All other features (streaming, conversation management, dual-model) still work in chatbot mode.

---

## Custom Slash Commands, Skills, and Hooks

mini-a supports template-based custom slash commands, skill templates, and local console hooks.

### Custom Slash Commands

Create markdown templates under `~/.openaf-mini-a/commands/` and invoke them with `/<name> ...args...`.

```text
~/.openaf-mini-a/commands/my-command.md
```

Use placeholders inside the template: `{{args}}`, `{{argv}}`, `{{argc}}`, `{{arg1}}`, `{{arg2}}`, ...

Placeholder reference (works for command and skill templates):

- `{{args}}` -> raw argument string after the command name (trimmed)
- `{{argv}}` -> parsed arguments as a JSON array
- `{{argc}}` -> parsed argument count
- `{{arg1}}`, `{{arg2}}`, ... -> positional argument values (1-based)

Example template `~/.openaf-mini-a/commands/my-command.md`:

```markdown
Follow these instructions exactly.

Primary target: {{arg1}}
All args (raw): {{args}}
Parsed args: {{argv}}
Argument count: {{argc}}
```

Run:

```bash
mini-a ➤ /my-command repo-a --fast "include docs"
```

Rendered prompt:

```text
Follow these instructions exactly.

Primary target: repo-a
All args (raw): repo-a --fast "include docs"
Parsed args: ["repo-a","--fast","include docs"]
Argument count: 3
```

Load additional command directories with:

```bash
mini-a extracommands=/path/to/team-commands,/path/to/project-commands
```

### Skills

mini-a discovers skills from `~/.openaf-mini-a/skills/` in two formats:

- Folder skill: `~/.openaf-mini-a/skills/<name>/SKILL.md`
- Single-file skill: `~/.openaf-mini-a/skills/<name>.md`

Run skills with either `/<name> ...args...` or `$<name> ...args...`. Use `/skills` (or `/skills <prefix>`) to list discovered skills.

Load additional skill directories with:

```bash
mini-a extraskills=/path/to/shared-skills,/path/to/project-skills
```

### Hooks

mini-a can run local hooks from `~/.openaf-mini-a/hooks/*.yaml|*.yml|*.json` on events like:

- `before_goal`, `after_goal`
- `before_tool`, `after_tool`
- `before_shell`, `after_shell`

Load additional hook directories with:

```bash
mini-a extrahooks=/path/to/team-hooks,/path/to/project-hooks
```

### Non-interactive Template Execution

You can execute one command/skill template and exit:

```bash
mini-a exec="/my-command repo-a --fast"
```

References:
- [mini-a `USAGE.md` (custom commands, skills, hooks)](https://github.com/OpenAF/mini-a/blob/main/USAGE.md)
- [mini-a `mini-a.yaml` (`useskills` parameter)](https://github.com/OpenAF/mini-a/blob/main/mini-a.yaml)

---

## Docker Support

Run mini-a in a **Docker container** for full isolation, reproducible environments, and easy deployment.

### Docker Compose Example

```yaml
version: "3.8"
services:
  mini-a:
    image: openaf/mini-a
    environment:
      - OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')"
      - OAF_LC_MODEL="(type: openai, model: gpt-5-mini, key: '...')"
    ports:
      - "8080:8080"
    volumes:
      - ./workspace:/workspace
    command: mini-a web=true webport=8080
```

Docker containers provide a natural sandbox for shell execution — you can enable `useshell=true` inside the container without exposing your host system.

---

## Security Features

mini-a is designed to be **secure by default**. Potentially dangerous features require explicit opt-in.

| Feature | Description | Default |
|---------|-------------|---------|
| Shell execution | Run arbitrary shell commands | **Disabled** |
| Read-only mode | Prevent file modifications | Available |
| Command allowlist | Only permit specific shell commands | `shellallow="cmd1,cmd2"` |
| Command ban list | Block specific shell commands | `shellban="rm,shutdown"` |
| Encrypted key storage | API keys stored encrypted via model manager | Supported |
| Docker isolation | Run in a container sandbox | Available |

```bash
# Enable shell with allowlist only
mini-a useshell=true shellallow="ls,cat,grep,find"

# Enable shell but ban destructive commands
mini-a useshell=true shellban="rm,rmdir,dd,mkfs"
```

These controls can be combined. For example, running inside Docker with a shell allowlist provides defense in depth.

---

## Streaming Responses

mini-a supports **real-time token streaming** in both the console and web interfaces. Responses appear word by word as the model generates them, rather than waiting for the full response.

```bash
mini-a usestream=true
```

Streaming is enabled by default in most configurations. It provides a more responsive experience, especially for long-form outputs.

---

## Conversation Management

mini-a provides several commands for managing conversation context during a session.

| Command | Description |
|---------|-------------|
| `/compact [n]` | Compress older history while preserving up to the latest `n` exchanges (default 6) |
| `/summarize [n]` | Replace older history with a narrative summary and keep up to the latest `n` exchanges (default 6) |
| `/last [md]` | Reprint the most recent final answer (`md` for raw markdown) |
| `/save <path>` | Save the most recent final answer to a file |

These commands are especially useful in long sessions where context accumulates and token costs increase. Compacting a conversation can reduce context size by 40-60% while preserving the essential information the agent needs.
When enough history exists, mini-a keeps at least one older entry eligible for summarization instead of preserving the entire tail.

---

## Metrics & Usage Tracking

Track exactly how many tokens you are using and what they cost with built-in **metrics and usage tracking**.

```
> /metrics
```

The `/metrics` command displays:

- **Token counts** — Input and output tokens for the current session
- **Cost estimates** — Estimated cost based on provider pricing
- **Model usage** — Breakdown by main model vs. light model
- **Request counts** — Number of API calls made

This data helps you understand usage patterns, optimize model selection, and budget API costs.

---

## Visual Outputs

mini-a can generate **rich visual outputs** directly in the terminal or web UI by enabling the appropriate flags.

| Parameter | Output Type | Example Use |
|-----------|------------|-------------|
| `useascii=true` | ASCII art | Banners, logos, decorative text |
| `usediagrams=true` | Diagrams | Flowcharts, architecture diagrams, sequence diagrams |
| `usecharts=true` | Charts | Bar charts, histograms, data visualizations |
| `usemaps=true` | Maps | Geographic data, network topology |

```bash
# Enable all visual outputs
mini-a useascii=true usediagrams=true usecharts=true usemaps=true
```

These features instruct the LLM to include visual representations in its responses when appropriate, making outputs more informative and easier to understand at a glance.

---

<div class="cta-section">
  <h2>Ready to Try It?</h2>
  <p>Get mini-a running in under a minute and explore these features yourself.</p>
  <div class="cta-buttons">
    <a href="{{ '/getting-started' | relative_url }}" class="btn btn-primary">Get Started</a>
    <a href="{{ '/examples' | relative_url }}" class="btn btn-secondary">See Examples</a>
  </div>
</div>
