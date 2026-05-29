---
layout: page
title: Cheatsheet
permalink: /cheatsheet/
---

Quick reference for mini-a. Bookmark this page.
{: .cheatsheet}

## Installation

```bash
opack install mini-a
```

## Alias (Optional)

```bash
# Zsh
echo 'alias mini-a="opack exec mini-a"' >> ~/.zshrc && . ~/.zshrc
```

If alias setup is not available, run commands as `opack exec mini-a [...]`.

## Model Setup

| Provider | Config |
|----------|--------|
| OpenAI | `export OAF_MODEL="(type: openai, model: gpt-5-mini, key: '...')"` |
| Google | `export OAF_MODEL="(type: gemini, model: gemini-2.0-flash, key: '...')"` |
| Anthropic | `export OAF_MODEL="(type: anthropic, model: claude-sonnet-4-20250514, key: '...')"` |
| Ollama | `export OAF_MODEL="(type: ollama, model: 'llama3', url: 'http://localhost:11434')"` |
| Bedrock | `export OAF_MODEL="(type: bedrock, options: (region: eu-west-1, model: 'anthropic.claude-sonnet-4-20250514-v1:0'))"` |
| GitHub | `export OAF_MODEL="(type: openai, url: 'https://models.github.ai/inference', model: openai/gpt-5, key: $(gh auth token), apiVersion: '')"` |

## Running mini-a

| Command | Description |
|---------|-------------|
| `mini-a` | Interactive console |
| `mini-a goal='...'` | Direct goal |
| `mini-a onport=8080` | Web UI |
| `mini-a chatbotmode=true` | Chatbot mode |
| `mini-a modelman=true` | Model manager |
| `mini-a --skills` | Starter self-contained `SKILL.yaml` template |

## Console Commands

| Command | Action |
|---------|--------|
| `/help` | Show commands |
| `/model [main\|lc\|val]` | Choose a model definition for a slot (`/model` opens an interactive slot picker) |
| `/models` | Show all configured model tiers (main, LC, validation) with provider and source |
| `/show [prefix]` | Show active parameters |
| `/skills [prefix]` | List discovered skills |
| `/compact [n]` | Compact older history, keep up to latest `n` exchanges (default 6) |
| `/summarize [n]` | Summarize older history, keep up to latest `n` exchanges (default 6) |
| `/context` | Show token/context breakdown |
| `/reset` | Reset conversation |
| `/last [md]` | Reprint last final answer (`md` for raw markdown) |
| `/save <path>` | Save last final answer to a file |
| `/stats [mode] [out=file.json]` | Usage statistics (`summary`, `detailed`, `tools`, `memory`, `wiki`) |
| `/wiki list [prefix]` | List wiki pages (optionally filtered by prefix) |
| `/wiki read <page.md>` | Print a wiki page |
| `/wiki search <query>` | Full-text search across wiki pages |
| `/wiki lint` | Run wiki health checks (broken links, orphans, stale pages) |
| `/wiki reindex` | Rebuild wiki search index (requires `wikiaccess=rw`) |
| `/dream [memory\|wiki] [plan\|apply\|reorg\|dryrun]` | Run memory and/or wiki dream consolidation pass (shown when `memorych` or `usewiki=true` is set) |
| `/history [n]` | Show recent user goals from conversation history |
| `/exit` | Exit mini-a |
| `/clear` | Reset conversation history and accumulated metrics |
| `/cls` | Clear screen |

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `agent` | - | Agent profile (markdown file path or inline markdown) |
| `agentfile` | - | Backward-compatible alias for `agent` |
| `goal` | - | The task to accomplish |
| `useshell` | `false` | Enable shell commands |
| `readwrite` | `false` | Allow file writes |
| `chatbotmode` | `false` | Chat-only mode |
| `maxsteps` | `15` | Max agent steps |
| `maxcontext` | - | Max context tokens |
| `maxcontent` | - | Alias for `maxcontext` |
| `maxtokens` | - | Max output tokens |
| `deepresearch` | `false` | Enable iterative research/validation cycles |
| `validationgoal` | - | Quality criteria for deep research |
| `valgoal` | - | Alias for `validationgoal` |
| `vmodel` | - | Optional dedicated validation model used in deep-research scoring |
| `modelval` | - | Runtime override for the validation model (`OAF_VAL_MODEL` format) |
| `maxcycles` | `3` | Max deep research cycles |
| `validationthreshold` | `PASS` | Validation verdict/score required to stop |
| `persistlearnings` | `true` | Carry learnings forward between cycles |
| `useplanning` | `false` | Enable planning |
| `useutils` | `false` | Built-in utilities |
| `mini-a-docs` | `false` | Docs-aware Mini Utils root (`markdownFiles`) when `utilsroot` is unset |
| `miniadocs` | `false` | Alias for `mini-a-docs` |
| `useskills` | `false` | Expose skill operations in Mini Utils Tool (requires `useutils=true`) |
| `skillmaxautoload` | `1` | Maximum number of high-confidence matching skills to auto-load into bounded runtime context |
| `skillcontextchars` | `8000` | Maximum characters read from each auto-loaded SKILL.md for runtime context |
| `skillmanifestchars` | `1536` | Approximate character budget for skill descriptions in the system prompt manifest |
| `usetools` | `false` | Enable tool use |
| `usetoolslc` | `false` | Register MCP tools only on the low-cost model; main model stays in prompt/action mode |
| `usejsontool` | `false` | Compatibility `json` tool for some tool-calling models |
| `toollog` | - | JSSLON channel for MCP tool call logs (input/output) |
| `auditch` | - | Channel for agent activity audit log (tool calls, shell commands, goal events) |
| `debugch` | - | Channel for main-model LLM request/response payloads |
| `debuglcch` | - | Channel for low-cost model LLM request/response payloads |
| `debugfile` | - | Write debug output to a NDJSON file (implies `debug=true`) |
| `debugvalch` | - | Separate debug channel for the validation model |
| `outfileall` | - | Deep research only: save full cycle outputs (not only final answer) |
| `shelltimeout` | - | Max shell command runtime (ms) before timeout |
| `shellmaxbytes` | `8000` | Cap shell output size and truncate with head/tail excerpt |
| `shellallowpipes` | `false` | Allow pipes, redirection, and shell control operators |
| `usestream` | `false` | Stream responses |
| `showexecs` | `false` | Show shell/exec events as separate lines in the interaction stream |
| `showseparator` | `true` | Show a separator line between interaction events (disable for compact view) |
| `browsercontext` | - | Browser context configuration or `true` to auto-enable browser control for supported tools |
| `showthinking` | `false` | Surface XML-tagged `<thinking>...</thinking>` blocks as thought logs |
| `promptprofile` | context-dependent | System prompt verbosity: `minimal`, `balanced`, or `verbose` (`minimal` in chatbot mode; `verbose` with `debug=true`; otherwise `balanced`) |
| `systempromptbudget` | — | Max estimated tokens for the system prompt; drops lower-priority sections when exceeded |
| `goalprefix` | — | Prefix automatically prepended to every goal before the agent sees it |
| `compressgoal` | `false` | Enable automatic compression of oversized goal text before execution |
| `compressgoaltokens` | `250` | Estimated token threshold before goal compression is considered |
| `compressgoalchars` | `1000` | Character threshold before goal compression is considered |
| `usemath` | `false` | Enable LaTeX math guidance for KaTeX rendering in web UI |
| `usesvg` | `false` | Enable SVG generation for custom visuals and infographics |
| `usediagrams` | `false` | Enable diagram generation |
| `usemermaid` | `false` | Alias for `usediagrams` |
| `usecharts` | `false` | Enable chart generation |
| `usevectors` | `false` | Enable vector bundle (`usesvg=true` + `usediagrams=true`) |
| `mcp` | - | MCP servers to load |
| `mcpproxy` | `false` | MCP proxy mode |
| `mcpproxythreshold` | `0` | Proxy auto-spill byte threshold (`0` disables); large results written to temp file |
| `mcpproxytoon` | `false` | TOON serialization for spilled proxy results |
| `mcpproxyallow` | - | Comma-separated allowlist of downstream tool names exposed through proxy-dispatch |
| `mcpproxydeny` | - | Comma-separated denylist of downstream tool names hidden from proxy-dispatch (applied after `mcpproxyallow`) |
| `mcpprogcall` | `false` | Enable localhost bridge for programmatic MCP tool calls |
| `mcpprogcallport` | `0` | Programmatic MCP bridge port (`0` auto-selects) |
| `mcpprogcallmaxbytes` | `4096` | Max inline bridge response size before spill |
| `mcpprogcallresultttl` | `600` | TTL (seconds) for spilled bridge results |
| `mcpprogcallbatchmax` | `10` | Max tool calls accepted per bridge batch request |
| `maxpromptchars` | `120000` | Max accepted prompt size for incoming web prompts |
| `lccontextlimit` | `0` | Escalate to main model when low-cost model context gets too large |
| `deescalate` | `3` | Successful steps before returning from main model to low-cost model |
| `modellock` | `auto` | Force model tier: `main`, `lc`, or `auto` |
| `modelstrategy` | `default` | Model orchestration profile: `default` (adaptive LC-first), `advisor` (LC executor + main as selective advisor), or `delegate` (LC runs all steps including step 0) |
| `advisorenable` | `true` | Enable advisor consultations when `modelstrategy=advisor` |
| `advisormaxuses` | `2` | Max advisor consultations per run when `modelstrategy=advisor` |
| `advisoronrisk` | `true` | Allow advisor consults on risk signals |
| `advisoronambiguity` | `true` | Allow advisor consults on ambiguity signals |
| `advisoronharddecision` | `true` | Allow advisor consults for hard-decision checkpoints |
| `advisorcooldownsteps` | `2` | Min steps between advisor consultations |
| `advisorbudgetratio` | `0.20` | Fraction of session token budget advisor calls may consume |
| `emergencyreserve` | `0.10` | Portion of advisor budget reserved for high-risk/high-value consults |
| `harddecision` | `warn` | Hard-decision checkpoint mode: `require`, `warn`, or `off` |
| `evidencegate` | `false` | Enable lightweight evidence gating for non-trivial actions |
| `evidencegatestrictness` | `medium` | Tuning level for evidence gate heuristics: `low`, `medium`, or `high` |
| `usewiki` | `false` | Enable wiki knowledge base |
| `wikiaccess` | `ro` | Wiki access: `ro` (read-only) or `rw` (read-write) |
| `wikibackend` | `fs` | Wiki backend: `fs` (filesystem), `s3`, `s3fs`, or `es` (Elasticsearch/OpenSearch) |
| `wikiroot` | `.` | Root directory for the `fs` backend |
| `wikibucket` | - | S3 bucket name (`s3` backend) |
| `usememory` | `false` | Enable the working memory subsystem |
| `memoryuser` | `false` | Convenience preset: file-backed global + session memory at `~/.openaf-mini-a/`, auto-promote `facts,decisions,summaries`, 30-day stale sweep |
| `memoryusersession` | `false` | Convenience preset: enables `usememory`, session-only file-backed channel under `~/.openaf-mini-a/` |
| `memoryscope` | `both` | Which store the agent reads from/writes to: `session`, `global`, or `both` |
| `memorych` | - | SLON/JSON definition of an OpenAF channel to persist the global memory store |
| `memorysessionch` | - | SLON/JSON definition of a channel for session memory persistence (falls back to `memorych`) |
| `memorysessionid` | `<agent-id>` | Session key used to namespace session memory in the channel |
| `memorymaxpersection` | `80` | Maximum entries kept per section before compaction drops stale/old ones |
| `memorymaxentries` | `500` | Hard cap on total entries across all sections |
| `memorycompactevery` | `8` | How many appends trigger an automatic compaction pass |
| `memorydedup` | `true` | Suppress near-duplicate entries (85% word-overlap fingerprint) |
| `memorypromote` | `""` | Auto-promote selected sections from session to global memory at session end |
| `memorystaledays` | `0` | Mark unconfirmed global memory entries as `stale` after N days |
| `memoryinject` | `summary` | Inject memory as section counts (`summary` with dynamic search) or full compact entries (`full`) |
| `memorysessionheader` | — | HTTP request header name used to derive the memory session ID in web mode (e.g. `X-User-Id`) |
| `llmcomplexity` | `false` | Validate medium-complexity routing with an LC model check |
| `metricsch` | - | SLON/JSON channel for recording periodic metrics snapshots — see [Channels]({{ '/channels' | relative_url }}) (note: backend options nest under `options:`, e.g. `(name: 'mini-a-metrics', type: 'mvs', options: (file: 'metrics.db'), period: 5000)`) |
| `usedelegation` | `false` | Agent delegation |
| `workers` | - | Remote worker URLs for delegation |
| `workertags` | — | Comma-separated tags appended to the default worker skill in the AgentCard |
| `usea2a` | `false` | Use A2A HTTP+JSON endpoints for remote worker delegation |
| `apitoken` | — | Bearer token for authenticating requests to the worker API server |
| `autodelegation` | `false` | Auto-delegate noisy/oversized tool results to a summarization sub-agent (requires `usedelegation=true`) |
| `autodelegationthreshold` | `8192` | Byte size threshold that triggers auto-delegation |
| `autodelegationmaxperstep` | `2` | Max auto-delegations per agent step |
| `noisytools` | `""` | Comma-separated tool names always auto-delegated regardless of result size |
| `subtasks` | `""` | Pipe-separated startup scout goals submitted before the main loop |
| `subtasksfile` | `""` | Path to YAML/JSON file of `{goal, fork, args, timeout}` startup task objects |
| `subtaskssequential` | `false` | Run startup scouts (and all subtasks) one at a time instead of in parallel |
| `forkstatemaxbytes` | `65536` | Max bytes of serialized fork state transmitted to a remote worker |
| `toolfallback` | `false` | Fall back to action mode when malformed pseudo tool calls are emitted by the model |
| `dream` | `false` | Run in standalone dream-pass mode (memory/wiki consolidation) instead of a regular session |
| `dryrun` | `false` | Preview dream-pass changes without writing anything back |
| `dreamwikimode` | `apply` | Wiki dream mode: `lint`, `plan`, `apply`, `reorg` |
| `dreammemorymode` | `apply` | Memory dream mode: `plan` or `apply` |
| `dreamwikiapply` | `false` | Required write gate for wiki apply/reorg |
| `dreamwikiapproval` | `ask` | Reorg approval mode: `auto`, `ask`, `never` |
| `dreamwikireorg` | `false` | Allow structural wiki reorg |
| `dreamreport` | — | Optional JSON output report path |
| `dreammaxsteps` | `60` | Maximum agent steps for the wiki dream pass |
| `maxauditrecords` | `200` | Maximum audit log entries included in the memory dream consolidation prompt |
| `onport` | - | Web UI port |
| `maxpromptchars` | `120000` | Max accepted prompt size for incoming web prompts |
| `ssequeuetimeout` | `120` | Web SSE stream queue timeout in seconds |
| `logpromptheaders` | - | Comma-separated HTTP request header names to log alongside incoming web prompts |
| `usehistory` | `false` | Enable conversation history persistence in web mode |
| `useattach` | `false` | Enable file attachment support in web mode |
| `historykeep` | `false` | Keep finished web conversation history files instead of discarding them |
| `historypath` | - | Directory path used to store web conversation history files |
| `historyretention` | `600` | Web history retention window in seconds |
| `historykeepperiod` | - | Delete kept conversation files older than this many minutes |
| `historykeepcount` | - | Keep only the newest N kept conversation files |
| `historys3bucket` | - | S3 bucket used to mirror history files |
| `historys3prefix` | - | S3 key prefix for mirrored history files |
| `historys3url` | - | S3 endpoint URL for history mirroring |
| `historys3accesskey` | - | S3 access key for history mirroring |
| `historys3secret` | - | S3 secret key for history mirroring |
| `historys3region` | - | S3 region for history mirroring |
| `historys3useversion1` | `false` | Use S3 path-style (v1) signing for history mirroring |
| `historys3ignorecertcheck` | `false` | Disable TLS certificate checks for history S3 access |
| `homedir` | — | Override the home directory used to locate the `.openaf-mini-a` folder |

## Agent Files

Load a complete agent profile from a markdown file with YAML frontmatter:

```bash
mini-a agent=my-agent.agent.md goal="..."
mini-a --agent   # Print a starter template
```

Supported frontmatter keys: `name`, `description`, `model`, `capabilities`, `tools`, `constraints`, `rules`, `knowledge`, `youare`, `mini-a` (parameter overrides).

`agentfile=` is a backward-compatible alias for `agent=`.

## File Inclusion

```bash
mini-a useutils=true goal='@file.txt Summarize this file'
mini-a useutils=true goal='@data.csv Analyze it'
```

## Custom Commands, Skills, Hooks

| Item | Path/Command |
|------|--------------|
| Custom slash template | `~/.openaf-mini-a/commands/<name>.md` |
| Skill (folder) | `~/.openaf-mini-a/skills/<name>/SKILL.md` |
| Skill (file) | `~/.openaf-mini-a/skills/<name>.md` |
| Hooks | `~/.openaf-mini-a/hooks/*.yaml|*.yml|*.json` |
| Extra command dirs | `extracommands=/path/a,/path/b` |
| Extra skill dirs | `extraskills=/path/a,/path/b` |
| Extra hook dirs | `extrahooks=/path/a,/path/b` |
| Alternate config base | `homedir=/opt/shared/mini-a-config` |
| Run one template | `mini-a exec="/<name> arg1 arg2"` |
| List skills | `/skills` |

## Mode Presets

| Mode | Enables |
|------|---------|
| `shell` | Read-only shell access (`useshell=true`) |
| `shellrw` | Shell + write access + non-interactive shell approvals |
| `utils` | Mini Utils Tool preset (`useutils=true mini-a-docs=true usetools=true`) |
| `chatbot` | Chat-only mode |
| `internet` | Internet-focused MCP/tool mode with docs-aware utils |
| `news` | Internet + RSS news-focused MCP mode |
| `poweruser` | High-capability preset with shell, utils, proxy tuning, and docs-aware defaults |
| `web` | Browser UI preset with MCP tools enabled |
| `webfull` | Full web UI preset with history, attachments, proxying, and richer rendering modes |

Custom modes: create `~/.openaf-mini-a_modes.yaml` with a `modes:` map. Custom definitions are merged with built-ins and override duplicates.

```yaml
# ~/.openaf-mini-a_modes.yaml
modes:
  mypreset:
    useshell: true
    readwrite: true
    maxsteps: 30
```

```bash
mini-a mode=mypreset goal='your goal here'
```

## Dual-Model Setup

```bash
export OAF_MODEL="(type: openai, model: gpt-5-mini, key: '...')"
export OAF_LC_MODEL="(type: openai, model: gpt-5-nano, key: '...')"
export OAF_VAL_MODEL="(type: openai, model: gpt-5-mini, key: '...')"
# Saves 50-70% on token costs
```

```bash
# Optional prompt-mode controls (Gemini main auto-enables when unset)
export OAF_MINI_A_NOJSONPROMPT=true
export OAF_MINI_A_LCNOJSONPROMPT=true
```

## Full Debug

Capture everything — agent activity, main-model payloads, and low-cost model payloads — to separate JSON files:

```bash
mini-a goal="your goal" \
  auditch="(type: file, options: (file: audit.json))" \
  debugch="(type: file, options: (file: debug.json))" \
  debuglcch="(type: file, options: (file: debuglc.json))"
```

Add `debugvalch` when using a validation model (`deepresearch=true`):

```bash
mini-a goal="research task" deepresearch=true \
  auditch="(type: file, options: (file: audit.json))" \
  debugch="(type: file, options: (file: debug.json))" \
  debuglcch="(type: file, options: (file: debuglc.json))" \
  debugvalch="(type: file, options: (file: debugval.json))"
```

## Config Home (`homedir`)

By default Mini-A reads `~/.openaf-mini-a`. Override with `homedir=`:

```bash
# Shared team config
mini-a homedir=/opt/shared/mini-a-config goal="..."

# Per-project isolated config
mini-a homedir=./my-project-config goal="..."

# Shared base + extra project skills
mini-a homedir=/opt/shared/mini-a-config extraskills=./project-skills goal="..."
```

## Docker

```bash
# Interactive
docker run -it -e OAF_MODEL="(type: openai, model: gpt-5-mini, key: '...')" openaf/mini-a
# Web UI
docker run -p 8080:8080 -e OAF_MODEL="(type: openai, model: gpt-5-mini, key: '...')" openaf/mini-a onport=8080
```

## Common MCP Servers

| Server | Tools | Example |
|--------|-------|---------|
| `mcp-time` | Current time, timezone conversion | `mcp="(cmd: 'ojob mcps/mcp-time.yaml')"` |
| `mcp-db` | SQL queries, schema inspection | `mcp="(cmd: 'ojob mcps/mcp-db.yaml')"` |
| `mcp-web` | Web search, fetch pages | `mcp="(cmd: 'ojob mcps/mcp-web.yaml')"` |
| `mcp-file` | File operations | `mcp="(cmd: 'ojob mcps/mcp-file.yaml')"` |
| `mcp-shell` | Shell command execution | `mcp="(cmd: 'ojob mcps/mcp-shell.yaml')"` |
