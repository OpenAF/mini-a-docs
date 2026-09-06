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

<div id="player-s12" style="border-radius:8px; overflow:hidden; border:1px solid rgba(160,174,192,0.3);"></div>
<script>AsciinemaPlayer.create("{{ '/assets/images/screenshots/s12-mcp-proxy.cast' | relative_url }}", document.getElementById('player-s12'), { cols: 127, rows: 24, autoPlay: true, loop: true, fit: 'width' });</script>

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

### Per-Run Validation Model Override

Run deep research with a dedicated validation model without changing your shell profile:

```bash
mini-a deepresearch=true \
  modelval="(type: openai, model: gpt-5-mini, key: '...')" \
  valgoal='The answer must include sources, risks, and a final recommendation' \
  goal='Compare the current deployment options for this project'
```

### Surface Tagged Thinking Blocks

If your provider emits XML-tagged reasoning blocks, show them as thought logs:

```bash
mini-a showthinking=true goal='Explain how the current build pipeline works'
```

`showthinking=true` is useful for debugging prompt behavior, but it is not compatible with `usestream=true`.

<div id="player-s13" style="border-radius:8px; overflow:hidden; border:1px solid rgba(160,174,192,0.3);"></div>
<script>AsciinemaPlayer.create("{{ '/assets/images/screenshots/s13-doc-gen-before-after.cast' | relative_url }}", document.getElementById('player-s13'), { cols: 127, rows: 24, autoPlay: true, loop: true, fit: 'width' });</script>

---

## Integration Examples

### Docker

Run mini-a in a container without installing OpenAF locally. Mount your project directory and let it work:

```bash
docker run --rm -e OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')" -v $(pwd):/work openaf/mini-a useutils=true goal='Analyze the project in /work and create a README'
```

### oJob Pipeline

Integrate mini-a into an OpenAF oJob workflow for automation. The examples in `OpenAF/mini-a/examples` use a repeatable pattern:

- Add `mini-a` in `ojob.opacks`.
- Load the packaged job definition with `jobsInclude: [mini-a.yaml]`.
- Put your instructions in a `to: - (mini-a): ...` block (or route to `MiniAgent`).
- Configure behavior with args like `useshell`, `readwrite`, `usetools`, `format`, and `outfile`.

```yaml
ojob:
  opacks:
    - mini-a

jobsInclude:
  - mini-a.yaml

todo:
  - Generate CHANGELOG.md

jobs:
  - name: Generate CHANGELOG.md
    to:
      - (mini-a): |
          Build a markdown changelog from git history.
          Classify commits by type and write the final output.
        ((useshell)): true
        ((shellbatch)): true
        ((shellallowpipes)): true
        ((readwrite)): true
        ((usetools)): true
        ((format)): md
        ((outfile)): CHANGELOG.md
```

When you need the pipeline to verify that the generated result actually meets the intended outcome, enable deep research and add a `valgoal` (alias for `validationgoal`) with explicit acceptance criteria:

```yaml
ojob:
  opacks:
    - mini-a

jobsInclude:
  - mini-a.yaml

todo:
  - Build release summary with validation

jobs:
  - name: Build release summary with validation
    to:
      - (mini-a): |
          Create docs/release-summary.md from the latest git changes.
          Focus on user-visible changes, breaking changes, and upgrade notes.
        ((useshell)): true
        ((shellbatch)): true
        ((shellallowpipes)): true
        ((readwrite)): true
        ((usetools)): true
        ((deepresearch)): true
        ((valgoal)): |
          Validate that the result:
          - is written in markdown
          - includes sections for Features, Fixes, Breaking Changes, and Upgrade Notes
          - mentions only changes supported by the repository evidence
          - does not leave TODOs or placeholders
          - is ready to publish as-is
        ((validationthreshold)): PASS
        ((format)): md
        ((outfile)): docs/release-summary.md
```

You can also route validation to a different model than the main execution model:

- Set `OAF_VAL_MODEL` in the environment to use a dedicated validation model for all deep-research runs.
- Or set `vmodel` directly in the job parameters when you want the override to be local to that specific pipeline step.

You can reuse the same structure for other automation tasks shown in upstream examples:

- **Documentation refresh (`document.yaml`)**: use `useshell=true`, `useutils=true`, and `readwrite=true` so mini-a can scan repo files and update markdown docs.
- **Chat post-processing (`learn-from-chat.yaml`)**: validate inputs in `check.in`, pass templated paths (`{{chat}}`, `{{rules}}`), and set `templateArgs=true`.
- **Folder summary reports (`summary.yaml`)**: generate `summary.md` with mini-a (`format: md`, `outfile: summary.md`) and convert to HTML in a follow-up oJob step.

Two newer upstream examples are useful as starting points:

- **Email report (`email-report.yaml`)**: generate a compact markdown report with mini-a, save it locally, then send it through SMTP as the email body.
- **Specialized agent template (`agent-template.yaml`)**: bootstrap a reusable domain-specific mini-a agent by filling in `youare`, `knowledge`, `goal`, `rules`, and output settings.

If you prefer OpenAF JavaScript style, you can still call `$mini_a(...)` directly inside `exec`, but `jobsInclude + (mini-a)` keeps YAML jobs concise and consistent.

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
  export OAF_MODEL="(type: openai, model: gpt-5-mini, key: '...')"
  ```

- **Enable dual-model for cost savings.** Set a powerful model for planning and a lighter model for execution by configuring both `OAF_MODEL` (main) and `OAF_LC_MODEL` (light):

  ```bash
  export OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')"
  export OAF_LC_MODEL="(type: openai, model: gpt-5-mini, key: '...')"
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
