import { test, describe } from 'node:test';
import assert from 'node:assert';
import { evaluateScholarshipEligibility } from '../src/modules/engines/eligibilityEngine.js';
import { evaluateInternshipFit } from '../src/modules/engines/internshipFitEngine.js';
import { analyzeSkillGap } from '../src/modules/engines/skillGapEngine.js';
import { recommendCourses } from '../src/modules/engines/courseRecommenderEngine.js';
import { callOpenRouter } from '../src/modules/ai/openrouter.js';

describe('Saarathi Deterministic Eligibility & Scoring Engines', () => {

  test('Scholarship Eligibility: Full Match returns likely_eligible with score 100', () => {
    const profile = {
      education_level: 'UG',
      percentage: 85,
      family_income_inr: 300000,
      category: 'General',
      state: 'Telangana',
      has_income_certificate: 1,
      has_bank_account: 1,
    };

    const opportunity = {
      title: 'Central Sector Scheme of Scholarship (PM-USP)',
      education_levels_json: '["UG", "PG"]',
      min_marks: 80,
      max_income_inr: 450000,
      categories_json: '["All"]',
      states_json: '["All India"]',
      required_documents_json: '["Income Certificate", "Bank Passbook"]',
    };

    const res = evaluateScholarshipEligibility(profile, opportunity);
    assert.strictEqual(res.match_score, 100);
    assert.strictEqual(res.eligibility_status, 'likely_eligible');
    assert.strictEqual(res.failed_criteria.length, 0);
    assert.strictEqual(res.missing_information.length, 0);
    assert.strictEqual(res.missing_documents.length, 0);
  });

  test('Scholarship Eligibility: Failed mandatory criterion blocks eligibility regardless of high score', () => {
    const profile = {
      education_level: 'School', // Fails UG requirement
      percentage: 95,            // High marks
      family_income_inr: 100000, // Very low income
      category: 'General',
      state: 'Telangana',
    };

    const opportunity = {
      title: 'Degree Scholarship',
      education_levels_json: '["UG", "PG"]',
      min_marks: 80,
      max_income_inr: 450000,
      categories_json: '["All"]',
      states_json: '["All India"]',
    };

    const res = evaluateScholarshipEligibility(profile, opportunity);
    assert.strictEqual(res.eligibility_status, 'likely_ineligible');
    assert.ok(res.failed_criteria.some(c => c.includes('Requires education level')));
  });

  test('Scholarship Eligibility: Missing income produces conditional eligibility rather than unsupported claim', () => {
    const profile = {
      education_level: 'UG',
      percentage: 85,
      family_income_inr: null, // Unknown!
      category: 'General',
      state: 'Telangana',
    };

    const opportunity = {
      title: 'Income-Capped Grant',
      education_levels_json: '["UG"]',
      min_marks: 75,
      max_income_inr: 250000,
      categories_json: '["All"]',
      states_json: '["All India"]',
    };

    const res = evaluateScholarshipEligibility(profile, opportunity);
    assert.strictEqual(res.eligibility_status, 'conditionally_eligible');
    assert.ok(res.missing_information.some(m => m.includes('Annual family income')));
    assert.ok(res.match_score <= 58, `Match score ${res.match_score} should be capped at 58% for conditional eligibility, never 80%+`);
    assert.ok(res.match_score >= 35, `Match score ${res.match_score} should reflect positive foundational match >= 35%`);
    assert.ok(res.explanation_en.length > 0, 'English explanation should not be empty');
    assert.ok(res.explanation_te.length > 0, 'Telugu explanation should not be empty');
  });

  test('Internship Fit: Calculates skills match and academic eligibility accurately', () => {
    const profile = {
      skills: ['Python', 'SQL', 'Git'],
      cgpa: 8.5,
      target_role: 'Backend Developer Intern',
      internship_mode: 'remote',
    };

    const internship = {
      title: 'Backend Developer Intern',
      required_skills_json: '["Python", "SQL", "Git", "Docker"]', // 3 out of 4 matched = 30/40 pts
      preferred_skills_json: '["PostgreSQL"]',                     // 0 matched
      min_cgpa: 7.5,                                               // Passed = 20 pts
      work_mode: 'remote',
    };

    const res = evaluateInternshipFit(profile, internship);
    assert.ok(res.fit_score >= 60 && res.fit_score <= 100);
    assert.strictEqual(res.academic_eligibility.met, true);
    assert.deepStrictEqual(res.missing_required_skills, ['docker']);
  });

  test('Skill-Gap Engine: Correctly flags missing skills and computes preparation readiness', () => {
    const studentSkills = ['Python', 'HTML/CSS'];
    const taxonomy = {
      required_skills: ['Python', 'SQL', 'Git', 'Data Structures'],
      preferred_skills: ['FastAPI', 'Docker'],
      core_concepts: ['OOP', 'Complexity'],
      recommended_projects: ['REST API']
    };

    const res = analyzeSkillGap(studentSkills, 'Software Development Intern', taxonomy);
    assert.ok(res.readiness_score < 75);
    assert.ok(res.missing_skills.some(m => m.name.toLowerCase() === 'sql'));
    assert.ok(res.missing_skills.some(m => m.name.toLowerCase() === 'git'));
    assert.strictEqual(res.total_skills_matched, 1);
  });

  test('Course Recommender: Prioritizes courses covering missing skills within budget', () => {
    const missingSkills = [{ name: 'SQL' }, { name: 'Docker' }];
    const courses = [
      { id: 'c1', title: 'Python Basics', skills_json: '["Python"]', is_free: 1, price_inr: 0, learning_path_order: 1 },
      { id: 'c2', title: 'Complete SQL for Developers', skills_json: '["SQL", "PostgreSQL"]', is_free: 1, price_inr: 0, learning_path_order: 2 },
    ];

    const res = recommendCourses(courses, missingSkills, { budget_inr: 500, learning_language: 'both' });
    assert.strictEqual(res[0].id, 'c2'); // c2 covers missing SQL skill
  });

  test('AI Layer: Deterministic fallback and offline demo mode operate without crashing', async () => {
    const res = await callOpenRouter({
      messages: [{ role: 'user', content: 'Explain my eligibility' }],
      feature: 'explain',
      userId: 'test-user',
    });

    assert.ok(res.text.length > 0);
    assert.ok(res.isDemo || res.isFallback || res.model);
  });
});
