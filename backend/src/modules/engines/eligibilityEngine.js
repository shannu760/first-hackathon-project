/**
 * Saarathi Deterministic Scholarship Eligibility Engine
 * Weights:
 *  - Academic (Education level & marks): 25%
 *  - Income Criterion: 25%
 *  - Social Category / Quota: 25%
 *  - Domicile / State: 15%
 *  - Documentation Readiness: 10%
 */

export function evaluateScholarshipEligibility(profile = {}, opportunity = {}) {
  const failed_criteria = [];
  const missing_information = [];
  const missing_documents = [];
  const passed_criteria = [];

  let academicScore = 0;
  let incomeScore = 0;
  let categoryScore = 0;
  let domicileScore = 0;
  let documentScore = 0;

  // Safe JSON parsing helpers
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

  const allowedEducation = parseList(opportunity.education_levels_json || opportunity.education_levels);
  const allowedCategories = parseList(opportunity.categories_json || opportunity.categories);
  const allowedStates = parseList(opportunity.states_json || opportunity.states);
  const requiredDocs = parseList(opportunity.required_documents_json || opportunity.required_documents);
  const allowedGenders = parseList(opportunity.gender_json || opportunity.gender);

  // 1. Education Level & Academic Marks (25%)
  if (allowedEducation.length > 0 && !allowedEducation.includes('All')) {
    if (!profile.education_level) {
      missing_information.push('Current education level is missing in profile');
    } else if (!allowedEducation.some(e => e.toLowerCase() === profile.education_level.toLowerCase())) {
      failed_criteria.push(`Requires education level in [${allowedEducation.join(', ')}], but profile has "${profile.education_level}"`);
    } else {
      academicScore += 15;
    }
  } else {
    academicScore += 15;
  }

  const studentMarks = profile.percentage ?? (profile.cgpa ? profile.cgpa * 9.5 : null);
  if (opportunity.min_marks != null && opportunity.min_marks > 0) {
    if (studentMarks == null) {
      missing_information.push('Percentage / CGPA is missing in profile');
    } else if (studentMarks < opportunity.min_marks) {
      failed_criteria.push(`Requires minimum ${opportunity.min_marks}% marks; profile has ${studentMarks.toFixed(1)}%`);
    } else {
      academicScore += 10;
      passed_criteria.push(`Academic marks requirement met (${studentMarks.toFixed(1)}% >= ${opportunity.min_marks}%)`);
    }
  } else {
    academicScore += 10;
  }

  // 2. Family Income (25%)
  if (opportunity.max_income_inr != null && opportunity.max_income_inr > 0) {
    if (profile.family_income_inr == null) {
      missing_information.push('Annual family income (INR) is required for verification');
    } else if (profile.family_income_inr > opportunity.max_income_inr) {
      failed_criteria.push(`Family income (₹${profile.family_income_inr.toLocaleString('en-IN')}) exceeds scheme limit of ₹${opportunity.max_income_inr.toLocaleString('en-IN')}`);
    } else {
      incomeScore = 25;
      passed_criteria.push(`Family income within threshold (₹${profile.family_income_inr.toLocaleString('en-IN')} <= ₹${opportunity.max_income_inr.toLocaleString('en-IN')})`);
    }
  } else {
    incomeScore = 25;
  }

  // 3. Social Category / Quota (25%)
  if (allowedCategories.length > 0 && !allowedCategories.includes('All')) {
    if (!profile.category) {
      missing_information.push('Social category (General/OBC/SC/ST/EWS) is missing');
    } else if (!allowedCategories.some(c => c.toLowerCase() === profile.category.toLowerCase())) {
      failed_criteria.push(`Requires social category in [${allowedCategories.join(', ')}]; profile has "${profile.category}"`);
    } else {
      categoryScore = 25;
      passed_criteria.push(`Social category matches scheme quota (${profile.category})`);
    }
  } else {
    categoryScore = 25;
  }

  // 4. Domicile / State (15%)
  if (allowedStates.length > 0 && !allowedStates.includes('All') && !allowedStates.includes('All India')) {
    if (!profile.state) {
      missing_information.push('Domicile state is missing in profile');
    } else if (!allowedStates.some(s => s.toLowerCase() === profile.state.toLowerCase())) {
      failed_criteria.push(`Limited to students from [${allowedStates.join(', ')}]; profile has "${profile.state}"`);
    } else {
      domicileScore = 15;
      passed_criteria.push(`Domicile state matches (${profile.state})`);
    }
  } else {
    domicileScore = 15;
  }

  // Gender check if specified
  if (allowedGenders.length > 0 && !allowedGenders.includes('All') && !allowedGenders.includes('Any')) {
    if (!profile.gender) {
      missing_information.push('Gender is missing in profile');
    } else if (!allowedGenders.some(g => g.toLowerCase() === profile.gender.toLowerCase())) {
      failed_criteria.push(`Open only to [${allowedGenders.join(', ')}]; profile has "${profile.gender}"`);
    }
  }

  // 5. Documentation Readiness (10%)
  if (requiredDocs.length > 0) {
    let docsReady = 0;
    for (const doc of requiredDocs) {
      const docLower = doc.toLowerCase();
      let hasIt = false;
      if (docLower.includes('income') && profile.has_income_certificate) hasIt = true;
      else if (docLower.includes('caste') && profile.has_caste_certificate) hasIt = true;
      else if (docLower.includes('domicile') && (profile.has_domicile_certificate || profile.state)) hasIt = true;
      else if (docLower.includes('bank') && (profile.has_bank_account ?? true)) hasIt = true;
      else if (docLower.includes('aadhaar') && (profile.has_aadhaar ?? true)) hasIt = true;
      else if (docLower.includes('bonafide') && (profile.institution || profile.education_level)) hasIt = true;
      else if (docLower.includes('marksheet') && (profile.percentage != null || profile.cgpa != null)) hasIt = true;
      else if (profile.documents_uploaded && profile.documents_uploaded[doc]) hasIt = true;

      if (hasIt) {
        docsReady++;
      } else {
        missing_documents.push(doc);
      }
    }
    documentScore = Math.round((docsReady / requiredDocs.length) * 10);
  } else {
    documentScore = 10;
  }

  // Total deterministic match score
  let match_score = academicScore + incomeScore + categoryScore + domicileScore + documentScore;
  match_score = Math.max(0, Math.min(100, Math.round(match_score)));

  // Determine eligibility status
  let eligibility_status = 'likely_eligible';
  if (failed_criteria.length > 0) {
    eligibility_status = 'likely_ineligible';
  } else if (missing_information.length > 0 || missing_documents.length > 0) {
    eligibility_status = 'conditionally_eligible';
  }

  // Adjust score based on eligibility status so conditionally eligible items are never inflated to 80%+
  if (eligibility_status === 'conditionally_eligible') {
    const penalty = Math.max(25, (missing_information.length * 15) + (missing_documents.length * 10));
    match_score = Math.max(35, Math.min(58, match_score - penalty));
  } else if (eligibility_status === 'likely_ineligible') {
    match_score = Math.max(0, Math.min(28, Math.round(match_score * 0.28)));
  } else {
    // Likely eligible: high confidence tier (75 - 100)
    match_score = Math.max(75, Math.min(100, match_score));
  }

  // Generate deterministic, profile-specific explanations in English & Telugu so UI boxes are never empty
  const eduText = profile.education_level || 'current academic';
  const marksText = studentMarks != null ? `${studentMarks.toFixed(1)}%` : 'merit';
  const missingItems = [...missing_information, ...missing_documents.map(d => `${d} certificate`)];

  let explanation_en = '';
  let explanation_te = '';

  if (eligibility_status === 'likely_eligible') {
    explanation_en = `Full profile match (${match_score}%). Your ${eduText} enrollment, verified ${marksText} marks, and domicile satisfy all published scheme guidelines.`;
    explanation_te = `పూర్తిగా అర్హులు (${match_score}%). మీ ${eduText} చదువు, ${marksText} మార్కులు మరియు నివాస ధృవీకరణ పథక నిబంధనలకు అనుకూలంగా ఉన్నాయి.`;
  } else if (eligibility_status === 'conditionally_eligible') {
    explanation_en = `Conditionally eligible (${match_score}%). Meets core ${eduText} criteria, but requires ${missingItems.slice(0, 2).join(' and ')} to finalize sanction.`;
    explanation_te = `షరతులతో కూడిన అర్హత (${match_score}%). ప్రధాన ${eduText} అర్హతలు సరిపోయాయి, కానీ ఆమోదం కొరకు ${missingItems.slice(0, 2).join(' మరియు ')} సమర్పించాలి.`;
  } else {
    explanation_en = `Likely ineligible (${match_score}%). ${failed_criteria[0] || 'Criteria do not match your current academic or category records.'}`;
    explanation_te = `అర్హత సరిపోలడం లేదు (${match_score}%). ${failed_criteria[0] || 'నిబంధనలు మీ ప్రస్తుత రికార్డులతో సరిపోలడం లేదు.'}`;
  }

  return {
    match_score,
    eligibility_status,
    explanation_en,
    explanation_te,
    failed_criteria,
    missing_information,
    missing_documents,
    passed_criteria,
    breakdown: {
      academic_score: academicScore,
      income_score: incomeScore,
      category_score: categoryScore,
      domicile_score: domicileScore,
      document_score: documentScore,
    },
    disclaimer: 'This assessment is a deterministic pre-screening based on published guidelines. It does not guarantee scholarship award or government sanction.'
  };
}
