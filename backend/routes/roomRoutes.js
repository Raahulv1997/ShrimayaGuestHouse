import express from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  checkAvailability,
  renameCategory,
  deleteCategory,
} from '../controllers/roomController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protect, admin, createRoom);

router.put('/category/rename', protect, admin, renameCategory);
router.delete('/category/:categoryName', protect, admin, deleteCategory);

router.route('/:id')
  .get(getRoomById)
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);
router.get('/:id/availability', checkAvailability);

export default router;
