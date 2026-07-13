import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Route imports
import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";
import ordersRouter from "./routes/orders.js";
import customersRouter from "./routes/customers.js";
import galleryRouter from "./routes/gallery.js";
import campaignsRouter from "./routes/campaigns.js";
import notificationsRouter from "./routes/notifications.js";
import analyticsRouter from "./routes/analytics.js";

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ["https://slshopee.vercel.app", "http://localhost:8081", "http://localhost:5173", "http://localhost:5000"] }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/customers", customersRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/campaigns", campaignsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/analytics", analyticsRouter);

// Global error handler
app.use((err, _req, res, _next) => {
    console.error("❌ Unhandled error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
});

// Start server
async function start() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 SL SHOPEE Backend running on http://localhost:${PORT}`);
        console.log(`📋 API endpoints:`);
        console.log(`   GET  /api/health`);
        console.log(`   CRUD /api/products`);
        console.log(`   CRUD /api/categories`);
        console.log(`   CRUD /api/orders`);
        console.log(`   CRUD /api/customers`);
        console.log(`   CRUD /api/gallery`);
        console.log(`   CRUD /api/campaigns`);
        console.log(`   CRUD /api/notifications`);
        console.log(`   GET  /api/analytics/dashboard`);
    });
}

start();
