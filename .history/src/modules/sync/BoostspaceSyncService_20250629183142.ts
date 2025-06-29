// BoostspaceSyncService - 專責 Boost.space 雙向同步邏輯
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const BOOSTSPACE_API_URL = 'https://api.boost.space/v1/';
const BOOSTSPACE_API_KEY = process.env.BOOSTSPACE_API_KEY!;
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function syncBoostspaceTasks() {
  // 1. 拉取 Boost.space 任務
  const { data } = await axios.get(`${BOOSTSPACE_API_URL}tasks`, {
    headers: { Authorization: `Bearer ${BOOSTSPACE_API_KEY}` }
  });
  // 2. 寫入/比對 Supabase developer_memoirs 或 tasks 表
  // TODO: 實作資料比對與 upsert
  return data;
}

export async function pushTaskToBoostspace(task: any) {
  // 3. 推送本地任務到 Boost.space
  const { data } = await axios.post(`${BOOSTSPACE_API_URL}tasks`, task, {
    headers: { Authorization: `Bearer ${BOOSTSPACE_API_KEY}` }
  });
  return data;
}
