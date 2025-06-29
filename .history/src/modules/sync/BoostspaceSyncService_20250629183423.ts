// BoostspaceSyncService - 專責 Boost.space 雙向同步邏輯
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const BOOSTSPACE_API_URL = 'https://api.boost.space/v1/';
const BOOSTSPACE_API_KEY = process.env.BOOSTSPACE_API_KEY!;
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function syncBoostspaceTasks() {
  // 1. 拉取 Boost.space 任務
  const { data: remoteTasks } = await axios.get(`${BOOSTSPACE_API_URL}tasks`, {
    headers: { Authorization: `Bearer ${BOOSTSPACE_API_KEY}` }
  });
  // 2. 進階：比對 Supabase tasks 表，僅 upsert 新增/異動資料
  const { data: localTasks } = await supabase.from('tasks').select('id, updated_at');
  const localMap = new Map((localTasks || []).map((t: any) => [t.id, t.updated_at]));
  const toUpsert = (remoteTasks || []).filter((t: any) => {
    const localUpdated = localMap.get(t.id);
    return !localUpdated || new Date(t.updated_at) > new Date(localUpdated);
  });
  if (toUpsert.length > 0) {
    await supabase.from('tasks').upsert(toUpsert, { onConflict: 'id' });
  }
  // 3. 狀態通知（可串接 eventBus 或回傳狀態）
  console.log(`[BoostspaceSync] 同步完成，新增/更新 ${toUpsert.length} 筆，總數 ${remoteTasks.length}`);
  // 4. 更新 lastSyncAt 狀態
  await supabase.from('sync_status').upsert({ source: 'boostspace', last_sync_at: new Date().toISOString() }, { onConflict: 'source' });
  return { synced: toUpsert.length, total: remoteTasks.length, lastSyncAt: new Date().toISOString(), tasks: remoteTasks };
}

export async function pushTaskToBoostspace(task: any) {
  // 3. 推送本地任務到 Boost.space
  const { data } = await axios.post(`${BOOSTSPACE_API_URL}tasks`, task, {
    headers: { Authorization: `Bearer ${BOOSTSPACE_API_KEY}` }
  });
  return data;
}
