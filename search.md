---
layout: page
title: Search
permalink: /search/
---

<div class="search-page" data-index-url="{{ '/search-data.json' | relative_url }}">
  <label class="search-label" for="search-input">Search the docs</label>
  <div class="search-input-row">
    <input
      id="search-input"
      class="search-input"
      type="search"
      name="q"
      placeholder="Search features, config, examples, FAQ..."
      autocomplete="off"
      spellcheck="false"
    >
  </div>
  <p class="search-hint">Search runs entirely in the browser. Try terms like <code>ollama</code>, <code>mcp</code>, or <code>delegation</code>.</p>
  <div id="search-status" class="search-status" aria-live="polite"></div>
  <div id="search-results" class="search-results"></div>
</div>

<script src="{{ '/assets/search.js' | relative_url }}" defer></script>
