---
layout: page
title: Cheatsheet
permalink: /cheatsheet/
---

Quick reference for mini-a. Bookmark this page.
{: .cheatsheet}

## Installation

```bash
opack install mini-a
```

## Alias (Optional)

```bash
# Zsh
echo 'alias mini-a="opack exec mini-a"' >> ~/.zshrc && . ~/.zshrc
```

If alias setup is not available, run commands as `opack exec mini-a [...]`.

## Model Setup

| Provider | Config |
|----------|--------|
| OpenAI | `export OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')"` |
| Google | `export OAF_MODEL="(type: gemini, model: gemini-2.0-flash, key: '...')"` |
| Anthropic | `export OAF_MODEL="(type: anthropic, model: claude-sonnet-4-20250514, key: '...')"` |
| Ollama | `export OAF_MODEL="(type: ollama, model: 'llama3', url: 'http://localhost:11434')"` |
| Bedrock | `export OAF_MODEL="(type: bedrock, options: (region: eu-west-1, model: 'anthropic.claude-sonnet-4-20250514-v1:0'))"` |
| GitHub | `export OAF_MODEL="(type: openai, url: 'https://models.github.ai/inference', model: openai/gpt-5, key: $(gh auth token), apiVersion: '')"` |

## Running mini-a

| Command | Description |
|---------|-------------|
| `mini-a` | Interactive console |
| `mini-a goal='...'` | Direct goal |
| `mini-a onport=8080` | Web UI |
| `mini-a chatbotmode=true` | Chatbot mode |
| `mini-a modelman=true` | Model manager |

## Console Commands

| Command | Action |
|---------|--------|
| `/help` | Show commands |
| `/model` | Current model info |
| `/compact` | Compact context |
| `/summarize` | Summarize conversation |
| `/reset` | Reset conversation |
| `/save` | Save conversation |
| `/load` | Load conversation |
| `/metrics` | Usage statistics |
| `/exit` | Exit mini-a |
| `/clear` | Clear screen |

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `goal` | - | The task to accomplish |
| `useshell` | `false` | Enable shell commands |
| `readwrite` | `false` | Allow file writes |
| `chatbotmode` | `false` | Chat-only mode |
| `maxsteps` | `50` | Max agent steps |
| `maxcontext` | - | Max context tokens |
| `maxtokens` | - | Max output tokens |
| `useplanning` | `false` | Enable planning |
| `useutils` | `true` | Built-in utilities |
| `useskills` | `false` | Expose skill operations in Mini Utils Tool (requires `useutils=true`) |
| `usetools` | `true` | Enable tool use |
| `usestream` | `true` | Stream responses |
| `mcp` | - | MCP servers to load |
| `mcpproxy` | `false` | MCP proxy mode |
| `usedelegation` | `false` | Agent delegation |
| `onport` | - | Web UI port |

## File Inclusion

```bash
mini-a useutils=true goal='@file.txt Summarize this file'
mini-a useutils=true goal='@data.csv Analyze it'
```

## Custom Commands, Skills, Hooks

| Item | Path/Command |
|------|--------------|
| Custom slash template | `~/.openaf-mini-a/commands/<name>.md` |
| Skill (folder) | `~/.openaf-mini-a/skills/<name>/SKILL.md` |
| Skill (file) | `~/.openaf-mini-a/skills/<name>.md` |
| Hooks | `~/.openaf-mini-a/hooks/*.yaml` |
| Run one template | `mini-a exec="/<name> arg1 arg2"` |
| List skills | `/skills` |

## Mode Presets

| Mode | Enables |
|------|---------|
| `shell` | Shell access |
| `chatbot` | Chat-only, no tools |
| `internet` | Web browsing |
| `poweruser` | Shell + utils + tools |
| `readwrite` | File read/write |
| `readonly` | Read-only access |

## Dual-Model Setup

```bash
export OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')"
export OAF_LC_MODEL="(type: openai, model: gpt-5-mini, key: '...')"
# Saves 50-70% on token costs
```

## Docker

```bash
# Interactive
docker run -it -e OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')" openaf/mini-a
# Web UI
docker run -p 8080:8080 -e OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')" openaf/mini-a onport=8080
```

## Common MCP Servers

| Server | Tools | Example |
|--------|-------|---------|
| `mcp-time` | Current time, timezone conversion | `mcp="(cmd: 'ojob mcps/mcp-time.yaml')"` |
| `mcp-db` | SQL queries, schema inspection | `mcp="(cmd: 'ojob mcps/mcp-db.yaml')"` |
| `mcp-web` | Web search, fetch pages | `mcp="(cmd: 'ojob mcps/mcp-web.yaml')"` |
| `mcp-file` | File operations | `mcp="(cmd: 'ojob mcps/mcp-file.yaml')"` |
| `mcp-shell` | Shell command execution | `mcp="(cmd: 'ojob mcps/mcp-shell.yaml')"` |
