const getSupabase = require('../config/supabase.js')

/**
 * Upload file to Supabase Storage
 * @param {string} bucket - Bucket name (e.g., 'invoices', 'customer-docs')
 * @param {string} path - File path in bucket (e.g., 'invoice-2026-04-06.pdf')
 * @param {Buffer} fileBuffer - File content as buffer
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
const uploadFile = async (bucket, path, fileBuffer) => {
  const supabase = getSupabase()
  
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase not configured'
    }
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error(`Storage upload error: ${error.message}`)
      return {
        success: false,
        error: error.message
      }
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path
    }
  } catch (error) {
    console.error('Upload failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Delete file from Supabase Storage
 * @param {string} bucket - Bucket name
 * @param {string} path - File path to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
const deleteFile = async (bucket, path) => {
  const supabase = getSupabase()
  
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase not configured'
    }
  }

  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error(`Storage delete error: ${error.message}`)
      return {
        success: false,
        error: error.message
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * List files in bucket
 * @param {string} bucket - Bucket name
 * @param {string} path - Directory path (optional)
 * @returns {Promise<{success: boolean, files?: Array, error?: string}>}
 */
const listFiles = async (bucket, path = '') => {
  const supabase = getSupabase()
  
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase not configured'
    }
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path)

    if (error) {
      console.error(`Storage list error: ${error.message}`)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      files: data || []
    }
  } catch (error) {
    console.error('List failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Get public URL for a file
 * @param {string} bucket - Bucket name
 * @param {string} path - File path
 * @returns {string} Public URL
 */
const getPublicUrl = (bucket, path) => {
  const supabase = getSupabase()
  
  if (!supabase) {
    return null
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data?.publicUrl
}

module.exports = {
  uploadFile,
  deleteFile,
  listFiles,
  getPublicUrl
}
