const express = require('express');
const promClient = require('prom-client');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/v1/metrics:
 *   get:
 *     summary: Get Prometheus metrics
 *     responses:
 *       200:
 *         description: Prometheus metrics
 */
router.get('/', asyncHandler(async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
}));

/**
 * @swagger
 * /api/v1/metrics/custom:
 *   get:
 *     summary: Get custom application metrics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Custom metrics
 */
router.get('/custom', authenticateToken, asyncHandler(async (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid
    },
    application: {
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      requestId: req.requestId
    }
  };
  
  logger.info('Custom metrics requested', {
    userId: req.user.id,
    requestId: req.requestId
  });
  
  res.json({
    success: true,
    data: metrics
  });
}));

module.exports = router;
