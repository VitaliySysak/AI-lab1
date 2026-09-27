import { expect, test } from '@playwright/test';

test('головна сторінка веде на /api/health, а ендпоінт відповідає', async ({ page, request }, testInfo) => {
  await page.goto('/');

  // Перевіряємо саме те, що змінили на сторінці.
  const link = page.getByRole('link', { name: 'Стан сервісу' });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/api/health');

  // Посилання не мертве: ендпоінт на зібраному сервері відповідає за контрактом.
  const response = await request.get('/api/health');
  expect(response.status()).toBe(200);
  expect((await response.json()).status).toBe('ok');

  // Скріншот як доказ: файл у test-results/ і вкладення у звіті прогону.
  const shot = testInfo.outputPath('home-health-link.png');
  await page.screenshot({ path: shot, fullPage: true });
  await testInfo.attach('home-health-link', { path: shot, contentType: 'image/png' });
});
