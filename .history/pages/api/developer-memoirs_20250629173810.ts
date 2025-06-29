import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const record = req.body;
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
