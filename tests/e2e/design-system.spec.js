import { expect, test } from "@playwright/test";
import { importCompleteCharacter, openSheetSection, preparePage } from "../helpers/app.js";

async function stylesOf(locator) {
  return locator.evaluate(function readStyles(element) {
    const style = getComputedStyle(element);
    return {
      height: element.getBoundingClientRect().height,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      borderRadius: style.borderRadius,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight
    };
  });
}

test("harmoniza dropdown e ação sem transformar os dois no mesmo componente", async function ({ page }) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await preparePage(page);
  await importCompleteCharacter(page);
  await openSheetSection(page, "abilities");

  const search = await stylesOf(page.locator(".abilities-search"));
  const select = await stylesOf(page.locator("#sheet-ability-state-filter"));
  const action = await stylesOf(page.locator("#sheet-import-ability"));

  expect(search.height).toBeCloseTo(40, 3);
  expect(select.height).toBeCloseTo(40, 3);
  expect(action.height).toBeCloseTo(40, 3);
  expect(select.borderRadius).toBe("5px");
  expect(action.borderRadius).toBe(select.borderRadius);
  expect(select.fontSize).toBe("12px");
  expect(select.fontWeight).toBe("500");
  expect(action.fontSize).toBe("11px");
  expect(action.fontWeight).toBe("700");
  await expect(page.locator("#sheet-ability-state-filter")).toHaveCSS("appearance", "none");
  await expect(page.locator("#sheet-ability-state-filter")).not.toHaveCSS("background-image", "none");
});

test("alinha input e ação principal da criação sem perder os estados", async function ({ page }) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await preparePage(page);
  await page.locator("#create-character").click();

  const input = await stylesOf(page.locator("#character-name"));
  const action = await stylesOf(page.locator("#creation-next"));

  expect(input.height).toBeCloseTo(40, 3);
  expect(action.height).toBeCloseTo(40, 3);
  expect(input.borderRadius).toBe("5px");
  expect(action.borderRadius).toBe(input.borderRadius);
  await page.locator("#creation-next").evaluate(function disable(button) { button.disabled = true; });
  await expect(page.locator("#creation-next")).toBeDisabled();
  await expect(page.locator("#creation-next")).toHaveCSS("opacity", "0.45");
});

test("mantém filtros e ações do Registro na família touch", async function ({ page }) {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page);
  await importCompleteCharacter(page);
  await openSheetSection(page, "journal");

  const search = await stylesOf(page.locator("#journal-search"));
  const select = await stylesOf(page.locator("#journal-type-filter"));
  const action = await stylesOf(page.locator("#journal-create"));

  expect(search.height).toBeCloseTo(44, 3);
  expect(select.height).toBeCloseTo(44, 3);
  expect(action.height).toBeCloseTo(44, 3);
  expect(search.borderRadius).toBe("5px");
  expect(select.borderRadius).toBe(search.borderRadius);
  expect(action.borderRadius).toBe(search.borderRadius);
  expect(select.fontSize).toBe("12px");
  expect(action.fontSize).toBe("11px");
});

test("mantém o chrome da ficha ancorado ao abrir o Inventário", async function ({ page }) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await preparePage(page);
  await importCompleteCharacter(page);
  await openSheetSection(page, "inventory");

  const geometry = await page.locator("#character-sheet-screen").evaluate(function measure(screen) {
    return {
      scrollY: window.scrollY,
      top: screen.getBoundingClientRect().top,
      mainScrollTop: screen.querySelector(".sheet-main").scrollTop,
      navigationScrollTop: screen.querySelector(".sheet-navigation").scrollTop,
      titleTop: screen.querySelector(".sheet-title-block h1").getBoundingClientRect().top,
      brandTop: screen.querySelector(".sheet-sidebar__brand").getBoundingClientRect().top
    };
  });

  expect(geometry.scrollY).toBe(0);
  expect(geometry.top).toBeCloseTo(0, 3);
  expect(geometry.mainScrollTop).toBe(0);
  expect(geometry.navigationScrollTop).toBe(0);
  expect(geometry.titleTop).toBeGreaterThanOrEqual(0);
  expect(geometry.brandTop).toBeGreaterThanOrEqual(0);
});
