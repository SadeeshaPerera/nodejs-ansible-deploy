const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { asyncHandler } = require('./errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const validateApiKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  const expectedApiKey = process.env.API_KEY;
  
  if (!expectedApiKey) {
    return next(); // Skip if no API key is configured
  }
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key is required'
    });
  }
  
  if (apiKey !== expectedApiKey) {
    logger.warn('Invalid API key attempt', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      providedKey: apiKey.substring(0, 8) + '...'
    });
    
    return res.status(401).json({
      success: false,
      error: 'Invalid API key'
    });
  }
  
  next();
});

const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token is required'
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid token attempt', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      error: error.message
    });
    
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

module.exports = {
  validateApiKey,
  authenticateToken,
  authorizeRoles
};
