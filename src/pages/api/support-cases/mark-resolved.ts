// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SupportCase } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as supportCasesService from '../../../support-cases.service';
import * as supportAgentsService from '../../../support-agents.service';

export type MarkSupportCasesResolvedArgs = { ids: number[] };
export type MarkSupportCasesResolvedResponse = {
  supportCases: SupportCase[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { ids } = req.body as MarkSupportCasesResolvedArgs;
    const supportCases = await supportCasesService.markCasesResolved(ids);
    // Assign new cases to agents when resolving cases
    await supportAgentsService.assignAvailableAgents();

    return res.status(201).json({ supportCases });
  }

  res.send(400);
}
