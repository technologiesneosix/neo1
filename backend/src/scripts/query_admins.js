import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import Admin from "../models/Admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

async function listAdmins() {
  try {
    await connectDatabase();
    const admins = await Admin.find({});
    console.log("--- Admins in database ---");
    admins.forEach((admin) => {
      console.log(
        `Name: ${admin.name}, Email: ${admin.email}, isActive: ${admin.isActive}`,
      );
    });
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

listAdmins();
