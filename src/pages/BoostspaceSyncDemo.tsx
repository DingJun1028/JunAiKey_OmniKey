// Boost.space 雙向同步前端串接範例（React/TypeScript）
import React, { useState } from 'react';
import axios from 'axios';

const BoostspaceSyncDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/boostspace-sync');
      setTasks(res.data?.data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-neutral-800/50 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Boost.space 雙向同步 Demo</h2>
      <button onClick={handleSync} className="px-4 py-2 bg-yellow-500 text-neutral-900 rounded hover:bg-yellow-400 transition font-semibold shadow" disabled={loading}>
        {loading ? '同步中...' : '同步 Boost.space 任務'}
      </button>
      {error && <div className="text-red-400 mt-2">{error}</div>}
      <ul className="mt-4 space-y-2">
        {tasks.map((task, idx) => (
          <li key={task.id || idx} className="bg-neutral-700/50 p-3 rounded text-neutral-200">
            <strong>{task.title || '無標題'}</strong> - {task.description || ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoostspaceSyncDemo;
