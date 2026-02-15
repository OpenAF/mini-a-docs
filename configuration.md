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
| `model` | - | LLM model configuration in SLON/JSON style (e.g., `(type: openai, model: gpt-5-mini, key: '...')`) |
| `lmodel` | - | Lighter model for simple tasks (dual-model) |
| `vmodel` | - | Optional dedicated validation model used in deep-research scoring |
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
| `extracommands` | - | Comma-separated extra directories for custom slash command templates |
| `extraskills` | - | Comma-separated extra directories for custom skills |
| `extrahooks` | - | Comma-separated extra directories for hook definitions |

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
| `useutils` | `true` | Enable Mini Utils Tool utilities (`init`, `filesystemQuery`, `filesystemModify`, `markdownFiles`) |
| `useskills` | `false` | Expose skill operations in Mini Utils Tool (requires `useutils=true`) |
| `utilsroot` | - | Root path used by Mini Utils file operations |
| `mini-a-docs` | `false` | If `true` and `utilsroot` is not set, automatically uses the mini-a oPack docs path as `utilsroot` |
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
| `OAF_VAL_MODEL` | `vmodel` |
| `OAF_MINI_A_NOJSONPROMPT` | Force text prompt mode for main model (Gemini compatibility) |
| `OAF_MINI_A_LCNOJSONPROMPT` | Force text prompt mode for low-cost model |
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
| `/compact [n]` | Compact older history while keeping latest `n` exchanges |
| `/summarize [n]` | Summarize older history while keeping latest `n` exchanges |
| `/context [llm|analyze]` | Show estimated or model-analyzed context token breakdown |
| `/reset` | Reset conversation |
| `/last [md]` | Reprint the previous final answer (raw markdown with `md`) |
| `/save <path>` | Save the previous final answer to a file |
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
| `shellrw` | `useshell=true readwrite=true` |
| `shellutils` | `useshell=true useutils=true mini-a-docs=true usetools=true` |
| `chatbot` | `chatbotmode=true` |
| `internet` | Internet-focused MCP/tool preset with docs-aware utils from `mini-a-modes.yaml` |
| `web` | Browser UI optimized preset with docs-aware utils |
| `webfull` | Full web UI preset with docs-aware utils, planning/history/attachments, and richer output modes |

User custom presets can be defined in `~/.openaf-mini-a_modes.yaml`. They are merged with built-ins from `mini-a-modes.yaml`, and user definitions take precedence.

</div>
