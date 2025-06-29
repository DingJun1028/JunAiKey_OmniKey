import { syncBoostspaceTasks, pushTaskToBoostspace } from '../BoostspaceSyncService';

describe('BoostspaceSyncService', () => {
  it('should fetch tasks from Boost.space API', async () => {
    const data = await syncBoostspaceTasks();
    expect(data).toBeDefined();
    // 可根據實際 API 回傳結構補充更多驗證
  });

  it('should push a task to Boost.space API', async () => {
    const dummyTask = { title: 'Test Task', description: 'Test Desc' };
    // 測試時可 mock axios，這裡僅示意
    const data = await pushTaskToBoostspace(dummyTask);
    expect(data).toBeDefined();
  });
});
