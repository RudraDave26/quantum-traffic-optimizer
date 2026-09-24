import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { router as apiRouter } from './routes/apiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env if present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback to current dir .env

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(cors({
  origin: '*', // Allow local frontend during hackathon
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[Q-Route API] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// API routes
app.use('/api', apiRouter);

// Serve frontend build if dist exists
const FRONTEND_DIST = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
} else {
  // Root informational endpoint
  app.get('/', (req, res) => {
    res.json({
      project: 'Q-ROUTE: Quantum-Inspired Intelligent Traffic Route Optimization System',
      tagline: 'Smarter Routes. Less Traffic. Better Journeys.',
      status: 'Backend Running',
      documentation: '/api/health',
      endpoints: [
        'GET /api/health',
        'GET /api/corridors',
        'POST /api/routes/optimize',
        'POST /api/routes/calculate',
        'GET /api/traffic',
        'POST /api/traffic/simulate-change',
        'GET /api/history',
        'GET /api/analytics',
        'POST /api/feedback'
      ]
    });
  });
}

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    requestedUrl: req.originalUrl,
    message: 'Please refer to /api/health for system status and API list'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Q-Route Error]:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Q-ROUTE Backend Server Running on http://localhost:${PORT}`);
    console.log(`📡 Google Routes API Key: ${process.env.GOOGLE_ROUTES_API_KEY ? 'Configured' : 'Not Set (Using Demo Traffic Mode)'}`);
    console.log(`⚡ Quantum-Inspired Classical Optimization Engine: READY`);
    console.log(`=======================================================`);
  });
}

export default app;
