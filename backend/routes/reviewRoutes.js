import express from 'express';
import {
  createReview,
  getReviews,
  getAllReviews,
  moderateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createReview)
  .get(getReviews);
router.get('/admin', protect, admin, getAllReviews);
router.put('/:id/moderate', protect, admin, moderateReview);
router.delete('/:id', protect, admin, deleteReview);

export default router;
