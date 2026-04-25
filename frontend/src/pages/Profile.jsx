import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// ── small helpers ──────────────────────────────────────────────
const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  </div>
);

const WalletCard = ({ label, amount, icon, bg }) => (
  <div className={`${bg} rounded-xl p-5 text-white flex items-center justify-between`}>
    <div>
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-2xl font-bold mt-1">₹{Number(amount || 0).toLocaleString()}</p>
    </div>
    <span className="text-3xl opacity-80">{icon}</span>
  </div>
);

const badge = (type) =>
  type === 'credit'
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700';

// ── main component ─────────────────────────────────────────────
const Profile = () => {
  const { user, login, token, logout } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // edit state
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [avatarBase64, setAvatarBase64] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);

  // add money modal
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [addMsg, setAddMsg] = useState(null);
  const [addErr, setAddErr] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    api.get('/auth/profile/stats')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setAvatarPreview(reader.result); setAvatarBase64(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMsg(null); setErr(null); setSaving(true);
    try {
      const payload = { name, bio };
      if (avatarBase64) payload.avatar = avatarBase64;
      if (newPassword) { payload.currentPassword = currentPassword; payload.newPassword = newPassword; }
      const res = await api.put('/auth/profile', payload);
      login(res.data.user, token);
      setMsg('Profile updated successfully');
      setAvatarBase64(null); setCurrentPassword(''); setNewPassword('');
      setEditOpen(false); setPwOpen(false);
    } catch (e) {
      setErr(e.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setAddMsg(null); setAddErr(null); setAddLoading(true);
    try {
      const res = await api.post('/wallet/add', { amount: addAmount });
      login({ ...user, walletBalance: res.data.balance }, token);
      setAddMsg(`₹${Number(addAmount).toLocaleString()} added successfully`);
      setAddAmount('');
    } catch (e) {
      setAddErr(e.response?.data?.message || 'Failed to add funds');
    } finally { setAddLoading(false); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const avatar = avatarPreview || user?.avatar;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              {avatar
                ? <img src={avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-primary-200 shadow" />
                : <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-4xl font-bold shadow">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
              }
              <button
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs shadow hover:bg-primary-700 transition-colors"
                title="Change photo"
              >📷</button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
                <span className={`self-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {user?.role}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
              <p className="text-gray-400 text-xs mt-1">Student ID: {user?.studentId} · Joined {new Date(user?.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>
              {user?.bio && <p className="text-gray-600 text-sm mt-2 italic">"{user.bio}"</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => { setEditOpen(!editOpen); setMsg(null); setErr(null); }}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                {editOpen ? 'Cancel' : '✏️ Edit Profile'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* ── Edit Panel ── */}
        {editOpen && (
          <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Edit Profile</h2>
            {msg && <p className="mb-3 text-sm text-green-700 bg-green-50 p-3 rounded-lg">{msg}</p>}
            {err && <p className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{err}</p>}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Display Name</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Short Bio</label>
                  <input value={bio} onChange={e => setBio(e.target.value)} placeholder="e.g. CS student, loves gadgets"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
              </div>

              {/* Change password toggle */}
              <button type="button" onClick={() => setPwOpen(!pwOpen)}
                className="text-sm text-primary-600 hover:underline font-medium">
                {pwOpen ? '▲ Hide password change' : '🔒 Change Password'}
              </button>

              {pwOpen && (
                <div className="grid sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                  </div>
                </div>
              )}

              <button type="submit" disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* ── Wallet Summary ── */}
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-3">💰 Wallet Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <WalletCard label="Current Balance" amount={user?.walletBalance} icon="💳" bg="bg-gradient-to-br from-primary-600 to-primary-800" />
            <WalletCard label="Total Spent" amount={stats?.totalSpent} icon="📤" bg="bg-gradient-to-br from-rose-500 to-rose-700" />
            <WalletCard label="Total Earned" amount={stats?.totalEarned} icon="📥" bg="bg-gradient-to-br from-emerald-500 to-emerald-700" />
          </div>
          <button
            onClick={() => { setAddMoneyOpen(true); setAddMsg(null); setAddErr(null); }}
            className="mt-3 px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            + Add Money
          </button>
        </div>

        {/* ── Activity Stats ── */}
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-3">📊 Activity</h2>
          {statsLoading ? (
            <p className="text-sm text-gray-400">Loading stats...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon="🏷️" label="Auctions Created" value={stats?.auctionsCreated ?? 0} color="bg-blue-50 text-blue-600" />
              <StatCard icon="🏆" label="Auctions Won" value={stats?.auctionsWon ?? 0} color="bg-yellow-50 text-yellow-600" />
              <StatCard icon="⚡" label="Total Bids" value={stats?.activeBids ?? 0} color="bg-purple-50 text-purple-600" />
              <StatCard icon="🔄" label="Transactions" value={stats?.totalTransactions ?? 0} color="bg-green-50 text-green-600" />
            </div>
          )}
        </div>

        {/* ── Recent Activity ── */}
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-3">🕒 Recent Activity</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {statsLoading ? (
              <p className="text-sm text-gray-400 p-6">Loading...</p>
            ) : stats?.recentActivity?.length ? (
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {stats.recentActivity.map(t => (
                  <div key={t._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{t.type === 'credit' ? '📥' : '📤'}</span>
                      <div>
                        <p className="text-sm text-gray-700">{t.description}</p>
                        <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${badge(t.type)}`}>
                      {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 p-6">No recent activity yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* ── Add Money Modal ── */}
      {addMoneyOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Money to Wallet</h3>
            {addMsg && <p className="mb-3 text-sm text-green-700 bg-green-50 p-3 rounded-lg">{addMsg}</p>}
            {addErr && <p className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{addErr}</p>}
            <form onSubmit={handleAddMoney} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Amount (₹)</label>
                <input
                  type="number" min="1" max="50000" value={addAmount}
                  onChange={e => setAddAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Max ₹50,000 per transaction</p>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={addLoading}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  {addLoading ? 'Adding...' : 'Add Funds'}
                </button>
                <button type="button" onClick={() => setAddMoneyOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
