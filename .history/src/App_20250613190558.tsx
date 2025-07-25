import React, { useEffect, useState } from 'react';
// 導入核心模組
import { NavigationAgent } from '../intent/NavigationAgent';
import { MemoryPalace } from '../knowledge/MemoryPalace';
import './styles/light.css';

// 四大核心支柱說明
const pillars = [
  {
    title: '自我導航',
    desc: '智能體主動解析用戶意圖，規劃任務與知識流。'
  },
  {
    title: '永久記憶',
    desc: '所有互動與知識自動記錄，形成可查詢的知識圖譜。'
  },
  {
    title: '權能冶煉',
    desc: '動態組合技能與權限，賦能用戶與開發者。'
  },
  {
    title: '符文嵌合',
    desc: '自定義自動化規則，串接多端API與代理協作。'
  }
];

// 假設的向量資料庫實作
const vectorDB = {
  async query(params: { userId: string; vectors: number[]; topK: number }) {
    return [{ content: '記憶片段1' }, { content: '記憶片段2' }]
  },
  async insert(record: unknown) {
    // 可擴充實際儲存邏輯
  }
};

export default function App() {
  const [userId, setUserId] = useState('demo-user');
  const [task, setTask] = useState('查詢今日任務');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 初始化核心代理與記憶庫
  const memoryPalace = new MemoryPalace(vectorDB);
  const agent = new NavigationAgent(memoryPalace);

  // 處理任務執行
  const handleExecute = async () => {
    setLoading(true);
    try {
      // 直接用 fetch 呼叫 API Gateway
      const response = await fetch('/v1/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, task, platform: 'web' })
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult('發生錯誤: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ fontFamily: 'sans-serif', padding: 32, maxWidth: 700, margin: 'auto' }}>
      <h1>Jun.AI.Key 萬能元鑰系統</h1>
      <p>歡迎使用！請於左側選單選擇功能。</p>
      {/* 可擴充：代理群、知識檢索、任務執行等元件 */}
      <h2>四大核心支柱</h2>
      <ul>
        {pillars.map(p => (
          <li key={p.title}>
            <strong>{p.title}：</strong>{p.desc}
          </li>
        ))}
      </ul>
      <h3>用戶任務互動</h3>
      <div style={{ marginBottom: 16 }}>
        <label>
          用戶ID：
          <input value={userId} onChange={e => setUserId(e.target.value)} style={{ marginLeft: 8 }} />
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          任務描述：
          <input value={task} onChange={e => setTask(e.target.value)} style={{ marginLeft: 8, width: 300 }} />
        </label>
      </div>
      <button onClick={handleExecute} disabled={loading} style={{ padding: '8px 24px' }}>
        {loading ? '執行中...' : '執行任務'}
      </button>
      <h4>執行結果</h4>
      <pre style={{ background: '#f6f8fa', padding: 16, borderRadius: 8, minHeight: 80 }}>{result}</pre>
      <hr />
      <h3>進化飛輪</h3>
      <ol>
        <li>用戶互動</li>
        <li>智能體規劃</li>
        <li>知識記憶</li>
        <li>自動化協作</li>
        <li>能力進化</li>
      </ol>
      <p style={{ color: '#888', fontSize: 14 }}>© 2025 Jun.AI.Key Collective</p>
    </div>
  );
}
