const express = require('express')
const { uploadFile, deleteFile, listFiles, getPublicUrl } = require('../services/storageService.js')

const router = express.Router()

/**
 * Upload file to Supabase
 * POST /api/storage/upload
 * Body: { bucket, path, file }
 */
router.post('/upload', async (req, res) => {
  try {
    const { bucket, path, file } = req.body

    if (!bucket || !path || !file) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bucket, path, file'
      })
    }

    // Convert base64 or string to buffer
    const fileBuffer = Buffer.from(file, 'base64')

    const result = await uploadFile(bucket, path, fileBuffer)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error
      })
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      url: result.url,
      path: result.path
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    })
  }
})

/**
 * Delete file from Supabase
 * DELETE /api/storage/delete
 * Body: { bucket, path }
 */
router.delete('/delete', async (req, res) => {
  try {
    const { bucket, path } = req.body

    if (!bucket || !path) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bucket, path'
      })
    }

    const result = await deleteFile(bucket, path)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error
      })
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error.message
    })
  }
})

/**
 * List files in bucket
 * GET /api/storage/list/:bucket?path=/optional/path
 */
router.get('/list/:bucket', async (req, res) => {
  try {
    const { bucket } = req.params
    const path = req.query.path || '' // Get optional path from query params

    if (!bucket) {
      return res.status(400).json({
        success: false,
        message: 'Missing bucket name'
      })
    }

    const result = await listFiles(bucket, path)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error
      })
    }

    res.json({
      success: true,
      files: result.files,
      count: result.files.length
    })
  } catch (error) {
    console.error('List error:', error)
    res.status(500).json({
      success: false,
      message: 'List failed',
      error: error.message
    })
  }
})

/**
 * Get public URL for file
 * GET /api/storage/url/:bucket/:path
 */
router.get('/url/:bucket/:path', (req, res) => {
  try {
    const { bucket, path } = req.params

    if (!bucket || !path) {
      return res.status(400).json({
        success: false,
        message: 'Missing bucket or path'
      })
    }

    const url = getPublicUrl(bucket, path)

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Could not generate URL (Supabase not configured)'
      })
    }

    res.json({
      success: true,
      url
    })
  } catch (error) {
    console.error('URL generation error:', error)
    res.status(500).json({
      success: false,
      message: 'URL generation failed',
      error: error.message
    })
  }
})

module.exports = router
