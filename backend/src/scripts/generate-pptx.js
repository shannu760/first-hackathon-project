import pptxgen from 'pptxgenjs';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '../../../Saarathi_Pitch_Presentation.pptx');
const assetsDir = path.resolve(__dirname, '../../assets/images');

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9'; // 10.0 x 5.625 inches
  pres.title = 'Saarathi - From Eligibility to Employment';
  pres.author = 'Saarathi Hackathon Team';
  pres.subject = 'AI Student Career & Scholarship Companion Pitch Deck';

  // Design Theme Constants
  const BG_COLOR = '0B0F19';       // Deep Midnight Slate
  const PANEL_BG = '151C2C';       // Glass / Panel Dark Blue
  const WINE_ACCENT = '8A1C30';    // Royal Wine Primary
  const WINE_CARD = '4A101D';      // Dark Wine Card
  const WINE_BORDER = '74182F';    // Wine Border
  const CORAL_ACCENT = 'FA947E';   // Warm Coral Brand Accent
  const EMERALD_ACCENT = '10B981'; // Success Emerald
  const BLUE_ACCENT = '38BDF8';    // Tech Sky Blue
  const PURPLE_ACCENT = 'A855F7';  // AI Violet Accent
  const YELLOW_ACCENT = 'FBBF24';  // Warning Yellow
  const BORDER_COLOR = '243048';   // Card Border
  const TEXT_WHITE = 'FFFFFF';
  const TEXT_MUTED = '94A3B8';
  const TEXT_LIGHT = 'E2E8F0';

  const defaultShadow = { type: 'outer', color: '000000', blur: 6, offset: 3, opacity: 0.35 };

  // Helper to resolve image paths safely
  const getImgPath = (name) => {
    const full = path.join(assetsDir, name);
    return fs.existsSync(full) ? full : null;
  };

  // ==========================================
  // SLIDE 1: Title & Hero Vision
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };

    // Ambient background shapes
    slide.addShape(pres.ShapeType.ellipse, {
      x: 7.5, y: -1.0, w: 4.5, h: 4.5,
      fill: { color: '3A0A16', transparency: 65 },
      line: { color: '000000', transparency: 100 }
    });

    // Badge Pill
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 0.7, w: 4.6, h: 0.36,
      rectRadius: 0.18,
      fill: { color: WINE_CARD },
      line: { color: WINE_BORDER, width: 1 }
    });
    slide.addText('STUDENT CAREER & SCHOLARSHIP INTELLIGENCE • AY 2026-27', {
      x: 0.9, y: 0.7, w: 4.4, h: 0.36,
      fontFace: 'Arial', fontSize: 9.5, bold: true, color: CORAL_ACCENT, align: 'center', valign: 'middle'
    });

    // Main Title
    slide.addText('SAARATHI (సారథి)', {
      x: 0.8, y: 1.25, w: 5.2, h: 0.85,
      fontFace: 'Trebuchet MS', fontSize: 38, bold: true, color: TEXT_WHITE, letterSpacing: 1
    });

    // Subtitle
    slide.addText('From Eligibility to Employment', {
      x: 0.8, y: 2.15, w: 5.2, h: 0.45,
      fontFace: 'Trebuchet MS', fontSize: 21, bold: true, color: CORAL_ACCENT
    });

    // Vision Statement
    slide.addText(
      'India’s first production-grade deterministic AI student career companion. Predicts scholarship eligibility with explainable logic, bridges skill gaps with accredited courses, and copilots students from day one to their first job offer.',
      {
        x: 0.8, y: 2.75, w: 5.0, h: 1.05,
        fontFace: 'Arial', fontSize: 12, color: TEXT_MUTED, lineSpacingMultiple: 1.25
      }
    );

    // 3 Key Feature Pills
    const heroPills = [
      { text: '✓ 100% Deterministic Rule Engine', color: EMERALD_ACCENT },
      { text: '✓ Live Scrapers: Buddy4Study & Unstop', color: CORAL_ACCENT },
      { text: '✓ OpenRouter AI Copilot (Streaming SSE)', color: BLUE_ACCENT },
    ];
    heroPills.forEach((p, idx) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: 3.95 + idx * 0.45, w: 5.0, h: 0.36,
        rectRadius: 0.08,
        fill: { color: PANEL_BG },
        line: { color: BORDER_COLOR, width: 1 }
      });
      slide.addText(p.text, {
        x: 0.95, y: 3.95 + idx * 0.45, w: 4.7, h: 0.36,
        fontFace: 'Arial', fontSize: 10.5, bold: true, color: p.color, valign: 'middle'
      });
    });

    // Hero Image from internet on the right
    const heroImg = getImgPath('hero_students.jpg');
    if (heroImg) {
      slide.addImage({
        path: heroImg,
        x: 6.1, y: 0.8, w: 3.2, h: 4.2,
        rounding: true,
        shadow: defaultShadow
      });
      // Subtle caption badge over image
      slide.addShape(pres.ShapeType.roundRect, {
        x: 6.25, y: 4.5, w: 2.9, h: 0.38,
        rectRadius: 0.08,
        fill: { color: '000000', transparency: 30 },
        line: { color: WINE_ACCENT, width: 1 }
      });
      slide.addText('Empowering 40M+ Higher Ed Students', {
        x: 6.3, y: 4.5, w: 2.8, h: 0.38,
        fontFace: 'Arial', fontSize: 9.5, bold: true, color: TEXT_WHITE, align: 'center', valign: 'middle'
      });
    }

    slide.addNotes(
      'WELCOME JUDGES. We are excited to present SAARATHI. In India, over 40 million students are enrolled in higher education, but millions miss out on critical government aid, accredited learning paths, and internships because of fragmented portals and opaque criteria. Saarathi is an integrated, production-grade career companion that solves this problem end-to-end.'
    );
  }

  // ==========================================
  // SLIDE 2: The Core Problem
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };

    // Section header
    slide.addText('THE CRISIS IN HIGHER EDUCATION', {
      x: 0.8, y: 0.5, w: 8.4, h: 0.3,
      fontFace: 'Arial', fontSize: 10, bold: true, color: CORAL_ACCENT
    });
    slide.addText('Students Do Not Lack Ambition. They Lack Clarity.', {
      x: 0.8, y: 0.85, w: 8.4, h: 0.5,
      fontFace: 'Trebuchet MS', fontSize: 24, bold: true, color: TEXT_WHITE
    });

    // Left: High quality photo from internet (confusion/paperwork)
    const probImg = getImgPath('problem_confusion.jpg');
    if (probImg) {
      slide.addImage({
        path: probImg,
        x: 0.8, y: 1.5, w: 2.8, h: 3.5,
        rounding: true,
        shadow: defaultShadow
      });
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.95, y: 4.45, w: 2.5, h: 0.42,
        rectRadius: 0.08,
        fill: { color: '000000', transparency: 30 },
        line: { color: 'DC2626', width: 1 }
      });
      slide.addText('₹2,500+ Cr Funds Lapse Annually', {
        x: 1.0, y: 4.45, w: 2.4, h: 0.42,
        fontFace: 'Arial', fontSize: 9, bold: true, color: 'FCA5A5', align: 'center', valign: 'middle'
      });
    }

    // Right: 3 Problem Breakdown Cards
    const problems = [
      {
        num: '01',
        title: 'Fragmented & Opaque Schemes',
        desc: 'Over 250+ central & state schemes exist in siloed PDFs with complex eligibility formulas. Students get rejected simply because of 1 missing document or income ceiling calculation error.',
        tag: 'Information Asymmetry'
      },
      {
        num: '02',
        title: 'Superficial Internship Matching',
        desc: 'Mainstream job boards present vanity match scores without verifying CGPA, backlogs, branch relevance, or distinguishing required vs. preferred technical skills.',
        tag: 'Wasted Applications'
      },
      {
        num: '03',
        title: 'Unstructured Skill Gap Delta',
        desc: 'Students know what role they aspire to (e.g. AI/ML, Data Analyst), but have no actionable, accredited learning roadmap tailored to their daily time, budget, and language.',
        tag: 'Curriculum Mismatch'
      }
    ];

    problems.forEach((p, idx) => {
      const cardY = 1.5 + idx * 1.18;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 3.8, y: cardY, w: 5.4, h: 1.08,
        rectRadius: 0.1,
        fill: { color: PANEL_BG },
        line: { color: BORDER_COLOR, width: 1 },
        shadow: defaultShadow
      });

      // Accent strip
      slide.addShape(pres.ShapeType.roundRect, {
        x: 3.8, y: cardY, w: 0.12, h: 1.08,
        rectRadius: 0.05,
        fill: { color: idx === 0 ? 'EF4444' : idx === 1 ? YELLOW_ACCENT : BLUE_ACCENT },
        line: { color: '000000', transparency: 100 }
      });

      slide.addText(`${p.num}. ${p.title}`, {
        x: 4.1, y: cardY + 0.1, w: 3.7, h: 0.3,
        fontFace: 'Trebuchet MS', fontSize: 13, bold: true, color: TEXT_WHITE
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: 7.6, y: cardY + 0.1, w: 1.5, h: 0.25,
        rectRadius: 0.06,
        fill: { color: WINE_CARD },
        line: { color: WINE_BORDER, width: 0.8 }
      });
      slide.addText(p.tag, {
        x: 7.6, y: cardY + 0.1, w: 1.5, h: 0.25,
        fontFace: 'Arial', fontSize: 8, bold: true, color: CORAL_ACCENT, align: 'center', valign: 'middle'
      });

      slide.addText(p.desc, {
        x: 4.1, y: cardY + 0.42, w: 4.9, h: 0.58,
        fontFace: 'Arial', fontSize: 9.5, color: TEXT_MUTED, lineSpacingMultiple: 1.15
      });
    });

    slide.addNotes(
      'Notice the three core friction points on Slide 2. Government scholarship funds routinely lapse because students in Tier-2/3 institutions cannot decipher 40-page circulars. Simultaneously, generic job boards spray unvetted applicants. Saarathi addresses this structural gap with mathematical precision.'
    );
  }

  // ==========================================
  // SLIDE 3: The Solution Architecture
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };

    slide.addText('THE SAARATHI SOLUTION', {
      x: 0.8, y: 0.5, w: 8.4, h: 0.3,
      fontFace: 'Arial', fontSize: 10, bold: true, color: CORAL_ACCENT
    });
    slide.addText('One Unified Ecosystem: 4 Integrated Pillars', {
      x: 0.8, y: 0.85, w: 8.4, h: 0.5,
      fontFace: 'Trebuchet MS', fontSize: 24, bold: true, color: TEXT_WHITE
    });

    const pillars = [
      {
        title: 'Deterministic Eligibility',
        subtitle: 'Mathematical Rule Engine',
        desc: 'Weighted multi-factor scoring (Academics 25%, Income 25%, Education 25%, Category 15%, State 10%). Strict gatekeeping blocks false guarantees.',
        badge: 'Zero Hallucination',
        accent: EMERALD_ACCENT
      },
      {
        title: 'Live Ingestion Radar',
        subtitle: 'Automated Web Scraping',
        desc: 'Subagents scrape & normalize live feeds from Buddy4Study, Unstop, AICTE, and NSP. Provenance timestamps and stale-link detection.',
        badge: 'Live Data',
        accent: CORAL_ACCENT
      },
      {
        title: 'Skill-Gap & Courses',
        subtitle: 'NPTEL, SWAYAM & FreeCodeCamp',
        desc: 'Analyzes target role requirements vs. student profile. Maps precise missing skills into sequenced free accredited courses in Telugu & English.',
        badge: 'Curated Paths',
        accent: BLUE_ACCENT
      },
      {
        title: 'OpenRouter AI Copilot',
        subtitle: 'Streaming Assistant & Tutor',
        desc: 'Fast streaming explanations, ATS resume heuristic review, and 7/30/90-day action plans. Features 100% offline deterministic demo mode.',
        badge: 'Resilient AI',
        accent: PURPLE_ACCENT
      }
    ];

    pillars.forEach((p, idx) => {
      const xPos = 0.8 + idx * 2.15;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: 1.5, w: 2.05, h: 3.5,
        rectRadius: 0.12,
        fill: { color: PANEL_BG },
        line: { color: BORDER_COLOR, width: 1 },
        shadow: defaultShadow
      });

      // Header colored strip
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: 1.5, w: 2.05, h: 0.1,
        rectRadius: 0.05,
        fill: { color: p.accent },
        line: { color: '000000', transparency: 100 }
      });

      // Badge
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos + 0.2, y: 1.75, w: 1.65, h: 0.28,
        rectRadius: 0.06,
        fill: { color: WINE_CARD },
        line: { color: WINE_BORDER, width: 0.8 }
      });
      slide.addText(p.badge, {
        x: xPos + 0.2, y: 1.75, w: 1.65, h: 0.28,
        fontFace: 'Arial', fontSize: 8.5, bold: true, color: p.accent, align: 'center', valign: 'middle'
      });

      // Pillar Title
      slide.addText(p.title, {
        x: xPos + 0.15, y: 2.15, w: 1.75, h: 0.55,
        fontFace: 'Trebuchet MS', fontSize: 13, bold: true, color: TEXT_WHITE, align: 'center'
      });

      // Subtitle
      slide.addText(p.subtitle, {
        x: xPos + 0.15, y: 2.7, w: 1.75, h: 0.35,
        fontFace: 'Arial', fontSize: 8.5, bold: true, color: CORAL_ACCENT, align: 'center'
      });

      // Description
      slide.addText(p.desc, {
        x: xPos + 0.15, y: 3.1, w: 1.75, h: 1.75,
        fontFace: 'Arial', fontSize: 9.5, color: TEXT_MUTED, lineSpacingMultiple: 1.15, align: 'left'
      });
    });

    slide.addNotes(
      'Slide 3 illustrates Saarathi’s four unified pillars. Each pillar acts in concert: the Deterministic Engine provides trust; the Ingestion Radar provides freshness; the Skill Gap engine provides direction; and the AI Copilot provides personalized mentorship. This covers the entire student lifecycle.'
    );
  }

  // ==========================================
  // SLIDE 4: Deterministic Eligibility Engine
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };

    slide.addText('CORE ALGORITHMIC RIGOR', {
      x: 0.8, y: 0.5, w: 8.4, h: 0.3,
      fontFace: 'Arial', fontSize: 10, bold: true, color: CORAL_ACCENT
    });
    slide.addText('Deterministic Scoring: Why AI Never Evaluates Eligibility', {
      x: 0.8, y: 0.85, w: 8.4, h: 0.5,
      fontFace: 'Trebuchet MS', fontSize: 24, bold: true, color: TEXT_WHITE
    });

    // Left Panel: Weighting formula & status bands
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.5, w: 4.8, h: 3.5,
      rectRadius: 0.12,
      fill: { color: PANEL_BG },
      line: { color: BORDER_COLOR, width: 1 },
      shadow: defaultShadow
    });

    slide.addText('Mathematical Scoring Matrix (100 Point Scale)', {
      x: 1.0, y: 1.7, w: 4.4, h: 0.35,
      fontFace: 'Trebuchet MS', fontSize: 13, bold: true, color: CORAL_ACCENT
    });

    const weights = [
      { factor: 'Academic Marks / CGPA', weight: '25%', criteria: 'Meets minimum published cutoffs' },
      { factor: 'Annual Family Income', weight: '25%', criteria: 'Ceiling checks (e.g. < ₹2.5L / ₹4.5L / ₹8L)' },
      { factor: 'Education Level & Year', weight: '25%', criteria: 'UG, Diploma, PG, or Final Year verification' },
      { factor: 'Category / Reservation', weight: '15%', criteria: 'SC, ST, OBC, General-EWS specific rules' },
      { factor: 'State / Domicile Fit', weight: '10%', criteria: 'Home State vs. State of Study criteria' },
    ];

    weights.forEach((w, idx) => {
      const rowY = 2.1 + idx * 0.42;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 1.0, y: rowY, w: 4.4, h: 0.36,
        rectRadius: 0.06,
        fill: { color: idx % 2 === 0 ? '111726' : '182033' },
        line: { color: '000000', transparency: 100 }
      });
      slide.addText(w.factor, {
        x: 1.1, y: rowY, w: 2.3, h: 0.36,
        fontFace: 'Arial', fontSize: 9.5, bold: true, color: TEXT_WHITE, valign: 'middle'
      });
      slide.addText(w.weight, {
        x: 3.4, y: rowY, w: 0.6, h: 0.36,
        fontFace: 'Trebuchet MS', fontSize: 10, bold: true, color: EMERALD_ACCENT, align: 'center', valign: 'middle'
      });
      slide.addText(w.criteria, {
        x: 4.0, y: rowY, w: 1.35, h: 0.36,
        fontFace: 'Arial', fontSize: 8, color: TEXT_MUTED, valign: 'middle'
      });
    });

    // Right Panel: Strict Gatekeeping & Realism Caps
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.8, y: 1.5, w: 3.4, h: 3.5,
      rectRadius: 0.12,
      fill: { color: PANEL_BG },
      line: { color: BORDER_COLOR, width: 1 },
      shadow: defaultShadow
    });

    slide.addText('Strict Legal Gatekeeping Rules', {
      x: 6.0, y: 1.7, w: 3.0, h: 0.35,
      fontFace: 'Trebuchet MS', fontSize: 13, bold: true, color: TEXT_WHITE
    });

    const statusRules = [
      {
        title: 'Likely Eligible (75% - 100%)',
        desc: 'All mandatory criteria passed AND required documents (income, caste) verified.',
        badgeColor: EMERALD_ACCENT,
        badgeText: 'FULL PASS'
      },
      {
        title: 'Conditionally Eligible (35% - 58%)',
        desc: 'Capped score! Academic match holds, but certificates or domicile pending verification. Never shown as 80%+!',
        badgeColor: YELLOW_ACCENT,
        badgeText: 'CAPPED REALISM'
      },
      {
        title: 'Likely Ineligible (0% - 25%)',
        desc: 'Any mandatory threshold failed (e.g. income exceeds ceiling). Blocks false hope.',
        badgeColor: 'EF4444',
        badgeText: 'STRICT BLOCKED'
      }
    ];

    statusRules.forEach((s, idx) => {
      const boxY = 2.15 + idx * 0.9;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 6.0, y: boxY, w: 3.0, h: 0.8,
        rectRadius: 0.08,
        fill: { color: WINE_CARD },
        line: { color: WINE_BORDER, width: 0.8 }
      });
      slide.addText(s.title, {
        x: 6.1, y: boxY + 0.08, w: 2.8, h: 0.25,
        fontFace: 'Trebuchet MS', fontSize: 10, bold: true, color: s.badgeColor
      });
      slide.addText(s.desc, {
        x: 6.1, y: boxY + 0.32, w: 2.8, h: 0.42,
        fontFace: 'Arial', fontSize: 8.5, color: TEXT_LIGHT, lineSpacingMultiple: 1.1
      });
    });

    slide.addNotes(
      'Judges, pay special attention to Slide 4. A classic failure of amateur AI hackathons is having an LLM hallucinate: "You look eligible for ₹50,000!". If a student is missing their MeeSeva Income Certificate, Saarathi strictly caps conditional eligibility at 45%-55% and gives them a document task. We never give false 80%+ scores.'
    );
  }

  // ==========================================
  // SLIDE 5: Live Ingestion Pipeline & Scrapers
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };

    slide.addText('REAL-TIME OPPORTUNITY RADAR', {
      x: 0.8, y: 0.5, w: 8.4, h: 0.3,
      fontFace: 'Arial', fontSize: 10, bold: true, color: CORAL_ACCENT
    });
    slide.addText('Autonomous Multi-Source Ingestion & Verification', {
      x: 0.8, y: 0.85, w: 8.4, h: 0.5,
      fontFace: 'Trebuchet MS', fontSize: 24, bold: true, color: TEXT_WHITE
    });

    // Ingestion Flow: 4 Pipeline Steps
    const pipelineSteps = [
      { step: '01', title: 'Targeted Scrapers', desc: 'Subagents connect to Buddy4Study, Unstop, AICTE & NSP with automated rate limiting and robots compliance.' },
      { step: '02', title: 'Schema Normalizer', desc: 'Extracts deadlines, CGPA bars, stipend amounts, and required document checklists into normalized JSON.' },
      { step: '03', title: 'Freshness & De-dup', desc: 'Detects changed deadlines, merges duplicates, flags stale notices, and records fetch timestamps.' },
      { step: '04', title: 'Targeted Recalc', desc: 'Queued event triggers recomputation only for affected student profiles, keeping cache lightning-fast.' },
    ];

    pipelineSteps.forEach((s, idx) => {
      const xPos = 0.8 + idx * 2.15;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: 1.5, w: 2.05, h: 1.5,
        rectRadius: 0.1,
        fill: { color: PANEL_BG },
        line: { color: BORDER_COLOR, width: 1 },
        shadow: defaultShadow
      });
      slide.addText(s.step, {
        x: xPos + 0.15, y: 1.6, w: 0.5, h: 0.3,
        fontFace: 'Trebuchet MS', fontSize: 14, bold: true, color: CORAL_ACCENT
      });
      slide.addText(s.title, {
        x: xPos + 0.65, y: 1.6, w: 1.3, h: 0.3,
        fontFace: 'Trebuchet MS', fontSize: 10.5, bold: true, color: TEXT_WHITE
      });
      slide.addText(s.desc, {
        x: xPos + 0.15, y: 1.95, w: 1.75, h: 0.95,
        fontFace: 'Arial', fontSize: 8.5, color: TEXT_MUTED, lineSpacingMultiple: 1.15
      });
    });

    // Bottom Stats & Live Database Metrics
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 3.2, w: 8.4, h: 1.8,
      rectRadius: 0.12,
      fill: { color: '101726' },
      line: { color: WINE_BORDER, width: 1 },
      shadow: defaultShadow
    });

    slide.addText('PRODUCTION DATA INTEGRITY STATUS (LOCAL SQLITE STORE)', {
      x: 1.0, y: 3.35, w: 8.0, h: 0.3,
      fontFace: 'Trebuchet MS', fontSize: 11, bold: true, color: CORAL_ACCENT
    });

    const liveStats = [
      { label: 'Verified Government Schemes', value: '13', sub: 'PM-USP, AICTE Swanath, Post-Matric' },
      { label: 'Active Curated Internships', value: '35', sub: 'Tech, AI/ML, Data Analyst, Embedded' },
      { label: 'Accredited Free Courses', value: '42', sub: 'SWAYAM, NPTEL, freeCodeCamp' },
      { label: 'Provenanced Source Feeds', value: '100%', sub: 'Timestamped official application URLs' },
    ];

    liveStats.forEach((st, idx) => {
      const statX = 1.0 + idx * 2.05;
      slide.addText(st.value, {
        x: statX, y: 3.75, w: 1.9, h: 0.55,
        fontFace: 'Trebuchet MS', fontSize: 28, bold: true, color: EMERALD_ACCENT
      });
      slide.addText(st.label, {
        x: statX, y: 4.3, w: 1.9, h: 0.3,
        fontFace: 'Arial', fontSize: 9.5, bold: true, color: TEXT_WHITE
      });
      slide.addText(st.sub, {
        x: statX, y: 4.58, w: 1.9, h: 0.3,
        fontFace: 'Arial', fontSize: 8, color: TEXT_MUTED
      });
    });

    slide.addNotes(
      'Slide 5 highlights our production data pipeline. Saarathi does not show hardcoded fake listings. We run an automated ingestion pipeline that indexes schemes, scholarships, and internships directly into SQLite with verified official URLs, deadlines, and eligibility criteria.'
    );
  }

  // ==========================================
  // SLIDE 6: Skill-Gap Analyzer & Learning Paths
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };

    slide.addText('CLOSING THE EMPLOYABILITY DELTA', {
      x: 0.8, y: 0.5, w: 8.4, h: 0.3,
      fontFace: 'Arial', fontSize: 10, bold: true, color: CORAL_ACCENT
    });
    slide.addText('Skill-Gap Analyzer & Accredited Learning Pathways', {
      x: 0.8, y: 0.85, w: 8.4, h: 0.5,
      fontFace: 'Trebuchet MS', fontSize: 24, bold: true, color: TEXT_WHITE
    });

    // Left: Photo of student coding
    const codeImg = getImgPath('student_coding.jpg');
    if (codeImg) {
      slide.addImage({
        path: codeImg,
        x: 0.8, y: 1.5, w: 2.8, h: 3.5,
        rounding: true,
        shadow: defaultShadow
      });
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.95, y: 4.45, w: 2.5, h: 0.42,
        rectRadius: 0.08,
        fill: { color: '000000', transparency: 30 },
        line: { color: BLUE_ACCENT, width: 1 }
      });
      slide.addText('Tailored to Telugu & English', {
        x: 1.0, y: 4.45, w: 2.4, h: 0.42,
        fontFace: 'Arial', fontSize: 9, bold: true, color: BLUE_ACCENT, align: 'center', valign: 'middle'
      });
    }

    // Right: Concrete Case Study (AI/ML Research Intern)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 3.8, y: 1.5, w: 5.4, h: 3.5,
      rectRadius: 0.12,
      fill: { color: PANEL_BG },
      line: { color: BORDER_COLOR, width: 1 },
      shadow: defaultShadow
    });

    slide.addText('Target Role: AI / Machine Learning Intern', {
      x: 4.0, y: 1.7, w: 5.0, h: 0.35,
      fontFace: 'Trebuchet MS', fontSize: 13, bold: true, color: TEXT_WHITE
    });

    // Current vs Missing Skills comparison
    slide.addShape(pres.ShapeType.roundRect, {
      x: 4.0, y: 2.1, w: 2.4, h: 0.9,
      rectRadius: 0.08,
      fill: { color: '0E2E1E' },
      line: { color: EMERALD_ACCENT, width: 1 }
    });
    slide.addText('VERIFIED MATCHED SKILLS (40%)', {
      x: 4.1, y: 2.18, w: 2.2, h: 0.2,
      fontFace: 'Arial', fontSize: 8, bold: true, color: EMERALD_ACCENT
    });
    slide.addText('• Python (Intermediate)\n• Git & GitHub Versioning\n• Basic Linear Algebra', {
      x: 4.1, y: 2.4, w: 2.2, h: 0.55,
      fontFace: 'Arial', fontSize: 8.5, color: TEXT_LIGHT, lineSpacingMultiple: 1.15
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.6, y: 2.1, w: 2.4, h: 0.9,
      rectRadius: 0.08,
      fill: { color: '301217' },
      line: { color: 'EF4444', width: 1 }
    });
    slide.addText('IDENTIFIED SKILL GAPS (60%)', {
      x: 6.7, y: 2.18, w: 2.2, h: 0.2,
      fontFace: 'Arial', fontSize: 8, bold: true, color: 'FCA5A5'
    });
    slide.addText('• Pandas / NumPy Data Wrangling\n• Deep Learning with PyTorch\n• Model Serving (FastAPI / Render)', {
      x: 6.7, y: 2.4, w: 2.2, h: 0.55,
      fontFace: 'Arial', fontSize: 8.5, color: TEXT_LIGHT, lineSpacingMultiple: 1.15
    });

    // 3 Step Sequence to Bridge Gap
    slide.addText('Actionable 3-Step Bridging Pathway (100% Free):', {
      x: 4.0, y: 3.15, w: 5.0, h: 0.25,
      fontFace: 'Trebuchet MS', fontSize: 10.5, bold: true, color: CORAL_ACCENT
    });

    const pathSteps = [
      { step: 'Course 1', title: 'Python for Data Science (NPTEL / Swayam)', time: '3 weeks • ₹0 Verified', tag: 'Accredited' },
      { step: 'Course 2', title: 'Deep Learning with PyTorch (freeCodeCamp)', time: '4 weeks • Hands-on Projects', tag: 'Practical' },
      { step: 'Capstone', title: 'Deploy Predictive API on Render with Documentation', time: '1 week • Portfolio asset', tag: 'Proof of Work' },
    ];

    pathSteps.forEach((ps, idx) => {
      const stepY = 3.45 + idx * 0.48;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 4.0, y: stepY, w: 5.0, h: 0.42,
        rectRadius: 0.06,
        fill: { color: idx === 2 ? WINE_CARD : '111726' },
        line: { color: idx === 2 ? WINE_BORDER : BORDER_COLOR, width: 0.8 }
      });
      slide.addText(`${ps.step}: ${ps.title}`, {
        x: 4.15, y: stepY + 0.04, w: 3.6, h: 0.2,
        fontFace: 'Arial', fontSize: 9, bold: true, color: TEXT_WHITE
      });
      slide.addText(ps.time, {
        x: 4.15, y: stepY + 0.22, w: 3.6, h: 0.16,
        fontFace: 'Arial', fontSize: 7.5, color: TEXT_MUTED
      });
      slide.addShape(pres.ShapeType.roundRect, {
        x: 7.8, y: stepY + 0.08, w: 1.1, h: 0.25,
        rectRadius: 0.05,
        fill: { color: '000000', transparency: 30 },
        line: { color: CORAL_ACCENT, width: 0.6 }
      });
      slide.addText(ps.tag, {
        x: 7.8, y: stepY + 0.08, w: 1.1, h: 0.25,
        fontFace: 'Arial', fontSize: 7.5, bold: true, color: CORAL_ACCENT, align: 'center', valign: 'middle'
      });
    });

    slide.addNotes(
      'Slide 6 proves that Saarathi does not stop at diagnosing gaps; it bridges them. We map role taxonomies to free accredited courses from NPTEL, SWAYAM, and freeCodeCamp. Every course is evaluated against the student’s daily time availability, budget, and language.'
    );
  }

  // ==========================================
  // SLIDE 7: OpenRouter AI Copilot & Resilient AI
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };

    slide.addText('HACKATHON-READY AI ARCHITECTURE', {
      x: 0.8, y: 0.5, w: 8.4, h: 0.3,
      fontFace: 'Arial', fontSize: 10, bold: true, color: CORAL_ACCENT
    });
    slide.addText('Production OpenRouter AI with Deterministic Fallbacks', {
      x: 0.8, y: 0.85, w: 8.4, h: 0.5,
      fontFace: 'Trebuchet MS', fontSize: 24, bold: true, color: TEXT_WHITE
    });

    // Left: Photo of AI mentorship / pairing
    const aiImg = getImgPath('copilot_mentor.jpg');
    if (aiImg) {
      slide.addImage({
        path: aiImg,
        x: 0.8, y: 1.5, w: 2.8, h: 3.5,
        rounding: true,
        shadow: defaultShadow
      });
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.95, y: 4.45, w: 2.5, h: 0.42,
        rectRadius: 0.08,
        fill: { color: '000000', transparency: 30 },
        line: { color: PURPLE_ACCENT, width: 1 }
      });
      slide.addText('Bilingual: Telugu & English', {
        x: 1.0, y: 4.45, w: 2.4, h: 0.42,
        fontFace: 'Arial', fontSize: 9, bold: true, color: 'D8B4FE', align: 'center', valign: 'middle'
      });
    }

    // Right: 4 AI Resiliency Features
    const aiFeatures = [
      {
        title: 'OpenRouter Model Fallback Chain',
        desc: 'Calls OpenAI-compatible OpenRouter API. If the primary model hits 429 rate limit or quota exhaustion, it falls back instantly to secondary models in the chain.',
        tag: 'High Availability',
        color: BLUE_ACCENT
      },
      {
        title: '100% Offline Demo Mode (AI_DEMO_MODE=true)',
        desc: 'Guarantees the pitch will never fail even if Wi-Fi drops. 5 pre-validated golden prompts answer seamlessly with zero external API calls.',
        tag: 'Stage Reliability',
        color: EMERALD_ACCENT
      },
      {
        title: 'Zero PII Leakage Privacy Guard',
        desc: 'No student names, emails, phone numbers, or exact financial figures are ever passed into LLM prompts. Only anonymized academic and skill tags are transmitted.',
        tag: 'Student Privacy',
        color: YELLOW_ACCENT
      },
      {
        title: 'Anti-Hallucination Verification Layer',
        desc: 'All dates, scheme names, and financial amounts generated in AI explanations are verified against the authoritative database record before rendering in UI.',
        tag: 'Truth Verified',
        color: CORAL_ACCENT
      }
    ];

    aiFeatures.forEach((f, idx) => {
      const cardY = 1.5 + idx * 0.88;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 3.8, y: cardY, w: 5.4, h: 0.8,
        rectRadius: 0.08,
        fill: { color: PANEL_BG },
        line: { color: BORDER_COLOR, width: 1 },
        shadow: defaultShadow
      });

      slide.addText(f.title, {
        x: 4.0, y: cardY + 0.08, w: 3.8, h: 0.25,
        fontFace: 'Trebuchet MS', fontSize: 11, bold: true, color: TEXT_WHITE
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: 7.7, y: cardY + 0.08, w: 1.35, h: 0.22,
        rectRadius: 0.05,
        fill: { color: WINE_CARD },
        line: { color: WINE_BORDER, width: 0.7 }
      });
      slide.addText(f.tag, {
        x: 7.7, y: cardY + 0.08, w: 1.35, h: 0.22,
        fontFace: 'Arial', fontSize: 7.5, bold: true, color: f.color, align: 'center', valign: 'middle'
      });

      slide.addText(f.desc, {
        x: 4.0, y: cardY + 0.32, w: 5.0, h: 0.42,
        fontFace: 'Arial', fontSize: 8.5, color: TEXT_MUTED, lineSpacingMultiple: 1.1
      });
    });

    slide.addNotes(
      'Slide 7 demonstrates our production AI engineering. We do not rely on fragile single-key wrappers. OpenRouter gives us model-swapping resilience. In addition, our offline demo mode ensures the live presentation can run without internet. Furthermore, zero PII is ever sent to third-party LLMs.'
    );
  }

  // ==========================================
  // SLIDE 8: ATS Resume Builder & Application Tracker
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };

    slide.addText('COMPLETING THE CAREER CYCLE', {
      x: 0.8, y: 0.5, w: 8.4, h: 0.3,
      fontFace: 'Arial', fontSize: 10, bold: true, color: CORAL_ACCENT
    });
    slide.addText('ATS Resume Builder & Kanban Application Tracker', {
      x: 0.8, y: 0.85, w: 8.4, h: 0.5,
      fontFace: 'Trebuchet MS', fontSize: 24, bold: true, color: TEXT_WHITE
    });

    // Left Column: ATS Resume Builder
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.5, w: 4.0, h: 3.5,
      rectRadius: 0.12,
      fill: { color: PANEL_BG },
      line: { color: BORDER_COLOR, width: 1 },
      shadow: defaultShadow
    });

    slide.addText('ATS Heuristic Resume Engine', {
      x: 1.0, y: 1.7, w: 3.6, h: 0.35,
      fontFace: 'Trebuchet MS', fontSize: 13, bold: true, color: CORAL_ACCENT
    });

    const resumePoints = [
      { label: 'Role-Specific Keyword Analysis', desc: 'Compares student projects and coursework against targeted internship JD requirements.' },
      { label: 'Formatting & Length Checks', desc: 'Warns against tables, multi-column layouts, and unreadable graphics that trip enterprise ATS parsers.' },
      { label: 'Production PDFKit Export', desc: 'Generates clean, selectable, single-page vector PDFs directly from database profile with 1 click.' },
    ];

    resumePoints.forEach((rp, idx) => {
      const boxY = 2.15 + idx * 0.85;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 1.0, y: boxY, w: 3.6, h: 0.75,
        rectRadius: 0.08,
        fill: { color: '101726' },
        line: { color: BORDER_COLOR, width: 0.8 }
      });
      slide.addText(rp.label, {
        x: 1.15, y: boxY + 0.08, w: 3.3, h: 0.22,
        fontFace: 'Arial', fontSize: 9.5, bold: true, color: TEXT_WHITE
      });
      slide.addText(rp.desc, {
        x: 1.15, y: boxY + 0.3, w: 3.3, h: 0.4,
        fontFace: 'Arial', fontSize: 8.5, color: TEXT_MUTED, lineSpacingMultiple: 1.1
      });
    });

    // Right Column: Kanban Application Tracker
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.2, y: 1.5, w: 4.0, h: 3.5,
      rectRadius: 0.12,
      fill: { color: PANEL_BG },
      line: { color: BORDER_COLOR, width: 1 },
      shadow: defaultShadow
    });

    slide.addText('Application Radar & Kanban Tracker', {
      x: 5.4, y: 1.7, w: 3.6, h: 0.35,
      fontFace: 'Trebuchet MS', fontSize: 13, bold: true, color: BLUE_ACCENT
    });

    const kanbanCols = [
      { col: 'To Apply (3)', color: '94A3B8', note: 'AICTE Swanath, Google STEP' },
      { col: 'Applied (4)', color: BLUE_ACCENT, note: 'TCS Research Intern, Post-Matric' },
      { col: 'Under Review / Interview (2)', color: YELLOW_ACCENT, note: 'ISRO Fellowship, Razorpay' },
      { col: 'Offer Extended (1)', color: EMERALD_ACCENT, note: 'Accenture Cloud Intern (₹30k/mo)' },
    ];

    kanbanCols.forEach((kc, idx) => {
      const colY = 2.15 + idx * 0.65;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 5.4, y: colY, w: 3.6, h: 0.55,
        rectRadius: 0.06,
        fill: { color: WINE_CARD },
        line: { color: WINE_BORDER, width: 0.8 }
      });
      slide.addText(kc.col, {
        x: 5.55, y: colY + 0.06, w: 2.2, h: 0.22,
        fontFace: 'Trebuchet MS', fontSize: 9.5, bold: true, color: kc.color
      });
      slide.addText(kc.note, {
        x: 5.55, y: colY + 0.28, w: 3.3, h: 0.2,
        fontFace: 'Arial', fontSize: 8, color: TEXT_LIGHT
      });
    });

    slide.addNotes(
      'Slide 8 shows how Saarathi closes the loop. Many portals end at search. Saarathi generates an ATS-ready PDF resume and provides a full Kanban pipeline with deadline notifications so students never miss a follow-up or interview round.'
    );
  }

  // ==========================================
  // SLIDE 9: Business Model & Scalability
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };

    slide.addText('SUSTAINABILITY & REVENUE MODEL', {
      x: 0.8, y: 0.5, w: 8.4, h: 0.3,
      fontFace: 'Arial', fontSize: 10, bold: true, color: CORAL_ACCENT
    });
    slide.addText('Freemium B2C & Institutional B2B Monetization', {
      x: 0.8, y: 0.85, w: 8.4, h: 0.5,
      fontFace: 'Trebuchet MS', fontSize: 24, bold: true, color: TEXT_WHITE
    });

    const pricingTiers = [
      {
        name: 'Free Forever',
        price: '₹0',
        period: 'for all students',
        accent: '94A3B8',
        features: [
          'Basic student profile',
          '5 scheme predictions / month',
          '5 internship match reports',
          'Basic skill-gap analysis',
          'Community forums'
        ]
      },
      {
        name: 'Student Pro',
        price: '₹99',
        period: 'per month (or ₹999/yr)',
        accent: CORAL_ACCENT,
        badge: 'MOST POPULAR',
        features: [
          'Unlimited scheme predictions',
          'Unlimited internship fit scores',
          'OpenRouter AI bilingual copilot',
          'ATS resume builder & PDF export',
          'Priority deadline radar alerts'
        ]
      },
      {
        name: 'College Enterprise',
        price: 'Custom',
        period: 'per institution / year',
        accent: BLUE_ACCENT,
        features: [
          'Centralized placement dashboard',
          'NAAC / NIRF accreditation data',
          'Bulk student cohort onboarding',
          'Custom department skill analytics',
          'Dedicated support manager'
        ]
      }
    ];

    pricingTiers.forEach((tier, idx) => {
      const cardX = 0.8 + idx * 2.9;
      slide.addShape(pres.ShapeType.roundRect, {
        x: cardX, y: 1.5, w: 2.65, h: 3.5,
        rectRadius: 0.12,
        fill: { color: idx === 1 ? '1D1322' : PANEL_BG },
        line: { color: idx === 1 ? WINE_ACCENT : BORDER_COLOR, width: idx === 1 ? 1.5 : 1 },
        shadow: defaultShadow
      });

      if (tier.badge) {
        slide.addShape(pres.ShapeType.roundRect, {
          x: cardX + 0.5, y: 1.35, w: 1.65, h: 0.28,
          rectRadius: 0.14,
          fill: { color: WINE_ACCENT },
          line: { color: CORAL_ACCENT, width: 0.8 }
        });
        slide.addText(tier.badge, {
          x: cardX + 0.5, y: 1.35, w: 1.65, h: 0.28,
          fontFace: 'Arial', fontSize: 8, bold: true, color: TEXT_WHITE, align: 'center', valign: 'middle'
        });
      }

      slide.addText(tier.name, {
        x: cardX + 0.2, y: 1.7, w: 2.25, h: 0.35,
        fontFace: 'Trebuchet MS', fontSize: 13, bold: true, color: tier.accent, align: 'center'
      });

      slide.addText(tier.price, {
        x: cardX + 0.2, y: 2.05, w: 2.25, h: 0.55,
        fontFace: 'Trebuchet MS', fontSize: 26, bold: true, color: TEXT_WHITE, align: 'center'
      });

      slide.addText(tier.period, {
        x: cardX + 0.2, y: 2.55, w: 2.25, h: 0.25,
        fontFace: 'Arial', fontSize: 8.5, color: TEXT_MUTED, align: 'center'
      });

      tier.features.forEach((feat, fIdx) => {
        const featY = 2.9 + fIdx * 0.36;
        slide.addText(`✓ ${feat}`, {
          x: cardX + 0.2, y: featY, w: 2.25, h: 0.32,
          fontFace: 'Arial', fontSize: 8.5, color: TEXT_LIGHT
        });
      });
    });

    slide.addNotes(
      'Slide 9 outlines our clear monetization path. ₹99 per month is lower than a single movie ticket or fast food snack, perfectly tuned for Indian pocket-money dynamics. For colleges, Saarathi provides NIRF and NAAC accreditation placement reporting, providing high-ACV enterprise B2B revenue.'
    );
  }

  // ==========================================
  // SLIDE 10: Roadmap, Impact & Closing Vision
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };

    slide.addText('FUTURE ROADMAP & SOCIAL IMPACT', {
      x: 0.8, y: 0.5, w: 8.4, h: 0.3,
      fontFace: 'Arial', fontSize: 10, bold: true, color: CORAL_ACCENT
    });
    slide.addText('Empowering 40 Million Indian Higher Education Students', {
      x: 0.8, y: 0.85, w: 8.4, h: 0.5,
      fontFace: 'Trebuchet MS', fontSize: 24, bold: true, color: TEXT_WHITE
    });

    // Left: Photo of student employment success
    const succImg = getImgPath('success_employment.jpg');
    if (succImg) {
      slide.addImage({
        path: succImg,
        x: 0.8, y: 1.5, w: 2.8, h: 3.5,
        rounding: true,
        shadow: defaultShadow
      });
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.95, y: 4.45, w: 2.5, h: 0.42,
        rectRadius: 0.08,
        fill: { color: '000000', transparency: 30 },
        line: { color: EMERALD_ACCENT, width: 1 }
      });
      slide.addText('From Classroom to Career', {
        x: 1.0, y: 4.45, w: 2.4, h: 0.42,
        fontFace: 'Arial', fontSize: 9, bold: true, color: EMERALD_ACCENT, align: 'center', valign: 'middle'
      });
    }

    // Right: 3 Roadmap Horizons
    const roadmap = [
      {
        phase: 'PHASE 1 (COMPLETED - MVP)',
        title: 'Full-Stack Foundation & Deterministic Engine',
        desc: 'Production SQLite database, 13 verified schemes, 35 internships, OpenRouter AI streaming, bilingual Telugu/English support, ATS PDF resume builder.'
      },
      {
        phase: 'PHASE 2 (Q2 2026 - SCALING)',
        title: 'WhatsApp Deadline Radar & DigiLocker Verification',
        desc: 'Proactive SMS/WhatsApp reminders 48 hours before scheme deadlines. Instant 1-click document authentication via National DigiLocker API.'
      },
      {
        phase: 'PHASE 3 (Q3-Q4 2026 - ECOSYSTEM)',
        title: 'Direct Recruiter Portal & Pan-India State Expansion',
        desc: 'Verified candidate matching for corporate hiring partners. Automated ingestion of all 28 state scholarship portals and university placement cells.'
      }
    ];

    roadmap.forEach((rm, idx) => {
      const cardY = 1.5 + idx * 1.18;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 3.8, y: cardY, w: 5.4, h: 1.08,
        rectRadius: 0.1,
        fill: { color: PANEL_BG },
        line: { color: idx === 0 ? EMERALD_ACCENT : BORDER_COLOR, width: 1 },
        shadow: defaultShadow
      });

      slide.addText(rm.phase, {
        x: 4.0, y: cardY + 0.1, w: 5.0, h: 0.22,
        fontFace: 'Trebuchet MS', fontSize: 8.5, bold: true, color: idx === 0 ? EMERALD_ACCENT : CORAL_ACCENT
      });

      slide.addText(rm.title, {
        x: 4.0, y: cardY + 0.32, w: 5.0, h: 0.28,
        fontFace: 'Trebuchet MS', fontSize: 11, bold: true, color: TEXT_WHITE
      });

      slide.addText(rm.desc, {
        x: 4.0, y: cardY + 0.58, w: 5.0, h: 0.45,
        fontFace: 'Arial', fontSize: 8.5, color: TEXT_MUTED, lineSpacingMultiple: 1.15
      });
    });

    slide.addNotes(
      'To conclude: Saarathi is not just a hackathon prototype—it is a mission-critical platform designed for the 40 million students of Bharat. We bridge the gap between eligibility and employment. Thank you, and we welcome your questions and invite you to test drive the live platform now!'
    );
  }

  // Save the presentation
  await pres.writeFile({ fileName: outputPath });
  console.log(`Presentation written successfully to: ${outputPath}`);
}

buildPresentation().catch(err => {
  console.error('Failed to build presentation:', err);
  process.exit(1);
});
