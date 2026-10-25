import { Router } from 'express';
import { hash, verify, Algorithm } from '@node-rs/argon2';
import crypto from 'node:crypto';
import { query } from '../../db/index.js';
import { config } from '../../config/index.js';
import { requireAuth } from '../../middleware/auth.js';

export const authRouter = Router();

function createSession(userId, req, res) {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + config.sessionMaxAgeMs).toISOString();
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const ipAddress = req.ip || req.connection.remoteAddress || '127.0.0.1';

  query.run(
    'INSERT INTO sessions (id, user_id, expires_at, user_agent, ip_address) VALUES (?, ?, ?, ?, ?)',
    sessionId, userId, expiresAt, userAgent, ipAddress
  );

  res.cookie(config.sessionCookieName, sessionId, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
    maxAge: config.sessionMaxAgeMs,
    path: '/',
  });

  return sessionId;
}

authRouter.post('/signup', async (req, res) => {
  try {
    const { email, password, full_name, phone, consent_terms, consent_privacy } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, error: 'Full name, email, and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = query.get('SELECT id FROM users WHERE email = ?', normalizedEmail);
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    const passwordHash = await hash(password, { algorithm: Algorithm.Argon2id });
    const userId = crypto.randomUUID();

    query.run(
      'INSERT INTO users (id, email, password_hash, full_name, phone, is_verified, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      userId, normalizedEmail, passwordHash, full_name.trim(), phone || null, 0, 'student'
    );

    const ip = req.ip || '127.0.0.1';
    if (consent_terms) {
      query.run('INSERT INTO user_consents (id, user_id, consent_type, granted, ip_address) VALUES (?, ?, ?, ?, ?)',
        crypto.randomUUID(), userId, 'terms_of_service', 1, ip);
    }
    if (consent_privacy) {
      query.run('INSERT INTO user_consents (id, user_id, consent_type, granted, ip_address) VALUES (?, ?, ?, ?, ?)',
        crypto.randomUUID(), userId, 'privacy_policy', 1, ip);
    }

    query.run(`
      INSERT INTO student_profiles (id, user_id, student_id, full_name, email, phone, state, education_level, target_role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, crypto.randomUUID(), userId, userId, full_name.trim(), normalizedEmail, phone || null, 'Telangana', 'UG', 'Software Development Intern');

    query.run('INSERT INTO notification_preferences (id, student_id) VALUES (?, ?)', crypto.randomUUID(), userId);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    query.run(
      'INSERT INTO email_verification_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)',
      crypto.randomUUID(), userId, tokenHash, expiresAt
    );

    const sessionId = createSession(userId, req, res);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. A verification link has been sent to your email.',
      user: {
        id: userId,
        email: normalizedEmail,
        full_name: full_name.trim(),
        phone: phone || null,
        is_verified: 0,
        role: 'student',
      },
      sessionId,
      devVerificationToken: verificationToken,
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during registration.' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = query.get('SELECT * FROM users WHERE email = ?', normalizedEmail);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isValid = await verify(user.password_hash, password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const sessionId = createSession(user.id, req, res);
    const profile = query.get('SELECT * FROM student_profiles WHERE user_id = ?', user.id);

    return res.json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        is_verified: user.is_verified,
        role: user.role,
      },
      profile: profile || null,
      sessionId,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during login.' });
  }
});

authRouter.post('/logout', requireAuth, (req, res) => {
  query.run('DELETE FROM sessions WHERE id = ?', req.sessionId);
  res.clearCookie(config.sessionCookieName);
  return res.json({ success: true, message: 'Logged out successfully.' });
});

authRouter.post('/logout-all', requireAuth, (req, res) => {
  query.run('DELETE FROM sessions WHERE user_id = ?', req.user.id);
  res.clearCookie(config.sessionCookieName);
  return res.json({ success: true, message: 'Logged out from all sessions.' });
});

authRouter.get('/me', requireAuth, (req, res) => {
  const profile = query.get('SELECT * FROM student_profiles WHERE user_id = ?', req.user.id);
  const skills = query.all('SELECT skill_name, proficiency, category FROM student_skills WHERE student_id = ?', req.user.id);
  const preferences = query.get('SELECT * FROM student_learning_preferences WHERE student_id = ?', req.user.id);
  const goals = query.get('SELECT * FROM student_career_goals WHERE student_id = ?', req.user.id);

  return res.json({
    success: true,
    user: req.user,
    profile: profile || null,
    skills: skills || [],
    preferences: preferences || null,
    goals: goals || null,
  });
});

authRouter.post('/verify-email', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, error: 'Verification token is required.' });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const record = query.get(
    "SELECT * FROM email_verification_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > datetime('now')",
    tokenHash
  );

  if (!record) {
    return res.status(400).json({ success: false, error: 'Invalid or expired verification token.' });
  }

  query.run('UPDATE users SET is_verified = 1 WHERE id = ?', record.user_id);
  query.run("UPDATE email_verification_tokens SET used_at = datetime('now') WHERE id = ?", record.id);

  return res.json({ success: true, message: 'Email address verified successfully!' });
});

export default authRouter;

