const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const User = require('../models/User');

const login = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: 'User account is inactive' });
      }

      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user._id, username: user.username, isActive: user.isActive }
      });
    } catch (err) {
      res.status(500).json({ message: 'Error logging in', error: err.message });
    }
  }
];

const register = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();

      res.status(201).json({
        message: 'User registered successfully',
        user: { id: user._id, username: user.username, isActive: user.isActive }
      });
    } catch (err) {
      res.status(500).json({ message: 'Error registering user', error: err.message });
    }
  }
];

module.exports = { login, register };
