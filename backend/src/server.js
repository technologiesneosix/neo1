import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { validateEnv, backendEnvSchema } from '@neosix/shared';
import { logger } from './utils/logger.js';
import { Service, Solution, Industry, Technology, Project, Blog } from './models/index.js';
import { missingSolutions, missingIndustries } from './seeds/missing-content.js';
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

    // Perform a one-time migration to publish seeded draft content (ensuring they aren't hidden from the public API)
    try {
      logger.info('Running database migration to auto-publish draft content...');
      await Promise.all([
        Service.updateMany({ status: 'draft' }, { $set: { status: 'published' } }),
        Solution.updateMany({ status: 'draft' }, { $set: { status: 'published' } }),
        Industry.updateMany({ status: 'draft' }, { $set: { status: 'published' } }),
        Technology.updateMany({ status: 'draft' }, { $set: { status: 'published' } }),
        Project.updateMany({ status: 'draft' }, { $set: { status: 'published' } }),
        Blog.updateMany({ published: false }, { $set: { published: true } })
      ]);
      logger.info('✓ Database migration completed successfully');

      // Incremental seeding: insert missing solutions and industries without resetting the database
      logger.info('Running incremental seeding for missing solutions and industries...');
      for (const sol of missingSolutions) {
        const exists = await Solution.findOne({ slug: sol.slug });
        if (!exists) {
          await Solution.create(sol);
          logger.info(`+ Incremental seed: Solution '${sol.title}'`);
        }
      }
      for (const ind of missingIndustries) {
        const exists = await Industry.findOne({ slug: ind.slug });
        if (!exists) {
          await Industry.create(ind);
          logger.info(`+ Incremental seed: Industry '${ind.title}'`);
        }
      }
      logger.info('✓ Incremental seeding completed successfully');
    } catch (migrateError) {
      logger.error('Database migration/seeding failed:', migrateError);
    }
    
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
