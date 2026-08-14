---
layout: page
title: Agent Plugins
permalink: /agent-plugins/
---

# Agent Plugins

Mini-A can consume [Agent Plugins](https://agent-plugins.org) 1.0.0: a portable directory format that packages skills and MCP servers together. Mini-A treats a loaded plugin as additional skill roots and ordinary MCP connections, so there is no separate plugin runtime to learn.

## Plugin layout

Each plugin has a required `plugin.json` manifest and may include `skills/` and `mcp.json`:

```
my-plugin/
├── plugin.json
├── skills/
│   └── my-skill/
│       └── SKILL.md
└── mcp.json
```

`plugin.json` must include the 1.0 schema URL and a plugin name:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "my-plugin",
  "version": "1.0.0"
}
```

## Loading plugins

Use explicit directories with `plugins=`, or point Mini-A at a root that contains one level of plugin directories:

```bash
# Load named plugin directories
mini-a goal="use the available plugin skills" \
  plugins="~/plugins/reports,~/plugins/issue-tracker"

# Discover every plugin directly under this root
mini-a goal="summarize this repository" pluginsroot=~/team-plugins
```

`pluginsroots=` accepts additional comma-separated roots. Without an explicit root, Mini-A discovers plugins in `~/.openaf-mini-a/plugins` (adjusted by `homedir=`).

Plugins compose with `extraskills` and `mcp=`. Their skill directories load after built-in and extra skill directories, so a plugin cannot shadow an existing skill name.

## MCP servers

An optional `mcp.json` declares named servers. Mini-A supports `stdio`, `streamable-http`, and deprecated `sse` transports.

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "my-server": {
      "type": "stdio",
      "command": "./server.sh",
      "args": ["${PLUGIN_ROOT}/data"],
      "env": { "MODE": "prod" },
      "cwd": "${PLUGIN_DATA}"
    }
  }
}
```

For every plugin stdio server, Mini-A sets `PLUGIN_ROOT` (the canonical plugin directory) and `PLUGIN_DATA` (a managed persistent directory at `~/.openaf-mini-a/plugin-data/<plugin-name>/`). Only these placeholders are expanded in arguments, environment values, and `cwd`. A working directory must stay within one of these boundaries; `./` paths are plugin-root-relative. Commands must be a bare executable name or a `./`-relative executable, with arguments declared separately.

Remote plugin servers must use HTTPS, except for `localhost` HTTP. At present, only an `Authorization: Bearer <token>` header is passed through; other custom headers are dropped with a warning.

## Compatibility and failures

Full stdio `cwd` and environment support requires an OpenAF runtime with native MCP `pwd`/`envs` support. Older runtimes still launch servers, but ignore those two settings.

Mini-A isolates plugin failures: an invalid manifest skips only that plugin; an invalid `mcp.json` leaves its skills usable; and an invalid server entry skips only that server. Warnings are logged so a broken extension does not prevent the rest of the agent configuration from starting.
