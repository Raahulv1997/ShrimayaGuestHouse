import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/User.js';
import Otp from '../models/Otp.js';

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google Sign-In / Oauth Login simulation
// @route   POST /api/users/google-login
// @access  Public
export const googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    if (!credential) {
      return res.status(400).json({ message: 'No credential token provided' });
    }

    // Verify token with Google's tokeninfo API
    const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    const { email, name, sub: googleId, email_verified } = googleRes.data;

    if (!email_verified) {
      return res.status(400).json({ message: 'Google email is not verified' });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      // Create user
      user = await User.create({
        name,
        email,
        googleId,
        password: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // secure random password
        phone: '',
      });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error('Error in Google Login verification:', error);
    res.status(500).json({ message: 'Google authentication failed or expired token' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update any user profile (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper to dispatch SMS via Fast2SMS API
const sendSMS = async (phone, otp) => {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.log(`[SMS SERVICE] No FAST2SMS_API_KEY set. SMS not dispatched to ${phone}.`);
    return false;
  }

  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        variables_values: otp,
        route: 'otp',
        numbers: phone,
      },
      {
        headers: {
          authorization: apiKey,
        },
      }
    );
    console.log(`[SMS SERVICE] SMS sent successfully via Fast2SMS to ${phone}:`, response.data);
    return true;
  } catch (error) {
    console.error(`[SMS SERVICE] Fast2SMS dispatch failed for ${phone}:`, error.response?.data || error.message);
    return false;
  }
};

// @desc    Send OTP to phone
// @route   POST /api/users/send-otp
// @access  Public
export const sendOTP = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    // Generate a 6-digit verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Save or update the OTP in the database
    await Otp.findOneAndUpdate(
      { phone },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // Output to console log for staging / easy debugging
    console.log(`[OTP SERVICE] Generated OTP for ${phone} is: ${otp}`);

    // Call SMS gateway
    const smsSent = await sendSMS(phone, otp);

    // Return the OTP code directly in response for easy testing
    res.status(200).json({
      message: smsSent 
        ? 'OTP sent successfully to your mobile number.' 
        : 'OTP generated (Logged to server console, SMS API key missing on host).',
      otpForTesting: otp,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and Log in or Auto-register
// @route   POST /api/users/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  const { phone, otp, name } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone and OTP are required' });
  }

  try {
    const otpRecord = await Otp.findOne({ phone });
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP expired or not found. Please try again.' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP verified, remove record from database
    await Otp.deleteOne({ _id: otpRecord._id });

    // Check if user with this phone exists
    let user = await User.findOne({ phone });

    // If not found by phone, check if a temp-email user exists (e.g. 9876543210@otp.shrimayaguesthouse.com)
    if (!user) {
      const tempEmail = `${phone}@otp.shrimayaguesthouse.com`;
      user = await User.findOne({ email: tempEmail });
    }

    // Auto-register if user doesn't exist
    if (!user) {
      const tempEmail = `${phone}@otp.shrimayaguesthouse.com`;
      const finalName = name || `Guest-${phone.slice(-4)}`;
      // Generate a random password (required field in database schema)
      const randomPassword = Math.random().toString(36).slice(-8) + 'A1!';

      user = await User.create({
        name: finalName,
        email: tempEmail,
        password: randomPassword,
        phone: phone,
      });
    } else if (name && (user.name.startsWith('Guest-') || !user.name)) {
      // Update placeholder Guest-XXXX name if they provided a real name now
      user.name = name;
      await user.save();
    }

    // Generate token and return success login payload
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
