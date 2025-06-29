import { test, expect } from '@playwright/test';

// E2E 測試 Capacities 匯入/匯出 API

test.describe('Capacities 匯入/匯出 E2E', () => {
  test('POST /api/capacities-compat 匯入資料', async ({ request }) => {
    const dummy = { records: [{ content: 'E2E 測試', tags: ['e2e'], updated_at: new Date().toISOString() }] };
    const res = await request.post('/api/capacities-compat', { data: dummy });
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty('success', true);
    expect(json).toHaveProperty('imported');
  });

  test('GET /api/capacities-compat 匯出資料', async ({ request }) => {
    const res = await request.get('/api/capacities-compat');
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty('records');
    expect(Array.isArray(json.records)).toBe(true);
  });
});
