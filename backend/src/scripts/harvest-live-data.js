/**
 * Saarathi Live Data Harvester
 * Scrapes real live scholarships from Buddy4Study and real live internships from Unstop
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseIncome(text) {
  if (!text) return null;
  const matchLakh = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)/i);
  if (matchLakh) return Math.round(parseFloat(matchLakh[1]) * 100000);
  const matchInr = text.match(/(?:inr|rs\.?|₹)\s*([\d,]+)/i);
  if (matchInr) return parseInt(matchInr[1].replace(/,/g, ''), 10);
  return null;
}

function parseMinMarks(text) {
  if (!text) return 0;
  const match = text.match(/(\d{2}(?:\.\d+)?)\s*%/);
  if (match) return parseFloat(match[1]);
  return 0;
}

function parseEducation(text) {
  const levels = new Set();
  const lower = (text || '').toLowerCase();
  if (lower.includes('phd') || lower.includes('doctoral')) levels.add('PhD');
  if (lower.includes('postgraduate') || lower.includes('pg') || lower.includes('master') || lower.includes('m.tech') || lower.includes('mba') || lower.includes('msc')) levels.add('PG');
  if (lower.includes('undergraduate') || lower.includes('ug') || lower.includes('bachelor') || lower.includes('b.tech') || lower.includes('btech') || lower.includes('b.e') || lower.includes('degree') || lower.includes('graduation')) levels.add('UG');
  if (lower.includes('diploma') || lower.includes('polytechnic')) levels.add('Diploma');
  if (lower.includes('class 12') || lower.includes('class 11') || lower.includes('class 10') || lower.includes('school')) levels.add('School');
  if (lower.includes('integrated')) levels.add('Integrated MS');
  if (levels.size === 0) {
    levels.add('UG');
    levels.add('PG');
  }
  return [...levels];
}

// 1. Fetch Real Internships from Unstop API
async function harvestUnstop() {
  console.log('[Unstop] Fetching live internships from Unstop API...');
  const url = 'https://unstop.com/api/public/opportunity/search-result?opportunity=internships&per_page=30&oppstatus=open';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.warn(`[Unstop] HTTP ${res.status}: ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    const rawList = data?.data?.data || [];
    console.log(`[Unstop] Received ${rawList.length} raw internship records.`);

    const normalized = rawList.map((item, idx) => {
      const id = `unstop-${item.id || item.jobDetail?.entity_id || idx + 1000}`;
      const title = item.title || 'Student Intern';
      const company = item.organisation?.name || 'Verified Company';
      
      let work_mode = 'remote';
      const rawType = (item.jobDetail?.type || '').toLowerCase();
      if (rawType.includes('wfh') || rawType.includes('remote')) work_mode = 'remote';
      else if (rawType.includes('office') || rawType.includes('onsite')) work_mode = 'onsite';
      else if (rawType.includes('hybrid')) work_mode = 'hybrid';

      const stipend_inr = item.jobDetail?.min_salary || item.jobDetail?.max_salary || 0;
      const stipend_text = stipend_inr > 0 ? `₹${Number(stipend_inr).toLocaleString('en-IN')} / month` : 'Performance based / Unpaid';
      
      const deadline = item.end_date ? item.end_date.split('T')[0] : '2026-11-30';
      const official_url = item.seo_url || `https://unstop.com/${item.public_url || ''}`;

      // Extract skills from title or filters
      const skills = [];
      const titleLower = title.toLowerCase();
      if (titleLower.includes('software') || titleLower.includes('developer') || titleLower.includes('engineering')) {
        skills.push('Python', 'JavaScript', 'Git', 'Data Structures & Algorithms');
      } else if (titleLower.includes('data') || titleLower.includes('analyst') || titleLower.includes('analytics')) {
        skills.push('Python', 'SQL', 'Data Analytics', 'Excel');
      } else if (titleLower.includes('frontend') || titleLower.includes('web') || titleLower.includes('ui')) {
        skills.push('JavaScript', 'React', 'HTML/CSS', 'Git');
      } else if (titleLower.includes('backend') || titleLower.includes('api')) {
        skills.push('Python', 'SQL', 'RESTful APIs', 'Docker');
      } else if (titleLower.includes('gtm') || titleLower.includes('marketing') || titleLower.includes('growth')) {
        skills.push('Market Research', 'Communication', 'Data Analysis', 'CRM');
      } else {
        skills.push('Problem Solving', 'Python', 'Communication', 'Git');
      }

      return {
        id,
        title,
        company,
        work_mode,
        location: item.jobDetail?.locations?.[0] || (work_mode === 'remote' ? 'Remote, India' : 'India'),
        stipend_inr: Number(stipend_inr),
        stipend_text,
        duration_months: 3,
        required_skills: skills.slice(0, 3),
        preferred_skills: skills.slice(3).concat(['Problem Solving']),
        min_cgpa: 6.5,
        openings: item.register_count ? Math.max(1, Math.min(20, Math.round(item.register_count / 50))) : 5,
        deadline,
        official_url,
        source_url: official_url,
        last_verified_at: new Date().toISOString()
      };
    });

    fs.writeFileSync(path.join(dataDir, 'internships.json'), JSON.stringify(normalized, null, 2));
    console.log(`[Unstop] Successfully saved ${normalized.length} internships to data/internships.json`);
    return normalized;
  } catch (err) {
    console.error('[Unstop] Failed to harvest:', err.message);
    return [];
  }
}

// 2. Fetch Real Scholarships from Buddy4Study
async function harvestBuddy4Study() {
  console.log('[Buddy4Study] Scraping active scholarship programs...');
  
  // High-value, currently active Buddy4Study programs from sitemap
  const targetSlugs = [
    'satya-scholarship-program',
    'edumize-buddy4study-student-support-initiative',
    'karm-fellowship-2024-25',
    'narayana-admission-cum-scholarship-test-n-acst',
    'goonj-setu-fellowship',
    'boehringer-ingelheim-fonds-bif-md-fellowships',
    'humboldt-research-fellowship'
  ];

  const scholarships = [];

  for (const slug of targetSlugs) {
    try {
      const url = `https://www.buddy4study.com/scholarship/${slug}`;
      console.log(`[Buddy4Study] Fetching: ${url}`);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!res.ok) continue;

      const html = await res.text();
      const nextMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
      if (!nextMatch) continue;

      const data = JSON.parse(nextMatch[1]);
      const bp = data.props?.pageProps?.scholarship?.brandPage;
      if (!bp) continue;

      const subList = bp.scholarships || [bp];

      for (const item of subList) {
        const title = item.title || bp.name || slug.replace(/-/g, ' ');
        const rawElig = item.eligibility || bp.aboutProgram || '';
        const plainElig = stripHtml(rawElig);
        const plainBenefits = stripHtml(item.benefits || item.purposeAward || 'Up to 100% Tuition Fee Waiver');
        const plainDocs = stripHtml(item.requiredDocument || 'Income Certificate, Bank Passbook, Marksheet, Aadhaar Card');

        const minMarks = parseMinMarks(plainElig);
        const maxIncome = parseIncome(plainElig);
        const eduLevels = parseEducation(plainElig);

        const docs = [];
        if (plainDocs.toLowerCase().includes('income')) docs.push('Income Certificate');
        if (plainDocs.toLowerCase().includes('bank')) docs.push('Bank Passbook');
        if (plainDocs.toLowerCase().includes('aadhaar')) docs.push('Aadhaar Card');
        if (plainDocs.toLowerCase().includes('marksheet') || plainDocs.toLowerCase().includes('class')) docs.push('Marksheet');
        if (plainDocs.toLowerCase().includes('bonafide') || plainDocs.toLowerCase().includes('admission')) docs.push('College Bonafide');
        if (docs.length === 0) docs.push('Income Certificate', 'Bank Passbook');

        scholarships.push({
          id: `b4s-${item.bsid || item.scholarshipId || slug}`,
          title,
          provider: bp.name || 'Buddy4Study Partner Trust',
          type: 'Scholarship',
          description: plainElig.substring(0, 300) + '...',
          education_levels: eduLevels,
          min_marks: minMarks || 60,
          max_income_inr: maxIncome || 600000,
          categories: ['All'],
          states: ['All India'],
          required_documents: docs,
          benefits: [plainBenefits.substring(0, 150)],
          deadline: item.deadline || '2026-11-30',
          official_url: item.applyLink || url,
          source_url: url,
          last_verified_at: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn(`[Buddy4Study] Error processing ${slug}:`, e.message);
    }
  }

  // Also include the essential national government schemes as gold-standard anchors
  const nationalAnchors = [
    {
      id: 'scheme-pm-usp-01',
      title: 'Central Sector Scheme of Scholarship (PM-USP)',
      provider: 'Department of Higher Education, Ministry of Education, Govt. of India',
      type: 'Scholarship',
      description: 'Financial assistance for meritorious university and college students from low-income families.',
      education_levels: ['UG', 'PG'],
      min_marks: 80,
      max_income_inr: 450000,
      categories: ['All'],
      states: ['All India'],
      required_documents: ['Income Certificate', 'Bank Passbook'],
      benefits: ['₹12,000 to ₹20,000 per annum directly via DBT'],
      deadline: '2026-11-30',
      official_url: 'https://scholarships.gov.in',
      source_url: 'https://scholarships.gov.in'
    },
    {
      id: 'scheme-aicte-pragati-02',
      title: 'AICTE Pragati Scholarship for Girl Students',
      provider: 'All India Council for Technical Education (AICTE)',
      type: 'Scholarship',
      description: 'Advancing technical education for girl students admitted in AICTE-approved degree and diploma institutions.',
      education_levels: ['UG', 'Diploma'],
      min_marks: 60,
      max_income_inr: 800000,
      categories: ['All'],
      states: ['All India'],
      required_documents: ['Income Certificate', 'Bank Passbook', 'College Bonafide'],
      benefits: ['₹50,000 per annum towards fees and laptop equipment'],
      deadline: '2026-12-15',
      official_url: 'https://www.aicte-india.org',
      source_url: 'https://www.aicte-india.org'
    },
    {
      id: 'scheme-telangana-epass-03',
      title: 'Telangana ePASS Post-Matric Scholarship & Fee Reimbursement',
      provider: 'Government of Telangana Welfare Departments',
      type: 'Fee Reimbursement',
      description: '100% Tuition fee reimbursement (RTF) and maintenance allowance (MTF) for Telangana domiciled students.',
      education_levels: ['UG', 'PG', 'Diploma'],
      min_marks: 50,
      max_income_inr: 200000,
      categories: ['OBC', 'SC', 'ST', 'EWS'],
      states: ['Telangana'],
      required_documents: ['Income Certificate', 'Bank Passbook', 'Telangana Domicile/Nativity Certificate'],
      benefits: ['100% Tuition Fee Reimbursement + Monthly Maintenance Allowance'],
      deadline: '2026-10-31',
      official_url: 'https://telanganaepass.cgg.gov.in',
      source_url: 'https://telanganaepass.cgg.gov.in'
    }
  ];

  const allScholarships = [...nationalAnchors, ...scholarships];
  fs.writeFileSync(path.join(dataDir, 'scholarships.json'), JSON.stringify(allScholarships, null, 2));
  console.log(`[Buddy4Study] Successfully saved ${allScholarships.length} scholarships to data/scholarships.json`);
  return allScholarships;
}

async function run() {
  console.log('=== Starting Saarathi Live Opportunity Harvester ===');
  await harvestUnstop();
  await harvestBuddy4Study();
  console.log('=== Harvester Complete ===');
}

run();
