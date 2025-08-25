
import React from 'react';
import { TransactionStatus } from '../types';
import ClockIcon from './icons/ClockIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import ArrowPathIcon from './icons/ArrowPathIcon';

interface StatusBadgeProps {
  status: TransactionStatus;
}

const statusConfig = {
    [TransactionStatus.PENDING]: {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        icon: <ClockIcon className="w-4 h-4" />
    },
    [TransactionStatus.PROCESSING]: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        icon: <ArrowPathIcon className="w-4 h-4 animate-spin" />
    },
    [TransactionStatus.SUCCEEDED]: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        icon: <CheckCircleIcon className="w-4 h-4" />
    },
    [TransactionStatus.FAILED]: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        icon: <XCircleIcon className="w-4 h-4" />
    },
    [TransactionStatus.RETRYING]: {
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
        icon: <ArrowPathIcon className="w-4 h-4" />
    },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  
  if (!config) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {status}
    </span>
  );
};

export default StatusBadge;
