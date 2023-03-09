import { PrismaClient, SupportAgent, SupportCase } from '@prisma/client';
import * as supportAgentsService from './support-agents.service';

const prisma = new PrismaClient();

export async function findAll(): Promise<SupportCase[]> {
  return prisma.supportCase.findMany();
}

export async function createCase(data: { orderId: string }): Promise<SupportCase> {
  const supportCase = await prisma.supportCase.create({
    data,
  });

  supportAgentsService.assignAvailableAgents();

  return supportCase;
}

export async function getUnassignedCases(limit: number): Promise<SupportCase[]> {
  return prisma.supportCase.findMany({
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

export async function markCasesResolved(caseIds: number[]): Promise<SupportCase[]> {
  await prisma.supportCase.updateMany({
    data: {
      resolved: true,
      supportAgentId: null,
    },
    where: {
      id: {
        in: caseIds,
      },
    },
  });

  // Assign new cases to agents when resolving cases
  supportAgentsService.assignAvailableAgents();

  return prisma.supportCase.findMany({ where: { id: { in: caseIds } } });
}
