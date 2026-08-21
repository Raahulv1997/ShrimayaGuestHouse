import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { generateInvoice } from '../utils/invoiceGenerator.js';

// Initialize Razorpay
// If env vars are missing or dummy, we will run in mock mode
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id.includes('your_') || key_secret.includes('your_')) {
    return null;
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

// @desc    Create Razorpay Order
// @route   POST /api/payments/order
// @access  Private
export const createOrder = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate('room');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const instance = getRazorpayInstance();

    if (!instance) {
      // Mock Payment mode
      console.log('Razorpay not configured or using dummy keys. Running in MOCK payment mode.');
      const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 15)}`;
      
      // Save order id directly to a temporary payment or keep track of it
      await Payment.create({
        user: req.user._id,
        booking: bookingId,
        razorpayOrderId: mockOrderId,
        amount: booking.totalAmount,
        status: 'pending',
      });

      return res.json({
        id: mockOrderId,
        amount: booking.totalAmount * 100, // in paise
        currency: 'INR',
        mock: true,
      });
    }

    // Real Razorpay mode
    const options = {
      amount: Math.round(booking.totalAmount * 100), // in paise
      currency: 'INR',
      receipt: `receipt_booking_${bookingId.substring(18)}`,
    };

    const order = await instance.orders.create(options);

    await Payment.create({
      user: req.user._id,
      booking: bookingId,
      razorpayOrderId: order.id,
      amount: booking.totalAmount,
      status: 'pending',
    });

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      mock: false,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId, isMock } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    let payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      payment = new Payment({
        user: req.user._id,
        booking: bookingId,
        razorpayOrderId,
        amount: booking.totalAmount,
      });
    }

    const instance = getRazorpayInstance();

    // Verify signature
    if (isMock || !instance) {
      // Mock verification
      payment.razorpayPaymentId = razorpayPaymentId || `pay_mock_${Math.random().toString(36).substring(2, 15)}`;
      payment.razorpaySignature = razorpaySignature || 'mock_signature';
      payment.status = 'captured';
      payment.method = 'UPI / CARD (Mock)';
      await payment.save();

      booking.status = 'confirmed';
      booking.paymentStatus = 'paid';
      await booking.save();

      return res.json({ success: true, message: 'Mock payment verified successfully' });
    }

    // Real Razorpay verification
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpaySignature) {
      payment.razorpayPaymentId = razorpayPaymentId;
      payment.razorpaySignature = razorpaySignature;
      payment.status = 'captured';
      
      // Let's mock fetching transaction details or set a fallback method
      payment.method = 'Razorpay Checkout';
      await payment.save();

      booking.status = 'confirmed';
      booking.paymentStatus = 'paid';
      await booking.save();

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      payment.status = 'failed';
      await payment.save();
      
      booking.status = 'cancelled';
      booking.paymentStatus = 'unpaid';
      await booking.save();

      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download PDF Invoice for booking
// @route   GET /api/payments/invoice/:bookingId
// @access  Private
export const downloadInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('room')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure owner or admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this invoice' });
    }

    const payment = await Payment.findOne({ booking: req.params.bookingId, status: 'captured' });
    if (!payment) {
      return res.status(400).json({ message: 'No successful payment found for this booking' });
    }

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice_SM-${booking._id.toString().substring(18).toUpperCase()}.pdf`);

    generateInvoice(booking, payment, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
