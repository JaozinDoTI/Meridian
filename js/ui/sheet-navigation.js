(function exposeGrimorioSheetNavigationView(global) {
  "use strict";

  function setFutureSectionsMenuOpen(sidebar, moreButton, open) {
    const shouldOpen = Boolean(open);
    sidebar.classList.toggle("is-more-open", shouldOpen);
    moreButton.setAttribute("aria-expanded", String(shouldOpen));
  }

  function setActiveSection(views, navigationButtons, section) {
    views.forEach(function updateView(view) {
      view.hidden = view.dataset.sheetView !== section;
    });
    navigationButtons.forEach(function updateNavigationButton(button) {
      const active = button.dataset.sheetSection === section;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  }

  global.GrimorioSheetNavigationView = Object.freeze({
    setFutureSectionsMenuOpen,
    setActiveSection
  });
})(window);
