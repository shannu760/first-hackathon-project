/**
 * Saarathi Course Recommender Engine
 * Matches curated courses to student's skill gaps and preferences
 */

export function recommendCourses(courses = [], missingSkills = [], preferences = {}) {
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

  const targetMissing = (missingSkills || []).map(s => {
    if (typeof s === 'string') return s.trim().toLowerCase();
    return (s.name || '').trim().toLowerCase();
  }).filter(Boolean);

  const budget = preferences.budget_inr != null ? Number(preferences.budget_inr) : Infinity;
  const lang = (preferences.learning_language || 'both').toLowerCase();

  const scored = courses.map(course => {
    const courseSkills = parseList(course.skills_json || course.skills || []).map(s => String(s).toLowerCase());
    
    // Calculate how many missing skills this course covers
    const matchedGaps = targetMissing.filter(gap => 
      courseSkills.some(cs => cs.includes(gap) || gap.includes(cs))
    );

    let score = matchedGaps.length * 30;

    // Prefer free courses or within budget
    const price = Number(course.price_inr || 0);
    if (course.is_free || price === 0) {
      score += 15;
    } else if (price <= budget) {
      score += 10;
    } else {
      score -= 20; // Over budget
    }

    // Language preference matching
    const cLang = (course.language || 'english').toLowerCase();
    if (lang === 'both' || lang === 'all') {
      score += 5;
    } else if (cLang.includes(lang) || lang.includes(cLang)) {
      score += 10;
    }

    // Curated learning path ordering bonus
    const order = Number(course.learning_path_order || 99);
    score += Math.max(0, 10 - order);

    const skills_covered = parseList(course.skills_json || course.skills || []);
    const why_recommended = matchedGaps.length > 0
      ? `Directly bridges your identified skill gap in ${matchedGaps.slice(0, 2).map(s => s.toUpperCase()).join(' & ')} required for target roles.`
      : `Strengthens core technical proficiencies in ${(skills_covered.length > 0 ? skills_covered.slice(0, 2) : ['Software Engineering', 'Problem Solving']).join(', ')} to boost profile credibility.`;

    return {
      ...course,
      skills_covered,
      why_recommended,
      matched_skills_count: matchedGaps.length,
      matched_gaps: matchedGaps,
      recommendation_score: score,
    };
  });

  // Sort descending by recommendation_score
  return scored.sort((a, b) => b.recommendation_score - a.recommendation_score);
}
