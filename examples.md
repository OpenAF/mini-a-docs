---
layout: page
title: Examples
permalink: /examples/
---

This page provides practical, copy-pasteable examples of mini-a in action. All examples assume you have mini-a installed and a model configured (see [Getting Started]({{ '/getting-started' | relative_url }})).

---

## Basic Examples

### File Operations

List files and count lines of code:

```bash
mini-a useutils=true goal='List all .js files in the current directory and count lines of code in each'
```

Find TODO comments across a project:

```bash
mini-a useutils=true goal='Find all TODO comments in this project'
```

Generate a project overview:

```bash
mini-a useutils=true goal='Create a summary of the project structure'
```

### Data Processing

Analyze a CSV file using the `@` file inclusion syntax:

```bash
mini-a useutils=true goal='@data.csv Analyze this CSV and give me the top 5 entries by revenue'
```

Convert between data formats:

```bash
mini-a useutils=true goal='Convert the JSON file config.json to YAML format'
```

### Text Tasks

Proofread a document:

```bash
mini-a useutils=true goal='@report.md Proofread this document and list any grammar issues'
```

Draft a reply to an email:

```bash
mini-a useutils=true goal='@email.txt Write a professional reply to this email'
```

---

## MCP Examples

mini-a can connect to [MCP (Model Context Protocol)]({{ '/features' | relative_url }}) servers to extend its capabilities with external tools.

### Time & Date (mcp-time)

Query the current time across multiple time zones:

```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-time.yaml')" goal='What time is it in Tokyo, London, and New York?'
```

### Database (mcp-db)

Connect to a SQLite database and explore its schema:

```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-db.yaml jdbc=jdbc:sqlite:app.db')" goal='Connect to the SQLite database app.db and show all tables'
```

### Web Search (mcp-web)

Search the web for up-to-date information:

```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-web.yaml')" goal='Search the web for the latest OpenAF release notes'
```

### Multiple MCPs with Proxy

Combine several MCP servers in a single session using the MCP proxy:

```bash
mini-a mcpproxy=true mcp="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-web.yaml'), (cmd: 'ojob mcps/mcp-math.yaml')]" goal='What is the current time in UTC and calculate how many hours until midnight?'
```

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S12 — MCP proxy combining multiple servers]</div>

---

## Advanced Examples

### Chatbot Mode

Run mini-a as a conversational tutor with no tool access:

```bash
mini-a chatbotmode=true youare='a helpful Python tutor' goal='Teach me about list comprehensions'
```

### Git Workflows

Analyze recent git activity with shell access enabled:

```bash
mini-a useshell=true goal='Analyze the git log for the last week and summarize the changes by author'
```

### Code Generation

Generate a full project with shell and file-write access:

```bash
mini-a useshell=true readwrite=true goal='Create a REST API server in Node.js with endpoints for CRUD operations on a users table'
```

### Documentation Generation

Auto-generate API documentation from source code:

```bash
mini-a useshell=true readwrite=true goal='Generate API documentation for all JavaScript files in src/'
```

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S13 — Before/after auto-generated docs]</div>

---

## Integration Examples

### Docker

Run mini-a in a container without installing OpenAF locally. Mount your project directory and let it work:

```bash
docker run --rm -e OAF_MODEL="(type: openai, model: gpt-4o, key: '...')" -e OPENAI_API_KEY=$OPENAI_API_KEY -v $(pwd):/work openaf/mini-a useutils=true goal='Analyze the project in /work and create a README'
```

### oJob Pipeline

Integrate mini-a into an OpenAF oJob workflow for automation:

```yaml
jobs:
  - name: Analyze Code
    exec: |
      var result = $mini_a({
        goal: "Review the code quality of " + args.file,
        model: "(type: openai, model: gpt-4o, key: '...')"
      });
      print(result);
```

---

## Real-World Scenarios

These are just a taste of what mini-a can do. For full walkthroughs, visit the [Use Cases]({{ '/use-cases' | relative_url }}) page.

- **Log Analysis** — Automated parsing of application logs with pattern detection and alerting
- **Code Audit** — Security vulnerability scanning and code quality review across repositories
- **Data Migration** — Transform and validate data pipelines between formats and systems

---

## Performance Tips

Getting the best results from mini-a while keeping costs and latency low:

- **Use low-cost models for simple tasks.** Not every goal needs a frontier model:

  ```bash
  export OAF_MODEL="(type: openai, model: gpt-4o-mini, key: '...')"
  ```

- **Enable dual-model for cost savings.** Set a powerful model for planning and a lighter model for execution by configuring both `OAF_MODEL` (main) and `OAF_LC_MODEL` (light):

  ```bash
  export OAF_MODEL="(type: openai, model: gpt-4o, key: '...')"
  export OAF_LC_MODEL="(type: openai, model: gpt-4o-mini, key: '...')"
  ```

- **Manage context actively.** Use the `/compact` command regularly in interactive sessions, and set a context limit for long-running tasks:

  ```bash
  mini-a maxcontext=40000
  ```

- **Write specific goals.** The more precise your goal, the fewer tokens mini-a spends exploring. Compare:
  - Vague: `"Improve the code"`
  - Specific: `"Refactor the handleRequest function in server.js to use async/await instead of callbacks"`

---

## Next Steps

- **[Features]({{ '/features' | relative_url }})** — Explore all of mini-a's capabilities in depth
- **[Cheatsheet]({{ '/cheatsheet' | relative_url }})** — Quick reference for commands, parameters, and environment variables
- **[Configuration]({{ '/configuration' | relative_url }})** — Fine-tune mini-a for your workflow
