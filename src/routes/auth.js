const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Mock user database (replace with actual database)
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin'
  },
  {
    id: 2,
    email: 'user@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'user'
  }
];

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    logger.warn('Login attempt with invalid email', { 
      email, 
      ip: req.ip,
      requestId: req.requestId 
    });
    
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
  
  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    logger.warn('Login attempt with invalid password', { 
      email, 
      ip: req.ip,
      requestId: req.requestId 
    });
    
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
  
  // Generate token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  logger.info('Successful login', { 
    userId: user.id, 
    email: user.email,
    ip: req.ip,
    requestId: req.requestId 
  });
  
  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    }
  });
}));

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: User registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  const { email, password, role = 'user' } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User already exists'
    });
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    role
  };
  
  users.push(newUser);
  
  logger.info('New user registered', { 
    userId: newUser.id, 
    email: newUser.email,
    role: newUser.role,
    ip: req.ip,
    requestId: req.requestId 
  });
  
  res.status(201).json({
    success: true,
    data: {
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    }
  });
}));

module.exports = router;
