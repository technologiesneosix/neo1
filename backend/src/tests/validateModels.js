import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import {
  Admin,
  Hero,
  About,
  Service,
  Solution,
  Industry,
  Technology,
  Project,
  BlogCategory,
  Blog,
  Team,
  Testimonial,
  Career,
  JobApplication,
  ContactMessage,
  NewsletterSubscriber,
  FAQ,
  WebsiteSetting,
  SEO,
  Media,
} from '../models/index.js';

dotenv.config();

const testResults = {
  passed: [],
  failed: [],
};

const logResult = (test, passed, message) => {
  if (passed) {
    testResults.passed.push({ test, message });
    console.log(`✅ ${test}: ${message}`);
  } else {
    testResults.failed.push({ test, message });
    console.log(`❌ ${test}: ${message}`);
  }
};

const validateModels = async () => {
  try {
    await connectDatabase();
    console.log('Starting model validation...\n');

    // Define models
    const models = [
      Admin, Hero, About, Service, Solution, Industry, Technology,
      Project, BlogCategory, Blog, Team, Testimonial, Career,
      JobApplication, ContactMessage, NewsletterSubscriber, FAQ,
      WebsiteSetting, SEO, Media,
    ];

    // Create all indexes before testing
    console.log('Syncing indexes...');
    for (const Model of models) {
      await Model.syncIndexes();
    }
    console.log('Indexes synced\n');

    // Test 1: Schema compilation
    console.log('--- Testing Schema Compilation ---');
    
    try {
      for (const Model of models) {
        Model.modelName; // Access modelName to trigger compilation
      }
      logResult('Schema Compilation', true, 'All models compiled successfully');
    } catch (error) {
      logResult('Schema Compilation', false, error.message);
    }

    // Test 2: Required field validation
    console.log('\n--- Testing Required Field Validation ---');
    try {
      const admin = new Admin();
      await admin.save();
      logResult('Required Field Validation', false, 'Should have failed without required fields');
    } catch (error) {
      if (error.errors) {
        logResult('Required Field Validation', true, 'Correctly validates required fields');
      } else {
        logResult('Required Field Validation', false, error.message);
      }
    }

    // Test 3: Unique indexes
    console.log('\n--- Testing Unique Indexes ---');
    try {
      // Clean up any existing test data
      await Technology.deleteMany({ slug: 'test-tech' });
      
      const tech1 = await Technology.create({
        name: 'Test Tech',
        slug: 'test-tech',
        category: 'frontend',
      });
      
      console.log('First tech created with slug:', tech1.slug);
      
      const tech2 = new Technology({
        name: 'Test Tech 2',
        slug: 'test-tech', // Duplicate slug
        category: 'backend',
      });
      
      await tech2.save();
      console.log('Second tech saved (should have failed)');
      logResult('Unique Index', false, 'Should have failed with duplicate slug');
      
      // Cleanup
      await Technology.deleteMany({ slug: 'test-tech' });
    } catch (error) {
      console.log('Unique index error:', error.code, error.message);
      if (error.code === 11000) {
        logResult('Unique Index', true, 'Correctly enforces unique constraint on slug');
        await Technology.deleteMany({ slug: 'test-tech' });
      } else {
        logResult('Unique Index', false, `Error: ${error.message}`);
      }
    }

    // Test 4: Enum validation
    console.log('\n--- Testing Enum Validation ---');
    try {
      const tech = new Technology({
        name: 'Test Tech',
        slug: 'test-tech-enum',
        category: 'invalid-category', // Invalid enum
      });
      await tech.save();
      logResult('Enum Validation', false, 'Should have failed with invalid enum');
    } catch (error) {
      if (error.errors && error.errors.category) {
        logResult('Enum Validation', true, 'Correctly validates enum values');
      } else {
        logResult('Enum Validation', false, error.message);
      }
    }

    // Test 5: Default values
    console.log('\n--- Testing Default Values ---');
    try {
      const tech = await Technology.create({
        name: 'Default Test',
        slug: 'default-test',
        category: 'frontend',
      });
      
      const defaultsMatch = 
        tech.status === 'draft' &&
        tech.displayOrder === 0;
      
      logResult('Default Values', defaultsMatch, 'Default values applied correctly');
      await Technology.deleteOne({ slug: 'default-test' });
    } catch (error) {
      logResult('Default Values', false, error.message);
    }

    // Test 6: Timestamps
    console.log('\n--- Testing Timestamps ---');
    try {
      const tech = await Technology.create({
        name: 'Timestamp Test',
        slug: 'timestamp-test',
        category: 'frontend',
      });
      
      const hasTimestamps = tech.createdAt && tech.updatedAt;
      logResult('Timestamps', hasTimestamps, 'Timestamps created correctly');
      await Technology.deleteOne({ slug: 'timestamp-test' });
    } catch (error) {
      logResult('Timestamps', false, error.message);
    }

    // Test 7: ObjectId relationships with populate
    console.log('\n--- Testing ObjectId Relationships ---');
    try {
      const tech = await Technology.create({
        name: 'Relation Test',
        slug: 'relation-test',
        category: 'frontend',
      });
      
      const service = await Service.create({
        title: 'Test Service',
        slug: 'test-service',
        shortDescription: 'Test',
        description: 'Test description',
        technologies: [tech._id],
      });
      
      const populatedService = await Service.findById(service._id).populate('technologies');
      
      const hasPopulated = populatedService.technologies[0].name === 'Relation Test';
      logResult('ObjectId Relationships', hasPopulated, 'Populate works correctly');
      
      await Technology.deleteOne({ slug: 'relation-test' });
      await Service.deleteOne({ slug: 'test-service' });
    } catch (error) {
      logResult('ObjectId Relationships', false, error.message);
    }

    // Test 8: Sensitive fields excluded from JSON
    console.log('\n--- Testing Sensitive Fields Exclusion ---');
    try {
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'test@test.com',
        password: 'Test@123456',
      });
      
      const adminJson = admin.toJSON();
      const hasNoPassword = !adminJson.password;
      const hasNoRefreshToken = !adminJson.refreshToken;
      
      logResult('Sensitive Fields Exclusion', hasNoPassword && hasNoRefreshToken, 'Password and refreshToken excluded from JSON');
      
      await Admin.deleteOne({ email: 'test@test.com' });
    } catch (error) {
      logResult('Sensitive Fields Exclusion', false, error.message);
    }

    // Test 9: Slug auto-generation
    console.log('\n--- Testing Slug Auto-Generation ---');
    try {
      const service = await Service.create({
        title: 'Auto Slug Test',
        shortDescription: 'Test',
        description: 'Test description',
      });
      
      const slugGenerated = service.slug === 'auto-slug-test';
      logResult('Slug Auto-Generation', slugGenerated, 'Slug auto-generated correctly');
      
      await Service.deleteOne({ slug: 'auto-slug-test' });
    } catch (error) {
      logResult('Slug Auto-Generation', false, error.message);
    }

    // Test 10: Email validation
    console.log('\n--- Testing Email Validation ---');
    try {
      const subscriber = new NewsletterSubscriber({
        email: 'invalid-email',
      });
      await subscriber.save();
      logResult('Email Validation', false, 'Should have failed with invalid email');
    } catch (error) {
      if (error.errors && error.errors.email) {
        logResult('Email Validation', true, 'Email validation works correctly');
      } else {
        logResult('Email Validation', false, error.message);
      }
    }

    // Test 11: Rating validation
    console.log('\n--- Testing Rating Validation ---');
    try {
      const testimonial = new Testimonial({
        clientName: 'Test Client',
        review: 'Test review',
        rating: 6, // Invalid rating > 5
      });
      await testimonial.save();
      logResult('Rating Validation', false, 'Should have failed with invalid rating');
    } catch (error) {
      if (error.errors && error.errors.rating) {
        logResult('Rating Validation', true, 'Rating validation works correctly');
      } else {
        logResult('Rating Validation', false, error.message);
      }
    }

    console.log('\n--- Validation Summary ---');
    console.log(`✅ Passed: ${testResults.passed.length}`);
    console.log(`❌ Failed: ${testResults.failed.length}`);

    if (testResults.failed.length > 0) {
      console.log('\nFailed Tests:');
      testResults.failed.forEach(({ test, message }) => {
        console.log(`  - ${test}: ${message}`);
      });
    }

    await disconnectDatabase();
    process.exit(testResults.failed.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('Validation error:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

validateModels();
