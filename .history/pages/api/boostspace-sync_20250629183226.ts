import type { NextApiRequest, NextApiResponse } from 'next';
import { syncBoostspaceTasks, pushTaskToBoostspace } from '../../src/modules/sync/BoostspaceSyncService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await syncBoostspaceTasks();
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  if (req.method === 'POST') {
    try {
      const data = await pushTaskToBoostspace(req.body);
      res.status(201).json({ data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
