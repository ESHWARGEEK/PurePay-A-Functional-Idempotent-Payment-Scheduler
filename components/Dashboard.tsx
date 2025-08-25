
import React from 'react';
import type { Subscription, Transaction } from '../types';
import SubscriptionList from './SubscriptionList';
import TransactionList from './TransactionList';

interface DashboardProps {
  subscriptions: Subscription[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ subscriptions, transactions }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <TransactionList transactions={transactions} />
      </div>
      <div>
        <SubscriptionList subscriptions={subscriptions} />
      </div>
    </div>
  );
};

export default Dashboard;
