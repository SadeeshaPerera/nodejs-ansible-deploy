require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const promClient = require('prom-client');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import custom modules
const logger = require('./src/utils/logger');
const apiRoutes = require('./src/routes/api');
const authRoutes = require('./src/routes/auth');
const uploadRoutes = require('./src/routes/upload');
const metricsRoutes = require('./src/routes/metrics');
const { connectDatabase } = require('./src/config/database');
const { initRedis } = require('./src/config/redis');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');
const { requestLogger } = require('./src/middleware/requestLogger');
const { validateApiKey } = require('./src/middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

// Trust proxy when behind reverse proxy (Nginx, etc.)
// Only trust specific proxy IPs for better security
app.set('trust proxy', ['127.0.0.1', '::1', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16']);

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Ansible Deploy API',
      version: '1.0.0',
      description: 'Advanced Node.js API with comprehensive features',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Initialize metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false } // disable trust proxy validation
});

// Slow down repeated requests
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes at full speed
  delayMs: () => 500, // slow down subsequent requests by 500ms per request
  validate: { delayMs: false } // disable the warning message
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
  optionsSuccessStatus: 200
}));

// General middleware
app.use(compression());
app.use(limiter);
app.use(speedLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
} else {
  app.use(morgan('dev'));
}

// Custom request logger
app.use(requestLogger);

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Custom metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestsTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
});

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Redirect common documentation URL variations
app.get('/api-doc', (req, res) => {
  res.redirect('/api-docs');
});

app.get('/docs', (req, res) => {
  res.redirect('/api-docs');
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    environment: NODE_ENV
  });
});

app.get('/health/detailed', (req, res) => {
  const healthChecks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    version: process.version,
    environment: NODE_ENV,
    services: {
      database: 'connected', // This would be dynamic based on actual DB connection
      redis: 'connected',    // This would be dynamic based on actual Redis connection
      filesystem: fs.existsSync('./') ? 'accessible' : 'inaccessible'
    }
  };
  
  res.json(healthChecks);
});

// Readiness probe
app.get('/ready', (req, res) => {
  // Add actual readiness checks here
  res.json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'ready',
      redis: 'ready',
      filesystem: 'ready'
    }
  });
});

// Liveness probe
app.get('/live', (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    pid: process.pid
  });
});

// API routes
app.use('/api/v1', apiRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/metrics', metricsRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info(`New WebSocket connection: ${socket.id}`);
  
  socket.emit('welcome', {
    message: 'Connected to Node.js Ansible Deploy WebSocket',
    timestamp: new Date().toISOString()
  });
  
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date().toISOString() });
  });
  
  socket.on('disconnect', () => {
    logger.info(`WebSocket disconnected: ${socket.id}`);
  });
});

// Scheduled tasks
cron.schedule('0 */6 * * *', () => {
  logger.info('Running scheduled cleanup task');
  // Add cleanup logic here
});

cron.schedule('*/5 * * * *', () => {
  logger.debug('Health check cron job running');
  // Add health monitoring logic here
});

// Main route
app.get('/', (req, res) => {
  res.json({
    name: 'Node.js Ansible Deploy API',
    version: '1.0.0',
    description: 'Advanced Node.js application with comprehensive features',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    features: [
      'Authentication & Authorization',
      'File Upload & Processing',
      'Real-time WebSocket Communication',
      'Prometheus Metrics',
      'Rate Limiting & Security',
      'Comprehensive Logging',
      'API Documentation',
      'Health Checks',
      'Scheduled Tasks'
    ],
    endpoints: {
      health: '/health',
      detailed_health: '/health/detailed',
      readiness: '/ready',
      liveness: '/live',
      metrics: '/metrics',
      api_docs: '/api-docs',
      api_v1: '/api/v1'
    }
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    if (process.env.MONGODB_URI) {
      await connectDatabase();
    }
    
    // Initialize Redis connection
    if (process.env.REDIS_URL) {
      await initRedis();
    }
    
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${NODE_ENV}`);
      logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`Metrics: http://localhost:${PORT}/metrics`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server, io };
