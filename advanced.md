---
layout: page
title: Advanced
permalink: /advanced/
---

This page covers advanced configuration and power-user features for mini-a. If you are new to mini-a, start with the [Getting Started]({{ '/getting-started' | relative_url }}) guide first.

---

## Dual-Model Setup

mini-a supports a dual-model architecture that lets you pair a powerful reasoning model with a lighter, faster model. The main model (`OAF_MODEL`) handles complex tasks such as multi-step reasoning, code generation, and nuanced decision-making. The lighter model (`OAF_LC_MODEL`) handles simpler internal tasks like routing decisions, summarization, planning decomposition, and tool-call formatting.

**Full configuration:**

```bash
export OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')"
export OAF_LC_MODEL="(type: openai, model: gpt-5-mini, key: '...')"
```

### When each model is used

| Task type | Model used |
|-----------|-----------|
| Goal reasoning and execution | Main model (`OAF_MODEL`) |
| Plan generation and decomposition | Light model (`OAF_LC_MODEL`) |
| Routing and classification | Light model (`OAF_LC_MODEL`) |
| Context summarization | Light model (`OAF_LC_MODEL`) |
| Tool call formatting | Light model (`OAF_LC_MODEL`) |
| Complex code generation | Main model (`OAF_MODEL`) |
| Final answer synthesis | Main model (`OAF_MODEL`) |

### Benefits

- **50-70% cost reduction** compared to using the main model for all tasks, with similar overall quality.
- **Lower latency** on routing and planning steps since the lighter model responds faster.
- **Mix providers freely.** You can use different providers for each model. For example, use Anthropic for reasoning and OpenAI for lightweight tasks:

  ```bash
  export OAF_MODEL="(type: anthropic, model: claude-sonnet-4-20250514, key: '...')"
  export OAF_LC_MODEL="(type: openai, model: gpt-5-mini, key: '...')"
  ```

When the light model is not set, mini-a uses the main model for everything. Setting the light model is optional but recommended for cost-sensitive workloads.

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S14 — Debug output showing model escalation]</div>

---

## MCP Advanced

mini-a's MCP (Model Context Protocol) support goes well beyond basic server connections. These advanced options give you fine-grained control over how MCP servers are loaded, aggregated, and accessed.

### Proxy Mode

When connecting to multiple MCP servers, each connection adds overhead. Enable proxy mode to aggregate all MCP servers behind a single proxy endpoint:

```bash
mini-a mcpproxy=true mcp="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-web.yaml'), (cmd: 'ojob mcps/mcp-db.yaml jdbc=jdbc:h2:./data user=sa pass=sa')]"
```

The proxy consolidates tool listings from all servers into a single interface. This reduces the number of active connections and simplifies tool discovery for the agent.

### Custom MCP Servers

Point mini-a to custom STDIO-based MCP servers by providing the full path to the server executable:

```bash
mini-a mcp="(cmd: '/path/to/my-custom-mcp-server')"
```

You can also point to multiple custom servers by passing an array of MCP descriptors.

### Remote HTTP MCPs

Connect to MCP servers running on remote machines over HTTP or SSE:

```bash
mini-a mcp="(type: remote, url: 'http://remote-server:3000/mcp')"
```

This is useful for centralized tool servers shared across teams, or for connecting to MCP servers running in cloud environments. Multiple remote endpoints can be combined:

```bash
mini-a mcp="[(type: remote, url: 'http://tools1:3000/mcp'), (type: remote, url: 'http://tools2:3001/mcp')]"
```

### Dynamic MCPs

Enable dynamic MCP discovery to let the agent find and load MCP servers at runtime based on the task at hand:

```bash
mini-a mcpdynamic=true
```

When enabled, mini-a inspects the available MCP registry and loads servers that match the tools needed for the current goal. This avoids loading unnecessary servers upfront.

### Lazy Loading

By default, all specified MCP servers are connected at startup. Enable lazy loading to defer connections until a tool from that server is actually needed:

```bash
mini-a mcplazy=true
```

This reduces startup time and memory usage, especially when specifying many MCP servers but only using a few per session.

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S15 — MCP proxy aggregation diagram]</div>

---

## Custom Commands, Skills, Hooks

Based on upstream mini-a behavior, customization is file-based and loaded from your home profile.

### Slash Command Templates

Create markdown templates in `~/.openaf-mini-a/commands/`:

```text
~/.openaf-mini-a/commands/<name>.md
```

Load additional command directories:

```bash
mini-a extracommands=/path/to/team-commands,/path/to/project-commands
```

Run in console:

```bash
/<name> arg1 arg2
```

Run non-interactively:

```bash
mini-a exec="/<name> arg1 arg2"
```

Template placeholders:

- `{{args}}` -> raw argument string after the command name (trimmed)
- `{{argv}}` -> parsed arguments as a JSON array
- `{{argc}}` -> parsed argument count
- `{{arg1}}`, `{{arg2}}`, ... -> positional argument values (1-based)

Example:

```markdown
~/.openaf-mini-a/commands/review.md

Review target: {{arg1}}
Flags/raw: {{args}}
Parsed: {{argv}}
```

```bash
/review src --quick "security only"
```

```text
Review target: src
Flags/raw: src --quick "security only"
Parsed: ["src","--quick","security only"]
```

### Skills

Supported skill layouts in `~/.openaf-mini-a/skills/`:

- `~/.openaf-mini-a/skills/<name>/SKILL.md`
- `~/.openaf-mini-a/skills/<name>.md`

Skills can be invoked as `/<name> ...args...` or `$<name> ...args...`.

Load additional skill directories:

```bash
mini-a extraskills=/path/to/shared-skills,/path/to/project-skills
```

### Hooks

Hook definitions are loaded from `~/.openaf-mini-a/hooks/*.yaml`, `*.yml`, `*.json`.

Load additional hook directories:

```bash
mini-a extrahooks=/path/to/team-hooks,/path/to/project-hooks
```

Example:

```yaml
event: before_shell
command: "echo \"$MINI_A_SHELL_COMMAND\" | grep -E '(rm -rf|mkfs|dd if=)' >/dev/null && exit 1 || exit 0"
timeout: 1500
failBlocks: true
```

Supported events: `before_goal`, `after_goal`, `before_tool`, `after_tool`, `before_shell`, `after_shell`.

References:
- [mini-a `USAGE.md`](https://github.com/OpenAF/mini-a/blob/main/USAGE.md)
- [mini-a `mini-a.yaml`](https://github.com/OpenAF/mini-a/blob/main/mini-a.yaml)

---

## Performance Tuning

Optimizing mini-a for speed, cost, and reliability across long-running or high-volume sessions.

### Context Management

The `maxcontext` parameter limits the context window size (in tokens). When the conversation exceeds this limit, mini-a automatically compacts the context by summarizing earlier turns:

```bash
mini-a maxcontext=40000
```

Auto-compaction preserves the most recent and most relevant context while discarding redundant information.

### Token Optimization

mini-a applies automatic prompt optimization to reduce token usage without losing meaning. Responses from previous turns are cached internally to avoid redundant LLM calls when the same information is referenced again.

### Manual Context Control

In interactive console mode, two commands give you direct control over context size:

- **`/compact [n]`** — Immediately reduces the conversation context by summarizing and removing older turns while keeping up to the latest `n` exchanges (default 6). Use this when you notice the model slowing down or losing track of earlier instructions.
- **`/summarize [n]`** — Creates a structured summary of the entire conversation so far, replaces older history with that summary, and keeps up to the latest `n` exchanges (default 6). This is more aggressive than `/compact` and is useful for very long sessions.

### Response Length

Limit the maximum response length with `maxtokens`:

```bash
mini-a maxtokens=2048
```

This prevents the model from generating excessively long responses, saving both time and cost.

---

## Advanced Shell

mini-a's shell integration includes security controls that let you precisely define what the agent can and cannot execute.

### Command Allowlists

Restrict the agent to a specific set of commands. Only the listed commands will be permitted:

```bash
mini-a useshell=true shellallow='git,npm,docker'
```

Any attempt to run a command not on the allowlist will be blocked.

### Command Ban Lists

Alternatively, block specific dangerous commands while allowing everything else:

```bash
mini-a useshell=true shellban='rm,sudo,shutdown,reboot'
```

Allowlists and ban lists give you layered control over shell safety.

### Docker Isolation

For maximum safety, run shell commands inside a Docker container. This isolates the agent's shell access from your host system entirely:

```bash
docker run --rm -e OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')" -v $(pwd):/work openaf/mini-a useshell=true goal='Analyze the project in /work'
```

The agent can execute commands freely inside the container without risk to your host filesystem or system.

### Read-Only Mode

By default, `readwrite=false` prevents the agent from modifying files on disk. This is the safe default for exploratory and analytical tasks:

```bash
mini-a readwrite=false useshell=true
```

Set `readwrite=true` only when you explicitly want the agent to create or modify files.

### OS Sandboxing

mini-a includes built-in OS-level sandboxing via `usesandbox`. Use this when you want the agent's shell commands to run inside a restricted OS environment without setting up a container runtime. For custom runtimes (Docker, Podman, firejail, custom wrappers), use `shell=` instead.

#### Built-in presets

| Value | Behavior |
|-------|----------|
| `auto` | Detects host OS and applies the default preset for that platform. |
| `linux` | Uses `bwrap` (bubblewrap). Host filesystem is read-only; private temp/home area; `readwrite=true` widens writes to the current working directory and temp paths only; `sandboxnonetwork=true` adds `--unshare-net`. |
| `macos` | Uses `sandbox-exec`. If `sandboxprofile` is omitted, mini-a auto-generates a restrictive profile with read access to the host, private temp/home writes, optional current-directory writes via `readwrite=true`, and network blocked when `sandboxnonetwork=true`. |
| `windows` | Best-effort PowerShell wrapper with `ConstrainedLanguage` mode, isolated temp/home paths, and a narrowed environment. `sandboxnonetwork=true` applies proxy/environment blocking. Does not provide Linux-equivalent filesystem or guaranteed network isolation — combine with WDAC/AppContainer for stronger policy. |

If the selected backend is unavailable (e.g. `bwrap` or `sandbox-exec` is missing), mini-a warns and continues without sandboxing.

#### macOS (sandbox-exec)

- **Use the built-in restriction flags** when you only need to block specific binaries (combine `shellallow`, `shellbanextra`, `shellallowpipes`, `checkall=true`).
- **Use `usesandbox=macos`** when you want mini-a to generate a restrictive host sandbox automatically.
- **Use `shell=`** when you want a custom `.sb` profile or a stronger container boundary.
- `readwrite=true` widens writes to the current working directory and temp paths only.
- `sandboxnonetwork=true` removes network access from the generated profile.

```bash
mini-a goal="catalog ~/Projects" useshell=true usesandbox=macos
```

#### Linux (bubblewrap)

- **Use `usesandbox=linux`** when `bwrap` is installed and you want read-only host access with a private temp/home area.
- **Use `shell=`** when you need a containerized runtime, custom namespace/network policy, or a guaranteed writable environment beyond `readwrite=true`.
- `readwrite=true` adds writes to the current working directory and temp paths only.
- `sandboxnonetwork=true` adds `--unshare-net`.

#### Windows (best-effort PowerShell)

- **Use `usesandbox=windows`** for safer defaults around temp/home isolation without extra tooling.
- **Use `shell=` or platform tooling** (WDAC, AppContainer, Windows Sandbox) when you need enforceable OS policy.
- `sandboxnonetwork=true` is best-effort only via proxy/environment blocking.

#### macOS Sequoia (container CLI)

On macOS 15+, you can run mini-a inside an Apple `container`-managed environment via `shell=`:

```bash
container run --detach --name mini-a --image docker.io/library/ubuntu:24.04 sleep infinity
mini-a goal="inspect /work" useshell=true shell="container exec mini-a"
```

#### Docker and Podman via `shell=`

Run every shell command inside a long-lived container by setting `shell=` to the exec command:

```bash
# Docker
docker run -d --rm --name mini-a-sandbox -v "$PWD":/work -w /work ubuntu:24.04 sleep infinity
mini-a goal="summarize git status" useshell=true shell="docker exec mini-a-sandbox"

# Podman (rootless)
podman run -d --rm --name mini-a-sandbox -v "$PWD":/work -w /work docker.io/library/fedora:latest sleep infinity
mini-a goal="list source files" useshell=true shell="podman exec mini-a-sandbox"
```

#### Hook alternatives (recommended for strict policy)

- Use `before_shell` hooks to deny commands by path, arguments, time window, or user context.
- Use `after_shell` hooks to audit output, redact sensitive data, and trigger alerts.
- Combine hooks with `usesandbox` or `shell=` so both policy checks and OS-level sandboxing are active.

> **Tip:** `shellallow`, `shellbanextra`, `shellallowpipes`, `checkall`, and `before_shell`/`after_shell` hooks are separate policy layers that remain active even when `usesandbox` or `shell=` is set.

---

## Library Integration

mini-a can be used programmatically from JavaScript code and integrated into OpenAF automation workflows.

### JavaScript API

Call mini-a directly from OpenAF JavaScript code using the `$mini_a` function:

```javascript
var result = $mini_a({
  goal: "Analyze this data",
  model: "(type: openai, model: gpt-5.2, key: '...')",
  useshell: false
});
print(result.output);
```

The returned object contains the agent's output, usage metrics, and execution metadata. This is useful for embedding mini-a into larger applications or scripts.

### oJob Workflow Integration

Integrate mini-a into oJob pipelines for automated, multi-step workflows:

```yaml
jobs:
  - name: AI Analysis
    exec: |
      var r = $mini_a({ goal: args.task, model: args.model });
      return { result: r.output };
```

This lets you chain mini-a calls with other oJob steps, pass arguments dynamically, and capture results for downstream processing.

---

## Planning Workflows

mini-a can generate and follow structured plans before executing tasks, improving reliability for complex multi-step goals.

### Enabling Planning

```bash
mini-a useplanning=true
```

When planning is enabled, mini-a first creates a plan of action, then executes each step sequentially, tracking progress along the way.

### Plan Styles

The `planstyle` parameter controls how plans are generated:

| Style | Behavior |
|-------|----------|
| `simple` | Flat sequential plan steps. The agent creates numbered steps upfront and executes them in order. This is the default. |
| `legacy` | Phase-based hierarchical planning. The agent groups steps into phases before executing. |

```bash
mini-a useplanning=true planstyle=legacy
```

### Saving Plans

Save generated plans to a file for review or reuse:

```bash
mini-a useplanning=true planfile=my-plan.yaml
```

### Chain-of-Thought Reasoning

Enable explicit chain-of-thought reasoning to make the agent's thinking process visible:

```bash
mini-a usethinking=true
```

This is especially useful for debugging complex goals or understanding why the agent chose a particular approach.

---

## Custom Tools

Extend mini-a with custom tools defined in JavaScript or YAML. Custom tools let the agent call your own functions during execution.

### JavaScript Tool Definition

```javascript
// Custom tool definition
var myTool = {
  name: "calculate_discount",
  description: "Calculate discount price",
  parameters: {
    price: { type: "number", description: "Original price" },
    percent: { type: "number", description: "Discount percentage" }
  },
  fn: function(args) {
    return args.price * (1 - args.percent / 100);
  }
};
```

Register tools by passing them in the configuration. The agent will automatically discover and use them when they match the current task. Each tool needs a `name`, a `description` (used by the LLM to decide when to call it), `parameters` (schema for inputs), and an `fn` (the implementation).

---

## Delegation

mini-a supports delegating work to child agents for parallel execution and distributed workloads.

### Local Child Agents

Enable delegation to let mini-a spawn sub-agents that work on parts of a goal in parallel:

```bash
mini-a usedelegation=true
```

The parent agent decomposes the goal, assigns sub-tasks to child agents, and aggregates their results.

### Starting a Worker

Start a headless worker that accepts delegated tasks over HTTP:

```bash
mini-a workermode=true onport=8080 apitoken=your-secret-token workername="research-east" workerdesc="US-East research worker"
```

The worker exposes a REST API. Key endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /info` | Server capabilities |
| `POST /task` | Submit a new task |
| `POST /status` | Poll task status |
| `POST /result` | Retrieve final result |
| `POST /cancel` | Cancel a running task |
| `GET /healthz` | Health check |
| `GET /metrics` | Task and delegation metrics |

Submit a task directly via HTTP:

```bash
curl -X POST http://localhost:8080/task \
  -H "Authorization: Bearer your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"goal": "Analyze data and produce summary", "args": {"maxsteps": 10}, "timeout": 300}'

# Poll status
curl -X POST http://localhost:8080/status \
  -H "Authorization: Bearer your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "..."}'

# Get result
curl -X POST http://localhost:8080/result \
  -H "Authorization: Bearer your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "..."}'
```

Workers also support the A2A HTTP+JSON/REST transport (`/message:send`, `/tasks`, `/tasks:cancel`, `/.well-known/agent.json`). Enable it on the parent with `usea2a=true`:

```bash
mini-a usedelegation=true usea2a=true workers="http://localhost:8080" apitoken=your-secret-token goal="Coordinate parallel subtasks"
```

### Dynamic Worker Registration

Instead of a static `workers=` list, workers can self-register and send heartbeats to the parent:

```bash
# Parent: start registration server
mini-a usedelegation=true usetools=true \
  workerreg=12345 workerregtoken=secret workerevictionttl=90000

# Worker: self-register and heartbeat
mini-a workermode=true onport=8080 apitoken=secret \
  workerregurl="http://main-host:12345" \
  workerregtoken=secret workerreginterval=30000
```

Registration endpoints on the parent's `workerreg` port: `POST /worker-register`, `POST /worker-deregister`, `GET /worker-list`, `GET /healthz`. Workers that miss heartbeats are evicted after `workerevictionttl` milliseconds (default 60 000). This pattern also works with Kubernetes HPA: new pods register on startup and deregister on graceful shutdown.

### Remote Workers

Connect to worker APIs running on other machines for distributed execution:

```bash
mini-a usedelegation=true workers='http://worker1:8080,http://worker2:8080' apitoken=your-secret-token usetools=true goal="Coordinate parallel subtasks"
```

Remote workers run their own mini-a instances and accept task assignments from the parent agent. This scales mini-a horizontally across multiple machines.

### Concurrency Control

Limit the number of concurrent child agents or worker connections:

```bash
mini-a usedelegation=true maxconcurrent=5
```

Workers can also register themselves dynamically with the parent agent, enabling elastic scaling.

---

## Model Manager

The built-in model manager provides a TUI for managing model configurations and credentials.

### Launch the Model Manager

```bash
mini-a modelman=true
```

### Capabilities

- **Encrypted credential storage** — API keys and tokens are stored encrypted on disk, avoiding plaintext secrets in environment variables or shell history.
- **Multiple model profiles** — Define and switch between named profiles (e.g., "development" with a cheap model, "production" with a frontier model).
- **Import/export configurations** — Share model configurations across machines or team members.
- **Test model connectivity** — Verify that a model and API key combination works before using it in a session.

---

## Web Interface Advanced

mini-a's web interface supports additional configuration for production and team deployments.

### Authentication

mini-a's web interface does not include built-in authentication. Protect it by placing it behind a reverse proxy with authentication at that layer.

### Reverse Proxy Setup

Place mini-a behind a reverse proxy for TLS termination and additional security. Example nginx configuration:

```nginx
server {
    listen 443 ssl;
    server_name mini-a.example.com;

    ssl_certificate     /etc/ssl/certs/mini-a.crt;
    ssl_certificate_key /etc/ssl/private/mini-a.key;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support for streaming responses
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Custom Branding

The web interface supports custom branding options to match your organization's look and feel when deploying mini-a internally.

---

## Provider-Specific Guides

Configuration details and tips for specific LLM providers.

### AWS Bedrock

AWS Bedrock requires valid AWS credentials. mini-a reads credentials from environment variables or the standard AWS credentials file:

```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"
export OAF_MODEL="(type: bedrock, options: (region: eu-west-1, model: 'anthropic.claude-sonnet-4-20250514-v1:0'))"
```

Alternatively, configure credentials in `~/.aws/credentials` and set the region in `~/.aws/config`. Bedrock model names follow the provider's naming convention (e.g., `anthropic.claude-sonnet-4-20250514-v1:0`).

### GitHub Models

GitHub Models can use your GitHub personal access token directly in `OAF_MODEL`:

```bash
export OAF_MODEL="(type: openai, url: 'https://models.github.ai/inference', model: openai/gpt-5, key: $(gh auth token), apiVersion: '')"
```

Model names follow GitHub's model catalog naming. Check the GitHub Models marketplace for available models.

### Ollama

Ollama runs models locally with no API key required. Ensure the Ollama server is running before starting mini-a:

```bash
# Pull a model first
ollama pull llama3

# Start mini-a with the local model
export OAF_MODEL="(type: ollama, model: 'llama3', url: 'http://localhost:11434')"
mini-a
```

**Performance tips for Ollama:**

- Use quantized models (e.g., `llama3:8b-q4_0`) for faster inference on limited hardware.
- Ensure sufficient RAM for the model size. 8B parameter models typically need 8-16 GB of RAM.
- For GPU acceleration, verify that Ollama detects your GPU with `ollama ps`.
- Set the Ollama host if running on a different machine: `export OLLAMA_HOST=http://192.168.1.100:11434`

---

## Debugging

Tools and techniques for diagnosing issues with mini-a.

### Debug Mode

Enable verbose logging to see every decision the agent makes, including model calls, tool invocations, and internal routing:

```bash
mini-a debug=true
```

Debug output includes timestamps, model selection decisions, token counts, and the full request/response payloads for each LLM call.

To capture debug traffic in a structured, queryable store instead of the console, use the channel parameters:

```bash
# Write main-model LLM payloads to an MVS file, LC payloads to a JSON file
mini-a debugch="(type: mvs, file: debug.db, map: main)" \
       debuglcch="(type: file, file: lc-debug.json)" \
       goal='Summarize the project README'
```

See **[Channels]({{ '/channels' | relative_url }})** for full backend options and query examples.

### Usage Metrics

Use the `/stats` command in interactive mode to view real-time usage statistics:

```
/stats
```

This displays token counts, model call counts, cost estimates, and elapsed time for the current session.

### Common Debugging Patterns

- **Unexpected tool selection** — Enable `debug=true` and check the routing decisions. The light model may be misclassifying the task. Try adjusting the goal wording or switching to a more capable light model.
- **Slow responses** — Check `/stats` for token counts. If context is very large, use `/compact` to reduce it. Consider setting `maxcontext` to prevent unbounded growth.
- **MCP connection failures** — Verify the MCP server is running and reachable. Use `debug=true` to see connection attempts and error messages. For remote MCPs, check firewall rules and network connectivity.
- **Planning loops** — If the agent keeps replanning without executing, try switching `planstyle` from `legacy` to `simple` (the default). Phase-based planning can stall on ambiguous goals where a flat sequential plan works better.

---

## Next Steps

- **[Configuration]({{ '/configuration' | relative_url }})** — Full reference for all parameters and environment variables
- **[Cheatsheet]({{ '/cheatsheet' | relative_url }})** — Quick reference card for daily use
- **[Examples]({{ '/examples' | relative_url }})** — Practical examples and recipes
- **[Getting Started]({{ '/getting-started' | relative_url }})** — Installation and first steps
