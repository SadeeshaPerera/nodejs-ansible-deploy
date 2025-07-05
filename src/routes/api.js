const express = require('express');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateApiKey, authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/v1/status:
 *   get:
 *     summary: Get API status
 *     responses:
 *       200:
 *         description: API status information
 */
router.get('/status', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'operational',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    }
  });
}));

/**
 * @swagger
 * /api/v1/data:
 *   get:
 *     summary: Get sample data
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Sample data
 */
router.get('/data', validateApiKey, asyncHandler(async (req, res) => {
  const sampleData = {
    id: 1,
    name: 'Sample Data',
    description: 'This is sample data from the API',
    timestamp: new Date().toISOString(),
    metadata: {
      requestId: req.requestId,
      source: 'api'
    }
  };
  
  logger.info('Sample data requested', { requestId: req.requestId });
  
  res.json({
    success: true,
    data: sampleData
  });
}));

/**
 * @swagger
 * /api/v1/secure:
 *   get:
 *     summary: Get secure data (requires authentication)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Secure data
 */
router.get('/secure', authenticateToken, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'This is secure data',
      user: req.user,
      timestamp: new Date().toISOString()
    }
  });
}));

/**
 * @swagger
 * /api/v1/echo:
 *   post:
 *     summary: Echo back the request data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Echoed data
 */
router.post('/echo', [
  body('message').notEmpty().withMessage('Message is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  const { message } = req.body;
  
  logger.info('Echo request received', { 
    message, 
    requestId: req.requestId 
  });
  
  res.json({
    success: true,
    data: {
      echo: message,
      timestamp: new Date().toISOString(),
      requestId: req.requestId
    }
  });
}));

module.exports = router;
