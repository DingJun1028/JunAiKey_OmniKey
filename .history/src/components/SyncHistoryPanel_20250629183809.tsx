// 多平台同步歷史紀錄聚合 UI
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const sources = [
  { key: 'boostspace', label: 'Boost.space' },
  { key: 'capacities', label: 'Capacities' },
  // 可擴充更多平台
];

const SyncHistoryPanel: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // 查詢 sync_status 表的歷史紀錄（假設有 last_sync_at, source, synced, total 欄位）
    supabase.from('sync_status').select('*').order('last_sync_at', { ascending: false }).then(({ data }) => {
      setHistory(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-4 bg-neutral-900 rounded-lg shadow-xl mb-6">
      <h3 className="text-lg font-bold text-blue-300 mb-2">同步歷史紀錄</h3>
      {loading ? <div className="text-neutral-400">載入中...</div> : (
        <table className="w-full text-sm text-neutral-200">
          <thead>
            <tr>
              <th className="text-left">平台</th>
              <th className="text-left">同步時間</th>
              <th className="text-left">筆數</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-b border-neutral-800">
                <td>{sources.find(s => s.key === h.source)?.label || h.source}</td>
                <td>{h.last_sync_at ? new Date(h.last_sync_at).toLocaleString() : '-'}</td>
                <td>{h.synced ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SyncHistoryPanel;
