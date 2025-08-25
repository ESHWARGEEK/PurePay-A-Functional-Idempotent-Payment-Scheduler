
import React, { useState } from 'react';
import type { Subscription, Transaction } from '../types';
import { Frequency, SubscriptionStatus } from '../types';
import PlusIcon from './icons/PlusIcon';

interface AddPaymentFormProps {
    onAddPayment: (payment: Omit<Subscription, 'id' | 'nextBillingDate'> | Omit<Transaction, 'id' | 'status' | 'idempotencyKey' | 'attempts'>, type: 'subscription' | 'one-time') => void;
}

const AddPaymentForm: React.FC<AddPaymentFormProps> = ({ onAddPayment }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [paymentType, setPaymentType] = useState<'one-time' | 'subscription'>('one-time');

    const [customerName, setCustomerName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [frequency, setFrequency] = useState<Frequency>(Frequency.MONTHLY);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const paymentAmount = parseFloat(amount);
        if (!customerName || isNaN(paymentAmount) || paymentAmount <= 0) {
            alert('Please fill in all fields correctly.');
            return;
        }

        if (paymentType === 'subscription') {
            onAddPayment({
                customerName,
                amount: paymentAmount,
                currency: 'USD',
                frequency,
                startDate: new Date(date).toISOString(),
                status: SubscriptionStatus.ACTIVE,
            }, 'subscription');
        } else {
            onAddPayment({
                customerName,
                amount: paymentAmount,
                currency: 'USD',
                scheduledDate: new Date(date).toISOString(),
            }, 'one-time');
        }
        
        // Reset form and close modal
        setCustomerName('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setFrequency(Frequency.MONTHLY);
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
            >
                <PlusIcon className="h-5 w-5" />
                New Payment
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Schedule New Payment</h2>
                        
                        <div className="mb-4 flex rounded-md shadow-sm">
                            <button
                                type="button"
                                onClick={() => setPaymentType('one-time')}
                                className={`w-full py-2 px-4 text-sm font-medium ${paymentType === 'one-time' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'} rounded-l-md border border-gray-300 dark:border-gray-600 focus:z-10 focus:ring-2 focus:ring-indigo-500`}
                            >
                                One-Time
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentType('subscription')}
                                className={`-ml-px w-full py-2 px-4 text-sm font-medium ${paymentType === 'subscription' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'} rounded-r-md border border-gray-300 dark:border-gray-600 focus:z-10 focus:ring-2 focus:ring-indigo-500`}
                            >
                                Subscription
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
                                <input type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700" required />
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (USD)</label>
                                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} min="0.01" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700" required />
                            </div>
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{paymentType === 'subscription' ? 'Start Date' : 'Scheduled Date'}</label>
                                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700" required />
                            </div>
                             {paymentType === 'subscription' && (
                                <div>
                                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</label>
                                    <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700" required>
                                        <option value={Frequency.MONTHLY}>Monthly</option>
                                        <option value={Frequency.YEARLY}>Yearly</option>
                                    </select>
                                </div>
                            )}
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsOpen(false)} className="py-2 px-4 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
                                <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Add Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddPaymentForm;
