import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sl-shopee";

export default async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ MongoDB connected:", MONGODB_URI);
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        console.log("⚠️ Continuing without DB connection for now...");
    }
}
