const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * @swagger
 * /api/v1/upload/image:
 *   post:
 *     summary: Upload and process an image
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post('/image', authenticateToken, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No image file provided'
    });
  }
  
  const originalPath = req.file.path;
  const filename = req.file.filename;
  const nameWithoutExt = path.parse(filename).name;
  
  // Process image with Sharp
  const processedFilename = `${nameWithoutExt}-processed.jpg`;
  const processedPath = path.join(uploadsDir, processedFilename);
  
  try {
    await sharp(originalPath)
      .resize(800, 600, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toFile(processedPath);
    
    // Generate thumbnail
    const thumbnailFilename = `${nameWithoutExt}-thumb.jpg`;
    const thumbnailPath = path.join(uploadsDir, thumbnailFilename);
    
    await sharp(originalPath)
      .resize(200, 200, {
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);
    
    logger.info('Image processed successfully', {
      originalFile: filename,
      processedFile: processedFilename,
      thumbnailFile: thumbnailFilename,
      userId: req.user.id,
      requestId: req.requestId
    });
    
    res.json({
      success: true,
      data: {
        message: 'Image uploaded and processed successfully',
        files: {
          original: `/uploads/${filename}`,
          processed: `/uploads/${processedFilename}`,
          thumbnail: `/uploads/${thumbnailFilename}`
        },
        metadata: {
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          uploadedAt: new Date().toISOString(),
          uploadedBy: req.user.id
        }
      }
    });
    
  } catch (error) {
    logger.error('Error processing image', {
      error: error.message,
      filename,
      userId: req.user.id,
      requestId: req.requestId
    });
    
    // Clean up files on error
    if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
    if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);
    
    res.status(500).json({
      success: false,
      error: 'Failed to process image'
    });
  }
}));

/**
 * @swagger
 * /api/v1/upload/files:
 *   get:
 *     summary: List uploaded files
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of uploaded files
 */
router.get('/files', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const fileDetails = files.map(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      return {
        filename: file,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        url: `/uploads/${file}`
      };
    });
    
    res.json({
      success: true,
      data: {
        files: fileDetails,
        total: fileDetails.length
      }
    });
    
  } catch (error) {
    logger.error('Error listing files', {
      error: error.message,
      userId: req.user.id,
      requestId: req.requestId
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to list files'
    });
  }
}));

module.exports = router;
