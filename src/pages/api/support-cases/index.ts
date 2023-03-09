// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SupportCase } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as supportCasesService from '../../../support-cases.service';

export type GetSupportCasesResponse = {
  supportCases: SupportCase[];
};

export type CreateSupportCaseArgs = { orderId: string };
export type CreateSupportCaseResponse = {
  supportCase: SupportCase;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const supportCase = await supportCasesService.createCase(req.body as CreateSupportCaseArgs);
    return res.status(201).json({ supportCase });
  }

  if (req.method === 'GET') {
    const supportCases = await supportCasesService.findAll();
    return res.status(200).json({ supportCases });
  }

  res.send(400);
}
