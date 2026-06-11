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

### Model Strategy Modes

`modelstrategy` controls how Mini-A allocates work between the main model and the LC (low-cost) model when both `OAF_MODEL` and `OAF_LC_MODEL` are configured. All three modes require a dual-model setup; with only one model configured they behave identically.

| Mode | When to use |
|------|-------------|
| `default` | General-purpose work. Mini-A starts on the main model for the first step of complex goals, then switches to LC. Automatically escalates back to main when errors or stalled reasoning are detected. Best baseline — start here unless you have a specific reason to deviate. |
| `advisor` | Long or risky tasks where LC cost savings matter but you still want main-model judgment on hard calls. LC executes every step; the main model is consulted (not executed) only on risk signals, ambiguity, or hard-decision checkpoints. Use when you want to cap spend but cannot afford a wrong decision mid-task. |
| `delegate` | Batch / throughput scenarios where speed and cost matter more than best-first-step quality. LC executes all steps including step 0 (skips the `default` behavior of using main for the first step on complex goals). Escalation to main is still active when error/stall thresholds are hit. Use for repetitive, well-understood tasks. |

**Quick decision guide:**
- Single goal, unknown complexity → `default`
- High-stakes or irreversible actions, dual-model setup → `advisor` (add `harddecision=require` for critical deployments)
- Bulk/batch processing, cost is the primary concern → `delegate`
- Only one model configured → mode has no effect; `modellock` is the relevant knob instead

When `advisor` mode is active and the agent encounters a difficult step, it sends a structured query to the main model and receives back a JSON assessment with `recommended_next_step`, `risk_flags`, `escalate_to_main`, and `confidence` fields. The LC model then proceeds with that guidance. If `escalate_to_main` is true, the main model takes over for that step only.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `modelstrategy` | `default` | Model orchestration profile: `default` (adaptive LC-first with escalation), `advisor` (LC executor + main model as selective advisor), or `delegate` (LC executes all steps including step 0, escalation still active) |
| `advisormaxuses` | `2` | Maximum advisor consultations per run |
| `advisorcooldownsteps` | `2` | Minimum steps between consecutive consultations |

```bash
# default — adaptive escalation, good general-purpose starting point
mini-a goal="summarize this repository" useshell=true

# advisor — LC executes every step, main model consulted on hard decisions
mini-a goal="refactor the auth module" \
  modelstrategy=advisor useshell=true

# advisor — block execution until main model approves risky actions
mini-a goal="deploy to production" \
  modelstrategy=advisor harddecision=require useshell=true

# delegate — LC handles all steps (including step 0), use for batch / throughput
mini-a goal="process log files and extract errors" \
  modelstrategy=delegate useshell=true

# delegate — combine with lcbudget to cap total LC spend
mini-a goal="generate summaries for 50 documents" \
  modelstrategy=delegate lcbudget=100000
```

### Low-Cost Tool Calling (`usetoolslc`)

`usetoolslc=true` registers MCP tools natively on the low-cost model only, while the main model continues to use prompt/action-based tool guidance. Use this when you want the cheaper model to call tools directly during low-complexity steps without enabling native tool calling on the main model as well.

```bash
mini-a goal="scan docs and escalate if needed" \
  modellc="(type: openai, model: gpt-5-mini, key: '...')" \
  mcp="(cmd: 'ojob mcps/mcp-files.yaml')" \
  usetoolslc=true
```

This is distinct from `usetools=true`, which enables tool calling on whichever model is currently active (main or LC). With `usetoolslc`, only the LC model gets the native tool interface.

### System Prompt Profiles (`promptprofile`)

Control how verbose the system prompt is. A shorter prompt reduces token cost on every LLM call:

| Value | Description |
|-------|-------------|
| `minimal` | Shortest possible — drops examples and detailed guidance. Default in chatbot mode. |
| `balanced` | Balanced detail and token usage. Default for most sessions. |
| `verbose` | Full detail. Auto-enabled when `debug=true` outside chatbot mode. |

```bash
# Reduce per-call token overhead
mini-a promptprofile=minimal goal="..."
```

Set `systempromptbudget=<n>` to cap the estimated system prompt tokens. When exceeded, Mini-A drops lower-priority sections to stay under the limit:

```bash
mini-a systempromptbudget=4000 goal="..."
```

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

### Republishing MCPs with mcp-pass (gateway pattern)

While `mcpproxy=true` aggregates MCPs *inside* a running mini-a session, `mcp-pass` republishes one or more MCP servers as a single standalone MCP endpoint that any client (mini-a, Claude, IDEs, other agents) can consume. The downstream tools are forwarded directly — clients see them as native tools, not behind a dispatcher:

```bash
ojob mcps/mcp-pass.yaml onport=9091 uri=/mcp \
  mainmcp="(type: remote, url: 'http://internal-mcp:8080/mcp')" \
  othermcps="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-random.yaml')]" \
  useprefix="core-,time-,rand-" excludeTool="rand-pick"
```

Use `includeTool`/`excludeTool` to curate the exposed surface, `useprefix` to avoid name collisions, and `serverdesc` to override the advertised server identity.

### TOON tool results

Set the OpenAF runtime flag `MCPSERVER.answerInTOON` to make built-in MCP servers serialize tool results as TOON (Token-Oriented Object Notation) instead of JSON — a more token-efficient encoding for structured data:

```bash
OAF_FLAGS="(MCPSERVER: (answerInTOON: true))" ojob mcps/mcp-time.yaml onport=8888
```

Combined with `mcp-pass`, this turns a container into a drop-in gateway that converts existing MCPs' JSON output to TOON. See [Deploying MCP Servers in Docker & Kubernetes]({{ '/mcp-catalog' | relative_url }}#deploying-mcp-servers-in-docker--kubernetes) for Docker and Kubernetes recipes.

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S15 — MCP proxy aggregation diagram]</div>

---

## Custom Commands, Skills, Hooks

Based on upstream mini-a behavior, customization is file-based and loaded from your home profile. By default, Mini-A reads all configuration from `~/.openaf-mini-a`.

#### Overriding the Config Home (`homedir`)

Pass `homedir=<path>` to make Mini-A resolve its `.openaf-mini-a` folder relative to a different base directory. Every path that would normally expand from `~` uses the provided value instead — commands, skills, hooks, modes, agent profiles, history, and memory files all shift together.

```bash
# Use a shared team config directory
mini-a homedir=/opt/shared/mini-a-config goal="..."

# Per-project isolated config (checked into the repo)
mini-a homedir=./my-project-config goal="..."

# Container or CI environment where ~ is not writable
mini-a homedir=/app/mini-a-config goal="summarize the build logs" useshell=true
```

`extracommands`, `extraskills`, and `extrahooks` still work as additional directories layered on top of whichever base is active:

```bash
# Shared base + project-specific extra skills
mini-a homedir=/opt/shared/mini-a-config \
       extraskills=./project-skills \
       goal="..."
```

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

Supported skill layouts in `~/.openaf-mini-a/skills/`. When a folder contains multiple formats, precedence is:

1. `SKILL.yaml` (self-contained, recommended for portable skills)
2. `SKILL.yml`
3. `SKILL.json`
4. `SKILL.md`
5. `skill.md`

Single-file `~/.openaf-mini-a/skills/<name>.md` skills are also supported.

The YAML format bundles body, metadata, and embedded reference files into one portable file:

```yaml
schema: mini-a.skill/v1
name: my-skill
summary: Short description

body: |
  You are a specialized assistant for {{arg1}}.
  @context.md

refs:
  context.md: |
    Add context here.
```

Print a starter template: `mini-a --skills`

Folders ending in `.disabled` are ignored during skill discovery, which lets you keep a skill installed without exposing it.

Skills can be invoked as `/<name> ...args...` or `$<name> ...args...`.

**Automatic activation**: Mini-A automatically preloads skills whose names or phrases appear in the goal or hook context. If your goal mentions `"run review"` and a `review` skill is installed, it is loaded and its context is injected before the first step — no explicit invocation needed.

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

### Forked Sub-agents

A forked sub-agent inherits a snapshot of the parent's context instead of starting with a clean slate. This avoids re-doing research or re-establishing facts the parent has already gathered.

Use `fork=true` on the `delegate-subtask` tool call, or `/delegate fork <goal>` in the console:

```bash
# Via console
/delegate fork Write a summary of everything we have found so far

# Via tool call (LLM-driven)
# { "goal": "Summarize findings", "fork": true, "forkscope": ["memory", "context"] }
```

**`forkscope`** controls what is inherited:

| Value | What is passed to the child |
|-------|-----------------------------|
| `"memory"` (default) | Working memory snapshot (facts, decisions, evidence, etc.) |
| `"context"` | Last 50 conversation history entries |

Both can be combined: `forkscope: ["memory", "context"]`.

For remote workers the fork state is transmitted as JSON; `forkstatemaxbytes` (default 64 KB) caps the payload, dropping oldest history entries first if oversized.

```bash
# CLI startup task with fork
mini-a usedelegation=true subtasksfile=scouts.yaml goal="Security audit"
# scouts.yaml: [{goal: "Check for issues using existing findings", fork: true}]
```

### Auto-delegation (Noisy Tools)

Auto-delegation automatically intercepts tool results that are too large or verbose for the parent's context window, replacing the raw observation with a focused summary produced by a sub-agent.

Enable with `autodelegation=true` (also requires `usedelegation=true`):

```bash
# Summarize shell output larger than 8 KB automatically
mini-a usedelegation=true usetools=true useshell=true \
  autodelegation=true \
  goal="Run diagnostics on this server and report issues"

# Always summarize specific tools regardless of size
mini-a usedelegation=true usetools=true useshell=true \
  autodelegation=true noisytools=shell,web-search \
  goal="Research and report on cloud pricing"

# Lower threshold and raise per-step cap
mini-a usedelegation=true usetools=true \
  autodelegation=true autodelegationthreshold=2048 autodelegationmaxperstep=4 \
  goal="Process multiple large API responses"
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `autodelegation` | `false` | Master toggle (also requires `usedelegation=true`) |
| `autodelegationthreshold` | `8192` | Byte length that triggers auto-delegation |
| `autodelegationmaxperstep` | `2` | Cap on auto-delegations per agent step |
| `noisytools` | `""` | Comma-separated tool names always delegated regardless of size |

The summarization sub-agent is automatically forked (inherits working memory) when `usememory=true` and working memory is non-empty; otherwise it runs with a clean slate. Auto-delegation cannot cascade — child agents never trigger it.

### Pre-specified Startup Scouts

Register sub-agent goals at startup so they run in parallel with (or before) the main loop. Results are harvested into working memory as `artifacts`.

**Inline tasks** (pipe-separated):
```bash
mini-a usedelegation=true usetools=true useshell=true \
  subtasks="List all TODO comments in src/|Count lines of code|Find all test files" \
  goal="Give me a project health overview"
```

**Tasks from file** (`subtasksfile=`):
```yaml
# scouts.yaml
- goal: "Count open GitHub issues"
  timeout: 60
- goal: "Summarize recent git commits"
  fork: true
- goal: "Check if CI is passing"
  args:
    maxsteps: 3
```
```bash
mini-a usedelegation=true usetools=true \
  subtasksfile=scouts.yaml \
  goal="Give project status report"
```

**Sequential execution** (run scouts one at a time before the main loop):
```bash
mini-a usedelegation=true usetools=true \
  subtaskssequential=true \
  subtasks="Step 1: gather raw data|Step 2: validate data|Step 3: transform data" \
  goal="Run the ETL pipeline and report results"
```

### Console Commands

When delegation is enabled, these commands are available in the interactive console:

```bash
/delegate <goal>          # Delegate a sub-goal (fresh context)
/delegate fork <goal>     # Delegate a forked sub-goal (inherits parent memory + history)
/subtasks                 # List all subtasks (forked subtasks show a [fork] badge)
/subtask <id>             # Show subtask details
/subtask result <id>      # Show subtask result
/subtask cancel <id>      # Cancel a running subtask
/rewind                   # Undo last exchange and cancel any active subtasks
/rewind 3                 # Undo last 3 exchanges and cancel active subtasks
```

---

## Dreams (Sleep Pass)

The dream pass is an LLM-powered off-line consolidation step. Given the same memory channels and wiki settings used during a regular session, it reorganises what the agent learned: merging duplicates, marking superseded entries stale, surfacing new cross-cutting insights, and producing a lint-clean wiki — all without touching the live agent loop.

Think of it as REM sleep for your agent: the active session ends, then the dream pass reorganises what was retained.

### When to run a dream pass

- After a long or iterative session where the agent appended many memory entries — the pass compacts redundancy without losing information.
- When the wiki has accumulated near-duplicate pages, broken links, or missing front-matter.
- On a nightly cron schedule to keep a shared team wiki clean.

### Dream pass modes

| Mode | Triggered by | What happens |
|------|-------------|--------------|
| Memory dream | `memorych` arg is set | Loads global (and optionally session) memory, calls the LLM to consolidate, writes back |
| Wiki dream | `usewiki=true` | Spawns a full MiniA agent with `wikiaccess=rw` that lints and fixes the wiki |
| Combined | Both args set | Both modes run in sequence |

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `dream` | `false` | Run in standalone dream-pass mode |
| `dreammode` | - | Dream mode selector: `memory`, `wiki`, or `both` — controls which pass(es) run |
| `dryrun` | `false` | Preview what would change without writing anything back |
| `dreamwikimode` | `apply` | Wiki mode: `lint`, `plan`, `apply`, `reorg` |
| `dreammemorymode` | `apply` | Memory mode: `plan` or `apply` |
| `dreamwikiapply` | `false` | Required write gate for wiki apply/reorg |
| `dreamwikiapproval` | `ask` | Reorg approval mode: `auto`, `ask`, `never` |
| `dreamwikireorg` | `false` | Allow structural wiki reorg |
| `dreamreport` | - | Optional JSON output report path |
| `memorych` | - | SLON/JSON global memory channel definition (required for memory dream) |
| `memorysessionch` | - | SLON/JSON session memory channel |
| `memorysessionid` | - | Session namespace string — use the same value as `conversation=` during the goal |
| `auditch` | - | SLON/JSON audit channel — recent events are included as context |
| `maxauditrecords` | `200` | Maximum audit log entries included in the memory consolidation prompt |
| `usewiki` | `false` | Enable the wiki dream (requires `wikiroot`, `wikibucket`, or equivalent) |
| `model` | - | SLON/JSON model config used for the memory consolidation LLM call |
| `dreammaxsteps` | `60` | Maximum agent steps for the wiki dream pass |
| `libs` | - | Extra comma-separated libraries to load |

### Memory dream internals

1. Channels are opened using the provided SLON/JSON definitions.
2. Global memory (and optionally session memory) is loaded via `MiniAMemoryManager.loadFromChannel`.
3. If `auditch` is provided, the most recent `maxauditrecords` audit entries are loaded.
4. The LLM receives a system prompt describing the consolidation rules, the full memory snapshot, and the audit events.
5. Consolidation rules:
   - **MERGE** near-duplicate entries in the same section (keep the most informative value; preserve the earlier `createdAt`).
   - **MARK** superseded entries with `stale=true` and `supersededBy=<id-of-replacement>`.
   - **DROP** entries that are both `stale=true` and have a `supersededBy` that exists in the output.
   - **SURFACE** new cross-cutting insights as new `summaries` entries.
   - **PRESERVE** all IDs of retained entries unchanged; assign new 16-char hex IDs to new entries.
6. The consolidated snapshot is validated against the `MiniAMemoryManager` schema.
7. Unless `dryrun=true`, the pre-dream state is backed up to a sibling namespace (`<ns>::predream-<ISO-timestamp>`), then the consolidated snapshot is written back.

### Wiki dream internals

1. `usewiki=true` is required; `wikiaccess` is forced to `rw`.
2. `dreamwikimode=plan` and `dryrun=true` currently run the same no-write proposal path.
3. Use `dreamwikimode=plan` for explicit mode selection; use `dryrun=true` when you want the generic safety flag (it also affects memory dreams).
4. Proposal output includes `new_tree`, `move_table`, `indexes_to_create`, `indexes_to_update`, and lint before/after summaries.
5. `dreamwikimode=apply` only performs safe non-structural index work and requires `dreamwikiapply=true`.
6. `dreamwikimode=reorg` is structural, requires `dreamwikireorg=true`, `dreamwikiapply=true`, and `dreamwikiapproval=auto`.
7. A `MiniAWikiManager` exposes hierarchy-aware `tree`, `browse`, `backlinks`, `move`, and `lint()` operations.
8. A full `MiniA` agent is spawned (default `maxsteps=60`, controlled by `dreammaxsteps`) with the following goal:
   - Discover the hierarchy with `tree`/`browse`, search related content, inspect backlinks, and list lint issues.
   - Apply only high-confidence category moves with `move`; skip uncertain relocations.
   - Create missing section indexes and fix index links for local pages and child sections.
   - For each heading hierarchy violation: fix heading levels.
   - For orphan pages (excluding `index.md`, `AGENTS.md`, and `log.md`): add a link from `AGENTS.md` or the most related existing page.
   - Re-run lint and confirm zero errors and warnings remain.
9. The agent's final answer summarises `pages_moved`, `pages_changed`, `pages_deleted`, `indexes_created`, `issues_fixed`, and `skipped_uncertain_moves`.

### Standalone usage (`mini-a dream=true`)

```bash
# Memory dream — dry-run preview (no writes)
mini-a dream=true dryrun=true \
  memorych='(name: mini_a_global_mem, type: file, options: (file: /tmp/mini-a-memory.json))' \
  model='(type: anthropic, model: claude-sonnet-4-6)'

# Full memory dream (writes back)
mini-a dream=true \
  memorych='(name: mini_a_global_mem, type: file, options: (file: /tmp/mini-a-memory.json))' \
  auditch='(name: mini_a_audit, type: file, options: (file: /tmp/mini-a-audit.log))' \
  model='(type: anthropic, model: claude-sonnet-4-6)'

# Session memory dream
mini-a dream=true \
  memorych='(name: mini_a_global_mem, type: file, options: (file: /tmp/mini-a-memory.json))' \
  memorysessionch='(name: mini_a_session_mem, type: file, options: (file: /tmp/mini-a-session.json))' \
  memorysessionid='research-2026' \
  model='(type: anthropic, model: claude-sonnet-4-6)'

# Wiki dream
mini-a dream=true \
  usewiki=true wikiroot=/shared/wiki \
  model='(type: anthropic, model: claude-sonnet-4-6)'

# Non-interactive nightly proposal (no writes) + JSON report
mini-a dream=true \
  usewiki=true wikiroot=/shared/wiki \
  dreamwikimode=plan \
  dreamreport=/var/log/mini-a/dream-wiki-plan.json \
  model='(type: anthropic, model: claude-sonnet-4-6)'

# Non-interactive safe apply + JSON report
mini-a dream=true \
  usewiki=true wikiroot=/shared/wiki \
  dreamwikimode=apply dreamwikiapply=true \
  dreamreport=/var/log/mini-a/dream-wiki-apply.json \
  model='(type: anthropic, model: claude-sonnet-4-6)'

# Non-interactive structural reorg (explicit gates required)
mini-a dream=true \
  usewiki=true wikiroot=/shared/wiki \
  dreamwikimode=reorg dreamwikireorg=true \
  dreamwikiapply=true dreamwikiapproval=auto \
  dreamreport=/var/log/mini-a/dream-wiki-reorg.json \
  model='(type: anthropic, model: claude-sonnet-4-6)'
```

### Console command (`/dream`)

The `/dream` slash command is available in interactive console sessions when at least one of `memorych` or `usewiki=true` was set at startup. It is shown in `/help` whenever memory or wiki is configured.

| Command | Description |
|---------|-------------|
| `/dream` | Run memory dream + wiki dream (whichever are configured) |
| `/dream memory` | Run memory dream only |
| `/dream wiki` | Run wiki dream only |
| `/dream dryrun` | Dry-run both (no writes) |
| `/dream memory dryrun` | Dry-run memory dream only |
| `/dream wiki dryrun` | Dry-run wiki dream (proposal package, no writes) |
| `/dream wiki plan` | Explicit wiki proposal mode (same execution path as `dryrun` today) |
| `/dream wiki apply` | Safe wiki apply mode (enables write gate) |
| `/dream wiki reorg` | Structural wiki reorg mode (enables gates + auto approval in console) |

Sub-commands and `dryrun` complete with Tab.

### Combining with regular sessions

```bash
# 1. Start a session with persistent memory and a shared wiki
mini-a usememory=true memoryuser=true usewiki=true wikiaccess=rw wikiroot=/shared/wiki

# 2. Work on goals interactively...

# 3. When done, consolidate from the console
mini-a ➤ /dream

# Or consolidate in a separate invocation (e.g. a nightly cron)
mini-a dream=true \
  memorych='(name: mini_a_global_mem, type: file, options: (file: ~/.openaf-mini-a/memory-global.json))' \
  usewiki=true wikiroot=/shared/wiki \
  model='(type: anthropic, model: claude-sonnet-4-6)'
```

### Programmatic API

```javascript
loadLib("mini-a-dreams.js")

var runner = new MiniADreams({
  memorych: '{"name":"my_memory","type":"file","options":{"file":"/tmp/memory.json"}}',
  model:    '{"type":"anthropic","model":"claude-sonnet-4-6"}'
}, log)

// Run memory dream only
var result = runner.dreamMemory()
// result: { ok: true, results: { global: { ok, before, after, staleMarked } } }

// Run wiki dream only
var wikiResult = runner.dreamWiki()
// wikiResult: { ok: true, result: "<final-answer-excerpt>" }

// Run both
var overall = runner.run()
// overall: { ok: true, memory: {...}, wiki: {...} }

// Inject a stub LLM for testing
runner._setLlm(myStubLlm)
```

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

#### Full Debug — Audit + LLM Payloads to Files

To capture everything — agent activity audit trail, main-model LLM payloads, and low-cost model payloads — write each stream to a separate JSON file:

```bash
mini-a goal="your goal here" \
  auditch="(type: file, options: (file: audit.json))" \
  debugch="(type: file, options: (file: debug.json))" \
  debuglcch="(type: file, options: (file: debuglc.json))"
```

| File | Contents |
|------|----------|
| `audit.json` | Structured agent activity log — every tool call, shell command, and goal event with arguments and results |
| `debug.json` | Full request/response payloads for the main model (prompt + completion on every step) |
| `debuglc.json` | Full request/response payloads for the low-cost model |

All three files are written in NDJSON (one JSON object per line), so you can stream or filter them:

```bash
# Show only failed tool calls from the audit log
ojob - code='$from(io.readFileNDJSON("audit.json")).equals("type","tool_call").equals("status","error").select()'

# Show main-model prompts only
ojob - code='$from(io.readFileNDJSON("debug.json")).equals("type","prompt").select(r => r.content)'
```

If you also have a validation model configured, add `debugvalch` to capture its payloads:

```bash
mini-a goal="deep research task" deepresearch=true \
  auditch="(type: file, options: (file: audit.json))" \
  debugch="(type: file, options: (file: debug.json))" \
  debuglcch="(type: file, options: (file: debuglc.json))" \
  debugvalch="(type: file, options: (file: debugval.json))"
```

#### Lightweight Alternative — `debugfile`

To redirect only the noisy raw LLM blocks (prompts/responses) to a file while keeping normal agent events on screen:

```bash
mini-a goal="summarize README.md" debugfile=debug.log useshell=true
```

This implies `debug=true` and writes one JSON object per line to `debug.log`. Normal agent output still appears in the console.

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
