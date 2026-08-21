import Review from '../models/Review.js';

// @desc    Create a new review (pending admin approval)
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  const { roomId, rating, comment } = req.body;

  try {
    const review = await Review.create({
      user: req.user._id,
      room: roomId,
      rating,
      comment,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Review submitted successfully. It will be visible once approved by admin.',
      review,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get approved reviews for a specific room or overall
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  const { roomId } = req.query;

  try {
    let query = { status: 'approved' };
    if (roomId) {
      query.room = roomId;
    }

    const reviews = await Review.find(query)
      .populate('user', 'name')
      .populate('room', 'name category')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews (Admin only)
// @route   GET /api/reviews/admin
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'name email')
      .populate('room', 'name category')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Moderate a review (Admin only)
// @route   PUT /api/reviews/:id/moderate
// @access  Private/Admin
export const moderateReview = async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Choose approved or rejected.' });
  }

  try {
    const review = await Review.findById(req.params.id);

    if (review) {
      review.status = status;
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      await review.deleteOne();
      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
