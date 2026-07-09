import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { validateEnv, backendEnvSchema } from '@neosix/shared';
import { logger } from './utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Validate environment variables
try {
  validateEnv(backendEnvSchema, process.env);
} catch (error) {
  logger.error('Environment validation failed:', error);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    
    await connectDatabase();

    
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Trigger reload for new env configuration (v2)
startServer();
