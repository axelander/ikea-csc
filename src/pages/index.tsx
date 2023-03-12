import { postReq } from '@/libs/request';
import React, { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { CreateSupportCaseArgs } from './api/support-cases';

export default function ReportReturn() {
  const [orderId, setOrderId] = useState<string>('');
  const { trigger: triggerCreateCase } = useSWRMutation(
    '/api/support-cases',
    (url: string, { arg }: { arg: CreateSupportCaseArgs }) => {
      return postReq(url, arg).then(() => setOrderId(''));
    }
  );

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orderId) return;
    triggerCreateCase({ orderId });
  };

  return (
    <div className="grid grid-cols-2 col-span-3 px-4 sm:px-6 lg:px-6">
      <div className="space-y-8 divide-y divide-gray-200">
        <form onSubmit={onSubmitForm}>
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">Report return</h3>
              </div>

              <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-4">
                <div className="sm:col-span-4">
                  <label htmlFor="order-id" className="block text-sm font-medium leading-6 text-gray-900">
                    Order id
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => setOrderId(e.target.value)}
                      value={orderId}
                      type="text"
                      name="order-id"
                      id="order-id"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <input
                disabled={!orderId}
                type="submit"
                className="inline-flex justify-center px-3 py-2 ml-3 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                value="Send"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
