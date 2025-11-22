---
layout: page
title: Examples
permalink: /examples/
---

Learn mini-a through practical examples. Each example includes the command and explanation.

## Basic Examples

### File Operations

**List files matching a pattern:**

```bash
mini-a goal="list all JavaScript files in this directory" useshell=true
```

**Find large files:**

```bash
mini-a goal="find all PDF files larger than 1MB in the current directory" useshell=true
```

**Analyze file structure:**

```bash
mini-a goal="Analyze the project structure in @package.json and list the main dependencies"
```

💡 *Suggestion: Add asciinema recording showing file operations here*

### Data Processing

**Parse and summarize JSON:**

```bash
mini-a goal="Read @data.json, summarize the key statistics, and create a markdown report"
```

**CSV analysis:**

```bash
mini-a goal="Analyze @sales.csv and tell me the top 5 products by revenue" useshell=true
```

**Log file analysis:**

```bash
mini-a goal="Analyze @error.log and summarize the most common errors with their frequencies" useshell=true
```

### Text Processing

**Generate documentation:**

```bash
mini-a goal="Read @src/api.js and generate API documentation in markdown format"
```

**Code review:**

```bash
mini-a goal="Review the code in @app.js and suggest improvements for readability and performance"
```

**Translation:**

```bash
mini-a goal="Translate @README.md to Spanish and save as README.es.md" useshell=true
```

## MCP Server Examples

### Time and Date Operations

**Get current time in different timezones:**

```bash
mini-a goal="what time is it in Sydney?" \
  mcp="(cmd: 'ojob mcps/mcp-time.yaml', timeout: 5000)"
```

**Calculate time differences:**

```bash
mini-a goal="How many hours between 9 AM Tokyo and 2 PM London?" \
  mcp="(cmd: 'ojob mcps/mcp-time.yaml')"
```

### Multiple MCP Servers

**Aggregate data from multiple sources:**

```bash
mini-a goal="compare release dates across APIs" \
  usetools=true mcpproxy=true \
  mcp="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-fin.yaml')]" \
  useutils=true
```

The `mcpproxy=true` option combines all MCP servers into a single tool interface, keeping context lean.

### Testing MCP Servers

**Interactive MCP testing:**

```bash
mini-a mcptest=true
```

**Test specific server:**

```bash
mini-a mcptest=true mcp="(cmd: 'ojob mcps/mcp-time.yaml')"
```

**Test remote HTTP MCP server:**

```bash
mini-a mcptest=true mcp="(type: remote, url: 'http://localhost:9090/mcp')"
```

💡 *Suggestion: Add asciinema recording of MCP testing workflow here*

## Advanced Examples

### Chatbot Conversations

**Planning assistant:**

```bash
mini-a goal="help me plan a vacation in Lisbon" chatbotmode=true
```

In chatbot mode, mini-a maintains context across multiple turns of conversation.

**Technical advisor:**

```bash
mini-a goal="I need help designing a REST API" chatbotmode=true
```

### Git and Version Control

**Generate changelog:**

```bash
mini-a goal="Generate a changelog from the last 50 git commits, categorized by type (features, fixes, docs)" useshell=true
```

**Analyze repository:**

```bash
mini-a goal="Analyze this git repository and provide statistics about contributors, commit frequency, and most changed files" useshell=true
```

### Code Generation

**Create boilerplate:**

```bash
mini-a goal="Create a basic Express.js API with user authentication endpoints" useshell=true
```

**Generate tests:**

```bash
mini-a goal="Read @src/calculator.js and generate unit tests using Jest" useshell=true
```

**Refactor code:**

```bash
mini-a goal="Refactor @legacy.js to use modern ES6+ features and async/await" useshell=true
```

### Documentation Generation

**README generator:**

```bash
mini-a goal="Analyze this project and create a comprehensive README.md with installation, usage, and examples" useshell=true
```

**API documentation:**

```bash
mini-a goal="Generate OpenAPI/Swagger documentation from the Express routes in @routes/" useshell=true
```

**Code comments:**

```bash
mini-a goal="Add JSDoc comments to all functions in @src/utils.js" useshell=true
```

💡 *Suggestion: Add screenshot showing before/after of generated documentation*

## Integration Examples

### Docker Workflows

**Run in Docker container:**

```bash
docker run --rm -ti \
  -e OPACKS=mini-a -e OPACK_EXEC=mini-a \
  -e OAF_MODEL="(type: openai, model: gpt-5.1, key: '...')" \
  openaf/oaf:edge \
  goal="list environment variables" useshell=true
```

**Web interface in Docker:**

```bash
docker run -d --rm \
  -e OPACKS=mini-a -e OPACK_EXEC=mini-a \
  -e OAF_MODEL="(type: openai, model: gpt-5.1, key: '...')" \
  -p 8888:8888 \
  openaf/oaf:edge onport=8888
```

### oJob Integration

**Use mini-a in oJob workflows:**

```yaml
jobs:
  - name: analyze-logs
    exec: |
      var result = $a.mini({
        goal: "Analyze error.log and identify critical issues",
        useshell: true
      });
      
      print("Analysis: " + result);

  - name: generate-report
    deps: analyze-logs
    exec: |
      var report = $a.mini({
        goal: "Create a summary report of the log analysis",
        chatbotmode: true
      });
      
      io.writeFileString("report.md", report);
```

### Pipeline Examples

**Multi-step data processing:**

```bash
mini-a goal="1) Read @raw-data.csv, 2) Clean and validate the data, 3) Generate summary statistics, 4) Create visualizations in markdown" useshell=true
```

**Automated analysis:**

```bash
mini-a goal="Monitor @logs/ directory, analyze new entries, and alert if error rate exceeds 5%" useshell=true
```

## Real-World Use Cases

### 1. Project Documentation

Automatically generate documentation for your project:

```bash
mini-a goal="Create comprehensive documentation for this project including: 1) Overview from package.json, 2) Installation instructions, 3) Usage examples from @examples/, 4) API reference from @src/, 5) Contributing guidelines" useshell=true
```

### 2. Log Analysis

Analyze application logs:

```bash
mini-a goal="Analyze @application.log from the last 24 hours, identify patterns, error frequencies, and provide actionable recommendations" useshell=true
```

### 3. Code Audit

Review code for security and quality:

```bash
mini-a goal="Audit @src/ for security vulnerabilities, code smells, and suggest improvements with priority levels" useshell=true
```

### 4. Data Migration

Plan and validate migrations:

```bash
mini-a goal="Compare @schema-old.sql and @schema-new.sql, generate a migration plan with potential risks highlighted"
```

### 5. Test Generation

Create comprehensive test suites:

```bash
mini-a goal="Analyze @src/api/ and generate integration tests covering all endpoints with edge cases" useshell=true
```

💡 *Suggestion: Add video demonstration of a complete real-world workflow here*

### 6. Content Generation

Create technical content:

```bash
mini-a goal="Read @API-SPEC.yaml and write a tutorial blog post explaining how to use this API with code examples"
```

### 7. Configuration Management

Validate and optimize configurations:

```bash
mini-a goal="Review @docker-compose.yml and @.env.example, suggest optimizations for production deployment"
```

### 8. Debugging Assistant

Get help with debugging:

```bash
mini-a goal="Analyze the error stack trace in @error.txt and suggest potential causes and fixes based on @src/main.js" useshell=true chatbotmode=true
```

## Performance Tips

### Using Low-Cost Models

For simple tasks, use a low-cost model:

```bash
export OAF_MODEL="(type: openai, model: gpt-5.1, key: '...')"
mini-a goal="simple task here"
```

### Dual-Model Setup

For complex tasks with cost optimization:

```bash
export OAF_MODEL="(type: openai, model: gpt-5.1, key: '...')"
export OAF_LC_MODEL="(type: openai, model: gpt-5-mini, key: '...')"
mini-a goal="complex multi-step task here"
```

### Conversation Management

For long sessions, use `/compact` or `/summarize`:

```
/compact 5    # Keep last 5 exchanges, summarize the rest
/summarize 3  # Create narrative summary, keep last 3 exchanges
```

## Example Gallery

Here are some impressive examples from the community:

### Automated Changelog Generator

```bash
mini-a goal="Generate a structured CHANGELOG.md from git history with categorized commits (features, fixes, breaking changes)" useshell=true
```

See [examples/changelog-gen.yaml](https://github.com/OpenAF/mini-a/blob/main/examples/changelog-gen.yaml) for the full implementation.

### Folder Summary Report

```bash
mini-a goal="Analyze current directory and create a summary report with file statistics, languages used, and structure visualization" useshell=true
```

See [examples/summary.yaml](https://github.com/OpenAF/mini-a/blob/main/examples/summary.yaml) for the full implementation.

### Interactive Learning

```bash
mini-a goal="Teach me about Docker concepts through interactive Q&A" chatbotmode=true
```

See [examples/learn-from-chat.yaml](https://github.com/OpenAF/mini-a/blob/main/examples/learn-from-chat.yaml) for the full implementation.

---

## Next Steps

- [**Advanced Usage**]({{ '/advanced.html' | relative_url }}) - Learn about dual-model setup, MCP proxy, and optimizations
- [**Configuration**]({{ '/configuration.html' | relative_url }}) - Complete parameter reference
- [**GitHub Repository**](https://github.com/OpenAF/mini-a) - Explore more examples and contribute

## Try It Yourself

The best way to learn is by doing. Start with simple goals and gradually increase complexity. Don't forget to:

1. Start with `useshell=false` (default) for safety
2. Enable shell when needed with `useshell=true`
3. Use `chatbotmode=true` for interactive sessions
4. Try MCP servers for specialized data access
5. Experiment with dual-model setup for cost optimization

💡 *Suggestion: Add a "Try mini-a Now" interactive demo widget here*
