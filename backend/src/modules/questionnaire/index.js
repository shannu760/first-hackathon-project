import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { query } from '../../db/index.js';
import crypto from 'node:crypto';

export const questionnaireRouter = Router();

questionnaireRouter.get('/', requireAuth, (req, res) => {
  const responses = query.all(
    'SELECT section, responses_json, updated_at FROM student_questionnaire_responses WHERE student_id = ?',
    req.user.id
  );

  const parsed = {};
  for (const r of responses) {
    try {
      parsed[r.section] = JSON.parse(r.responses_json);
    } catch (e) {
      parsed[r.section] = {};
    }
  }

  return res.json({ success: true, responses: parsed });
});

questionnaireRouter.post('/autosave', requireAuth, (req, res) => {
  const { section, data } = req.body;
  const userId = req.user.id;

  if (!section || !data) {
    return res.status(400).json({ success: false, error: 'Section name and data are required.' });
  }

  const jsonStr = JSON.stringify(data);

  query.run(`
    INSERT INTO student_questionnaire_responses (id, student_id, section, responses_json, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT(student_id, section) DO UPDATE SET
      responses_json = excluded.responses_json,
      updated_at = datetime('now')
  `, crypto.randomUUID(), userId, section, jsonStr);

  if (section === 'A') {
    query.run(`
      UPDATE student_profiles SET
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
        state = COALESCE(?, state),
        district = COALESCE(?, district),
        home_state = COALESCE(?, home_state),
        updated_at = datetime('now')
      WHERE user_id = ?
    `,
      data.education_level || null,
      data.institution || null,
      data.course || null,
      data.specialization || null,
      data.current_year ? parseInt(data.current_year, 10) : null,
      data.graduation_year ? parseInt(data.graduation_year, 10) : null,
      data.cgpa ? parseFloat(data.cgpa) : null,
      data.percentage ? parseFloat(data.percentage) : null,
      data.grading_scale || '10',
      data.backlogs !== undefined && data.backlogs !== '' ? parseInt(data.backlogs, 10) : 0,
      data.entrance_exam || null,
      data.state || null,
      data.district || null,
      data.home_state || data.state || null,
      userId
    );
  } else if (section === 'B') {
    query.run(`
      UPDATE student_profiles SET
        family_income_inr = COALESCE(?, family_income_inr),
        category = COALESCE(?, category),
        gender = COALESCE(?, gender),
        disability_status = COALESCE(?, disability_status),
        has_income_certificate = COALESCE(?, has_income_certificate),
        has_category_certificate = COALESCE(?, has_category_certificate),
        has_bank_account = COALESCE(?, has_bank_account),
        updated_at = datetime('now')
      WHERE user_id = ?
    `,
      data.family_income_inr ? parseFloat(data.family_income_inr) : null,
      data.category || null,
      data.gender || null,
      data.disability_status || null,
      data.has_income_certificate ? 1 : 0,
      data.has_category_certificate ? 1 : 0,
      data.has_bank_account ? 1 : 0,
      userId
    );
  } else if (section === 'C') {
    if (data.target_roles) {
      const primaryRole = Array.isArray(data.target_roles) ? data.target_roles[0] : data.target_roles;
      query.run('UPDATE student_profiles SET target_role = ? WHERE user_id = ?', primaryRole, userId);
    }

    query.run(`
      INSERT INTO student_career_goals (
        id, student_id, target_roles_json, internship_mode, min_stipend_inr,
        preferred_locations_json, start_timeline, experience_level, github_url, linkedin_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(student_id) DO UPDATE SET
        target_roles_json = excluded.target_roles_json,
        internship_mode = excluded.internship_mode,
        min_stipend_inr = excluded.min_stipend_inr,
        preferred_locations_json = excluded.preferred_locations_json,
        start_timeline = excluded.start_timeline,
        experience_level = excluded.experience_level,
        github_url = excluded.github_url,
        linkedin_url = excluded.linkedin_url,
        updated_at = datetime('now')
    `,
      crypto.randomUUID(), userId,
      JSON.stringify(data.target_roles || ['Software Development Intern']),
      data.internship_mode || 'hybrid',
      data.min_stipend_inr ? parseFloat(data.min_stipend_inr) : 0,
      JSON.stringify(data.preferred_locations || ['Remote']),
      data.start_timeline || 'immediately',
      data.experience_level || 'Student',
      data.github_url || null,
      data.linkedin_url || null
    );
  } else if (section === 'D') {
    if (Array.isArray(data.skills)) {
      for (const sk of data.skills) {
        const skillName = typeof sk === 'string' ? sk : sk.name;
        const prof = typeof sk === 'object' && sk.proficiency ? sk.proficiency : 'Intermediate';
        query.run(`
          INSERT INTO student_skills (id, student_id, skill_name, proficiency)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(student_id, skill_name) DO UPDATE SET proficiency = excluded.proficiency
        `, crypto.randomUUID(), userId, skillName, prof);
      }
    }

    query.run(`
      INSERT INTO student_learning_preferences (
        id, student_id, daily_time_minutes, budget_inr, preferred_format,
        learning_language, pace, certificate_preference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(student_id) DO UPDATE SET
        daily_time_minutes = excluded.daily_time_minutes,
        budget_inr = excluded.budget_inr,
        preferred_format = excluded.preferred_format,
        learning_language = excluded.learning_language,
        pace = excluded.pace,
        certificate_preference = excluded.certificate_preference,
        updated_at = datetime('now')
    `,
      crypto.randomUUID(), userId,
      data.daily_time_minutes ? parseInt(data.daily_time_minutes, 10) : 60,
      data.budget_inr ? parseFloat(data.budget_inr) : 0,
      data.preferred_format || 'mixture',
      data.learning_language || 'both',
      data.pace || 'moderate',
      data.certificate_preference || 'both'
    );
  }

  return res.json({
    success: true,
    message: `Section ${section} saved and synced successfully.`,
    savedAt: new Date().toISOString()
  });
});

export default questionnaireRouter;

