---
layout: page
title: Channels
permalink: /channels/
---

mini-a uses **OpenAF channels** as the storage backend for audit logs, tool logs, and debug traffic. A channel is a key/value store with a pluggable backend — you point mini-a at any supported backend by writing a short SLON definition, and the framework handles the rest.

This page explains the channel-accepting parameters, the definition format, and concrete examples for every common backend.

---

## What Are OpenAF Channels?

An OpenAF channel is a named, ordered key/value store. Every entry has a key (a map), a value (any data), and a last-modified timestamp. Channels support get, set, unset, forEach, subscribe, and queue operations through a uniform API regardless of the underlying storage.

mini-a creates channels internally when you pass a definition to a channel parameter. You do not need to write OpenAF code — the SLON definition is enough. After a session, you can read the stored data with standard tools (`oafp`, `ojob`, or plain JSON readers) without starting mini-a again.

---

## Channel Parameters

| Parameter | What is stored |
|-----------|----------------|
| `auditch` | Every agent interaction: goals, model calls, tool selections, and final answers |
| `toollog` | MCP tool input and output, one entry per tool call |
| `debugch` | Full request/response payloads for main-model LLM calls |
| `debuglcch` | Full request/response payloads for low-cost-model LLM calls |
| `debugvalch` | Validation-model traffic (only when `llmcomplexity=true`) |

All five accept a SLON channel definition. `auditch` and `toollog` are the most useful for production observability. The `debug*` parameters capture verbose traffic useful for diagnosing model behaviour.

---

## Channel Definition Format

The definition uses the same SLON syntax as the `model` parameter:

```
(type: <backend>, <option>: <value>, ...)
```

The `type` field selects the backend. All other fields are backend-specific options passed when the channel is created.

---

## Backends and Examples

### File (JSON)

Stores every entry as a record in a single JSON file. Easiest to inspect with any text editor or `oafp`.

```bash
mini-a auditch="(type: file, file: audit.json)" \
       goal='Summarize the README'
```

The file grows with one JSON object per entry. You can tail it during a session or post-process it afterwards.

Append to an existing file across sessions by pointing at the same path — entries accumulate by key/timestamp so nothing is lost between runs.

**Options:**

| Option | Default | Description |
|--------|---------|-------------|
| `file` | — | Path to the JSON file |
| `yaml` | `false` | Write YAML instead of JSON |
| `compact` | `false` | Compact (single-line) JSON output |
| `gzip` | `false` | Gzip the file |

---

### File (multifile — one file per entry)

Writes each channel entry as a separate file under a folder. Useful when entries are large or when you want to process them independently.

```bash
mini-a toollog="(type: file, path: ./tool-logs, multifile: true)" \
       mcp="(cmd: 'ojob mcps/mcp-time.yaml')" \
       goal='What time is it in Tokyo?'
```

Each MCP call produces one file in `./tool-logs/`. Files are named by entry key.

---

### MVS (H2 MVStore — persistent key/value)

MVS stores entries in a compact H2 MVStore file. It is fast, requires no external database, and survives process restarts. Best choice for long-running agents or accumulating audit data over many sessions.

```bash
mini-a auditch="(type: mvs, file: audit.db, map: auditlog)" \
       goal='Review the project structure'
```

You can keep separate maps in the same `.db` file — useful for combining audit and tool logs:

```bash
mini-a auditch="(type: mvs, file: sessions.db, map: audit)" \
       toollog="(type: mvs, file: sessions.db, map: tools)" \
       goal='Fetch the weather forecast'
```

**Options:**

| Option | Default | Description |
|--------|---------|-------------|
| `file` | — | Path to the MVStore file (created if absent) |
| `map` | `default` | Map name inside the file |
| `compact` | `false` | Compact the file on open/close to reclaim space |
| `shouldCompress` | `false` | Enable LZ4 compression inside the store |

Read back MVS data with `oafp`:

```bash
oafp in=ch inch="(type: mvs, file: audit.db, map: auditlog)" out=ctable
```

---

### DB (relational database via JDBC)

Wraps any JDBC-accessible table. Useful when audit data needs to be queryable alongside application data.

```bash
mini-a auditch="(type: db, jdbc: 'jdbc:h2:./audit', user: sa, pass: sa, from: auditlog, keys: [id])" \
       goal='List all open issues'
```

For PostgreSQL:

```bash
mini-a toollog="(type: db, jdbc: 'jdbc:postgresql://db:5432/myapp', user: app, pass: secret, from: tool_calls, keys: [call_id])" \
       mcp="(cmd: 'ojob mcps/mcp-db.yaml jdbc=jdbc:postgresql://db:5432/myapp user=app pass=secret')" \
       goal='Query the sales table and summarize top customers'
```

**Options:**

| Option | Default | Description |
|--------|---------|-------------|
| `jdbc` | — | JDBC connection URL |
| `user` | — | Database username |
| `pass` | — | Database password |
| `from` | — | Table name |
| `keys` | — | Array of primary key column names, e.g. `[id]` |
| `cs` | `false` | Case-sensitive column matching |

The table is created automatically if it does not exist (requires the JDBC driver to be available in the classpath).

---

## Combining Multiple Channel Parameters

You can mix backends freely across parameters in the same session:

```bash
mini-a \
  auditch="(type: mvs, file: run.db, map: audit)" \
  toollog="(type: file, file: tool-calls.json)" \
  debugch="(type: file, file: llm-debug.json)" \
  goal='Research the top 3 Node.js frameworks'
```

This captures:
- Interaction-level audit to a persistent MVStore (survives across sessions)
- MCP tool calls to a plain JSON file (easy to grep and diff)
- Full LLM request/response payloads to a separate JSON file

---

## Audit Channel (`auditch`)

`auditch` receives one entry per significant agent event. Each entry is a map with fields that vary by event type. Common fields:

| Field | Description |
|-------|-------------|
| `type` | Event category: `goal`, `tool_call`, `tool_result`, `answer`, `error` |
| `ts` | Timestamp (epoch milliseconds) |
| `model` | Model tier that handled the event (`main`, `lc`, `val`) |
| `content` | The goal text, tool name, tool result, or final answer |
| `tokens` | Token usage map (when available) |

**Use cases:**
- Compliance and change-audit trails for agent-driven automation
- Replay and post-mortem analysis of multi-step goals
- Building dashboards that track which tools are used most

Store to a file and inspect with `oafp`:

```bash
mini-a auditch="(type: file, file: audit.json)" \
       useshell=true goal='Check disk usage and list the top 5 largest directories'
```

```bash
# Show all tool calls from the session
oafp audit.json path="[?type=='tool_call']" out=ctable
```

---

## Tool Log Channel (`toollog`)

`toollog` receives one entry per MCP tool call, capturing both the input arguments the agent sent and the output the tool returned. Fields:

| Field | Description |
|-------|-------------|
| `ts` | Timestamp (epoch milliseconds) |
| `tool` | Tool name |
| `server` | MCP server that provided the tool |
| `input` | Map of arguments passed to the tool |
| `output` | Tool result (truncated if very large) |
| `durationMs` | Elapsed time in milliseconds |

This is valuable for profiling which tools are slow, debugging incorrect tool results, and auditing external API calls made by the agent.

```bash
mini-a toollog="(type: mvs, file: tools.db, map: calls)" \
       mcp="(cmd: 'ojob mcps/mcp-web.yaml')" \
       goal='Summarize the latest news about AI'
```

Read back and sort by duration:

```bash
oafp in=ch inch="(type: mvs, file: tools.db, map: calls)" \
     path="sort_by(@, &durationMs) | reverse(@)" \
     out=ctable
```

---

## Debug Channels (`debugch`, `debuglcch`, `debugvalch`)

Debug channels capture the raw LLM request/response payloads for each model tier. They are the channel equivalents of `debugfile` but split by model tier, making it easy to trace exactly what each model saw and returned.

- `debugch` — main model (`OAF_MODEL`)
- `debuglcch` — low-cost model (`OAF_LC_MODEL`)
- `debugvalch` — validation model (only active when `llmcomplexity=true`)

```bash
mini-a debugch="(type: file, file: main-debug.json)" \
       debuglcch="(type: file, file: lc-debug.json)" \
       modellc="(type: openai, model: gpt-5-mini, key: '...')" \
       goal='Classify this support ticket: connection timeout on login'
```

**Tip:** For long sessions, prefer MVS over file to avoid producing large single-file JSON:

```bash
mini-a debugch="(type: mvs, file: debug.db, map: main)" \
       debuglcch="(type: mvs, file: debug.db, map: lc)" \
       goal='Deep research: summarize quantum computing milestones since 2020'
```

---

## Metrics Channel (`metricsch`)

`metricsch` records periodic snapshots of mini-a's runtime metrics into an OpenAF channel. It is the persistent counterpart to the in-session `/stats` command — `/stats` shows the current counters for the live session, while `metricsch` writes a snapshot every `period` milliseconds to any channel backend, accumulating a time-series that survives the session.

Under the hood, mini-a calls `ow.metrics.startCollecting(name, period, some, noDate)`, which registers a background thread that writes one entry per interval to the channel.

---

### Definition format

Unlike the other channel parameters (`auditch`, `toollog`, `debugch`), the `metricsch` value is **not a flat channel definition**. It is a wrapper map that carries both the channel identity and collection options, with the backend definition nested under `options`:

```
metricsch="(name: 'mini-a-metrics', type: 'mvs', options: (file: 'metrics.db'))"
```

Copying the flat `auditch`/`toollog` pattern produces a broken definition — all backend fields (`file`, `map`, etc.) must be inside `options:`.

**Definition fields:**

| Field | Default | Description |
|-------|---------|-------------|
| `name` | `_mini_a_metrics_channel` | OpenAF channel name; shared across MiniA instances using the same name |
| `type` | `simple` | Channel backend type (`simple`, `mvs`, `file`, `db`, …) |
| `options` | `{}` | Backend-specific options passed to `$ch(name).create(type, options)` |
| `period` | `1000` | Snapshot interval in milliseconds |
| `some` | `["mini-a"]` | Metric namespaces to collect per snapshot |
| `noDate` | `false` | Omit the `d` (Date) field from each entry key/value |

**Tip:** The default `simple` type is in-memory and lost when mini-a exits. Use `mvs`, `file`, or `db` to persist snapshots across runs.

**Tip:** At the default 1000 ms interval a long session generates ~3600 entries/hour. Raise `period` to `5000` or `10000` for sustained runs to keep the store size manageable.

---

### Quick start

```bash
mini-a \
  metricsch="(name: 'mini-a-metrics', type: 'mvs', options: (file: 'metrics.db'), period: 5000)" \
  goal='Summarize the README'
```

After the session, `metrics.db` contains one snapshot every 5 seconds. Use the same `type` and `options` to read the data back.

---

### What gets recorded

Each snapshot is one channel entry:

| Entry part | Shape | Notes |
|------------|-------|-------|
| Key | `{ t: <epochMs>, d: <Date> }` | `d` omitted when `noDate: true` |
| Value | `{ t, d, "mini-a": { … } }` | All metric counters nested under `"mini-a"` |

The `"mini-a"` object mirrors the counters shown by `/stats`, grouped into 19 sections:

| Section | Description | Representative counters |
|---------|-------------|------------------------|
| `llm_calls` | Model invocations by tier | `normal`, `low_cost`, `validation`, `total`, `fallback_to_main` |
| `goals` | Goal completion state | `achieved`, `failed`, `stopped` |
| `actions` | Agent action execution | `thoughts_made`, `mcp_actions_executed`, `mcp_actions_failed`, `shell_commands_executed` |
| `planning` | Planning phase activity | `plans_generated`, `plans_validated`, `plans_replanned` |
| `performance` | Step timing and per-tier token usage | `steps_taken`, `total_session_time_ms`, `avg_step_time_ms`, `llm_actual_tokens`, `llm_cache_read_tokens`, `llm_normal_input_tokens`, `llm_normal_output_tokens`, `llm_lc_input_tokens`, `llm_lc_output_tokens`, `llm_val_input_tokens`, `llm_val_output_tokens`, `llm_main_total_tokens`, `llm_lc_total_tokens`, `llm_lc_share_pct` |
| `behavior_patterns` | Error detection and loop tracking | `escalations`, `consecutive_errors`, `json_parse_failures`, `action_loops_detected` |
| `advisor` | Advisor model usage | `calls`, `tokens`, `helpful_escalations`, `declined_under_budget` |
| `guardrails` | Safety gate decisions | `hard_decision_checkpoints`, `evidence_gate_rejections` |
| `user_interaction` | Request lifecycle | `requests`, `completed`, `failed` |
| `summarization` | Context compaction activity | `summaries_made`, `summaries_skipped`, `summaries_tokens_reduced` |
| `memory` | Working memory operations | `appends`, `dedup_hits`, `compactions`, `global_reads`, `session_writes` |
| `tool_selection` | Dynamic tool routing | `dynamic_used`, `keyword`, `llm_lc`, `llm_main` |
| `tool_cache` | Tool list cache efficiency | `hits`, `misses`, `total_requests`, `hit_rate` |
| `mcp_resilience` | MCP reliability tracking | `circuit_breaker_trips`, `lazy_init_success`, `lazy_init_failed` |
| `per_tool_usage` | Per-tool call breakdown | map keyed by tool name: `{ calls, successes, failures }` |
| `delegation` | Subtask delegation stats | `total`, `completed`, `failed`, `workers_total`, `worker_hint_used` |
| `deep_research` | Research session activity | `sessions`, `cycles`, `validations_passed`, `early_success` |
| `history` | Conversation file management | `sessions_started`, `sessions_resumed`, `files_kept`, `files_deleted` |
| `wiki` | Wiki knowledge base operations | `enabled`, `ops_read`, `ops_search`, `ops_write`, `ops_total` |

To print the full, up-to-date field list from a persisted channel (the channel is the authoritative reference — counters may be added as mini-a evolves):

```bash
oafp in=ch inch="(type: mvs, file: metrics.db)" path="[-1].\"mini-a\""
```

---

### Reading the data

Metrics are nested under the `"mini-a"` key. Because the name contains a hyphen, JMESPath requires it quoted as `\"mini-a\"` inside a double-quoted shell string.

```bash
# All snapshots as a table (t = epoch ms, d = timestamp)
oafp in=ch inch="(type: mvs, file: metrics.db)" out=ctable

# Time-series of steps taken across the session
oafp in=ch inch="(type: mvs, file: metrics.db)" \
     path="[*].{time: d, steps: \"mini-a\".performance.steps_taken}" \
     out=ctable

# Last snapshot: per-tier LLM token breakdown
oafp in=ch inch="(type: mvs, file: metrics.db)" \
     path="[-1].\"mini-a\".performance.{actual: llm_actual_tokens, cached: llm_cache_read_tokens, main_in: llm_normal_input_tokens, main_out: llm_normal_output_tokens, lc_in: llm_lc_input_tokens, lc_out: llm_lc_output_tokens, lc_share_pct: llm_lc_share_pct}" \
     out=ctable

# Last snapshot: delegation counters (useful for multi-agent runs)
oafp in=ch inch="(type: mvs, file: metrics.db)" \
     path="[-1].\"mini-a\".delegation" \
     out=ctable
```

---

### Tuning

**Extending `some`:** by default only the `mini-a` namespace is collected. Add other OpenAF metric namespaces (e.g. `memory`, `gc`) to include system-level data alongside agent metrics:

```bash
metricsch="(name: 'mini-a-metrics', type: 'mvs', options: (file: 'metrics.db'), some: ['mini-a', 'memory', 'gc'])"
```

**Compact keys with `noDate`:** omit the `d` Date field to reduce entry size when only the epoch timestamp `t` is needed:

```bash
metricsch="(name: 'mini-a-metrics', type: 'mvs', options: (file: 'metrics.db'), noDate: true)"
```

**Shared channel name:** multiple concurrent MiniA instances (e.g. workers in delegation mode) that share the same `name` will reference-count the channel — it is only destroyed when the last instance releases it.

---

### Viewing output with CHManager

[CHManager](https://github.com/OpenAF/openaf-opacks/tree/master/CHManager) is an OpenAF opack with a web UI and TUI for browsing channel contents without writing code.

**Install:**
```bash
opack install CHManager
```

**Post-run browse** (any persisted backend — `mvs`, `file`, `db`): after mini-a finishes, open CHManager pointing at the same `type` and `options` used in `metricsch`. Use auto-refresh and the **"newest first"** order to page through snapshots, or use `/getall`, `/keys`, and `/size` in the TUI.

```bash
# Web UI at http://localhost:8090
ch-manager-web

# TUI
ch-manager
```

**Truly live (during a running mini-a session):** an `mvs` file cannot be safely shared between a running mini-a process and a separate CHManager — H2 MVStore holds an exclusive writer lock. To watch snapshots land in real time while mini-a is running, point `metricsch` at a **shared concurrent backend** (a running PostgreSQL/MySQL database, Redis, or Elasticsearch) that both processes can reach independently, then open that definition in CHManager's Live tab or use the `/subscribe` command.

---

## Reading Channel Data

Data stored by mini-a channels is standard JSON. You can inspect it without mini-a using `oafp` (the OpenAF data processor):

```bash
# Pretty-print all entries from a file channel
oafp audit.json

# Query fields from an MVS channel
oafp in=ch inch="(type: mvs, file: run.db, map: audit)" \
     path="[*].{ts: ts, type: type, content: content}" \
     out=ctable

# Filter tool calls slower than 500 ms
oafp in=ch inch="(type: mvs, file: tools.db, map: calls)" \
     path="[?durationMs > \`500\`]" \
     out=json
```

You can also write OpenAF scripts that subscribe to the channel while mini-a is running to process events in real time:

```javascript
$ch("live-audit").createRemote("http://localhost:1234/auditch")
$ch("live-audit").subscribe(function(name, op, key, value) {
    if (value.type === "tool_call") {
        logInfo("Tool used: " + value.content.tool)
    }
})
```

---

## Practical Recipes

### Persistent audit across multiple sessions

```bash
# Every session appends to the same MVS store
export MINI_A_AUDITCH="(type: mvs, file: ~/.openaf-mini-a/audit.db, map: history)"

mini-a goal='Analyze CPU usage'
mini-a goal='Summarize disk health'
# Both sessions are in the same store; query them together afterwards
```

### Capture tool call I/O for debugging

```bash
mini-a toollog="(type: file, file: tool-debug.json)" \
       mcp="(cmd: 'ojob mcps/mcp-db.yaml jdbc=jdbc:sqlite:mydb.sqlite')" \
       goal='List all tables and row counts'

# Inspect what the agent sent and received
oafp tool-debug.json path="[*].{tool: tool, input: input, output: output}" out=ctable
```

### Per-run YAML audit file

```bash
mini-a auditch="(type: file, file: run-$(date +%Y%m%d-%H%M%S).yaml, yaml: true)" \
       goal='Deploy the staging environment'
```

### Full observability stack (audit + tools + debug)

```bash
mini-a \
  auditch="(type: mvs, file: obs.db, map: audit)" \
  toollog="(type: mvs, file: obs.db, map: tools)" \
  debugch="(type: mvs, file: obs.db, map: llm)" \
  mcp="(cmd: 'ojob mcps/mcp-web.yaml')" \
  useplanning=true \
  goal='Research and compare the top 5 vector databases'
```

All data lands in a single `obs.db` MVStore file under three maps. After the session:

```bash
# Summarize events by type
oafp in=ch inch="(type: mvs, file: obs.db, map: audit)" \
     path="[*].type" \
     out=ctable

# Show every tool call
oafp in=ch inch="(type: mvs, file: obs.db, map: tools)" \
     path="[*].{tool: tool, ms: durationMs}" \
     out=ctable
```

---

## Next Steps

- **[Configuration]({{ '/configuration' | relative_url }})** — Full parameter reference including all channel parameters
- **[Advanced]({{ '/advanced' | relative_url }})** — Debug mode, performance tuning, and library integration
- **[Examples]({{ '/examples' | relative_url }})** — Practical examples showing mini-a in action
