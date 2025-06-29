import { test, expect } from '@playwright/test';

// E2E 測試 Boost.space 同步 API

test.describe('Boost.space 雙向同步 E2E', () => {
  test('GET /api/boostspace-sync 應回傳同步狀態與任務', async ({ request }) => {
    const res = await request.get('/api/boostspace-sync');
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty('data');
    expect(json.data).toHaveProperty('tasks');
    expect(Array.isArray(json.data.tasks)).toBe(true);
    expect(json.data).toHaveProperty('lastSyncAt');
  });

  test('POST /api/boostspace-sync 可推送任務', async ({ request }) => {
    const dummyTask = { title: 'E2E 測試任務', description: '自動化測試', id: `e2e-${Date.now()}` };
    const res = await request.post('/api/boostspace-sync', { data: dummyTask });
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty('data');
  });
});
