
export enum TransactionStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SUCCEEDED = 'Succeeded',
  FAILED = 'Failed',
  RETRYING = 'Retrying',
}

export enum SubscriptionStatus {
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  CANCELLED = 'Cancelled',
}

export enum Frequency {
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
}

export interface Transaction {
  id: string;
  subscriptionId?: string;
  customerName: string;
  amount: number;
  currency: string;
  scheduledDate: string;
  status: TransactionStatus;
  idempotencyKey: string;
  attempts: number;
}

export interface Subscription {
  id: string;
  customerName: string;
  amount: number;
  currency: string;
  frequency: Frequency;
  startDate: string;
  status: SubscriptionStatus;
  nextBillingDate: string;
}
