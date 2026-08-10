# Inventário Espacial V2 — Implementation Plan

> **For agentic workers:** REQUIRED: Preserve the current dirty workspace and the existing inventory reconstruction. Do not create, modify, or execute automated tests; the user explicitly requires manual review only. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform every inventory item into one physical, footprint-proportional object that can move atomically among the bench, backpack, main hand, off hand, and armor while preserving existing sheets and the spatial domain.

**Architecture:** `inventory-domain.js` remains the source of truth for dimensions, rotation, occupied cells, boundaries, collisions, and availability. `script.js` keeps the existing persistent model but consolidates pointer interaction into one transient physical-drag session with explicit sources and targets; `inventory.css` renders the same item art at different scales without turning it into a textual card. Existing pending import, keyboard placement, session save, and full-sheet JSON compatibility remain intact.

**Tech Stack:** Static HTML, CSS Grid, DOM JavaScript, Pointer Events, `requestAnimationFrame`, Web Animations API, existing `GrimorioInventoryDomain`.

**Working-tree constraint:** The current implementation is already present as uncommitted changes in `index.html`, `script.js`, and untracked `inventory.css`. Work in place and preserve unrelated files. Do not create a worktree or commit unless the user requests it.

---

## Chunk 1: Mandatory current-state audit

### Task 0: Map the implementation before editing

**Files:**
- Inspect only: `inventory-domain.js`
- Inspect only: `script.js`
- Inspect only: `index.html`
- Inspect only: `inventory.css`

- [x] Map item import, schema normalization, migration, `pendingPlacement`, backpack rendering, equipment persistence, reveal, image fallback, Pointer Events, rAF, rotation, collision, footprint, desktop, mobile, keyboard, and reduced motion.
- [x] Confirm `inventory-domain.js` already owns the 6×5 grid, effective dimensions, occupied cells, bounds, collision, first-fit availability, and v1/v2 inventory migration.
- [x] Confirm the current physical controller covers only bench/backpack, equipment is click-only, grid sizing approximates rather than measures gaps, reveal does not decode images, and equipped imported items/IDs are not normalized globally.
- [x] Record that the current dirty worktree is the implementation baseline and must be preserved in place.

## Chunk 2: Image continuity, staging, and workspace

### Task 1: Make the declared image authoritative on every surface

**Files:**
- Modify: `script.js` (`criarArteDoItem`, reveal/import flow, physical proxy creation)
- Modify: `inventory.css` (shared art/fallback rules)

- [ ] Add a transient failed-image registry so a broken URL consistently falls back without mutating the item schema.
- [ ] Make `criarArteDoItem` create eager or lazy images according to context, attach load/error state, expose rotation, and keep fallback visually hidden whenever the image succeeds.
- [ ] Preload and attempt `decode()` for a declared image before opening the reveal; on failure, record the URL and continue with the discreet fallback.
- [ ] Build reveal, bench, backpack, equipment, inspector, travel animation, and drag proxy through the same art factory instead of cloning image DOM without error handlers.
- [ ] Keep `object-fit: contain`, transparent backgrounds, no cropping, and a compact fallback mark.

### Task 2: Turn reveal and bench into object-first staging

**Files:**
- Modify: `index.html` (reveal metadata and accessible instructions)
- Modify: `script.js` (`abrirRevealDeItemRecebido`, `renderizarItemRecebido`, reveal-to-bench animation)
- Modify: `inventory.css` (bench geometry and hierarchy)

- [ ] Show art, name, type/rarity, weight, effective dimensions, orientation, and short manipulation instruction in the required hierarchy.
- [ ] Size bench art with a miniaturized but faithful footprint aspect ratio rather than a fixed card rectangle.
- [ ] Keep description and properties exclusively in the inspector.
- [ ] Preserve the reveal-to-bench visual journey and reduced-motion fallback.
- [ ] Communicate immediately when the current orientation exceeds the 6×5 backpack and recommend rotation.

### Task 3: Tighten the desktop and mobile workspace

**Files:**
- Modify: `inventory.css`

- [ ] Keep the desktop proportions near 20% bench / 58% backpack / 22% sidecar with the backpack dominant.
- [ ] Remove heavy dividers and dead spacing while retaining ivory/parchment/wine/gold around the leather backpack.
- [ ] Keep backpack and bench simultaneously visible on mobile, with backpack first and equipment/details below.
- [ ] Preserve the existing responsive grid cell sizing and allow oversized proxies/ghosts to extend visibly beyond the backpack boundary.

## Chunk 3: Real geometry and one physical controller

### Task 4: Measure footprint from the rendered grid

**Files:**
- Modify: `script.js` (grid geometry helpers, proxy frame renderer, candidate calculation)
- Modify: `inventory.css` (proxy dimension label and rotation transition)

- [ ] Measure cell width, cell height, column gap, and row gap from `#sheet-inventory-grid`.
- [ ] Compute proxy width and height with `cell * footprint + gap * (footprint - 1)` for every source.
- [ ] Preserve the normalized grab point when dimensions or rotation change.
- [ ] Display only art plus a compact name/dimension/orientation label on the proxy.
- [ ] Include rotation and target identity in the candidate cache key so unchanged pointer frames remain cheap without leaving stale previews.

### Task 5: Generalize the transient drag session

**Files:**
- Modify: `script.js` (`inventoryDrag`, begin/update/render/evaluate/rotate/cleanup)

- [ ] Store `inventoryDrag` as `{ phase, source: { kind, slot?, itemId? }, target, pointerId, itemId, rotation, grabRatio, originRect, latestPointer, startPointer, candidateKey, evaluation, proxy, art, originElement, animationFrame, renderedPointer, tilt, moved }`.
- [ ] Represent explicit sources `bench`, `inventory`, `mainHand`, `offHand`, and `armor` in the same session object.
- [ ] Return every target evaluation as `{ kind: "backpack" | "equipment" | "none", valid, code, element?, slot?, position?, validation?, dimensions }`.
- [ ] Separate `evaluatePhysicalTarget`, `planPhysicalCommit`, `commitPhysicalDrop`, `returnPhysicalObject`, and `cleanupPhysicalDrag` so validation, mutation, animation, and cleanup do not overlap.
- [ ] Keep the persistent item untouched while dragging; store transient rotation and candidate in `inventoryDrag`.
- [ ] On pointermove save only the latest pointer and schedule one frame; in every scheduled frame move the proxy and hit-test from `latestPointer`.
- [ ] Re-run domain validation and update ghost/feedback only when the `target + slot + position + rotation` candidate key changes.
- [ ] On pointerup evaluate from the event coordinates, not the last rendered frame.
- [ ] Begin only from `.inventory-item-art`, never from text/details/card chrome; apply grab cursor, immediate lift, scale, shadow, and origin ghost.
- [ ] Reuse `#inventory-drag-layer` outside clipping containers for every origin.
- [ ] Keep pointer cancellation and invalid drops non-mutating, then animate the proxy back to the captured origin rectangle.
- [ ] Clean up on `pointercancel`, lost pointer capture, window blur, and hidden document so an origin cannot remain invisible.

### Task 6: Define backpack and equipment targets

**Files:**
- Modify: `script.js` (slot compatibility and target evaluation)
- Modify: `inventory.css` (compatible, valid, invalid, and origin states)

- [ ] Implement `canAcceptItemInSlot(item, slot)` from normalized `equipavelEm` aliases; preserve the legacy fallback of armor → armor and weapon → main hand, without silently enabling off hand.
- [ ] Illuminate only compatible equipment slots while carrying an item.
- [ ] Show gold valid feedback and discreet wine invalid feedback.
- [ ] Keep slot contents visually ghosted while they are the drag origin, without changing persistent state.
- [ ] Preserve keyboard activation as an accessible fallback while pointer users drag the art directly.

### Task 7: Implement transient rotation as a physical operation

**Files:**
- Modify: `script.js` (drag rotation and existing rotate actions)
- Modify: `inventory.css` (bounding-box/art transition)

- [ ] Support `R` during an active pointer drag and declare it in accessible shortcut text.
- [ ] Change only `inventoryDrag.rotation` during a drag; persist rotation solely on a valid commit.
- [ ] Recompute proxy width/height, target validity, candidate position, and grab-point offset immediately after rotation.
- [ ] Rotate the art and swap the footprint bounding box in 120–180 ms; remove the animation under reduced motion.
- [ ] Preserve button/keyboard rotation outside pointer drag and keep square items non-rotatable.

### Task 8: Render an exact valid/invalid ghost

**Files:**
- Modify: `script.js` (`renderizarPreviewDoInventario`, feedback helpers)
- Modify: `inventory.css` (absolute ghost cells, collision/outside states)

- [ ] Use domain `getOccupiedCells`/`canPlaceItem` and `createOccupancyMatrix` over the inventory without the carried backpack item; classification is visual only and does not recreate placement validity.
- [ ] Render every occupied footprint cell from the domain result, including cells outside the 6×5 bounds.
- [ ] Position ghost cells from measured grid geometry so negative and overflowing coordinates remain truthful.
- [ ] Classify each marker as valid, collision, or out-of-bounds before pointerup while treating the domain result as the aggregate source of truth.
- [ ] Keep object proxy and grid ghost as separate layers with separate responsibilities.
- [ ] For a 2×6 object, show immediate incompatibility at 0° and exactly 12 projected cells; after 90° show 6×2 and re-evaluate immediately.

## Chunk 4: Atomic destination commits and compatibility

### Task 9: Commit backpack drops atomically from every source

**Files:**
- Modify: `script.js` (physical drop planner/commit)

- [ ] Bench → backpack: insert only after valid domain placement and then clear `pendingPlacement`.
- [ ] Inventory → backpack: update position and transient rotation only after valid domain placement.
- [ ] Equipment → backpack: insert at the validated position and clear the source slot in the same persistent mutation.
- [ ] Backpack → same backpack position is a no-op that returns cleanly; equipment → its own slot is also a no-op.
- [ ] Render the destination before snap animation and never remove an origin permanently on invalid drop.
- [ ] Keep existing keyboard placement/reorganization behavior operational.

### Task 10: Commit equipment drops atomically from every source

**Files:**
- Modify: `script.js` (equipment transaction planner/commit and listeners)

- [ ] Bench → equipment: clear pending only after a valid compatible-slot commit.
- [ ] Inventory → equipment: remove from backpack and equip in one mutation.
- [ ] Equipment → equipment: clear the source and set the target in one mutation when compatible.
- [ ] If the target is occupied, ask the domain for a backpack position for the displaced item after excluding the carried inventory item.
- [ ] Block the transaction before mutation when the displaced item cannot fit, with the required no-space message.
- [ ] Reserve IDs across backpack and all equipment slots when importing a new pending item.

### Task 11: Preserve persistence and legacy compatibility

**Files:**
- Modify: `script.js`
- Inspect only: `inventory-domain.js`

- [ ] Keep the persisted item definition and inventory instance schema unchanged.
- [ ] Normalize equipped v1 strings/definitions and v2 instances through the existing domain definition/instance APIs, adding a neutral transient position only where the instance normalizer requires one.
- [ ] Preserve equipped image, footprint, rotation, quantity, properties, and valid IDs; default absent armor/main-hand/off-hand slots to `null`.
- [ ] Build one reserved-ID set from migrated backpack items, then normalize armor, main hand, and off hand in stable order; preserve the first valid occurrence and generate a safe replacement for later duplicates.
- [ ] Reserve IDs from backpack, all slots, and the current pending item before importing another item.
- [ ] Keep `personagem.inventario`, `personagem.equipamentos`, dirty state, in-session save, and JSON export round-trip behavior intact without changing the JSON schema.
- [ ] Do not duplicate footprint, collision, bounds, or availability rules outside `inventory-domain.js`.

## Chunk 5: Interaction polish, accessibility, and manual verification

### Task 12: Preserve compact object rendering and accessible fallbacks

**Files:**
- Modify: `script.js`
- Modify: `inventory.css`

- [ ] Inside the backpack show art, quantity only when above one, subtle rarity/selection, and no full name inside 1×1 footprints.
- [ ] Keep the inspector complete: art, name, type, rarity, main attribute, weight, dimensions, rotation, properties, description, and contextual actions.
- [ ] Remove the current early return that hides position/state when an item has properties.
- [ ] Preserve selection, arrows, Enter/Space, Escape, rotation shortcut, focus restoration, and `aria-live` messages for backpack and equipment flows.
- [ ] Keep backpack and bench visible during mobile organization without automatic panel switching.
- [ ] Ensure all proxy transitions, particles, tilt, lift, rotation, snap, and recoil reduce or disappear under `prefers-reduced-motion` while behavior remains identical.

### Task 13: Perform static and browser review without tests

**Files:**
- Inspect: `index.html`
- Inspect: `inventory.css`
- Inspect: `script.js`
- Inspect: `inventory-domain.js`

- [ ] Run only `node --check script.js` and `git diff --check`; do not invoke any runner, test command, test dependency, or test file.
- [ ] Open the local application and manually inspect desktop and mobile layouts.
- [ ] Image scenarios: declared image appears on all six surfaces; absent/broken image uses discreet fallback without breaking reveal or drag.
- [ ] Geometry scenarios: 2×6 reports not fitting, shows 12 cells, rotates to 6×2, and commits only in a valid collision-free position.
- [ ] Backpack scenarios: bench → backpack, backpack → backpack, collision, out-of-bounds, full backpack, same-position no-op, invalid recoil, final-pointer placement.
- [ ] Equipment scenarios: bench/inventory/equipment → compatible slot, incompatible slot, main hand → off hand only when `equipavelEm` permits, equipment → backpack, occupied slot with and without backpack space, own-slot no-op.
- [ ] Compatibility scenarios: item v1/v2, sheet v1/v2, missing equipment slots, legacy equipped item, duplicate IDs, session save, export, and re-import preserve all objects without disappearance.
- [ ] Accessibility scenarios: keyboard focus, selection, arrows, Enter/Space, Escape, `R`, equipment activation, `aria-live`; reduced motion retains every operation without tilt/particles/long transitions.
- [ ] Review the final diff and confirm no creation, species, class, attribute, skill, ability, or summary behavior changed.
- [ ] Confirm no test, mock, fixture, dependency, or test infrastructure was created, changed, or executed.
