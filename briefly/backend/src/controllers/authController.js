const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const { generateToken } = require('../utils/tokenUtils');

const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, accountType } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      name,
      email,
      password_hash,
      account_type: accountType || 'Student'
    });

    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: newUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    
    // Remove hash from returned user object
    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

const demoLogin = async (req, res, next) => {
  try {
    const demoEmail = 'demo@briefly.com';
    const demoPassword = 'brieflydemo123';
    
    let user = await UserModel.findByEmail(demoEmail);
    
    if (!user) {
      const salt = await bcrypt.genSalt(12);
      const password_hash = await bcrypt.hash(demoPassword, salt);
      user = await UserModel.create({
        name: 'Demo User',
        email: demoEmail,
        password_hash: password_hash,
        account_type: 'Student'
      });
    }

    const token = generateToken(user.id);
    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'Demo login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  demoLogin
};
