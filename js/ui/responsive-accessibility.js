(function () {
  "use strict";

  const dialogOpeners = new WeakMap();
  const interactiveSelector = "input, textarea, select, button, [contenteditable='true']";

  document.addEventListener("click", function (event) {
    const opener = event.target.closest("button[aria-controls]");
    if (!opener) return;

    const dialog = document.getElementById(opener.getAttribute("aria-controls"));
    if (dialog && dialog.tagName === "DIALOG") {
      dialogOpeners.set(dialog, opener);
    }
  });

  document.querySelectorAll("dialog").forEach(function (dialog) {
    dialog.addEventListener("close", function () {
      const opener = dialogOpeners.get(dialog);
      if (opener && opener.isConnected && document.activeElement === document.body) {
        opener.focus({ preventScroll: true });
      }
    });
  });

  document.addEventListener("focusin", function (event) {
    const control = event.target.closest(interactiveSelector);
    if (!control || !control.closest(".creation-stage, dialog[open]")) return;

    window.requestAnimationFrame(function () {
      const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const bounds = control.getBoundingClientRect();
      if (bounds.bottom > viewportHeight - 12 || bounds.top < 12) {
        control.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    });
  });
})();
