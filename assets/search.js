(function () {
  var page = document.querySelector(".search-page");
  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var status = document.getElementById("search-status");

  if (!page || !input || !results || !status) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var initialQuery = (params.get("q") || "").trim();
  var documents = [];
  var isReady = false;

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function updateQueryParam(query) {
    var url = new URL(window.location.href);

    if (query) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }

    window.history.replaceState({}, "", url);
  }

  function highlight(text, terms) {
    var escapedText = escapeHtml(text);

    terms.forEach(function (term) {
      var pattern = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      escapedText = escapedText.replace(pattern, "<mark>$1</mark>");
    });

    return escapedText;
  }

  function snippetFor(doc, terms) {
    var haystack = doc.content;
    var lowerHaystack = haystack.toLowerCase();
    var firstIndex = -1;

    terms.forEach(function (term) {
      var index = lowerHaystack.indexOf(term);

      if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
        firstIndex = index;
      }
    });

    if (firstIndex === -1) {
      return escapeHtml(haystack.slice(0, 180)) + (haystack.length > 180 ? "..." : "");
    }

    var start = Math.max(0, firstIndex - 60);
    var end = Math.min(haystack.length, firstIndex + 120);
    var snippet = haystack.slice(start, end).trim();

    if (start > 0) {
      snippet = "..." + snippet;
    }

    if (end < haystack.length) {
      snippet = snippet + "...";
    }

    return highlight(snippet, terms);
  }

  function renderEmpty(message) {
    status.textContent = message;
    results.innerHTML = "";
  }

  function renderResults(query) {
    var normalizedQuery = query.trim().toLowerCase();

    updateQueryParam(query.trim());

    if (!normalizedQuery) {
      renderEmpty("Enter a term to search the documentation.");
      return;
    }

    if (!isReady) {
      renderEmpty("Loading search index...");
      return;
    }

    var terms = normalizedQuery.split(/\s+/).filter(Boolean);
    var matches = documents
      .map(function (doc) {
        var title = doc.title.toLowerCase();
        var content = doc.content.toLowerCase();
        var matchedTerms = terms.filter(function (term) {
          return title.indexOf(term) !== -1 || content.indexOf(term) !== -1;
        });

        if (matchedTerms.length !== terms.length) {
          return null;
        }

        var titleHits = matchedTerms.reduce(function (count, term) {
          return count + (title.indexOf(term) !== -1 ? 3 : 0);
        }, 0);
        var contentHits = matchedTerms.reduce(function (count, term) {
          return count + (content.indexOf(term) !== -1 ? 1 : 0);
        }, 0);

        return {
          title: doc.title,
          url: doc.url,
          content: doc.content,
          score: titleHits + contentHits
        };
      })
      .filter(Boolean)
      .sort(function (a, b) {
        return b.score - a.score || a.title.localeCompare(b.title);
      });

    if (!matches.length) {
      renderEmpty('No results for "' + query.trim() + '".');
      return;
    }

    status.textContent = matches.length + " result" + (matches.length === 1 ? "" : "s") + ' for "' + query.trim() + '".';
    results.innerHTML = matches.map(function (match) {
      return [
        '<article class="search-result">',
        '  <h2><a href="' + match.url + '">' + escapeHtml(match.title) + "</a></h2>",
        '  <p>' + snippetFor(match, terms) + "</p>",
        "</article>"
      ].join("");
    }).join("");
  }

  input.addEventListener("input", function (event) {
    renderResults(event.target.value);
  });

  fetch(page.dataset.indexUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Unable to load search index");
      }

      return response.json();
    })
    .then(function (data) {
      documents = data;
      isReady = true;
      renderResults(input.value);
    })
    .catch(function () {
      renderEmpty("Search is unavailable right now.");
    });

  input.value = initialQuery;
  renderResults(initialQuery);
})();
