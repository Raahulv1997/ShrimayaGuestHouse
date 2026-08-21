import express from 'express';
import {
  getOffers,
  getAllOffersAdmin,
  checkOfferCode,
  createOffer,
  deleteOffer,
} from '../controllers/offerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getOffers)
  .post(protect, admin, createOffer);
router.get('/admin', protect, admin, getAllOffersAdmin);
router.get('/check/:code', protect, checkOfferCode);
router.delete('/:id', protect, admin, deleteOffer);

export default router;
