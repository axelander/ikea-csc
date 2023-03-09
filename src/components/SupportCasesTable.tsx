import { SupportCase } from '@prisma/client';
import classNames from 'classnames';

interface SupportCasesTableProps {
  cases: SupportCase[];
}

export const SupportCasesTable: React.FC<SupportCasesTableProps> = ({ cases }) => {
  const isCaseInProgress = (supportCase: SupportCase): boolean => !supportCase.resolved && !!supportCase.supportAgentId;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">All support cases</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all support cases.</p>
        </div>
      </div>
      <div className="mt-10 -mx-4 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                id
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                order id
              </th>

              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                created at
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {cases.map((supportCase, caseIdx) => (
              <tr key={supportCase.id}>
                <td
                  className={classNames(
                    caseIdx === 0 ? '' : 'border-t border-gray-200',
                    'relative py-4 pl-4 pr-3 text-sm sm:pl-6'
                  )}
                >
                  {supportCase.id}
                </td>
                <td
                  className={classNames(
                    caseIdx === 0 ? '' : 'border-t border-gray-200',
                    'relative py-4 pl-4 pr-3 text-sm'
                  )}
                >
                  <div className="font-medium text-gray-900">{supportCase.orderId}</div>
                  <div className="flex flex-col mt-1 text-gray-500 sm:block lg:hidden">
                    <span>{supportCase.orderId}</span>
                  </div>
                  {caseIdx !== 0 ? <div className="absolute right-0 h-px bg-gray-200 left-6 -top-px" /> : null}
                </td>

                <td
                  className={classNames(
                    caseIdx === 0 ? '' : 'border-t border-gray-200',
                    'px-3 py-3.5 text-sm text-gray-500'
                  )}
                >
                  {new Date(supportCase.createdAt).toUTCString()}
                </td>
                <td
                  className={classNames(
                    caseIdx === 0 ? '' : 'border-t border-transparent',
                    'relative py-3.5 pl-3 pr-4  text-sm font-medium'
                  )}
                >
                  {caseIdx !== 0 ? <div className="absolute left-0 h-px bg-gray-200 right-6 -top-px" /> : null}
                  {supportCase.resolved && (
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                      Resolved
                    </span>
                  )}
                  {isCaseInProgress(supportCase) && (
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">
                      In progress
                    </span>
                  )}
                  {!supportCase.resolved && !isCaseInProgress(supportCase) && (
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full text-grey-800 bg-grey-100">
                      Unassigned
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
