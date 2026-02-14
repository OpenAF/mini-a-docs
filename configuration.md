---
layout: page
title: Configuration
permalink: /configuration/
---

Complete reference for all mini-a parameters. Parameters are set via `-e` flag or environment variables.

```bash
mini-a param=value
```

or

```bash
export MINI_A_PARAM=value
```

---

<div class="config-category" markdown="1">

## 1. Model Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `model` | - | LLM model configuration in SLON/JSON style (e.g., `(type: openai, model: gpt-5.2, key: '...')`) |
| `lmodel` | - | Lighter model for simple tasks (dual-model) |
| `apikey` | - | API key (alternative to env var) |
| `apiurl` | - | Custom API endpoint URL |
| `temperature` | `0.7` | Model temperature (0-2) |
| `maxtokens` | - | Maximum output tokens |
| `rpm` | - | Requests per minute limit |
| `tpm` | - | Tokens per minute limit |

</div>

<div class="config-category" markdown="1">

## 2. Core Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `goal` | - | The task/goal for the agent to accomplish |
| `useshell` | `false` | Enable shell command execution |
| `chatbotmode` | `false` | Pure chat mode without tools |
| `maxsteps` | `50` | Maximum number of agent steps |
| `format` | - | Output format (e.g., `json`, `yaml`, `markdown`) |
| `youare` | - | Custom system persona/identity |
| `rules` | - | Additional rules for the agent |
| `knowledge` | - | Knowledge base content or file path |

</div>

<div class="config-category" markdown="1">

## 3. MCP Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `mcp` | - | MCP servers to load (comma-separated) |
| `mcpproxy` | `false` | Enable MCP proxy mode |
| `mcpdynamic` | `false` | Allow dynamic MCP discovery |
| `mcplazy` | `false` | Lazy-load MCP servers |
| `mcpurl` | - | Remote MCP server URL |

</div>

<div class="config-category" markdown="1">

## 4. Tool Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `useutils` | `true` | Enable built-in utility tools |
| `usetools` | `true` | Enable tool usage |
| `libs` | - | Additional library paths to load |

</div>

<div class="config-category" markdown="1">

## 5. Context Management

| Parameter | Default | Description |
|-----------|---------|-------------|
| `maxcontext` | - | Maximum context window tokens |
| `maxtokens` | - | Maximum response tokens |
| `autocompact` | `true` | Auto-compact when context is full |

</div>

<div class="config-category" markdown="1">

## 6. Planning

| Parameter | Default | Description |
|-----------|---------|-------------|
| `useplanning` | `false` | Enable agent planning |
| `planstyle` | `step` | Planning style: `step`, `full`, `validate` |
| `planfile` | - | File to save/load plans |
| `usethinking` | `false` | Enable chain-of-thought reasoning |

</div>

<div class="config-category" markdown="1">

## 7. Shell Access

| Parameter | Default | Description |
|-----------|---------|-------------|
| `useshell` | `false` | Enable shell commands |
| `readwrite` | `false` | Allow file write operations |
| `shellallow` | - | Allowed shell commands (comma-separated) |
| `shellban` | - | Banned shell commands (comma-separated) |

</div>

<div class="config-category" markdown="1">

## 8. Visual & Output

| Parameter | Default | Description |
|-----------|---------|-------------|
| `useascii` | `false` | Enable ASCII art generation |
| `usemaps` | `false` | Enable map visualization |
| `usediagrams` | `false` | Enable diagram generation |
| `usecharts` | `false` | Enable chart generation |
| `usestream` | `true` | Enable response streaming |
| `format` | - | Output format constraint |

</div>

<div class="config-category" markdown="1">

## 9. Delegation

| Parameter | Default | Description |
|-----------|---------|-------------|
| `usedelegation` | `false` | Enable agent delegation |
| `workers` | - | Worker API URLs (comma-separated) |
| `maxconcurrent` | `3` | Max concurrent delegated tasks |

</div>

<div class="config-category" markdown="1">

## 10. Web Interface

| Parameter | Default | Description |
|-----------|---------|-------------|
| `onport` | - | Port for web UI (enables web mode) |
| `auth` | - | Basic auth credentials (`user:pass`) |
| `cors` | `false` | Enable CORS headers |

</div>

<div class="config-category" markdown="1">

## 11. Knowledge & Persona

| Parameter | Default | Description |
|-----------|---------|-------------|
| `knowledge` | - | Knowledge base content or file |
| `youare` | - | Agent persona/identity description |
| `rules` | - | Behavioral rules for the agent |

</div>

<div class="config-category" markdown="1">

## 12. Rate Limiting

| Parameter | Default | Description |
|-----------|---------|-------------|
| `rpm` | - | Requests per minute limit |
| `tpm` | - | Tokens per minute limit |

</div>

<div class="config-category" markdown="1">

## 13. Docker Environment Variables

| Variable | Maps to |
|----------|---------|
| `OAF_MODEL` | `model` |
| `OAF_LC_MODEL` | `lmodel` |
| `MINI_A_GOAL` | `goal` |
| `MINI_A_PORT` | `onport` |
| `OAF_MODEL` / `OAF_LC_MODEL` `key` field | Provider API credential (recommended) |
| `GITHUB_TOKEN` | GitHub Models token (optional when `key` is provided in model config) |

</div>

<div class="config-category" markdown="1">

## 14. Console Commands Reference

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/model` | Show current model info |
| `/compact` | Compact conversation context |
| `/summarize` | Summarize conversation |
| `/reset` | Reset conversation |
| `/save [file]` | Save conversation to file |
| `/load [file]` | Load conversation from file |
| `/metrics` | Show usage metrics |
| `/exit` | Exit mini-a |
| `/clear` | Clear screen |
| `/mode [preset]` | Switch mode preset |

</div>

<div class="config-category" markdown="1">

## 15. Mode Presets

| Preset | Parameters Enabled |
|--------|-------------------|
| `shell` | `useshell=true` |
| `chatbot` | `chatbotmode=true` |
| `internet` | MCP web server enabled |
| `poweruser` | `useshell=true, useutils=true, usetools=true` |
| `readwrite` | `readwrite=true` |
| `readonly` | Read-only file access |

</div>
