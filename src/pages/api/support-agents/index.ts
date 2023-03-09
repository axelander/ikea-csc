// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SupportAgent } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as supportAgentsService from '../../../support-agents.service';

export type GetSupportAgentsResponse = {
  supportAgents: SupportAgent[];
};

export type CreateSupportAgentArgs = Omit<SupportAgent, 'id'>;
export type CreateSupportAgentResponse = {
  supportAgent: SupportAgent;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const supportAgent = await supportAgentsService.createAgent(req.body as CreateSupportAgentArgs);
    return res.status(201).json({ supportAgent });
  }

  if (req.method === 'GET') {
    const supportAgents = await supportAgentsService.findAll();
    return res.status(200).json({ supportAgents });
  }

  res.send(400);
}
