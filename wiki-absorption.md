---
layout: page
title: Wiki Absorption
permalink: /wiki-absorption/
---

# Absorb knowledge from local wikis

Absorption combines selected knowledge from multiple filesystem wikis into a destination wiki. Plan first, review the saved changes, then explicitly apply them. Source wikis are read as raw files and are never initialized or modified. Apply and resume use exact saved edits without calling a synthesis model.

## Select sources

Create `sources.yaml`:

```yaml
sources:
  - id: platform
    root: ../platform-wiki
    paths: [runtime/, setup.md#linux]
    exclude: [runtime/old.md]
  - id: operations
    root: ../operations-wiki
    tags: [deployment]
    topic: runtime configuration
```

`absorbspec` accepts JSON, YAML or SLON files, inline JSON/SLON maps, or arrays of source definitions. An existing file takes precedence over inline parsing. Roots are relative to the specification file, or to the working directory for inline specifications. Keep source IDs stable when relocating a source.

Each source needs `all: true`, `paths`, `tags`, or `topic`. Positive selectors form a union; exclusions win. Paths select pages, directories or heading anchors. Tags match exact frontmatter array values; topic selection uses lexical candidates followed by model relevance assessment. Missing or ambiguous requested headings block the plan. Source and destination directory trees must not overlap.

Hidden state, symlinks, indexes, logs, `node_modules` and `AGENTS.md` are excluded; mounts are not traversed. Skill pages (`type: skill` or `schema: mini-a.skill/v1`) are preserved as intact units. Changes to their template or metadata, including required link rewrites, block those pages.

## Plan, review and apply

Use an existing destination directory. Run from the Mini-A package directory:

```bash
ojob mini-a-absorb.yaml absorbop=plan absorbspec=./sources.yaml wikiroot=./destination wikiaccess=rw
ojob mini-a-absorb.yaml absorbop=show absorbplan=PLAN_ID wikiroot=./destination
ojob mini-a-absorb.yaml absorbop=apply absorbplan=PLAN_ID wikiroot=./destination wikiaccess=rw
ojob mini-a-absorb.yaml absorbop=status wikiroot=./destination
ojob mini-a-absorb.yaml absorbop=resume absorbplan=PLAN_ID wikiroot=./destination wikiaccess=rw
```

Replace `PLAN_ID` with the ID returned by planning. The console uses its active filesystem wiki:

```text
/absorb plan "/path/My Sources.yaml"
/absorb show <id>
/absorb apply <id>
/absorb status
/absorb resume <id>
/absorb delete <id>
```

Planning uses `model=` or `OAF_MODEL`; exact duplicate detection is model-free, but remaining synthesis requires a model. Saved model references and `secpass` work as in the console. The default limits are 100 selected pages (`absorbmaxpages`) and 100,000 estimated input tokens (`absorbmaxtokens`, characters / 4). Budget-exhausted or incompletely accounted-for selection plans cannot be applied: narrow the selection or explicitly increase the limit and replan.

Review `.mini-a-wiki-absorb/plans/<id>.json` and its Markdown report for section-level before/after differences, source evidence, mappings, duplicate decisions and blocked pages. The plan ID is a checksum; do not edit saved plans. Change the specification or sources and generate a new plan instead. Human review remains necessary for semantic accuracy.

Planning changes no wiki pages, navigation indexes or ingestion state. With a read-only destination, use `wikiaccess=ro absorboutput=/outside/wiki/plans`. Reuse that `absorboutput` for subsequent operations and explicitly set `wikiaccess=rw` when applying. Artifact output must not overlap a source.

## Repeat runs, conflicts and recovery

Applied baselines record source support and exact destination bytes. Unchanged runs propose no content changes. Source revisions can update previously applied sections, while destination edits conservatively block the affected page. Original unrelated text and front matter are preserved.

Removal is limited to uniquely identifiable appended contributions supported exclusively by verified-removed sources under the same selection. Shared support, replaced original sections, narrowed selection, missing roots and local edits protect content. Whole-page deletion is not supported.

Apply checks plan integrity, destination identity, source inventories and hashes, and the baseline. Stale plans require replanning. Page-level findings block that page and its dependents; independent pages may still apply. Partial and failed jobs exit nonzero.

The [Wiki operations manager]({{ "/advanced#guided-operations-manager" | relative_url }}) and [Advanced web Absorb panel]({{ "/advanced#commands-and-operation-panels" | relative_url }}) expose the same plan review/apply/resume/delete actions and confirmation rules. Wiki auto-maintenance blocks on pending absorption and directs you to its existing recovery flow; it does not discard the journal or undo applied pages.

Ingestion, absorption and wiki maintenance share a local writer lock. Unfinished journals block competing writers; arbitrary external editors are not locked out, so avoid destination edits during apply. `resume` recognizes already-applied writes, refuses conflicting edits and retries finalization without regenerating proposals. Finalization regenerates indexes, refreshes configured retrieval/structural graph artifacts and runs link lint. Existing broken links can leave finalization pending until repaired.

`delete <id>` removes only the saved plan and report; `cancel` is an alias. Both require write access, preserve pages/baselines/receipts, and refuse a plan needed by unfinished recovery or a busy writer. They neither stop a running apply nor undo applied changes. The standalone equivalent is `absorbop=delete absorbplan=PLAN_ID`.

Remote backends, MCP/agent invocation and continuous synchronization are not supported. See [Configuration → Wiki absorption]({{ '/configuration#wiki-absorption' | relative_url }}) for parameters and [Wiki ingestion]({{ '/configuration#wiki-ingestion' | relative_url }}) for source-to-page ingestion.
