import express from 'express';
import {
  registerUser,
  loginUser,
  googleLogin,
  sendOTP,
  verifyOTP,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  updateUser,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/')
  .get(protect, admin, getAllUsers);
router.route('/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;
