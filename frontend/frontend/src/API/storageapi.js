const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Upload file to Supabase storage via backend
 * @param {string} bucket - Storage bucket name (e.g., 'invoices', 'customer-docs')
 * @param {string} path - File path in bucket
 * @param {File} file - File object from input
 * @returns {Promise<{success: boolean, url?: string, path?: string, error?: string}>}
 */
export const uploadToStorage = async (bucket, path, file) => {
  try {
    // Convert file to base64
    const reader = new FileReader()
    
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const base64String = reader.result.split(',')[1] // Remove data:...;base64, prefix
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/storage/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              bucket,
              path,
              file: base64String
            })
          })

          const data = await response.json()

          if (!response.ok) {
            reject(new Error(data.message || 'Upload failed'))
          }

          resolve(data)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsDataURL(file)
    })
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Delete file from storage
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteFromStorage = async (bucket, path) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/storage/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bucket, path })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Delete failed')
    }

    return data
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * List files in bucket
 * @param {string} bucket - Storage bucket name
 * @param {string} path - Directory path (optional)
 * @returns {Promise<{success: boolean, files?: Array, count?: number, error?: string}>}
 */
export const listStorageFiles = async (bucket, path = '') => {
  try {
    const encodedPath = encodeURIComponent(path)
    const response = await fetch(
      `${API_BASE_URL}/api/storage/list/${bucket}/${encodedPath}`,
      {
        method: 'GET'
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'List failed')
    }

    return data
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Get public URL for a file
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const getStorageURL = async (bucket, path) => {
  try {
    const encodedPath = encodeURIComponent(path)
    const response = await fetch(
      `${API_BASE_URL}/api/storage/url/${bucket}/${encodedPath}`,
      {
        method: 'GET'
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'URL generation failed')
    }

    return data
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

export default {
  uploadToStorage,
  deleteFromStorage,
  listStorageFiles,
  getStorageURL
}
