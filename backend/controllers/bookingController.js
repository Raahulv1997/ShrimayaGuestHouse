import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Offer from '../models/Offer.js';
import { getAvailableCount } from './roomController.js';

// @desc    Create a new booking (pending payment)
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  const { roomId, checkIn, checkOut, guests, roomsCount, couponCode } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check availability
    const availableCount = await getAvailableCount(roomId, checkIn, checkOut);
    if (availableCount < roomsCount) {
      return res.status(400).json({
        message: `Insufficient rooms. Only ${availableCount} room(s) available for these dates.`,
      });
    }

    // Calculate nights
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));

    // Calculate total price
    const subtotal = room.pricePerNight * roomsCount * nights;
    let discountAmount = 0;
    let couponApplied = '';

    if (couponCode) {
      const offer = await Offer.findOne({ code: couponCode.toUpperCase(), active: true });
      if (offer && new Date(offer.validUntil) > new Date()) {
        discountAmount = (subtotal * offer.discountPercentage) / 100;
        couponApplied = offer.code;
      }
    }

    const taxableAmount = subtotal - discountAmount;
    const gstAmount = Math.round(taxableAmount * 0.18);
    const totalAmount = taxableAmount + gstAmount;

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn: start,
      checkOut: end,
      guests,
      roomsCount,
      totalAmount,
      discountAmount,
      gstAmount,
      couponApplied,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure owner or admin is requesting
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure owner or admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }

    await booking.save();
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('room')
      .populate('user', 'name email phone')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  const { status, paymentStatus } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = status || booking.status;
      booking.paymentStatus = paymentStatus || booking.paymentStatus;
      
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
