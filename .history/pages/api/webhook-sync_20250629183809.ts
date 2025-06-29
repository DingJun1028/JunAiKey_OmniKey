// Webhook 觸發/接收範例（Next.js API route）
import type { NextApiRequest, NextApiResponse } from 'next';
import { syncBoostspaceTasks } from '../../src/modules/sync/BoostspaceSyncService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 只允許 POST 觸發
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  try {
    // 可驗證 webhook secret（如 req.headers['x-webhook-secret']）
    // 觸發 Boost.space 雙向同步
    const result = await syncBoostspaceTasks();
    res.status(200).json({ message: '同步已觸發', result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
