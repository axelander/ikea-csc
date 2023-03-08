import { PrismaClient, SupportAgent, SupportCase } from '@prisma/client';
import * as supportAgentsService from './support-agents.service';

const prisma = new PrismaClient();

export async function findAll(): Promise<SupportCase[]> {
  return await prisma.supportCase.findMany();
}

export async function createCase(data: { orderId: string }): Promise<SupportCase> {
  const supportCase = await prisma.supportCase.create({
    data,
  });

  supportAgentsService.assignAvailableAgents();

  return supportCase;
}

export async function updateCase(id: number, data: Omit<SupportCase, 'id'>): Promise<SupportCase> {
  return await prisma.supportCase.update({
    data,
    where: { id },
  });
}

export async function getUnassignedCases(limit: number): Promise<SupportCase[]> {
  return await prisma.supportCase.findMany({
    orderBy: {
      createdAt: 'asc',
    },
    where: {
      supportAgentId: null,
      resolved: false,
    },
    take: limit,
  });
}

export async function assignAgentToCase(agent: SupportAgent, supportCase: SupportCase) {
  console.log(
    JSON.stringify(
      {
        data: {
          agent: {
            connect: {
              id: agent.id,
            },
          },
        },
        where: {
          id: supportCase.id,
        },
      },
      null,
      2
    )
  );
  await prisma.supportCase.update({
    data: {
      agent: {
        connect: {
          id: agent.id,
        },
      },
    },
    where: {
      id: supportCase.id,
    },
  });
}
