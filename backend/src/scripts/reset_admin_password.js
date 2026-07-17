import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import Admin from "../models/Admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

async function resetPasswords() {
  try {
    await connectDatabase();

    // 1. Reset admin@neosix.com
    const admin1 = await Admin.findOne({ email: "admin@neosix.com" });
    if (admin1) {
      admin1.password = "Admin@123456";
      await admin1.save();
      console.log("✅ Password reset for admin@neosix.com to Admin@123456");
    }

    // 2. Reset technologiesneosix@gmail.com
    const admin2 = await Admin.findOne({
      email: "technologiesneosix@gmail.com",
    });
    if (admin2) {
      admin2.password = "NeoSix@12";
      await admin2.save();
      console.log(
        "✅ Password reset for technologiesneosix@gmail.com to NeoSix@12",
      );
    } else {
      // Create it if it doesn't exist
      await Admin.create({
        name: "Super Admin",
        email: "technologiesneosix@gmail.com",
        password: "NeoSix@12",
        isActive: true,
      });
      console.log(
        "✅ Created technologiesneosix@gmail.com with password NeoSix@12",
      );
    }

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

resetPasswords();
