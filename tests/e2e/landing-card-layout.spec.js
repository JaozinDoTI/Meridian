import { expect, test } from "@playwright/test";
import { preparePage } from "../helpers/app.js";

test("preserva o footer e a largura do card depois de ativar as microinteracoes", async function ({ page }) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await preparePage(page);

  const card = page.locator("#create-character");
  await expect(card).toHaveClass(/\binteractive-card\b/);

  const geometry = await card.evaluate(function measureActionCard(element) {
    const body = element.querySelector(".action-card__body");
    const footer = element.querySelector(".action-card__footer");
    const cardRect = element.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();

    return {
      bodyWidth: bodyRect.width,
      cardInnerWidth: element.clientWidth,
      footerPosition: getComputedStyle(footer).position,
      footerInsideCard:
        footerRect.top >= cardRect.top &&
        footerRect.right <= cardRect.right &&
        footerRect.bottom <= cardRect.bottom &&
        footerRect.left >= cardRect.left
    };
  });

  expect(geometry.footerPosition).toBe("absolute");
  expect(geometry.footerInsideCard).toBe(true);
  expect(geometry.bodyWidth).toBeGreaterThan(geometry.cardInnerWidth * 0.9);
});
