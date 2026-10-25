import { query } from '../db/index.js';
import { config } from '../config/index.js';

export function requireAuth(req, res, next) {
  const sessionId = req.cookies?.[config.sessionCookieName] || req.headers['x-session-id'];

  if (!sessionId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in.',
      code: 'UNAUTHORIZED'
    });
  }

  const session = query.get(
    "SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')",
    sessionId
  );

  if (!session) {
    res.clearCookie(config.sessionCookieName);
    return res.status(401).json({
      success: false,
      error: 'Session expired or invalid. Please log in again.',
      code: 'SESSION_EXPIRED'
    });
  }

  const user = query.get(
    'SELECT id, email, full_name, phone, is_verified, role FROM users WHERE id = ?',
    session.user_id
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'User not found.',
      code: 'USER_NOT_FOUND'
    });
  }

  req.user = user;
  req.sessionId = sessionId;
  next();
}

export function optionalAuth(req, res, next) {
  const sessionId = req.cookies?.[config.sessionCookieName] || req.headers['x-session-id'];
  if (sessionId) {
    const session = query.get(
      "SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')",
      sessionId
    );
    if (session) {
      const user = query.get(
        'SELECT id, email, full_name, phone, is_verified, role FROM users WHERE id = ?',
        session.user_id
      );
      if (user) {
        req.user = user;
        req.sessionId = sessionId;
      }
    }
  }
  next();
}

export const authenticate = requireAuth;

