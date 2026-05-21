/**
 * Logger Utility
 * 
 * WHY THIS FILE EXISTS:
 * Structured logging is essential for debugging, monitoring, and security auditing.
 * This simple logger wraps console methods with consistent formatting.
 * 
 * PRODUCTION CONSIDERATIONS:
 * - Use Winston or Pino for production (structured JSON logs, log levels, transports)
 * - Send logs to centralized logging service (CloudWatch, Loggly, etc.)
 * - Include request IDs for tracing requests across microservices
 * - Never log sensitive data (passwords, tokens, PII)
 */

const logger = {
  /**
   * Info level logging
   * Use for normal operations (user registered, profile updated)
   */
  info: (msg, meta = {}) => {
    console.log(JSON.stringify({ 
      level: "INFO", 
      timestamp: new Date().toISOString(), 
      message: msg, 
      ...meta 
    }));
  },
  
  /**
   * Error level logging
   * Use for exceptions and failed operations
   */
  error: (msg, meta = {}) => {
    console.error(JSON.stringify({ 
      level: "ERROR", 
      timestamp: new Date().toISOString(), 
      message: msg, 
      ...meta 
    }));
  },
  
  /**
   * Warn level logging
   * Use for unusual but non-fatal conditions
   */
  warn: (msg, meta = {}) => {
    console.warn(JSON.stringify({ 
      level: "WARN", 
      timestamp: new Date().toISOString(), 
      message: msg, 
      ...meta 
    }));
  }
};

module.exports = logger;