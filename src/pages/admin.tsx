import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { CreateSupportAgentArgs, CreateSupportAgentResponse, GetSupportAgentsResponse } from './api/support-agents'

const inter = Inter({ subsets: ['latin'] })

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Admin() {
  const {data, error, isLoading} = useSWR<GetSupportAgentsResponse>('/api/support-agents', fetcher)
  const {trigger, isMutating} = useSWRMutation('/api/support-agents', (url: string, { arg }: { arg: CreateSupportAgentArgs }) => {
    return fetch('/api/support-agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(arg)
    }).then(res => res.json())
  })

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error || !data) {
    return <h1>Error {error.message}</h1>
  }

  return (
    <div className="grid grid-cols-4">
      <div className="px-4 sm:px-6 lg:px-8 col-span-3">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Support Agents</h1>
          </div>

        </div>
        <div className="mt-8 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.supportAgents.map((supportAgent) => (
                    <tr key={supportAgent.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {supportAgent.name}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {supportAgent.name}</span>
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

      <div className="px-4 sm:px-6 lg:px-8 col-span-1">
      <form className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">Add new agent</h3>

          </div>

          <div className="mt-6 gap-y-6 gap-x-4">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Name
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full max-w-lg rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          </div>
            <button
              type="button"
              className="block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => trigger({ name: 'Alexander' })}
            >
              Add agent
            </button>
          </div>
          </form>
      </div>
    </div>
  )
}