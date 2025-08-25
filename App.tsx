import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_SUBSCRIPTIONS, INITIAL_TRANSACTIONS } from './constants';
import type { Subscription, Transaction, Frequency } from './types';
import { TransactionStatus as TStatus } from './types';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import AddPaymentForm from './components/AddPaymentForm';

const App: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateNextBillingDate = (startDate: Date, frequency: Frequency): Date => {
    const nextDate = new Date(startDate);
    if (frequency === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (frequency === 'yearly') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
    return nextDate;
  };
  
  const processPayments = useCallback(() => {
    if (isProcessing) return;

    const now = new Date();
    const dueTransactionIds = transactions
      .filter((t: Transaction) => (t.status === TStatus.PENDING || t.status === TStatus.RETRYING) && new Date(t.scheduledDate) <= now)
      .map((t: Transaction) => t.id);

    if (dueTransactionIds.length === 0) {
      return;
    }
    
    setIsProcessing(true);

    // 1. Move due transactions to "Processing"
    setTransactions((prev: Transaction[]) =>
      prev.map((t: Transaction) =>
        dueTransactionIds.includes(t.id) ? { ...t, status: TStatus.PROCESSING } : t
      )
    );

    // 2. Simulate payment gateway interaction
    setTimeout(() => {
      const outcomes = new Map<string, boolean>();
      dueTransactionIds.forEach((id: string) => {
          outcomes.set(id, Math.random() > 0.2); // 80% success rate
      });

      const successfulSubIds = new Set<string>();
      const newTransactionsForNextCycle: Transaction[] = [];

      // Pre-calculate renewals for successful subscription payments
      transactions.forEach((t: Transaction) => {
          if (t.subscriptionId && outcomes.get(t.id) === true) {
              const sub = subscriptions.find((s: Subscription) => s.id === t.subscriptionId);
              if (sub) {
                  successfulSubIds.add(sub.id);
                  const nextBillingDate = calculateNextBillingDate(new Date(sub.nextBillingDate), sub.frequency);
                  newTransactionsForNextCycle.push({
                      id: `txn_${Date.now()}_${Math.random()}`,
                      subscriptionId: sub.id,
                      customerName: sub.customerName,
                      amount: sub.amount,
                      currency: sub.currency,
                      scheduledDate: nextBillingDate.toISOString(),
                      status: TStatus.PENDING,
                      idempotencyKey: `${sub.id}_${nextBillingDate.toISOString().split('T')[0]}`,
                      attempts: 0,
                  });
              }
          }
      });
      
      // Update subscriptions based on successful payments
      setSubscriptions((prevSubs: Subscription[]) => prevSubs.map((sub: Subscription) => {
          if (successfulSubIds.has(sub.id)) {
              const nextBillingDate = calculateNextBillingDate(new Date(sub.nextBillingDate), sub.frequency);
              return { ...sub, nextBillingDate: nextBillingDate.toISOString() };
          }
          return sub;
      }));

      // Update transactions with their final status and add new ones for next cycle
      setTransactions((prevTxns: Transaction[]) => {
          const updatedTxns = prevTxns.map((t: Transaction) => {
              if (outcomes.has(t.id)) { // It's a due transaction
                  const isSuccess = outcomes.get(t.id)!;
                  if (isSuccess) {
                      return { ...t, status: TStatus.SUCCEEDED };
                  } else {
                      const newAttempts = (t.attempts || 0) + 1;
                      if (newAttempts >= 3) {
                          return { ...t, status: TStatus.FAILED, attempts: newAttempts };
                      } else {
                          const nextRetryDate = new Date(new Date().getTime() + 60 * 1000);
                          return { ...t, status: TStatus.RETRYING, attempts: newAttempts, scheduledDate: nextRetryDate.toISOString() };
                      }
                  }
              }
              return t;
          });
          return [...updatedTxns, ...newTransactionsForNextCycle];
      });

      setIsProcessing(false);
    }, 2000); // Simulate 2-second API call
  }, [transactions, subscriptions, isProcessing]);

  // Scheduler runs every 5 seconds to check for payments
  useEffect(() => {
    const schedulerInterval = setInterval(() => {
      processPayments();
    }, 5000);

    return () => clearInterval(schedulerInterval);
  }, [processPayments]);

  const addPayment = (payment: Omit<Subscription, 'id' | 'nextBillingDate'> | Omit<Transaction, 'id' | 'status' | 'idempotencyKey' | 'attempts'>, type: 'subscription' | 'one-time') => {
      if (type === 'subscription') {
          const sub = payment as Omit<Subscription, 'id' | 'nextBillingDate'>;
          const newId = `sub_${Date.now()}`;
          const nextBillingDate = calculateNextBillingDate(new Date(sub.startDate), sub.frequency);
          const newSubscription: Subscription = {
              ...sub,
              id: newId,
              nextBillingDate: nextBillingDate.toISOString(),
          };

          const firstTransaction: Transaction = {
              id: `txn_${Date.now()}`,
              subscriptionId: newId,
              customerName: sub.customerName,
              amount: sub.amount,
              currency: sub.currency,
              scheduledDate: sub.startDate,
              status: TStatus.PENDING,
              idempotencyKey: `${newId}_${new Date(sub.startDate).toISOString().split('T')[0]}`,
              attempts: 0
          };

          setSubscriptions((prev: Subscription[]) => [...prev, newSubscription]);
          setTransactions((prev: Transaction[]) => [...prev, firstTransaction]);

      } else {
          const trans = payment as Omit<Transaction, 'id' | 'status' | 'idempotencyKey' | 'attempts'>;
          const newTransaction: Transaction = {
              ...trans,
              id: `txn_${Date.now()}`,
              status: TStatus.PENDING,
              idempotencyKey: `one-time_${trans.customerName.replace(/\s/g, '')}_${new Date(trans.scheduledDate).toISOString()}`,
              attempts: 0,
          };
          setTransactions((prev: Transaction[]) => [...prev, newTransaction]);
      }
  };


  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Dashboard</h1>
              <div className="flex items-center gap-4">
                  <button 
                      onClick={processPayments}
                      disabled={isProcessing}
                      className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                  >
                      {isProcessing ? (
                          <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                          </>
                      ) : (
                          "Process Due Payments"
                      )}
                  </button>
                  <AddPaymentForm onAddPayment={addPayment} />
              </div>
          </div>
          <Dashboard subscriptions={subscriptions} transactions={transactions} />
        </div>
      </main>
    </div>
  );
};

export default App;