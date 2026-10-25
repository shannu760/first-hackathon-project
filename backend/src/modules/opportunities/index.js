import { Router } from 'express';
import { query } from '../../db/index.js';
import { optionalAuth, requireAuth } from '../../middleware/auth.js';
import { evaluateScholarshipEligibility } from '../engines/eligibilityEngine.js';
import crypto from 'node:crypto';

export const opportunitiesRouter = Router();

opportunitiesRouter.get('/', optionalAuth, (req, res) => {
  const { type, education_level, state, search, sort } = req.query;

  let sql = "SELECT * FROM opportunities WHERE status != 'archived'";
  const params = [];

  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }

  if (search) {
    sql += ' AND (title LIKE ? OR provider LIKE ? OR description LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  if (sort === 'deadline') {
    sql += ' ORDER BY deadline ASC';
  } else {
    sql += ' ORDER BY min_marks DESC';
  }

  const list = query.all(sql, ...params);

  let studentProfile = null;
  if (req.user) {
    studentProfile = query.get('SELECT * FROM student_profiles WHERE user_id = ? OR student_id = ?', req.user.id, req.user.id);
  }

  const mapped = list.map(opp => {
    const education_levels = JSON.parse(opp.education_levels_json || '[]');
    const categories = JSON.parse(opp.categories_json || '[]');
    const states = JSON.parse(opp.states_json || '[]');
    const required_documents = JSON.parse(opp.required_documents_json || '[]');
    const benefits = JSON.parse(opp.benefits_json || '[]');

    let eligibility = null;
    if (studentProfile) {
      eligibility = evaluateScholarshipEligibility(studentProfile, {
        ...opp,
        education_levels,
        categories,
        states,
        required_documents,
      });
    }

    return {
      ...opp,
      match_score: eligibility ? eligibility.match_score : null,
      eligibility_status: eligibility ? eligibility.eligibility_status : null,
      explanation_en: eligibility ? eligibility.explanation_en : null,
      explanation_te: eligibility ? eligibility.explanation_te : null,
      education_levels,
      categories,
      states,
      required_documents,
      benefits,
      eligibility,
    };
  });

  return res.json({ success: true, count: mapped.length, opportunities: mapped });
});

opportunitiesRouter.get('/:id', optionalAuth, (req, res) => {
  const opp = query.get('SELECT * FROM opportunities WHERE id = ?', req.params.id);
  if (!opp) {
    return res.status(404).json({ success: false, error: 'Opportunity not found.' });
  }

  const education_levels = JSON.parse(opp.education_levels_json || '[]');
  const categories = JSON.parse(opp.categories_json || '[]');
  const states = JSON.parse(opp.states_json || '[]');
  const required_documents = JSON.parse(opp.required_documents_json || '[]');
  const benefits = JSON.parse(opp.benefits_json || '[]');

  let eligibility = null;
  let isSaved = false;

  if (req.user) {
    const studentProfile = query.get('SELECT * FROM student_profiles WHERE user_id = ? OR student_id = ?', req.user.id, req.user.id);
    eligibility = evaluateScholarshipEligibility(studentProfile, {
      ...opp,
      education_levels,
      categories,
      states,
      required_documents,
    });

    const saved = query.get(
      'SELECT id FROM student_saved_opportunities WHERE student_id = ? AND opportunity_id = ?',
      req.user.id, opp.id
    );
    isSaved = !!saved;
  }

  return res.json({
    success: true,
    opportunity: {
      ...opp,
      education_levels,
      categories,
      states,
      required_documents,
      benefits,
      eligibility,
      is_saved: isSaved,
    }
  });
});

opportunitiesRouter.post('/:id/save', requireAuth, (req, res) => {
  const oppId = req.params.id;
  const existing = query.get(
    'SELECT id FROM student_saved_opportunities WHERE student_id = ? AND opportunity_id = ?',
    req.user.id, oppId
  );

  if (existing) {
    query.run('DELETE FROM student_saved_opportunities WHERE id = ?', existing.id);
    return res.json({ success: true, is_saved: false, message: 'Removed from saved opportunities.' });
  } else {
    query.run(
      'INSERT INTO student_saved_opportunities (id, student_id, opportunity_id, opportunity_type) VALUES (?, ?, ?, ?)',
      crypto.randomUUID(), req.user.id, oppId, 'scholarship'
    );
    return res.json({ success: true, is_saved: true, message: 'Opportunity saved successfully.' });
  }
});

export default opportunitiesRouter;

