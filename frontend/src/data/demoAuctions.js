/**
 * DEMO AUCTIONS — Frontend-only static data.
 *
 * These are displayed ONLY when there are zero active real auctions from the backend.
 * They are NEVER stored in MongoDB, NEVER sent to the backend, and NEVER participate
 * in real bidding. They exist solely to keep the homepage populated for visitors/recruiters.
 *
 * Rules:
 *  - IDs are prefixed "demo-" so they can never collide with MongoDB ObjectIds.
 *  - isDemo: true marks them throughout the app to block any real actions.
 *  - endTime is intentionally omitted / set to null so the expiration logic never fires.
 */

// Images already present in the project's assets folder
import dsbookImg   from '../assets/DS book.webp';
import earbudImg   from '../assets/earbud.webp';
import backpackImg from '../assets/backpack.webp';
import mathsImg    from '../assets/Maths.jfif';
import calcImg     from '../assets/calculater_files/7187PNsuDxL.jpg';
import usbhubImg   from '../assets/USB hub.webp';

const DEMO_AUCTIONS = [
  {
    _id: 'demo-auction-1',
    title: 'Data Structures & Algorithms Book',
    description:
      'Well-maintained DSA textbook covering arrays, trees, graphs, sorting, and dynamic programming. Ideal for CS/IT students preparing for placements.',
    category: 'Books',
    startingPrice: 450,
    currentBid: null,
    image: dsbookImg,
    status: 'active',
    endTime: null,        // no expiry — never removed by time
    isDemo: true,
    seller: { name: 'CampusBidX', studentId: 'DEMO' },
    bids: [],
  },
  {
    _id: 'demo-auction-2',
    title: 'Wireless Bluetooth Headphones',
    description:
      'Lightly used over-ear Bluetooth headphones with 20-hour battery life. Crystal-clear sound, foldable design — perfect for study sessions or commuting.',
    category: 'Gadgets',
    startingPrice: 1200,
    currentBid: null,
    image: earbudImg,
    status: 'active',
    endTime: null,
    isDemo: true,
    seller: { name: 'CampusBidX', studentId: 'DEMO' },
    bids: [],
  },
  {
    _id: 'demo-auction-3',
    title: 'College Backpack',
    description:
      'Spacious, water-resistant campus backpack with laptop sleeve, multiple compartments, and padded shoulder straps. Lightly used, excellent condition.',
    category: 'Accessories',
    startingPrice: 800,
    currentBid: null,
    image: backpackImg,
    status: 'active',
    endTime: null,
    isDemo: true,
    seller: { name: 'CampusBidX', studentId: 'DEMO' },
    bids: [],
  },
  {
    _id: 'demo-auction-4',
    title: 'Campus Hoodie',
    description:
      'Comfortable college hoodie in excellent condition. Soft fleece interior, kangaroo pocket, and durable drawstring. Great for cold campus mornings.',
    category: 'Clothing',
    startingPrice: 700,
    currentBid: null,
    image: usbhubImg, // using available campus-style asset
    status: 'active',
    endTime: null,
    isDemo: true,
    seller: { name: 'CampusBidX', studentId: 'DEMO' },
    bids: [],
  },
  {
    _id: 'demo-auction-5',
    title: 'Scientific Calculator (Casio FX-991)',
    description:
      'Casio FX-991ES Plus scientific calculator — handles complex equations, matrices, statistics, and calculus. Barely used, all functions working perfectly.',
    category: 'Gadgets',
    startingPrice: 650,
    currentBid: null,
    image: calcImg,
    status: 'active',
    endTime: null,
    isDemo: true,
    seller: { name: 'CampusBidX', studentId: 'DEMO' },
    bids: [],
  },
  {
    _id: 'demo-auction-6',
    title: 'Engineering Mathematics Book',
    description:
      'H.K. Dass Engineering Mathematics — covers differential equations, integral calculus, Laplace transforms, and Fourier series. Minimal highlighting, all pages intact.',
    category: 'Books',
    startingPrice: 350,
    currentBid: null,
    image: mathsImg,
    status: 'active',
    endTime: null,
    isDemo: true,
    seller: { name: 'CampusBidX', studentId: 'DEMO' },
    bids: [],
  },
];

export default DEMO_AUCTIONS;
