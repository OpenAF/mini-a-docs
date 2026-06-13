---
layout: page
title: FAQ
permalink: /faq/
---

Frequently asked questions about mini-a. Can't find your answer? [Open an issue](https://github.com/OpenAF/mini-a/issues).
{: .faq-section}

## General

### What is mini-a?

mini-a is a minimalist autonomous agent framework built on [OpenAF](https://openaf.io). It connects to LLMs (like GPT-5, Gemini, Claude, or local models via Ollama), uses tools through the [MCP protocol](https://modelcontextprotocol.io), and can execute shell commands to achieve goals you define — all from a single command.

### How does mini-a compare to other agent frameworks?

<div class="comparison-table">

| Feature | mini-a | LangChain | AutoGPT | CrewAI |
|---------|--------|-----------|---------|--------|
| **Setup complexity** | 1 command | pip + config | Docker + config | pip + config |
| **Lines to first agent** | 1 | 20-50 | 10-20 | 30-50 |
| **LLM providers** | 10+ | 10+ | 3-5 | 5-10 |
| **Built-in cost optimization** | Dual-model | Manual | No | No |
| **MCP support** | 20+ built-in | Via plugins | No | No |
| **Runtime footprint** | Lightweight | Heavy | Heavy | Medium |
| **Language** | JavaScript/OpenAF | Python | Python | Python |
| **Interfaces** | Console, Web, Library, Docker | Library | Web | Library |
| **Shell integration** | Native | Via tools | Via plugins | Via tools |

</div>

### Is mini-a free?

Yes. mini-a is open source. You only pay for the LLM API calls you make. Using local models (Ollama) is completely free.

### What is OpenAF?

[OpenAF](https://openaf.io) is an open-source automation framework for Java/JavaScript. mini-a is built as an OpenAF package (oPack). OpenAF provides the runtime, and mini-a provides the agent logic.

## Installation

### How do I install OpenAF?

Visit [openaf.io](https://openaf.io) for installation instructions. It supports Linux, macOS, and Windows.

### What platforms does mini-a support?

Anywhere OpenAF runs: Linux, macOS, Windows, and Docker. ARM and x86 architectures are supported.

### Do I need Java?

OpenAF includes its own runtime, so you don't need to install Java separately.

## Models

### Which LLM model should I use?

It depends on your needs:

| Use Case | Recommended Model | Why |
|----------|-------------------|-----|
| General purpose | `(type: openai, model: gpt-5.2, key: '...')` | Good balance of speed, cost, and quality |
| Budget-friendly | `(type: openai, model: gpt-5-mini, key: '...')` | Low cost, good for simple tasks |
| Best quality | `(type: anthropic, model: claude-sonnet-4-5-20250929, key: '...')` | Strong reasoning and coding |
| Privacy/local | `(type: ollama, model: 'llama3', url: 'http://localhost:11434')` | Runs locally, no data leaves your machine |
| AWS environments | `(type: bedrock, options: (region: eu-west-1, model: 'anthropic.claude-sonnet-4-5-20250929-v1:0'))` | Uses existing AWS credentials |

### Can I use local models?

Yes. Install [Ollama](https://ollama.ai), pull a model (`ollama pull llama3`), and set:

```bash
export OAF_MODEL="(type: ollama, model: 'llama3', url: 'http://localhost:11434')"
```

No API key needed. All processing stays on your machine.

### How do I manage API keys securely?

Use the built-in model manager for encrypted storage:

```bash
mini-a modelman=true
```

This provides a TUI to store, encrypt, and manage credentials. Alternatively, use environment variables.

### Can I switch models mid-session?

Yes. Use the `/model` command in the console to see the current model. To change models, restart with a different `OAF_MODEL` value, or use the model manager.

### Does mini-a support custom slash commands, skills, and hooks?

Yes. mini-a supports:

- Custom slash command templates in `~/.openaf-mini-a/commands/<name>.md`
- Skills in `~/.openaf-mini-a/skills/<name>/SKILL.md` or `~/.openaf-mini-a/skills/<name>.md`
- Console hooks in `~/.openaf-mini-a/hooks/*.yaml|*.yml|*.json`
- Extra loading paths via `extracommands=...`, `extraskills=...`, and `extrahooks=...`

You can run templates directly with `mini-a exec="/<name> arg1 arg2"` and list skills with `/skills`.
Supported placeholders inside command/skill templates are `{{args}}`, `{{argv}}`, `{{argc}}`, and positional `{{arg1}}`, `{{arg2}}`, ...

Reference: [mini-a `USAGE.md`](https://github.com/OpenAF/mini-a/blob/main/USAGE.md)

## MCP

### What is MCP?

MCP (Model Context Protocol) is a standard protocol for connecting LLMs to external tools and data sources. mini-a includes 20+ built-in MCP servers for common tasks. See the [MCP Catalog]({{ '/mcp-catalog' | relative_url }}).

### How do I test if an MCP server works?

```bash
mini-a mcp="(cmd: 'ojob mcps/mcp-time.yaml')" goal='What time is it?'
```

If the MCP server loads correctly, you'll see its tools listed in the startup output.

### Can I create custom MCP servers?

Yes. Any server implementing the MCP protocol (STDIO or HTTP) can be used with mini-a. Point to your server with a full path or URL.

### How many MCPs can I use at once?

There's no hard limit, but using 3+ MCPs is best with proxy mode to reduce overhead:

```bash
mini-a mcpproxy=true mcp="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-web.yaml'), (cmd: 'ojob mcps/mcp-db.yaml jdbc=jdbc:h2:./data user=sa pass=sa')]"
```

## Security

### Is it safe to enable shell access?

Shell access is **off by default**. When enabled (`useshell=true`), consider:

- Keep `readwrite=false` (the default) to prevent file modifications
- Use `shellallow` to whitelist specific commands
- Use `shellban` to block dangerous commands
- Use Docker for full isolation

```bash
# Safe shell access: read-only with allowed commands only
mini-a useshell=true readwrite=false shellallow='git,ls,cat,grep'
```

### How does Docker isolation work?

Run mini-a in a container so the agent can only affect the container environment:

```bash
docker run --rm -e OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')" \
  -v $(pwd):/work:ro openaf/mini-a useshell=true goal='Analyze the project in /work'
```

The `:ro` mount flag ensures files are read-only inside the container.

### Are my API keys encrypted?

When using the model manager (`modelman=true`), keys are stored encrypted on disk. Environment variables are not encrypted but are standard practice for API key management.

## Performance

### How do I reduce token usage?

1. **Use dual-model**: Set `OAF_LC_MODEL` for simple tasks (50-70% savings)
2. **Compact conversations**: Use `/compact` or set `maxcontext`
3. **Be specific**: Precise goals = fewer tokens
4. **Limit steps**: Set `maxsteps` to prevent runaway agents

### What's the dual-model strategy?

Set a powerful model for complex tasks and a cheaper model for simple ones:

```bash
export OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')"        # Complex reasoning
export OAF_LC_MODEL="(type: openai, model: gpt-5-mini, key: '...')"  # Routing, summarization
```

mini-a automatically routes tasks to the appropriate model. Simple operations (summarization, classification, routing) go to the cheaper model, saving 50-70% on typical workloads.

### How do I monitor costs?

Use `/stats` in the console to see token counts, model usage, and estimated costs for the current session.

## Troubleshooting

### "Model not found" error

Check that `OAF_MODEL` is in the expected SLON/JSON-style configuration format and that credentials are present:

```bash
echo $OAF_MODEL    # Should show something like: (type: openai, model: gpt-5.2, key: '...')
```

### "Permission denied" when running commands

Shell access is disabled by default. Enable it:

```bash
mini-a useshell=true
```

### "Context too long" or truncation warnings

Your conversation exceeded the context window. Solutions:

```bash
/compact                              # Manual compaction
mini-a maxcontext=40000  # Set a limit
/reset                                # Start fresh
```

### Agent seems stuck or looping

Set a step limit to prevent infinite loops:

```bash
mini-a maxsteps=20 goal='...'
```

### Connection errors to LLM API

1. Check your internet connection
2. Verify the API key is valid and has credits
3. Check for rate limiting (`rpm`, `tpm` parameters)
4. For Ollama, ensure the service is running (`ollama serve`)

### Web UI not loading

Ensure you specified a port and check for conflicts:

```bash
mini-a onport=8080
# If port is busy, try another:
mini-a onport=3000
```

---

Still stuck? [Open an issue](https://github.com/OpenAF/mini-a/issues) with the error message and your configuration (redact API keys).
