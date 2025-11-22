---
layout: page
title: Advanced Usage
permalink: /advanced/
---

Master mini-a's advanced features for maximum efficiency and capability.

## Dual-Model Setup

The dual-model system is one of mini-a's most powerful features for cost optimization.

### Concept

mini-a can use two models simultaneously:

- **Main Model** (`OAF_MODEL`): High-capability model (e.g., GPT-4o, Claude Opus)
- **Low-Cost Model** (`OAF_LC_MODEL`): Efficient model (e.g., GPT-4o-mini, Gemini Flash)

The system automatically escalates from the low-cost to the main model when needed.

### Configuration

```bash
# Main model (high capability)
export OAF_MODEL="(type: openai, model: gpt-4o, key: 'sk-...')"

# Low-cost model (efficient)
export OAF_LC_MODEL="(type: openai, model: gpt-4o-mini, key: 'sk-...')"
```

### When to Escalate

mini-a escalates to the main model when:

1. Complex reasoning required
2. Low-cost model indicates uncertainty
3. Task involves critical decisions
4. Previous attempt with low-cost model failed

### Cost Savings

Real-world examples:

| Task Type | Single Model | Dual Model | Savings |
|-----------|--------------|------------|---------|
| Simple queries | $0.001 | $0.001 | 0% |
| Data analysis | $0.05 | $0.02 | 60% |
| Code generation | $0.15 | $0.06 | 60% |
| Complex reasoning | $0.50 | $0.20 | 60% |

**Average savings: 50-70%** with maintained quality.

### Best Practices

1. **Start with low-cost**: Let the system escalate when needed
2. **Match providers**: Use same provider for both models for consistency
3. **Monitor usage**: Track when escalations occur
4. **Adjust timeouts**: Increase if needed for complex tasks

💡 *Suggestion: Add graph/chart showing cost comparison over time*

## MCP Advanced Topics

### MCP Proxy Mode

When using multiple MCP servers, the proxy mode aggregates all tools into a single interface.

**Without proxy** (multiple tools visible to LLM):
```bash
mini-a goal="task" \
  mcp="[(cmd: 'server1'), (cmd: 'server2')]"
```
LLM sees: `time_get`, `time_convert`, `finance_stock`, `finance_forex`, etc.

**With proxy** (single aggregated tool):
```bash
mini-a goal="task" \
  mcpproxy=true \
  mcp="[(cmd: 'server1'), (cmd: 'server2')]"
```
LLM sees: `proxy-dispatch` (with all tools accessible through it)

### Benefits of MCP Proxy

1. **Reduced Context**: Fewer tools in LLM context
2. **Token Efficiency**: Less prompt overhead
3. **Simplified Reasoning**: Single tool interface
4. **Scalability**: Add MCPs without context bloat

### Custom MCP Servers

Create your own MCP servers using OpenAF:

```yaml
# my-mcp.yaml
jobs:
  - name: init
    exec: |
      var mcp = require("mini-a-mcp");
      
      mcp.server({
        tools: {
          my_tool: {
            description: "My custom tool",
            parameters: {
              input: { type: "string", description: "Input value" }
            },
            handler: function(params) {
              return "Result: " + params.input;
            }
          }
        }
      });
```

Use it:
```bash
mini-a goal="test my tool" mcp="(cmd: 'ojob my-mcp.yaml')"
```

### Remote MCP Servers

Connect to HTTP-based MCP servers:

```bash
mini-a goal="task" \
  mcp="(type: remote, url: 'http://localhost:9090/mcp', timeout: 10000)"
```

### Multiple Remote MCPs

```bash
mini-a goal="task" \
  mcpproxy=true \
  mcp="[
    (type: remote, url: 'http://server1:9090/mcp'),
    (type: remote, url: 'http://server2:9090/mcp')
  ]"
```

💡 *Suggestion: Add architecture diagram showing MCP proxy flow*

## Performance Optimizations

mini-a includes automatic optimizations that work with zero configuration.

### Automatic Features

#### 1. Context Management

- **Smart Pruning**: Removes redundant history
- **Selective Retention**: Keeps important context
- **Compression**: Condenses repeated information

#### 2. Dynamic Escalation

- **Task Analysis**: Evaluates complexity
- **Smart Routing**: Chooses appropriate model
- **Fallback Handling**: Recovers from failures

#### 3. Parallel Actions

- **Concurrent Tools**: Multiple tools at once
- **Batch Processing**: Group similar operations
- **Async Execution**: Non-blocking operations

#### 4. Response Optimization

- **Compact Format**: Efficient output structure
- **Streaming**: Real-time delivery
- **Caching**: Reuse common data

### Results

- **40-60% token reduction**
- **50-70% cost savings** (with dual-model)
- **Faster response times**
- **Better scalability**

### Manual Optimization

For long sessions, use conversation management:

```
/compact 5     # Condense older messages, keep last 5
/summarize 3   # Summarize conversation, keep last 3
```

### Configuration Options

Fine-tune optimization behavior:

```bash
mini-a goal="task" \
  maxcontext=100000 \      # Maximum context tokens
  maxtokens=4096 \         # Maximum response tokens
  temperature=0.7 \        # Response creativity (0-2)
  usethinking=true        # Enable chain-of-thought
```

💡 *Suggestion: Add asciinema showing optimization impact on a long session*

## Advanced Shell Usage

### Safe Shell Access

Shell access is powerful but requires care:

```bash
# Disabled by default (safe)
mini-a goal="list files"  # Won't execute

# Enable explicitly
mini-a goal="list files" useshell=true
```

### Shell Best Practices

1. **Review Goals**: Understand what will execute
2. **Limit Scope**: Be specific about operations
3. **Use Docker**: Run in isolated containers
4. **Monitor Output**: Watch for unexpected behavior

### Docker Isolation

Run with shell in Docker for safety:

```bash
docker run --rm -ti \
  -e OPACKS=mini-a -e OPACK_EXEC=mini-a \
  -e OAF_MODEL="..." \
  openaf/oaf:edge \
  goal="your goal" useshell=true
```

## Library Integration

Use mini-a programmatically in OpenAF scripts:

### Basic Usage

```javascript
// Load mini-a
ow.loadAI();

// Simple execution
var result = $a.mini({
  goal: "Analyze this data",
  useshell: false
});

print(result);
```

### With Options

```javascript
var result = $a.mini({
  goal: "Complex task",
  useshell: true,
  chatbotmode: true,
  mcp: {
    cmd: "ojob mcps/mcp-time.yaml",
    timeout: 5000
  },
  maxcontext: 100000,
  maxtokens: 4096
});
```

### In oJob Workflows

```yaml
jobs:
  - name: analyze-data
    exec: |
      ow.loadAI();
      
      var analysis = $a.mini({
        goal: "Analyze @data.csv and provide insights",
        useshell: true
      });
      
      // Use the results
      args.analysis = analysis;

  - name: generate-report
    deps: analyze-data
    exec: |
      var report = $a.mini({
        goal: "Create a markdown report from: " + args.analysis,
        chatbotmode: false
      });
      
      io.writeFileString("report.md", report);
```

### Error Handling

```javascript
try {
  var result = $a.mini({
    goal: "risky operation",
    useshell: true
  });
  print("Success: " + result);
} catch(e) {
  print("Error: " + e.message);
}
```

## Planning Workflows

mini-a can handle complex multi-step planning:

### Planning Parameters

```bash
mini-a goal="complex goal" \
  useplanning=true \           # Enable planning mode
  planningiterations=10 \      # Max planning steps
  usethinking=true            # Enable reasoning
```

### Planning Process

1. **Goal Analysis**: Break down the objective
2. **Step Generation**: Create action plan
3. **Execution**: Run steps sequentially
4. **Validation**: Verify results
5. **Iteration**: Adjust and continue

### Example

```bash
mini-a goal="Create a REST API with authentication, database, and tests" \
  useshell=true \
  useplanning=true \
  planningiterations=20
```

The agent will:
1. Plan the project structure
2. Create necessary files
3. Implement authentication
4. Set up database
5. Write tests
6. Verify everything works

💡 *Suggestion: Add flowchart showing planning workflow*

## Custom Tools

Extend mini-a with custom tools:

### JavaScript Tools

```javascript
// custom-tools.js
var customTools = {
  tools: [{
    type: "function",
    function: {
      name: "analyze_sentiment",
      description: "Analyze sentiment of text",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Text to analyze"
          }
        },
        required: ["text"]
      }
    }
  }],
  handlers: {
    analyze_sentiment: function(params) {
      // Your implementation
      return { sentiment: "positive", score: 0.8 };
    }
  }
};

module.exports = customTools;
```

Use it:
```bash
mini-a goal="analyze sentiment" \
  libs="@custom-tools.js"
```

### YAML Tools

```yaml
# custom-tools.yaml
tools:
  - type: function
    function:
      name: my_tool
      description: My custom tool
      parameters:
        type: object
        properties:
          input:
            type: string
            description: Input value
        required: [input]

handlers:
  my_tool: |
    function(params) {
      return "Processed: " + params.input;
    }
```

## Model Manager Advanced

### Encrypted Storage

The model manager stores API keys encrypted:

```bash
mini-a modelman=true
```

Features:
- **Create**: Define new models
- **Import**: Load from SLON/JSON
- **Export**: Share configurations (without keys)
- **Rename**: Organize models
- **Delete**: Remove unused configs

### Model Switching

Quick switch between models:

```bash
# List available models
mini-a modelman=true

# Export for use
export OAF_MODEL="<selected model config>"
```

### Sharing Configurations

Export without sensitive data:

```bash
# Export as SLON (safe to share)
# Use model manager export feature
```

## Debugging and Troubleshooting

### Debug Mode

Enable detailed logging:

```bash
mini-a goal="task" debug=true
```

Shows:
- Model selection decisions
- Token usage per request
- Tool invocations
- Error details
- Timing information

### Logging

Control log levels:

```bash
mini-a goal="task" \
  loglevel=DEBUG \    # DEBUG, INFO, WARN, ERROR
  logfile="mini-a.log"
```

### Performance Monitoring

Track resource usage:

```bash
mini-a goal="task" \
  showstats=true     # Display token/cost stats
```

## Web Interface Advanced

### Custom Port

```bash
./mini-a-web.sh onport=8888
```

### Authentication

Add basic auth:

```bash
./mini-a-web.sh onport=8888 \
  auth="username:password"
```

### Multiple Users

Run multiple instances:

```bash
# User 1
./mini-a-web.sh onport=8888

# User 2
./mini-a-web.sh onport=8889
```

### Reverse Proxy

Behind nginx:

```nginx
location /mini-a/ {
  proxy_pass http://localhost:8888/;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_cache_bypass $http_upgrade;
}
```

💡 *Suggestion: Add screenshot of web interface with custom branding*

## AWS Bedrock Integration

### Configuration

```bash
export OAF_MODEL="(
  type: bedrock,
  model: anthropic.claude-3-sonnet-20240229-v1:0,
  region: us-east-1,
  timeout: 120000
)"
```

### Credentials

Use AWS credentials:
- Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
- IAM roles (when running on EC2/ECS)
- AWS credentials file (`~/.aws/credentials`)

### Available Models

- Claude 3 (Opus, Sonnet, Haiku)
- Llama models
- Mistral models
- And more...

## GitHub Models

Free access to various models:

```bash
export OAF_MODEL="(
  type: github,
  model: gpt-4o-mini,
  key: 'ghp_...',
  timeout: 120000
)"
```

Available models:
- GPT-4o, GPT-4o-mini
- Llama 3
- Mistral
- Phi-3

## Local Models with Ollama

Run models locally:

```bash
# Start Ollama
ollama run llama3

# Configure mini-a
export OAF_MODEL="(
  type: ollama,
  model: llama3,
  url: 'http://localhost:11434',
  timeout: 120000
)"
```

Benefits:
- **Privacy**: Data stays local
- **Cost**: No API fees
- **Offline**: Works without internet
- **Customization**: Fine-tune models

---

## Next Steps

- [**Configuration Reference**]({{ '/configuration.html' | relative_url }}) - Complete parameter guide
- [**Examples**]({{ '/examples.html' | relative_url }}) - More practical examples
- [**GitHub Repository**](https://github.com/OpenAF/mini-a) - Source code and contributions

## Further Reading

- [USAGE.md](https://github.com/OpenAF/mini-a/blob/main/USAGE.md) - Comprehensive usage guide
- [OPTIMIZATIONS.md](https://github.com/OpenAF/mini-a/blob/main/docs/OPTIMIZATIONS.md) - Deep dive into optimizations
- [MCPPROXY-FEATURE.md](https://github.com/OpenAF/mini-a/blob/main/docs/MCPPROXY-FEATURE.md) - MCP proxy details
- [CHEATSHEET.md](https://github.com/OpenAF/mini-a/blob/main/CHEATSHEET.md) - Quick reference
