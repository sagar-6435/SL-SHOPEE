import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load env first
dotenv.config();

// Import MongoDB connection
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import superAdminRoutes from './routes/super-admin.js';
import auditRoutes from './routes/audit.js';
import whatsappRoutes from './routes/whatsapp.js';
import smsRoutes from './routes/sms.js';
import designRoutes from './routes/designs.js';
import notificationRoutes from './routes/notifications.js';
import reviewRoutes from './routes/reviews.js';
import branchRoutes from './routes/branches.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Trust proxy (Render / reverse proxies)
app.set('trust proxy', 1);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const designsDir = path.join(__dirname, 'uploads', 'designs');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(designsDir)) fs.mkdirSync(designsDir, { recursive: true });

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: 'Too many requests from this IP, please try again later.',
});
if (process.env.NODE_ENV === 'production') {
  app.use('/api/', limiter);
}

// CORS configuration — always allow production domains + any FRONTEND_URL env var
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://slshopee.vercel.app',
  'https://www.slshopee.vercel.app',
  'https://sl-shopee.onrender.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // In development allow everything; in production only allowed origins
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// Handle pre-flight requests for all routes
app.options('*', cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else if (process.env.NODE_ENV === 'production') app.use(morgan('combined'));

// Static files — uploads
app.use('/uploads', express.static(uploadsDir));

// ─── Frontend path ────────────────────────────────────────────────────────────
// Try multiple known locations in order — first one that exists wins
// Guard against malformed FRONTEND_PATH like "FRONTEND_PATH=/some/path"
const rawFrontendPath = process.env.FRONTEND_PATH || '';
const cleanFrontendPath = rawFrontendPath.includes('=')
  ? rawFrontendPath.split('=').slice(1).join('=').trim()
  : rawFrontendPath.trim();

const candidatePaths = [
  cleanFrontendPath ? path.resolve(cleanFrontendPath) : null,
  path.join(__dirname, 'public'),
  path.resolve('/home/u327292494/domains/slshopee.vercel.app/nodejs/public'),
  path.resolve('/home/u327292494/domains/slshopee.vercel.app/public_html'),
].filter(Boolean);

const frontendPath = candidatePaths.find(p => fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html')));

if (frontendPath) {
  console.log(`[frontend] Serving static files from: ${frontendPath}`);
  app.use(express.static(frontendPath));
} else {
  console.warn(`[frontend] No static files found in any candidate path:`, candidatePaths);
}

// Health check
app.get('/health', async (req, res) => {
  const mongoose = await import('mongoose');
  const dbState = mongoose.default.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';

  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// API routes — must come before the React catch-all
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/products/:productId/reviews', reviewRoutes);

app.use('/api/branches', branchRoutes);
// React catch-all — serves index.html for every non-API route so React Router works
app.get('*', (req, res) => {
  const indexPath = frontendPath ? path.join(frontendPath, 'index.html') : null;
  if (indexPath && fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).json({
      message: 'SL SHOPEE API',
      version: '2.0.0',
      note: 'Frontend is being deployed. Please refresh in a moment.',
    });
  }
});

// Error handling (notFound removed — catch-all above handles unknown routes)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(
    `[${new Date().toISOString()}] SL SHOPEE API listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`
  );
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received: closing HTTP server`);
  server.close(async () => {
    console.log('HTTP server closed');
    const mongoose = await import('mongoose');
    await mongoose.default.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
