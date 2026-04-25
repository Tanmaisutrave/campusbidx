import { useState, useEffect } from 'react';
import { auctionService, adminService } from '../services/api';

const MOCK_PENDING = [
  { _id: 'p1', title: 'Physics Textbook', category: 'Books', startingPrice: 150, seller: { name: 'Amit Kumar' }, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: 'p2', title: 'Bluetooth Speaker', category: 'Gadgets', startingPrice: 600, seller: { name: 'Neha Singh' }, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { _id: 'p3', title: 'College Hoodie', category: 'Clothing', startingPrice: 400, seller: { name: 'Ravi Patel' }, createdAt: new Date(Date.now() - 10800000).toISOString() },
];
const MOCK_USERS = [
  { _id: 'u1', name: 'Rahul Sharma', email: 'rahul@college.edu', studentId: 'CS2021001', role: 'student', createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { _id: 'u2', name: 'Priya Mehta', email: 'priya@college.edu', studentId: 'EC2022015', role: 'student', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { _id: 'u3', name: 'Admin User', email: 'admin@college.edu', studentId: 'ADMIN001', role: 'admin', createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
];
const MOCK_ALL = [
  { _id: '1', title: 'Engineering Mathematics Textbook', status: 'active', currentBid: 350, endTime: new Date(Date.now() + 86400000 * 2).toISOString() },
  { _id: '2', title: 'Wireless Earbuds', status: 'active', currentBid: 1200, endTime: new Date(Date.now() + 86400000).toISOString() },
  { _id: '4', title: 'Leather Backpack', status: 'ended', currentBid: 750, endTime: new Date(Date.now() - 86400000).toISOString() },
];

const AdminDashboard = () => {
  const [tab, setTab] = useState('pending');
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [allAuctions, setAllAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [p, u, a] = await Promise.all([auctionService.getPending(), adminService.getUsers(), adminService.getAllAuctions()]);
        setPending(p.data);
        setUsers(u.data);
        setAllAuctions(a.data);
      } catch {
        setPending(MOCK_PENDING);
        setUsers(MOCK_USERS);
        setAllAuctions(MOCK_ALL);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id + '_approve');
    try {
      await auctionService.approve(id);
      setPending(pending.filter(a => a._id !== id));
    } catch {
      setPending(pending.filter(a => a._id !== id)); // mock
    } finally {
      setActionLoading('');
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id + '_reject');
    try {
      await auctionService.reject(id);
      setPending(pending.filter(a => a._id !== id));
    } catch {
      setPending(pending.filter(a => a._id !== id)); // mock
    } finally {
      setActionLoading('');
    }
  };

  const tabs = [
    { key: 'pending', label: `Pending (${pending.length})` },
    { key: 'auctions', label: `All Auctions (${allAuctions.length})` },
    { key: 'users', label: `Users (${users.length})` },
  ];

  const statusColor = { active: 'bg-green-100 text-green-700', ended: 'bg-red-100 text-red-700', pending: 'bg-yellow-100 text-yellow-700' };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage auctions, users, and platform activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pending Approval', value: pending.length, icon: '⏳', color: 'text-yellow-600' },
          { label: 'Active Auctions', value: allAuctions.filter(a => a.status === 'active').length, icon: '🟢', color: 'text-green-600' },
          { label: 'Total Users', value: users.length, icon: '👥', color: 'text-blue-600' },
          { label: 'Ended Auctions', value: allAuctions.filter(a => a.status === 'ended').length, icon: '🏁', color: 'text-gray-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl">{s.icon}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <>
          {/* Pending Auctions */}
          {tab === 'pending' && (
            <div className="space-y-3">
              {pending.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-4xl">✅</p>
                  <p className="mt-3">No pending auctions</p>
                </div>
              ) : pending.map((a) => (
                <div key={a._id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-4 shadow-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.category} • Starting ₹{a.startingPrice} • By {a.seller?.name}</p>
                    <p className="text-xs text-gray-400">Submitted {new Date(a.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(a._id)}
                      disabled={actionLoading === a._id + '_approve'}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-60 transition-colors"
                    >
                      {actionLoading === a._id + '_approve' ? '...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(a._id)}
                      disabled={actionLoading === a._id + '_reject'}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-60 transition-colors"
                    >
                      {actionLoading === a._id + '_reject' ? '...' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All Auctions */}
          {tab === 'auctions' && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Title', 'Status', 'Current Bid', 'End Time'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allAuctions.map((a) => (
                    <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{a.title}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[a.status] || 'bg-gray-100 text-gray-500'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary-600">₹{a.currentBid}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(a.endTime).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Name', 'Email', 'Student ID', 'Role', 'Joined'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3 text-gray-500">{u.studentId}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
