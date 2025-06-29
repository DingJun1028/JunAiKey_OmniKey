import type { NextApiRequest, NextApiResponse } from 'next';
import { importFromCapacities, exportToCapacities } from '../../src/modules/sync/CapacitiesCompatService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const result = await importFromCapacities(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  if (req.method === 'GET') {
    try {
      const result = await exportToCapacities();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
