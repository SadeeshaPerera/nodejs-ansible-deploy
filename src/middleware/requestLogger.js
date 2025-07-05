const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

const requestLogger = (req, res, next) => {
  // Generate unique request ID
  req.requestId = uuidv4();
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', req.requestId);
  
  // Log request details
  const requestInfo = {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  };
  
  logger.info('Incoming request', requestInfo);
  
  // Track response time
  const startTime = Date.now();
  
  res.on('finish', () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const responseInfo = {
      requestId: req.requestId,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: res.getHeader('content-length') || 0
    };
    
    if (res.statusCode >= 400) {
      logger.error('Request completed with error', responseInfo);
    } else {
      logger.info('Request completed successfully', responseInfo);
    }
  });
  
  next();
};

module.exports = { requestLogger };
