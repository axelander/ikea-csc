import { SupportAgent, SupportCase, Prisma } from '@prisma/client';
import prisma from './libs/prisma';

export async function findAll(): Promise<SupportCase[]> {
  return prisma.supportCase.findMany();
}

export async function createCase(data: Prisma.SupportCaseCreateInput): Promise<SupportCase> {
  const supportCase = await prisma.supportCase.create({
    data,
  });

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

  return prisma.supportCase.findMany({ where: { id: { in: caseIds } } });
}
