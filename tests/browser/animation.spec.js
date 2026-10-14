import { test, expect } from '@playwright/test';

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  test(`greeting and animated WebGL scene survive reload at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');

    for (let load = 0; load < 2; load++) {
      await expect(page.getByRole('heading', { name: 'hello alex.' })).toBeVisible();
      const canvas = page.locator('canvas.scene');
      await expect(canvas).toBeVisible();
      await expect.poll(() => canvas.evaluate((element) => element.width)).toBeGreaterThan(0);
      const headingBox = await page.getByRole('heading').boundingBox();
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox.x).toBeGreaterThanOrEqual(0);
      expect(canvasBox.x + canvasBox.width).toBeLessThanOrEqual(viewport.width);
      expect(canvasBox.y + canvasBox.height).toBeLessThanOrEqual(viewport.height);
      expect(canvasBox.x >= headingBox.x + headingBox.width ||
        canvasBox.y >= headingBox.y + headingBox.height).toBeTruthy();

      // Real canvas screenshots must change without mouse or keyboard input.
      const firstFrame = await canvas.screenshot();
      await expect.poll(async () => !(await canvas.screenshot()).equals(firstFrame), {
        timeout: 5000,
      }).toBe(true);
      if (load === 0) await page.reload();
    }
    expect(errors).toEqual([]);
  });
}
