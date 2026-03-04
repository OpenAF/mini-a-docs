---
layout: page
title: MCP Catalog
permalink: /mcp-catalog/
---

**MCP (Model Context Protocol)** is an open standard that defines how LLMs discover and invoke external tools through a uniform interface. Instead of hard-coding integrations, mini-a connects to MCP servers that expose capabilities as callable tools. Each MCP server runs as a separate process (STDIO) or remote service (HTTP), and mini-a automatically discovers available tools at startup.

mini-a ships with **22 built-in MCP servers** covering a wide range of tasks. Load any combination of them with the `mcp` parameter.

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
| `mcp-s3` | AWS S3 operations | STDIO | `listBuckets`, `getObject`, `putObject` |
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
| `mcp-mini-a` | Spawn sub-agents | STDIO | `delegate`, `status` |
| `mcp-proxy` | MCP proxy/aggregator | STDIO | `aggregate`, `route` |
| `mcp-oaf` | OpenAF utilities | STDIO | `oafp`, `ow.format` |
| `mcp-oafp` | OpenAF processor | STDIO | `process`, `transform` |
| `mcp-office` | Office document processing | STDIO | `readExcel`, `readWord`, `readPDF` |

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

Interact with AWS S3-compatible object storage. List buckets, upload and download objects, and manage permissions.

**Configuration:**

| Argument | Description |
|----------|-------------|
| `accessKey` | AWS access key ID |
| `secretKey` | AWS secret access key |
| `region` | AWS region (default: `us-east-1`) |

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-s3.yaml')" goal='List all buckets and show the 5 most recent objects in each'
```

**Tools:** `listBuckets`, `listObjects`, `getObject`, `putObject`, `deleteObject`

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

### mcp-mini-a

Spawn sub-agents to handle delegated tasks. The parent agent can assign goals to child mini-a instances and monitor their progress.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-mini-a.yaml')" goal='Research three topics in parallel and combine the results'
```

**Tools:** `delegate`, `status`, `cancel`

---

### mcp-proxy

Aggregate and route requests across multiple MCP servers. Acts as a single entry point that proxies tool calls to the appropriate backend server.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-proxy.yaml')" goal='Use time and math tools through the proxy'
```

**Tools:** `aggregate`, `route`, `listServers`

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

### mcp-office

Read and extract content from Microsoft Office documents and PDFs. Supports Excel spreadsheets, Word documents, and PDF files.

**Usage:**
```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-office.yaml')" goal='Read the Excel file report.xlsx and summarize the data in Sheet1'
```

**Tools:** `readExcel`, `readWord`, `readPDF`, `listSheets`

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

```bash
# With proxy (recommended for 3+ MCPs)
mini-a mcpproxy=true mcp="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-math.yaml'), (cmd: 'ojob mcps/mcp-web.yaml')]"
```

You can also combine STDIO and HTTP servers in a single session:

```bash
# Mix local and remote MCP servers
mini-a mcp="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-math.yaml'), (type: remote, url: 'http://remote-mcp:8080/mcp')]"
```

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
