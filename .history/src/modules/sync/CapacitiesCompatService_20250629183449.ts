// CapacitiesCompatService - Capacities 格式匯入/匯出與轉換
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function importFromCapacities(data: any) {
  // 假設 Capacities 格式為 { records: [{ content, tags, updated_at, ... }] }
  const records = (data.records || []).map((r: any) => ({
    content: r.content,
    auto_tags: r.tags || [],
    updated_at: r.updated_at || new Date().toISOString(),
    source: 'capacities',
    // 其他欄位轉換
  }));
  if (records.length > 0) {
    await supabase.from('developer_memoirs').upsert(records);
  }
  // 狀態通知
  console.log(`[CapacitiesCompat] 匯入 ${records.length} 筆資料`);
  return { success: true, imported: records.length };
}

export async function exportToCapacities() {
  // 查詢本地資料，轉換為 Capacities 格式
  const { data } = await supabase.from('developer_memoirs').select('content, auto_tags, updated_at');
  const records = (data || []).map((r: any) => ({
    content: r.content,
    tags: r.auto_tags,
    updated_at: r.updated_at,
  }));
  // 狀態通知
  console.log(`[CapacitiesCompat] 匯出 ${records.length} 筆資料`);
  return { records };
}
