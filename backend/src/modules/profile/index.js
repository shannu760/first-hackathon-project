import { Router } from 'express';
import crypto from 'crypto';
import { requireAuth } from '../../middleware/auth.js';
import { query } from '../../db/index.js';

export const profileRouter = Router();

profileRouter.get('/', requireAuth, (req, res) => {
  const profile = query.get('SELECT * FROM student_profiles WHERE user_id = ? OR student_id = ?', req.user.id, req.user.id);
  const skills = query.all('SELECT * FROM student_skills WHERE student_id = ?', req.user.id);
  const preferences = query.get('SELECT * FROM student_learning_preferences WHERE student_id = ?', req.user.id);
  const goals = query.get('SELECT * FROM student_career_goals WHERE student_id = ?', req.user.id);
  const academicRecords = query.all('SELECT * FROM student_academic_records WHERE student_id = ?', req.user.id);

  let completedFields = 0;
  const totalFields = 12;
  if (profile) {
    if (profile.full_name) completedFields++;
    if (profile.education_level) completedFields++;
    if (profile.institution) completedFields++;
    if (profile.course) completedFields++;
    if (profile.cgpa || profile.percentage) completedFields++;
    if (profile.state) completedFields++;
    if (profile.family_income_inr !== null && profile.family_income_inr !== undefined) completedFields++;
    if (profile.category) completedFields++;
    if (profile.target_role) completedFields++;
    if (profile.has_bank_account) completedFields++;
  }
  if (skills && skills.length > 0) completedFields++;
  if (goals && goals.target_roles_json) completedFields++;

  const completionPct = Math.round((completedFields / totalFields) * 100);

  return res.json({
    success: true,
    profile,
    skills,
    preferences,
    goals,
    academicRecords,
    completionPct,
  });
});

profileRouter.put('/', requireAuth, (req, res) => {
  const p = req.body;
  const userId = req.user.id;

  // Sync users table if full_name or phone is edited
  if (p.full_name || p.phone) {
    query.run(
      "UPDATE users SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone), updated_at = datetime('now') WHERE id = ?",
      p.full_name || null, p.phone || null, userId
    );
  }

  // Sync career goals if target_role is changed
  if (p.target_role) {
    const existingGoal = query.get('SELECT id FROM student_career_goals WHERE student_id = ?', userId);
    if (existingGoal) {
      query.run(
        "UPDATE student_career_goals SET target_roles_json = ?, updated_at = datetime('now') WHERE student_id = ?",
        JSON.stringify([p.target_role]), userId
      );
    } else {
      query.run(
        'INSERT INTO student_career_goals (id, student_id, target_roles_json) VALUES (?, ?, ?)',
        crypto.randomUUID(), userId, JSON.stringify([p.target_role])
      );
    }
  }

  query.run(`
    UPDATE student_profiles SET
      student_id = COALESCE(student_id, user_id),
      full_name = COALESCE(?, full_name),
      phone = COALESCE(?, phone),
      state = COALESCE(?, state),
      district = COALESCE(?, district),
      home_state = COALESCE(?, home_state),
      education_level = COALESCE(?, education_level),
      institution = COALESCE(?, institution),
      course = COALESCE(?, course),
      specialization = COALESCE(?, specialization),
      current_year = COALESCE(?, current_year),
      graduation_year = COALESCE(?, graduation_year),
      cgpa = COALESCE(?, cgpa),
      percentage = COALESCE(?, percentage),
      grading_scale = COALESCE(?, grading_scale),
      backlogs = COALESCE(?, backlogs),
      entrance_exam = COALESCE(?, entrance_exam),
      family_income_inr = COALESCE(?, family_income_inr),
      category = COALESCE(?, category),
      gender = COALESCE(?, gender),
      disability_status = COALESCE(?, disability_status),
      has_income_certificate = COALESCE(?, has_income_certificate),
      has_category_certificate = COALESCE(?, has_category_certificate),
      has_bank_account = COALESCE(?, has_bank_account),
      target_role = COALESCE(?, target_role),
      updated_at = datetime('now')
    WHERE user_id = ? OR student_id = ?
  `,
    p.full_name, p.phone, p.state, p.district, p.home_state,
    p.education_level, p.institution, p.course, p.specialization,
    p.current_year, p.graduation_year, p.cgpa, p.percentage,
    p.grading_scale, p.backlogs, p.entrance_exam,
    p.family_income_inr, p.category, p.gender, p.disability_status,
    p.has_income_certificate, p.has_category_certificate, p.has_bank_account,
    p.target_role, userId, userId
  );

  const updated = query.get('SELECT * FROM student_profiles WHERE user_id = ? OR student_id = ?', userId, userId);
  return res.json({ success: true, profile: updated });
});

profileRouter.get('/export', requireAuth, (req, res) => {
  const userId = req.user.id;
  const data = {
    user: query.get('SELECT id, email, full_name, phone, role, created_at FROM users WHERE id = ?', userId),
    profile: query.get('SELECT * FROM student_profiles WHERE user_id = ?', userId),
    skills: query.all('SELECT * FROM student_skills WHERE student_id = ?', userId),
    preferences: query.get('SELECT * FROM student_learning_preferences WHERE student_id = ?', userId),
    goals: query.get('SELECT * FROM student_career_goals WHERE student_id = ?', userId),
    applications: query.all('SELECT * FROM student_applications WHERE student_id = ?', userId),
    questionnaire: query.all('SELECT * FROM student_questionnaire_responses WHERE student_id = ?', userId),
    resumes: query.all('SELECT * FROM resumes WHERE student_id = ?', userId),
    consents: query.all('SELECT * FROM user_consents WHERE user_id = ?', userId),
    exported_at: new Date().toISOString(),
  };

  res.setHeader('Content-Disposition', `attachment; filename="saarathi_student_data_${userId}.json"`);
  res.setHeader('Content-Type', 'application/json');
  return res.send(JSON.stringify(data, null, 2));
});

profileRouter.delete('/account', requireAuth, (req, res) => {
  const userId = req.user.id;
  query.run('DELETE FROM users WHERE id = ?', userId);
  res.clearCookie('saarathi_session');
  return res.json({ success: true, message: 'Account and all associated records deleted permanently.' });
});

export default profileRouter;

