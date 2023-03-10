import { SupportAgent, Prisma } from '@prisma/client';
import prisma from './libs/prisma';
import * as supportCasesService from './support-cases.service';

export async function findAll(): Promise<SupportAgent[]> {
  return prisma.supportAgent.findMany();
}

export async function createAgent(data: Prisma.SupportAgentCreateInput): Promise<SupportAgent> {
  return prisma.supportAgent.create({
    data,
  });
}

export async function deleteAgents(ids: number[]): Promise<boolean> {
  await prisma.supportAgent.deleteMany({ where: { id: { in: ids } } });
  return true;
}

export async function findAvailableAgents(): Promise<SupportAgent[]> {
  return prisma.supportAgent.findMany({
    where: {
      supportCases: { none: {} },
    },
  });
}

export async function assignAvailableAgents(): Promise<void> {
  const availableAgents = await findAvailableAgents();
  if (availableAgents.length === 0) return;

  const oldestUnassignedCases = await supportCasesService.getUnassignedCases(availableAgents.length);

  if (oldestUnassignedCases.length > 0) {
    const maxAssignments = Math.min(availableAgents.length, oldestUnassignedCases.length);
    for (let i = 0; i < maxAssignments; i++) {
      const agent = availableAgents[i];
      const supportCase = oldestUnassignedCases[i];

      console.info(`assigning case #${supportCase.id} to agent ${agent.name} (${agent.id}) `);
      await supportCasesService.assignAgentToCase(agent, supportCase);
    }
  }
}
