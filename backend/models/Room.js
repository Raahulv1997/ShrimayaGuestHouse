import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a room name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    images: {
      type: [String],
      default: [],
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please add a price per night'],
      min: [0, 'Price cannot be negative'],
    },
    maxGuests: {
      type: Number,
      required: [true, 'Please add maximum guest capacity'],
      min: [1, 'Must allow at least 1 guest'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    totalRooms: {
      type: Number,
      required: [true, 'Please specify total rooms in this category'],
      default: 5,
    },
    status: {
      type: String,
      enum: ['available', 'maintenance'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;
