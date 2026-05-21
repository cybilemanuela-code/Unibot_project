/**
 * Request Validation Middleware
 * 
 * WHY THIS FILE EXISTS:
 * Input validation is critical for security and data integrity. This middleware uses Joi
 * to validate incoming request bodies before they reach the controller.
 * 
 * SECURITY BENEFITS:
 * 1. Prevents injection attacks by validating/sanitizing input
 * 2. Ensures data consistency in database
 * 3. Provides clear error messages for frontend debugging
 * 4. Reduces unnecessary database operations for invalid data
 * 
 * VALIDATION FLOW:
 * 1. Express receives request with body
   2. Validation middleware intercepts before controller
 * 3. Joi validates against schema
 * 4. If invalid: Return 400 with error details
 * 5. If valid: Call next() to proceed to controller
 * 
 * JOI VS EXPRESS-VALIDATOR:
 * - Joi: Declarative, powerful, good for complex validation
 * - express-validator: Chainable, familiar to express developers
 */

const Joi = require("joi");

/**
 * Registration Schema
 * 
 * Define validation rules for user registration
 * Each field has specific constraints for security
 */
const registerSchema = Joi.object({
  // Email must be valid format, required field
  email: Joi.string().email().required(),
  
  // Password minimum 8 characters for security
  // Production should add complexity requirements (uppercase, numbers, symbols)
  password: Joi.string().min(8).required(),
  
  // Name between 2-100 characters for display purposes
  name: Joi.string().min(2).max(100).required(),
  
  // Role defaults to "student" if not provided
  // Joi's .valid() restricts to specific values
  role: Joi.string().valid("student", "administrator").default("student"),
});

/**
 * Login Schema
 * 
 * Define validation rules for user login
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/**
 * Profile Update Schema
 * 
 * Only allows updating whitelisted fields
 * Password updates require separate endpoint with current password verification
 */
const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/) // E.164 phone format
});

/**
 * Generic Validation Factory
 * 
 * Creates Express middleware that validates req.body against a Joi schema
 * 
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  // Validate request body against schema
  // abortEarly: false returns ALL validation errors, not just the first
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    // Return detailed validation errors for client debugging
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: error.details.map((d) => d.message),
    });
  }
  
  // Validation passed, proceed to controller
  next();
};

module.exports = { 
  registerSchema, 
  loginSchema,
  updateProfileSchema, 
  validate 
};