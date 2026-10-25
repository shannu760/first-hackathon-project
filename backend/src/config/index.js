import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  publicAppUrl: process.env.PUBLIC_APP_URL || 'http://localhost:5173',
  sessionSecret: process.env.SESSION_SECRET || 'saarathi-secure-session-secret-2026-production',
  sessionCookieName: 'saarathi_session',
  sessionMaxAgeMs: 7 * 24 * 60 * 60 * 1000, // 7 days

  db: {
    filePath: process.env.DB_PATH || path.resolve(__dirname, '../../saarathi.db'),
  },

  ai: {
    enabled: process.env.AI_ENABLED !== 'false',
    demoMode: process.env.AI_DEMO_MODE === 'true' || !process.env.OPENROUTER_API_KEY,
    apiKey: process.env.OPENROUTER_API_KEY || '',
    models: (process.env.AI_MODELS || 'openrouter/free,google/gemini-2.0-flash-thinking-exp:free,meta-llama/llama-3.3-70b-instruct:free').split(',').map(s => s.trim()).filter(Boolean),
    modelsJson: (process.env.AI_MODELS_JSON || 'google/gemini-2.0-flash-thinking-exp:free,meta-llama/llama-3.3-70b-instruct:free').split(',').map(s => s.trim()).filter(Boolean),
    timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '25000', 10),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1200', 10),
    userDailyLimit: parseInt(process.env.AI_USER_DAILY_LIMIT || '50', 10),
    appTitle: 'Saarathi - AI Student Career Companion',
  },

  scoring: {
    scholarship: {
      educationWeight: 25,
      marksWeight: 25,
      incomeWeight: 25,
      categoryWeight: 15,
      stateWeight: 10,
    },
    internship: {
      requiredSkillsWeight: 40,
      preferredSkillsWeight: 25,
      academicWeight: 20,
      roleAlignmentWeight: 15,
    },
  },
};
