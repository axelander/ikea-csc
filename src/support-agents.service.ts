import { PrismaClient, SupportAgent } from '@prisma/client';
import * as supportCasesService from './support-cases.service';

const prisma = new PrismaClient();

export async function findAll(): Promise<SupportAgent[]> {
  const supportAgents = await prisma.supportAgent.findMany();
  return supportAgents;
}

export async function createAgent(data: { name: string }): Promise<SupportAgent> {
  const agent = await prisma.supportAgent.create({
    data,
  });

  await assignAvailableAgents();

  return agent;
}

export async function updateAgent(id: number, data: Omit<SupportAgent, 'id'>): Promise<SupportAgent> {
  return await prisma.supportAgent.update({
    data,
    where: { id },
  });
}

export async function deleteAgent(id: number): Promise<SupportAgent> {
  return await prisma.supportAgent.delete({ where: { id } });
}

export async function findAvailableAgents(): Promise<SupportAgent[]> {
  const availableAgents = await prisma.supportAgent.findMany({
    where: {
      supportCases: { none: {} },
    },
  });

  return availableAgents;
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
