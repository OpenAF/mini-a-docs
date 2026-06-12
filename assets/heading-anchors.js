(function () {
  var ICON_LINK = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L12.5 19.5"/></svg>';
  var ICON_CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

  function showCopiedState(button) {
    button.innerHTML = ICON_CHECK;
    button.classList.add("is-copied");

    window.setTimeout(function () {
      button.innerHTML = ICON_LINK;
      button.classList.remove("is-copied");
    }, 1600);
  }

  function addHeadingAnchor(heading) {
    if (!heading.id) return;

    var link = document.createElement("a");
    link.className = "heading-anchor";
    link.href = "#" + heading.id;
    link.innerHTML = ICON_LINK;
    link.setAttribute("aria-label", "Copy link to this section");

    link.addEventListener("click", function (event) {
      event.preventDefault();

      var url = window.location.href.split("#")[0] + "#" + heading.id;
      history.replaceState(null, "", "#" + heading.id);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          showCopiedState(link);
        });
      }
    });

    heading.appendChild(link);
  }

  function initHeadingAnchors() {
    document
      .querySelectorAll(".post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6")
      .forEach(addHeadingAnchor);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeadingAnchors);
  } else {
    initHeadingAnchors();
  }
})();
