---
layout: page
title: Virtual Skills
permalink: /virtual-skills/
---

# Virtual Skills

A **virtual skill** is a skill document stored and indexed like ordinary wiki knowledge but *consumed* like executable expertise. An agent searches a compact index, inspects one candidate cheaply, reads only the section it needs, and only then acts. The corpus can grow very large (the design targets 100k to 1M documents) without ever being loaded into the model's context: the wiki engine is the backing store, a small fixed set of tools is the paging interface, and the context window is the working set.

```
skill corpus (wiki pages: fs, s3, s3fs, es, http)
      |
Lucene + graph + existing wiki retrieval
      |
small skill interface (~6 tools, regardless of corpus size)
      |
search -> inspect -> read one section -> use
```

This is a facade over the existing [wiki]({{ '/features#wiki-knowledge-base' | relative_url }}); there is no second search, index, or storage engine. It reuses wiki search, `open`, bounded reads, `related`, `context`, mounts, and the knowledge graph exactly as `usewiki` and `mcp-wiki` do.

## Local skills vs. virtual skills

| | Local skills (`SKILL.md` / `SKILL.yaml`) | Virtual skills |
|---|---|---|
| Storage | Files under a skills root such as `~/.openaf-mini-a/skills` | Wiki pages on any wiki backend, any size |
| Discovery | Eagerly listed; every skill appears in `/skills` | Never listed eagerly; found through search or recommend |
| Context cost | One slash command per skill, loaded up front | Zero until a specific skill is searched, opened, or read |
| Scale | Tens to low hundreds | 100k+ |
| Execution | `$name` / `/name` renders `{% raw %}{{args}}{% endraw %}`, `{% raw %}{{argv}}{% endraw %}`, `{% raw %}{{arg1}}{% endraw %}` | Same rendering machinery, reached through `resolve` |

Both coexist and nothing about local skills changes: `/skills`, `$skill`, `extraskills`, and [Agent Plugins]({{ '/agent-plugins' | relative_url }}) behave as before. Virtual skills are reached only through an explicit surface (`/skills search ...`, the `skillwiki` tool, or an MCP client talking to `mcp-skills`), so a large library never floods the compact local skill list or a system prompt.

Four rules hold throughout: the full catalog is never injected into a prompt; there is never one MCP tool per skill; search never returns a full skill body; and related or referenced skills are never recursively preloaded.

```
Agent: skills-recommend(task="diagnose Kafka consumer pauses during rebalances")
MCP:   1. kafka-consumer-rebalance  2. kafka-cooperative-assignor  3. kafka-consumer-lag
Agent: skills-open(kafka-consumer-rebalance)          -> metadata + headings (no body)
Agent: skills-read(ref=..., section="Diagnosis")      -> just that section
Agent: performs the task
```

## Authoring a skill

A virtual skill is an ordinary wiki page with front matter. The minimum is `type: skill` and a `name`:

```markdown
---
type: skill
name: postgres-index-review
---
# Diagnosis
...
```

A fuller page uses the same conventions as the [`mini-a.skill/v1`]({{ '/features#skills' | relative_url }}) format where they apply:

```markdown
---
type: skill
id: skill:postgres-index-review
schema: mini-a.skill/v1
name: postgres-index-review
title: PostgreSQL Index Review
description: Analyze PostgreSQL workloads and identify missing, redundant, or ineffective indexes.
tags: [postgresql, database, performance]
intent:
  - diagnose slow query
  - review indexing strategy
applies_to: [postgres]
depends_on:
  - skill:inspect-repository
requires:
  tools: [shell]
  capabilities: [filesystem-read]
risk: low                     # low | medium | high (informational today)
trust:
  level: curated              # local | curated | verified | community | untrusted
  publisher: openaf
compatibility:
  mini-a: true
  codex: true
  claude-code: true
version: 1
---
# When to use
...

# Diagnosis
...

Use the procedure in [JFR analysis](refs/jfr.md) for GC pauses.
```

Every field except `type` and `name` is optional, and an ordinary knowledge page without this front matter behaves exactly as before. `applies_to`/`appliesTo` and `intent`/`intents` are both accepted, and `compatibility` and `trust` accept arbitrary keys. Supporting documents such as `refs/jfr.md` are normal links: `open` lists them cheaply and `read` can follow them, but they are never concatenated into the skill body.

### Relationships

Skill-to-skill relationships use the ordinary wiki mechanisms: shared `tags`, `aliases`, `supersedes`, and explicit Markdown or `wiki:` links. `related` calls into the existing wiki graph and its cross-wiki joins, so a page linking to `kubectl-basics`, or sharing a `kubernetes` tag with a page in another mount, is discoverable without skill-specific graph code.

`depends_on` (also `dependsOn` or `dependencies`) is an explicit, ordered prerequisite list. Entries may be a `skill:name` identifier, a `wiki:` reference, or an exact skill name. `compose` returns compact metadata for a bounded, one-level set of them. It never expands them recursively, reads their bodies, invokes tools, or grants the `requires`/`capabilities` they declare: those stay under Mini-A's normal permissions and approval policy.

## Using it from Mini-A

Opt in with `useskillwiki=true`. With no further settings it reuses the wiki configured through `usewiki`, so one wiki can hold ordinary knowledge pages and skill pages side by side. Point it at a separate skill-only library with `skillwikibackend`, `skillwikiroot`, and `skillwikimounts`.

```bash
# Reuse an existing wiki as the skill library
mini-a useskillwiki=true usewiki=true wikiroot=./team-wiki goal="..."

# Dedicated skill-only library
mini-a useskillwiki=true skillwikiroot=./skills goal="..."
```

This exposes a `skillwiki` tool to the model with the operations `context`, `search`, `recommend`, `open`, `read`, `related`, `compose`, and `resolve`, through the same in-process mechanism as the `wiki` and `graph` tools (no MCP loopback). Consultation is bounded for each agent run:

| Parameter | Default | Bound |
|-----------|---------|-------|
| `skillsmaxloaded` | `3` | Distinct skills that may be `open`-ed |
| `skillsmaxchars` | `12000` | Total skill-body characters `read` may return |
| `skillsautolimit` | `5` | Results per automatic search |
| `skillsautosearch` | `false` | Reserved for opt-in, planner-driven consultation; today the model can call the tool directly at any time, bounded the same way |

From the interactive console:

```
/skills search postgres index tuning
/skills recommend diagnose slow postgres queries
/skills open wiki:postgres-index-review.md
/skills read wiki:postgres-index-review.md Diagnosis
/skills related wiki:postgres-index-review.md
/skills compose wiki:postgres-index-review.md
/skills context
```

These subcommands activate only when a skill library is configured. Otherwise `/skills <word>` keeps its original meaning: a prefix-filtered listing of local skills.

### Discovery is separate from execution

A search result is never treated as trusted instructions before it is explicitly selected. The `resolve` operation turns a chosen skill into the same shape used for a local `SKILL.md`/`SKILL.yaml` (a body template plus metadata), so it renders through the existing `{% raw %}{{args}}{% endraw %}`/`{% raw %}{{argv}}{% endraw %}`/`{% raw %}{{arg1}}{% endraw %}` machinery instead of a parallel execution path.

## Publishing the library over MCP

`mcp-skills` publishes the library to any MCP client (Codex, Claude Code, OpenCode, or any other), with the same small tool set regardless of corpus size:

```bash
ojob mcps/mcp-skills.yaml \
  onport=8890 \
  label="Engineering Skill Library" \
  wikibackend=fs \
  wikiroot=./skills \
  wikimounts="[{name:'security', label:'Security Skills', backend:'fs', root:'./security-skills'}]"
```

Tools: `context`, `search`, `recommend`, `open`, `read`, `related`, `compose`. Every result is compact metadata, and only `read` returns skill text, limited to the section or range requested. `toolPrefix` can namespace the tools when a client already has an unrelated `search` or `context` tool.

### Safe mode for public or untrusted clients

`mcp-skills-safe` reuses the restricted-retrieval engine from [`mcp-wiki-safe`]({{ '/mcp-catalog#mcp-wiki-safe' | relative_url }}): opaque references, per-window search/read/character budgets, per-page cooldowns, and an optional shared channel (for example Redis) for multi-replica deployments. It exposes `search`, `open`, `read`, and `related`, never a raw path or a full skill body. Because `open` and `related` do not themselves disclose content, each operation **consumes** the reference it is given and returns a **fresh** single-use reference for the next step (search, then open, then read). A stale or reused reference fails with `invalid-or-expired-reference`.

```bash
ojob mcps/mcp-skills-safe.yaml label="Public Skill Library" wikiroot=./skills wikirestrictprofile=moderate
```

`wikirestrictprofile=off` removes the restrictions and prints a startup warning. Use it only for clients you already trust.

## Multiple wikis

Skill libraries use ordinary wiki mounts. The `wiki` parameter of `search` and `recommend` accepts `"*"`, a single name, or an array, exactly like `mcp-wiki`. Every result carries its source wiki and a mount-prefixed reference such as `wiki:@devops/...`, and `related` reuses the cross-wiki graph join (`wikigraphcross`).

## Ranking, observability, and scale

Results are ranked by a fixed weighted sum of lexical score and name, title, intent, tag, applies-to, compatibility, and graph signals. There is no vector or embedding search yet: `recommend` builds a lexical query from the task, environment, and capabilities. Only counters are tracked (searches, opens, reads, sections read, characters returned), and skill body content is never logged.

Lucene-backed search stays fast regardless of corpus size. The skill count and un-queried tag browsing rely on the wiki's per-page metadata cache, which is cheap when warm but takes real time on the first touch of a very large, cold corpus.

With [wiki retrieval v2]({{ '/features#wiki-retrieval-v2-and-bounded-retrieval' | relative_url }}), `wikiretrievalv2` and `wikiretrievalconfig` also reach a dedicated skill manager. Build its serving generation with a writable wiki manager before using that read-only library.

## Not yet included

Planner-level automatic consultation (`skillsautosearch`), materializing a remote skill into a portable local `SKILL.md` or Agent Plugin, semantic or vector retrieval, skill quality signals, and signed skills are future work.

## See also

- [Features → Skills]({{ '/features#skills' | relative_url }}) for local skills and slash-command templates
- [Agent Plugins]({{ '/agent-plugins' | relative_url }}) for portable skill and MCP bundles
- [MCP Catalog → mcp-skills]({{ '/mcp-catalog#mcp-skills' | relative_url }})
- [Configuration → Virtual Skill Library]({{ '/configuration#c-2-virtual-skill-library' | relative_url }})
