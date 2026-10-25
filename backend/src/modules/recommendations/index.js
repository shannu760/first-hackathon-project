import { Router } from 'express';
import { query } from '../../db/index.js';
import { authenticate } from '../../middleware/auth.js';
import { evaluateScholarshipEligibility } from '../engines/eligibilityEngine.js';
import { evaluateInternshipFit } from '../engines/internshipFitEngine.js';
import { analyzeSkillGap } from '../engines/skillGapEngine.js';
import { recommendCourses } from '../engines/courseRecommenderEngine.js';

const router = Router();

// GET /api/v1/recommendations
router.get('/', authenticate, (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Fetch student context
    const profile = query.get('SELECT * FROM student_profiles WHERE user_id = ? OR student_id = ?', studentId, studentId) || {};
    const careerGoals = query.get('SELECT * FROM student_career_goals WHERE student_id = ?', studentId) || {};
    const learningPrefs = query.get('SELECT * FROM student_learning_preferences WHERE student_id = ?', studentId) || {};
    const studentSkills = query.all('SELECT skill_name FROM student_skills WHERE student_id = ?', studentId).map(s => s.skill_name);

    const targetRole = careerGoals.target_roles_json 
      ? JSON.parse(careerGoals.target_roles_json)[0] 
      : (profile.target_role || 'Software Development Intern');

    const fullProfile = {
      ...profile,
      target_role: targetRole,
      internship_mode: careerGoals.internship_mode,
      skills: studentSkills
    };

    // 2. Skill Gap Analysis
    let taxonomyRecord = query.get('SELECT * FROM skill_taxonomy WHERE role_name = ?', targetRole);
    if (!taxonomyRecord) taxonomyRecord = query.get('SELECT * FROM skill_taxonomy LIMIT 1');

    const taxonomy = taxonomyRecord ? {
      role_name: taxonomyRecord.role_name,
      required_skills: JSON.parse(taxonomyRecord.required_skills_json || '[]'),
      preferred_skills: JSON.parse(taxonomyRecord.preferred_skills_json || '[]'),
      core_concepts: JSON.parse(taxonomyRecord.core_concepts_json || '[]'),
      recommended_projects: JSON.parse(taxonomyRecord.recommended_projects_json || '[]')
    } : null;

    const skillGap = analyzeSkillGap(studentSkills, targetRole, taxonomy);

    // 3. Schemes Recommendations
    const opportunities = query.all("SELECT * FROM opportunities WHERE status = 'active'");
    const schemes = opportunities.map(opp => {
      const eligibility = evaluateScholarshipEligibility(fullProfile, opp);
      return {
        ...opp,
        match_score: eligibility.match_score,
        eligibility_status: eligibility.eligibility_status,
        explanation_en: eligibility.explanation_en,
        explanation_te: eligibility.explanation_te,
        education_levels: JSON.parse(opp.education_levels_json || '[]'),
        categories: JSON.parse(opp.categories_json || '[]'),
        states: JSON.parse(opp.states_json || '[]'),
        required_documents: JSON.parse(opp.required_documents_json || '[]'),
        benefits: JSON.parse(opp.benefits_json || '[]'),
        eligibility
      };
    }).sort((a, b) => b.eligibility.match_score - a.eligibility.match_score);

    // 4. Internships Recommendations
    const allInternships = query.all('SELECT * FROM internships');
    const internships = allInternships.map(intern => {
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
    }).sort((a, b) => b.fit.fit_score - a.fit.fit_score);

    // 5. Courses Recommendations
    const allCourses = query.all('SELECT * FROM courses');
    const courses = recommendCourses(allCourses, skillGap.missing_skills, {
      budget_inr: learningPrefs.budget_inr,
      learning_language: learningPrefs.learning_language
    });

    return res.json({
      success: true,
      schemes,
      internships,
      courses,
      skillGap
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/recommendations/feedback
router.post('/feedback', authenticate, (req, res) => {
  try {
    const { opportunityId, eventType, metadata = {} } = req.body;
    if (!opportunityId || !eventType) {
      return res.status(400).json({ success: false, error: 'Opportunity ID and event type are required' });
    }

    const eventId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    query.run(`
      INSERT INTO recommendation_events (id, student_id, opportunity_id, event_type, metadata_json, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `, eventId, req.user.id, opportunityId, eventType, JSON.stringify(metadata));

    return res.json({ success: true, message: 'Feedback recorded' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
