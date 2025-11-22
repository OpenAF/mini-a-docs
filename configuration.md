---
layout: page
title: Configuration
permalink: /configuration/
---

Complete reference for all mini-a configuration parameters.

## Model Configuration

### Primary Model (OAF_MODEL)

The main LLM model for reasoning and task execution.

```bash
export OAF_MODEL="(
  type: openai,
  model: gpt-4o-mini,
  key: 'sk-...',
  timeout: 900000,
  temperature: 1
)"
```

**Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `type` | string | Model provider (openai, google, anthropic, bedrock, ollama, github) | Required |
| `model` | string | Specific model name | Required |
| `key` | string | API key (if required) | - |
| `url` | string | Custom API endpoint | - |
| `timeout` | number | Request timeout in milliseconds | 900000 |
| `temperature` | number | Sampling temperature (0-2) | 1 |
| `region` | string | AWS region (for Bedrock) | us-east-1 |

### Low-Cost Model (OAF_LC_MODEL)

Optional secondary model for cost optimization.

```bash
export OAF_LC_MODEL="(
  type: openai,
  model: gpt-4o-mini,
  key: 'sk-...',
  timeout: 900000
)"
```

Same parameters as `OAF_MODEL`. When set, mini-a uses this model for routine tasks and escalates to the main model when needed.

## Core Parameters

### Goal

The objective or task for mini-a to accomplish.

```bash
mini-a goal="Your objective here"
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `goal` | string | The task description |

**File inclusion syntax:**
```bash
mini-a goal="Analyze @data.csv and provide insights"
```

### Shell Access

Control command execution capability.

```bash
mini-a goal="task" useshell=true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `useshell` | boolean | false | Enable shell command execution |

⚠️ **Security:** Shell access is disabled by default. Only enable for trusted tasks.

### Chatbot Mode

Enable conversational multi-turn interactions.

```bash
mini-a goal="help me plan" chatbotmode=true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `chatbotmode` | boolean | false | Enable multi-turn conversation mode |

## MCP Configuration

### Single MCP Server

```bash
mini-a goal="task" mcp="(cmd: 'ojob mcps/mcp-time.yaml', timeout: 5000)"
```

**STDIO Server Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `cmd` | string | Command to start MCP server |
| `timeout` | number | Connection timeout (ms) |

**HTTP Remote Server:**

```bash
mini-a goal="task" mcp="(type: remote, url: 'http://localhost:9090/mcp', timeout: 10000)"
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Set to "remote" for HTTP |
| `url` | string | MCP server URL |
| `timeout` | number | Request timeout (ms) |

### Multiple MCP Servers

```bash
mini-a goal="task" mcp="[
  (cmd: 'ojob mcps/mcp-time.yaml'),
  (cmd: 'ojob mcps/mcp-fin.yaml')
]"
```

### MCP Proxy Mode

Aggregate multiple MCPs into a single tool interface.

```bash
mini-a goal="task" mcpproxy=true mcp="[...]"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `mcpproxy` | boolean | false | Enable MCP proxy aggregation |

Benefits:
- Reduced LLM context
- Better token efficiency
- Scalable MCP integration

### MCP Testing

Interactive MCP server testing.

```bash
mini-a mcptest=true mcp="(cmd: 'ojob mcps/mcp-time.yaml')"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `mcptest` | boolean | false | Launch MCP testing console |
| `debug` | boolean | false | Enable MCP debug logging |

## Tool Configuration

### Built-in Utilities

Enable mini-a's utility tool set.

```bash
mini-a goal="task" useutils=true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `useutils` | boolean | false | Enable utility tools (file ops, text processing, etc.) |

### Custom Tools

Enable custom tool support.

```bash
mini-a goal="task" usetools=true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `usetools` | boolean | false | Enable custom tools |

### Tool Libraries

Load additional tool libraries.

```bash
mini-a goal="task" libs="@custom-tools.js,helper.js"
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `libs` | string | Comma-separated list of library files to load |

## Context Management

### Maximum Context

Control context window size.

```bash
mini-a goal="task" maxcontext=100000
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `maxcontext` | number | varies | Maximum context tokens |

### Maximum Tokens

Control response length.

```bash
mini-a goal="task" maxtokens=4096
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `maxtokens` | number | varies | Maximum response tokens |

### Conversation Management

Console commands for managing long conversations:

| Command | Description |
|---------|-------------|
| `/compact [n]` | Condense older messages, keep last n exchanges |
| `/summarize [n]` | Create summary, keep last n exchanges |
| `/last` | Show previous answer |
| `/last md` | Show previous answer in raw Markdown |
| `/save <path>` | Save last answer to file |

## Planning Configuration

### Planning Mode

Enable multi-step planning.

```bash
mini-a goal="complex task" useplanning=true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `useplanning` | boolean | false | Enable planning mode |
| `planningiterations` | number | 10 | Maximum planning steps |

### Thinking Mode

Enable chain-of-thought reasoning.

```bash
mini-a goal="task" usethinking=true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `usethinking` | boolean | false | Enable reasoning output |

## Web Interface Configuration

### Port

Specify the web server port.

```bash
./mini-a-web.sh onport=8888
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `onport` | number | 8080 | Web server port |

### Other Web Options

```bash
./mini-a-web.sh onport=8888 auth="user:pass"
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `auth` | string | Basic authentication (username:password) |
| `cors` | boolean | Enable CORS |

## Logging and Debug

### Debug Mode

Enable detailed logging.

```bash
mini-a goal="task" debug=true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `debug` | boolean | false | Enable debug output |

### Log Level

Control logging verbosity.

```bash
mini-a goal="task" loglevel=DEBUG
```

| Parameter | Type | Default | Options |
|-----------|------|---------|---------|
| `loglevel` | string | INFO | DEBUG, INFO, WARN, ERROR |

### Log File

Specify log file path.

```bash
mini-a goal="task" logfile="mini-a.log"
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `logfile` | string | Path to log file |

### Statistics

Display token and cost statistics.

```bash
mini-a goal="task" showstats=true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `showstats` | boolean | false | Show usage statistics |

## Model Manager

### Launch Model Manager

```bash
mini-a modelman=true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `modelman` | boolean | false | Launch model manager interface |

Features:
- Create model configurations
- Import from SLON/JSON
- Export configurations
- Rename models
- Delete models
- Encrypted storage

## Docker Environment Variables

When running in Docker, use these environment variables:

```bash
docker run --rm -ti \
  -e OPACKS=mini-a \
  -e OPACK_EXEC=mini-a \
  -e OAF_MODEL="..." \
  -e OAF_LC_MODEL="..." \
  openaf/oaf:edge \
  goal="task" useshell=true
```

| Variable | Description |
|----------|-------------|
| `OPACKS` | OpenAF packages to install |
| `OPACK_EXEC` | Package to execute |
| `OAF_MODEL` | Primary model configuration |
| `OAF_LC_MODEL` | Low-cost model configuration |

## Advanced Parameters

### Temperature

Control response randomness.

```bash
mini-a goal="task" temperature=0.7
```

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `temperature` | number | 0-2 | 1 | Higher = more creative, Lower = more deterministic |

### Top P

Nucleus sampling parameter.

```bash
mini-a goal="task" top_p=0.9
```

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `top_p` | number | 0-1 | 1 | Probability mass for token selection |

### Frequency Penalty

Reduce repetition.

```bash
mini-a goal="task" frequency_penalty=0.5
```

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `frequency_penalty` | number | -2 to 2 | 0 | Penalize frequent tokens |

### Presence Penalty

Encourage topic diversity.

```bash
mini-a goal="task" presence_penalty=0.5
```

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `presence_penalty` | number | -2 to 2 | 0 | Penalize tokens that appeared |

## Console Commands Reference

### Slash Commands

Available in the interactive console:

| Command | Description |
|---------|-------------|
| `/help` | Show help message |
| `/exit` | Exit the console |
| `/show` | Display all active parameters |
| `/show <prefix>` | Display parameters starting with prefix (e.g., `/show use`) |
| `/last` | Reprint previous final answer |
| `/last md` | Show previous answer in raw Markdown |
| `/save <path>` | Save last answer to file (supports tab completion) |
| `/compact [n]` | Condense older conversation, keep last n exchanges (default: 5) |
| `/summarize [n]` | Summarize conversation, keep last n exchanges (default: 3) |

### Tab Completion

- **File paths**: Press `Tab` to autocomplete paths in commands like `/save`
- **Commands**: Press `Tab` to see available slash commands

## Configuration Files

### YAML Configuration

Create a configuration file:

```yaml
# mini-a-config.yaml
goal: "Your task"
useshell: true
chatbotmode: false
mcp:
  cmd: "ojob mcps/mcp-time.yaml"
  timeout: 5000
maxcontext: 100000
maxtokens: 4096
```

Use it:
```bash
ojob mini-a/mini-a.yaml mini-a-config.yaml
```

### Environment File

Create a `.env` file:

```bash
# .env
OAF_MODEL=(type: openai, model: gpt-4o-mini, key: 'sk-...')
OAF_LC_MODEL=(type: openai, model: gpt-4o-mini, key: 'sk-...')
```

Source it:
```bash
source .env
mini-a goal="task"
```

## Parameter Precedence

When parameters are specified in multiple places:

1. **Command-line arguments** (highest priority)
2. **Environment variables**
3. **Configuration files**
4. **Default values** (lowest priority)

Example:
```bash
export OAF_MODEL="(type: openai, ...)"  # Priority 2
mini-a goal="task" model="(type: google, ...)"  # Priority 1 (overrides)
```

## Best Practices

### Security

- Never commit API keys to version control
- Use environment variables or model manager for keys
- Enable shell access only when needed
- Run in Docker for isolation

### Performance

- Use dual-model setup for cost optimization
- Enable MCP proxy for multiple servers
- Use `/compact` or `/summarize` for long sessions
- Adjust `maxcontext` based on your needs

### Reliability

- Set appropriate timeouts for your tasks
- Monitor token usage with `showstats=true`
- Use debug mode for troubleshooting
- Log to file for production use

---

## Quick Reference Card

Common parameter combinations:

**Simple task:**
```bash
mini-a goal="task"
```

**With shell:**
```bash
mini-a goal="task" useshell=true
```

**With MCP:**
```bash
mini-a goal="task" mcp="(cmd: 'ojob server.yaml')"
```

**Chatbot:**
```bash
mini-a goal="topic" chatbotmode=true
```

**Cost-optimized:**
```bash
export OAF_MODEL="(type: openai, model: gpt-4o, key: '...')"
export OAF_LC_MODEL="(type: openai, model: gpt-4o-mini, key: '...')"
mini-a goal="complex task"
```

**Full-featured:**
```bash
mini-a goal="complex task" \
  useshell=true \
  chatbotmode=true \
  mcpproxy=true \
  mcp="[(cmd: 'server1'), (cmd: 'server2')]" \
  useutils=true \
  useplanning=true \
  debug=true
```

---

## Next Steps

- [**Getting Started**]({{ '/getting-started.html' | relative_url }}) - Installation and setup
- [**Examples**]({{ '/examples.html' | relative_url }}) - Practical examples
- [**Advanced Usage**]({{ '/advanced.html' | relative_url }}) - Power user features
- [**GitHub Repository**](https://github.com/OpenAF/mini-a) - Full documentation

## Additional Resources

- [USAGE.md](https://github.com/OpenAF/mini-a/blob/main/USAGE.md) - Comprehensive usage guide
- [CHEATSHEET.md](https://github.com/OpenAF/mini-a/blob/main/CHEATSHEET.md) - Quick reference
- [GitHub Issues](https://github.com/OpenAF/mini-a/issues) - Get help and report bugs
