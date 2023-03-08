// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SupportAgent } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as supportAgentsService from '../../support-agents/support-agents.service'

export type GetSupportAgentsResponse = {
  supportAgents: SupportAgent[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetSupportAgentsResponse>
) {
  const supportAgents = await supportAgentsService.findAll()
  console.log(supportAgents)
  res.status(200).json({ supportAgents })
}
