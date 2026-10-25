/**
 * Saarathi Deterministic Internship Fit Engine
 * Weights:
 *  - Required Skills Match: 40%
 *  - Academic Eligibility (CGPA / Education): 25%
 *  - Target Role Alignment: 20%
 *  - Work Mode & Location: 15%
 */

export function evaluateInternshipFit(profile = {}, internship = {}) {
  const parseList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [String(val)];
    }
  };

  const studentSkills = (profile.skills || []).map(s => (typeof s === 'string' ? s : s.name || '').trim().toLowerCase()).filter(Boolean);
  const requiredSkillsRaw = parseList(internship.required_skills_json || internship.required_skills || []);
  const preferredSkillsRaw = parseList(internship.preferred_skills_json || internship.preferred_skills || []);

  const matched_required_skills = [];
  const missing_required_skills = [];
  const matched_preferred_skills = [];
  const missing_preferred_skills = [];

  for (const s of requiredSkillsRaw) {
    const sNorm = String(s).trim().toLowerCase();
    if (studentSkills.includes(sNorm)) {
      matched_required_skills.push(sNorm);
    } else {
      missing_required_skills.push(sNorm);
    }
  }

  for (const s of preferredSkillsRaw) {
    const sNorm = String(s).trim().toLowerCase();
    if (studentSkills.includes(sNorm)) {
      matched_preferred_skills.push(sNorm);
    } else {
      missing_preferred_skills.push(sNorm);
    }
  }

  // 1. Skill Match Score (40 pts)
  let skillMatchScore = 0;
  if (requiredSkillsRaw.length === 0) {
    skillMatchScore = 35;
  } else {
    const reqRatio = matched_required_skills.length / requiredSkillsRaw.length;
    let prefBonus = 0;
    if (preferredSkillsRaw.length > 0) {
      prefBonus = (matched_preferred_skills.length / preferredSkillsRaw.length) * 10;
    }
    skillMatchScore = Math.min(40, (reqRatio * 30) + prefBonus);
  }

  // 2. Academic Score (25 pts)
  let academicScore = 25;
  let academicMet = true;
  let academicReason = 'Meets academic criteria';

  if (internship.min_cgpa != null && internship.min_cgpa > 0) {
    const studentCgpa = profile.cgpa != null ? profile.cgpa : (profile.percentage != null ? profile.percentage / 9.5 : null);
    if (studentCgpa == null) {
      academicScore = 15;
      academicReason = 'CGPA not specified in student profile';
    } else if (studentCgpa >= internship.min_cgpa) {
      academicScore = 25;
      academicMet = true;
      academicReason = `CGPA ${studentCgpa.toFixed(1)} meets requirement (>= ${internship.min_cgpa})`;
    } else {
      academicScore = 5;
      academicMet = false;
      academicReason = `CGPA ${studentCgpa.toFixed(1)} is below required ${internship.min_cgpa}`;
    }
  }

  // 3. Target Role Alignment (20 pts)
  let roleScore = 10;
  const targetRole = (profile.target_role || profile.career_goal || '').toLowerCase();
  const internTitle = (internship.title || '').toLowerCase();
  const internRole = (internship.role_category || '').toLowerCase();

  if (targetRole) {
    if (internTitle.includes(targetRole) || targetRole.includes(internTitle)) {
      roleScore = 20;
    } else {
      const words = targetRole.split(/\s+/).filter(w => w.length > 2);
      const matches = words.filter(w => internTitle.includes(w) || internRole.includes(w));
      if (matches.length > 0) {
        roleScore = 15;
      }
    }
  } else {
    roleScore = 15;
  }

  // 4. Mode / Location (15 pts)
  let modeScore = 15;
  const prefMode = (profile.internship_mode || profile.preferred_mode || 'any').toLowerCase();
  const internMode = (internship.work_mode || 'remote').toLowerCase();

  if (prefMode === 'any') {
    modeScore = 15;
  } else if (prefMode === internMode) {
    modeScore = 15;
  } else if (internMode === 'remote' || internMode === 'hybrid') {
    modeScore = 12;
  } else {
    modeScore = 8;
  }

  const totalFitScore = Math.max(0, Math.min(100, Math.round(skillMatchScore + academicScore + roleScore + modeScore)));

  const matched_skills = [...new Set([...matched_required_skills, ...matched_preferred_skills])];
  const missing_skills = [...new Set([...missing_required_skills, ...missing_preferred_skills])];

  let recommended_action = '';
  if (missing_required_skills.length > 0) {
    recommended_action = `Priority: Strengthen your foundation in ${missing_required_skills.slice(0, 2).map(s => s.toUpperCase()).join(' & ')} to maximize shortlist conversion.`;
  } else if (totalFitScore >= 75) {
    recommended_action = `Strong candidate match. Highlight ${matched_skills.slice(0, 3).join(', ')} prominently on your profile and apply immediately.`;
  } else {
    recommended_action = `Good potential match. Complete a relevant project demonstrating practical application of ${matched_skills[0] || 'core technologies'}.`;
  }

  const roleText = internship.title || 'internship';
  const explanation_en = `Evaluated at ${totalFitScore}% fit for ${roleText}. Matched ${matched_skills.length} skills with ${internMode} preference alignment.`;
  const explanation_te = `${roleText} స్థానానికి ${totalFitScore}% సరిపోలిక. మీ వద్ద ఉన్న ${matched_skills.length} నైపుణ్యాలు సరిపోయాయి.`;

  return {
    fit_score: totalFitScore,
    matched_skills,
    missing_skills,
    recommended_action,
    explanation_en,
    explanation_te,
    academic_eligibility: {
      met: academicMet,
      reason: academicReason,
    },
    missing_required_skills,
    matched_required_skills,
    missing_preferred_skills,
    matched_preferred_skills,
    breakdown: {
      skill_match_score: Math.round(skillMatchScore),
      academic_score: Math.round(academicScore),
      role_preference_score: Math.round(roleScore),
      mode_score: Math.round(modeScore),
    },
    recommendation_level: totalFitScore >= 80 ? 'Strong Fit' : (totalFitScore >= 60 ? 'Moderate Fit' : 'Growth Candidate'),
    disclaimer: 'Fit score measures profile alignment; final selection depends on recruiter screening and interviews.'
  };
}
