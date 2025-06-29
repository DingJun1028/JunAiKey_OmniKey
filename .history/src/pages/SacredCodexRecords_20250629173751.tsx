import React, { useEffect, useState } from 'react';

export default function SacredCodexRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/developer-memoirs')
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center text-neutral-400">Loading records...</div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Sacred Codex Records</h1>
      <div className="space-y-4">
        {records.map((rec) => (
          <div key={rec.id} className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-grow">
                <div className="text-neutral-200 font-semibold">Session: {rec.session_id} | Turn: {rec.turn_index}</div>
                <div className="text-neutral-300 mt-1">{rec.content}</div>
                <div className="text-xs text-neutral-500 mt-2">{rec.summary}</div>
                <div className="text-xs text-cyan-400 mt-1">Tags: {rec.auto_tags?.join(', ')}</div>
                <div className="text-xs text-neutral-500 mt-1">{new Date(rec.created_at).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
        {records.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            <h3 className="text-lg font-semibold">No Records</h3>
            <p>The Sacred Codex is waiting for your first memoir.</p>
          </div>
        )}
      </div>
    </div>
  );
}
