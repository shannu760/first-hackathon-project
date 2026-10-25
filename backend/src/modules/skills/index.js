import { Router } from 'express';
import { query } from '../../db/index.js';
import { authenticate } from '../../middleware/auth.js';
import { analyzeSkillGap } from '../engines/skillGapEngine.js';

const router = Router();

// GET /api/v1/skills
router.get('/', authenticate, (req, res) => {
  try {
    const studentSkills = query.all('SELECT * FROM student_skills WHERE student_id = ? ORDER BY skill_name ASC', req.user.id);
    const profile = query.get('SELECT * FROM student_profiles WHERE user_id = ? OR student_id = ?', req.user.id, req.user.id) || {};
    const careerGoals = query.get('SELECT * FROM student_career_goals WHERE student_id = ?', req.user.id) || {};

    const targetRole = careerGoals.target_roles_json 
      ? JSON.parse(careerGoals.target_roles_json)[0] 
      : (profile.target_role || 'Software Development Intern');

    let taxonomyRecord = query.get('SELECT * FROM skill_taxonomy WHERE role_name = ?', targetRole);
    if (!taxonomyRecord) {
      taxonomyRecord = query.get('SELECT * FROM skill_taxonomy LIMIT 1');
    }

    const taxonomy = taxonomyRecord ? {
      role_name: taxonomyRecord.role_name,
      required_skills: JSON.parse(taxonomyRecord.required_skills_json || '[]'),
      preferred_skills: JSON.parse(taxonomyRecord.preferred_skills_json || '[]'),
      core_concepts: JSON.parse(taxonomyRecord.core_concepts_json || '[]'),
      recommended_projects: JSON.parse(taxonomyRecord.recommended_projects_json || '[]')
    } : null;

    const skillNames = studentSkills.map(s => s.skill_name);
    const gapAnalysis = analyzeSkillGap(skillNames, targetRole, taxonomy);

    return res.json({
      success: true,
      skills: studentSkills,
      target_role: targetRole,
      gap_analysis: gapAnalysis,
      taxonomy
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/skills
router.post('/', authenticate, (req, res) => {
  try {
    const { skill_name, proficiency = 'Beginner', category = 'Technical' } = req.body;
    if (!skill_name || !skill_name.trim()) {
      return res.status(400).json({ success: false, error: 'Skill name is required' });
    }

    const name = skill_name.trim();
    const id = `skill-${req.user.id}-${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    query.run(`
      INSERT INTO student_skills (id, student_id, skill_name, proficiency, category, is_verified)
      VALUES (?, ?, ?, ?, ?, 0)
      ON CONFLICT(student_id, skill_name) DO UPDATE SET
        proficiency = excluded.proficiency,
        category = excluded.category
    `, id, req.user.id, name, proficiency, category);

    return res.json({
      success: true,
      message: 'Skill saved successfully',
      skill: { id, student_id: req.user.id, skill_name: name, proficiency, category }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/skills/:name
router.delete('/:name', authenticate, (req, res) => {
  try {
    query.run('DELETE FROM student_skills WHERE student_id = ? AND LOWER(skill_name) = LOWER(?)', req.user.id, req.params.name);
    return res.json({ success: true, message: 'Skill removed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/skills/taxonomy/:role
router.get('/taxonomy/:role', authenticate, (req, res) => {
  try {
    const role = decodeURIComponent(req.params.role);
    let taxonomy = query.get('SELECT * FROM skill_taxonomy WHERE LOWER(role_name) = LOWER(?)', role);
    if (!taxonomy) {
      taxonomy = query.get('SELECT * FROM skill_taxonomy LIMIT 1');
    }

    if (!taxonomy) {
      return res.status(404).json({ success: false, error: 'Taxonomy not found' });
    }

    return res.json({
      success: true,
      taxonomy: {
        role_name: taxonomy.role_name,
        required_skills: JSON.parse(taxonomy.required_skills_json || '[]'),
        preferred_skills: JSON.parse(taxonomy.preferred_skills_json || '[]'),
        core_concepts: JSON.parse(taxonomy.core_concepts_json || '[]'),
        recommended_projects: JSON.parse(taxonomy.recommended_projects_json || '[]')
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
