// 多平台同步狀態聚合 UI 與 eventBus 監聽範例
import React, { useEffect, useState } from 'react';

interface SyncStatus {
  source: string;
  status: 'idle' | 'syncing' | 'done' | 'error';
  lastSyncAt?: string;
  synced?: number;
  total?: number;
  error?: string;
}

const sources = [
  { key: 'boostspace', label: 'Boost.space' },
  { key: 'capacities', label: 'Capacities' },
  // 可擴充更多平台
];

const SyncStatusPanel: React.FC = () => {
  const [statusMap, setStatusMap] = useState<Record<string, SyncStatus>>({});

  useEffect(() => {
    // eventBus 監聽
    const eventBus = (typeof window !== 'undefined' && window.eventBus) ? window.eventBus : undefined;
    if (!eventBus) return;
    const onStart = (payload: any) => {
      setStatusMap(prev => ({ ...prev, [payload.source]: { ...prev[payload.source], status: 'syncing' } }));
    };
    const onDone = (payload: any) => {
      setStatusMap(prev => ({ ...prev, [payload.source]: { ...prev[payload.source], status: 'done', lastSyncAt: payload.lastSyncAt, synced: payload.synced, total: payload.total } }));
    };
    const onError = (payload: any) => {
      setStatusMap(prev => ({ ...prev, [payload.source]: { ...prev[payload.source], status: 'error', error: payload.error } }));
    };
    eventBus.on?.('sync:start', onStart);
    eventBus.on?.('sync:done', onDone);
    eventBus.on?.('sync:error', onError);
    return () => {
      eventBus.off?.('sync:start', onStart);
      eventBus.off?.('sync:done', onDone);
      eventBus.off?.('sync:error', onError);
    };
  }, []);

  return (
    <div className="p-4 bg-neutral-900 rounded-lg shadow-xl mb-6">
      <h3 className="text-lg font-bold text-blue-300 mb-2">同步狀態面板</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map(s => {
          const st = statusMap[s.key] || { status: 'idle' };
          return (
            <div key={s.key} className="p-3 rounded bg-neutral-800 flex flex-col gap-1">
              <span className="font-semibold text-neutral-200">{s.label}</span>
              <span className={
                st.status === 'syncing' ? 'text-yellow-400' :
                st.status === 'done' ? 'text-green-400' :
                st.status === 'error' ? 'text-red-400' : 'text-neutral-400'
              }>
                {st.status === 'syncing' && '同步中...'}
                {st.status === 'done' && `完成 (${st.synced ?? 0}/${st.total ?? 0})`}
                {st.status === 'idle' && '閒置'}
                {st.status === 'error' && `錯誤：${st.error}`}
              </span>
              {st.lastSyncAt && <span className="text-xs text-neutral-400">上次同步：{new Date(st.lastSyncAt).toLocaleString()}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SyncStatusPanel;
