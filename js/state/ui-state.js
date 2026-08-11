(function exposeGrimorioUIState(global) {
  "use strict";

  function createInventoryUIState() {
    return {
      reorganizingForPending: false,
      movingItemId: null,
      selectedItemId: null,
      selectedItemSource: null,
      hoveredCell: null,
      candidatePosition: null,
      discardingItemId: null
    };
  }

  function createInventoryDragState() {
    return {
      phase: "idle",
      source: null,
      sourceSnapshot: null,
      target: null,
      pointerId: null,
      itemId: null,
      rotation: 0,
      grabRatio: null,
      originRect: null,
      latestPointer: null,
      startPointer: null,
      candidateKey: "",
      evaluation: null,
      evaluationCache: new Map(),
      proxy: null,
      morph: null,
      art: null,
      originElement: null,
      animationFrame: 0,
      renderedPointer: null,
      tilt: 0,
      rotationInProgress: false,
      spatialized: false,
      moved: false
    };
  }

  global.GrimorioUIState = Object.freeze({
    createInventoryUIState,
    createInventoryDragState
  });
})(window);
