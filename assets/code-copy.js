(function () {
  function getCopyTarget(block) {
    return block.querySelector("pre code") || block.querySelector("code");
  }

  function showCopiedState(button) {
    var originalLabel = button.getAttribute("data-label") || "Copy";
    button.textContent = "Copied";
    button.classList.add("is-copied");

    window.setTimeout(function () {
      button.textContent = originalLabel;
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
    button.textContent = "Copy";
    button.setAttribute("data-label", "Copy");
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
