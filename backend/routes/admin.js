const express = require('express');
const {
  getPendingAuctions,
  approveAuction,
  rejectAuction,
  getAllUsers,
  getAllAuctions,
} = require('../controllers/adminController');
const protect = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, roleAuth('admin'));

router.get('/pending-auctions', getPendingAuctions);
router.get('/auctions', getAllAuctions);
router.get('/users', getAllUsers);
router.put('/approve/:id', approveAuction);
router.put('/reject/:id', rejectAuction);

module.exports = router;
