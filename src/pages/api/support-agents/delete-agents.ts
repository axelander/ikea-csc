// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as supportAgentsService from '../../../support-agents.service';

export type DeleteAgentsArgs = { ids: number[] };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { ids } = req.body as DeleteAgentsArgs;
    await supportAgentsService.deleteAgents(ids);
    await supportAgentsService.assignAvailableAgents();
    return res.send(204);
  }

  res.send(400);
}
