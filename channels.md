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
