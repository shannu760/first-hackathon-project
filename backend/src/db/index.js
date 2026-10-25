import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { config } from '../config/index.js';

const dbDir = path.dirname(config.db.filePath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(config.db.filePath);

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      is_verified INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      role TEXT DEFAULT 'student',
      preferred_language TEXT DEFAULT 'en',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      user_agent TEXT,
      ip_address TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS email_verification_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      used_at TEXT
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      used_at TEXT
    );

    CREATE TABLE IF NOT EXISTS student_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      student_id TEXT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      state TEXT,
      district TEXT,
      home_state TEXT,
      education_level TEXT,
      institution TEXT,
      course TEXT,
      specialization TEXT,
      current_year INTEGER,
      graduation_year INTEGER,
      cgpa REAL,
      percentage REAL,
      grading_scale TEXT DEFAULT '10',
      backlogs INTEGER DEFAULT 0,
      entrance_exam TEXT,
      family_income_inr REAL,
      category TEXT,
      gender TEXT,
      disability_status TEXT,
      has_income_certificate INTEGER DEFAULT 0,
      has_category_certificate INTEGER DEFAULT 0,
      has_bank_account INTEGER DEFAULT 1,
      target_role TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS student_academic_records (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      level TEXT NOT NULL,
      board_university TEXT,
      institution TEXT,
      year_of_passing INTEGER,
      score_type TEXT,
      score_value REAL,
      max_score REAL,
      documents_json TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS student_questionnaire_responses (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      section TEXT NOT NULL,
      responses_json TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(student_id, section)
    );

    CREATE TABLE IF NOT EXISTS student_skills (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      skill_name TEXT NOT NULL,
      proficiency TEXT DEFAULT 'Beginner',
      category TEXT DEFAULT 'Technical',
      is_verified INTEGER DEFAULT 0,
      UNIQUE(student_id, skill_name)
    );

    CREATE TABLE IF NOT EXISTS student_learning_preferences (
      id TEXT PRIMARY KEY,
      student_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      daily_time_minutes INTEGER DEFAULT 60,
      budget_inr REAL DEFAULT 0,
      preferred_format TEXT DEFAULT 'mixture',
      learning_language TEXT DEFAULT 'both',
      pace TEXT DEFAULT 'moderate',
      certificate_preference TEXT DEFAULT 'both',
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS student_career_goals (
      id TEXT PRIMARY KEY,
      student_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      target_roles_json TEXT DEFAULT '["Software Development Intern"]',
      internship_mode TEXT DEFAULT 'hybrid',
      min_stipend_inr REAL DEFAULT 0,
      preferred_locations_json TEXT DEFAULT '["Remote", "Hyderabad", "Bangalore"]',
      start_timeline TEXT DEFAULT 'immediately',
      experience_level TEXT DEFAULT 'Student',
      portfolio_url TEXT,
      github_url TEXT,
      linkedin_url TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS student_course_progress (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id TEXT NOT NULL,
      status TEXT DEFAULT 'in_progress',
      progress_pct INTEGER DEFAULT 0,
      completed_at TEXT,
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(student_id, course_id)
    );

    CREATE TABLE IF NOT EXISTS student_projects (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      skills_json TEXT DEFAULT '[]',
      github_url TEXT,
      live_url TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS student_applications (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      opportunity_id TEXT,
      opportunity_type TEXT NOT NULL,
      role_title TEXT NOT NULL,
      company_or_provider TEXT NOT NULL,
      status TEXT DEFAULT 'To Apply',
      deadline TEXT,
      notes TEXT,
      official_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(student_id, opportunity_id, role_title)
    );

    CREATE TABLE IF NOT EXISTS student_saved_opportunities (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      opportunity_id TEXT NOT NULL,
      opportunity_type TEXT NOT NULL,
      saved_at TEXT DEFAULT (datetime('now')),
      UNIQUE(student_id, opportunity_id)
    );

    CREATE TABLE IF NOT EXISTS student_recommendations (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      opportunity_id TEXT NOT NULL,
      opportunity_type TEXT NOT NULL,
      match_score INTEGER NOT NULL,
      eligibility_status TEXT NOT NULL,
      passed_criteria_json TEXT DEFAULT '[]',
      failed_criteria_json TEXT DEFAULT '[]',
      missing_criteria_json TEXT DEFAULT '[]',
      explanation_en TEXT,
      explanation_te TEXT,
      dismissed INTEGER DEFAULT 0,
      not_relevant INTEGER DEFAULT 0,
      calculated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(student_id, opportunity_id)
    );

    CREATE TABLE IF NOT EXISTS recommendation_events (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      opportunity_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      metadata_json TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      action_url TEXT,
      deadline TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notification_preferences (
      id TEXT PRIMARY KEY,
      student_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      deadlines_opt_in INTEGER DEFAULT 1,
      weekly_summary_opt_in INTEGER DEFAULT 1,
      schemes_opt_in INTEGER DEFAULT 1,
      internships_opt_in INTEGER DEFAULT 1,
      email_opt_in INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS preparation_plans (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      target_role TEXT NOT NULL,
      duration_days INTEGER NOT NULL,
      title TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      progress_pct INTEGER DEFAULT 0,
      plan_data_json TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS preparation_tasks (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL REFERENCES preparation_plans(id) ON DELETE CASCADE,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      day_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'Study',
      is_completed INTEGER DEFAULT 0,
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT DEFAULT 'Primary Resume',
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      location TEXT,
      target_role TEXT,
      summary TEXT,
      education_json TEXT DEFAULT '[]',
      skills_json TEXT DEFAULT '[]',
      projects_json TEXT DEFAULT '[]',
      experience_json TEXT DEFAULT '[]',
      certifications_json TEXT DEFAULT '[]',
      ats_score INTEGER DEFAULT 75,
      ats_feedback_json TEXT DEFAULT '[]',
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      student_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan_name TEXT DEFAULT 'Free',
      status TEXT DEFAULT 'active',
      starts_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_consents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      consent_type TEXT NOT NULL,
      granted INTEGER NOT NULL,
      ip_address TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_events (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      details_json TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ai_conversations (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT DEFAULT 'Career Chat',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ai_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      citations_json TEXT DEFAULT '[]',
      model_name TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ai_usage (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      feature TEXT NOT NULL,
      model_name TEXT,
      tokens_used INTEGER DEFAULT 0,
      latency_ms INTEGER DEFAULT 0,
      status TEXT DEFAULT 'success',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ai_cache (
      id TEXT PRIMARY KEY,
      cache_key TEXT UNIQUE NOT NULL,
      prompt_hash TEXT NOT NULL,
      response_json TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS opportunities (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      provider TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      education_levels_json TEXT NOT NULL DEFAULT '["UG", "PG"]',
      min_marks REAL DEFAULT 0,
      max_income_inr REAL,
      categories_json TEXT DEFAULT '["All"]',
      states_json TEXT DEFAULT '["All India"]',
      gender_criteria TEXT DEFAULT 'All',
      disability_criteria TEXT DEFAULT 'All',
      required_documents_json TEXT NOT NULL DEFAULT '[]',
      benefits_json TEXT NOT NULL DEFAULT '[]',
      opening_date TEXT,
      deadline TEXT,
      official_url TEXT NOT NULL,
      source_url TEXT NOT NULL,
      last_verified_at TEXT NOT NULL,
      data_confidence TEXT DEFAULT 'High',
      status TEXT DEFAULT 'active',
      rules_version TEXT DEFAULT '2026.1',
      is_demo INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS internships (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      work_mode TEXT NOT NULL,
      location TEXT NOT NULL,
      stipend_inr REAL DEFAULT 0,
      stipend_text TEXT,
      duration_months INTEGER DEFAULT 3,
      required_skills_json TEXT NOT NULL DEFAULT '[]',
      preferred_skills_json TEXT DEFAULT '[]',
      min_cgpa REAL DEFAULT 0,
      openings INTEGER DEFAULT 1,
      deadline TEXT,
      official_url TEXT NOT NULL,
      source_url TEXT NOT NULL,
      last_verified_at TEXT NOT NULL,
      is_demo INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      provider TEXT NOT NULL,
      official_url TEXT NOT NULL,
      price_inr REAL DEFAULT 0,
      is_free INTEGER DEFAULT 1,
      language TEXT DEFAULT 'English',
      level TEXT DEFAULT 'Beginner',
      skills_json TEXT NOT NULL DEFAULT '[]',
      duration_hours INTEGER DEFAULT 20,
      certificate_available INTEGER DEFAULT 1,
      description TEXT,
      learning_path_order INTEGER DEFAULT 1,
      target_role TEXT,
      last_verified_at TEXT NOT NULL,
      is_demo INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS skill_taxonomy (
      id TEXT PRIMARY KEY,
      role_name TEXT UNIQUE NOT NULL,
      required_skills_json TEXT NOT NULL,
      preferred_skills_json TEXT NOT NULL,
      core_concepts_json TEXT NOT NULL,
      recommended_projects_json TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_recommendations_student ON student_recommendations(student_id);
    CREATE INDEX IF NOT EXISTS idx_applications_student ON student_applications(student_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_student ON notifications(student_id);
    CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);
    CREATE INDEX IF NOT EXISTS idx_internships_deadline ON internships(deadline);
  `);
}

export const query = {
  get(sql, ...params) {
    const cleanParams = params.map(p => (p === undefined ? null : p));
    const stmt = db.prepare(sql);
    return stmt.get(...cleanParams);
  },
  all(sql, ...params) {
    const cleanParams = params.map(p => (p === undefined ? null : p));
    const stmt = db.prepare(sql);
    return stmt.all(...cleanParams);
  },
  run(sql, ...params) {
    const cleanParams = params.map(p => (p === undefined ? null : p));
    const stmt = db.prepare(sql);
    return stmt.run(...cleanParams);
  },
  exec(sql) {
    return db.exec(sql);
  }
};

export const initDatabase = initSchema;

