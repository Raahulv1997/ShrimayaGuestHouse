import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please provide an offer code'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Please provide discount percentage'],
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100%'],
    },
    description: {
      type: String,
      required: [true, 'Please provide discount description'],
    },
    validUntil: {
      type: Date,
      required: [true, 'Please provide expiration date'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
