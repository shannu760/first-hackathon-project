import argon2 from '@node-rs/argon2';
import { db, initDatabase, query } from '../db/index.js';

async function seed() {
  console.log('[Seed] Initializing database schema...');
  initDatabase();

  console.log('[Seed] Generating password hash for demo user...');
  const passwordHash = await argon2.hash('Password@123', {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1
  });

  const demoUserId = 'usr-demo-student-01';

  // 1. Users
  console.log('[Seed] Seeding demo user...');
  query.run(`
    INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferred_language, created_at, updated_at)
    VALUES (?, 'demo@saarathi.edu.in', ?, 'Ananya Sharma', '+91 98765 43210', 'student', 1, 'en', datetime('now'), datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      password_hash = excluded.password_hash,
      full_name = excluded.full_name,
      updated_at = datetime('now')
  `, demoUserId, passwordHash);

  // 2. Student Profile
  console.log('[Seed] Seeding student profile...');
  query.run(`
    INSERT INTO student_profiles (
      id, user_id, student_id, full_name, email, phone,
      state, district, home_state, education_level, institution, course, specialization,
      current_year, graduation_year, cgpa, percentage, grading_scale, backlogs, entrance_exam,
      family_income_inr, category, gender, disability_status,
      has_income_certificate, has_category_certificate, has_bank_account,
      target_role, updated_at
    ) VALUES (
      'prof-demo-01', ?, ?, 'Ananya Sharma', 'demo@saarathi.edu.in', '+91 98765 43210',
      'Telangana', 'Hyderabad', 'Telangana', 'UG', 'JNTU Hyderabad', 'B.Tech', 'Computer Science & Engineering',
      3, 2026, 8.5, 85.0, '10', 0, 'TS EAMCET (Rank: 4210)',
      300000, 'General', 'Female', 'None',
      1, 0, 1,
      'Software Development Intern', datetime('now')
    )
    ON CONFLICT(id) DO UPDATE SET
      education_level = excluded.education_level,
      percentage = excluded.percentage,
      cgpa = excluded.cgpa,
      family_income_inr = excluded.family_income_inr,
      updated_at = datetime('now')
  `, demoUserId, demoUserId);

  // 3. Career Goals
  console.log('[Seed] Seeding career goals...');
  query.run(`
    INSERT INTO student_career_goals (
      id, student_id, target_roles_json, internship_mode, min_stipend_inr,
      preferred_locations_json, start_timeline, experience_level, updated_at
    ) VALUES (
      'goal-demo-01', ?, '["Software Development Intern", "Backend Developer Intern"]',
      'remote', 15000, '["Remote", "Hyderabad", "Bengaluru"]', 'immediately', 'Student', datetime('now')
    )
    ON CONFLICT(student_id) DO UPDATE SET
      internship_mode = excluded.internship_mode,
      target_roles_json = excluded.target_roles_json,
      updated_at = datetime('now')
  `, demoUserId);

  // 4. Learning Preferences
  console.log('[Seed] Seeding learning preferences...');
  query.run(`
    INSERT INTO student_learning_preferences (
      id, student_id, daily_time_minutes, budget_inr, preferred_format,
      learning_language, pace, certificate_preference, updated_at
    ) VALUES (
      'pref-demo-01', ?, 90, 500, 'mixture', 'both', 'moderate', 'both', datetime('now')
    )
    ON CONFLICT(student_id) DO UPDATE SET
      daily_time_minutes = excluded.daily_time_minutes,
      updated_at = datetime('now')
  `, demoUserId);

  // 5. Student Skills
  console.log('[Seed] Seeding student skills...');
  const studentSkills = [
    { name: 'Python', prof: 'Advanced', cat: 'Programming' },
    { name: 'JavaScript', prof: 'Intermediate', cat: 'Programming' },
    { name: 'SQL', prof: 'Intermediate', cat: 'Database' },
    { name: 'Git', prof: 'Intermediate', cat: 'DevOps' },
    { name: 'React', prof: 'Intermediate', cat: 'Frontend' },
    { name: 'HTML/CSS', prof: 'Advanced', cat: 'Frontend' }
  ];

  for (const s of studentSkills) {
    const skillId = `skill-${demoUserId}-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    query.run(`
      INSERT INTO student_skills (id, student_id, skill_name, proficiency, category, is_verified)
      VALUES (?, ?, ?, ?, ?, 1)
      ON CONFLICT(student_id, skill_name) DO UPDATE SET
        proficiency = excluded.proficiency,
        category = excluded.category
    `, skillId, demoUserId, s.name, s.prof, s.cat);
  }

  // 6. Skill Taxonomy
  console.log('[Seed] Seeding skill taxonomies...');
  const taxonomies = [
    {
      id: 'tax-swe',
      role: 'Software Development Intern',
      req: ['Python', 'SQL', 'Git', 'Data Structures & Algorithms'],
      pref: ['FastAPI', 'Docker', 'PostgreSQL', 'RESTful APIs'],
      core: ['Object-Oriented Programming', 'Time & Space Complexity', 'Database Indexing'],
      proj: ['Full-Stack CRUD Application with Authentication', 'CLI Data Processing Utility']
    },
    {
      id: 'tax-backend',
      role: 'Backend Developer Intern',
      req: ['Python', 'SQL', 'Git', 'RESTful APIs'],
      pref: ['Docker', 'PostgreSQL', 'FastAPI', 'Redis'],
      core: ['Relational Database Design', 'HTTP Protocol & REST Standards', 'Caching Patterns'],
      proj: ['High-Throughput REST API Microservice', 'Real-time WebSocket Notification Hub']
    },
    {
      id: 'tax-frontend',
      role: 'Frontend Developer Intern',
      req: ['JavaScript', 'React', 'HTML/CSS', 'Git'],
      pref: ['Tailwind CSS', 'TypeScript', 'Next.js', 'State Management'],
      core: ['DOM Manipulation & Event Loop', 'Responsive Mobile-First UI', 'Accessibility Standards'],
      proj: ['Interactive SaaS Analytics Dashboard', 'E-commerce Catalog with Cart State']
    }
  ];

  for (const t of taxonomies) {
    query.run(`
      INSERT INTO skill_taxonomy (id, role_name, required_skills_json, preferred_skills_json, core_concepts_json, recommended_projects_json)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(role_name) DO UPDATE SET
        required_skills_json = excluded.required_skills_json,
        preferred_skills_json = excluded.preferred_skills_json
    `, t.id, t.role, JSON.stringify(t.req), JSON.stringify(t.pref), JSON.stringify(t.core), JSON.stringify(t.proj));
  }

  // 7. Verified Opportunities (Scholarships & Schemes)
  console.log('[Seed] Seeding scholarship opportunities...');
  const schemes = [
    {
      id: 'scheme-pm-usp-01',
      title: 'Central Sector Scheme of Scholarship (PM-USP)',
      provider: 'Department of Higher Education, Ministry of Education, Govt. of India',
      type: 'Scholarship',
      desc: 'Financial support for meritorious students from low-income families pursuing university undergraduate and postgraduate degrees.',
      edu: ['UG', 'PG'],
      min_marks: 80.0,
      max_income: 450000,
      categories: ['All'],
      states: ['All India'],
      docs: ['Income Certificate', 'Bank Passbook'],
      benefits: ['₹12,000 per annum for 3 years UG', '₹20,000 per annum for 2 years PG'],
      deadline: '2026-11-30',
      official_url: 'https://scholarships.gov.in',
      source_url: 'https://scholarships.gov.in/public/schemeGuidelines/CSSS_Guideline.pdf'
    },
    {
      id: 'scheme-aicte-pragati-02',
      title: 'AICTE Pragati Scholarship Scheme for Girl Students',
      provider: 'All India Council for Technical Education (AICTE)',
      type: 'Scholarship',
      desc: 'Empowering young women pursuing professional degree and diploma courses in AICTE-approved technical institutions.',
      edu: ['UG', 'Diploma'],
      min_marks: 60.0,
      max_income: 800000,
      categories: ['All'],
      states: ['All India'],
      docs: ['Income Certificate', 'Admission Proof in AICTE Institution', 'Aadhaar Card', 'Bank Passbook'],
      benefits: ['₹50,000 per annum towards college fee, books, equipment, and laptop purchase'],
      deadline: '2026-12-15',
      official_url: 'https://www.aicte-india.org',
      source_url: 'https://www.aicte-india.org/schemes/students-development-schemes/pragati'
    },
    {
      id: 'scheme-telangana-epass-03',
      title: 'Telangana ePASS Post-Matric Scholarship & Fee Reimbursement (RTF/MTF)',
      provider: 'Government of Telangana (BC/SC/ST/Minority Welfare Depts)',
      type: 'Fee Reimbursement & Stipend',
      desc: 'Comprehensive post-matric tuition fee reimbursement and maintenance allowance for students domiciled in Telangana.',
      edu: ['UG', 'PG', 'Diploma'],
      min_marks: 50.0,
      max_income: 200000,
      categories: ['OBC', 'SC', 'ST', 'EWS'],
      states: ['Telangana'],
      docs: ['Telangana Domicile/Nativity Certificate', 'MeeSeva Income Certificate', 'MeeSeva Caste Certificate', 'Aadhaar Card', 'Allotment Order'],
      benefits: ['100% Tuition Fee Reimbursement', 'Monthly Maintenance Charges (MTF) up to ₹2,000/month'],
      deadline: '2026-10-31',
      official_url: 'https://telanganaepass.cgg.gov.in',
      source_url: 'https://telanganaepass.cgg.gov.in'
    },
    {
      id: 'scheme-inspire-she-04',
      title: 'INSPIRE Scholarship for Higher Education (SHE)',
      provider: 'Department of Science and Technology (DST), Govt. of India',
      type: 'Fellowship',
      desc: 'Prestigious national scholarship for students excelling in top 1% of 12th board exams enrolling in Natural and Basic Sciences.',
      edu: ['UG', 'Integrated MS'],
      min_marks: 85.0,
      max_income: 0, // No income cap
      categories: ['All'],
      states: ['All India'],
      docs: ['12th Marksheet', 'Eligibility Note from Board', 'Endorsement Certificate from College Principal'],
      benefits: ['₹80,000 per annum (₹60,000 cash scholarship + ₹20,000 summer research mentorship grant)'],
      deadline: '2026-12-31',
      official_url: 'https://online-inspire.gov.in',
      source_url: 'https://online-inspire.gov.in'
    },
    {
      id: 'scheme-kotak-kanya-05',
      title: 'Kotak Kanya Scholarship for Meritorious Girls',
      provider: 'Kotak Education Foundation',
      type: 'Scholarship',
      desc: 'Need-cum-merit scholarship for meritorious girl students pursuing professional graduation (Engineering, MBBS, Law).',
      edu: ['UG'],
      min_marks: 75.0,
      max_income: 600000,
      categories: ['All'],
      states: ['All India'],
      docs: ['12th Marksheet', 'Income Proof (ITR / Salary Slip / Tehsildar Certificate)', 'Bonafide Certificate', 'Bank Passbook'],
      benefits: ['Up to ₹1,50,000 per year until completion of professional degree'],
      deadline: '2026-11-20',
      official_url: 'https://kotakeducation.org',
      source_url: 'https://kotakeducation.org/kotak-kanya-scholarship/'
    }
  ];

  for (const s of schemes) {
    query.run(`
      INSERT INTO opportunities (
        id, title, provider, type, description, education_levels_json, min_marks, max_income_inr,
        categories_json, states_json, required_documents_json, benefits_json, deadline, official_url,
        source_url, last_verified_at, data_confidence, status, is_demo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 'High', 'active', 0)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        min_marks = excluded.min_marks,
        max_income_inr = excluded.max_income_inr,
        deadline = excluded.deadline,
        last_verified_at = datetime('now')
    `, s.id, s.title, s.provider, s.type, s.desc, JSON.stringify(s.edu), s.min_marks, s.max_income, JSON.stringify(s.categories), JSON.stringify(s.states), JSON.stringify(s.docs), JSON.stringify(s.benefits), s.deadline, s.official_url, s.source_url);
  }

  // 8. Pragmatic Internships
  console.log('[Seed] Seeding verified internships...');
  const internships = [
    {
      id: 'intern-google-step-01',
      title: 'Google STEP Intern (Summer 2026)',
      company: 'Google India',
      work_mode: 'remote',
      location: 'Hyderabad / Bengaluru / Remote',
      stipend_inr: 85000,
      stipend_text: '₹85,000 / month + equipment allowance',
      duration: 3,
      req_skills: ['Python', 'Data Structures & Algorithms', 'Git'],
      pref_skills: ['SQL', 'FastAPI', 'Docker'],
      min_cgpa: 7.5,
      openings: 25,
      deadline: '2026-11-15',
      official_url: 'https://careers.google.com/students',
      source_url: 'https://careers.google.com'
    },
    {
      id: 'intern-microsoft-swe-02',
      title: 'Software Engineering Intern (SWE)',
      company: 'Microsoft India Development Center',
      work_mode: 'hybrid',
      location: 'Hyderabad, Telangana',
      stipend_inr: 100000,
      stipend_text: '₹1,00,000 / month + housing allowance',
      duration: 2,
      req_skills: ['Data Structures & Algorithms', 'Python', 'SQL'],
      pref_skills: ['C++', 'Azure', 'Docker'],
      min_cgpa: 8.0,
      openings: 40,
      deadline: '2026-12-01',
      official_url: 'https://careers.microsoft.com',
      source_url: 'https://careers.microsoft.com'
    },
    {
      id: 'intern-isro-research-03',
      title: 'ISRO Technical Research Internship',
      company: 'Indian Space Research Organisation (NRSC)',
      work_mode: 'onsite',
      location: 'Hyderabad, Telangana',
      stipend_inr: 12000,
      stipend_text: '₹12,000 / month stipend + certificate',
      duration: 6,
      req_skills: ['Python', 'SQL'],
      pref_skills: ['GIS', 'NumPy', 'Data Processing'],
      min_cgpa: 7.5,
      openings: 10,
      deadline: '2026-11-25',
      official_url: 'https://www.isro.gov.in',
      source_url: 'https://www.isro.gov.in/Internship.html'
    },
    {
      id: 'intern-swiggy-backend-04',
      title: 'Backend Developer Intern',
      company: 'Swiggy',
      work_mode: 'remote',
      location: 'Remote, India',
      stipend_inr: 45000,
      stipend_text: '₹45,000 / month',
      duration: 6,
      req_skills: ['Python', 'SQL', 'Git', 'Docker'],
      pref_skills: ['PostgreSQL', 'FastAPI', 'Redis'],
      min_cgpa: 7.0,
      openings: 8,
      deadline: '2026-11-10',
      official_url: 'https://bytes.swiggy.com/careers',
      source_url: 'https://bytes.swiggy.com'
    },
    {
      id: 'intern-razorpay-fullstack-05',
      title: 'Full-Stack Engineering Intern',
      company: 'Razorpay',
      work_mode: 'hybrid',
      location: 'Bengaluru, Karnataka',
      stipend_inr: 50000,
      stipend_text: '₹50,000 / month',
      duration: 6,
      req_skills: ['JavaScript', 'React', 'SQL', 'Git'],
      pref_skills: ['Docker', 'TypeScript', 'Node.js'],
      min_cgpa: 7.0,
      openings: 12,
      deadline: '2026-11-20',
      official_url: 'https://razorpay.com/jobs',
      source_url: 'https://razorpay.com'
    }
  ];

  for (const i of internships) {
    query.run(`
      INSERT INTO internships (
        id, title, company, work_mode, location, stipend_inr, stipend_text, duration_months,
        required_skills_json, preferred_skills_json, min_cgpa, openings, deadline,
        official_url, source_url, last_verified_at, is_demo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 0)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        stipend_inr = excluded.stipend_inr,
        deadline = excluded.deadline,
        last_verified_at = datetime('now')
    `, i.id, i.title, i.company, i.work_mode, i.location, i.stipend_inr, i.stipend_text, i.duration, JSON.stringify(i.req_skills), JSON.stringify(i.pref_skills), i.min_cgpa, i.openings, i.deadline, i.official_url, i.source_url);
  }

  // 9. Curated Free & Government Courses (NPTEL, SWAYAM, freeCodeCamp)
  console.log('[Seed] Seeding curated learning pathways...');
  const courses = [
    {
      id: 'course-nptel-python-01',
      title: 'Programming, Data Structures and Algorithms Using Python',
      provider: 'NPTEL (IIT Madras)',
      official_url: 'https://nptel.ac.in/courses/106106145',
      price_inr: 0,
      is_free: 1,
      language: 'English',
      level: 'Intermediate',
      skills: ['Python', 'Data Structures & Algorithms'],
      duration_hours: 30,
      order: 1,
      desc: 'Official IIT Madras curriculum covering searching, sorting, recursion, balanced trees, and algorithmic complexity.'
    },
    {
      id: 'course-swayam-dbms-02',
      title: 'Database Management Systems & Relational Architectures',
      provider: 'SWAYAM (IIT Kharagpur)',
      official_url: 'https://swayam.gov.in',
      price_inr: 0,
      is_free: 1,
      language: 'English',
      level: 'Intermediate',
      skills: ['SQL', 'PostgreSQL', 'Database Design'],
      duration_hours: 35,
      order: 2,
      desc: 'In-depth database design, relational algebra, normal forms (1NF-BCNF), and SQL transactions.'
    },
    {
      id: 'course-fcc-fullstack-03',
      title: 'Full Stack Development: Relational Databases & APIs',
      provider: 'freeCodeCamp',
      official_url: 'https://www.freecodecamp.org/learn/relational-database/',
      price_inr: 0,
      is_free: 1,
      language: 'English',
      level: 'Beginner',
      skills: ['SQL', 'Git', 'Linux Bash'],
      duration_hours: 40,
      order: 3,
      desc: 'Hands-on interactive terminal learning building 14 real PostgreSQL databases and bash scripts.'
    },
    {
      id: 'course-nptel-cloud-04',
      title: 'Cloud Computing, Microservices & Docker Basics',
      provider: 'NPTEL (IIT Kharagpur)',
      official_url: 'https://nptel.ac.in',
      price_inr: 0,
      is_free: 1,
      language: 'English',
      level: 'Advanced',
      skills: ['Docker', 'Cloud Architecture'],
      duration_hours: 25,
      order: 4,
      desc: 'Container virtualization, Docker container lifecycle, Kubernetes fundamentals, and cloud storage.'
    }
  ];

  for (const c of courses) {
    query.run(`
      INSERT INTO courses (
        id, title, provider, official_url, price_inr, is_free, language, level,
        skills_json, duration_hours, certificate_available, description, learning_path_order,
        last_verified_at, is_demo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, datetime('now'), 0)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        price_inr = excluded.price_inr,
        learning_path_order = excluded.learning_path_order,
        last_verified_at = datetime('now')
    `, c.id, c.title, c.provider, c.official_url, c.price_inr, c.is_free, c.language, c.level, JSON.stringify(c.skills), c.duration_hours, c.desc, c.order);
  }

  // 10. Default Tracked Applications in Kanban
  console.log('[Seed] Seeding sample student applications...');
  const sampleApps = [
    {
      id: 'app-seed-01',
      student_id: demoUserId,
      opportunity_id: 'intern-google-step-01',
      opportunity_type: 'internship',
      role_title: 'Google STEP Intern (Summer 2026)',
      company: 'Google India',
      status: 'Under Review',
      deadline: '2026-11-15',
      notes: 'Submitted resume and portfolio. Received automated confirmation email.'
    },
    {
      id: 'app-seed-02',
      student_id: demoUserId,
      opportunity_id: 'scheme-pm-usp-01',
      opportunity_type: 'scheme',
      role_title: 'Central Sector Scheme of Scholarship (PM-USP)',
      company: 'Ministry of Education',
      status: 'Applied',
      deadline: '2026-11-30',
      notes: 'Institute verification pending with college registrar nodal officer.'
    },
    {
      id: 'app-seed-03',
      student_id: demoUserId,
      opportunity_id: 'intern-swiggy-backend-04',
      opportunity_type: 'internship',
      role_title: 'Backend Developer Intern',
      company: 'Swiggy',
      status: 'To Apply',
      deadline: '2026-11-10',
      notes: 'Need to add Docker project to resume before applying.'
    }
  ];

  for (const a of sampleApps) {
    query.run(`
      INSERT INTO student_applications (
        id, student_id, opportunity_id, opportunity_type, role_title, company_or_provider,
        status, deadline, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(student_id, opportunity_id, role_title) DO NOTHING
    `, a.id, a.student_id, a.opportunity_id, a.opportunity_type, a.role_title, a.company, a.status, a.deadline, a.notes);
  }

  // 11. Notifications
  console.log('[Seed] Seeding Deadline Radar notifications...');
  query.run(`
    INSERT INTO notifications (id, student_id, title, message, type, is_read, action_url, deadline, created_at)
    VALUES
      ('notif-seed-01', ?, 'PM-USP Verification Window Active', 'Ensure your college nodal officer verifies your PM-USP application on the National Scholarship Portal.', 'deadline', 0, '/schemes/scheme-pm-usp-01', '2026-11-30', datetime('now')),
      ('notif-seed-02', ?, 'Google STEP Internship Deadline in 22 Days', 'Finalize your ATS resume and verify GitHub repositories.', 'deadline', 0, '/internships/intern-google-step-01', '2026-11-15', datetime('now')),
      ('notif-seed-03', ?, 'Welcome to Saarathi Career Companion', 'Explore your personalized recommendations across Scholarships, Internships, and Courses.', 'system', 0, '/recommendations', NULL, datetime('now'))
    ON CONFLICT(id) DO NOTHING
  `, demoUserId, demoUserId, demoUserId);

  console.log('[Seed] Database successfully populated!');
  console.log(`[Seed] Demo Credentials: demo@saarathi.edu.in / Password@123 (Student: Ananya Sharma)`);
}

seed().catch(err => {
  console.error('[Seed] Error during database seeding:', err);
  process.exit(1);
});
