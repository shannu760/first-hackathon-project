/**
 * scrape-internships.js
 *
 * Scrapes real internship data from Unstop (formerly Dare2Compete).
 * Tries multiple API strategies with graceful fallback:
 *   1. POST /api/public/opportunity/search-new
 *   2. GET  /api/public/opportunity/search-result (query-string variant)
 *   3. POST /api/public/opportunity/search-result (POST body variant)
 *   4. HTML scraping of the listing page + __NEXT_DATA__ / inline JSON
 *
 * Usage:  node src/scripts/scrape-internships.js
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = resolve(__dirname, '..', '..', 'data');
const OUT_FILE = resolve(DATA_DIR, 'internships.json');

const BASE = 'https://unstop.com';
const LISTING_URL =
  'https://unstop.com/internship/student-internships?usertype=students&domain=2&oppstatus=open';

const HEADERS_JSON = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://unstop.com/internships',
  Origin: 'https://unstop.com',
  'Content-Type': 'application/json',
};

const HEADERS_HTML = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

const MAX_PAGES = 5;
const PER_PAGE = 15;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function log(msg) {
  console.log(`[scrape-internships] ${msg}`);
}

function warn(msg) {
  console.warn(`[scrape-internships] ⚠  ${msg}`);
}

async function safeFetch(url, opts = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// Normalise a single raw opportunity object into our schema
// ---------------------------------------------------------------------------
function normalise(raw) {
  try {
    const id = raw.id || raw.opportunity_id || raw.slug || raw.public_url || '';
    const title = raw.title || raw.name || raw.opportunity_title || '';
    const company =
      raw.organisation?.name ||
      raw.organization?.name ||
      raw.company_name ||
      raw.organisation_name ||
      raw.organiser_name ||
      '';

    // Work mode
    let work_mode = 'onsite';
    const modeRaw = (
      raw.work_mode ||
      raw.jobDetail?.work_type ||
      raw.job_detail?.work_type ||
      raw.internshipDetail?.work_type ||
      raw.internship_detail?.work_type ||
      raw.type ||
      ''
    )
      .toString()
      .toLowerCase();
    if (/remote|wfh|work.from.home/i.test(modeRaw)) work_mode = 'remote';
    else if (/hybrid/i.test(modeRaw)) work_mode = 'hybrid';
    else if (/onsite|office|on.site/i.test(modeRaw)) work_mode = 'onsite';

    // Location
    let location = '';
    if (raw.city) location = raw.city;
    else if (raw.location) location = raw.location;
    else if (Array.isArray(raw.filters?.city))
      location = raw.filters.city.join(', ');

    // Stipend
    let stipend_inr = 0;
    let stipend_text = '';
    const stipendRaw =
      raw.stipend ||
      raw.jobDetail?.salary ||
      raw.job_detail?.salary ||
      raw.internshipDetail?.stipend ||
      raw.internship_detail?.stipend ||
      raw.salary ||
      '';
    if (typeof stipendRaw === 'number') {
      stipend_inr = stipendRaw;
      stipend_text = `₹${stipendRaw.toLocaleString('en-IN')}/month`;
    } else if (typeof stipendRaw === 'string') {
      stipend_text = stipendRaw;
      const nums = stipendRaw.replace(/,/g, '').match(/\d+/g);
      if (nums) stipend_inr = parseInt(nums[0], 10);
    } else if (typeof stipendRaw === 'object' && stipendRaw !== null) {
      stipend_inr = stipendRaw.max || stipendRaw.min || stipendRaw.amount || 0;
      stipend_text = stipendRaw.text || `₹${stipend_inr.toLocaleString('en-IN')}/month`;
    }

    // Duration
    let duration_months = 0;
    const durRaw =
      raw.duration ||
      raw.jobDetail?.duration ||
      raw.internshipDetail?.duration ||
      '';
    if (typeof durRaw === 'number') {
      duration_months = durRaw;
    } else if (typeof durRaw === 'string') {
      const m = durRaw.match(/(\d+)/);
      if (m) duration_months = parseInt(m[1], 10);
    }

    // Skills
    const required_skills = extractSkills(
      raw.eligible_skills || raw.skills || raw.required_skills || raw.eligibility?.skills || []
    );
    const preferred_skills = extractSkills(raw.preferred_skills || []);

    // CGPA
    let min_cgpa = 0;
    const cgpaRaw =
      raw.min_cgpa ||
      raw.eligibility?.cgpa ||
      raw.eligibility?.min_cgpa ||
      0;
    if (typeof cgpaRaw === 'number') min_cgpa = cgpaRaw;
    else if (typeof cgpaRaw === 'string') {
      const cm = cgpaRaw.match(/([\d.]+)/);
      if (cm) min_cgpa = parseFloat(cm[1]);
    }

    // Openings
    const openings =
      raw.openings ||
      raw.jobDetail?.openings ||
      raw.internshipDetail?.openings ||
      raw.no_of_openings ||
      0;

    // Deadline
    let deadline = '';
    const dlRaw =
      raw.end_date ||
      raw.deadline ||
      raw.regnEnd ||
      raw.regn_end ||
      raw.registration_end_date ||
      '';
    if (dlRaw) {
      const d = new Date(typeof dlRaw === 'number' ? dlRaw * 1000 : dlRaw);
      if (!isNaN(d.getTime())) deadline = d.toISOString().slice(0, 10);
    }

    // URL
    const slug =
      raw.public_url ||
      raw.seo_url ||
      raw.slug ||
      raw.canonical_url ||
      '';
    const official_url = slug
      ? slug.startsWith('http')
        ? slug
        : `${BASE}/${slug.replace(/^\//, '')}`
      : '';

    return {
      id: `unstop-${id}`,
      title,
      company,
      work_mode,
      location,
      stipend_inr,
      stipend_text,
      duration_months,
      required_skills,
      preferred_skills,
      min_cgpa,
      openings: typeof openings === 'number' ? openings : parseInt(openings, 10) || 0,
      deadline,
      official_url,
      source_url: LISTING_URL,
    };
  } catch {
    return null;
  }
}

function extractSkills(raw) {
  if (!raw) return [];
  if (typeof raw === 'string')
    return raw
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  if (Array.isArray(raw))
    return raw
      .map((s) => (typeof s === 'string' ? s.trim() : s?.name || s?.skill || ''))
      .filter(Boolean);
  return [];
}

// ---------------------------------------------------------------------------
// Strategy 1 – POST /api/public/opportunity/search-new
// ---------------------------------------------------------------------------
async function strategySearchNew() {
  log('Strategy 1: POST /api/public/opportunity/search-new');
  const allItems = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const body = JSON.stringify({
      opportunity: 'internships',
      oppstatus: 'open',
      filters: {
        oppstatus: 'open',
        domain: ['2'],
      },
      page,
      per_page: PER_PAGE,
    });

    const res = await safeFetch(`${BASE}/api/public/opportunity/search-new`, {
      method: 'POST',
      headers: HEADERS_JSON,
      body,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const json = await res.json();
    const items =
      json.data?.data ||
      json.data?.opportunities ||
      json.data?.rows ||
      json.data?.items ||
      json.data ||
      [];

    if (!Array.isArray(items) || items.length === 0) {
      log(`  Page ${page}: no more results`);
      break;
    }

    log(`  Page ${page}: got ${items.length} items`);
    allItems.push(...items);

    // Check total
    const total = json.data?.total || json.data?.totalCount || Infinity;
    if (allItems.length >= total) break;
  }

  return allItems;
}

// ---------------------------------------------------------------------------
// Strategy 2 – GET /api/public/opportunity/search-result (query-string)
// ---------------------------------------------------------------------------
async function strategySearchResultGet() {
  log('Strategy 2: GET /api/public/opportunity/search-result');
  const allItems = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const params = new URLSearchParams({
      opportunity: 'internships',
      oppstatus: 'open',
      page: String(page),
      per_page: String(PER_PAGE),
    });

    const res = await safeFetch(
      `${BASE}/api/public/opportunity/search-result?${params}`,
      { method: 'GET', headers: HEADERS_JSON }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const json = await res.json();
    const items =
      json.data?.data ||
      json.data?.opportunities ||
      json.data?.rows ||
      json.data ||
      [];

    if (!Array.isArray(items) || items.length === 0) {
      log(`  Page ${page}: no more results`);
      break;
    }

    log(`  Page ${page}: got ${items.length} items`);
    allItems.push(...items);

    const total = json.data?.total || Infinity;
    if (allItems.length >= total) break;
  }

  return allItems;
}

// ---------------------------------------------------------------------------
// Strategy 3 – POST /api/public/opportunity/search-result
// ---------------------------------------------------------------------------
async function strategySearchResultPost() {
  log('Strategy 3: POST /api/public/opportunity/search-result');
  const allItems = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const body = JSON.stringify({
      opportunity: 'internships',
      oppstatus: 'open',
      filters: {
        oppstatus: 'open',
      },
      page,
      per_page: PER_PAGE,
    });

    const res = await safeFetch(`${BASE}/api/public/opportunity/search-result`, {
      method: 'POST',
      headers: HEADERS_JSON,
      body,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const json = await res.json();
    const items =
      json.data?.data ||
      json.data?.opportunities ||
      json.data?.rows ||
      json.data ||
      [];

    if (!Array.isArray(items) || items.length === 0) {
      log(`  Page ${page}: no more results`);
      break;
    }

    log(`  Page ${page}: got ${items.length} items`);
    allItems.push(...items);

    const total = json.data?.total || Infinity;
    if (allItems.length >= total) break;
  }

  return allItems;
}

// ---------------------------------------------------------------------------
// Strategy 4 – POST /api/public/search (generic search endpoint)
// ---------------------------------------------------------------------------
async function strategyPublicSearch() {
  log('Strategy 4: POST /api/public/search');
  const allItems = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const body = JSON.stringify({
      type: 'internship',
      filters: {
        status: 'open',
        oppstatus: 'open',
      },
      page,
      per_page: PER_PAGE,
    });

    const res = await safeFetch(`${BASE}/api/public/search`, {
      method: 'POST',
      headers: HEADERS_JSON,
      body,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const json = await res.json();
    const items =
      json.data?.data ||
      json.data?.opportunities ||
      json.data?.results ||
      json.data ||
      [];

    if (!Array.isArray(items) || items.length === 0) {
      log(`  Page ${page}: no more results`);
      break;
    }

    log(`  Page ${page}: got ${items.length} items`);
    allItems.push(...items);

    const total = json.data?.total || Infinity;
    if (allItems.length >= total) break;
  }

  return allItems;
}

// ---------------------------------------------------------------------------
// Strategy 5 – HTML scrape + __NEXT_DATA__ / embedded JSON extraction
// ---------------------------------------------------------------------------
async function strategyHTMLScrape() {
  log('Strategy 5: HTML scrape of listing page');

  const urls = [
    LISTING_URL,
    `${BASE}/internships`,
    `${BASE}/internship/student-internships`,
  ];

  for (const url of urls) {
    log(`  Trying ${url}`);
    try {
      const res = await safeFetch(url, { headers: HEADERS_HTML });
      if (!res.ok) {
        warn(`  ${url} => ${res.status}`);
        continue;
      }

      const html = await res.text();

      // Try __NEXT_DATA__
      const nextDataMatch = html.match(
        /<script\s+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
      );
      if (nextDataMatch) {
        log('  Found __NEXT_DATA__');
        const nextData = JSON.parse(nextDataMatch[1]);
        const props = nextData?.props?.pageProps || nextData?.props || {};
        const items =
          props.opportunities ||
          props.internships ||
          props.data?.data ||
          props.searchResults?.data ||
          [];
        if (Array.isArray(items) && items.length > 0) return items;
      }

      // Try window.__INITIAL_STATE__  or similar embedded JSON
      const statePatterns = [
        /window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});\s*<\/script>/,
        /window\.__DATA__\s*=\s*({[\s\S]*?});\s*<\/script>/,
        /window\.__APP_DATA__\s*=\s*({[\s\S]*?});\s*<\/script>/,
      ];
      for (const pattern of statePatterns) {
        const m = html.match(pattern);
        if (m) {
          try {
            const state = JSON.parse(m[1]);
            const items = findOpportunityArray(state);
            if (items && items.length > 0) {
              log(`  Found embedded state data (${items.length} items)`);
              return items;
            }
          } catch { /* parse error, try next */ }
        }
      }

      // Try extracting structured data (JSON-LD)
      const ldMatches = html.matchAll(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
      );
      for (const ldm of ldMatches) {
        try {
          const ld = JSON.parse(ldm[1]);
          if (ld['@type'] === 'ItemList' && Array.isArray(ld.itemListElement)) {
            log(`  Found JSON-LD ItemList (${ld.itemListElement.length} items)`);
            return ld.itemListElement.map((el) => el.item || el);
          }
        } catch { /* continue */ }
      }

      // Last resort: regex-scrape card HTML
      const cards = [];
      const cardPattern =
        /<a[^>]*href="(\/internship\/[^"]+)"[^>]*>[\s\S]*?<\/a>/gi;
      let match;
      while ((match = cardPattern.exec(html)) !== null) {
        const href = match[1];
        // Deduplicate
        if (!cards.find((c) => c.href === href)) {
          const titleMatch = match[0].match(
            /class="[^"]*title[^"]*"[^>]*>([^<]+)</i
          );
          const companyMatch = match[0].match(
            /class="[^"]*(?:company|org)[^"]*"[^>]*>([^<]+)</i
          );
          cards.push({
            public_url: href,
            title: titleMatch ? titleMatch[1].trim() : href.split('/').pop(),
            organisation_name: companyMatch ? companyMatch[1].trim() : '',
          });
        }
      }
      if (cards.length > 0) {
        log(`  Extracted ${cards.length} cards from HTML`);
        return cards;
      }

      warn('  No structured data found in HTML');
    } catch (err) {
      warn(`  Error fetching ${url}: ${err.message}`);
    }
  }

  return [];
}

/**
 * Recursively search an object tree for an array that looks like opportunities.
 */
function findOpportunityArray(obj, depth = 0) {
  if (depth > 6) return null;
  if (Array.isArray(obj) && obj.length > 0 && (obj[0].title || obj[0].name || obj[0].slug))
    return obj;
  if (obj && typeof obj === 'object') {
    for (const val of Object.values(obj)) {
      const found = findOpportunityArray(val, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  log('Starting Unstop internship scraper …');

  // Ensure output dir
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
    log(`Created data directory: ${DATA_DIR}`);
  }

  const strategies = [
    strategySearchNew,
    strategySearchResultGet,
    strategySearchResultPost,
    strategyPublicSearch,
    strategyHTMLScrape,
  ];

  let rawItems = [];

  for (const strategy of strategies) {
    try {
      rawItems = await strategy();
      if (rawItems && rawItems.length > 0) {
        log(`✓ ${strategy.name} succeeded with ${rawItems.length} raw items`);
        break;
      }
      warn(`${strategy.name} returned 0 items, trying next …`);
    } catch (err) {
      warn(`${strategy.name} failed: ${err.message}`);
    }
  }

  if (!rawItems || rawItems.length === 0) {
    console.error(
      '[scrape-internships] ✗ All strategies failed. No internships scraped.'
    );
    // Write empty array so downstream code doesn't break
    writeFileSync(OUT_FILE, JSON.stringify([], null, 2), 'utf-8');
    process.exit(1);
  }

  // Normalise
  const internships = rawItems
    .map(normalise)
    .filter((i) => i !== null && i.title);

  // Deduplicate by id
  const seen = new Set();
  const unique = [];
  for (const item of internships) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      unique.push(item);
    }
  }

  log(`Normalised ${unique.length} unique internships`);

  // Write
  writeFileSync(OUT_FILE, JSON.stringify(unique, null, 2), 'utf-8');
  log(`Saved to ${OUT_FILE}`);
  log(`Done – ${unique.length} internships scraped.`);
}

main().catch((err) => {
  console.error('[scrape-internships] Fatal error:', err);
  process.exit(1);
});
