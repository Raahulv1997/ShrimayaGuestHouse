import express from 'express';
import {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getGalleryItems)
  .post(protect, admin, createGalleryItem);
router.delete('/:id', protect, admin, deleteGalleryItem);

export default router;
