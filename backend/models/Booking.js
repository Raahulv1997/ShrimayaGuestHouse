import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkIn: {
      type: Date,
      required: [true, 'Please select check-in date'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Please select check-out date'],
    },
    guests: {
      type: Number,
      required: [true, 'Please specify the number of guests'],
      min: [1, 'At least 1 guest required'],
    },
    roomsCount: {
      type: Number,
      required: [true, 'Please specify the number of rooms booked'],
      default: 1,
      min: [1, 'At least 1 room required'],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    gstAmount: {
      type: Number,
      default: 0,
    },
    couponApplied: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
