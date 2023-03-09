import { useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { SupportAgent, SupportCase } from '@prisma/client';

export interface SupportAgentsTableProps {
  agents: SupportAgent[];
  assignedCases: SupportCase[];
  onResolveCases: (supportCases: SupportCase[]) => void;
  onAddNewAgent: (name: string) => void;
  onDeleteAgents: (agents: SupportAgent[]) => void;
}

export const SupportAgentsTable: React.FC<SupportAgentsTableProps> = ({
  agents,
  assignedCases,
  onResolveCases,
  onAddNewAgent,
  onDeleteAgents,
}) => {
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [newAgentName, setNewAgentName] = useState<string>('');
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<SupportAgent[]>([]);

  useLayoutEffect(() => {
    const isIndeterminate = selectedAgents.length > 0 && selectedAgents.length < agents.length;
    setChecked(selectedAgents.length === agents.length);
    setIndeterminate(isIndeterminate);
    if (checkbox.current) checkbox.current.indeterminate = isIndeterminate;
  }, [selectedAgents, agents.length]);

  function toggleAll() {
    setSelectedAgents(checked || indeterminate ? [] : agents);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const isChecked = (agentId: number): boolean => selectedAgents.some((a) => a.id === agentId);
  const findAssignedCaseForAgent = (agentId: number): SupportCase | undefined =>
    assignedCases.find((c) => c.supportAgentId === agentId);
  const getSelectedCases = (): SupportCase[] =>
    selectedAgents.reduce<SupportCase[]>((acc, agent) => {
      const selectedAgentCase = assignedCases.find((c) => c.supportAgentId === agent.id);
      if (selectedAgentCase) {
        return [...acc, selectedAgentCase];
      }
      return acc;
    }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Support agents</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all support agents.</p>
        </div>
        <div>
          <label htmlFor="name" className="sr-only">
            name
          </label>
          <input
            value={newAgentName}
            onChange={(e) => setNewAgentName(e.target.value)}
            type="text"
            name="name"
            id="name"
            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Agent name"
          />
        </div>
        <div className="ml-4">
          <button
            disabled={newAgentName.length === 0}
            onClick={() => {
              onAddNewAgent(newAgentName);
              setNewAgentName('');
            }}
            type="button"
            className="block rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add agent
          </button>
        </div>
      </div>
      <div className="flow-root mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              {selectedAgents.length > 0 && (
                <div className="absolute top-0 flex items-center h-12 space-x-3 bg-white left-14 sm:left-12">
                  <button
                    onClick={() => {
                      onResolveCases(getSelectedCases());
                      setSelectedAgents([]);
                    }}
                    type="button"
                    className="inline-flex items-center px-2 py-1 text-sm font-semibold text-gray-900 bg-white rounded shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  >
                    Resolve case(s)
                  </button>
                  <button
                    onClick={() => {
                      onDeleteAgents(selectedAgents);
                      setSelectedAgents([]);
                    }}
                    type="button"
                    className="inline-flex items-center px-2 py-1 text-sm font-semibold text-white bg-red-700 rounded shadow-sm ring-1 ring-inset disabled:cursor-not-allowed disabled:opacity-30 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Delete agent(s)
                  </button>
                </div>
              )}
              <table className="min-w-full divide-y divide-gray-300 table-fixed">
                <thead>
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute w-4 h-4 -mt-2 text-indigo-600 border-gray-300 rounded left-4 top-1/2 focus:ring-indigo-600"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                      Case id
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agents.map((agent) => {
                    const assignedCase = findAssignedCaseForAgent(agent.id);
                    return (
                      <tr key={agent.id} className={isChecked(agent.id) ? 'bg-gray-50' : undefined}>
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {isChecked(agent.id) && <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />}
                          <input
                            type="checkbox"
                            className="absolute w-4 h-4 -mt-2 text-indigo-600 border-gray-300 rounded left-4 top-1/2 focus:ring-indigo-600"
                            value={agent.name}
                            checked={isChecked(agent.id)}
                            onChange={(e) =>
                              setSelectedAgents(
                                e.target.checked
                                  ? [...selectedAgents, agent]
                                  : selectedAgents.filter((a) => a.id !== agent.id)
                              )
                            }
                          />
                        </td>
                        <td
                          className={classNames(
                            'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                            isChecked(agent.id) ? 'text-indigo-600' : 'text-gray-900'
                          )}
                        >
                          {agent.name}
                        </td>
                        <td>{assignedCase ? `#${assignedCase.id}` : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
