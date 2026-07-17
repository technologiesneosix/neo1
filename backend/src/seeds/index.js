import "dotenv/config";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { seedAdmin } from "./admin.seed.js";
import { seedOriginalContent } from "./original-content.seed.js";

const seedAll = async () => {
  try {
    await connectDatabase();

    console.log("Starting database seeding with original content...");

    await seedAdmin();
    await seedOriginalContent();

    console.log("Database seeding completed successfully");

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    await disconnectDatabase();
    process.exit(1);
  }
};

seedAll();
