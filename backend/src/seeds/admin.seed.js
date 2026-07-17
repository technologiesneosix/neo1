import Admin from "../models/Admin.js";

export const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL || "admin@neosix.com",
    });

    if (existingAdmin) {
      console.log("Admin account already exists");
      return;
    }

    const admin = await Admin.create({
      name: process.env.ADMIN_NAME || "Super Admin",
      email: process.env.ADMIN_EMAIL || "admin@neosix.com",
      password: process.env.ADMIN_PASSWORD || "Admin@123456",
      phone: process.env.ADMIN_PHONE || null,
    });

    console.log("Admin account created successfully:");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || "Admin@123456"}`);
    console.log("\nPlease change the password after first login!");
  } catch (error) {
    console.error("Error seeding admin:", error);
    throw error;
  }
};
