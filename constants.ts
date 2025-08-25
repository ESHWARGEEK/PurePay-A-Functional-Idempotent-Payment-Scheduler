
import type { Subscription, Transaction } from './types';
import { TransactionStatus, SubscriptionStatus, Frequency } from './types';

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
const nextMonth = new Date(now);
nextMonth.setMonth(now.getMonth() + 1);
const nextYear = new Date(now);
nextYear.setFullYear(now.getFullYear() + 1);

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_1',
    customerName: 'Alice Johnson',
    amount: 29.99,
    currency: 'USD',
    frequency: Frequency.MONTHLY,
    startDate: now.toISOString(),
    status: SubscriptionStatus.ACTIVE,
    nextBillingDate: nextMonth.toISOString(),
  },
  {
    id: 'sub_2',
    customerName: 'Bob Williams',
    amount: 299.00,
    currency: 'USD',
    frequency: Frequency.YEARLY,
    startDate: now.toISOString(),
    status: SubscriptionStatus.ACTIVE,
    nextBillingDate: nextYear.toISOString(),
  },
  {
    id: 'sub_3',
    customerName: 'Charlie Brown',
    amount: 9.99,
    currency: 'USD',
    frequency: Frequency.MONTHLY,
    startDate: new Date('2023-01-15').toISOString(),
    status: SubscriptionStatus.CANCELLED,
    nextBillingDate: new Date('2024-02-15').toISOString(),
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_1',
    subscriptionId: 'sub_1',
    customerName: 'Alice Johnson',
    amount: 29.99,
    currency: 'USD',
    scheduledDate: now.toISOString(),
    status: TransactionStatus.PENDING,
    idempotencyKey: `sub_1_${now.toISOString().split('T')[0]}`,
    attempts: 0,
  },
  {
    id: 'txn_2',
    subscriptionId: 'sub_2',
    customerName: 'Bob Williams',
    amount: 299.00,
    currency: 'USD',
    scheduledDate: now.toISOString(),
    status: TransactionStatus.PENDING,
    idempotencyKey: `sub_2_${now.toISOString().split('T')[0]}`,
    attempts: 0,
  },
  {
    id: 'txn_3',
    customerName: 'David Miller',
    amount: 150.00,
    currency: 'USD',
    scheduledDate: tomorrow.toISOString(),
    status: TransactionStatus.PENDING,
    idempotencyKey: 'one-time_david_1',
    attempts: 0,
  },
   {
    id: 'txn_4',
    customerName: 'Eve Davis',
    amount: 75.50,
    currency: 'USD',
    scheduledDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: TransactionStatus.SUCCEEDED,
    idempotencyKey: 'one-time_eve_1',
    attempts: 1,
  },
   {
    id: 'txn_5',
    customerName: 'Frank White',
    amount: 50.00,
    currency: 'USD',
    scheduledDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // yesterday
    status: TransactionStatus.FAILED,
    idempotencyKey: 'one-time_frank_1',
    attempts: 3,
  },
];
