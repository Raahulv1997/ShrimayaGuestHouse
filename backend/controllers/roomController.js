import Room from '../models/Room.js';
import Booking from '../models/Booking.js';

// Helper to check room availability details
export const getAvailableCount = async (roomId, checkInStr, checkOutStr) => {
  const room = await Room.findById(roomId);
  if (!room) return 0;
  if (room.status === 'maintenance') return 0;

  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);

  // Find all active bookings overlapping with these dates
  const overlappingBookings = await Booking.find({
    room: roomId,
    status: { $ne: 'cancelled' },
    $or: [
      { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } },
    ],
  });

  // Calculate sum of rooms booked
  const bookedRoomsCount = overlappingBookings.reduce((sum, booking) => sum + booking.roomsCount, 0);
  
  // Available rooms
  const availableRooms = Math.max(0, room.totalRooms - bookedRoomsCount);
  return availableRooms;
};

// @desc    Get all rooms (supports availability filtering)
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res) => {
  const { checkIn, checkOut, category, guests } = req.query;

  try {
    let query = {};
    if (category) {
      query.category = category;
    }
    if (guests) {
      query.maxGuests = { $gte: Number(guests) };
    }

    const rooms = await Room.find(query);

    // If checkIn and checkOut are provided, filter by availability
    if (checkIn && checkOut) {
      const roomsWithAvailability = [];
      for (const room of rooms) {
        const availableCount = await getAvailableCount(room._id, checkIn, checkOut);
        roomsWithAvailability.push({
          ...room.toObject(),
          availableCount,
          isAvailable: availableCount > 0,
        });
      }
      return res.json(roomsWithAvailability);
    }

    res.json(rooms.map(room => ({ ...room.toObject(), isAvailable: true, availableCount: room.totalRooms })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      const { checkIn, checkOut } = req.query;
      let availableCount = room.totalRooms;
      if (checkIn && checkOut) {
        availableCount = await getAvailableCount(room._id, checkIn, checkOut);
      }
      res.json({ ...room.toObject(), availableCount });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a room (Admin only)
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = async (req, res) => {
  const { name, category, description, pricePerNight, maxGuests, amenities, totalRooms, images } = req.body;

  try {
    const room = await Room.create({
      name,
      category,
      description,
      pricePerNight,
      maxGuests,
      amenities,
      totalRooms,
      images,
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a room (Admin only)
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res) => {
  const { name, category, description, pricePerNight, maxGuests, amenities, totalRooms, status, images } = req.body;

  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      room.name = name || room.name;
      room.category = category || room.category;
      room.description = description || room.description;
      room.pricePerNight = pricePerNight !== undefined ? pricePerNight : room.pricePerNight;
      room.maxGuests = maxGuests !== undefined ? maxGuests : room.maxGuests;
      room.amenities = amenities || room.amenities;
      room.totalRooms = totalRooms !== undefined ? totalRooms : room.totalRooms;
      room.status = status || room.status;
      room.images = images || room.images;

      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a room (Admin only)
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      await room.deleteOne();
      res.json({ message: 'Room removed' });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Query single room availability
// @route   GET /api/rooms/:id/availability
// @access  Public
export const checkAvailability = async (req, res) => {
  const { checkIn, checkOut } = req.query;

  if (!checkIn || !checkOut) {
    return res.status(400).json({ message: 'Please specify checkIn and checkOut dates' });
  }

  try {
    const count = await getAvailableCount(req.params.id, checkIn, checkOut);
    res.json({ roomId: req.params.id, availableRooms: count, isAvailable: count > 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rename a category globally for all rooms
// @route   PUT /api/rooms/category/rename
// @access  Private/Admin
export const renameCategory = async (req, res) => {
  const { oldCategoryName, newCategoryName } = req.body;

  if (!oldCategoryName || !newCategoryName) {
    return res.status(400).json({ message: 'Please specify old and new category names' });
  }

  try {
    const result = await Room.updateMany(
      { category: oldCategoryName },
      { $set: { category: newCategoryName } }
    );
    res.json({ message: `Successfully updated ${result.modifiedCount} rooms from category '${oldCategoryName}' to '${newCategoryName}'` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a category globally and remove all rooms belonging to it
// @route   DELETE /api/rooms/category/:categoryName
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  const { categoryName } = req.params;

  try {
    const result = await Room.deleteMany({ category: categoryName });
    res.json({ message: `Successfully deleted ${result.deletedCount} rooms from category '${categoryName}'` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
