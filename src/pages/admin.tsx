import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { Inter } from 'next/font/google';
import { CreateSupportAgentArgs, GetSupportAgentsResponse } from './api/support-agents';
import { GetSupportCasesResponse } from './api/support-cases';
import { SupportCase } from '@prisma/client';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Admin() {
  const [newAgentName, setNewAgentName] = useState<string>('');
  const { data: agents, isLoading: agentsLoading } = useSWR<GetSupportAgentsResponse>('/api/support-agents', fetcher);
  const {
    data: supportCaseResponse,
    isLoading: supportCasesLoading,
    mutate: mutateCases,
  } = useSWR<GetSupportCasesResponse>('/api/support-cases', fetcher);
  const { trigger } = useSWRMutation('/api/support-agents', (url: string, { arg }: { arg: CreateSupportAgentArgs }) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arg),
    }).then((res) => {
      mutateCases();
      return res.json();
    });
  });

  if (agentsLoading || supportCasesLoading) {
    return <p>Loading...</p>;
  }

  if (!agents || !supportCaseResponse) {
    return <p>Error loading data</p>;
  }

  const { assigned, unassigned } = supportCaseResponse.supportCases.reduce<{
    assigned: SupportCase[];
    unassigned: SupportCase[];
  }>(
    (acc, supportCase) => {
      if (!supportCase.supportAgentId) {
        acc.unassigned.push(supportCase);
      } else {
        acc.assigned.push(supportCase);
      }

      return acc;
    },
    {
      assigned: [],
      unassigned: [],
    }
  );

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-3 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Support Agents</h1>
          </div>
        </div>
        <div className="flow-root mt-8">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Current case
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {agents.supportAgents.map((supportAgent) => (
                    <tr key={supportAgent.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                        {supportAgent.name}
                      </td>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                        {assigned.find((c) => c.supportAgentId === supportAgent.id)?.orderId}
                      </td>
                      <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Edit
                          <span className="sr-only">, {supportAgent.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1 px-4 sm:px-6 lg:px-8">
        <form className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">Add new agent</h3>
              </div>

              <div className="mt-6 gap-y-6 gap-x-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                    Name
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <input
                      value={newAgentName}
                      onChange={(e) => setNewAgentName(e.target.value)}
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="given-name"
                      className="block w-full max-w-lg rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="block px-3 py-2 text-sm font-semibold text-center text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => trigger({ name: newAgentName })}
            >
              Add agent
            </button>
          </div>
        </form>
      </div>
      <pre>
        Unresolved cases
        {JSON.stringify(unassigned, null, 2)}
      </pre>
    </div>
  );
}
