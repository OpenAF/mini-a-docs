---
layout: page
title: Getting Started
permalink: /getting-started/
---

Get up and running with mini-a in just a few minutes.

## Prerequisites

Before installing mini-a, you need:

- **OpenAF**: Install from [openaf.io](https://openaf.io)
- **LLM API Key**: Get one from OpenAI, Google, Anthropic, or use a local model with Ollama

## Installation

### Step 1: Install OpenAF

Follow the instructions at [openaf.io](https://openaf.io) to install OpenAF for your platform.

### Step 2: Install mini-a Package

```bash
opack install mini-a
```

This will install mini-a and its dependencies.

### Step 3: Configure Your Model

You have two options for configuring your LLM model:

#### Option A: Environment Variable (Quick Start)

Set the `OAF_MODEL` environment variable:

```bash
export OAF_MODEL="(type: openai, model: gpt-5.1, key: 'sk-...', timeout: 900000, temperature: 1)"
```

**Supported model types:**
- `openai` - OpenAI models (GPT-4, gpt-5.1, etc.)
- `openai-compatible` - OpenAI-compatible APIs
- `google` - Google Gemini models
- `anthropic` - Anthropic Claude models
- `bedrock` - AWS Bedrock models
- `ollama` - Local Ollama models
- `github` - GitHub Models

#### Option B: Model Manager (Recommended)

Use the built-in model manager to store encrypted model definitions:

```bash
mini-a modelman=true
```

The model manager provides an interactive interface to:
- Create and store model configurations
- Import/export definitions
- Switch between models easily
- Keep API keys encrypted

## First Run

### Console Mode

Start the interactive console:

```bash
opack exec mini-a
```

Or if you set up the alias during installation:

```bash
mini-a
```

At the prompt, type your goal:

```
> list all JavaScript files in this directory
```

⚠️ **Important**: Shell access is disabled by default for safety. To enable it, use:

```bash
mini-a useshell=true
```

### Direct Goal Execution

You can also pass goals directly:

```bash
mini-a goal="what time is it in Sydney?" mcp="(cmd: 'ojob mcps/mcp-time.yaml', timeout: 5000)"
```

### Web Interface

For a browser-based UI:

```bash
./mini-a-web.sh onport=8888
```

Then open `http://localhost:8888` in your browser.

💡 *Suggestion: Add asciinema recording of first console session here*

## Docker Quick Start

Run mini-a in a Docker container:

### CLI Console

```bash
docker run --rm -ti \
  -e OPACKS=mini-a -e OPACK_EXEC=mini-a \
  -e OAF_MODEL="(type: openai, model: gpt-5.1, key: '...', timeout: 900000)" \
  openaf/oaf:edge
```

### Web Interface

```bash
docker run -d --rm \
  -e OPACKS=mini-a -e OPACK_EXEC=mini-a \
  -e OAF_MODEL="(type: openai, model: gpt-5.1, key: '...', timeout: 900000)" \
  -p 12345:12345 \
  openaf/oaf:edge onport=12345
```

## Basic Commands

Once in the console, you can use these slash commands:

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/show` | Display all active parameters |
| `/show use` | Show parameters starting with "use" |
| `/last` | Reprint previous final answer |
| `/last md` | Show previous answer in raw Markdown |
| `/save <path>` | Save last answer to file (supports tab completion) |
| `/compact [n]` | Condense older conversation while keeping recent n exchanges |
| `/summarize [n]` | Create summary of conversation while keeping recent n exchanges |
| `/exit` | Exit the console |

## Including Files in Goals

You can include file contents in your goals using the `@` syntax:

```bash
mini-a goal="Follow these instructions @docs/guide.md"
```

This is useful for providing context or instructions from files.

## Next Steps

Now that you have mini-a installed and running, explore:

- [**Features**]({{ '/features.html' | relative_url }}) - Learn about all capabilities
- [**Examples**]({{ '/examples.html' | relative_url }}) - See practical use cases
- [**Advanced Usage**]({{ '/advanced.html' | relative_url }}) - Dual models, MCP integration, and more
- [**Configuration**]({{ '/configuration.html' | relative_url }}) - Detailed parameter reference

## Getting Help

- **In-console help**: Run `mini-a -h` or `mini-a --help`
- **GitHub Issues**: [OpenAF/mini-a/issues](https://github.com/OpenAF/mini-a/issues)
- **Documentation**: [Full USAGE.md](https://github.com/OpenAF/mini-a/blob/main/USAGE.md)

## Common Issues

### "Model not configured"

Make sure you've set the `OAF_MODEL` environment variable or used the model manager.

### "Command not found: mini-a"

Use the full command: `opack exec mini-a` or set up the alias as shown during installation.

### Shell commands not working

Shell access is disabled by default. Add `useshell=true` to enable it.
