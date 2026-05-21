/**
 * Response Helper Utilities
 * 
 * WHY THIS FILE EXISTS:
 * Standardizing API responses ensures consistency across all endpoints.
 * Controllers use these helpers instead of manually constructing responses.
 * 
 * BENEFITS:
 * 1. Consistent JSON structure across all API responses
 * 2. Reduces code duplication in controllers
 * 3. Makes response format self-documenting
 * 4. Easy to modify response structure in one place
 */

/**
 * Success Response
 * 
 * @param {Response} res - Express response object
 * @param {*} data - Response data (user object, token, etc.)
 * @param {number} status - HTTP status code (default 200)
 * @returns {Response} JSON response with success flag and data
 */
const success = (res, data, status = 200) => {
  return res.status(status).json({ 
    success: true, 
    data 
  });
};

/**
 * Error Response
 * 
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 * @param {number} status - HTTP status code (default 500)
 * @param {*} details - Additional error details (stack trace, validation errors)
 * @returns {Response} JSON response with success flag and error
 */
const error = (res, message, status = 500, details = null) => {
  return res.status(status).json({ 
    success: false, 
    error: message, 
    details 
  });
};

module.exports = { success, error };