import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import Admin from '../models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDatabase();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@neosix.com' });

    if (existingAdmin) {
      console.log('Admin account already exists');
      await disconnectDatabase();
      process.exit(0);
    }

    // Create admin
    const admin = await Admin.create({
      name: process.env.ADMIN_NAME || 'Super Admin',
      email: process.env.ADMIN_EMAIL || 'admin@neosix.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      phone: process.env.ADMIN_PHONE || null,
    });

    console.log('Admin account created successfully:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('\nPlease change the password after first login!');

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

seedAdmin();
