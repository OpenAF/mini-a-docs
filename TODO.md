# Screenshot Tracking

All screenshot placeholders in the documentation site. Replace `[SCREENSHOT-PLACEHOLDER: ID]` with actual images as they are captured.

## How to Replace

1. Capture the screenshot at the recommended dimensions
2. Save as `assets/images/screenshots/ID.png` (e.g., `assets/images/screenshots/s1-web-ui.png`)
3. Replace the `<div class="screenshot-placeholder">` block with:
   ```html
   <img src="{{ '/assets/images/screenshots/s1-web-ui.png' | relative_url }}" alt="Description" style="border-radius:8px; border:1px solid rgba(160,174,192,0.3);">
   ```

## Screenshot List

| ID | Page | What to Capture | Dimensions | Priority |
|----|------|-----------------|------------|----------|
| S1 | index | Web UI showing a multi-step task with streaming output | 800x500 | HIGH |
| S2 | index | Console interactive goal execution | 800x400 | HIGH |
| S3 | index | Terminal recording of 30-second quick start (GIF or asciicast) | 800x450 | HIGH |
| S4 | index | Architecture diagram (SVG preferred) | 800x400 | HIGH |
| S5 | getting-started | Model manager TUI screen | 700x400 | MEDIUM |
| S6 | getting-started | Console first-run step-by-step | 800x450 | HIGH |
| S7 | getting-started | Web UI first-run with streaming | 800x500 | MEDIUM |
| S8 | features | Token stats with dual-model cost breakdown | 700x350 | MEDIUM |
| S9 | features | MCP test console listing available tools | 700x400 | MEDIUM |
| S10 | features | Web UI with session management sidebar | 800x500 | LOW |
| S11 | features | Console with tab completion popup | 700x350 | LOW |
| S12 | examples | MCP proxy combining multiple servers | 700x400 | MEDIUM |
| S13 | examples | Before/after auto-generated documentation | 800x500 | LOW |
| S14 | advanced | Debug output showing model escalation from light to main | 700x400 | LOW |
| S15 | advanced | MCP proxy aggregation diagram | 700x350 | MEDIUM |
| S16 | use-cases | Log analysis terminal output | 700x400 | LOW |
| S17 | use-cases | Code review output | 700x400 | LOW |
| S18 | use-cases | Generated documentation output | 700x400 | LOW |
| S19 | use-cases | Data processing output | 700x400 | LOW |
| S20 | use-cases | Security audit results | 700x400 | LOW |
| S21 | use-cases | Interactive teaching session | 700x400 | LOW |
| S22 | use-cases | CI/CD pipeline output | 700x400 | LOW |
| S23 | use-cases | Metrics showing cost savings | 700x350 | LOW |

## Progress

- [x] S1 — Web UI multi-step task
- [x] S2 — Console interactive goal
- [x] S3 — Terminal quick start recording
- [x] S4 — Architecture diagram
- [x] S5 — Model manager TUI
- [x] S6 — Console first-run
- [x] S7 — Web UI first-run
- [ ] S8 — Dual-model cost stats
- [ ] S9 — MCP test console
- [ ] S10 — Web UI sessions
- [ ] S11 — Console tab completion
- [ ] S12 — MCP proxy
- [ ] S13 — Auto-generated docs
- [ ] S14 — Debug model escalation
- [ ] S15 — MCP proxy diagram
- [ ] S16 — Log analysis
- [ ] S17 — Code review
- [ ] S18 — Generated docs
- [ ] S19 — Data processing
- [ ] S20 — Security audit
- [ ] S21 — Interactive teaching
- [ ] S22 — CI/CD pipeline
- [ ] S23 — Cost savings metrics
