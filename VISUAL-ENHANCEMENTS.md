# Visual Enhancements Suggestions

This document lists all the places where additional visual content (screenshots, asciinema recordings, videos, diagrams) can be added to enhance the documentation site.

## 📸 Screenshot Suggestions

### 1. Console Features (getting-started.md)
**Location**: After "Basic Commands" section
**Content**: Screenshot showing:
- Console interface with slash commands
- Tab completion in action
- Color-coded output
- Example of `/show` command output

### 2. Model Manager (getting-started.md & advanced.md)
**Location**: "Model Manager" sections
**Content**: Screenshots showing:
- Model manager interface
- Creating a new model configuration
- Encrypted storage indication
- Import/export features

### 3. Web Interface Features (features.md)
**Location**: "Multiple Interfaces" section
**Content**: Screenshots showing:
- Web UI with different themes/states
- Real-time streaming responses
- File upload feature
- Session management panel

### 4. MCP Testing (examples.md)
**Location**: "Testing MCP Servers" section
**Content**: Screenshot of:
- MCP tester console
- Tool discovery interface
- Interactive tool calling
- Debug output example

### 5. Generated Documentation Example (examples.md)
**Location**: "Documentation Generation" section  
**Content**: Before/after comparison showing:
- Original code file
- Generated documentation
- Side-by-side view

### 6. Web Interface with Custom Branding (advanced.md)
**Location**: "Web Interface Advanced" section
**Content**: Screenshot showing:
- Custom port configuration
- Styled interface
- Multiple tabs/sessions

## 🎬 Asciinema Recording Suggestions

### 1. First Console Session (getting-started.md)
**Location**: After "First Run" section
**Duration**: 2-3 minutes
**Content**:
- Starting mini-a console
- Setting up model configuration
- Running first simple goal
- Using a slash command
- Exiting gracefully

**Script**:
```bash
# Terminal recording showing:
export OAF_MODEL="(type: openai, model: gpt-5.1, key: 'sk-...')"
mini-a
> list files in current directory
/help
/show
/exit
```

### 2. File Operations Workflow (examples.md)
**Location**: "File Operations" section
**Duration**: 2-3 minutes
**Content**:
- Finding files with patterns
- Analyzing project structure
- Including file content with @ syntax
- Saving output to file

**Script**:
```bash
mini-a goal="list all JavaScript files" useshell=true
mini-a goal="Analyze @package.json and summarize"
# Show output
/save project-analysis.md
```

### 3. MCP Testing Session (examples.md & features.md)
**Location**: "Testing MCP Servers" sections
**Duration**: 3-4 minutes
**Content**:
- Starting MCP tester
- Connecting to MCP server
- Listing tools
- Calling a tool with parameters
- Viewing results

**Script**:
```bash
mini-a mcptest=true
# Interactive menu:
# 1. New connection
# 2. STDIO
# 3. ojob mcps/mcp-time.yaml
# 4. List tools
# 5. Call a tool: time_get
```

### 4. Long Session with Optimization (advanced.md)
**Location**: "Performance Optimizations" section
**Duration**: 3-4 minutes
**Content**:
- Starting a chatbot session
- Multiple interactions building context
- Using /compact to reduce context
- Showing token savings
- Continuing conversation

**Script**:
```bash
mini-a goal="help me plan a project" chatbotmode=true
> [multiple questions and answers]
/show # Show current stats
/compact 5
/show # Show reduced stats
> [continue conversation]
```

### 5. Dual-Model Cost Optimization (advanced.md)
**Location**: "Dual-Model Setup" section
**Duration**: 2-3 minutes
**Content**:
- Setting up dual models
- Running a task
- Showing escalation logs
- Comparing costs

**Script**:
```bash
export OAF_MODEL="(type: openai, model: gpt-4o, key: '...')"
export OAF_LC_MODEL="(type: openai, model: gpt-5.1, key: '...')"
mini-a goal="complex analysis task" debug=true showstats=true
# Show which model handled which steps
```

### 6. Quick Start Complete Flow (index.md)
**Location**: "Quick Example" section on homepage
**Duration**: 1-2 minutes
**Content**:
- Complete flow from setup to result
- Shows how easy it is to get started

**Script**:
```bash
# Show the three steps
export OAF_MODEL="..."
opack exec mini-a
goal="what time is it in Tokyo?" mcp="..."
```

## 📊 Diagram Suggestions

### 1. MCP Proxy Flow (advanced.md)
**Location**: "MCP Proxy Mode" section
**Type**: Architecture diagram
**Content**:
- Show multiple MCP servers
- Proxy layer
- Single tool interface to LLM
- Comparison: with/without proxy

### 2. Planning Workflow (advanced.md)
**Location**: "Planning Workflows" section
**Type**: Flowchart
**Content**:
- Goal analysis step
- Step generation
- Execution loop
- Validation
- Iteration/completion branches

### 3. Cost Comparison Graph (advanced.md)
**Location**: "Dual-Model Setup" section
**Type**: Bar chart or line graph
**Content**:
- X-axis: Task type
- Y-axis: Cost
- Two bars: Single model vs Dual model
- Show percentage savings

### 4. Token Usage Over Time (advanced.md)
**Location**: "Performance Optimizations" section
**Type**: Line graph
**Content**:
- X-axis: Number of interactions
- Y-axis: Cumulative tokens
- Two lines: With/without optimizations
- Show 40-60% reduction area

### 5. Model Selection Decision Tree (advanced.md)
**Location**: "Dual-Model Setup" section
**Type**: Decision tree/flowchart
**Content**:
- Task comes in
- Complexity evaluation
- Route to low-cost or main model
- Escalation conditions
- Result delivery

## 🎥 Video Tutorial Suggestions

### 1. Complete Real-World Workflow (examples.md)
**Location**: "Real-World Use Cases" section
**Duration**: 5-10 minutes
**Content**:
- Pick one real-world scenario (e.g., "Log Analysis")
- Show complete workflow from start to finish
- Include problem statement
- Show mini-a solving it step by step
- Explain decisions made
- Show final result

### 2. Interactive Demo Widget (examples.md)
**Location**: End of examples page
**Type**: Embedded interactive demo (if possible)
**Content**:
- Simple web-based demo
- Pre-configured examples users can run
- Real-time output
- No setup required

## 📝 Implementation Priority

### High Priority (Most Impact)
1. ✅ Architecture diagram on homepage (DONE - SVG created)
2. 🎬 Quick start asciinema (index.md)
3. 🎬 First console session (getting-started.md)
4. 📸 Console features screenshot (getting-started.md)

### Medium Priority
5. 🎬 MCP testing session (examples.md)
6. 🎬 File operations workflow (examples.md)
7. 📊 MCP proxy flow diagram (advanced.md)
8. 📸 Web interface screenshots (features.md)

### Nice to Have
9. 🎬 Long session with optimization (advanced.md)
10. 🎬 Dual-model cost optimization (advanced.md)
11. 📊 Cost comparison graphs (advanced.md)
12. 🎥 Complete real-world workflow video (examples.md)

## 📋 Creating Asciinema Recordings

To create asciinema recordings:

```bash
# Install asciinema
pip install asciinema

# Start recording
asciinema rec filename.cast

# Perform your demo
# ...

# Stop recording (Ctrl+D or type exit)

# Upload to asciinema.org or self-host
asciinema upload filename.cast

# Or convert to GIF/video for embedding
```

## 💡 Asset Placement

Once created, place assets in:
- **Screenshots**: `assets/images/screenshots/`
- **Asciinema**: Link to asciinema.org or embed in pages
- **Diagrams**: `assets/images/diagrams/`
- **Videos**: Link to YouTube/Vimeo or host elsewhere

## Integration Examples

### Asciinema Embed
```html
<script id="asciicast-xxxxx" 
        src="https://asciinema.org/a/xxxxx.js" 
        async data-autoplay="true" 
        data-loop="true">
</script>
```

### Screenshot Embed (already styled)
```markdown
![Description]({{ '/assets/images/screenshots/filename.png' | relative_url }})
```

### Video Embed
```html
<div class="video-container">
  <iframe width="560" height="315" 
          src="https://www.youtube.com/embed/VIDEO_ID" 
          frameborder="0" allowfullscreen>
  </iframe>
</div>
```

---

**Note**: All locations marked with 💡 in the documentation files indicate where these visual enhancements should be added.
