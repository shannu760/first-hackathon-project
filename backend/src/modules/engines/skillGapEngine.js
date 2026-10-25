/**
 * Saarathi Skill-Gap Analyzer Engine
 * Compares student skills against target role taxonomy
 */

export function analyzeSkillGap(studentSkills = [], targetRole = 'Software Development Intern', taxonomy = null) {
  const normalizedStudent = (studentSkills || []).map(s => {
    if (typeof s === 'string') return s.trim().toLowerCase();
    return (s.name || '').trim().toLowerCase();
  }).filter(Boolean);

  const defaultTaxonomy = {
    required_skills: ['Python', 'SQL', 'Git', 'Data Structures & Algorithms'],
    preferred_skills: ['FastAPI', 'Docker', 'RESTful APIs', 'PostgreSQL'],
    core_concepts: ['Object-Oriented Programming', 'Time & Space Complexity', 'Database Indexing'],
    recommended_projects: [
      'Full-Stack CRUD Application with Authentication & SQL Database',
      'CLI Data Processing Utility with Unit Testing and CI/CD'
    ],
    estimated_prep_weeks: 6,
  };

  const tax = taxonomy || defaultTaxonomy;
  const reqList = tax.required_skills || [];
  const prefList = tax.preferred_skills || [];

  const matched_skills = [];
  const missing_skills = [];

  for (const s of reqList) {
    const sLower = s.toLowerCase();
    if (normalizedStudent.includes(sLower) || normalizedStudent.some(st => st.includes(sLower) || sLower.includes(st))) {
      matched_skills.push({ name: s, importance: 'required' });
    } else {
      missing_skills.push({ name: s, importance: 'required' });
    }
  }

  for (const s of prefList) {
    const sLower = s.toLowerCase();
    if (normalizedStudent.includes(sLower) || normalizedStudent.some(st => st.includes(sLower) || sLower.includes(st))) {
      matched_skills.push({ name: s, importance: 'preferred' });
    } else {
      missing_skills.push({ name: s, importance: 'preferred' });
    }
  }

  const reqMatched = matched_skills.filter(s => s.importance === 'required').length;
  const prefMatched = matched_skills.filter(s => s.importance === 'preferred').length;

  // Total points: reqList * 15 + prefList * 8
  const maxPossible = Math.max(1, (reqList.length * 15) + (prefList.length * 8));
  const earned = (reqMatched * 15) + (prefMatched * 8);
  const readiness_score = Math.max(15, Math.min(100, Math.round((earned / maxPossible) * 100)));

  const missingReqCount = missing_skills.filter(s => s.importance === 'required').length;
  const estimated_prep_weeks = Math.max(2, missingReqCount * 2);

  return {
    target_role: targetRole,
    readiness_score,
    total_skills_matched: reqMatched,
    total_skills_required: reqList.length,
    matched_skills,
    missing_skills,
    core_concepts: tax.core_concepts || [],
    recommended_projects: tax.recommended_projects || [],
    estimated_prep_weeks,
    summary: `Student demonstrates ${readiness_score}% readiness for ${targetRole} with ${reqMatched}/${reqList.length} required competencies verified.`
  };
}
