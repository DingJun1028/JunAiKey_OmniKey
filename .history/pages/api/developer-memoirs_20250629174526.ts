import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 驗證 API KEY 或用戶身份（可依需求擴充）
  const apiKey = req.headers['authorization']?.replace('Bearer ', '') || req.query.api_key;
  if (process.env.JUNAIKEY_API_KEY && apiKey !== process.env.JUNAIKEY_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method === 'POST') {
    const record = req.body;
    // 欄位預設補全
    record.source = record.source || 'api';
    record.user_id = record.user_id || req.headers['x-user-id'] || null;
    record.status = record.status || (record.execution_result?.error ? 'pending' : 'actioned');
    record.updated_at = new Date().toISOString();
    record.created_at = record.created_at || new Date().toISOString();
    // 僅允許必要欄位
    const allowed = [
      'session_id','turn_index','actor','content','action_intent','execution_result','auto_tags','summary','metadata','source','user_id','status','embedding','updated_at','created_at'
    ];
    Object.keys(record).forEach(k => !allowed.includes(k) && delete record[k]);
    // 必要欄位驗證
    if (!record.session_id || !record.turn_index || !record.actor || !record.content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const { error } = await supabase.from('developer_memoirs').insert(record);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json({ message: 'Memoir archived successfully' });
  }
  if (req.method === 'GET') {
    const { session_id } = req.query;
    const query = supabase.from('developer_memoirs').select('*').order('created_at', { ascending: false });
    if (session_id) query.eq('session_id', session_id);
    const { data, error } = await query;
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
