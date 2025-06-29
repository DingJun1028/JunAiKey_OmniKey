// CapacitiesCompatService - Capacities 格式匯入/匯出與轉換
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function importFromCapacities(data: any) {
  // TODO: 轉換 Capacities 格式為本地格式，寫入 Supabase
  // 例如：data.records.map(...) -> supabase.from('developer_memoirs').insert(...)
  return { success: true };
}

export async function exportToCapacities() {
  // TODO: 查詢本地資料，轉換為 Capacities 格式
  // 例如：const { data } = await supabase.from('developer_memoirs').select('*');
  return { records: [] };
}
