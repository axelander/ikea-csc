import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { CreateSupportAgentArgs, GetSupportAgentsResponse } from './api/support-agents';
import { GetSupportCasesResponse } from './api/support-cases';
import { SupportAgentsTable, SupportAgentsTableProps } from '@/components/SupportAgentsTable';
import { SupportCasesTable } from '@/components/SupportCasesTable';
import { MarkSupportCasesResolvedArgs } from './api/support-cases/mark-resolved';
import { DeleteAgentsArgs } from './api/support-agents/delete-agents';
import { getReq, postReq } from '@/libs/request';

export default function Admin() {
  const {
    data: agentsResponse,
    isLoading: agentsLoading,
    mutate: mutateAgents,
  } = useSWR<GetSupportAgentsResponse>('/api/support-agents', getReq);

  const {
    data: supportCasesResponse,
    isLoading: supportCasesLoading,
    mutate: mutateCases,
  } = useSWR<GetSupportCasesResponse>('/api/support-cases', getReq);

  const { trigger: triggerAddAgent } = useSWRMutation(
    '/api/support-agents',
    (url: string, { arg }: { arg: CreateSupportAgentArgs }) => {
      return postReq(url, arg).then((res) => {
        mutateCases();
        return res.json();
      });
    }
  );

  const { trigger: triggerMarkAsResolved } = useSWRMutation(
    '/api/support-cases/mark-resolved',
    (url: string, { arg }: { arg: MarkSupportCasesResolvedArgs }) => {
      return postReq(url, arg).then((res) => {
        mutateCases();
        return res.json();
      });
    }
  );

  const { trigger: triggerDeleteAgents } = useSWRMutation(
    '/api/support-agents/delete-agents',
    (url: string, { arg }: { arg: DeleteAgentsArgs }) => {
      return postReq(url, arg).then(() => {
        mutateAgents();
        mutateCases();
      });
    }
  );

  const onResolveCases: SupportAgentsTableProps['onResolveCases'] = (cases) =>
    triggerMarkAsResolved({ ids: cases.map(({ id }) => id) });

  const onAddNewAgent: SupportAgentsTableProps['onAddNewAgent'] = (name) => {
    triggerAddAgent({ name });
  };

  const onDeleteAgents: SupportAgentsTableProps['onDeleteAgents'] = (agents) => {
    triggerDeleteAgents({ ids: agents.map(({ id }) => id) });
  };

  if (agentsLoading || supportCasesLoading) {
    return <p>Loading...</p>;
  }

  if (!agentsResponse || !supportCasesResponse) {
    return <p>Error loading data</p>;
  }

  const assignedUnresolved = supportCasesResponse.supportCases.filter(
    (supportCase) => !!supportCase.supportAgentId && !supportCase.resolved
  );

  return (
    <>
      <SupportAgentsTable
        agents={agentsResponse.supportAgents}
        assignedCases={assignedUnresolved}
        onResolveCases={onResolveCases}
        onAddNewAgent={onAddNewAgent}
        onDeleteAgents={onDeleteAgents}
      />
      <div className="pt-20 pb-20">
        <SupportCasesTable cases={supportCasesResponse.supportCases} />
      </div>
    </>
  );
}
