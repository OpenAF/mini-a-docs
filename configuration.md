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
| `modelval` | - | Runtime override for the validation model configuration; same format as `OAF_VAL_MODEL` |
| `modellock` | `auto` | Force model-tier selection: `main`, `lc`, or `auto` |
| `lccontextlimit` | `0` | Escalate from low-cost model to main model when context tokens reach this threshold (`0` disables) |
| `deescalate` | `3` | Consecutive successful steps required before switching back to the low-cost model after escalation |
| `lcescalatedefer` | `true` | Defer LC-to-main escalation by one step when LC confidence remains high |
| `lcbudget` | `0` | Maximum total LC token budget before permanently switching to the main model (`0` = unlimited) |
| `llmcomplexity` | `false` | Use a quick LC validation call for medium-complexity routing heuristics |
| `modelstrategy` | `default` | Model orchestration profile: `default` (LC-first with escalation) or `advisor` (LC executes, main model consulted selectively for difficult steps) |
| `advisormaxuses` | `2` | Maximum advisor consultations per run when `modelstrategy=advisor` |
| `advisorcooldownsteps` | `2` | Minimum step distance between advisor consultations when `modelstrategy=advisor` |
| `maxtokens` | - | Maximum output tokens |
| `rpm` | - | Requests per minute limit |
| `tpm` | - | Tokens per minute limit |

</div>

<div class="config-category" markdown="1">

## 2. Core Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `goal` | - | The task/goal for the agent to accomplish |
| `verbose` | `false` | Print more detailed runtime logs |
| `useshell` | `false` | Enable shell command execution |
| `chatbotmode` | `false` | Pure chat mode without tools |
| `maxsteps` | `15` | Maximum number of agent steps |
| `rtm` | - | Legacy alias for `rpm` |
| `format` | - | Output format (e.g., `json`, `yaml`, `markdown`) |
| `youare` | - | Custom system persona/identity |
| `chatyouare` | - | Chatbot-mode persona override when `chatbotmode=true` |
| `rules` | - | Additional rules or instructions for the agent (plain text, bullet list, or JSON/SLON array of strings) |
| `knowledge` | - | Knowledge base content or file path |
| `conversation` | - | Conversation history file to preload at startup |
| `state` | - | Structured initial state data (JSON/SLON) provided to the agent |
| `raw` | `false` | Return raw output without extra formatting |
| `showthinking` | `false` | Surface XML-tagged model thinking blocks as thought logs |
| `debug` | `false` | Enable debug logging |
| `debugfile` | - | Write debug output as NDJSON to a file (implies `debug=true`) |
| `debugch` | - | SLON channel definition for main-model LLM traffic — see [Channels]({{ '/channels' | relative_url }}) |
| `debuglcch` | - | SLON channel definition for low-cost-model LLM traffic — see [Channels]({{ '/channels' | relative_url }}) |
| `debugvalch` | - | SLON channel definition for validation-model traffic when `llmcomplexity=true` — see [Channels]({{ '/channels' | relative_url }}) |
| `outfile` | - | Save final answer to file |
| `outfileall` | - | Deep research only: save full cycle history/verdicts/learnings to file |
| `outputfile` | - | Alternate key for `outfile`, mainly used by plan conversion flows |
| `extracommands` | - | Comma-separated extra directories for custom slash command templates |
| `extraskills` | - | Comma-separated extra directories for custom skills |
| `extrahooks` | - | Comma-separated extra directories for hook definitions |
| `secpass` | - | Password used to open OpenAF sBucket model secrets |
| `auditch` | - | SLON channel definition for agent interaction audit logs — see [Channels]({{ '/channels' | relative_url }}) for backend options and examples |
| `toollog` | - | SLON channel definition for dedicated MCP tool input/output logs — see [Channels]({{ '/channels' | relative_url }}) for backend options and examples |
| `metricsch` | - | SLON/JSON channel definition for recording periodic Mini-A metrics snapshots (e.g. `(name: 'mini-a-metrics', type: 'mvs', options: (file: '/tmp/mini-a-metrics.db'))`). Supports optional `period`, `some`, and `noDate` fields — see [Channels]({{ '/channels' | relative_url }}) |

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
| `nosetmcpwd` | `false` | Do not set the default MCP command working directory to the mini-a install path |

</div>

<div class="config-category" markdown="1">

## 4. Tool Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `useutils` | `false` | Enable Mini Utils Tool utilities (`init`, `filesystemQuery`, `filesystemModify`, `markdownFiles`) |
| `useskills` | `false` | Expose skill operations in Mini Utils Tool (requires `useutils=true`) |
| `utilsroot` | - | Root path used by Mini Utils file operations |
| `mini-a-docs` | `false` | If `true` and `utilsroot` is not set, automatically uses the mini-a oPack docs path as `utilsroot` |
| `miniadocs` | `false` | Alias for `mini-a-docs` |
| `usetools` | `false` | Enable tool usage |
| `usejsontool` | `false` | Register a compatibility `json` tool for models that sometimes emit `json` tool calls |
| `libs` | - | Additional library paths to load |
| `toolcachettl` | `600000` | Default cache TTL in milliseconds for MCP tool results |
| `toolfallback` | `false` | Fall back to action mode when the model emits malformed pseudo tool calls |
| `utilsallow` | - | Comma-separated allowlist of Mini Utils Tool names to expose when `useutils=true` |
| `utilsdeny` | - | Comma-separated denylist of Mini Utils Tool names to hide when `useutils=true` (applied after `utilsallow`) |

</div>

<div class="config-category" markdown="1">

## 5. Context Management

| Parameter | Default | Description |
|-----------|---------|-------------|
| `maxcontext` | - | Maximum context window tokens |
| `maxcontent` | - | Alias for `maxcontext` |
| `maxtokens` | - | Maximum response tokens |
| `autocompact` | `true` | Auto-compact when context is full |

</div>

<div class="config-category" markdown="1">

## 6. Deep Research

| Parameter | Default | Description |
|-----------|---------|-------------|
| `deepresearch` | `false` | Enable iterative research-validate-learn cycles |
| `validationgoal` | - | Validation criteria for deep research output quality (inline text or file path) |
| `valgoal` | - | Alias for `validationgoal` |
| `vmodel` | - | Optional dedicated validation model used in deep-research scoring |
| `modelval` | - | Per-run validation-model override using the same SLON/JSON definition accepted by `OAF_VAL_MODEL` |
| `maxcycles` | `3` | Maximum number of deep-research cycles |
| `validationthreshold` | `PASS` | Validation verdict or score rule required to stop iterating |
| `persistlearnings` | `true` | Carry learnings from failed validation cycles into the next cycle |

</div>

<div class="config-category" markdown="1">

## 7. Planning

| Parameter | Default | Description |
|-----------|---------|-------------|
| `useplanning` | `false` | Enable agent planning |
| `forceplanning` | `false` | Force planning even when heuristics would normally skip it |
| `planstyle` | `simple` | Planning style: `simple` (flat sequential steps, default) / `legacy` (phase-based hierarchical) |
| `earlystopthreshold` | `3` | Consecutive think/error-like steps before stronger recovery logic is triggered |
| `planmode` | `false` | Run in plan-only mode without executing the plan |
| `validateplan` | `false` | Validate a plan without executing it |
| `convertplan` | `false` | Convert a loaded/generated plan to another format and exit |
| `resumefailed` | `false` | Attempt to resume the last failed goal on startup |
| `planfile` | - | File to save/load plans |
| `planformat` | - | Plan format override, typically `md` or `json` |
| `plancontent` | - | Inline Markdown or JSON plan content |
| `updatefreq` | `auto` | Plan update cadence: `auto`, `always`, `checkpoints`, or `never` |
| `updateinterval` | `3` | Steps between automatic updates when `updatefreq=auto` |
| `forceupdates` | `false` | Force plan updates even after failed actions |
| `planlog` | - | File path to append plan update logs |
| `saveplannotes` | `false` | Save execution notes back into the plan file after execution |
| `usethinking` | `false` | Enable chain-of-thought reasoning |

</div>

<div class="config-category" markdown="1">

## 7a. Outer Loop Autonomous Coding

| Parameter | Default | Description |
|-----------|---------|-------------|
| `outerloop` | `false` | Enable autonomous multi-cycle coding loop with durable per-session state |
| `outerloopinstructions` | - | Path to persistent outer loop instructions Markdown file |
| `taskfile` | - | Alias for `outerloopinstructions` |
| `specfile` | - | Alias for `outerloopinstructions` |
| `outerloopsessionid` | auto-generated | Session ID used as the directory name under `~/.openaf-mini-a/sessions/`; pass the same ID to resume an interrupted run |
| `outerloopmaxcycles` | `5` | Maximum number of outer loop cycles |
| `outerloopmaxtime` | `0` | Maximum outer loop runtime in seconds (`0` disables) |
| `outerloopstoponrepeat` | `false` | Stop when the same validation failure repeats |
| `outerloopmaxnochange` | `2` | Stop after N cycles without meaningful change |

</div>

<div class="config-category" markdown="1">

## 8. Shell Access

| Parameter | Default | Description |
|-----------|---------|-------------|
| `useshell` | `false` | Enable shell commands |
| `shell` | - | Prefix applied to every shell command |
| `readwrite` | `false` | Allow file write operations |
| `shelltimeout` | - | Maximum shell command runtime in milliseconds before timeout |
| `shellmaxbytes` | `8000` | Truncate oversized shell output to head/tail excerpts with a banner |
| `shellallow` | - | Allowed shell commands (comma-separated) |
| `shellallowpipes` | `false` | Allow pipes, redirection, and shell control operators |
| `shellbanextra` | - | Additional banned shell commands (comma-separated) |
| `checkall` | `false` | Ask for confirmation before every shell command |
| `shellbatch` | `false` | Run shell commands without interactive approval prompts |
| `shellprefix` | - | Override shell prefix when converting or replaying stored plans |
| `shellban` | - | Banned shell commands (comma-separated) |

### Shell Sandbox

| Parameter | Default | Description |
|-----------|---------|-------------|
| `usesandbox` | `off` | Enable built-in OS sandbox presets for shell commands (`off`, `auto`, `linux`, `macos`, `windows`) |
| `sandboxprofile` | - | Optional macOS sandbox profile path (mini-a auto-generates a restrictive temporary `.sb` profile otherwise) |
| `sandboxnonetwork` | `false` | Disable network inside the built-in sandbox when supported |

</div>

<div class="config-category" markdown="1">

## 9. Visual & Output

| Parameter | Default | Description |
|-----------|---------|-------------|
| `useascii` | `false` | Enable ASCII art generation |
| `usesvg` | `false` | Enable SVG generation for custom visuals and infographics |
| `usemaps` | `false` | Enable map visualization |
| `usemath` | `false` | Enable LaTeX math guidance for KaTeX rendering in the web UI |
| `usediagrams` | `false` | Enable diagram generation |
| `usemermaid` | `false` | Alias for `usediagrams` |
| `usecharts` | `false` | Enable chart generation |
| `usevectors` | `false` | Enable the vector bundle (`usesvg=true` + `usediagrams=true`), preferring Mermaid for structural diagrams and SVG for infographics/custom visuals |
| `usestream` | `false` | Enable response streaming |
| `format` | - | Output format constraint |

</div>

<div class="config-category" markdown="1">

## 10. Delegation

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
| `delegationtimeout` | `300000` | Default foreground wait/delegation budget in milliseconds |
| `delegationstalltimeout` | `300000` | Idle time before a running delegated subtask is considered stalled; active tasks keep running |
| `delegationhardtimeout` | - | Optional absolute delegated subtask timeout regardless of activity (ms) |
| `delegationmaxretries` | `2` | Retry count for failed delegated subtasks |
| `workermode` | `false` | Launch mini-a as a Worker API server |
| `showdelegate` | `false` | Show delegation events in the console |
| `workerskills` | - | Comma-separated list (or JSON/SLON array) of A2A skill IDs this worker advertises (e.g. `"shell,time"`) |
| `shellworker` | `false` | Convenience shorthand: sets `useshell=true` and auto-emits the `shell` A2A skill |
| `workerspecialties` | - | Comma-separated specialty tags injected into the `run-goal` A2A skill description |

</div>

<div class="config-category" markdown="1">

## 10a. Agent Files

Load a preconfigured mini-a profile from a markdown file with YAML frontmatter.

```bash
mini-a agent=examples/my-agent.agent.md goal="..."
mini-a agent="---\nname: quick\ncapabilities:\n  - useutils\n---" goal="..."
mini-a --agent   # Print a starter template
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `agent` | - | Path to an agent markdown file, or inline markdown with YAML frontmatter |
| `agentfile` | - | Backward-compatible alias for `agent` |

See the [Agent Files]({{ '/agents' | relative_url }}) page for the complete reference: all frontmatter keys, tool entry types, `mini-a:` overrides, relative file resolution, precedence rules, and a full annotated example.

</div>

<div class="config-category" markdown="1">

## 10b. Conversation History

| Parameter | Default | Description |
|-----------|---------|-------------|
| `historykeep` | `false` | Save console conversations to `~/.openaf-mini-a/history` for future resumption |
| `historykeepperiod` | - | Delete kept conversation files older than this many minutes |
| `historykeepcount` | - | Keep only the newest N kept conversation files |

</div>

<div class="config-category" markdown="1">

## 10b. Working Memory

Enable a structured, scoped working memory subsystem that the agent maintains automatically across tool calls, runs, and sessions. Working memory prevents context window bloat while preserving key learnings, decisions, and evidence.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `usememory` | boolean | `false` | Enable the working memory subsystem. Set `false` to disable all memory tracking. |
| `memoryuser` | boolean | `false` | Convenience preset: enables `usememory`, creates `~/.openaf-mini-a/`, registers file-backed global + session channels, auto-promotes `facts,decisions,summaries`, and sets `memorystaledays=30`. |
| `memoryusersession` | boolean | `false` | Convenience preset: enables `usememory`, creates `~/.openaf-mini-a/`, sets `memoryscope=session`, and registers a file-backed session channel. |
| `memoryscope` | string | `both` | Which store the agent reads from and defaults writes to: `session` (current run), `global` (across sessions), or `both`. |
| `memorych` | string | - | SLON/JSON definition of an OpenAF channel to persist global memory (e.g. file, Redis, jdbc). |
| `memorysessionch` | string | - | SLON/JSON definition of a channel for session memory persistence (falls back to `memorych` if omitted). |
| `memorysessionid` | string | `<agent-id>` | Session key namespace in the channel (defaults to `conversation` argument, otherwise falls back to internal agent ID). |
| `memorymaxpersection` | number | `80` | Maximum entries kept per section before compaction prunes stale or old entries. |
| `memorymaxentries` | number | `500` | Hard cap on total entries across all sections. |
| `memorycompactevery` | number | `8` | Number of append operations that trigger an automatic memory compaction pass. |
| `memorydedup` | boolean | `true` | Suppress near-duplicate entries using an 85% word-overlap fingerprint. |
| `memorypromote` | string | `""` | Comma-separated list of sections to auto-promote from session to global memory at session end. |
| `memorystaledays` | number | `0` | Days without confirmation before a global entry is marked `stale` (cleared during compaction if section overflows). |
| `memoryinject` | string | `summary` | Context injection style: `summary` injects only per-section counts and enables dynamic `memory_search`; `full` embeds the entire memory snapshot in every step's context. |
| `memorysessionheader` | string | - | HTTP header name used to derive `memorysessionid` in Web/Server UI mode (e.g., `X-User-Id`). |

### Memory Sections
Memory is categorized into 8 independent, typed sections that the agent manages automatically:
* **`facts`**: Confirmed facts and truths discovered or verified during the run.
* **`evidence`**: Direct observations, statistics, and tool outputs worth remembering.
* **`decisions`**: Architecture or workflow choices made along with their rationale.
* **`risks`**: Tool failures, sub-agent issues, validation warnings, or blockers.
* **`openQuestions`**: Pending questions, gaps in specifications, or follow-up items.
* **`hypotheses`**: Unconfirmed assumptions or candidate approaches being explored.
* **`artifacts`**: Excerpts of generated configs, code blocks, or structured outputs.
* **`summaries`**: Higher-level narrative overviews of completed milestones or phases.

### Convenience Presets

To avoid configuring channels manually, use one of the two convenience presets:
1. **`memoryuser=true`**: Ideal for persistent local development. Automatically stores memory databases under `~/.openaf-mini-a/memory-global.json` and `~/.openaf-mini-a/memory-session.json`. At the end of a session, facts, decisions, and summaries are promoted to global memory, and any entry not verified in 30 days is swept.
2. **`memoryusersession=true`**: Ideal for isolated, session-scoped runs where you still want local persistent history on the disk (saved under `~/.openaf-mini-a/memory-session.json`), but no information should leak into the shared global namespace.

### Dynamic Context Injection (`memoryinject=summary`)

> [!TIP]
> **Use the default `memoryinject=summary`** for complex or long-running tasks. Instead of injecting all memory entries into every step's prompt (which wastes thousands of tokens and causes model distraction), Mini-A only injects the counts (e.g., `workingMemory: { facts: 12, decisions: 3 }`). 
> The agent is equipped with a `memory_search` action to retrieve specific facts or decisions *on demand* using keyword queries, saving up to 95% of context memory overhead.

### Configuration Examples

```yaml
# Inside an agent file frontmatter (my-agent.agent.md)
mini-a:
  usememory: true
  memoryuser: true
  memoryinject: summary
```

```bash
# Running with separate session/global file channels and a custom session namespace
mini-a goal="audit security modules" \
  usememory=true \
  memorych="(name: sec_global, type: file, options: (file: '/var/data/global-sec.json'))" \
  memorysessionch="(name: sec_session, type: file, options: (file: '/var/data/session-sec.json'))" \
  memorysessionid="audit-q2-2026"
```

</div>

<div class="config-category" markdown="1">

## 10c. Wiki Knowledge Base

A persistent, shared Markdown wiki that agents read from and write to across sessions. Any agent pointing at the same `wikiroot` (or `wikibucket`) sees the same pages.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `usewiki` | `false` | Enable the wiki knowledge base |
| `wikiaccess` | `ro` | Access mode: `ro` (read-only) or `rw` (read-write) |
| `wikibackend` | `fs` | Backend: `fs` (filesystem), `s3`, `s3fs`, or `es` (Elasticsearch/OpenSearch) |
| `wikiroot` | `.` | Root directory for the `fs` backend |
| `wikibucket` | - | S3 bucket name (`s3`/`s3fs` backend) |
| `wikiprefix` | - | S3 key prefix (`s3`/`s3fs`); Elasticsearch index name for `es` (defaults to `mini_a_wiki`) |
| `wikiurl` | - | S3-compatible endpoint URL (`s3`/`s3fs`); Elasticsearch/OpenSearch base URL for `es` |
| `wikiaccesskey` | - | S3 access key (`s3`/`s3fs`); Elasticsearch username for `es` |
| `wikisecret` | - | S3 secret key (`s3`/`s3fs`); Elasticsearch password for `es` |
| `wikiregion` | - | S3 region (`s3`/`s3fs` backend) |
| `wikiuseversion1` | `false` | Use S3 path-style (v1) signing (`s3`/`s3fs` backend) |
| `wikiignorecertcheck` | `false` | Skip TLS certificate validation (`s3`/`s3fs` backend) |
| `wikilintstaleddays` | `90` | Days before a page without an `updated` field is marked stale in lint |

When a new empty wiki is opened with `wikiaccess=rw`, Mini-A bootstraps `AGENTS.md` (ingestion workflow and rules) and `index.md` (entrypoint). `AGENTS.md` is protected and cannot be deleted.

Wiki operations available to the agent: `list`, `tree`, `browse`, `read`, `search`, `backlinks`, `lint`, `write`, `move`, `init`, `reindex`.
Operations that require `wikiaccess=rw`: `write`, `move`, `init`, `reindex`.
Console commands: `/wiki list [prefix]`, `/wiki tree [prefix]`, `/wiki browse [prefix]`, `/wiki read <page.md>`, `/wiki search <query>`, `/wiki backlinks <page.md>`, `/wiki lint`, `/wiki reindex`.
Use `/stats wiki` to see per-operation counters for the current session.

</div>

<div class="config-category" markdown="1">

## 10c-1. Dreams (Sleep Pass)

An LLM-powered off-line consolidation pass over persistent memory and/or the wiki. Run after a session to merge duplicates, surface insights, and produce a lint-clean wiki.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `dream` | `false` | Run in standalone dream-pass mode instead of a regular agent session |
| `dryrun` | `false` | Preview what would change without writing anything back |
| `dreamwikimode` | `apply` | Wiki dream mode: `lint`, `plan`, `apply`, `reorg` |
| `dreammemorymode` | `apply` | Memory dream mode: `plan` or `apply` |
| `dreamwikiapply` | `false` | Required write gate for wiki `apply` or `reorg` modes |
| `dreamwikiapproval` | `ask` | Reorg approval mode: `auto`, `ask`, `never` |
| `dreamwikireorg` | `false` | Allow structural reorg operations during wiki dream |
| `dreamreport` | - | Optional file path to write JSON run report |
| `maxauditrecords` | `200` | Maximum audit log entries included in the memory consolidation prompt |
| `dreammaxsteps` | `60` | Maximum agent steps for the wiki dream pass |

The `memorych`, `memorysessionch`, `memorysessionid`, `auditch`, `usewiki`, and `model` parameters are shared with the memory and wiki subsystems. See the [Advanced — Dreams]({{ '/advanced/' | relative_url }}#dreams-sleep-pass) page for full documentation and examples.

</div>

<div class="config-category" markdown="1">

## 10d. Adaptive Routing

A rule-based routing layer that selects how each tool action is dispatched. When disabled, mini-a uses legacy behavior.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `adaptiverouting` | `false` | Enable rule-based adaptive tool routing |
| `routerorder` | - | Preferred route execution order (comma-separated route types) |
| `routerallow` | - | Allowlist of route types the router may select (comma-separated) |
| `routerdeny` | - | Denylist of route types the router must never select (comma-separated) |
| `routerproxythreshold` | - | Byte threshold to prefer the proxy route for large payloads (falls back to `mcpproxythreshold` when omitted) |

**Route types**: `direct_local_tool`, `mcp_direct_call`, `mcp_proxy_path`, `shell_execution`, `utility_wrapper`, `delegated_subtask`.

Route selection is based on intent hints (read/write, payload size, latency sensitivity, risk level, structured output preference) and historical route success. Fallback chains are attempted in order; each failed attempt is appended to an `errorTrail`. Route decisions are visible in debug/audit output as `[ROUTE ...]` records when `debug=true`.

</div>

<div class="config-category" markdown="1">

## 11. Web Interface

| Parameter | Default | Description |
|-----------|---------|-------------|
| `onport` | - | Port for web UI (enables web mode) |
| `maxpromptchars` | `120000` | Maximum accepted prompt size for incoming web `/prompt` requests |

</div>

<div class="config-category" markdown="1">

## 12. Knowledge & Persona

| Parameter | Default | Description |
|-----------|---------|-------------|
| `knowledge` | - | Knowledge base content or file |
| `youare` | - | Agent persona/identity description |
| `chatyouare` | - | Chatbot-mode persona override |
| `rules` | - | Behavioral rules for the agent |

</div>

<div class="config-category" markdown="1">

## 13. Rate Limiting

| Parameter | Default | Description |
|-----------|---------|-------------|
| `rpm` | - | Requests per minute limit |
| `tpm` | - | Tokens per minute limit |
| `rtm` | - | Legacy alias for `rpm` |

</div>

<div class="config-category" markdown="1">

## 14. Docker Environment Variables

| Variable | Maps to |
|----------|---------|
| `OAF_MODEL` | `model` |
| `OAF_LC_MODEL` | `modellc` |
| `OAF_VAL_MODEL` | `modelval` — dedicated validation model for deep research scoring |
| `OAF_MINI_A_NOJSONPROMPT` | Force text prompt mode for main model; Gemini main models auto-enable this behavior when unset |
| `OAF_MINI_A_LCNOJSONPROMPT` | Force text prompt mode for low-cost model (set explicitly for Gemini low-cost models) |
| `OAF_MINI_A_CON_HIST_SIZE` | Maximum console history size (defaults to JLine's default) |
| `OAF_MINI_A_LIBS` | Comma-separated library paths to load automatically at startup |
| `MINI_A_GOAL` | `goal` |
| `MINI_A_PORT` | `onport` |
| `OAF_MODEL` / `OAF_LC_MODEL` `key` field | Provider API credential (recommended) |
| `GITHUB_TOKEN` | GitHub Models token (optional when `key` is provided in model config) |

</div>

<div class="config-category" markdown="1">

## 15. Console Commands Reference

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/model` | Show current model info |
| `/models` | Show all configured model tiers (main, LC, validation) with provider and source |
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

## 16. Mode Presets

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

<div class="config-category" markdown="1">

## Channels

mini-a uses **OpenAF channels** as the pluggable storage backend for audit logs, tool logs, and debug traffic. The channel-accepting parameters (`auditch`, `toollog`, `debugch`, `debuglcch`, `debugvalch`, `metricsch`) each accept a SLON definition that specifies the backend, channel name, and options.

See the **[Channels]({{ '/channels' | relative_url }})** reference for the complete definition format, every supported backend (file, MVS, Redis, S3, and more), and ready-to-use query examples.

</div>

<div class="config-category" markdown="1">

## Advanced Topics

For power-user configuration, deployment patterns, and provider-specific guides, see the **[Advanced]({{ '/advanced' | relative_url }})** page. Topics covered:

- Dual-model setup and advisor strategy mode
- MCP advanced options — proxy, dynamic discovery, lazy loading
- Custom slash commands, skills, and hooks
- Performance tuning and context management
- Shell sandboxing — OS-level (`usesandbox`), Docker, Podman, Apple container CLI
- Delegation and dynamic worker registration (including Kubernetes HPA patterns)
- Dreams (sleep pass) — LLM-powered memory and wiki consolidation
- JavaScript and oJob library integration
- Debugging techniques and provider-specific guides (AWS Bedrock, GitHub Models, Ollama)

</div>
