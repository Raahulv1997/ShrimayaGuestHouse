import express from 'express';
import {
  submitContactInquiry,
  getContactInquiries,
  replyToContactInquiry,
  deleteInquiry,
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitContactInquiry)
  .get(protect, admin, getContactInquiries);
router.put('/:id/reply', protect, admin, replyToContactInquiry);
router.delete('/:id', protect, admin, deleteInquiry);

export default router;
