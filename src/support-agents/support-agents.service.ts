import { PrismaClient, SupportAgent } from '@prisma/client'

const prisma = new PrismaClient()

export async function findAll(): Promise<SupportAgent[]> {
  const supportAgents = await prisma.supportAgent.findMany()
  return supportAgents;
}

export async function createAgent(name: string): Promise<SupportAgent> {
  return await prisma.supportAgent.create({
    data: {
      name
    }
  })
}

export async function updateAgent(id: number, data: Omit<SupportAgent, 'id'>): Promise<SupportAgent> {
  return await prisma.supportAgent.update({
    data,
    where: { id }
  })
}

export async function deleteAgent(id: number): Promise<SupportAgent> {
  return await prisma.supportAgent.delete({ where: { id } })
}
