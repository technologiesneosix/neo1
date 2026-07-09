import ApiError from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  logger.error('Unexpected error:', err);
  console.error('FULL ERROR STACK:', err);

  try {
    const logsDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(logsDir, 'last_unexpected_error.txt'),
      `${new Date().toISOString()}\nError: ${err.message}\nStack:\n${err.stack || ''}\n`
    );
  } catch (logErr) {
    console.error('Failed to write unexpected error log file:', logErr);
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
