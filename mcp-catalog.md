---
layout: page
title: MCP Catalog
permalink: /mcp-catalog/
---

**MCP (Model Context Protocol)** is an open standard that defines how LLMs discover and invoke external tools through a uniform interface. Instead of hard-coding integrations, mini-a connects to MCP servers that expose capabilities as callable tools. Each MCP server runs as a separate process (STDIO) or remote service (HTTP), and mini-a automatically discovers available tools at startup.

mini-a ships with **31 built-in MCP servers** covering a wide range of tasks. Load any combination of them with the `mcp` parameter, or aggregate them behind `mcpproxy=true` when you want to keep the exposed tool surface small.

---

## Summary

| Server | Description | Type | Key Tools |
|--------|-------------|------|-----------|
| `mcp-time` | Time and timezone operations | STDIO | `getCurrentTime`, `convertTimezone` |
| `mcp-db` | Database queries and schema | STDIO | `query`, `listTables`, `describeTable` |
| `mcp-file` | File system operations | STDIO | `readFile`, `writeFile`, `listDir` |
| `mcp-web` | Web browsing, search, and HTTP requests | STDIO | `web-search`, `get-url`, `http-request` |
| `mcp-shell` | Shell command execution | STDIO | `execute`, `script` |
| `mcp-ssh` | Remote SSH operations | STDIO | `connect`, `execute`, `transfer` |
| `mcp-s3` | AWS S3 operations and S3 Select | STDIO | `s3-list-buckets`, `s3-get-object`, `s3-select-object` |
| `mcp-aws-athena` | AWS Athena SQL queries | STDIO/HTTP | `athena-query`, `athena-start-query-execution` |
| `mcp-net` | Network utilities | STDIO | `ping`, `traceroute`, `dns`, `httpRequest` |
| `mcp-fin` | Financial data | STDIO | `stockPrice`, `exchangeRate`, `cryptoPrice` |
| `mcp-rss` | RSS feed reader | STDIO | `fetchFeed`, `listEntries` |
| `mcp-email` | Email operations | STDIO | `send`, `read`, `listInbox` |
| `mcp-kube` | Kubernetes operations | STDIO | `getPods`, `getLogs`, `describe` |
| `mcp-math` | Mathematical operations | STDIO | `calculate`, `statistics`, `convert` |
| `mcp-random` | Random data generation | STDIO | `uuid`, `number`, `string`, `pick` |
| `mcp-telco` | Telecom utilities | STDIO | `parseNumber`, `validate`, `lookup` |
| `mcp-weather` | Weather information | STDIO | `current`, `forecast` |
| `mcp-ch` | ClickHouse database | STDIO | `query`, `listTables` |
| `mcp-es-search` | ElasticSearch/OpenSearch full-text search | STDIO/HTTP | `search`, `get`, `read`, `info` |
| `mcp-mini-a` | Spawn sub-agents | STDIO | `delegate`, `status` |
| `mcp-a2a` | Bridge external A2A-protocol agents as tools | STDIO/HTTP | `a2a-agents`, `a2a-task` |
| `mcp-proxy` | MCP proxy/aggregator | STDIO | `aggregate`, `route` |
| `mcp-pass` | MCP passthrough combiner | STDIO/HTTP | downstream tools forwarded directly |
| `mcp-oaf` | OpenAF utilities | STDIO | `oafp`, `ow.format` |
| `mcp-oafp` | OpenAF processor | STDIO | `process`, `transform` |
| `mcp-oaf-browse` | Generic browse over the oJob-common HTTP Browse API | STDIO/HTTP | `list`, `get`, `search` |
| `mcp-office` | Office document processing | STDIO | `readExcel`, `readWord`, `readPDF` |
| `mcp-ollama-web-search` | Web search via Ollama API | STDIO/HTTP | `web-search` |
| `mcp-wiki` | Read-only Markdown wiki discovery | STDIO/HTTP | `context`, `search`, `read`, `browse`, `list`, `tree`, `backlinks` |
| `mcp-wiki-safe` | Restricted wiki retrieval for untrusted clients | STDIO/HTTP | `search`, `read` |
| `mcp-wiki-ops` | Wiki maintenance, editing, and indexing | STDIO/HTTP | `context`, `lint`, `edit`, `maintain`, `reindex` |

---

## Server Details

### mcp-time

Time and timezone operations. Get current time in any timezone and convert between timezones.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-time.yaml')" goal='What time is it in all major timezones?'
```

**Tools:** `getCurrentTime`, `convertTimezone`, `listTimezones`

---

### mcp-db

Query relational databases, inspect schemas, and list tables. Supports JDBC-compatible databases including H2, PostgreSQL, MySQL, and Oracle.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `jdbcUrl` | JDBC connection URL |
| `jdbcUser` | Database username |
| `jdbcPass` | Database password |

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-db.yaml')" goal='List all tables and describe their schemas'
```

**Tools:** `query`, `listTables`, `describeTable`, `listSchemas`

---

### mcp-file

Read, write, and manage files and directories on the local filesystem. Supports text and binary operations.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-file.yaml')" goal='Read all JSON files in /tmp and summarize their contents'
```

**Tools:** `readFile`, `writeFile`, `listDir`, `fileInfo`, `deleteFile`, `copyFile`

---

### mcp-web

Web browsing, search, and HTTP request utilities. Perform web searches, fetch/process URLs, and make REST calls.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `readwrite` | If `true`, enables mutating `http-request` methods (`POST`, `PUT`, `PATCH`, `DELETE`). Read-only mode allows `GET` and `HEAD`. |

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-web.yaml')" goal='Search for the latest OpenAF release and summarize the changelog'
```

**Tools:** `web-search`, `get-url`, `http-request`

---

### mcp-shell

Execute shell commands and scripts on the host system. Provides direct access to the operating system command line.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-shell.yaml')" goal='Check disk usage and list the top 10 largest files'
```

**Tools:** `execute`, `script`, `background`

---

### mcp-ssh

Connect to remote hosts via SSH. Execute commands, transfer files, and manage remote sessions.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `host` | Remote hostname or IP |
| `user` | SSH username |
| `key` | Path to private key file |

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-ssh.yaml')" goal='Connect to server1 and check system uptime'
```

**Tools:** `connect`, `execute`, `transfer`, `tunnel`

---

### mcp-s3

Interact with AWS S3-compatible object storage. List buckets, upload and download objects, manage objects, and run server-side S3 Select SQL queries against CSV, JSON, or Parquet data.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `accessKey` | AWS access key ID |
| `secret` | AWS secret access key |
| `region` | AWS region (default: `us-east-1`) |

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-s3.yaml')" goal='List all buckets and show the 5 most recent objects in each'
```

**Tools:** `s3-list-buckets`, `s3-list-objects`, `s3-get-object`, `s3-put-object`, `s3-delete-object`, `s3-presign-get`, `s3-select-object`.

`s3-select-object` requires `key` and an S3 Select `sql` expression. Configure `inputSerialization` (`CSV`, `JSON`, or `PARQUET`) and optional `outputSerialization`; choose `encoding=json` when JSON Lines results should be returned as objects.

---

### mcp-aws-athena

Run Amazon Athena SQL queries through the OpenAF AWS oPack. The synchronous helper waits for completion and returns results; the remaining tools support asynchronous start, status polling, and result retrieval.

| Argument | Description |
|----------|-------------|
| `accessKey` / `secret` / `sessionToken` / `region` | AWS credentials and region; environment credentials or an instance role may be used when omitted |
| `database` / `catalog` / `workGroup` / `outputLocation` | Athena defaults used when a tool call omits them |
| `readwrite` | Enables cancelling queries and deleting their S3 result objects; `false` by default |

```bash
mini-a goal="how many orders were placed last month" \
  mcp="(cmd: 'ojob mcps/mcp-aws-athena.yaml region=eu-west-1 database=sales workGroup=primary')"
```

**Tools:** `athena-query`, `athena-start-query-execution`, `athena-get-query-execution`, `athena-get-query-results`, `athena-list-query-executions`; `athena-stop-query-execution` and `athena-delete-query-results` require `readwrite=true`.

---

### mcp-net

Network diagnostic and utility tools. Perform connectivity tests, DNS lookups, and HTTP requests.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-net.yaml')" goal='Check if google.com is reachable and show DNS resolution details'
```

**Tools:** `ping`, `traceroute`, `dns`, `httpRequest`, `portScan`

---

### mcp-fin

Retrieve financial market data including stock prices, exchange rates, and cryptocurrency values.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-fin.yaml')" goal='Get the current price of AAPL, GOOGL, and BTC-USD'
```

**Tools:** `stockPrice`, `exchangeRate`, `cryptoPrice`, `marketSummary`

---

### mcp-rss

Read and parse RSS and Atom feeds. Retrieve entries, filter by date, and extract content.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-rss.yaml')" goal='Fetch the latest 5 entries from the OpenAF blog RSS feed'
```

**Tools:** `fetchFeed`, `listEntries`, `searchEntries`

---

### mcp-email

Send and read emails. Supports SMTP for sending and IMAP for reading.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `smtpHost` | SMTP server hostname |
| `smtpPort` | SMTP server port |
| `imapHost` | IMAP server hostname |
| `emailUser` | Email account username |
| `emailPass` | Email account password |

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-email.yaml')" goal='Check my inbox for unread messages and summarize them'
```

**Tools:** `send`, `read`, `listInbox`, `searchMessages`

---

### mcp-kube

Interact with Kubernetes clusters. List pods, view logs, describe resources, and manage deployments.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `kubeconfig` | Path to kubeconfig file |
| `namespace` | Default namespace |

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-kube.yaml')" goal='List all pods in the default namespace and show any that are not running'
```

**Tools:** `getPods`, `getLogs`, `describe`, `getServices`, `getDeployments`

---

### mcp-math

Perform mathematical calculations, statistical analysis, and unit conversions.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-math.yaml')" goal='Calculate the standard deviation of [12, 15, 18, 22, 25, 30]'
```

**Tools:** `calculate`, `statistics`, `convert`, `matrix`

---

### mcp-random

Generate random data including UUIDs, numbers, strings, and selections from lists.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-random.yaml')" goal='Generate 5 UUIDs and 3 random passwords of 16 characters'
```

**Tools:** `uuid`, `number`, `string`, `pick`, `shuffle`

---

### mcp-telco

Telecom utilities for parsing, validating, and looking up phone numbers across international formats.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-telco.yaml')" goal='Parse and validate the phone number +1-555-123-4567'
```

**Tools:** `parseNumber`, `validate`, `lookup`, `format`

---

### mcp-weather

Retrieve current weather conditions and forecasts for any location.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-weather.yaml')" goal='What is the weather forecast for Lisbon this week?'
```

**Tools:** `current`, `forecast`, `alerts`

---

### mcp-ch

Connect to ClickHouse databases for analytical queries and schema inspection.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `chUrl` | ClickHouse server URL |
| `chUser` | ClickHouse username |
| `chPass` | ClickHouse password |

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-ch.yaml')" goal='List all tables in the default database and show row counts'
```

**Tools:** `query`, `listTables`, `describeTable`

---

### mcp-es-search

LLM-optimised full-text search over an ElasticSearch or OpenSearch index. Tools are designed for retrieval workflows: search first, then fetch or read specific documents.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `url` | ElasticSearch/OpenSearch base URL (required) |
| `index` | Default index to search (required) |
| `contentField` | Field holding the document full text (default: `content`) |
| `pathField` | Field holding the source file path (default: `path`) |
| `titleField` | Field holding the document title (default: `title`) |
| `toolPrefix` | Optional prefix for tool names (e.g. `docs-` → `docs-search`, `docs-get`, …) |
| `label` | Human-readable label injected into tool descriptions |
| `user` / `password` | Optional HTTP Basic auth credentials |
| `onport` | Start an HTTP MCP server on this port instead of STDIO |

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-es-search.yaml url=http://localhost:9200 index=docs label=Documentation')" \
  goal='Search the docs index for authentication examples'
```

Run multiple instances side by side (one per index) using `toolPrefix` to keep tool names distinct.

**Tools:** `search`, `get`, `read`, `info`

---

### mcp-mini-a

Spawn sub-agents to handle delegated tasks. The parent agent can assign goals to child mini-a instances and monitor their progress.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-mini-a.yaml')" goal='Research three topics in parallel and combine the results'
```

**Tools:** `delegate`, `status`, `cancel`

---

### mcp-a2a

Bridge external **Google A2A-protocol** agents into mini-a as MCP tools. At startup it fetches each agent's Agent Card (`/.well-known/agent.json`), registers its skills, and routes calls via JSON-RPC 2.0 (`tasks/send` + `tasks/get` polling) until the task reaches a terminal state.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `agents` | Comma-separated base URLs of A2A agents to connect to (required) |
| `apitoken` | Optional Bearer token sent with every A2A HTTP request |
| `pollinterval` | Polling interval in ms while awaiting task completion (default: `1000`) |
| `timeout` | Default task timeout in seconds (default: `120`) |
| `serverdesc` | Optional JSON/SLON map overriding the exposed MCP server identity |
| `onport` | Start an HTTP MCP server on this port instead of STDIO |

**Usage:**
```bash
# Give mini-a access to two external A2A agents
mini-a usetools=true \
  mcp="(cmd: 'ojob mcps/mcp-a2a.yaml agents=http://analyst:9000,http://writer:9000')" \
  goal='Ask the data-analyst agent to summarize last quarter sales'

# Standalone HTTP bridge
ojob mcps/mcp-a2a.yaml agents="http://agent1:9000,http://agent2:9000" onport=8888
```

**Tools:** `a2a-agents` (list registered agents and skills), `a2a-task` (send a task and await the result)

---

### mcp-proxy

Aggregate and route requests across multiple MCP servers. Acts as a single entry point that proxies tool calls to the appropriate backend server.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-proxy.yaml')" goal='Use time and math tools through the proxy'
```

**Tools:** `aggregate`, `route`, `listServers`

---

### mcp-pass

Combine one primary MCP server with zero or more additional MCP servers and republish the merged tool set through a single MCP endpoint. Unlike `mcp-proxy`, `mcp-pass` forwards the downstream tools directly, so clients see the merged tools as native tools instead of going through a dispatcher tool.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `mainmcp` | Required primary MCP connection descriptor |
| `othermcps` | Optional array of extra MCP connection descriptors to merge |
| `includeTool` | Optional comma-separated list of tools to expose |
| `excludeTool` | Optional comma-separated list of tools to hide |
| `useprefix` | Optional comma-separated prefixes applied per connection order to avoid name collisions |
| `serverdesc` | Optional server metadata override for the exposed MCP identity |
| `onport` | If set, runs as an HTTP MCP server instead of STDIO |
| `uri` | Custom HTTP route prefix when using `onport` |
| `usesse` | If `true`, HTTP responses are returned as SSE events |

**Best for:**

- Exposing several MCP servers as one endpoint when the client expects a single MCP connection
- Adding local helper tools to an existing remote MCP without changing the remote server
- Publishing only a curated subset of tools from a larger tool estate
- Avoiding tool-name collisions by prefixing tools per upstream connection
- Passing HTTP request headers through to downstream MCP calls when auth or tenant context matters

**Usage:**
```bash
ojob mcps/mcp-pass.yaml onport=9091 \
  mainmcp="(type: remote, url: 'http://localhost:8080/mcp')" \
  othermcps="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-random.yaml')]"
```

```bash
ojob mcps/mcp-pass.yaml onport=9091 uri=/mcp usesse=true \
  mainmcp="(type: remote, url: 'http://localhost:8080/mcp')" \
  othermcps="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-random.yaml')]" \
  useprefix="core-,time-,rand-" \
  excludeTool="rand-pick"
```

**Returning TOON instead of JSON:**

OpenAF's MCP server helpers honor the `MCPSERVER.answerInTOON` runtime flag. When set, tool results are serialized as [TOON](https://github.com/toon-format/toon) (Token-Oriented Object Notation) text instead of JSON — typically 30–50% fewer tokens for tabular/structured payloads. Because STDIO MCPs launched by `mcp-pass` inherit the environment, setting the flag once turns the whole passthrough into a TOON gateway:

```bash
OAF_FLAGS="(MCPSERVER: (answerInTOON: true))" \
ojob mcps/mcp-pass.yaml onport=9091 uri=/mcp \
  mainmcp="(cmd: 'ojob mcps/mcp-web.yaml')" \
  othermcps="[(cmd: 'ojob mcps/mcp-time.yaml')]"
```

The downstream STDIO servers emit TOON tool results and `mcp-pass` forwards them verbatim to the client. For *remote* downstream MCPs, set the flag on those servers instead — `mcp-pass` does not re-encode content produced elsewhere.

**Auditing tool calls:** Set `OJOB_MCP_AUDIT=true` before starting any built-in MCP to log every `tools/call` request through OpenAF's `log()` function, including tool name and arguments. It is off by default and works in both STDIO and HTTP modes. Custom MCP YAML files using OpenAF's `httpdMCP` or `stdioMCP` helpers inherit the same behavior; pass `audit=true` directly when configuring those helpers if an environment variable is not suitable.

**When to choose `mcp-pass` vs `mcp-proxy`:**

- Use `mcp-pass` when you want the merged tools to appear directly to the client.
- Use `mcp-proxy` when you want an explicit proxy or dispatcher layer in front of multiple MCP backends.

See [Deploying MCP Servers in Docker & Kubernetes](#deploying-mcp-servers-in-docker--kubernetes) below for running `mcp-pass` as a containerized gateway.

---

### mcp-oaf

Access OpenAF utilities and formatting functions directly as MCP tools. Useful for data processing and transformation within the OpenAF ecosystem.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-oaf.yaml')" goal='Format this JSON data as a markdown table'
```

**Tools:** `oafp`, `ow.format`, `ow.obj`

---

### mcp-oafp

OpenAF processor for data transformation pipelines. Process, filter, and transform structured data using oafp commands.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-oafp.yaml')" goal='Process this CSV file and output the top 10 rows sorted by revenue'
```

**Tools:** `process`, `transform`, `filter`, `sort`

---

### mcp-oaf-browse

Generic browse server backed by the oJob-common **HTTP Browse API**. Exposes any Browse API endpoint (file listings, data catalogs, etc.) as list/get/search MCP tools.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `browseAPIURL` | Base URL of an HTTP Browse API endpoint (required) |
| `browseUri` | Target browse URI exposed by the Browse API (required) |
| `label` | Human-readable label injected into tool descriptions |
| `toolPrefix` | Optional prefix for tool names (e.g. `files-` → `files-list`, `files-get`, …) |
| `headers` | Optional HTTP headers map sent on every Browse API request |
| `defaultParams` | Optional query parameters map merged into every request |
| `onport` | Start an HTTP MCP server on this port instead of STDIO |

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-oaf-browse.yaml browseAPIURL=http://127.0.0.1:8091/api/browse browseUri=/files label=\"Local files\"')" \
  goal='List the available files and read the most recent one'
```

**Tools:** `list`, `get`, `search`

---

### mcp-office

Read and extract content from Microsoft Office documents and PDFs. Supports Excel spreadsheets, Word documents, and PDF files.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-office.yaml')" goal='Read the Excel file report.xlsx and summarize the data in Sheet1'
```

**Tools:** `readExcel`, `readWord`, `readPDF`, `listSheets`

---

### mcp-ollama-web-search

Web search through Ollama's web_search API endpoint. Requires an Ollama API key.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `apiKey` | Ollama API key (or set `OLLAMA_API_KEY` env var) |
| `baseUrl` | Ollama API base URL (default: `https://ollama.com`) |
| `onport` | If set, starts an HTTP MCP server on this port instead of STDIO |

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-ollama-web-search.yaml apiKey=YOUR_KEY')" goal='Search for latest AI news'
```

**Tools:** `web-search`

---

### mcp-wiki

Read-only discovery MCP for a Markdown wiki, backed by `MiniAWikiManager`. Use it for an agent or external client that should be able to orient itself, search, browse, and read without any capability to modify the wiki. It is deliberately separate from `mcp-wiki-ops`: passing `wikiaccess=rw` does not make this server writable.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `wikibackend` | Backend type: `fs`, `s3`, `s3fs`, or `es` (Elasticsearch/OpenSearch; default: `fs`) |
| `wikiroot` | Filesystem directory or local read-only `.zip`/`.okt` archive for the `fs` backend (default: `.`) |
| `wikibucket` | S3 bucket name (`s3` backend) |
| `wikiprefix` | S3 key prefix (`s3`/`s3fs`) or Elasticsearch/OpenSearch index name (`es`) |
| `wikiurl` | S3-compatible endpoint (`s3`/`s3fs`) or Elasticsearch/OpenSearch base URL (`es`) |
| `wikiaccesskey` | S3 access key or Elasticsearch/OpenSearch username |
| `wikisecret` | S3 secret key or Elasticsearch/OpenSearch password |
| `wikiregion` / `wikiuseversion1` / `wikiignorecertcheck` | S3 region, path-style/signature-v1 compatibility, and TLS-validation control |
| `wikimounts` | SLON/JSON array of read-only wiki mounts: `[{name, backend, root|bucket|prefix|url|...}]` |
| `wikis3artifactprefix` | Optional S3 prefix holding published Lucene/graph artifacts to hydrate into `wikiindexdir` at startup |
| `usewikigraph` | Enable the wiki knowledge graph (auto-enabled when `wikigraphfalkorhost` is set); search transparently appends related-page hints |
| `wikigraphsearchhints` | Append graph-related pages to search results when the wiki graph is enabled (default: `true`) |
| `wikigraphhintcap` | Maximum graph-hint pages appended to search results (default: `5`) |
| `wikigraphcross` / `wikigraphcrossjoin` | Enable query-time mounted-graph traversal and select join kinds: `link,tag,alias,concept` (enabled by default) |
| `wikigraphcrosscap` / `wikigraphcrossdepth` | Cap cross-wiki results (default: `5`) and traversal depth (default: `1`) |
| `wikigraphfalkorhost` / `wikigraphfalkorport` / `wikigraphfalkorgraph` / `wikigraphfalkoruser` / `wikigraphfalkorpass` | FalkorDB connection settings for graph-backed wiki state/query |
| `label` | Human-readable wiki label injected into tool descriptions |
| `toolPrefix` | Optional prefix for tool names (e.g. `docs-` → `docs-list`, `docs-read`, …) |
| `onport` | Start an HTTP MCP server on this port instead of STDIO |

**Usage:**
```bash
# STDIO: expose a filesystem wiki to another agent without write access
mini-a usetools=true \
  mcp="(cmd: 'ojob mcps/mcp-wiki.yaml wikiroot=/shared/wiki label=TeamWiki')" \
  goal='Summarize what the wiki says about authentication'

# HTTP: standalone read-only wiki server accessible by multiple clients
ojob mcps/mcp-wiki.yaml onport=8990 wikiroot=/shared/wiki label=TeamWiki
```

**Tools:** `context`, `search`, `read`, `browse`, `list`, `tree`, `backlinks`. Graph-related discovery can include read-only cross-wiki hints from mounted graphs; it does not write or merge either wiki.

### mcp-wiki-safe

`mcp-wiki-safe` is a read-only companion endpoint for an untrusted MCP client without direct backend access. It publishes only `search` and `read`: search returns bounded metadata and opaque, short-lived references; read consumes a reference once to return a bounded excerpt. This makes browsing and inventory collection difficult, but it is not DRM: clients can retain any text they are shown.

```bash
ojob mcps/mcp-wiki-safe.yaml onport=8888 label="Team wiki" wikiroot=./wiki \
  wikirestrictstate=/var/lib/mcp-wiki/restriction-ledger.json
```

`wikirestrictprofile` selects the disclosure defaults. `tight` is the default; `moderate` and `relaxed` change only limits, while hard ceilings continue to apply (`searchlimit <= 10`, `readlines <= 100`, `readchars <= 16000`). Individual `wikirestrict*` arguments override the selected profile. The explicit `off` profile removes all restrictions and makes this endpoint behave as unrestricted read-only `mcp-wiki`, so use it only for clients you already trust.

| Profile | Search results | Read lines | Read chars | Reference TTL | Searches / reads per hour |
|---|---:|---:|---:|---:|---:|
| `tight` (default) | 3 | 40 | 6000 | 120s | 30 / 15 |
| `moderate` | 5 | 70 | 10000 | 300s | 60 / 30 |
| `relaxed` | 10 | 100 | 16000 | 600s | 120 / 60 |
| `off` | unbounded | unbounded | unbounded | — | unbounded |

For multiple replicas, configure `wikirestrictrefch` with a concurrent shared OpenAF channel such as Redis or Mongo so a reference issued by one instance can be consumed by another. The default in-memory channel and `file` channel are suitable only for one writer. `wikirestrictstate`, which tracks usage budgets, is separate; use durable storage and protect it with ordinary filesystem permissions.

---

### mcp-wiki-ops

Maintenance MCP for trusted wiki lifecycle operations: linting, targeted edits, moves, deletes, section initialization, graph maintenance, and full reindexing. It defaults to writable mode; set `wikiopsreadonly=true` to publish only its read-only operations.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `wikibackend` | Backend type: `fs`, `s3`, `s3fs`, or `es` |
| `wikiaccess` | Access mode: `ro` or `rw` (`reindex` requires `rw`) |
| `wikiopsreadonly` | If `true`, disables mutating ops on this MCP server |
| `wikiroot` | Root directory for filesystem backend |
| `wikibucket` | S3 bucket name (`s3`/`s3fs`) |
| `wikiprefix` | S3 key prefix or Elasticsearch index name |
| `wikiurl` | Backend endpoint (`s3`/`s3fs`/`es`) |
| `wikimounts` | SLON/JSON array of read-only wiki mounts: `[{name, backend, root|bucket|prefix|url|...}]` |
| `usewikigraph` | Enable the wiki knowledge graph explicitly (auto-enabled when a FalkorDB host is provided) |
| `wikigraphcommunity` | Community detection algorithm for the wiki graph (default: `louvain`) |
| `wikigraphfalkorhost` / `wikigraphfalkorport` / `wikigraphfalkorgraph` / `wikigraphfalkoruser` / `wikigraphfalkorpass` | FalkorDB connection settings for graph-backed wiki state/query |
| `label` | Human-readable label used in tool descriptions |
| `toolPrefix` | Optional prefix for tool names |
| `onport` | Start in HTTP mode on this port instead of STDIO |

**Usage:**
```bash
# STDIO wiki maintenance server
mini-a usetools=true \
  mcp="(cmd: 'ojob mcps/mcp-wiki-ops.yaml wikiroot=/shared/wiki wikiaccess=rw label=TeamWikiOps')" \
  goal='Run wiki maintenance and trigger a reindex'

# HTTP standalone wiki maintenance server
ojob mcps/mcp-wiki-ops.yaml onport=8991 wikiroot=/shared/wiki wikiaccess=rw label=TeamWikiOps
```

**Tools:** `lint`, `edit`, `maintain`, `reindex` (`reindex` requires `wikiaccess=rw` and `wikiopsreadonly=false`), `graph_build` (build the wiki graph; structural always, semantic when `semantic=true`; syncs FalkorDB when configured), `graph_falkor` (query the wiki graph in FalkorDB, or resync when called without a `query`)

### Wiki storage, indexing, and graph deployment

Use `mcp-wiki` for the broad read-only audience and keep `mcp-wiki-ops` as a separately deployed, tightly permissioned maintenance endpoint. Both servers accept the same wiki backend connection settings, so point them at the same root, S3 bucket/prefix, or OpenSearch index when they must operate on the same content.

#### S3 and MinIO

For S3-compatible storage, set `wikibackend=s3`, `wikibucket`, `wikiprefix`, `wikiurl`, `wikiaccesskey`, and `wikisecret`. `wikiuseversion1=true` is useful for path-style-compatible endpoints such as some MinIO deployments. The pages remain Markdown objects under the selected prefix.

```bash
# Read-only discovery endpoint backed by MinIO
ojob mcps/mcp-wiki.yaml onport=8990 \
  wikibackend=s3 wikibucket=team-wiki wikiprefix=wiki/ \
  wikiurl=http://minio.internal:9000 \
  wikiaccesskey="$MINIO_ACCESS_KEY" wikisecret="$MINIO_SECRET_KEY" \
  wikiregion=us-east-1 wikiuseversion1=true label="Team wiki"

# Trusted maintenance endpoint for the same bucket and prefix
ojob mcps/mcp-wiki-ops.yaml onport=8991 \
  wikibackend=s3 wikibucket=team-wiki wikiprefix=wiki/ \
  wikiurl=http://minio.internal:9000 \
  wikiaccesskey="$MINIO_ACCESS_KEY" wikisecret="$MINIO_SECRET_KEY" \
  wikiregion=us-east-1 wikiuseversion1=true wikiaccess=rw label="Team wiki ops"
```

Wiki search first tries the optional local Lucene index for ordinary, unscoped literal searches. That index is local to the MCP process host, not stored in S3. A read-only `mcp-wiki` server consumes an existing index without taking the writer lock and never creates or refreshes it; on a new host or fresh prefix it scans Markdown objects without creating files. Set `wikis3artifactprefix` to hydrate a separately published Lucene/graph artifact tree into `wikiindexdir` at startup. Run `mcp-wiki-ops` with `wikiaccess=rw` and call `reindex` after bulk imports or migrations when you want a local Lucene index. Keep the maintenance service's local index storage durable if you rely on it, and treat it as a cache: S3 remains the source of truth. Regex, path-scoped, and explicit scan searches also use the scan path.

`wikibackend=s3fs` is a bootstrap/cache mode, not bidirectional synchronization: in writable mode it first copies the S3 pages into `wikiroot`, then uses the local filesystem backend. Do not use it as a multi-writer S3 replication mechanism.

#### Elasticsearch/OpenSearch and hybrid search

Set `wikibackend=es`, use `wikiurl` for the cluster base URL, `wikiprefix` for the index name, and `wikiaccesskey` / `wikisecret` for optional basic authentication. The wiki stores each Markdown page as a document keyed by `path`; listing is prefix-based and reading retrieves the document's raw Markdown.

This is a hybrid storage/search arrangement, not a direct pass-through to an OpenSearch full-text query: `MiniAWikiManager.search()` still uses its local Lucene index when present, otherwise it lists and scans wiki documents. Choose the `es` backend for centrally managed page storage and concurrent access; use the separate `mcp-es-search` MCP when an agent needs to issue native OpenSearch/Elasticsearch search queries against arbitrary indexes.

```bash
ojob mcps/mcp-wiki.yaml onport=8990 \
  wikibackend=es wikiurl=https://opensearch.internal:9200 \
  wikiprefix=team_wiki wikiaccesskey="$OS_USER" wikisecret="$OS_PASSWORD" \
  label="Team wiki"
```

#### Optional wiki graph

Enable `usewikigraph=true` to maintain a structural graph of page links. Search then appends a bounded set of related-page hints; it does not replace the normal Lucene-or-scan search described above. `mcp-wiki` exposes those enriched read results, while `mcp-wiki-ops` provides `graph_build` and `graph_falkor` for trusted graph maintenance and FalkorDB queries.

Without FalkorDB, graph state is a local cache beside the wiki/index runtime. With `wikigraphfalkorhost` (and optionally port, graph name, user, and password), graph support is enabled automatically and the maintenance MCP synchronizes and queries FalkorDB. For S3 and OpenSearch deployments, give every graph-building maintenance instance a durable local cache or a shared FalkorDB configuration; do not assume S3 or OpenSearch itself stores the graph.

---

## STDIO vs HTTP Usage

All built-in MCP servers use **STDIO mode** by default, meaning mini-a launches them as local child processes and communicates over standard input/output. This is the simplest setup and requires no network configuration.

For remote or shared deployments, MCP servers can also run in **HTTP mode**, where the server runs as a standalone service and mini-a connects to it over HTTP/SSE.

### STDIO Mode (Default)

```bash
# Local MCP server launched as a child process
mini-a mcp="(cmd: 'ojob mcps/mcp-time.yaml')"
```

### HTTP Mode

```bash
# Connect to a remote MCP server via URL
mini-a mcp="(type: remote, url: 'http://mcp-server.example.com:8080/mcp')"
```

| Mode | Pros | Cons |
|------|------|------|
| **STDIO** | No network setup, simple, self-contained | Single machine only |
| **HTTP** | Shared across users, centralized, scalable | Requires running a server |

---

## Using Multiple MCPs

mini-a supports loading multiple MCP servers simultaneously by passing an array of MCP descriptors.

```bash
# Load multiple MCP servers
mini-a mcp="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-math.yaml'), (cmd: 'ojob mcps/mcp-web.yaml')]"
```

When using three or more MCP servers, enable **proxy mode** for better performance. The proxy aggregates all tool definitions into a single interface, reducing overhead.

If you need to republish several MCP servers as one standalone MCP endpoint for another client or service, use `mcp-pass` instead of `mcpproxy=true`. `mcp-pass` exposes the merged downstream tools directly, while proxy mode is primarily an internal aggregation mechanism for a running mini-a session.

```bash
# With proxy (recommended for 3+ MCPs)
mini-a mcpproxy=true mcp="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-math.yaml'), (cmd: 'ojob mcps/mcp-web.yaml')]"
```

```bash
# Republish multiple MCPs as one MCP endpoint for another client
ojob mcps/mcp-pass.yaml onport=9091 \
  mainmcp="(cmd: 'ojob mcps/mcp-web.yaml')" \
  othermcps="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-random.yaml')]"
```

You can also combine STDIO and HTTP servers in a single session:

```bash
# Mix local and remote MCP servers
mini-a mcp="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-math.yaml'), (type: remote, url: 'http://remote-mcp:8080/mcp')]"
```

---

## Deploying MCP Servers in Docker & Kubernetes

Every built-in MCP server that accepts `onport` can run as a standalone HTTP service inside a container. The official [`openaf/mini-a`](https://hub.docker.com/r/openaf/mini-a) image ships with the mini-a oPack (including all built-in MCPs) pre-installed, so a container only needs the `OJOB` environment variable pointing at the MCP definition inside the oPack: `mini-a/mcps/<name>.yaml`. Everything after the image name is passed as arguments to the oJob.

> The `openaf/mini-a` image presets `OPACK_EXEC=mini-a`, which would start the agent console after the oJob exits. Clear it with `-e OPACK_EXEC=` so the container runs only the MCP server.

### Running a single MCP server in Docker

```bash
# Standalone mcp-time HTTP MCP server on port 8888
docker run -d --rm --name mcp-time \
  -e OJOB=mini-a/mcps/mcp-time.yaml \
  -e OPACK_EXEC= \
  -p 8888:8888 \
  openaf/mini-a \
  onport=8888
```

Connect from any MCP client — including another mini-a:

```bash
mini-a mcp="(type: remote, url: 'http://localhost:8888/mcp')" goal='What time is it in Tokyo?'
```

Built-in MCP servers started with `onport` also expose `/healthz` and `/metrics` endpoints, ready for container health checks and Prometheus scraping. (`mcp-pass` serves only its MCP URI — use a TCP probe for it.)

### mcp-pass as a passthrough gateway container

`mcp-pass` is the natural fit for containerized deployment: a single container connects to one main MCP plus any number of extra ones (local STDIO or remote HTTP) and republishes the merged tool set as one HTTP MCP endpoint.

```bash
docker run -d --rm --name mcp-gateway \
  -e OJOB=mini-a/mcps/mcp-pass.yaml \
  -e OPACK_EXEC= \
  -p 9091:9091 \
  openaf/mini-a \
  onport=9091 uri=/mcp \
  mainmcp="(type: remote, url: 'http://internal-mcp:8080/mcp')" \
  othermcps="[(cmd: 'ojob mini-a/mcps/mcp-time.yaml'), (cmd: 'ojob mini-a/mcps/mcp-random.yaml')]" \
  useprefix="core-,time-,rand-"
```

The STDIO MCPs referenced in `othermcps` are spawned *inside* the container as child processes — no extra containers or ports needed. Clients see a single endpoint at `http://host:9091/mcp` with the merged (and optionally prefixed/filtered) tools.

### Quick TOON gateway: republish any MCP in TOON format

A common use of the gateway pattern is converting tool results from JSON to **TOON** to cut token usage for LLM clients. Set `OAF_FLAGS="(MCPSERVER: (answerInTOON: true))"` on the container — the STDIO MCP servers spawned inside it inherit the flag, serialize their tool results as TOON, and `mcp-pass` forwards that text verbatim:

```bash
docker run -d --rm --name mcp-gateway-toon \
  -e OJOB=mini-a/mcps/mcp-pass.yaml \
  -e OPACK_EXEC= \
  -e OAF_FLAGS="(MCPSERVER: (answerInTOON: true))" \
  -p 9091:9091 \
  openaf/mini-a \
  onport=9091 uri=/mcp \
  mainmcp="(cmd: 'ojob mini-a/mcps/mcp-web.yaml')" \
  othermcps="[(cmd: 'ojob mini-a/mcps/mcp-time.yaml'), (cmd: 'ojob mini-a/mcps/mcp-math.yaml')]"
```

Notes:

- The flag is honored by OpenAF's MCP server helpers in both STDIO and HTTP modes, so it also works when running a single built-in MCP directly (without `mcp-pass`).
- Tool results produced by *remote* downstream MCPs pass through unchanged; enable the flag on those servers if you want end-to-end TOON.
- On the consuming side, mini-a can also use TOON internally — see `mcpproxytoon` in the [Configuration Reference]({{ '/configuration' | relative_url }}).

### Kubernetes deployment

The same gateway runs in Kubernetes with a standard Deployment + Service. oJob arguments go in `args`; environment configuration in `env`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcp-gateway
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mcp-gateway
  template:
    metadata:
      labels:
        app: mcp-gateway
    spec:
      containers:
      - name: mcp-pass
        image: openaf/mini-a
        env:
        - name: OJOB
          value: mini-a/mcps/mcp-pass.yaml
        - name: OPACK_EXEC
          value: ""
        - name: OAF_FLAGS
          value: "(MCPSERVER: (answerInTOON: true))"   # optional: TOON tool results
        args:
        - onport=9091
        - uri=/mcp
        - "mainmcp=(cmd: 'ojob mini-a/mcps/mcp-web.yaml')"
        - "othermcps=[(cmd: 'ojob mini-a/mcps/mcp-time.yaml'), (cmd: 'ojob mini-a/mcps/mcp-math.yaml')]"
        ports:
        - containerPort: 9091
        readinessProbe:
          tcpSocket:
            port: 9091
          initialDelaySeconds: 10
        livenessProbe:
          tcpSocket:
            port: 9091
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: mcp-gateway
spec:
  selector:
    app: mcp-gateway
  ports:
  - port: 80
    targetPort: 9091
```

Clients inside the cluster connect with:

```bash
mini-a mcp="(type: remote, url: 'http://mcp-gateway/mcp')" goal='...'
```

For single built-in MCPs deployed this way (e.g. `mcp-wiki`, `mcp-es-search`), prefer HTTP probes against `/healthz` instead of TCP probes. Use `serverdesc` on `mcp-pass` to give the gateway a distinct advertised identity, and `includeTool`/`excludeTool` to publish only a curated tool subset.

### Image variants

| Image | Best for |
|-------|----------|
| `openaf/mini-a` | Running mini-a and its built-in MCPs (oPack pre-installed) |
| `openaf/oaf:edge` + `-e OPACKS=mini-a` | Custom oPack combinations; installs mini-a on first start |

---

## Creating Custom MCPs

Custom MCP servers can be created following the [Model Context Protocol specification](https://modelcontextprotocol.io). Any server that implements the MCP standard will work with mini-a, regardless of the programming language used to build it.

To create a custom MCP server for use with mini-a:

1. Implement the MCP protocol (tool discovery and invocation over STDIO or HTTP)
2. Define your tools with clear names, descriptions, and parameter schemas
3. Load your custom server using the `mcp` parameter with the path to your server script

```bash
# Load a custom MCP server
mini-a mcp="(cmd: 'path/to/my-custom-mcp.js')"
```

For examples and reference implementations, see the [mini-a repository](https://github.com/OpenAF/mini-a).

---

<div class="cta-section">
  <h2>Ready to Try It?</h2>
  <p>Get mini-a running in under a minute and start using MCP servers.</p>
  <div class="cta-buttons">
    <a href="{{ '/getting-started' | relative_url }}" class="btn btn-primary">Get Started</a>
    <a href="{{ '/configuration' | relative_url }}" class="btn btn-secondary">Configuration Reference</a>
  </div>
</div>
