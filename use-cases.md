---
layout: page
title: Use Cases
permalink: /use-cases/
---

# Real-World Use Cases

mini-a is designed to be flexible enough for a wide range of tasks. Below are nine practical scenarios that demonstrate how to leverage the framework in real-world workflows, from DevOps automation to cost-optimized enterprise deployments.

---

<div class="use-case">

## 1. DevOps: Automated Log Analysis

### Context

Application logs are a critical source of truth when diagnosing production issues, but manually sifting through thousands of lines is time-consuming and error-prone. With mini-a, you can point an autonomous agent at your log files and let it identify error patterns, count occurrences, and even suggest remediation steps -- all in a single command.

### Command

```bash
mini-a useshell=true mcp="(cmd: 'ojob mcps/mcp-file.yaml root=/var/log')" \
  goal='Analyze /var/log/app.log for the last hour. Find error patterns, count occurrences, and suggest fixes.'
```

### How It Works

1. The agent uses the **mcp-file** MCP server to read the contents of `/var/log/app.log`.
2. It leverages shell access (`useshell=true`) to run commands like `grep`, `awk`, or `tail` to filter log entries from the last hour.
3. The LLM analyzes the filtered output, groups recurring error messages, counts their frequency, and cross-references known patterns.
4. A structured summary is produced with categorized errors, occurrence counts, and actionable fix suggestions.

### Expected Behavior

The agent reads the log file, identifies distinct error categories (e.g., connection timeouts, null pointer exceptions, authentication failures), ranks them by frequency, and provides a summary report. Each error category includes a suggested fix or investigation path. The output is presented directly in the terminal.

<div id="player-s16" style="border-radius:8px; overflow:hidden; border:1px solid rgba(160,174,192,0.3);"></div>
<script>AsciinemaPlayer.create("{{ '/assets/images/screenshots/s16-log-analysis.cast' | relative_url }}", document.getElementById('player-s16'), { cols: 127, rows: 24, autoPlay: true, loop: true, fit: 'width' });</script>

</div>

---

<div class="use-case">

## 2. Development: Code Review Assistant

### Context

Code reviews are essential for maintaining quality, but they can become a bottleneck in fast-moving teams. mini-a can serve as a first-pass reviewer, catching common bugs, security issues, and style violations before a human reviewer looks at the changes. Using `readonly=true` ensures the agent never modifies your code.

### Command

```bash
mini-a useshell=true readonly=true \
  goal='Review the git diff for the last commit. Check for bugs, security issues, and code style problems.'
```

### How It Works

1. The agent runs `git diff HEAD~1` via shell access to retrieve the changes from the most recent commit.
2. It parses the diff output, understanding which files were modified and what changed.
3. The LLM examines each change for potential bugs (off-by-one errors, unhandled exceptions), security concerns (hardcoded secrets, injection vulnerabilities), and style issues (naming conventions, code complexity).
4. Results are presented in a structured review format.

### Expected Behavior

The agent produces a review organized by file and change. Each finding includes the file name, line number range, severity level (info, warning, error), and a description of the issue with a suggested improvement. The `readonly=true` flag guarantees the agent only inspects code without making any modifications.

<div id="player-s17" style="border-radius:8px; overflow:hidden; border:1px solid rgba(160,174,192,0.3);"></div>
<script>AsciinemaPlayer.create("{{ '/assets/images/screenshots/s17-code-review.cast' | relative_url }}", document.getElementById('player-s17'), { cols: 127, rows: 24, autoPlay: true, loop: true, fit: 'width' });</script>

</div>

---

<div class="use-case">

## 3. Documentation: Auto-generate Project Docs

### Context

Keeping documentation in sync with code is a perpetual challenge. mini-a can scan your source files, extract function signatures, class definitions, and inline comments, then produce well-structured markdown documentation automatically. With `readwrite=true`, the agent can write the generated docs directly to your project.

### Command

```bash
mini-a useshell=true readwrite=true \
  goal='Scan all JavaScript files in src/ and generate API documentation in docs/api.md'
```

### How It Works

1. The agent uses shell commands to list and read all `.js` files under the `src/` directory.
2. It parses each file, identifying exported functions, classes, parameters, return types, and JSDoc comments.
3. The LLM organizes this information into a coherent API reference, grouping related functions and adding descriptions.
4. The final markdown document is written to `docs/api.md` using file write capabilities.

### Expected Behavior

The agent produces a `docs/api.md` file containing a table of contents, function signatures with parameter descriptions, return value documentation, and usage examples derived from inline comments. The documentation follows standard markdown formatting suitable for rendering on GitHub or any documentation site.

<div id="player-s18" style="border-radius:8px; overflow:hidden; border:1px solid rgba(160,174,192,0.3);"></div>
<script>AsciinemaPlayer.create("{{ '/assets/images/screenshots/s18-generated-docs.cast' | relative_url }}", document.getElementById('player-s18'), { cols: 127, rows: 24, autoPlay: true, loop: true, fit: 'width' });</script>

</div>

---

<div class="use-case">

## 4. Data Engineering: CSV/JSON Processing

### Context

Data cleaning and transformation is one of the most common tasks in data engineering. mini-a can process CSV and JSON files, applying complex transformations described in plain language. The `@` prefix attaches a file directly to the goal, making it available for the agent to work with immediately.

### Command

```bash
mini-a useshell=true useutils=true readwrite=true \
  goal='@sales_data.csv Clean this data: remove duplicates, fix date formats, calculate monthly totals, and save as sales_clean.csv'
```

### How It Works

1. The `@sales_data.csv` syntax attaches the file content to the goal, so the agent can inspect the data structure immediately.
2. The agent analyzes column headers, data types, and sample values to understand the dataset.
3. It writes and executes shell commands or inline scripts to remove duplicate rows, normalize date formats (e.g., converting mixed `MM/DD/YYYY` and `DD-MM-YYYY` to ISO 8601), and compute monthly aggregates.
4. The cleaned and enriched data is saved as `sales_clean.csv`.

### Expected Behavior

The agent produces a clean CSV file with duplicates removed, consistent date formatting, and appended monthly total rows. It also prints a summary to the terminal showing how many duplicates were found, which date formats were corrected, and the computed monthly totals. The original file remains untouched.

<div id="player-s19" style="border-radius:8px; overflow:hidden; border:1px solid rgba(160,174,192,0.3);"></div>
<script>AsciinemaPlayer.create("{{ '/assets/images/screenshots/s19-data-processing.cast' | relative_url }}", document.getElementById('player-s19'), { cols: 127, rows: 24, autoPlay: true, loop: true, fit: 'width' });</script>

</div>

---

<div class="use-case">

## 5. Security: Code Audit

### Context

Security vulnerabilities in application code can have severe consequences. mini-a can perform a first-pass security audit of your codebase, checking for common OWASP Top 10 vulnerabilities, insecure dependencies, and problematic coding patterns. The `readonly=true` flag ensures the audit is purely observational.

### Command

```bash
mini-a useshell=true readonly=true \
  goal='Audit the Node.js project in the current directory for OWASP Top 10 vulnerabilities. Check dependencies, SQL injection, XSS, and auth issues.'
```

### How It Works

1. The agent examines `package.json` and `package-lock.json` to identify dependencies with known vulnerabilities (it may also run `npm audit` if available).
2. It scans source files for patterns associated with SQL injection (string concatenation in queries), XSS (unsanitized user input in HTML output), broken authentication (weak session handling), and other OWASP Top 10 categories.
3. The LLM correlates findings across files, identifying attack chains where multiple minor issues combine into serious vulnerabilities.
4. Results are presented with severity ratings (Critical, High, Medium, Low) and remediation guidance.

### Expected Behavior

The agent produces a structured security report listing each vulnerability with its location (file and line), OWASP category, severity rating, a description of the risk, and a concrete remediation suggestion. Dependencies with known CVEs are flagged with links to advisory details. The report concludes with a prioritized action plan.

<div id="player-s20" style="border-radius:8px; overflow:hidden; border:1px solid rgba(160,174,192,0.3);"></div>
<script>AsciinemaPlayer.create("{{ '/assets/images/screenshots/s20-security-audit.cast' | relative_url }}", document.getElementById('player-s20'), { cols: 127, rows: 24, autoPlay: true, loop: true, fit: 'width' });</script>

</div>

---

<div class="use-case">

## 6. Education: Interactive Learning

### Context

mini-a's chatbot mode transforms the framework into a personalized tutor. By setting a custom persona with `youare` and enabling `chatbotmode`, you get an interactive learning session where you can ask questions, request examples, and work through exercises at your own pace.

### Command

```bash
mini-a chatbotmode=true \
  youare='a patient computer science tutor who uses analogies and examples' \
  goal='Teach me about binary search trees, starting from basics'
```

### How It Works

1. The agent enters chatbot mode, maintaining a conversational session rather than executing a one-shot goal.
2. The `youare` parameter shapes the agent's personality and teaching style, in this case emphasizing patience, analogies, and concrete examples.
3. The initial goal sets the topic, and the agent begins with foundational concepts before progressing to more advanced material.
4. You can ask follow-up questions, request code examples, or ask the agent to quiz you on what you have learned.

### Expected Behavior

The agent starts with an accessible explanation of what binary search trees are (using real-world analogies like a library card catalog), then progressively covers insertion, search, deletion, and balancing. It provides code examples in your preferred language, draws ASCII tree diagrams, and offers practice problems. The session continues interactively until you choose to end it.

<div id="player-s21" style="border-radius:8px; overflow:hidden; border:1px solid rgba(160,174,192,0.3);"></div>
<script>AsciinemaPlayer.create("{{ '/assets/images/screenshots/s21-interactive-teaching.cast' | relative_url }}", document.getElementById('player-s21'), { cols: 127, rows: 24, autoPlay: true, loop: true, fit: 'width' });</script>

</div>

---

<div class="use-case">

## 7. Integration: CI/CD Pipeline with oJob

### Context

mini-a integrates naturally into automated workflows through oJob, OpenAF's job orchestration system. This allows you to embed AI-powered steps into your CI/CD pipelines, such as automated PR reviews, changelog generation, or deployment validation. Jobs can be chained with dependencies, and results can be written to files or passed between stages.

### oJob Definition

```yaml
init:
  model: "(type: openai, model: gpt-5.2, key: '...')"

jobs:
  - name: Review PR
    exec: |
      var review = $mini_a({
        goal: "Review the changes in " + args.prBranch + " vs main. Focus on bugs and security.",
        model: args.init.model,
        useshell: true,
        readonly: true
      });
      ow.loadObj();
      io.writeFileString("review-report.md", review.output);

  - name: Generate Changelog
    deps: Review PR
    exec: |
      var changelog = $mini_a({
        goal: "Generate a changelog entry from the git log since the last tag",
        model: args.init.model,
        useshell: true
      });
      print(changelog.output);
```

### How It Works

1. The **Review PR** job invokes mini-a programmatically via `$mini_a()`, passing the PR branch name and requesting a security-focused review in read-only mode.
2. The review output is written to `review-report.md`, which can be uploaded as a CI artifact or posted as a PR comment.
3. The **Generate Changelog** job depends on the review completing first. It uses mini-a to parse the git log and produce a human-readable changelog entry.
4. The `init` block defines the model once, and all jobs reference it through `args.init.model` for consistency.

### Expected Behavior

When triggered as part of a CI/CD pipeline (e.g., on pull request creation), the workflow automatically generates a code review report and a changelog entry. The review report is saved as a markdown file, and the changelog is printed to the pipeline output. Teams can extend this pattern with additional jobs for deployment checks, documentation updates, or notification steps.

<div id="player-s22" style="border-radius:8px; overflow:hidden; border:1px solid rgba(160,174,192,0.3);"></div>
<script>AsciinemaPlayer.create("{{ '/assets/images/screenshots/s22-cicd-pipeline.cast' | relative_url }}", document.getElementById('player-s22'), { cols: 127, rows: 24, autoPlay: true, loop: true, fit: 'width' });</script>

</div>

---

<div class="use-case">

## 8. Multi-Agent Orchestration: Distributed Incident Triage

### Context

When incident volume spikes, triage work often spans multiple systems: logs, tickets, deployment history, and service dashboards. mini-a delegation lets a parent agent orchestrate specialized child agents in parallel, then merge their outputs into one coordinated response plan.

### Command

```bash
mini-a useplanning=true planstyle=validate usedelegation=true \
  workers='http://worker1:9090,http://worker2:9090' maxconcurrent=4 \
  goal='Investigate the last 24h production incidents, identify top root causes, and propose a prioritized remediation plan'
```

### How It Works

1. The parent agent builds a validated plan (`planstyle=validate`) and identifies independent workstreams.
2. Delegation dispatches sub-tasks to local child agents and remote workers listed in `workers`.
3. Worker agents run in parallel (bounded by `maxconcurrent`) and return structured intermediate results.
4. The parent agent reconciles overlaps, resolves conflicts, and produces one final triage report with next actions.

### Expected Behavior

The final output contains grouped root causes (for example deploy regressions, infra saturation, and dependency outages), confidence levels, and a prioritized remediation queue with owners and suggested follow-up checks. Compared to fully serial triage, parallel delegation shortens time-to-report while keeping one coherent, centralized result.

<div id="player-s23" style="border-radius:8px; overflow:hidden; border:1px solid rgba(160,174,192,0.3);"></div>
<script>AsciinemaPlayer.create("{{ '/assets/images/screenshots/s23-delegation.cast' | relative_url }}", document.getElementById('player-s23'), { cols: 127, rows: 24, autoPlay: true, loop: true, fit: 'width' });</script>

</div>

---

<div class="use-case">

## 9. Cost Optimization: Enterprise Dual-Model Strategy

### Context

In high-volume enterprise environments, running every task through a premium model can become expensive. mini-a supports a dual-model strategy where a smaller, cheaper model handles routine tasks (classification, routing, simple transformations) while a larger model is reserved for complex reasoning. This can reduce costs significantly without sacrificing quality on tasks that matter.

### Setup

Configure the dual-model strategy using environment variables:

```bash
export OAF_MODEL="(type: openai, model: gpt-5.2, key: '...')"
export OAF_LC_MODEL="(type: openai, model: gpt-5-mini, key: '...')"
```

Then run the agent with your goal:

```bash
mini-a useshell=true mcp="(cmd: 'ojob mcps/mcp-db.yaml jdbc=jdbc:h2:./support user=sa pass=sa')" \
  goal='Process all support tickets in the database, categorize them, and generate a summary report'
```

### How It Works

1. **OAF_MODEL** sets the primary model (e.g., `(type: openai, model: gpt-5.2, key: '...')`) used for complex reasoning tasks such as nuanced analysis, report generation, and multi-step problem solving.
2. **OAF_LC_MODEL** sets the lightweight model (e.g., `(type: openai, model: gpt-5-mini, key: '...')`) used for simpler operations such as ticket categorization, data extraction, and routing decisions.
3. mini-a automatically routes tasks to the appropriate model based on complexity. Routine classification and data parsing go to the lightweight model, while synthesis and recommendation tasks go to the primary model.
4. The **mcp-db** MCP server provides database access, allowing the agent to query support tickets directly.

### Cost Breakdown

| Task | Model Used | Relative Cost |
|------|-----------|---------------|
| Ticket categorization | gpt-5-mini (LMODEL) | Low |
| Data extraction & parsing | gpt-5-mini (LMODEL) | Low |
| Pattern analysis | gpt-5.2 (MODEL) | Standard |
| Summary report generation | gpt-5.2 (MODEL) | Standard |
| Recommendations | gpt-5.2 (MODEL) | Standard |

For a batch of 500 support tickets, this strategy typically routes 60-70% of LLM calls to the lightweight model, resulting in substantial cost savings compared to using the primary model exclusively.

### Monitoring with Metrics

Use the `/metrics` endpoint to track model usage and cost distribution across your deployment:

```
Model Usage Summary
-------------------
Primary model (gpt-5.2):      142 calls  |  38% of total
Lightweight model (gpt-5-mini): 231 calls  |  62% of total

Token Usage
-----------
Primary model:     284,000 tokens
Lightweight model: 462,000 tokens

Estimated Cost Savings: ~45% vs single-model deployment
```

This visibility helps teams fine-tune their model selection and monitor spend over time.

<div id="player-s24" style="border-radius:8px; overflow:hidden; border:1px solid rgba(160,174,192,0.3);"></div>
<script>AsciinemaPlayer.create("{{ '/assets/images/screenshots/s24-cost-metrics.cast' | relative_url }}", document.getElementById('player-s24'), { cols: 127, rows: 24, autoPlay: true, loop: true, fit: 'width' });</script>

</div>

---

## Have a Use Case to Share?

These examples only scratch the surface of what mini-a can do. If you have built something interesting with mini-a -- whether it is automating a workflow, integrating it into a larger system, or using it in a creative way -- we would love to hear about it.

Visit the [mini-a GitHub repository](https://github.com/OpenAF/mini-a) to open an issue, start a discussion, or contribute your use case to the documentation.
