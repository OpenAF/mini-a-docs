---
layout: page
title: Configuration
permalink: /configuration/
---

Complete reference for common mini-a parameters. Parameters are set as `param=value` arguments, by using the corresponding `OAF_*`/`MINI_A_*` environment variables where supported, or through saved model definitions.

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
| `modellc` | - | Lighter model for simple tasks (dual-model); set via `OAF_LC_MODEL` env var |
| `lccontextlimit` | `0` | Escalate from low-cost model to main model when context tokens reach this threshold (`0` disables) |
| `deescalate` | `3` | Consecutive successful steps required before switching back to the low-cost model after escalation |
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
| `maxsteps` | `15` | Maximum number of agent steps |
| `format` | - | Output format (e.g., `json`, `yaml`, `markdown`) |
| `youare` | - | Custom system persona/identity |
| `rules` | - | Additional rules for the agent |
| `knowledge` | - | Knowledge base content or file path |
| `debug` | `false` | Enable debug logging |
| `debugfile` | - | Write debug output as NDJSON to a file (implies `debug=true`) |
| `debugvalch` | - | Dedicated debug channel for validation-model traffic when `llmcomplexity=true` |
| `outfile` | - | Save final answer to file |
| `outfileall` | - | Deep research only: save full cycle history/verdicts/learnings to file |
| `extracommands` | - | Comma-separated extra directories for custom slash command templates |
| `extraskills` | - | Comma-separated extra directories for custom skills |
| `extrahooks` | - | Comma-separated extra directories for hook definitions |
| `auditch` | - | JSSLON channel definition for agent interaction audit logs |
| `toollog` | - | JSSLON channel definition for dedicated MCP tool input/output logs |

</div>

<div class="config-category" markdown="1">

## 3. MCP Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `mcp` | - | MCP servers to load (comma-separated) |
| `mcpproxy` | `false` | Enable MCP proxy mode |
| `mcpproxythreshold` | `0` | Byte threshold to spill large proxy results to temp files (`0` disables spilling) |
| `mcpproxytoon` | `false` | Serialize spilled proxy object/array payloads as TOON text when proxy spilling is enabled |
| `mcpprogcall` | `false` | Start localhost programmatic MCP tool-call bridge for scripts |
| `mcpprogcallport` | `0` | Programmatic MCP bridge port (`0` auto-selects) |
| `mcpprogcallmaxbytes` | `4096` | Max inline JSON response size before returning a stored `resultId` |
| `mcpprogcallresultttl` | `600` | TTL (seconds) for oversized stored results served by the MCP bridge |
| `mcpprogcalltools` | `""` | Optional comma-separated tool allowlist exposed by the MCP bridge |
| `mcpprogcallbatchmax` | `10` | Maximum calls accepted by one bridge batch request |
| `mcpdynamic` | `false` | Allow dynamic MCP discovery |
| `mcplazy` | `false` | Lazy-load MCP servers |
| `mcpurl` | - | Remote MCP server URL |

</div>

<div class="config-category" markdown="1">

## 4. Tool Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `useutils` | `false` | Enable Mini Utils Tool utilities (`init`, `filesystemQuery`, `filesystemModify`, `markdownFiles`) |
| `useskills` | `false` | Expose skill operations in Mini Utils Tool (requires `useutils=true`) |
| `utilsroot` | - | Root path used by Mini Utils file operations |
| `mini-a-docs` | `false` | If `true` and `utilsroot` is not set, automatically uses the mini-a oPack docs path as `utilsroot` |
| `usetools` | `false` | Enable tool usage |
| `usejsontool` | `false` | Register a compatibility `json` tool for models that sometimes emit `json` tool calls |
| `libs` | - | Additional library paths to load |
| `utilsallow` | - | Comma-separated allowlist of Mini Utils Tool names to expose when `useutils=true` |
| `utilsdeny` | - | Comma-separated denylist of Mini Utils Tool names to hide when `useutils=true` (applied after `utilsallow`) |

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
| `planstyle` | `simple` | Planning style: `simple` (flat sequential steps, default) / `legacy` (phase-based hierarchical) |
| `planfile` | - | File to save/load plans |
| `usethinking` | `false` | Enable chain-of-thought reasoning |

</div>

<div class="config-category" markdown="1">

## 7. Shell Access

| Parameter | Default | Description |
|-----------|---------|-------------|
| `useshell` | `false` | Enable shell commands |
| `readwrite` | `false` | Allow file write operations |
| `shelltimeout` | - | Maximum shell command runtime in milliseconds before timeout |
| `shellmaxbytes` | `8000` | Truncate oversized shell output to head/tail excerpts with a banner |
| `shellallow` | - | Allowed shell commands (comma-separated) |
| `shellallowpipes` | `false` | Allow pipes, redirection, and shell control operators |
| `shellbanextra` | - | Additional banned shell commands (comma-separated) |
| `checkall` | `false` | Ask for confirmation before every shell command |
| `shellbatch` | `false` | Run shell commands without interactive approval prompts |
| `shellban` | - | Banned shell commands (comma-separated) |

### Shell Sandbox

| Parameter | Default | Description |
|-----------|---------|-------------|
| `usesandbox` | `off` | Enable built-in OS sandbox presets for shell commands (`off`, `auto`, `linux`, `macos`, `windows`) |
| `sandboxprofile` | - | Optional macOS sandbox profile path (mini-a auto-generates a restrictive temporary `.sb` profile otherwise) |
| `sandboxnonetwork` | `false` | Disable network inside the built-in sandbox when supported |

</div>

<div class="config-category" markdown="1">

## 8. Visual & Output

| Parameter | Default | Description |
|-----------|---------|-------------|
| `useascii` | `false` | Enable ASCII art generation |
| `usesvg` | `false` | Enable SVG generation for custom visuals and infographics |
| `usemaps` | `false` | Enable map visualization |
| `usemath` | `false` | Enable LaTeX math guidance for KaTeX rendering in the web UI |
| `usediagrams` | `false` | Enable diagram generation |
| `usecharts` | `false` | Enable chart generation |
| `usevectors` | `false` | Enable the vector bundle (`usesvg=true` + `usediagrams=true`), preferring Mermaid for structural diagrams and SVG for infographics/custom visuals |
| `usestream` | `false` | Enable response streaming |
| `format` | - | Output format constraint |

</div>

<div class="config-category" markdown="1">

## 9. Delegation

| Parameter | Default | Description |
|-----------|---------|-------------|
| `usedelegation` | `false` | Enable agent delegation |
| `workers` | - | Worker API URLs (comma-separated) |
| `usea2a` | `false` | Use A2A HTTP+JSON/REST transport for remote delegation |
| `maxconcurrent` | `4` | Max concurrent delegated tasks |
| `workerreg` | - | Start worker registration HTTP server on this port |
| `workerregtoken` | - | Optional token required by the worker registration endpoint |
| `workerevictionttl` | `60000` | Worker eviction TTL in milliseconds for stale worker entries |
| `workerregurl` | - | Parent registration URLs used by workers for self-registration |
| `workerreginterval` | `30000` | Worker heartbeat interval in milliseconds |
| `delegationmaxdepth` | `3` | Maximum recursive delegation depth |
| `delegationtimeout` | `300000` | Default delegated subtask timeout in milliseconds |
| `delegationmaxretries` | `2` | Retry count for failed delegated subtasks |

</div>

<div class="config-category" markdown="1">

## 9a. Conversation History

| Parameter | Default | Description |
|-----------|---------|-------------|
| `historykeep` | `false` | Save console conversations to `~/.openaf-mini-a/history` for future resumption |
| `historykeepperiod` | - | Delete kept conversation files older than this many minutes |
| `historykeepcount` | - | Keep only the newest N kept conversation files |

</div>

<div class="config-category" markdown="1">

## 10. Web Interface

| Parameter | Default | Description |
|-----------|---------|-------------|
| `onport` | - | Port for web UI (enables web mode) |
| `maxpromptchars` | `120000` | Maximum accepted prompt size for incoming web `/prompt` requests |

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
| `OAF_LC_MODEL` | `modellc` |
| `OAF_MINI_A_NOJSONPROMPT` | Force text prompt mode for main model; Gemini main models auto-enable this behavior when unset |
| `OAF_MINI_A_LCNOJSONPROMPT` | Force text prompt mode for low-cost model (set explicitly for Gemini low-cost models) |
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
| `/compact [n]` | Compact older history while keeping up to latest `n` exchanges (default 6) |
| `/summarize [n]` | Summarize older history while keeping up to latest `n` exchanges (default 6) |
| `/context [llm|analyze]` | Show estimated or model-analyzed context token breakdown |
| `/reset` | Reset conversation |
| `/last [md]` | Reprint the previous final answer (raw markdown with `md`) |
| `/save <path>` | Save the previous final answer to a file |
| `/stats [mode] [out=file.json]` | Show session metrics (`summary`/`detailed`/`tools`) and optionally export JSON |
| `/history [n]` | Show the latest user goals from conversation history |
| `/exit` | Exit mini-a |
| `/clear` | Reset conversation history and accumulated metrics |
| `/cls` | Clear screen |

</div>

<div class="config-category" markdown="1">

## 15. Mode Presets

| Preset | Parameters Enabled |
|--------|-------------------|
| `shell` | `useshell=true` |
| `shellrw` | `useshell=true useutils=true readwrite=true shellallowpipes=true shellbatch=true showexecs=true mini-a-docs=true` |
| `utils` | `useutils=true mini-a-docs=true usetools=true` |
| `chatbot` | `chatbotmode=true usestream=true` |
| `internet` | Internet-focused MCP/tool preset with docs-aware utils and proxy aggregation |
| `news` | News-focused MCP preset (web + rss + time, proxy enabled) |
| `poweruser` | Shell + utils + tools with proxy tuning, history retention, LC validation, and docs-aware defaults |
| `web` | Browser UI preset with MCP tools enabled |
| `webfull` | Full web UI preset with history/attachments, proxy tuning, charts/diagrams/maps, and richer rendering options |

User custom presets can be defined in `~/.openaf-mini-a_modes.yaml`. They are merged with built-ins from `mini-a-modes.yaml`, and user definitions take precedence.

</div>
