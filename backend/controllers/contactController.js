import Contact from '../models/Contact.js';

// @desc    Submit a contact inquiry
// @route   POST /api/contacts
// @access  Public
export const submitContactInquiry = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    const inquiry = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      message: 'Inquiry submitted successfully. We will get back to you shortly.',
      inquiry,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all inquiries (Admin only)
// @route   GET /api/contacts
// @access  Private/Admin
export const getContactInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.find({}).sort('-createdAt');
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to an inquiry (Admin only)
// @route   PUT /api/contacts/:id/reply
// @access  Private/Admin
export const replyToContactInquiry = async (req, res) => {
  const { replyMessage } = req.body;

  try {
    const inquiry = await Contact.findById(req.params.id);

    if (inquiry) {
      inquiry.replied = true;
      inquiry.replyMessage = replyMessage;
      
      const updatedInquiry = await inquiry.save();
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete inquiry (Admin only)
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Contact.findById(req.params.id);
    if (inquiry) {
      await inquiry.deleteOne();
      res.json({ message: 'Inquiry removed' });
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
