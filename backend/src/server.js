import { app } from './app.js';
import { config } from './config/index.js';
import { initDatabase } from './db/index.js';

const PORT = config.PORT || 5000;

try {
  // Ensure database tables exist
  initDatabase();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`
========================================================================
   ____                                 __   __    _ 
  / __/ ___ _ ___ _  ____ ___ _  ___   / /_ / /   (_)
 _\\ \\  / _ \`/ / _ \`/ / __// _ \`/ / _ \\ / __// _ \\ / / 
/___/  \\_,_/  \\_,_/ /_/   \\_,_/ /_//_/ \\__//_//_//_/  
   Your Guide from Eligibility to Employment (2026.1)
========================================================================
- API Server:           http://localhost:${PORT}/api/v1/health
- Web Application:      http://localhost:${PORT}/
- Database:             Node 24 Native SQLite (saarathi.db)
- Security:             Argon2id (Node-RS) + Strict CORS & HTTP-Only
- Environment:          ${config.NODE_ENV}
========================================================================
`);
  });

  const shutdown = (signal) => {
    console.log(`\nReceived ${signal}. Gracefully shutting down Saarathi server...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

} catch (err) {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
}
