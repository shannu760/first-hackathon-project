/**
 * Saarathi Live Data Loader
 * Reads scraped JSON files from data/ directory and upserts into SQLite.
 * Run after scrape-scholarships.js and scrape-internships.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDatabase, query } from '../db/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../../data');

function loadJson(filename) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`[Loader] File not found: ${filePath}`);
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : (data.scholarships || data.internships || data.results || []);
  } catch (err) {
    console.error(`[Loader] Failed to parse ${filename}:`, err.message);
    return [];
  }
}

function normalizeEducation(levels) {
  if (!levels || !Array.isArray(levels)) return '["UG", "PG"]';
  const mapped = levels.map(l => {
    const lower = (l || '').toLowerCase().trim();
    if (lower.includes('phd') || lower.includes('doctorate')) return 'PhD';
    if (lower.includes('post') || lower.includes('pg') || lower.includes('master') || lower.includes('mba') || lower.includes('mtech') || lower.includes('m.tech') || lower.includes('m.sc') || lower.includes('msc')) return 'PG';
    if (lower.includes('under') || lower.includes('ug') || lower.includes('bachelor') || lower.includes('btech') || lower.includes('b.tech') || lower.includes('b.e') || lower.includes('b.sc') || lower.includes('bsc') || lower.includes('bca') || lower.includes('b.com') || lower.includes('bcom') || lower.includes('b.a') || lower.includes('degree') || lower.includes('engineering') || lower.includes('graduation')) return 'UG';
    if (lower.includes('diploma') || lower.includes('iti') || lower.includes('polytechnic')) return 'Diploma';
    if (lower.includes('class') || lower.includes('12th') || lower.includes('10th') || lower.includes('school') || lower.includes('hsc') || lower.includes('ssc') || lower.includes('inter') || lower.includes('matricul')) return 'School';
    if (lower.includes('integrated') || lower.includes('dual')) return 'Integrated MS';
    if (lower === 'all' || lower.includes('all level')) return 'All';
    return l; // Keep original if can't map
  });
  return JSON.stringify([...new Set(mapped)]);
}

function loadScholarships() {
  const scholarships = loadJson('scholarships.json');
  if (scholarships.length === 0) {
    console.log('[Loader] No scholarships to load.');
    return 0;
  }

  let loaded = 0;
  for (const s of scholarships) {
    try {
      const id = s.id || `b4s-${(s.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50)}`;
      const title = s.title || 'Unnamed Scholarship';
      const provider = s.provider || s.organization || 'Government of India';
      const type = s.type || 'Scholarship';
      const description = s.description || s.desc || `${title} - Apply now on the official portal.`;
      const educationLevelsJson = normalizeEducation(s.education_levels || s.eligibility_levels || ['UG', 'PG']);
      const minMarks = s.min_marks != null ? Number(s.min_marks) : 0;
      const maxIncomeInr = s.max_income_inr != null ? Number(s.max_income_inr) : null;
      const categoriesJson = JSON.stringify(s.categories || ['All']);
      const statesJson = JSON.stringify(s.states || ['All India']);
      const requiredDocsJson = JSON.stringify(s.required_documents || []);
      const benefitsJson = JSON.stringify(s.benefits || []);
      const deadline = s.deadline || null;
      const officialUrl = s.official_url || s.apply_url || 'https://www.buddy4study.com';
      const sourceUrl = s.source_url || 'https://www.buddy4study.com';

      query.run(`
        INSERT INTO opportunities (
          id, title, provider, type, description, education_levels_json, min_marks, max_income_inr,
          categories_json, states_json, required_documents_json, benefits_json, deadline, official_url,
          source_url, last_verified_at, data_confidence, status, is_demo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 'High', 'active', 0)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          provider = excluded.provider,
          description = excluded.description,
          education_levels_json = excluded.education_levels_json,
          min_marks = excluded.min_marks,
          max_income_inr = excluded.max_income_inr,
          categories_json = excluded.categories_json,
          states_json = excluded.states_json,
          required_documents_json = excluded.required_documents_json,
          benefits_json = excluded.benefits_json,
          deadline = excluded.deadline,
          official_url = excluded.official_url,
          source_url = excluded.source_url,
          last_verified_at = datetime('now')
      `, id, title, provider, type, description, educationLevelsJson, minMarks, maxIncomeInr,
        categoriesJson, statesJson, requiredDocsJson, benefitsJson, deadline, officialUrl, sourceUrl);

      loaded++;
    } catch (err) {
      console.warn(`[Loader] Skipped scholarship "${s.title}": ${err.message}`);
    }
  }
  return loaded;
}

function loadInternships() {
  const internships = loadJson('internships.json');
  if (internships.length === 0) {
    console.log('[Loader] No internships to load.');
    return 0;
  }

  let loaded = 0;
  for (const i of internships) {
    try {
      const id = i.id || `unstop-${(i.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50)}`;
      const title = i.title || 'Unnamed Internship';
      const company = i.company || i.organization || 'Unknown Company';
      const workMode = (i.work_mode || i.mode || 'remote').toLowerCase();
      const location = i.location || 'Remote, India';
      const stipendInr = i.stipend_inr != null ? Number(i.stipend_inr) : 0;
      const stipendText = i.stipend_text || (stipendInr > 0 ? `₹${stipendInr.toLocaleString('en-IN')}/month` : 'Unpaid');
      const durationMonths = i.duration_months || i.duration || 3;
      const requiredSkillsJson = JSON.stringify(i.required_skills || []);
      const preferredSkillsJson = JSON.stringify(i.preferred_skills || []);
      const minCgpa = i.min_cgpa != null ? Number(i.min_cgpa) : 0;
      const openings = i.openings || 1;
      const deadline = i.deadline || null;
      const officialUrl = i.official_url || i.apply_url || 'https://unstop.com';
      const sourceUrl = i.source_url || 'https://unstop.com';

      query.run(`
        INSERT INTO internships (
          id, title, company, work_mode, location, stipend_inr, stipend_text, duration_months,
          required_skills_json, preferred_skills_json, min_cgpa, openings, deadline,
          official_url, source_url, last_verified_at, is_demo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 0)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          company = excluded.company,
          work_mode = excluded.work_mode,
          location = excluded.location,
          stipend_inr = excluded.stipend_inr,
          stipend_text = excluded.stipend_text,
          duration_months = excluded.duration_months,
          required_skills_json = excluded.required_skills_json,
          preferred_skills_json = excluded.preferred_skills_json,
          min_cgpa = excluded.min_cgpa,
          openings = excluded.openings,
          deadline = excluded.deadline,
          official_url = excluded.official_url,
          source_url = excluded.source_url,
          last_verified_at = datetime('now')
      `, id, title, company, workMode, location, stipendInr, stipendText, durationMonths,
        requiredSkillsJson, preferredSkillsJson, minCgpa, openings, deadline, officialUrl, sourceUrl);

      loaded++;
    } catch (err) {
      console.warn(`[Loader] Skipped internship "${i.title}": ${err.message}`);
    }
  }
  return loaded;
}

console.log('========================================');
console.log('  Saarathi Live Data Loader');
console.log('========================================');

initDatabase();

const scholarshipCount = loadScholarships();
console.log(`[Loader] ✔ Loaded ${scholarshipCount} scholarships from Buddy4Study`);

const internshipCount = loadInternships();
console.log(`[Loader] ✔ Loaded ${internshipCount} internships from Unstop`);

const totalOpps = query.get('SELECT COUNT(*) as count FROM opportunities')?.count || 0;
const totalInterns = query.get('SELECT COUNT(*) as count FROM internships')?.count || 0;

console.log(`\n[Loader] Database totals: ${totalOpps} opportunities, ${totalInterns} internships`);
console.log('[Loader] Done!');
