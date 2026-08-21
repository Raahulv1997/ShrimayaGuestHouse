import Gallery from '../models/Gallery.js';

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
export const getGalleryItems = async (req, res) => {
  const { category } = req.query;

  try {
    let query = {};
    if (category) {
      query.category = category;
    }

    const items = await Gallery.find(query).sort('-createdAt');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a gallery item (Admin only)
// @route   POST /api/gallery
// @access  Private/Admin
export const createGalleryItem = async (req, res) => {
  const { title, url, category, type } = req.body;

  try {
    const item = await Gallery.create({
      title,
      url,
      category,
      type,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a gallery item (Admin only)
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (item) {
      await item.deleteOne();
      res.json({ message: 'Gallery item removed' });
    } else {
      res.status(404).json({ message: 'Gallery item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
