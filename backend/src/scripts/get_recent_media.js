import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import Media from '../models/Media.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function getRecentMedia() {
  try {
    await connectDatabase();
    
    const media = await Media.find().sort({ createdAt: -1 }).limit(5);
    console.log('Recent uploaded media documents:');
    console.log(JSON.stringify(media, null, 2));

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

getRecentMedia();
