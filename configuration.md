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
| `modellock` | `auto` | Select the model tier for normal steps: `main`, `lc`, or `auto`. Recovery paths (such as invalid-JSON fallback) can still call the main model, so this is not a strict spending or provider-isolation boundary |
| `lccontextlimit` | `0` | Escalate from low-cost model to main model when context tokens reach this threshold (`0` disables) |
| `deescalate` | `3` | Consecutive successful steps required before switching back to the low-cost model after escalation |
| `lcescalatedefer` | `true` | Defer LC-to-main escalation by one step when LC confidence remains high |
| `lcbudget` | `0` | Maximum total LC token budget before permanently switching to the main model (`0` = unlimited) |
| `lcjsonretries` | `1` | Extra same-step retries for invalid low-cost-model JSON before Mini-A falls back to the main model (`0` disables retries). Retries cost tokens and provider calls and count toward `lcbudget`, but not `maxsteps` |
| `lcreplytool` | `false` | Replace the corrective LC retry with a capture-only `submit_reply` MCP tool call on OpenAI-compatible and Ollama adapters. See [Advanced]({{ '/advanced#low-cost-json-recovery-lcjsonretries-lcreplytool' | relative_url }}) |
| `orchestration` | `manual` | `auto` applies deterministic complexity and risk signals to the existing planning, advisor, and evidence-gate controls; explicit flags always win. See [Advanced]({{ '/advanced#adaptive-orchestration' | relative_url }}) |
| `llmcomplexity` | `false` | Use a quick LC validation call for medium-complexity routing heuristics |
| `modelstrategy` | `default` | Model orchestration profile: `default` (LC-first with escalation), `advisor` (LC executes, main model consulted selectively for difficult steps), or `delegate` (LC executes all steps including step 0) |
| `advisorenable` | `true` | Enable main-model advisor consultations when `modelstrategy=advisor` |
| `advisormaxuses` | `2` | Maximum advisor consultations per run when `modelstrategy=advisor` |
| `advisoronrisk` | `true` | Allow advisor consultations on risk signals |
| `advisoronambiguity` | `true` | Allow advisor consultations on ambiguity signals |
| `advisoronharddecision` | `true` | Allow advisor consultations on hard-decision checkpoints |
| `advisorcooldownsteps` | `2` | Minimum step distance between advisor consultations when `modelstrategy=advisor` |
| `advisorbudgetratio` | `0.20` | Fraction of session token budget advisor calls may consume before low-value consultations are declined |
| `emergencyreserve` | `0.10` | Portion of advisor budget reserved for high-risk/high-value consultations |
| `harddecision` | `warn` | Hard-decision checkpoint mode: `require` (block actions until advisor succeeds), `warn`, or `off` |
| `evidencegate` | `false` | Enable lightweight evidence gating for non-trivial actions and final claims |
| `evidencegatestrictness` | `medium` | Strictness level for evidence gate heuristics: `low`, `medium`, or `high` |
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
| `plugins` | - | Comma-separated explicit [Agent Plugin]({{ '/agent-plugins' | relative_url }}) directories |
| `pluginsroot` | `~/.openaf-mini-a/plugins` | Root whose immediate subdirectories are discovered as Agent Plugins |
| `pluginsroots` | - | Comma-separated additional Agent Plugin roots |
| `secpass` | - | Password used to open OpenAF sBucket model secrets |
| `auditch` | - | SLON channel definition for agent interaction audit logs — see [Channels]({{ '/channels' | relative_url }}) for backend options and examples |
| `toollog` | - | SLON channel definition for dedicated MCP tool input/output logs — see [Channels]({{ '/channels' | relative_url }}) for backend options and examples |
| `metricsch` | - | SLON/JSON channel definition for recording periodic Mini-A metrics snapshots (e.g. `(name: 'mini-a-metrics', type: 'mvs', options: (file: '/tmp/mini-a-metrics.db'))`). Supports optional `period`, `some`, and `noDate` fields — see [Channels]({{ '/channels' | relative_url }}) |
| `goalprefix` | - | Prefix automatically prepended to every goal before the agent sees it |
| `homedir` | - | Override the home directory used to locate the `.openaf-mini-a` folder |
| `compressgoal` | `false` | Enable automatic compression of oversized goal text before execution |
| `compressgoaltokens` | `250` | Estimated token threshold above which goal compression is considered |
| `compressgoalchars` | `1000` | Character threshold above which goal compression is considered |
| `nologtrunc` | `false` | Disable truncation of long log output lines in the console (show full content) |
| `promptprofile` | context-dependent | System prompt verbosity: `minimal`, `balanced`, or `verbose`. Default is `minimal` in chatbot mode, `verbose` when `debug=true`, otherwise `balanced` |
| `systempromptbudget` | - | Maximum estimated token size for the system prompt. When exceeded, lower-priority sections (examples, detailed tool guidance) are dropped to stay within budget |

> [!NOTE]
> **Automatic `AGENTS.md` loading**: on startup, Mini-A walks up from the current directory looking for the nearest project-level `AGENTS.md` file. If found, its content is automatically appended to `rules` as a "Follow AGENTS.md instructions from `<path>`" entry. This is the coding-agent convention (similar to `CLAUDE.md`) and is unrelated to the protected `AGENTS.md` page inside a [Wiki Knowledge Base](#c-wiki-knowledge-base). Set `noagentsmd=true` to disable this automatic discovery and injection.

</div>

<div class="config-category" markdown="1">

## 2a. Durable Runs, Policy, and Evaluation

| Parameter | Default | Description |
|-----------|---------|-------------|
| `durable` | `false` | Persist a resumable run state and a redacted JSONL trace under `~/.openaf-mini-a/runs/<runid>/` |
| `runid` | auto-generated | Stable identifier for a durable run |
| `resumerun` | - | Resume an interrupted durable run by ID (does not change the existing `resume` option) |
| `runstatus` | - | Print the persisted status of a durable run by ID |
| `runroot` | `~/.openaf-mini-a/runs` | Durable-run storage root |
| `capabilityselection` | `false` | Normalize MCP tools, skills, plugins, and workers into a registry and expose only a deterministic, bounded relevant subset |
| `capabilitylimit` | `8` | Maximum capabilities exposed when `capabilityselection=true` |
| `policy` | - | Centralized allow/deny rules as SLON/JSON, e.g. `(shell: deny, delegation: deny)` |
| `policyfile` | - | JSON file containing the centralized policy |
| `eval` | `false` | Run a native evaluation suite instead of a single goal (`goal` is not required) |
| `evalfile` | - | Evaluation YAML/JSON file or directory; required when `eval=true` |
| `evalout` | - | Write the full machine-readable evaluation report to this JSON path |
| `evalbaseline` | - | Baseline JSON report to compare the current run against |
| `evalwritebaseline` | - | Write the current report as a new baseline |

The default policy is allow-all. Supported initial rules are `shell: deny`, `delegation: deny`, `mcp: deny`, `wiki: (write: deny)`, `filesystem: (write: deny)`, `deniedTools: [...]`, and `network: (allowDomains: [...])`. See [Advanced]({{ '/advanced' | relative_url }}) for [durable runs]({{ '/advanced#durable-runs-and-traces' | relative_url }}), [capability selection and policies]({{ '/advanced#capability-selection-and-policies' | relative_url }}), and [evaluation suites]({{ '/advanced#evaluation-suites' | relative_url }}).

</div>

<div class="config-category" markdown="1">

## 3. MCP Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `mcp` | - | MCP servers to load (comma-separated) |
| `mcpproxy` | `false` | Enable MCP proxy mode |
| `mcpproxythreshold` | `0` | Byte threshold to spill large proxy results to temp files (`0` disables spilling) |
| `mcpproxytoon` | `false` | Serialize spilled proxy object/array payloads as TOON text when proxy spilling is enabled |
| `mcpproxyallow` | - | Comma-separated allowlist of downstream tool names exposed through proxy-dispatch |
| `mcpproxydeny` | - | Comma-separated denylist of downstream tool names hidden from proxy-dispatch (applied after `mcpproxyallow`) |
| `mcpprogcall` | `false` | Start localhost programmatic MCP tool-call bridge for scripts |
| `mcpprogcallport` | `0` | Programmatic MCP bridge port (`0` auto-selects) |
| `mcpprogcallmaxbytes` | `4096` | Max inline JSON response size before returning a stored `resultId` |
| `mcpprogcallresultttl` | `600` | TTL (seconds) for oversized stored results served by the MCP bridge |
| `mcpprogcalltools` | `""` | Optional comma-separated tool allowlist exposed by the MCP bridge |
| `mcpprogcallbatchmax` | `10` | Maximum calls accepted by one bridge batch request |
| `mcpproxynative` | `true` | Use native function calling for `proxy-dispatch`; set `false` for action-based JSON |
| `mcpdynamic` | `false` | Allow dynamic MCP discovery |
| `mcplazy` | `false` | Lazy-load MCP servers |
| `mcpurl` | - | Remote MCP server URL |
| `nosetmcpwd` | `false` | Do not set the default MCP command working directory to the mini-a install path |
| `noagentsmd` | `false` | Disable automatic discovery and injection of the nearest `AGENTS.md` file as a rule |

</div>

<div class="config-category" markdown="1">

## 4. Tool Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `useutils` | `false` | Enable Mini Utils Tool utilities. With `usestdutils=true`, exposes standard aliases: `read`, `glob`, `grep`, `webfetch`, `question`, `skill`, `todowrite`, and `bash` (when `useshell=true`). Legacy names (`filesystemQuery`, `filesystemModify`, etc.) are used otherwise (the default). |
| `usestdutils` | `false` | When `useutils=true`, expose standard Mini Utils aliases (`read`, `glob`, `grep`, `webfetch`, `question`, `skill`, `todowrite`, `bash`) instead of legacy Mini Utils internal names. Presets such as `poweruser` enable it |
| `useskills` | `false` | Expose skill operations in Mini Utils Tool (requires `useutils=true`) |
| `skillmaxautoload` | `1` | Maximum number of high-confidence matching skills to auto-load into bounded runtime context |
| `skillcontextchars` | `8000` | Maximum characters read from each auto-loaded SKILL.md for runtime context |
| `skillmanifestchars` | `1536` | Approximate character budget for skill descriptions in the system prompt manifest |
| `utilsroot` | - | Root path used by Mini Utils file operations |
| `mini-a-docs` | `false` | If `true` and `utilsroot` is not set, automatically uses the mini-a oPack docs path as `utilsroot` |
| `miniadocs` | `false` | Alias for `mini-a-docs` |
| `usetools` | `false` | Enable native tool calling on the active model (main or LC) |
| `usetoolslc` | `false` | Register MCP tools natively only on the low-cost model; the main model continues using prompt/action-based tool guidance. Use when you want the cheaper model to call tools directly without enabling native tool calling on the main model |
| `usejsontool` | `false` | Use the JSON action loop and disable native tools on both model tiers, including native proxy mode. Auto-enabled for GPT-OSS and `usetools=true mcpproxy=true` unless explicitly overridden; `false` keeps native behavior |
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
| `maxcontext` | `0` | Approximate context budget in tokens. `0` leaves proactive threshold compaction off, relying on provider overflow recovery or `contextguard`; set it (e.g. `50000`) for long sessions. Compaction dedupes at 60% of the budget and summarizes at 80% |
| `maxcontent` | - | Alias for `maxcontext` |
| `maxtokens` | - | Maximum response tokens |
| `contextguard` | `false` | Generic context and tool-output guardrails when `maxcontext` is unset |
| `contextguardbudget` | `32000` | Assumed smallest context window used by `contextguard` when `maxcontext=0` |
| `toolresultmaxinline` | `4096` with `contextguard` | Maximum inline bytes kept from large tool or `readresult` outputs before spill/truncation |
| `readresultmaxmatches` | `20` with `contextguard` | Maximum matching regions returned by `proxy-dispatch` `readresult` `op='grep'` |
| `historyvm` | `false` | Keep exact history in a conversation-owned journal and replace eligible old large messages with retrievable references. Requires a writable `conversation=` path |
| `historyvmmode` | `safe` | History VM policy mode (`safe` is the only supported mode) |
| `historyvmshadow` | `false` | Capture events and estimate savings without changing provider requests |
| `contextvirtualization` | `false` | Phase 2 multi-resolution context objects and consumer-specific projection; requires `historyvm=true` |
| `contextvirtualizationshadow` | `false` | Dry-run the Phase 2 projection while still sending the Phase 1 context; requires `historyvm=true contextvirtualization=true` |

See [Advanced → History VM and Context Virtualization]({{ '/advanced#history-vm-and-context-virtualization' | relative_url }}) for policies, retrieval tools, and S3 mirroring.

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
| `usemaps` | `false` | Enable map visualization. Leaflet markers accept `icon`: `default`, `red`, `green`, `blue`, `orange`, `yellow`, `violet`, `grey`, or `black` (unknown values use blue) |
| `useasciiviz` | `false` | Console only: render `oafPrintChart` Markdown fences (`line`, `bars`, `sparkline`, `histogram`, `heatmap`, `scatter`, `boxplot`, `timeline`, ...) as terminal charts in answers and `/last`, and expose `printChart` for interim charts |
| `usemath` | `false` | Enable LaTeX math guidance for KaTeX rendering in the web UI |
| `usediagrams` | `false` | Enable diagram generation |
| `usemermaid` | `false` | Alias for `usediagrams` |
| `usecharts` | `false` | Enable chart generation |
| `usevectors` | `false` | Enable the vector bundle (`usesvg=true` + `usediagrams=true`), preferring Mermaid for structural diagrams and SVG for infographics/custom visuals |
| `browsercontext` | - | Browser context configuration (SLON/JSON) or `true` to auto-enable browser control for supported MCP tools |
| `usestream` | `false` | Enable response streaming |
| `showexecs` | `false` | Show shell/exec events as separate lines in the interaction stream |
| `showseparator` | `true` | Show a separator line between interaction events |
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
| `delegationtimeout` | `300000` | Default foreground wait and initial stall timeout in milliseconds; activity extends execution unless a hard timeout is set |
| `delegationstalltimeout` | `300000` | Idle time before a running delegated subtask is considered stalled; active tasks keep running |
| `delegationhardtimeout` | - | Optional absolute delegated subtask timeout regardless of activity (ms) |
| `delegationmaxretries` | `2` | Maximum execution attempts for confirmed failures, including the first. An unknown remote outcome is never resubmitted |
| `agentcomms` | - | Opt-in inter-agent communication declaration (profiles, grants, `delegate` ceiling, limits) as JSON/SLON. On a worker it sets the grant ceiling and requires `apitoken`. See [Advanced]({{ '/advanced#inter-agent-communication' | relative_url }}) |
| `workermode` | `false` | Launch mini-a as a Worker API server |
| `showdelegate` | `false` | Show delegate/subtask events as separate console lines |
| `workerskills` | - | Comma-separated list (or JSON/SLON array) of A2A skill IDs this worker advertises (e.g. `"shell,time"`) |
| `workerspecialties` | - | Comma-separated specialty tags injected into the `run-goal` A2A skill description |
| `workertags` | - | Comma-separated tags appended to the default worker skill in the AgentCard |
| `shellworker` | `false` | Convenience shorthand: sets `useshell=true` and auto-emits the `shell` A2A skill |
| `apitoken` | - | Bearer token required to authenticate requests to the worker API server |
| `apiallow` | - | Comma-separated IP allowlist for the worker API (e.g. `127.0.0.1,192.168.1.0/24`) |
| `defaulttimeout` | `300000` | Default total worker execution limit in milliseconds for delegated tasks |
| `maxtimeout` | `600000` | Maximum accepted worker execution limit in milliseconds |
| `taskretention` | `3600` | Seconds to keep completed task results before cleanup |
| `subtasks` | - | Inline startup scout subtasks (pipe-separated goals) executed before the main loop |
| `subtasksfile` | - | Path to a JSON/YAML file containing startup scout task definitions |
| `subtaskssequential` | `false` | Run startup subtasks sequentially instead of in parallel |
| `forkstatemaxbytes` | `65536` | Maximum bytes of parent context snapshot transmitted to a forked sub-agent |
| `autodelegation` | `false` | Enable automatic delegation of oversized tool results to a summary sub-agent |
| `autodelegationthreshold` | `8192` | Byte size threshold of tool results that triggers auto-delegation |
| `autodelegationmaxperstep` | `2` | Maximum number of auto-delegations allowed per agent step |
| `noisytools` | - | Comma-separated list of tool names that always trigger auto-delegation regardless of size |

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
| `memorych` | string | - | SLON/JSON definition of an OpenAF channel to persist global memory (e.g. file, Redis, jdbc). Set `memorymd=true` to store global records as Markdown in this channel. |
| `memorysessionch` | string | - | SLON/JSON definition of a channel for session memory persistence (falls back to `memorych` if omitted). |
| `memorysessionid` | string | `<agent-id>` | Session key namespace in the channel (defaults to `conversation` argument, otherwise falls back to internal agent ID). |
| `memorymaxpersection` | number | `80` | Maximum entries kept per section before compaction prunes stale or old entries. |
| `memorymaxentries` | number | `500` | Hard cap on total entries across all sections. |
| `memorycompactevery` | number | `8` | Number of append operations that trigger an automatic memory compaction pass. |
| `memorydedup` | boolean | `true` | Suppress near-duplicate unexpired entries using an 85% word-overlap fingerprint. Snapshot restore preserves distinct IDs, keys and scopes even when text matches. |
| `memoryartifactttldays` | number | `7` | Retention period for normalized tool and network observations before expiration. |
| `memoryindexttldays` | number | `1` | Retention period for list, search, and index observation snapshots before expiration. |
| `memorypromote` | string | `""` | Comma-separated list of sections to auto-promote from session to global memory at session end. |
| `memorystaledays` | number | `0` | Days without confirmation before a global entry is marked `stale` (cleared during compaction if section overflows). |
| `memoryinject` | string | `relevant` when memory is enabled | Context injection style: `summary` injects only per-section counts; `relevant` also injects a bounded, goal-relevant durable-memory block; `full` embeds the entire memory snapshot in every step's context. |
| `memoryrelevantcap` | number | `8` | Maximum durable entries automatically injected by `memoryinject=relevant`. |
| `usememorywrite` | boolean | `true` | Enable the model's deliberate `memory_write` action for durable typed knowledge. |
| `memorywritemax` | number | `20` | Maximum `memory_write` calls accepted in one run. |
| `memorymd` | boolean | `false` | Store global memory as path-keyed Markdown records in `memorych`. |
| `memorysessionheader` | string | - | HTTP header name used to derive `memorysessionid` in Web/Server UI mode (e.g., `X-User-Id`). |

### Memory Classification (Taxonomy)

Mini-A exposes one structured working-memory system. The common memory types are implemented by combining that system with different scopes and persistence settings:

| Memory type | What it means in Mini-A | Main parameters |
|-------------|--------------------------|-----------------|
| **Working memory** | The live structured store the agent reads and writes during a run | `usememory`, `memoryinject`, `memorymaxpersection`, `memorymaxentries`, `memorycompactevery`, `memorydedup` |
| **Episodic memory** | Session-scoped state for a specific conversation or run | `memorysessionid`, `memoryscope=session|both`, `memorysessionch` |
| **Semantic memory** | Durable knowledge the agent can reuse across runs | `memorych`, `memorymd=true` for Markdown records, `memoryscope=global|both`, `memorypromote`, `memorystaledays`, `usememorywrite` |
| **Procedural memory** | Instructions and workflow rules that tell Mini-A how to behave | `agent`, `mode`, skills, `AGENTS.md`, prompts (not a dedicated memory store) |

`memoryuser=true` is the convenience preset for both global and session working memory. `memoryusersession=true` is the session-only version.

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

### Durable Memory and Context Injection

`memory_write` records intentional, typed knowledge rather than ordinary runtime observations. Its required `kind` is one of `preference`, `environment`, `procedure`, `pitfall`, or `reference`; optional `key`, `tags`, and `ttlDays` keep entries stable, searchable, and expiring when appropriate. Writes begin in session scope. Model-authored records only promote to global storage after the same keyed record is independently confirmed in two runs, which prevents a single untrusted tool response from becoming a durable fact.

With memory enabled, `memoryinject=relevant` is the default: Mini-A injects up to `memoryrelevantcap` non-stale, goal-relevant durable records once at run start, while runtime bookkeeping stays out of the prompt. Use `summary` for counts plus on-demand `memory_search`, or `full` to embed all compact entries on every step.

For a reviewable global store, set `memorymd=true` on a global channel:

```bash
mini-a goal="remember validated project conventions" usememory=true \
  memorymd=true \
  memorych="(name: mini_a_global, type: file, options: (file: './agent-memory.json'))" \
  memorysessionch="(name: mini_a_session, type: file, options: (file: '/tmp/mini-a-session.json'))"
```

The channel contains path-keyed Markdown records, including a generated `MEMORY.md` index and one record per entry under section paths. Entry bodies can be hand-edited; malformed front matter is skipped with a warning. Normal compaction also removes evicted records, so raise the memory limits if this store is expected to retain more than the defaults.

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
| `wikibackend` | `fs` | Backend: `fs` (filesystem), `s3`, `s3fs`, `es` (Elasticsearch/OpenSearch), or read-only `http` (`https` is an alias) |
| `wikiroot` | `.` | Filesystem directory or local `.zip`/`.okt` archive for the `fs` backend; archives are always read-only |
| `wikibucket` | - | S3 bucket name (`s3`/`s3fs` backend) |
| `wikiprefix` | `wiki/` (S3) / `mini_a_wiki` (ES) | S3 key prefix (`s3`/`s3fs`); Elasticsearch index name for `es` |
| `wikiurl` | - | S3-compatible endpoint (`s3`/`s3fs`), Elasticsearch/OpenSearch base URL (`es`), or static page-server base URL (`http`) |
| `wikiaccesskey` | - | S3 access key (`s3`/`s3fs`); Elasticsearch username for `es` |
| `wikisecret` | - | S3 secret key (`s3`/`s3fs`); Elasticsearch password for `es` |
| `wikiregion` | - | S3 region (`s3`/`s3fs` backend) |
| `wikiuseversion1` | `false` | Use S3 path-style (v1) signing (`s3`/`s3fs` backend) |
| `wikiignorecertcheck` | `false` | Skip TLS certificate validation (`s3`/`s3fs` backend) |
| `wikiindexdir` | - | Override the local index/cache root used for non-filesystem wiki indexes |
| `wikis3artifactprefix` | - | For an `s3` wiki, download a separately published Lucene/graph artifact tree into `wikiindexdir`; read-only MCPs never publish artifacts back |
| `s3artifactbundle` | `false` | Use one `mini-a-wiki-index.zip` bundle under `wikis3artifactprefix` |
| `wikihttpindexurl` | `<wikiurl>/mini-a-wiki-index.zip` | Override the HTTP search/graph artifact-bundle URL |
| `wikihttptimeout` | `30000` | HTTP wiki page and artifact request timeout, in milliseconds |
| `wikiartifactrefreshsecs` | `0` | Seconds between HTTP/S3 artifact metadata refresh checks; `0` checks only at startup |
| `wikilexical` | `{ language: "english" }` | Lucene lexical settings: language, synonyms, and opt-in shingles, n-grams, query expansion, and pseudo-relevance feedback |
| `wikisearchscanbudget` | `1000` | Maximum pages read by scan-fallback search across all mounts |
| `wikisearchscanmaxms` | `15000` | Scan-fallback wall-clock budget in milliseconds |
| `wikisearchcache` | backend-dependent | Cache backend reads during scan fallback (`true` for `s3`/`http`/`es`; otherwise `false`) |
| `wikisearchcachettlms` / `wikisearchcachemaxsize` | `15000` / `500` | Scan-fallback read-cache lifetime and maximum entries |
| `wikisearchparallel` | `false` | Opt in to parallel backend reads during scan fallback |
| `wikirestrictprofile` | `tight` | `mcp-wiki-safe` restricted-retrieval profile: `tight`, `moderate`, `relaxed`, or explicit trusted-client escape hatch `off` |
| `wikimetacache` | `true` | Enable the sharded wiki page metadata cache |
| `wikilintstaleddays` | `90` | Days before a page without an `updated` field is marked stale in lint |
| `wikilintstreamthreshold` | `2000` | Page count above which `lint` switches into streaming mode |
| `wikilintmaxpairs` | `250000` | Max near-duplicate comparisons performed during streaming lint |
| `wikimounts` | - | SLON/JSON array of read-only wiki mounts: `[{name: 'team', label: 'Team docs', description: '...', backend: 'fs', root: '/path'}]`; an `fs` root may be a directory or local `.zip`/`.okt` archive — mounted pages appear as `@name/path.md` |
| `wikiretrievalv2` | `true` | Use versioned passage retrieval when published artifacts exist. Unpublished wikis retain legacy retrieval with a warning until explicit writable reindexing; incompatible or corrupt published artifacts remain errors. Set `false` for legacy retrieval |
| `wikiretrievalconfig` | - | Validated SLON/JSON object for passage size, cache, artifact, deadline, and telemetry bounds (unknown keys and invalid values are rejected). Settable via `OAF_MINI_A_WIKI_RETRIEVAL_CONFIG`; `OAF_MINI_A_WIKI_RETRIEVAL_V2` controls the enable flag. Explicit arguments win |
| `wikitelemetry` | off | Record aggregate retrieval counters (no query text or hashes by default). Writable managers persist them; read-only managers keep them in memory |

When a new empty wiki is opened with `wikiaccess=rw`, Mini-A bootstraps three starter pages: `AGENTS.md` (ingestion workflow and rules), `index.md` (entrypoint/catalog), and `log.md` (append-only journal of every write, delete, and move). `AGENTS.md` and `log.md` are protected and cannot be deleted.

Start each wiki session with `wiki op="context"` for a compact overview (page count, sections, mounts, recent log entries), then use `search` before reading any page.

Wiki operations available to the agent: `context`, `list`, `tree`, `browse`, `read`, `search`, `retrieve`, `backlinks`, `lint`, `write`, `move`, `init`, `reindex`, `mounts`, `attach`, `detach`. `retrieve` returns a bounded, cited evidence packet; see [Features → Wiki retrieval v2]({{ '/features#wiki-retrieval-v2-and-bounded-retrieval' | relative_url }}).
Operations that require `wikiaccess=rw`: `write`, `move`, `init`, `reindex`.
Console commands: `/wiki context`, `/wiki list [prefix]`, `/wiki tree [prefix]`, `/wiki browse [prefix]`, `/wiki read <page.md>`, `/wiki search <query>`, `/wiki backlinks <page.md>`, `/wiki lint`, `/wiki reindex`, `/wiki mounts`, `/wiki attach <name> [backend=fs] [root=path]`, `/wiki detach <name>`.
Use `/stats wiki` to see per-operation counters for the current session.

Archive roots and mounts require `index.md` and pages at the archive entry root. They can be searched and browsed but are never writable; if `usewikigraph=true`, Mini-A can consume an existing embedded `.mini-a-wiki-graph/graph.json` for read-only graph hints without rebuilding it.

Static HTTP wikis are read-only. They fetch pages from `wikiurl`; listing, search, and graph hints use a published `mini-a-wiki-index.zip` containing Lucene state and, optionally, `.mini-a-wiki-graph/graph.json`. Set `wikiartifactrefreshsecs` for long-lived instances that must notice a newly published bundle. After changing `wikilexical`, run `/wiki reindex` on a writable publisher; read-only consumers retain ordinary Lucene retrieval and warn when their index contract does not match.

When nonempty `wikimounts` are configured without a nonblank `wikiroot`, the default filesystem primary becomes an in-memory read-only catalog. Set `wikiroot=.` explicitly to keep persistent primary storage in the current directory. The catalog has no primary serving index or graph and rejects maintenance/writes even with `wikiaccess=rw`.

### Wiki ingestion

`mini-a-ingest.yaml` turns a documentation folder, local/remote git repository, or web page into wiki pages. Discovery, filtering, chunking, change detection, writing, and finalization are deterministic; distillation and image descriptions use the model.

```bash
ojob mini-a-ingest.yaml ingestsource=./docs wikiroot=/tmp/wiki
ojob mini-a-ingest.yaml ingestsource=https://github.com/OpenAF/mini-a wikiroot=/tmp/wiki ingestdryrun=true
```

The interactive equivalent (with `usewiki=true wikiaccess=rw`) is `/ingest <source> [section] [dryrun] [force]`. Sources larger than `ingestmaxfilekb` (default `512`) are skipped rather than truncated; large accepted sources are split at headings (`ingestchunkchars`, default `24000`). Pages include `source`, `source_ref`, `source_hash`, and `ingested` provenance front matter, and unchanged sources are skipped unless `ingestforce=true`.

**Repeated ingestion is a non-destructive upsert.** By default (`ingestprune=false`) a source that disappears is reported and its page is preserved. A versioned manifest (`.mini-a-wiki-state/manifest.json` under the index root) is the authority for what has been applied; the old ledger is read only for conservative migration, with a copy kept at `.mini-a-wiki-ingest/pre-migration.json`. A journal records prepared operations so an interrupted run can be re-run safely.

```bash
# Preview, reconcile, then (only for a confirmed-empty folder) authorize an empty prune
ojob mini-a-ingest.yaml ingestsource=./docs wikiroot=./wiki ingestmode=normalize ingestprune=true ingestdryrun=true
ojob mini-a-ingest.yaml ingestsource=./docs wikiroot=./wiki ingestmode=normalize ingestprune=true
ojob mini-a-ingest.yaml ingestsource=./docs wikiroot=./wiki ingestmode=normalize ingestprune=true ingestallowemptyprune=true
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `ingestsource` | - | Required folder, git repository path/URL, or page URL |
| `ingesttype` | auto | `markdown`, `repo`, or `url` |
| `ingestsection` | source name | Wiki section for generated pages. Keep it stable when moving a source |
| `ingestsourceid` | - | Optional stable logical origin identity, independent of the physical path, so a moved folder keeps its pages. Repository commits are versions, not new origins |
| `ingestmode` | `auto` | `auto`, `normalize`, `distill`, or `raw`. Only distillation calls the model; `normalize`, `raw`, and structured `auto` never do |
| `ingestinclude` / `ingestexclude` | - | Comma-separated path fragments to include or exclude |
| `ingestchunkchars` / `ingestmaxfilekb` | `24000` / `512` | Chunk size and maximum accepted source size |
| `ingestconcurrency` | `4` | Parallel source distillations |
| `ingestdryrun` | `false` | Report `planned_writes`/`planned_removals`, conflicts, and budget estimates. Calls no model and creates no files |
| `ingestindependent` | `false` | Allow disjoint ingestion while preserving pending recovery and its reserved pages |
| `ingestforce` | `false` | Reprocess present sources. Never authorizes deletion, overwrites edited pages, bypasses `wikiaccess=ro`, or waives budgets |
| `ingestprune` | `false` | Remove pages for verified-missing sources owned by the same destination, origin, and section. Rejected for individual URL sources |
| `ingestallowemptyprune` | `false` | Extra authorization to prune when a folder was completely observed and is empty. A missing or inaccessible folder is never treated as empty |
| `wikiaccess` | `rw` | An explicit `ro` is honored by every entry point |
| `ingestledger` | `<indexRoot>/.mini-a-wiki-ingest/ledger.json` | Legacy ledger path, used only for migration |

Discovery errors, changed filters or size limits, local edits, failed writes, and budget deferrals block prune. Excluded, oversized, empty, or unreadable files that are still present are preserved. Pages that were edited by hand, and legacy pages whose ownership cannot be proven, produce **conflicts** and are never silently overwritten: review and restore the last managed version, or preserve the edited page separately and remove the managed destination with the wiki tools before retrying. Never delete the manifest to bypass ownership protection, and do not run other wiki writers while an ingest runs (ingestion writers on the same local wiki are serialized, but ordinary wiki tools do not take the ingestion lock, and remote backends offer no distributed coordination).

Results report `status` (`complete`, `noop`, `planned`, `partial`, `blocked`, `failed`), `ok`, `sync_complete`, missing sources, blocked prune, conflicts, deferrals, and recovery state. Wrappers exit nonzero when requested work is unsuccessful, and a dry run never claims applied synchronization.

### Ingestion formats and recovery

Folders and repositories accept Markdown, text, HTML, Office documents (DOCX/DOC, XLSX/XLS, PPTX/PPT), PDF, PNG and JPEG. Passive structured formats supported by the installed oafp, such as JSON, YAML, CSV and NDJSON, are normalized into fenced JSON pages. NDJSON/NDSLON preserve every record; executable and service-query inputs are excluded. Office/PDF extraction uses Tika; scanned PDFs need OCR, which is disabled. Images require a vision-capable main model. Empty or truncated extraction fails the source without publishing a partial page. The default 512 KiB source limit also applies to documents and images.

Use `/ingest` or `/ingest recovery` to inspect pending journals, source/section information, affected pages and exact resume commands:

```text
/ingest recovery resume <id>
/ingest recovery discard <id>
/ingest "/path/New Docs" "New Section" independent
```

Resume replays saved work and finalizes indexes without repeating source distillation. Discard requires typing `discard <id>` and archives the journal; it does not undo applied pages or mark unfinished work synchronized. Independent ingestion preserves pending journals and refuses changes to their reserved pages. Read-only sessions can inspect recovery; resume/discard require write access and are blocked in dry-run. Do not delete journals manually. V2 finalization normally publishes incrementally; an incompatible parser or lexical contract triggers a rebuild from current Markdown, while other publication failures keep recovery pending.

### Wiki absorption

Absorption combines selected knowledge from multiple local filesystem wikis through a saved, reviewable plan. See [Wiki Absorption]({{ '/wiki-absorption' | relative_url }}) for specification examples, apply/resume, conflicts and ownership.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `absorbop` | `status` | `plan`, `show`, `apply`, `status`, `resume`, `delete`, or `cancel` (alias for delete) |
| `absorbspec` | - | JSON/YAML/SLON file, inline JSON/SLON map, or source array |
| `absorbplan` | - | Saved plan ID for show/apply/resume/delete |
| `absorboutput` | destination plan directory | External plan/report directory; use the same path across operations |
| `wikiaccess` | `ro` for absorption | Explicit `rw` required for apply/resume/delete; read-only planning requires external `absorboutput` |
| `absorbmaxpages` | `100` | Maximum selected source pages |
| `absorbmaxtokens` | `100000` | Aggregate estimated input tokens (characters / 4), not billed usage |

### Wiki retrieval v2

`wikiretrievalv2=true` (the default) switches search, `retrieve`, and `assembleContext` to the shared passage engine described under [Features → Wiki retrieval v2]({{ '/features#wiki-retrieval-v2-and-bounded-retrieval' | relative_url }}). Build its serving generation explicitly with `dreamwikimode=reindex`, `/wiki reindex`, the `mcp-wiki-ops` `reindex` tool, or `MiniAWikiManager.reindex()`. Readers use the same flag and never build on their own.

| `wikiretrievalconfig` key | Default | Bound |
|---------------------------|--------:|-------|
| `readPolicy` | `auto` | Read-only readers adopt published index analysis; `strict` requires configured analysis to match. Writable builds always use configured settings |
| `passageChars` | `1400` | 64–16000 UTF-16 units; soft structural target |
| `cacheBytes` | `8388608` | Shared payload cache; at most 268435456 bytes per manager |
| `maxArtifactBytes` / `maxArtifactFiles` | `268435456` / `100000` | Expanded generation caps (at most 2147483647 bytes / 1000000 files) |
| `maxMillis` | `15000` | Request deadline, at most 120000 ms |
| `linkImmutableFiles` | `true` | Reuse immutable index files through hard links; `false` forces copies |
| `sharedBlockStore` | `false` | Opt-in local immutable block store |
| `telemetryFlushQueries` / `telemetryRetentionDays` | `16` / `30` | Aggregate flush batch (at most 1000) and retention (at most 365 days) |
| `telemetrySampleQueries` | `false` | Opt in to at most 64 zero-result query samples of at most 256 characters each |
| `bundlePath` | - | Trusted local ZIP destination for streaming export after publication |

Read-only `readPolicy=auto` adopts each generation's language/analyzer, accent folding, shingles and character n-gram settings, including sizes. Synonyms, query expansion, relevance feedback and resource budgets remain reader-controlled. Mounts inherit the retrieval configuration unless they supply their own `wikiretrievalconfig` object. Integrity, parser/format and Lucene compatibility checks still apply; auto adoption does not repair an unsupported generation. `context().retrieval.analysis` reports the policy, generation, effective settings and differing fields. Strict mismatches return `incompatible-generation`.

Search without a `wiki` selector includes the primary and all mounts. V2 sources share one request budget and global ranking; mixed V1/V2 selections keep their source engines and merge results before the display limit. Trusted search accepts `maxQueries`, `maxCandidates`, `maxInspected`, `maxMillis`, and `maxBytes`. Check source coverage and warnings before treating an empty or partial result as absence. See [Features → Wiki retrieval]({{ '/features#wiki-retrieval-v2-and-bounded-retrieval' | relative_url }}).

### Wiki Knowledge Graph

An optional knowledge-graph layer built on top of the wiki's pages. When enabled, `wiki search` transparently appends related-page hints, and the graph can be queried directly via the `/graph` console command or `mcp-wiki-ops`'s `graph_build`/`graph_falkor` tools.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `usewikigraph` | `false` | Enable the wiki knowledge graph layer. Automatically enabled when `wikigraphfalkorhost` is set |
| `wikigraphsemantic` | `false` | Enable semantic graph extraction when running `graph build` |
| `wikigraphcommunity` | `louvain` | Community detection algorithm |
| `wikigraphsearchhints` | `true` | Enrich `wiki search` results with related pages from the graph |
| `wikigraphmounts` | `true` | Include graph hints from attached wiki mounts when their cached graphs are available |
| `wikigraphhintcap` | `5` | Maximum related graph hints returned per search |
| `wikimountgraphttlms` | `60000` | TTL (ms) for cached mount `graph.json` loads |
| `wikigraphcross` | `true` | Traverse mounted wiki graphs at query time through explicit `@name/` links and shared tags, aliases, or concepts. Requires `wikigraphmounts=true`. |
| `wikigraphcrossjoin` | `link,tag,alias,concept` | Comma-separated cross-wiki join kinds to enable. |
| `wikigraphcrosscap` / `wikigraphcrossdepth` | `5` / `1` | Maximum cross-wiki hints and traversal depth (`2` also includes related pages inside the mounted wiki). |
| `wikigraphcrossmaxdf` / `wikigraphcrossminkeylen` | `0.25` / `3` | Skip overly common join keys and keys shorter than this length. |
| `wikigraphautosave` | `always` | Graph autosave policy: `always`, `debounced`, or `off` |
| `wikigraphsavedebouncems` | `5000` | Debounce interval (ms) when `wikigraphautosave=debounced` |
| `wikigraphfalkorhost` | - | FalkorDB host for graph-backed wiki state/query; when set, FalkorDB is used instead of the local graph cache |
| `wikigraphfalkorport` | `6379` | FalkorDB port |
| `wikigraphfalkorgraph` | `mini_a_wiki` | FalkorDB graph name |
| `wikigraphfalkoruser` | - | FalkorDB username |
| `wikigraphfalkorpass` | - | FalkorDB password |

The local graph cache (when FalkorDB is not configured) lives under `.mini-a-wiki-graph/` inside the wiki root and, like the protected pages, is excluded from search indexing and listings — along with `AGENTS.md`, `index.md`, and `log.md`.

Console command: `/graph [build|query|neighbors|path|communities|surprise|export|stats|cross]`. `/graph cross <path>` shows cross-wiki links for one page. Cross-wiki traversal is read-only and query-time only: no graphs are merged or written back. `/stats wiki` includes wiki graph operation counters when the graph is enabled.

### MCP deployment, storage, and search behavior

Publish `mcp-wiki` to clients that only need discovery and retrieval: it is always read-only and exposes `context`, `search`, `read`, `open`, `navigate`, `grep`, `related`, `browse`, `list`, `tree`, and `backlinks`. When mounts are configured, call `context()` once to discover them, then pass the optional `wiki` selector to route a call: omitted or `"*"` searches the primary wiki plus every mount, `"primary"` selects the main wiki, a mount name selects that source, and `["a","b"]` selects a subset (unknown, duplicate, ambiguous, or conflicting selectors are rejected). Deploy `mcp-wiki-ops` separately for trusted maintenance: it provides `context`, `lint`, `edit`, `maintain`, `reindex`, `graph_build`, and `graph_falkor`; it defaults to writable mode, and `wikiopsreadonly=true` disables mutations. For untrusted clients, use `mcp-wiki-safe`: it exposes only bounded `search` and single-use excerpt `read` operations using opaque references, and none of the mount topology. Behind several replicas, set `wikiid` (for example `wikiid=engineering`) on every replica of one wiki so a shared `wikirestrictrefch` channel namespaces their references and cooldowns; if omitted, Mini-A derives a deterministic `auto-...` ID from the backend identity.

For `s3` backends, the bucket and prefix contain the source Markdown pages. A local Lucene index may accelerate unscoped literal search, but it is not stored in S3 and is only built or refreshed by writable wiki operations such as `reindex`. A read-only server consumes an existing local index without taking its writer lock, otherwise it scans Markdown objects and creates nothing. Regex and path-scoped searches scan by design. `wikiindexdir` controls the non-filesystem local index/cache root; `wikis3artifactprefix` can hydrate a separately published Lucene/graph artifact tree into that directory at startup.

The `es` backend stores wiki pages in Elasticsearch/OpenSearch, but it is not a native OpenSearch query interface: wiki search still follows the local-Lucene-or-page-scan path. Use `mcp-es-search` for native cluster queries. `s3fs` copies S3 pages into `wikiroot` on writable startup and then uses the filesystem backend; it is not bidirectional S3 synchronization.

The optional graph enriches normal wiki search with related-page hints. It is maintained independently of Lucene and of the S3/OpenSearch page store: use local graph state where appropriate, or configure FalkorDB (`wikigraphfalkorhost`) for shared graph-backed state. The maintenance MCP's `graph_build` and `graph_falkor` operations are the appropriate remote management surface.

</div>

<div class="config-category" markdown="1">

## 10c-1. Dreams (Sleep Pass)

An LLM-powered off-line consolidation pass over persistent memory and/or the wiki. Run after a session to merge duplicates, surface insights, and produce a lint-clean wiki.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `dream` | `false` | Run in standalone dream-pass mode instead of a regular agent session |
| `dreammode` | - | Dream mode selector: `memory`, `wiki`, or `both` — controls which pass(es) run |
| `dryrun` | `false` | Preview what would change without writing anything back |
| `dreamwikimode` | `apply` | Wiki dream mode: `plan`, `apply`, `reorg`, `repair`, `reindex`, `graph`, or `indexes` |
| `dreammemorymode` | `apply` | Memory dream mode: `plan` or `apply` |
| `dreamwikidryrun` | `false` | Propose wiki changes without writing; opt out of `apply` |
| `dreamwikiapproval` | `ask` | Reorg approval mode: `auto`, `ask`, `never` |
| `dreamwikireorg` | `false` | Allow structural reorg operations during wiki dream |
| `dreamreport` | - | Optional file path to write JSON run report |
| `maxauditrecords` | `200` | Maximum audit log entries included in the memory consolidation prompt |
| `dreammaxsteps` | `60` | Maximum agent steps for the wiki dream pass |

The `memorych`, `memorysessionch`, `memorysessionid`, `auditch`, `usewiki`, and `model` parameters are shared with the memory and wiki subsystems. See the [Advanced — Dreams]({{ '/advanced/' | relative_url }}#dreams-sleep-pass) page for full documentation and examples.

`repair`, `reindex`, `graph`, and `indexes` are isolated maintenance operations: deterministic lint repair, search-index rebuild, graph-only rebuild (requires `usewikigraph=true`), and unconditional `index.md` regeneration respectively. They avoid the broader apply/reorganization flow.

`dreamwikimode=plan` is always model-free: it never creates or calls a model, even when semantic extraction would default on for `apply`. Its proposal reports the request separately (`semanticRequested`, `semanticExecuted: false`, `semanticOmissionReason: "model-free-dry-run"`) and includes only a structural graph preview. For opt-in retrieval v2, `dreamwikimode=reindex` is the supported unattended way to build the serving generation.

</div>

<div class="config-category" markdown="1">

## 10c-2. Virtual Skill Library

A wiki whose pages carry `type: skill` front matter can serve as a searchable skill library that never loads its catalog into context. See [Virtual Skills]({{ '/virtual-skills' | relative_url }}) for authoring, tools, and the MCP servers.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `useskillswiki` | `false` | Enable the virtual skill library: exposes the `skillwiki` tool and `/skills search\|recommend\|open\|read\|related\|compose\|context` |
| `skillwikibackend` | `fs` for dedicated libraries | Backend for a *dedicated* skill wiki (`fs`, `s3`, `s3fs`, `es`, `http`); omit all three skill source settings to reuse the `usewiki` wiki |
| `skillwikiroot` | `.` for dedicated libraries | Root directory for a dedicated `fs` skill wiki |
| `skillwikimounts` | - | SLON/JSON read-only mounts for a dedicated skill wiki, same shape as `wikimounts` |
| `skillsautosearch` | `false` | Reserved for opt-in automatic consultation during planning |
| `skillsautolimit` | `5` | Reserved limit for future automatic search; not implemented |
| `skillsmaxloaded` | `3` | Maximum distinct skills that may be `open()`-ed per agent run |
| `skillsmaxchars` | `12000` | Maximum skill-body characters `read()` may return per agent run |

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

Each session UUID runs one prompt at a time. Overlapping prompts, clear and history-load requests return `session busy`; stop remains available. `goalprefix` is applied once per submitted goal. Later turns refresh goal-relevant memory and tool contracts while preserving conversation and tool results; idle clear/expiry closes agent resources even when history is retained.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `onport` | - | Port for web UI (enables web mode) |
| `maxpromptchars` | `120000` | Maximum accepted prompt size for incoming web `/prompt` requests |
| `ssequeuetimeout` | `120` | Web SSE stream queue timeout in seconds |
| `logpromptheaders` | - | Comma-separated HTTP request header names to log alongside incoming web prompts (e.g. `X-User-Id`) |
| `usehistory` | `false` | Enable conversation history persistence in web mode |
| `historykeep` | `false` | Keep finished web conversation history files instead of discarding them |
| `historypath` | - | Directory path used to store web conversation history files |
| `historyretention` | `600` | Web history retention window in seconds |
| `historykeepperiod` | - | Delete kept conversation history files older than this many minutes |
| `historykeepcount` | - | Keep only the newest N kept conversation history files |
| `historyvm` / `historyvmshadow` / `contextvirtualization` / `contextvirtualizationshadow` | `false` | [History VM]({{ '/advanced#history-vm-and-context-virtualization' | relative_url }}) options for web conversations. With `historyvm` or `historyvmshadow`, the conversation is journaled under `historypath` even when history listing is off |
| `historys3bucket` | - | S3 bucket used to mirror history files, including canonical History VM snapshots (requires `usehistory=true`) |
| `historys3prefix` | - | S3 key prefix for mirrored history files |
| `historys3url` | - | S3 endpoint URL for history mirroring |
| `historys3accesskey` | - | S3 access key for history mirroring |
| `historys3secret` | - | S3 secret key for history mirroring |
| `historys3region` | - | S3 region for history mirroring |
| `historys3useversion1` | `false` | Use S3 path-style (v1) signing for history mirroring |
| `historys3ignorecertcheck` | `false` | Disable TLS certificate checks for history S3 access |
| `useattach` | `false` | Enable file attachment support in web mode |
| `usestream` | `false` | Stream tokens to the browser over Server-Sent Events (`GET /stream`) |

Web mode reports progress in two complementary ways. `POST /result` includes a `phase` field (`planning`, `execution`, or `finished`), so the loading preview shows **Planning…** even when SSE is off or reconnecting. When `usestream=true`, `GET /stream?uuid=<uuid>[&token=<token>]` emits `ready`, `stream` (model tokens), `planner_stream` (planner tokens, which switch the UI to its planning state immediately), and `error` events, plus `: ping` heartbeat comments. Per-session queues are purged on completion or after `ssequeuetimeout`. Answer and planner tokens from delegated child agents are not mixed into the parent's stream.

Each answer's **Activity** section groups the same thought, execution, skill, summarization, stop, and rate messages that were previously listed inline; it does not enable additional log messages. It stays open while work is in progress and collapses when the final answer completes, and `showexecs` still controls execution visibility. Mermaid diagrams offer an **Open full screen** (⛶) viewer with pinch/wheel zoom and drag-to-pan (close with **×** or **Escape**), and Markdown answers are guided to include verified photographs with captions and source links for photo requests.

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
| `OAF_MINI_A_LCNOJSONPROMPT` | Force text prompt mode for low-cost model; Gemini low-cost models auto-enable this behavior when unset |
| `OAF_MINI_A_WIKI_RETRIEVAL_V2` | Default for `wikiretrievalv2` (an explicit argument wins) |
| `OAF_MINI_A_WIKI_RETRIEVAL_CONFIG` | Default for `wikiretrievalconfig` (an explicit argument wins) |
| `OAF_MINI_A_CON_HIST_SIZE` | Maximum console history size (defaults to JLine's default) |
| `OAF_MINI_A_LIBS` | Comma-separated library paths to load automatically at startup |
| `OAF_FLAGS` | OpenAF runtime flags as a SLON/JSON map. Notable: `(MCPSERVER: (answerInTOON: true))` makes built-in MCP servers (STDIO and HTTP) return tool results in TOON instead of JSON — see [MCP Catalog deployment]({{ '/mcp-catalog' | relative_url }}#deploying-mcp-servers-in-docker--kubernetes); `(MD_DARKMODE: 'auto')` controls markdown dark mode |
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
| `/context [llm|analyze|vm]` | Show estimated or model-analyzed context token breakdown, or History VM diagnostics with `vm` |
| `/show [prefix]` | Display parameters, optionally filtered by prefix |
| `/set <key> <value>` | Update a Mini-A parameter (use `"""` for multi-line values) |
| `/toggle <key>` | Toggle a boolean parameter |
| `/unset <key>` | Clear a parameter |
| `/reset` | Restore default parameters |
| `/restore` | Restore a saved conversation, like `resume=true` |
| `/last [md]` | Reprint the previous final answer (raw markdown with `md`) |
| `/save <path>` | Save the previous final answer to a file |
| `/stats [mode] [out=file.json]` | Show session metrics (`summary`/`detailed`/`tools`/`memory`/`wiki`) and optionally export JSON |
| `/history [n]` | Show the latest user goals from conversation history |
| `/skills [prefix]` | List discovered skills; with `useskillswiki=true`, also `search`, `recommend`, `open`, `read`, `related`, `compose`, `context` |
| `/exit` | Exit mini-a |
| `/clear` | Reset the ongoing conversation and accumulated metrics |
| `/cls` | Clear screen |

</div>

<div class="config-category" markdown="1">

## 16. Mode Presets

Combine presets with `mode=shell,utils` (also accepted by `OAF_MINI_A_MODE`). Names are case-insensitive; later presets override earlier values, including inherited values, and explicit CLI flags win. If any preset or include cannot be resolved, none of the list is applied.

| Preset | Parameters Enabled |
|--------|-------------------|
| `shell` | `useshell=true` |
| `shellrw` | `useshell=true useutils=true readwrite=true shellallowpipes=true shellbatch=true showexecs=true mini-a-docs=true` (includes `shell`) |
| `utils` | `useutils=true mini-a-docs=true usetools=true` |
| `shellutils` | `useshell=true useutils=true mini-a-docs=true usetools=true` (includes `shell`) |
| `chatbot` | `chatbotmode=true usestream=true` |
| `internet` | `usetools=true mini-a-docs=true mcpproxy=true` with the time, web, weather, and net MCPs |
| `news` | Inherits `internet` with the time, web, and RSS MCPs (`mcpproxy=true`) |
| `poweruser` | Shell read-write, utils, skills, streaming, MCP proxying, history retention, advisor strategy, delegation, and standard utils (`usestdutils=true`) |
| `webini` | Tools, visual Markdown, attachments, proxying, streaming, History VM, context virtualization, delegation, standard utils, context guard, and `orchestration=auto` |
| `web` | Inherits `webini`, adding history and the web, weather, time, and net MCPs |
| `webfull` | Inherits `web`, adding extended history retention, complexity estimation, and the RSS, fin, oaf, and oafp MCPs; ASCII sketches are off (`useascii=false`) |

Presets can `include` other presets and then override values. User custom presets can be defined in `~/.openaf-mini-a_modes.yaml` (or `~/.openaf-mini-a/modes.yaml`). They are merged with built-ins from `mini-a-modes.yaml`, and user definitions take precedence.

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
