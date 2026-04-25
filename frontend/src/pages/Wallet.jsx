import { useState, useEffect } from 'react';
import { walletService } from '../services/api';

const MOCK_WALLET = { balance: 5000 };
const MOCK_TRANSACTIONS = [
  { _id: 't1', type: 'credit', amount: 2000, description: 'Wallet top-up', date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { _id: 't2', type: 'debit', amount: 350, description: 'Bid placed - Engineering Mathematics Textbook', date: new Date(Date.now() - 86400000).toISOString() },
  { _id: 't3', type: 'credit', amount: 5000, description: 'Initial wallet credit', date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { _id: 't4', type: 'debit', amount: 1200, description: 'Bid placed - Wireless Earbuds', date: new Date(Date.now() - 3600000 * 3).toISOString() },
  { _id: 't5', type: 'credit', amount: 750, description: 'Refund - Outbid on Leather Backpack', date: new Date(Date.now() - 3600000).toISOString() },
];

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [w, t] = await Promise.all([walletService.getWallet(), walletService.getTransactions()]);
        setWallet(w.data);
        setTransactions(t.data);
      } catch {
        setWallet(MOCK_WALLET);
        setTransactions(MOCK_TRANSACTIONS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);
  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wallet</h1>

      {/* Balance card */}
      <div className="bg-gradient-to-r from-primary-600 to-orange-700 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <p className="text-primary-200 text-sm mb-1">Available Balance</p>
        <p className="text-4xl font-bold">₹{loading ? '...' : wallet?.balance?.toLocaleString()}</p>
        <div className="flex gap-6 mt-4 text-sm">
          <div>
            <p className="text-primary-200">Total Credited</p>
            <p className="font-semibold">₹{totalCredit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-primary-200">Total Debited</p>
            <p className="font-semibold">₹{totalDebit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Transactions', value: transactions.length, icon: '📊' },
          { label: 'Credits', value: transactions.filter(t => t.type === 'credit').length, icon: '⬆️' },
          { label: 'Debits', value: transactions.filter(t => t.type === 'debit').length, icon: '⬇️' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xl">{s.icon}</p>
            <p className="text-xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Transaction History</h2>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {['all', 'credit', 'debit'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize ${filter === f ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl">💳</p>
            <p className="mt-2 text-sm">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((t) => (
              <div key={t._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${t.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {t.type === 'credit' ? '⬆️' : '⬇️'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.description}</p>
                    <p className="text-xs text-gray-400">{new Date(t.date).toLocaleString()}</p>
                  </div>
                </div>
                <p className={`font-bold text-sm ${t.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                  {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
