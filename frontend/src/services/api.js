import axios from 'axios';

const api = axios.create({
  baseURL: "https://campusbidx.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authService = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/register', data),  // backend uses /register
  getMe: () => api.get('/auth/me'),
};

export const auctionService = {
  getAll: (params) => api.get('/auctions', { params }),
  getById: (id) => api.get(`/auctions/${id}`),
  create: (data) => api.post('/auctions/create', data),
  getMyAuctions: () => api.get('/auctions/my'),
  getMyBids: () => api.get('/auctions/my-bids'),
  // bids now go through /bids/place
  placeBid: (auctionId, amount) => api.post('/bids/place', { auctionId, amount }),
  getBidHistory: (auctionId) => api.get(`/bids/${auctionId}`),
  // admin actions
  approve: (id) => api.put(`/admin/approve/${id}`),
  reject: (id) => api.put(`/admin/reject/${id}`),
  getPending: () => api.get('/admin/pending-auctions'),
};

export const walletService = {
  getWallet: () => api.get('/wallet'),
  getTransactions: () => api.get('/wallet/transactions'),
  addFunds: (amount) => api.post('/wallet/add', { amount }),
};

export const adminService = {
  getUsers: () => api.get('/admin/users'),
  getAllAuctions: () => api.get('/admin/auctions'),
};

export default api;
