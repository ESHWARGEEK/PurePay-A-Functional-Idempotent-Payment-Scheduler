
import React from 'react';
import type { Subscription } from '../types';
import { SubscriptionStatus } from '../types';

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

const getStatusColor = (status: SubscriptionStatus) => {
    switch (status) {
        case SubscriptionStatus.ACTIVE:
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case SubscriptionStatus.PAUSED:
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case SubscriptionStatus.CANCELLED:
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Subscriptions</h2>
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        {subscriptions.length > 0 ? (
          subscriptions.map((sub) => (
            <div key={sub.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{sub.customerName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Next Billing: {new Date(sub.nextBillingDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(sub.status)}`}>
                  {sub.status}
                </span>
              </div>
              <div className="mt-2 text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${sub.amount.toFixed(2)} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{sub.frequency}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No subscriptions found.</p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionList;
