---
layout: page
title: Features
permalink: /features/
---

mini-a packs a comprehensive set of features into a minimalist framework. This page covers current capabilities across models, tool orchestration, delegation, security, and output/runtime options.

---

## Multi-Model Support

mini-a works with **10+ LLM providers** out of the box. Switch between providers by changing a single environment variable — no code changes required.

| Provider | Prefix | Example Model |
|----------|--------|---------------|
| OpenAI | `openai:` | `gpt-5.2`, `gpt-5-mini` |
| Google Gemini | `google:` | `gemini-2.0-flash`, `gemini-1.5-pro` |
| Anthropic Claude | `anthropic:` | `claude-sonnet-4-20250514` |
| Ollama (local) | `ollama:` | `llama3`, `mistral`, `codellama` |
| AWS Bedrock | `bedrock:` | `anthropic.claude-v2` |
| GitHub Models | `github:` | `openai/gpt-5` |
| Deepseek | `deepseek:` | `deepseek-chat` |
| Groq | `groq:` | `llama3-70b-8192` |
| Cerebras | `cerebras:` | `llama3.1-70b` |
| Mistral | `mistral:` | `mistral-large-latest` |
| OpenRouter | `openrouter:` | `meta-llama/llama-3-70b` |

Switching is as simple as setting the environment variable:

```bash
export OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')"             # OpenAI
export OAF_MODEL="(type: gemini, model: gemini-2.0-flash, key: '...')"    # Google
export OAF_MODEL="(type: ollama, model: 'llama3', url: 'http://localhost:11434')"              # Local
```

Set credentials directly in `OAF_MODEL`/`OAF_LC_MODEL` using `key: '...'` so configuration stays in one place. Ollama runs locally and requires no key.

---

## Dual-Model Cost Optimization

One of mini-a's most powerful features is its **dual-model architecture**. You can assign a cheaper, faster model to handle simple tasks (routing, summarization, classification) while reserving a more capable model for complex reasoning.

```bash
export OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')"            # Main model — complex reasoning
export OAF_LC_MODEL="(type: openai, model: gpt-5-mini, key: '...')"      # Light model — simple tasks
```

The framework automatically decides which model to use for each subtask, optimizing cost without sacrificing quality where it matters.

You can also add a dedicated validation model for deep-research scoring when you want execution and validation separated:

```bash
export OAF_VAL_MODEL="(type: openai, model: gpt-5-mini, key: '...')"

# Or override only this run
mini-a deepresearch=true modelval="(type: openai, model: gpt-5-mini, key: '...')" \
  goal='Research the latest release notes and summarize breaking changes'
```

Recent updates added dynamic escalation controls and per-run cost tracking so you can tune and measure this behavior:

- `lccontextlimit` escalates to the main model when low-cost context gets too large.
- `deescalate` controls how many successful steps are needed before returning to the low-cost model.
- `getCostStats()` returns a per-session usage breakdown for low-cost and main model tiers.
- `OAF_MINI_A_NOJSONPROMPT` / `OAF_MINI_A_LCNOJSONPROMPT` let you force text-prompt mode per model tier (Gemini main models auto-enable when unset).

### Estimated Savings

| Task Type | Model Used | Estimated Savings |
|-----------|------------|-------------------|
| Simple routing & classification | Light model (`OAF_LC_MODEL`) | ~70% cheaper |
| Summarization | Light model (`OAF_LC_MODEL`) | ~60% cheaper |
| Planning & step decomposition | Light model (`OAF_LC_MODEL`) | ~50% cheaper |
| Complex reasoning & analysis | Main model (`OAF_MODEL`) | 0% (full model needed) |

When both models are configured, mini-a can report separate token usage and cost estimates for each tier, so you can track exactly how much you are saving.

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S8 — Token stats with dual-model cost breakdown]</div>

---

## Automatic Performance Optimizations

mini-a includes several **built-in optimizations** that reduce token consumption and keep conversations within context limits without manual intervention.

- **Conversation compaction** — When the conversation grows too long, mini-a automatically compresses earlier turns while preserving essential context. Trigger manually with `/compact`.
- **Context summarization** — Long tool outputs and intermediate results are summarized to save tokens. Trigger manually with `/summarize`.
- **Token usage optimization** — The framework tracks token counts and adjusts behavior to stay within budget.
- **Smart prompt caching** — Repeated prompt patterns are cached where the provider supports it, reducing redundant API calls.

### Key Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `maxcontext` | Maximum context window size (tokens) | Model default |
| `maxtokens` | Maximum tokens per response | Model default |
| Auto-compact | Automatically compact when context exceeds threshold | Enabled |

```bash
# Example: constrain context and response size
mini-a maxcontext=32000 maxtokens=4096
```

---

## MCP Integration

**MCP (Model Context Protocol)** is an open standard that defines how LLMs discover and invoke external tools. Instead of hard-coding tool integrations, mini-a uses MCP servers that expose capabilities through a uniform interface.

mini-a ships with **25+ built-in MCP servers** covering common tasks such as file operations, web browsing, databases, Kubernetes, finance, office documents, OpenAF helpers, and more.

### STDIO vs HTTP Mode

| Mode | How It Works | Best For |
|------|-------------|----------|
| **STDIO** | Launches the MCP server as a local child process, communicating over stdin/stdout | Local tools, development, single-user setups |
| **HTTP** | Connects to a remote MCP server over HTTP/SSE | Shared servers, cloud deployments, team setups |

```bash
# STDIO mode (default for built-in servers)
mini-a usetools=true

# HTTP mode (connect to a remote MCP server)
mini-a usetools=true mcpserver="http://mcp.example.com:8080"
```

For a complete list of available MCP servers and their capabilities, see the [MCP Catalog]({{ '/mcp-catalog' | relative_url }}).

### MCP Proxy and Programmatic Tool Calling

When many tools are active, `mcpproxy=true` can collapse them into a single `proxy-dispatch` tool to reduce prompt bloat.

```bash
mini-a goal="compare release dates across APIs" \
  usetools=true mcpproxy=true \
  mcp="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-fin.yaml')]" \
  useutils=true
```

Large proxy calls can spill arguments/results to files with `argumentsFile` and `resultToFile=true`, and `mcpproxytoon=true` can serialize spilled object payloads in TOON format for easier scanning.

mini-a can optionally start a localhost bridge that lets generated scripts list/search/call MCP tools in loops and batches.

```bash
mini-a useshell=true usetools=true mcpprogcall=true \
  mcp="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-web.yaml')]"
```

Useful controls include `mcpprogcallport`, `mcpprogcallmaxbytes`, `mcpprogcallresultttl`, `mcpprogcalltools`, and `mcpprogcallbatchmax`.

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S9 — MCP test console listing tools]</div>

---

## Flexible Tool System

mini-a provides **three categories of tools** that the agent can use to accomplish goals:

### 1. Shell Commands

When enabled, the agent can execute shell commands directly on the host system. Disabled by default for security.

```bash
mini-a useshell=true
```

### 2. Built-in Utilities

File operations, text search, directory listing, and other common utilities that do not require spawning a shell.
When enabled, Mini Utils provides `init`, `filesystemQuery`, `filesystemModify`, and `markdownFiles`.

```bash
mini-a useutils=true
```

Use `utilsallow` and `utilsdeny` to control which utils are exposed to the agent:

```bash
# Expose only specific utils
mini-a useutils=true utilsallow="filesystemQuery,markdownFiles"

# Hide specific utils (applied after utilsallow)
mini-a useutils=true utilsdeny="filesystemModify"
```

When running in console mode, `useutils=true` also includes the `userInput` tool, which enables interactive console prompts (ask, choose, struct) for gathering structured input from the user.

For docs-aware workflows, enable:

```bash
mini-a useutils=true mini-a-docs=true
```

### 3. MCP Tools

Extensible tools provided by MCP servers — both built-in and custom.

```bash
mini-a usetools=true
```

### Tool Configuration Summary

| Parameter | What It Enables | Default |
|-----------|----------------|---------|
| `useshell` | Shell command execution | `false` |
| `useutils` | Built-in file and search utilities | `true` |
| `mini-a-docs` | Auto-set docs root for Mini Utils `markdownFiles` when `utilsroot` is unset | `false` |
| `usetools` | MCP tool servers | `true` |
| `shellmaxbytes` | Truncate oversized shell output to keep context stable | `8000` |
| `shellallowpipes` | Allow shell pipes/redirection/control operators | `false` |

All three can be combined. When the agent receives a goal, it selects the appropriate tool type based on the task.

---

## Multiple Interfaces

mini-a can be used through **four distinct interfaces**, each suited to different workflows.

### Console (Interactive REPL)

The default mode. An interactive terminal session with tab completion, command history, and real-time streaming.

```bash
mini-a
```

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S11 — Console with tab completion]</div>

### Web UI

A browser-based interface with session management, conversation history, and streaming output.

```bash
mini-a onport=8080
```

<div class="screenshot-placeholder">[SCREENSHOT-PLACEHOLDER: S10 — Web UI with session management]</div>

### Library (JavaScript API)

Use mini-a programmatically from your own OpenAF scripts.

```javascript
loadLib("mini-a.js");

var agent = new MiniA({
  model: "(type: openai, model: gpt-5.2, key: '...')",
  usetools: true
});

var result = agent.ask("List all running Docker containers");
print(result);
```

### Worker API

Run mini-a as a remote agent that accepts goals via an API endpoint.

Dynamic worker registration is also available. Parents can open a registration port with `workerreg=<port>`, and worker instances can self-register with `workerregurl=<url>` and heartbeat via `workerreginterval=<ms>`.

---

## Streaming, Debugging, and Safety

Recent releases added several runtime improvements that are useful in production setups:

- `planner_stream` SSE events distinguish planning tokens from normal answer tokens when `usestream=true`.
- `showthinking=true` surfaces XML-tagged `<thinking>...</thinking>` blocks as thought logs for providers that emit them.
- `debugfile=<path>` writes debug output as NDJSON instead of flooding the console with raw blocks.
- `debugvalch` routes validation-model debugging to its own channel when `llmcomplexity=true`.
- `maxpromptchars` caps inbound web prompt size before any model call is made.
- Untrusted input blocks and prompt normalization reduce prompt-injection risk from goals, chat text, and attachments.

```bash
mini-a workermode=true onport=9090
```

Other agents or applications can then delegate tasks to this worker instance.

---

## Planning & Multi-Agent Delegation

For complex goals, mini-a can **plan** a series of steps before executing them, and optionally **delegate** subtasks to child agents or remote workers.

Think of delegation as an orchestration layer: one parent agent manages task decomposition, parallel execution, and result aggregation across multiple workers.

### Planning Styles

| Style | Description |
|-------|-------------|
| `simple` | Flat sequential steps — generates and executes one step at a time (default) |
| `legacy` | Phase-based hierarchical planning — creates a structured multi-phase plan upfront |

```bash
# Enable planning (simple style, default)
mini-a useplanning=true

# Use legacy hierarchical planning
mini-a useplanning=true planstyle=legacy
```

### Delegation

When delegation is enabled, the main agent can spawn child agents to handle independent subtasks in parallel.

```bash
# Enable delegation to child agents
mini-a usedelegation=true
```

Delegation also works with remote workers — the main agent can send subtasks to mini-a instances running in worker mode on other machines.

Worker registration is also supported: set `workerreg` to a port to have mini-a start a worker registration HTTP server, optionally protected by `workerregtoken`. Use `workerevictionttl` to evict stale worker entries, and `delegationmaxdepth` to cap recursive delegation chains.

### Worker Skills (A2A)

Workers can advertise specific capabilities as A2A skills. The parent reads each worker's `/.well-known/agent.json` AgentCard and uses declared skills to route subtasks intelligently.

```bash
# Start a shell-capable worker (auto-emits the "shell" A2A skill)
mini-a workermode=true onport=9091 shellworker=true

# Start a worker with custom skills
mini-a workermode=true onport=9092 \
  workerskills="shell,time" \
  workerspecialties="finance,data-analysis"
```

The `delegate-subtask` tool call can then request specific skills:

```json
{ "goal": "run the test suite", "skills": ["shell"] }
```

When dynamic worker registration is active (`workerreg=<port>`), the parent rebuilds the `delegate-subtask` tool description every 30 seconds (or immediately on profile change) to list available workers and their skills — so the LLM always routes to the right worker without guessing.

### Orchestration Pattern

Use this pattern when you want mini-a to coordinate multiple agents for larger workloads:

1. Start one or more worker instances (`mini-a workermode=true onport=9090`).
2. Run a parent agent with planning and delegation enabled.
3. Set concurrency limits so execution stays predictable.
4. Let the parent combine worker outputs into a single final result.

```bash
mini-a useplanning=true planstyle=legacy usedelegation=true \
  workers='http://worker1:9090,http://worker2:9090' maxconcurrent=4 \
  goal='Analyze this monorepo, group findings by domain, and produce one prioritized action plan'
```

---

## Outer Loop Autonomous Coding

For tasks that require multiple revision cycles, mini-a supports an **autonomous outer loop** that runs the agent repeatedly until the goal is validated or safety limits are reached. Each cycle starts with fresh context while persisting state under `~/.openaf-mini-a/sessions/<session-id>/`.

```bash
mini-a "Implement the feature described in ./TASKS.md" \
  outerloop=true \
  useplanning=true \
  outerloopinstructions=./TASKS.md \
  valgoal="All implementation tasks complete and tests pass" \
  outerloopmaxcycles=8
```

The loop stops automatically when:
- Completion and validation succeed
- The maximum cycle count (`outerloopmaxcycles`, default 5) is reached
- The runtime limit (`outerloopmaxtime`) expires
- The same validation failure repeats (`outerloopstoponrepeat=true`)
- No meaningful change occurs for N consecutive cycles (`outerloopmaxnochange`, default 2)

### Session Persistence

Each cycle saves artifacts to the session directory: `instructions.md`, `state.json`, `plan.md`, `last-validation.txt`, `last-error.txt`, `cycle-000N-summary.md`, and `changed-files.json`.

To resume an interrupted outer loop run, pass the session ID that was printed at startup:

```bash
mini-a "Refactor the parser and keep iterating until validation passes" \
  outerloop=true \
  outerloopsessionid=session-20240601-120000-abc123 \
  valgoal="Parser tests pass and no regression is introduced" \
  outerloopmaxcycles=6
```

See [Configuration → Outer Loop]({{ '/configuration#7a-outer-loop-autonomous-coding' | relative_url }}) for the full parameter reference.

---

## Working Memory

For long-running or multi-step goals, mini-a can maintain a **structured working memory** that persists key findings across tool calls and even across sessions.

```bash
mini-a usememory=true goal="Deep code analysis of auth module"
```

Memory is organized into 8 typed sections:

| Section | What is stored |
|---------|---------------|
| `facts` | Confirmed facts discovered during the run |
| `evidence` | Raw observations and tool outputs worth keeping |
| `decisions` | Choices made and their rationale |
| `risks` | Identified risks or blockers |
| `openQuestions` | Unresolved questions to follow up on |
| `hypotheses` | Unconfirmed theories to test |
| `artifacts` | Generated files, configs, or summaries |
| `summaries` | Compressed summaries of completed work |

Entries are appended automatically at significant agent events (tool calls, plan critiques, validation results, final answers). Near-duplicate entries are suppressed by an 85% word-overlap fingerprint (`memorydedup`).

### Persistence

By default, memory is held in-process. Pass an OpenAF channel definition to persist it across runs:

```bash
# Persist to a local JSON file
mini-a usememory=true \
  memorych="(name: my_mem, type: file, options: (file: '/tmp/mini-a-mem.json'))" \
  goal="Iterative research on cloud costs"
```

### Scope

Use `memoryscope` to control which stores the agent reads/writes:

```bash
# Keep memory isolated to this session
mini-a usememory=true memoryscope=session goal="One-shot task"

# Share memory globally across all sessions
mini-a usememory=true memoryscope=global \
  memorych="(type: file, options: (file: '/tmp/mini-a-global.json'))"
```

### Tuning

```bash
# Larger limits for a heavy analysis run
mini-a usememory=true memorymaxpersection=200 memorymaxentries=1000 \
  goal="Analyze all TypeScript files"
```

Use `memoryuser=true` as a shorthand that activates working memory with automatic file-backed persistence under `~/.openaf-mini-a/`, without needing to specify channels manually:

```bash
mini-a memoryuser=true goal="deep code analysis"
```

This preset configures separate session and global stores, defaults `memorypromote=facts,decisions,summaries`, and enables a 30-day stale sweep (`memorystaledays=30`) so long-lived memory stays fresh instead of growing without bounds.

See [Configuration → Working Memory]({{ '/configuration#10b-working-memory' | relative_url }}) for the full parameter reference.

---

## Wiki Knowledge Base

For long-lived, cross-session knowledge that multiple agents or users should share, mini-a supports a **persistent Markdown wiki** following the LLM Wiki pattern. Agents read from and write to structured pages stored on the filesystem, S3, or Elasticsearch/OpenSearch — knowledge survives restarts and is readable by any agent pointing at the same root.

```bash
# Read-only wiki on the filesystem
mini-a usewiki=true wikiroot=/shared/wiki goal="..."

# Read-write wiki on the filesystem
mini-a usewiki=true wikiaccess=rw wikiroot=/shared/wiki goal="..."

# Read-write wiki on Elasticsearch/OpenSearch
mini-a usewiki=true wikiaccess=rw wikibackend=es \
  wikiurl=http://localhost:9200 goal="..."
```

The agent uses the `wiki` action to interact with the knowledge base:

```json
{ "action": "wiki", "params": { "op": "search", "query": "authentication decision" } }
```

Supported operations:

| Operation | Description |
|-----------|-------------|
| `list` | List all pages (optional prefix filter) |
| `read` | Read a specific page |
| `search` | Full-text search across all pages |
| `lint` | Validate wiki health (broken links, orphans, stale pages, near-duplicates) |
| `write` | Write or update a page (requires `wikiaccess=rw`) |

When a brand-new wiki is opened with `wikiaccess=rw`, Mini-A auto-bootstraps `AGENTS.md` (ingestion workflow and contribution rules) and `index.md` (entrypoint and table of contents). `AGENTS.md` is protected and cannot be deleted.

### Wiki Console Commands

```
/wiki list [prefix]    — list pages, optionally filtered
/wiki tree [prefix]    — list pages as a hierarchy
/wiki browse [prefix]  — interactive wiki page browser
/wiki read <page.md>   — print a page
/wiki search <query>   — full-text search
/wiki backlinks <page> — list pages linking to a target page
/wiki lint             — run health checks
/wiki reindex          — rebuild search index (requires wikiaccess=rw)
/stats wiki            — show per-operation stats for the session
```

### Choosing Between Wiki and Memory

| | `usememory` | `usewiki` |
|--|-------------|-----------|
| Scope | Per-session or per-user global | Shared across all agents/users |
| Format | Typed JSON sections | Human-readable Markdown pages |
| Survives restart | With persistence channel | Always |
| Best for | In-flight reasoning, decisions | Durable encyclopaedic knowledge |

Use both together: the agent reasons with memory during a session, then distils durable findings into wiki pages for future sessions and other agents.

See [Configuration → Wiki Knowledge Base]({{ '/configuration#10c-wiki-knowledge-base' | relative_url }}) for the full parameter reference.

---

## Dreams (Sleep Pass)

The **dream pass** is an LLM-powered off-line consolidation step — think of it as REM sleep for your agent. After a long session, the pass reorganises what the agent learned: merging near-duplicate memory entries, marking superseded entries stale, surfacing new cross-cutting insights into the `summaries` section, and producing a lint-clean wiki.

```bash
# Consolidate memory after a session
mini-a dream=true \
  memorych='(name: mini_a_global_mem, type: file, options: (file: ~/.openaf-mini-a/memory-global.json))' \
  model='(type: anthropic, model: claude-sonnet-4-6)'

# Or from the interactive console (when memory or wiki is configured)
mini-a ➤ /dream
mini-a ➤ /dream memory dryrun   # preview without writing
mini-a ➤ /dream wiki
```

Three dream execution modes (`plan`, `apply`, `reorg`) and safety write gates are available to control exactly how changes are applied:

| Mode / Option | Setting | Description |
|---|---|---|
| **Explicit Modes** | `dreamwikimode` / `dreammemorymode` | Choose consolidation depth: `plan`, `apply`, or `reorg` |
| **Write Gates** | `dreamwikiapply=true` | Required gate to allow writes during wiki `apply` and `reorg` |
| **Structural Reorg** | `dreamwikireorg=true` | Allow structural directory and file moves |
| **Reorg Approval** | **`dreamwikiapproval`** | Control structural approval flow (`auto`, `ask`, `never`) |
| **JSON Reporting** | `dreamreport` | Optional path to write a JSON run report |

Use `dryrun=true` or the `plan` mode to preview what would change without writing anything back. The pre-dream state is always backed up to a sibling namespace before any write.

See [Advanced → Dreams]({{ '/advanced/#dreams-sleep-pass' | relative_url }}) for full documentation and the programmatic API.

---

## Adaptive Tool Routing

mini-a includes an optional **rule-based routing layer** that selects how each action is dispatched — direct local tool, MCP direct call, MCP proxy, shell execution, utility wrapper, or delegated subtask.

```bash
mini-a adaptiverouting=true goal="Analyze logs and report"
```

When adaptive routing is on, each tool action goes through a lightweight router that scores candidate routes using intent hints:

- read vs. write intent
- payload size
- latency sensitivity
- determinism preference
- risk level
- structured output preference
- historical route success/failure

The router returns a selected route, rationale, and fallback chain. Failures are retried down the fallback chain (duplicate routes are skipped to prevent thrashing). Route decisions are appended to debug/audit output as `[ROUTE ...]` records when `debug=true`.

### Controlling which routes are used

```bash
# Prefer MCP direct calls, fall back to proxy
mini-a adaptiverouting=true \
  routerorder="mcp_direct_call,mcp_proxy_path,utility_wrapper"

# Restrict to non-shell routes only
mini-a adaptiverouting=true routerdeny="shell_execution"

# Only allow shell and utility routes
mini-a adaptiverouting=true routerallow="shell_execution,utility_wrapper"
```

When `adaptiverouting=false` (default), mini-a preserves legacy tool dispatch behavior.

---

## Agent Files

mini-a lets you package an entire agent configuration — model, capabilities, tools, rules, knowledge, and persona — into a single **markdown file with YAML frontmatter**. Reuse and share agent profiles across your team or project without repeating command-line flags.

```bash
mini-a agent=examples/changelog-gen.agent.md goal="generate changelog"
```

See the [Agent Files]({{ '/agents' | relative_url }}) page for the complete reference: frontmatter keys, tool entry types, `mini-a:` overrides, relative file paths, precedence rules, and a full annotated example.

---

## Chatbot Mode

Not every use case needs tools. **Chatbot mode** turns mini-a into a pure conversational assistant — no shell access, no file operations, no MCP tools. Just the LLM.

```bash
mini-a chatbotmode=true
```

This is useful for:

- **Q&A** — Answer questions using the model's training data
- **Education** — Explain concepts, tutor on topics
- **Brainstorming** — Generate ideas, explore possibilities
- **Drafting** — Write text, emails, documentation

All other features (streaming, conversation management, dual-model) still work in chatbot mode.

---

## Custom Slash Commands, Skills, and Hooks

mini-a supports template-based custom slash commands, skill templates, and local console hooks.

### Custom Slash Commands

Create markdown templates under `~/.openaf-mini-a/commands/` and invoke them with `/<name> ...args...`.

```text
~/.openaf-mini-a/commands/my-command.md
```

Use placeholders inside the template: `{{args}}`, `{{argv}}`, `{{argc}}`, `{{arg1}}`, `{{arg2}}`, ...

Placeholder reference (works for command and skill templates):

- `{{args}}` -> raw argument string after the command name (trimmed)
- `{{argv}}` -> parsed arguments as a JSON array
- `{{argc}}` -> parsed argument count
- `{{arg1}}`, `{{arg2}}`, ... -> positional argument values (1-based)

Example template `~/.openaf-mini-a/commands/my-command.md`:

```markdown
Follow these instructions exactly.

Primary target: {{arg1}}
All args (raw): {{args}}
Parsed args: {{argv}}
Argument count: {{argc}}
```

Run:

```bash
mini-a ➤ /my-command repo-a --fast "include docs"
```

Rendered prompt:

```text
Follow these instructions exactly.

Primary target: repo-a
All args (raw): repo-a --fast "include docs"
Parsed args: ["repo-a","--fast","include docs"]
Argument count: 3
```

Load additional command directories with:

```bash
mini-a extracommands=/path/to/team-commands,/path/to/project-commands
```

### Skills

mini-a discovers skills from `~/.openaf-mini-a/skills/` in several formats. When a skill folder contains multiple formats, the first match in this precedence order is loaded:

1. `SKILL.yaml` — self-contained YAML skill (recommended for portable/shared skills)
2. `SKILL.yml`
3. `SKILL.json`
4. `SKILL.md` — classic markdown skill (folder layout)
5. `skill.md`

Single-file skills (`~/.openaf-mini-a/skills/<name>.md`) are also supported.

#### YAML Skill Format

The YAML format bundles the prompt body, metadata, and all referenced files into a single portable file — no folder of supporting files required:

```yaml
schema: mini-a.skill/v1
name: my-skill
summary: Short description shown by /skills

body: |
  You are a specialized assistant for {{arg1}}.
  @context.md
  {{args}}

refs:
  context.md: |
    Add any context or constraints here.
```

Print a starter template with:

```bash
mini-a --skills
# Redirect directly to a new file:
mkdir -p ~/.openaf-mini-a/skills/my-skill
mini-a --skills > ~/.openaf-mini-a/skills/my-skill/SKILL.yaml
```

The `refs` map embeds virtual reference files inline — `@context.md` in the body resolves from embedded refs first, then falls back to the filesystem. A `children` list models nested sub-folder structure for complex skill packs. See [docs/SKILLS-YAML-FORMAT.md](https://github.com/OpenAF/mini-a/blob/main/docs/SKILLS-YAML-FORMAT.md) for the full schema reference.

Run skills with either `/<name> ...args...` or `$<name> ...args...`. Use `/skills` (or `/skills <prefix>`) to list discovered skills.

Load additional skill directories with:

```bash
mini-a extraskills=/path/to/shared-skills,/path/to/project-skills
```

### Hooks

mini-a can run local hooks from `~/.openaf-mini-a/hooks/*.yaml|*.yml|*.json` on events like:

- `before_goal`, `after_goal`
- `before_tool`, `after_tool`
- `before_shell`, `after_shell`

Load additional hook directories with:

```bash
mini-a extrahooks=/path/to/team-hooks,/path/to/project-hooks
```

### Non-interactive Template Execution

You can execute one command/skill template and exit:

```bash
mini-a exec="/my-command repo-a --fast"
```

References:
- [mini-a `USAGE.md` (custom commands, skills, hooks)](https://github.com/OpenAF/mini-a/blob/main/USAGE.md)
- [mini-a `mini-a.yaml` (`useskills` parameter)](https://github.com/OpenAF/mini-a/blob/main/mini-a.yaml)

---

## Docker Support

Run mini-a in a **Docker container** for full isolation, reproducible environments, and easy deployment.

### Docker Compose Example

```yaml
version: "3.8"
services:
  mini-a:
    image: openaf/mini-a
    environment:
      - OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')"
      - OAF_LC_MODEL="(type: openai, model: gpt-5-mini, key: '...')"
    ports:
      - "8080:8080"
    volumes:
      - ./workspace:/workspace
    command: onport=8080
```

Docker containers provide a natural sandbox for shell execution — you can enable `useshell=true` inside the container without exposing your host system.

---

## Security Features

mini-a is designed to be **secure by default**. Potentially dangerous features require explicit opt-in.

| Feature | Description | Default |
|---------|-------------|---------|
| Shell execution | Run arbitrary shell commands | **Disabled** |
| Read-only mode | Prevent file modifications | Available |
| Command allowlist | Only permit specific shell commands | `shellallow="cmd1,cmd2"` |
| Command ban list | Block specific shell commands | `shellban="rm,shutdown"` |
| Encrypted key storage | API keys stored encrypted via model manager | Supported |
| Docker isolation | Run in a container sandbox | Available |
| OS sandbox | Built-in OS-level sandbox for shell commands | `usesandbox=off` |

```bash
# Enable shell with allowlist only
mini-a useshell=true shellallow="ls,cat,grep,find"

# Enable shell but ban destructive commands
mini-a useshell=true shellban="rm,rmdir,dd,mkfs"

# Enable sandbox (auto-detects OS)
mini-a useshell=true usesandbox=auto

# Sandbox without network access
mini-a useshell=true usesandbox=auto sandboxnonetwork=true
```

These controls can be combined. For example, running inside Docker with a shell allowlist provides defense in depth. The built-in OS sandbox (`usesandbox`) adds an extra layer by wrapping shell commands in platform-specific OS-level restrictions — no separate container setup required.

---

## Streaming Responses

mini-a supports **real-time token streaming** in both the console and web interfaces. Responses appear word by word as the model generates them, rather than waiting for the full response.

```bash
mini-a usestream=true
```

Streaming is enabled by default in most configurations. It provides a more responsive experience, especially for long-form outputs.

When `usestream=true` and the agent is in the planning phase, tokens are emitted as `planner_stream` events (distinct from regular `stream` events). In the console these render in a different color; in the web UI clients can handle the `planner_stream` SSE event type to display planner output in a separate pane.

---

## Conversation Management

mini-a provides several commands for managing conversation context during a session.

| Command | Description |
|---------|-------------|
| `/compact [n]` | Compress older history while preserving up to the latest `n` exchanges (default 6) |
| `/summarize [n]` | Replace older history with a narrative summary and keep up to the latest `n` exchanges (default 6) |
| `/last [md]` | Reprint the most recent final answer (`md` for raw markdown) |
| `/save <path>` | Save the most recent final answer to a file |

These commands are especially useful in long sessions where context accumulates and token costs increase. Compacting a conversation can reduce context size by 40-60% while preserving the essential information the agent needs.
When enough history exists, mini-a keeps at least one older entry eligible for summarization instead of preserving the entire tail.

---

## Conversation History Persistence

Enable `historykeep=true` to automatically save console conversations to `~/.openaf-mini-a/history` so they can be resumed in future sessions.

```bash
# Save all console sessions for later resumption
mini-a historykeep=true
```

Use `historykeepperiod` and `historykeepcount` to control how many saved sessions are retained:

```bash
# Delete history files older than 60 minutes, keep at most 10
mini-a historykeep=true historykeepperiod=60 historykeepcount=10
```

To resume a saved session, pass the history file path as the conversation input at startup. History files are stored as JSON in `~/.openaf-mini-a/history/`.

---

## Metrics & Usage Tracking

Track exactly how many tokens you are using and what they cost with built-in **metrics and usage tracking**.

```
> /stats
```

The `/stats` command displays:

- **Token counts** — Input and output tokens for the current session
- **Cost estimates** — Estimated cost based on provider pricing
- **Model usage** — Breakdown by main model vs. light model
- **Request counts** — Number of API calls made

This data helps you understand usage patterns, optimize model selection, and budget API costs.

---

## Visual Outputs

mini-a can generate **rich visual outputs** directly in the terminal or web UI by enabling the appropriate flags.

| Parameter | Output Type | Example Use |
|-----------|------------|-------------|
| `useascii=true` | ASCII art | Banners, logos, decorative text |
| `usesvg=true` | SVG visuals | Infographics, custom diagrams, UI mock visuals |
| `usediagrams=true` | Diagrams | Flowcharts, architecture diagrams, sequence diagrams |
| `usecharts=true` | Charts | Bar charts, histograms, data visualizations |
| `usevectors=true` | Vector bundle | Prefer Mermaid for structural diagrams and SVG for infographics/custom visuals |
| `usemaps=true` | Maps | Geographic data, network topology |
| `usemath=true` | Math rendering | Inline or block LaTeX formulas rendered via KaTeX in web UI |

```bash
# Enable all visual outputs
mini-a useascii=true usevectors=true usecharts=true usemaps=true usemath=true
```

These features instruct the LLM to include visual representations in its responses when appropriate, making outputs more informative and easier to understand at a glance. `usevectors=true` is the convenient bundle for vector-first output because it enables both SVG and diagram guidance together.

---

## Real-Time Progress Messages (`showMessage`)

When `useutils=true`, the agent can call the `showMessage` utility to display progress updates, status messages, and notifications directly in the console **during** execution — before the final answer.

Five display levels are supported, each with a distinct color and icon: `info` (cyan), `warn` (yellow ⚠️), `error` (red ❌), `success` (green ✅), `debug` (faint 🪳). An optional `title` field prints a bold header above the message.

```bash
mini-a goal="analyze project and report findings" useutils=true
# Agent emits real-time status updates as it works
```

---

## Prompt Safety and Untrusted Data Handling

mini-a explicitly labels all untrusted content — user goals, tool outputs, attached files, and conversation history — with `BEGIN_UNTRUSTED_* … END_UNTRUSTED_*` markers in the system prompt. The LLM is instructed not to follow embedded instructions that conflict with developer rules.

Additional safeguards:

- **Policy-lane probe detection** — requests that attempt to extract the system prompt are detected and refused before reaching the LLM.
- **Prompt normalization** — line endings are unified, stray control characters are stripped, and oversized inputs are rejected.
- **Web API prompt size limit** (`maxpromptchars`, default 120,000) — configurable character cap on incoming web API payloads.

```bash
# Restrict accepted prompt size in the web server
./mini-a-web.sh onport=8888 maxpromptchars=40000
```

---

## Conversation Carryover Context

When using conversation history (`conversation=<path>`, `usehistory=true`, or `resume=true`), mini-a automatically extracts up to two recent goal/answer pairs and injects them into the runtime context at the start of each new goal. This keeps multi-turn sessions coherent without manual context management — no configuration required.

---

## Agent Config Overrides

The `mini-a:` section in an agent file can now override parameter values that were **not explicitly set** on the CLI, including defaults previously applied by mode presets. Explicit CLI flags always win; agent-file values only affect unset defaults.

```yaml
---
name: my-agent
mini-a:
  maxsteps: 30        # overrides default of 15 unless user passed maxsteps= explicitly
  useplanning: true   # enables planning unless user explicitly set useplanning=false
---
```

This lets agent authors set sensible defaults for parameters like `maxsteps`, `useplanning`, or `planstyle` without risking a conflict with intentional CLI flags.

---

<div class="cta-section">
  <h2>Ready to Try It?</h2>
  <p>Get mini-a running in under a minute and explore these features yourself.</p>
  <div class="cta-buttons">
    <a href="{{ '/getting-started' | relative_url }}" class="btn btn-primary">Get Started</a>
    <a href="{{ '/examples' | relative_url }}" class="btn btn-secondary">See Examples</a>
  </div>
</div>
