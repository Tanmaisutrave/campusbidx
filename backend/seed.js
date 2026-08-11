/**
 * Seed script — run with: npm run seed
 * Creates admin + sample student accounts and sample auctions with images
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const User = require('./models/User');
const Auction = require('./models/Auction');
const Bid = require('./models/Bid');
const Transaction = require('./models/Transaction');

// Load image as base64 data URL — falls back to empty string if file not found
const loadImage = (filePath) => {
  try {
    const abs = path.resolve(__dirname, filePath);
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    const mimeMap = { jpg: 'jpeg', jpeg: 'jpeg', png: 'png', webp: 'webp', jfif: 'jpeg' };
    const mime = mimeMap[ext] || 'jpeg';
    const data = fs.readFileSync(abs);
    return `data:image/${mime};base64,${data.toString('base64')}`;
  } catch {
    console.warn(`⚠️  Image not found: ${filePath}`);
    return '';
  }
};

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear all collections
  await Promise.all([
    User.deleteMany({}),
    Auction.deleteMany({}),
    Bid.deleteMany({}),
    Transaction.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // Pre-load images from frontend assets
  console.log('📷 Loading images...');
  const images = {
    maths:    loadImage('../frontend/src/assets/Maths.jfif'),
    earbud:   loadImage('../frontend/src/assets/earbud.webp'),
    calc:     loadImage('../frontend/src/assets/calculater_files/7187PNsuDxL.jpg'),
    backpack: loadImage('../frontend/src/assets/backpack.webp'),
    dsbook:   loadImage('../frontend/src/assets/DS book.webp'),
    usbhub:   loadImage('../frontend/src/assets/USB hub.webp'),
  };
  console.log('✅ Images loaded');

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@college.edu',
    password: 'admin123',
    studentId: 'ADMIN001',
    role: 'admin',
    walletBalance: 99999,
  });

  // Create students
  const student1 = await User.create({
    name: 'Rahul Sharma',
    email: 'rahul@college.edu',
    password: 'student123',
    studentId: 'CS2021001',
    role: 'student',
    walletBalance: 5000,
  });

  const student2 = await User.create({
    name: 'Priya Mehta',
    email: 'priya@college.edu',
    password: 'student123',
    studentId: 'EC2022015',
    role: 'student',
    walletBalance: 8000,
  });

  // Seed initial transactions
  await Transaction.insertMany([
    { user: student1._id, amount: 5000, type: 'credit', description: 'Welcome bonus - Initial wallet credit' },
    { user: student2._id, amount: 8000, type: 'credit', description: 'Welcome bonus - Initial wallet credit' },
  ]);

  // Create sample active auctions with real images
  const now = new Date();
  await Auction.insertMany([
    {
      title: 'Engineering Mathematics Textbook',
      description: 'Slightly used Engineering Mathematics textbook by H.K. Dass. All pages intact, minimal highlighting. Perfect for first-year students.',
      category: 'Books',
      startingPrice: 200,
      currentBid: 350,
      seller: student1._id,
      image: images.maths,
      status: 'active',
      duration: 3,
      startTime: now,
      endTime: new Date(now.getTime() + 86400000 * 2),
    },
    {
      title: 'Wireless Earbuds (barely used)',
      description: 'Premium wireless earbuds with noise cancellation. Used for 2 months only. Comes with original case and cable.',
      category: 'Gadgets',
      startingPrice: 800,
      currentBid: 1200,
      seller: student2._id,
      image: images.earbud,
      status: 'active',
      duration: 1,
      startTime: now,
      endTime: new Date(now.getTime() + 86400000),
    },
    {
      title: 'Scientific Calculator',
      description: 'Casio FX-991ES Plus scientific calculator. Works perfectly, minor scratches on back.',
      category: 'Gadgets',
      startingPrice: 300,
      currentBid: null,
      seller: student1._id,
      image: images.calc,
      status: 'active',
      duration: 3,
      startTime: now,
      endTime: new Date(now.getTime() + 86400000 * 3),
    },
    {
      title: 'Leather Backpack',
      description: 'Genuine leather backpack, fits 15" laptop. Minor wear on straps. Great for college.',
      category: 'Accessories',
      startingPrice: 500,
      currentBid: 750,
      seller: student2._id,
      image: images.backpack,
      status: 'active',
      duration: 2,
      startTime: now,
      endTime: new Date(now.getTime() + 86400000 * 1.5),
    },
    {
      title: 'Data Structures & Algorithms Book',
      description: 'CLRS Introduction to Algorithms, 3rd edition. Some pencil marks, otherwise in great condition.',
      category: 'Books',
      startingPrice: 150,
      currentBid: 220,
      seller: student1._id,
      image: images.dsbook,
      status: 'active',
      duration: 4,
      startTime: now,
      endTime: new Date(now.getTime() + 86400000 * 4),
    },
    {
      title: 'USB-C Hub (7-in-1)',
      description: 'USB-C hub with HDMI, USB 3.0 x3, SD card reader, and PD charging. Works perfectly.',
      category: 'Gadgets',
      startingPrice: 400,
      currentBid: 550,
      seller: student2._id,
      image: images.usbhub,
      status: 'active',
      duration: 1,
      startTime: now,
      endTime: new Date(now.getTime() + 3600000 * 5),
    },
    {
      title: 'Physics Textbook (H.C. Verma)',
      description: 'Concepts of Physics Vol 1 & 2 by H.C. Verma. Lightly used, no missing pages.',
      category: 'Books',
      startingPrice: 180,
      currentBid: null,
      seller: student1._id,
      image: '',
      status: 'pending',
      duration: 3,
    },
  ]);

  console.log('\n🎉 Seed complete!');
  console.log('─────────────────────────────────────');
  console.log('Admin   → admin@college.edu   / admin123');
  console.log('Student → rahul@college.edu   / student123');
  console.log('Student → priya@college.edu   / student123');
  console.log('─────────────────────────────────────');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
