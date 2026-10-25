import { Router } from 'express';
import { query } from '../../db/index.js';
import { authenticate } from '../../middleware/auth.js';
import { evaluateInternshipFit } from '../engines/internshipFitEngine.js';

const router = Router();

// GET /api/v1/internships
router.get('/', authenticate, (req, res) => {
  try {
    const { work_mode, search, min_stipend } = req.query;
    let sql = 'SELECT * FROM internships WHERE 1=1';
    const params = [];

    if (work_mode && work_mode !== 'all') {
      sql += ' AND LOWER(work_mode) = LOWER(?)';
      params.push(work_mode);
    }

    if (search) {
      sql += ' AND (LOWER(title) LIKE LOWER(?) OR LOWER(company) LIKE LOWER(?) OR LOWER(location) LIKE LOWER(?))';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (min_stipend) {
      sql += ' AND stipend_inr >= ?';
      params.push(Number(min_stipend));
    }

    sql += ' ORDER BY deadline ASC';
    const internships = query.all(sql, ...params);

    // Fetch student profile & skills for fit calculation
    const profile = query.get('SELECT * FROM student_profiles WHERE user_id = ? OR student_id = ?', req.user.id, req.user.id) || {};
    const careerGoals = query.get('SELECT * FROM student_career_goals WHERE student_id = ?', req.user.id) || {};
    const studentSkills = query.all('SELECT skill_name FROM student_skills WHERE student_id = ?', req.user.id).map(s => s.skill_name);

    const fullProfile = {
      ...profile,
      target_role: careerGoals.target_roles_json ? JSON.parse(careerGoals.target_roles_json)[0] : profile.target_role,
      internship_mode: careerGoals.internship_mode,
      skills: studentSkills
    };

    const evaluated = internships.map(intern => {
      const fit = evaluateInternshipFit(fullProfile, intern);
      return {
        ...intern,
        fit_score: fit.fit_score,
        matched_skills: fit.matched_skills,
        missing_skills: fit.missing_skills,
        recommended_action: fit.recommended_action,
        explanation_en: fit.explanation_en,
        explanation_te: fit.explanation_te,
        required_skills: JSON.parse(intern.required_skills_json || '[]'),
        preferred_skills: JSON.parse(intern.preferred_skills_json || '[]'),
        fit
      };
    });

    return res.json({
      success: true,
      count: evaluated.length,
      internships: evaluated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/internships/:id
router.get('/:id', authenticate, (req, res) => {
  try {
    const internship = query.get('SELECT * FROM internships WHERE id = ?', req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, error: 'Internship not found' });
    }

    const profile = query.get('SELECT * FROM student_profiles WHERE user_id = ? OR student_id = ?', req.user.id, req.user.id) || {};
    const careerGoals = query.get('SELECT * FROM student_career_goals WHERE student_id = ?', req.user.id) || {};
    const studentSkills = query.all('SELECT skill_name FROM student_skills WHERE student_id = ?', req.user.id).map(s => s.skill_name);

    const fullProfile = {
      ...profile,
      target_role: careerGoals.target_roles_json ? JSON.parse(careerGoals.target_roles_json)[0] : profile.target_role,
      internship_mode: careerGoals.internship_mode,
      skills: studentSkills
    };

    const fit = evaluateInternshipFit(fullProfile, internship);

    return res.json({
      success: true,
      internship: {
        ...internship,
        fit_score: fit.fit_score,
        matched_skills: fit.matched_skills,
        missing_skills: fit.missing_skills,
        recommended_action: fit.recommended_action,
        explanation_en: fit.explanation_en,
        explanation_te: fit.explanation_te,
        required_skills: JSON.parse(internship.required_skills_json || '[]'),
        preferred_skills: JSON.parse(internship.preferred_skills_json || '[]'),
        fit
      }
    });

    return res.json({
      success: true,
      internship: {
        ...internship,
        required_skills: JSON.parse(internship.required_skills_json || '[]'),
        preferred_skills: JSON.parse(internship.preferred_skills_json || '[]'),
        fit
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/internships/:id/save
router.post('/:id/save', authenticate, (req, res) => {
  try {
    const internship = query.get('SELECT * FROM internships WHERE id = ?', req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, error: 'Internship not found' });
    }

    query.run(`
      INSERT INTO student_saved_opportunities (student_id, opportunity_id, opportunity_type)
      VALUES (?, ?, 'internship')
      ON CONFLICT(student_id, opportunity_id) DO NOTHING
    `, req.user.id, req.params.id);

    return res.json({ success: true, message: 'Internship saved to your bookmarks' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
