import express from 'express';
import {
  createOrder,
  verifyPayment,
  downloadInvoice,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/invoice/:bookingId', protect, downloadInvoice);

export default router;
