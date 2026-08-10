(function exposeGrimorioInventoryMotion(global) {
  "use strict";

  const config = Object.freeze({
    dragThreshold: 4,
    maxTilt: 3,
    tiltDamping: .28,
    durations: Object.freeze({
      instant: 80,
      grab: 140,
      drop: 210,
      return: 240,
      rotate: 160,
      swap: 220,
      revealTravel: 210,
      reduced: 70
    }),
    easings: Object.freeze({
      lift: "cubic-bezier(.2,.8,.2,1)",
      settle: "cubic-bezier(.2,.82,.24,1)",
      return: "cubic-bezier(.24,.76,.3,1)"
    })
  });
  const activeAnimations = new WeakMap();

  function cancelAnimations(element) {
    const animation = element ? activeAnimations.get(element) : null;
    animation?.cancel();
    if (element) activeAnimations.delete(element);
  }

  async function play(element, keyframes, options) {
    if (!element) return;
    cancelAnimations(element);
    const animation = element.animate(keyframes, options);
    activeAnimations.set(element, animation);
    try {
      await animation.finished;
    } catch (_error) {
      // Cancelamento visual é esperado quando um gesto novo substitui o anterior.
    } finally {
      if (activeAnimations.get(element) === animation) activeAnimations.delete(element);
    }
  }

  function transformBetween(from, to, scale = 1) {
    const scaleX = from.width > 0 ? (to.width / from.width) * scale : scale;
    const scaleY = from.height > 0 ? (to.height / from.height) * scale : scale;
    return `translate3d(${to.left}px, ${to.top}px, 0) scale(${scaleX}, ${scaleY})`;
  }

  function animateGrab(element, { reduceMotion = false } = {}) {
    if (reduceMotion) return Promise.resolve();
    return play(element, [
      { transform: "translateY(1px) scale(.985)", filter: "brightness(.98)" },
      { transform: "translateY(-4px) scale(1.03)", filter: "brightness(1.025)", offset: .72 },
      { transform: "translateY(-3px) scale(1.025)", filter: "brightness(1)" }
    ], {
      duration: config.durations.grab,
      easing: config.easings.lift
    });
  }

  function animateSpatialize(element, from, to, { reduceMotion = false } = {}) {
    if (!element || !from || !to || reduceMotion) return Promise.resolve();
    const scaleX = to.width > 0 ? from.width / to.width : 1;
    const scaleY = to.height > 0 ? from.height / to.height : 1;
    return play(element, [
      { transform: `translateY(0) scale(${scaleX}, ${scaleY})`, opacity: .86 },
      { transform: "translateY(-3px) scale(1.025)", opacity: 1 }
    ], {
      duration: 150,
      delay: 70,
      easing: config.easings.lift,
      fill: "backwards"
    });
  }

  function animateTravel(element, {
    from,
    to,
    kind = "drop",
    direction = 1,
    reduceMotion = false
  } = {}) {
    if (!element || !from || !to) return Promise.resolve();
    if (reduceMotion) {
      return play(element, [
        { opacity: 1 },
        { opacity: .18 }
      ], {
        duration: config.durations.reduced,
        easing: "linear",
        fill: "forwards"
      });
    }

    const isReturn = kind === "return";
    const duration = isReturn
      ? config.durations.return
      : kind === "reveal"
        ? config.durations.revealTravel
        : config.durations.drop;
    const easing = isReturn ? config.easings.return : config.easings.settle;
    const start = transformBetween(from, from);
    const end = transformBetween(from, to);
    const keyframes = isReturn
      ? [
          { transform: start, opacity: 1 },
          {
            transform: `translate3d(${from.left + direction * 6}px, ${from.top - 2}px, 0) scale(.985)`,
            opacity: 1,
            offset: .2
          },
          { transform: end, opacity: 1 }
        ]
      : [
          { transform: start, opacity: 1 },
          { transform: transformBetween(from, to, .97), opacity: 1, offset: .74 },
          { transform: end, opacity: 1 }
        ];

    return play(element, keyframes, { duration, easing, fill: "forwards" });
  }

  function animateRotation(element, { direction = 1, reduceMotion = false } = {}) {
    if (!element || reduceMotion) return Promise.resolve();
    return play(element, [
      { transform: "translateY(-2px) rotate(0deg) scale(1.01)" },
      { transform: `translateY(-2px) rotate(${direction * 4}deg) scale(.96)`, offset: .48 },
      { transform: "translateY(-3px) rotate(0deg) scale(1.025)" }
    ], {
      duration: config.durations.rotate,
      easing: config.easings.lift
    });
  }

  function animateSettle(element, { reduceMotion = false } = {}) {
    if (!element) return Promise.resolve();
    if (reduceMotion) {
      return play(element, [{ opacity: .35 }, { opacity: 1 }], {
        duration: config.durations.reduced,
        easing: "linear"
      });
    }
    return play(element, [
      { transform: "scale(.97)" },
      { transform: "scale(1.012)", offset: .62 },
      { transform: "scale(1)" }
    ], {
      duration: config.durations.drop,
      easing: config.easings.settle
    });
  }

  function animatePreviewExit(element, { reduceMotion = false } = {}) {
    if (!element || reduceMotion) return Promise.resolve();
    return play(element, [
      { opacity: Number.parseFloat(global.getComputedStyle(element).opacity) || 1 },
      { opacity: 0 }
    ], {
      duration: 70,
      easing: "linear",
      fill: "forwards"
    });
  }

  function animateRejection(element, { reduceMotion = false } = {}) {
    if (!element || reduceMotion) return Promise.resolve();
    return play(element, [
      { transform: "translateX(0)" },
      { transform: "translateX(-4px)", offset: .28 },
      { transform: "translateX(3px)", offset: .56 },
      { transform: "translateX(-1px)", offset: .78 },
      { transform: "translateX(0)" }
    ], {
      duration: config.durations.grab,
      easing: config.easings.return
    });
  }

  function animateFlip(element, from, to, { reduceMotion = false } = {}) {
    if (!element || !from || !to) return Promise.resolve();
    if (reduceMotion) {
      return play(element, [{ opacity: .3 }, { opacity: 1 }], {
        duration: config.durations.reduced,
        easing: "linear"
      });
    }
    const deltaX = from.left - to.left;
    const deltaY = from.top - to.top;
    const scaleX = to.width > 0 ? from.width / to.width : 1;
    const scaleY = to.height > 0 ? from.height / to.height : 1;
    return play(element, [
      { transformOrigin: "top left", transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})` },
      { transformOrigin: "top left", transform: `translate3d(${deltaX * .42}px, ${deltaY * .42 - 8}px, 0) scale(1.01)`, offset: .58 },
      { transformOrigin: "top left", transform: "translate3d(0, 0, 0) scale(1)" }
    ], {
      duration: config.durations.swap,
      easing: config.easings.settle
    });
  }

  global.GrimorioInventoryMotion = Object.freeze({
    config,
    cancelAnimations,
    animateGrab,
    animateSpatialize,
    animateTravel,
    animateRotation,
    animateSettle,
    animatePreviewExit,
    animateRejection,
    animateFlip
  });
})(window);
