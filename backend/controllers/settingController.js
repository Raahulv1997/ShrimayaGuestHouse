import Setting from '../models/Setting.js';

// @desc    Get website settings by key
// @route   GET /api/settings/:key
// @access  Public
export const getSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (setting) {
      res.json(setting.value);
    } else {
      res.status(404).json({ message: 'Setting not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update website settings by key
// @route   PUT /api/settings/:key
// @access  Private/Admin
export const updateSetting = async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: req.params.key });

    if (setting) {
      setting.value = req.body.value;
      await setting.save();
    } else {
      setting = await Setting.create({
        key: req.params.key,
        value: req.body.value,
      });
    }

    res.json({ message: 'Settings updated successfully', value: setting.value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
