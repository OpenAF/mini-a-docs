(function () {
  var ICON_COPY = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M17 4h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1"/></svg>';
  var ICON_CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

  function getCopyTarget(block) {
    return block.querySelector("pre code") || block.querySelector("code");
  }

  function showCopiedState(button) {
    button.innerHTML = ICON_CHECK;
    button.classList.add("is-copied");

    window.setTimeout(function () {
      button.innerHTML = ICON_COPY;
      button.classList.remove("is-copied");
    }, 1600);
  }

  function addCopyButton(block) {
    if (block.dataset.copyReady === "true") return;

    var code = getCopyTarget(block);
    if (!code) return;

    block.dataset.copyReady = "true";
    block.classList.add("code-copy-block");

    var button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-button";
    button.innerHTML = ICON_COPY;
    button.setAttribute("aria-label", "Copy code to clipboard");

    button.addEventListener("click", function () {
      var text = code.innerText.replace(/\n$/, "");

      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        return;
      }

      navigator.clipboard.writeText(text).then(function () {
        showCopiedState(button);
      });
    });

    block.appendChild(button);
  }

  function initCodeCopyButtons() {
    document
      .querySelectorAll(".highlighter-rouge, pre.highlight")
      .forEach(addCopyButton);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCodeCopyButtons);
  } else {
    initCodeCopyButtons();
  }
})();
