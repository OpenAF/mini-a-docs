---
layout: page
title: Features
permalink: /features/
---

mini-a is packed with powerful features while maintaining simplicity and ease of use.

## 🤖 Multi-Model Support

mini-a works with virtually any LLM provider:

### Supported Providers

- **OpenAI** - GPT-5.1, GPT-5, GPT-4.1
- **Google** - Gemini Pro, Gemini Flash
- **Anthropic** - Claude 4, 4.5 (Opus, Sonnet, Haiku)
- **AWS Bedrock** - Access to multiple models through AWS
- **GitHub Models** - Free access to various models
- **Ollama** - Local models (Llama, Mistral, etc.)
- **OpenAI-compatible APIs** - Any compatible endpoint

### Switching Models

Simply change your `OAF_MODEL` configuration:

```bash
# OpenAI
export OAF_MODEL="(type: openai, model: gpt-5.1, key: 'sk-...')"

# Google Gemini
export OAF_MODEL="(type: google, model: gemini-1.5-flash-latest, key: '...')"

# Local Ollama
export OAF_MODEL="(type: ollama, model: llama3, url: 'http://localhost:11434')"

# AWS Bedrock
export OAF_MODEL="(type: bedrock, model: anthropic.claude-3-sonnet-20240229-v1:0, region: us-east-1)"
```

## 💰 Dual-Model Cost Optimization

One of mini-a's most powerful features is the ability to use two models simultaneously:

- **Main Model**: High-capability model for complex reasoning
- **Low-Cost Model**: Efficient model for routine tasks

### How It Works

mini-a automatically:
1. Uses the low-cost model for routine operations
2. Escalates to the main model when needed
3. Reduces costs by 50-70% while maintaining quality

### Setup

```bash
# Main model (high capability)
export OAF_MODEL="(type: openai, model: gpt-4o, key: 'sk-...')"

# Low-cost model (efficient)
export OAF_LC_MODEL="(type: openai, model: gpt-5.1, key: 'sk-...')"
```

**Cost Savings Example:**
- Single model: ~$0.50 per complex task
- Dual model: ~$0.15 per complex task
- **Savings: 70%**

Learn more in the [Advanced Usage]({{ '/advanced.html' | relative_url }}#dual-model-setup) section.

## ⚡ Performance Optimizations

mini-a includes built-in optimizations that work automatically:

### Automatic Token Reduction
- **40-60% fewer tokens** used per session
- **50-70% cost reduction** with dual-model setup
- **Zero configuration** required

### Key Optimizations

1. **Context Management**: Intelligent conversation history pruning
2. **Dynamic Escalation**: Smart model switching based on task complexity
3. **Parallel Actions**: Execute multiple tools simultaneously
4. **Compact Responses**: Efficient output formatting
5. **Smart Caching**: Reuse of common context

💡 *See the [Optimizations Deep Dive](https://github.com/OpenAF/mini-a/blob/main/docs/OPTIMIZATIONS.md) for details*

## 🔌 MCP Integration

mini-a seamlessly integrates with Model Context Protocol (MCP) servers.

### What is MCP?

MCP is a standard protocol for connecting AI models to external tools and data sources.

### MCP Support

- **STDIO Servers**: Local command-based servers
- **HTTP Remote Servers**: Network-accessible servers
- **Multiple MCPs**: Use several servers simultaneously
- **MCP Proxy**: Aggregate multiple servers under a single tool

### Example Usage

```bash
# Single MCP server
mini-a goal="what time is it in Sydney?" \
  mcp="(cmd: 'ojob mcps/mcp-time.yaml', timeout: 5000)"

# Multiple MCP servers with proxy
mini-a goal="compare release dates across APIs" \
  usetools=true mcpproxy=true \
  mcp="[(cmd: 'ojob mcps/mcp-time.yaml'), (cmd: 'ojob mcps/mcp-fin.yaml')]"
```

### Testing MCP Servers

mini-a includes an interactive MCP tester:

```bash
mini-a mcptest=true mcp="(cmd: 'ojob mcps/mcp-time.yaml')"
```

Features:
- Test connections to STDIO and HTTP MCP servers
- List available tools
- Inspect tool parameters
- Call tools interactively
- Debug MCP integrations

💡 *Suggestion: Add asciinema recording of MCP testing session here*

## 🛠️ Flexible Tool System

### Shell Commands

Execute system commands (opt-in for security):

```bash
mini-a goal="list all PDF files larger than 1MB" useshell=true
```

### Built-in Utilities

Enable helpful utilities with `useutils=true`:

- File operations
- Text processing
- Data manipulation
- System information

### Custom Tools

Define your own tools in YAML or JavaScript for specialized tasks.

## 💬 Multiple Interfaces

### 1. Console (CLI)

Interactive command-line interface:

```bash
mini-a
```

Features:
- Tab completion for file paths
- Slash commands for control
- Conversation management
- History and context control

### 2. Web Interface

Modern browser-based UI:

```bash
./mini-a-web.sh onport=8888
```

Features:
- Clean, responsive design
- Real-time streaming responses
- File upload support
- Session management

💡 *Suggestion: Add screenshots showing console features and web UI interactions here*

### 3. Library/API

Use mini-a programmatically in your oJob workflows:

```yaml
jobs:
  - name: analyze-data
    exec: |
      var result = $a.mini({
        goal: "Analyze this data and provide insights",
        useshell: false,
        chatbotmode: true
      });
```

## 🤖 Chatbot Mode

Enable conversational mode for interactive sessions:

```bash
mini-a goal="help me plan a vacation in Lisbon" chatbotmode=true
```

Perfect for:
- Multi-turn conversations
- Exploratory discussions
- Planning sessions
- Iterative refinement

## 🐳 Docker Support

Run mini-a in containers for:
- **Isolation**: Safe execution environment
- **Portability**: Run anywhere Docker runs
- **Consistency**: Same environment every time
- **Scalability**: Easy to deploy multiple instances

### Quick Docker Run

```bash
docker run --rm -ti \
  -e OPACKS=mini-a -e OPACK_EXEC=mini-a \
  -e OAF_MODEL="(type: openai, model: gpt-5.1, key: '...')" \
  openaf/oaf:edge
```

## 📊 Planning & Task Management

mini-a can handle complex multi-step tasks:

- **Automatic Planning**: Breaks down complex goals
- **Step-by-step Execution**: Shows progress
- **Error Recovery**: Handles failures gracefully
- **Context Retention**: Remembers across steps

## 🔒 Security Features

- **Shell disabled by default**: Opt-in for command execution
- **Encrypted model storage**: Model manager keeps keys safe
- **Sandboxed execution**: Docker support for isolation
- **Audit logging**: Track all actions taken

## 📝 Conversation Management

Built-in tools for managing long conversations:

### Compact Mode

```
/compact 5
```
Condenses older messages while keeping the last 5 exchanges.

### Summarization

```
/summarize 3
```
Creates a narrative summary while preserving the last 3 messages.

### Benefits
- Reduced token usage
- Lower costs
- Maintain context
- Continue long sessions

## 🎯 File Integration

Include files directly in your goals:

```bash
mini-a goal="Analyze this code @src/main.js and suggest improvements"
```

Supports:
- Code files
- Documentation
- Data files
- Configuration files

## 📈 Usage Tracking

mini-a provides visibility into:
- Token usage per request
- Cost estimation
- Model switching events
- Performance metrics

## 🔄 Streaming Responses

Real-time output as the model generates responses:
- See progress immediately
- Cancel long-running tasks
- Better user experience
- Lower perceived latency

## 🌐 HTTP API Mode

Run mini-a as a service:

```bash
mini-a-web.sh onport=8080
```

Perfect for:
- Integration with other tools
- Remote access
- Team collaboration
- Custom frontends

---

Ready to dive deeper? Check out:
- [**Examples**]({{ '/examples.html' | relative_url }}) - Practical use cases
- [**Advanced Usage**]({{ '/advanced.html' | relative_url }}) - Power user features
- [**Configuration**]({{ '/configuration.html' | relative_url }}) - Complete parameter reference
