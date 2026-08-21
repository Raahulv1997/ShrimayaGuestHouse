import Offer from '../models/Offer.js';

// @desc    Get all active offers
// @route   GET /api/offers
// @access  Public
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ active: true, validUntil: { $gte: new Date() } });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all offers (Admin only)
// @route   GET /api/offers/admin
// @access  Private/Admin
export const getAllOffersAdmin = async (req, res) => {
  try {
    const offers = await Offer.find({}).sort('-createdAt');
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check a coupon code validity
// @route   GET /api/offers/check/:code
// @access  Private
export const checkOfferCode = async (req, res) => {
  try {
    const offer = await Offer.findOne({ code: req.params.code.toUpperCase(), active: true });

    if (!offer) {
      return res.status(404).json({ message: 'Invalid promo code' });
    }

    if (new Date(offer.validUntil) < new Date()) {
      return res.status(400).json({ message: 'Promo code has expired' });
    }

    res.json({
      code: offer.code,
      discountPercentage: offer.discountPercentage,
      description: offer.description,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an offer (Admin only)
// @route   POST /api/offers
// @access  Private/Admin
export const createOffer = async (req, res) => {
  const { code, discountPercentage, description, validUntil } = req.body;

  try {
    const offerExists = await Offer.findOne({ code: code.toUpperCase() });
    if (offerExists) {
      return res.status(400).json({ message: 'Offer code already exists' });
    }

    const offer = await Offer.create({
      code: code.toUpperCase(),
      discountPercentage,
      description,
      validUntil,
    });

    res.status(201).json(offer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an offer (Admin only)
// @route   DELETE /api/offers/:id
// @access  Private/Admin
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (offer) {
      await offer.deleteOne();
      res.json({ message: 'Offer removed' });
    } else {
      res.status(404).json({ message: 'Offer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
