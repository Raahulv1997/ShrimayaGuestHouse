import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '5m' }, // Auto-deletes document after 5 minutes
    },
  },
  { timestamps: true }
);

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
