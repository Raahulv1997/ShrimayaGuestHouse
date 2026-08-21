import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Model Imports (for auto-seeding)
import User from './models/User.js';
import Room from './models/Room.js';
import Offer from './models/Offer.js';
import Gallery from './models/Gallery.js';
import Setting from './models/Setting.js';

dotenv.config();

// Connect to Database
connectDB().then(() => {
  seedDatabase();
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Shrimaya Guest House API is running smoothly.' });
});

// Root route
app.get('/', (req, res) => {
  res.send('Shrimaya API Server is running.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Auto-seeding function
async function seedDatabase() {
  try {
    // 1. Seed Admin User
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      await User.create({
        name: 'Shrimaya Admin',
        email: 'admin@shrimaya.com',
        password: 'adminpassword', // Will be hashed automatically by pre-save hook
        role: 'admin',
        phone: '9988776655',
      });
      console.log('Seeded Admin Account: admin@shrimaya.com / adminpassword');
    }

    // 2. Seed Rooms
    const roomCount = await Room.countDocuments();
    if (roomCount === 0) {
      const defaultRooms = [
        {
          name: 'Deluxe Room',
          category: 'Deluxe Room',
          description: 'Spacious Deluxe Room featuring a comfortable queen-size bed, elegant furnishings, and modern hospitality standards. Ideal for budget-conscious business and leisure travelers seeking supreme comfort.',
          pricePerNight: 800,
          maxGuests: 2,
          amenities: ['Free WiFi', 'Parking', 'Room Service', 'CCTV Security', '24x7 Reception', 'Family Friendly Environment'],
          totalRooms: 5,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
        },
        {
          name: 'AC Executive Room',
          category: 'AC Room',
          description: 'Fully Air Conditioned room featuring premium linen, wooden flooring, flat-screen TV, and modern bathroom setups. Experience superior hospitality with top-tier convenience.',
          pricePerNight: 1200,
          maxGuests: 2,
          amenities: ['Free WiFi', 'Parking', 'Room Service', 'CCTV Security', '24x7 Reception', 'Air Conditioned Rooms', 'Family Friendly Environment'],
          totalRooms: 5,
          images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'],
        },
        {
          name: 'Premium Family Suite',
          category: 'Family Room',
          description: 'A massive suite designed for families. Includes two double beds, comfortable seating area, spacious layout, garden view access, and child-safe amenities.',
          pricePerNight: 4500,
          maxGuests: 4,
          amenities: ['Free WiFi', 'Parking', 'Room Service', 'CCTV Security', '24x7 Reception', 'Air Conditioned Rooms', 'Garden Area', 'Family Friendly Environment'],
          totalRooms: 3,
          images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
        },
        {
          name: 'Shrimaya Premium Suite',
          category: 'Premium Suite',
          description: 'The epitome of luxury at Shrimaya Guest House. Features a king-size bed, separate living lounge, beautiful ambient lighting, luxury toiletries, smart controls, and complimentary mini-bar.',
          pricePerNight: 6500,
          maxGuests: 3,
          amenities: ['Free WiFi', 'Parking', 'Room Service', 'CCTV Security', '24x7 Reception', 'Air Conditioned Rooms', 'Garden Area', 'Family Friendly Environment'],
          totalRooms: 2,
          images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'],
        },
      ];
      await Room.insertMany(defaultRooms);
      console.log('Seeded 4 default Room Categories successfully');
    }

    // 3. Seed Offers
    const offerCount = await Offer.countDocuments();
    if (offerCount === 0) {
      const defaultOffers = [
        {
          code: 'WELCOME10',
          discountPercentage: 10,
          description: 'Get 10% off on your first reservation with Shrimaya Guest House!',
          validUntil: new Date('2030-12-31'),
        },
        {
          code: 'SEASON25',
          discountPercentage: 25,
          description: 'Special seasonal discount! Enjoy 25% off on bookings of 3 or more nights.',
          validUntil: new Date('2030-12-31'),
        },
      ];
      await Offer.insertMany(defaultOffers);
      console.log('Seeded default promotional codes WELCOME10 and SEASON25');
    }

    // 4. Seed Gallery Media
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      const defaultGallery = [
        {
          title: 'Deluxe Room Cozy Setup',
          url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
          category: 'Rooms',
          type: 'image',
        },
        {
          title: 'AC Executive Room Decor',
          url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
          category: 'Rooms',
          type: 'image',
        },
        {
          title: 'Premium Suite Lounge Area',
          url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
          category: 'Interior',
          type: 'image',
        },
        {
          title: 'Guest House Beautiful Entrance',
          url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
          category: 'Exterior',
          type: 'image',
        },
        {
          title: 'Green Garden & Reception Walkway',
          url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
          category: 'Facilities',
          type: 'image',
        },
        {
          title: 'Cozy Dining & Room Service Service',
          url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
          category: 'Facilities',
          type: 'image',
        },
      ];
      await Gallery.insertMany(defaultGallery);
      console.log('Seeded default Gallery image URLs');
    }

    // 5. Seed default Home Settings
    const settingExists = await Setting.findOne({ key: 'homeSettings' });
    if (!settingExists) {
      await Setting.create({
        key: 'homeSettings',
        value: {
          heroTitle: 'Welcome to Shrimaya Guest House',
          heroSubtitle: 'Experience premium luxury, comfort, and unmatched hospitality in the heart of the city.',
          sliderImages: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80'
          ]
        }
      });
      console.log('Seeded default Home Page UI settings.');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
}
