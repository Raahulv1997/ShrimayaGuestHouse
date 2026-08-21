import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);
router.get('/my', protect, getMyBookings);
router.route('/:id')
  .get(protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, admin, updateBookingStatus);

export default router;
