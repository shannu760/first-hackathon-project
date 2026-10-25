import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import authRouter from './modules/auth/index.js';
import profileRouter from './modules/profile/index.js';
import questionnaireRouter from './modules/questionnaire/index.js';
import opportunitiesRouter from './modules/opportunities/index.js';
import internshipsRouter from './modules/internships/index.js';
import coursesRouter from './modules/courses/index.js';
import skillsRouter from './modules/skills/index.js';
import recommendationsRouter from './modules/recommendations/index.js';
import copilotRouter from './modules/copilot/index.js';
import resumeRouter from './modules/resume/index.js';
import applicationsRouter from './modules/applications/index.js';
import notificationsRouter from './modules/notifications/index.js';
import aiRouter from './modules/ai/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

export const app = express();

// Security and utility middleware
app.use(cors({
  origin: (origin, callback) => callback(null, true), // Allow all origins in dev & test with credentials
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'saarathi-backend',
    timestamp: new Date().toISOString(),
    version: '2026.1'
  });
});

// Download Presentation PPTX Endpoint
app.get('/api/v1/presentation/download', (req, res) => {
  const pptxPath = path.resolve(__dirname, '../../Saarathi_Pitch_Presentation.pptx');
  if (fs.existsSync(pptxPath)) {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', 'attachment; filename="Saarathi_Pitch_Presentation.pptx"');
    return res.sendFile(pptxPath);
  }
  return res.status(404).json({ error: 'Presentation file not found' });
});

// Mount API Modules
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/questionnaire', questionnaireRouter);
app.use('/api/v1/opportunities', opportunitiesRouter);
app.use('/api/v1/internships', internshipsRouter);
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/skills', skillsRouter);
app.use('/api/v1/recommendations', recommendationsRouter);
app.use('/api/v1/copilot', copilotRouter);
app.use('/api/v1/resume', resumeRouter);
app.use('/api/v1/applications', applicationsRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/ai', aiRouter);

// Serve Frontend Static Assets if built
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

// Single Page Application Fallback for client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }

  const indexPath = path.join(frontendDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  // Resilient fallback HTML for test environments before frontend build
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Saarathi - Your Guide from Eligibility to Employment</title>
</head>
<body style="background:#0B0F19;color:#F8FAFC;">
  <div id="root">Saarathi Student Career Companion</div>
</body>
</html>`);
});
