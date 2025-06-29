// Capacities 匯入/匯出前端串接範例（React/TypeScript）
import React, { useState } from 'react';
import axios from 'axios';

const CapacitiesCompatDemo: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [exportResult, setExportResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setImporting(true);
    setError(null);
    try {
      const file = e.target.files[0];
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await axios.post('/api/capacities-compat', json);
      setImportResult(res.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    try {
      const res = await axios.get('/api/capacities-compat');
      setExportResult(res.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 bg-neutral-800/50 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-indigo-400 mb-4">Capacities 匯入/匯出 Demo</h2>
      <div className="mb-4">
        <label className="block mb-2 text-neutral-200">匯入 Capacities JSON：</label>
        <input type="file" accept="application/json" onChange={handleImport} disabled={importing} />
        {importing && <span className="ml-2 text-indigo-300">匯入中...</span>}
        {importResult && <div className="text-green-400 mt-2">匯入成功！</div>}
      </div>
      <div className="mb-4">
        <button onClick={handleExport} className="px-4 py-2 bg-indigo-500 text-neutral-100 rounded hover:bg-indigo-400 transition font-semibold shadow" disabled={exporting}>
          {exporting ? '匯出中...' : '匯出 Capacities JSON'}
        </button>
        {exportResult && <pre className="bg-neutral-900 text-xs text-neutral-100 mt-2 p-2 rounded max-h-48 overflow-auto">{JSON.stringify(exportResult, null, 2)}</pre>}
      </div>
      {error && <div className="text-red-400 mt-2">{error}</div>}
    </div>
  );
};

export default CapacitiesCompatDemo;
