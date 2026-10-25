import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { query } from '../../db/index.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

function calculateAtsScore(resumeData) {
  let score = 50; // Base score
  const feedback = [];

  const summary = resumeData.summary || '';
  if (summary.length >= 80) {
    score += 10;
  } else {
    feedback.push('Expand professional summary to at least 80 characters with targeted keywords.');
  }

  const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];
  if (skills.length >= 6) {
    score += 15;
  } else if (skills.length >= 3) {
    score += 8;
    feedback.push('Add at least 6 technical competencies to match automated candidate filters.');
  } else {
    feedback.push('List core technical skills, frameworks, and programming languages.');
  }

  const projects = Array.isArray(resumeData.projects) ? resumeData.projects : [];
  if (projects.length >= 2) {
    score += 15;
  } else if (projects.length === 1) {
    score += 8;
    feedback.push('Include at least 2 distinct academic or open-source projects with live/GitHub URLs.');
  } else {
    feedback.push('Add capstone or independent development projects.');
  }

  const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
  if (experience.length > 0) {
    score += 10;
  }

  return {
    ats_score: Math.min(98, score),
    feedback: feedback.length > 0 ? feedback : ['Resume format demonstrates strong ATS extractability and clear section headers.']
  };
}

// GET /api/v1/resume
router.get('/', authenticate, (req, res) => {
  try {
    const studentId = req.user.id;
    let resume = query.get('SELECT * FROM resumes WHERE student_id = ?', studentId);

    if (!resume) {
      const user = query.get('SELECT full_name, email, phone FROM users WHERE id = ?', studentId) || {};
      const profile = query.get('SELECT * FROM student_profiles WHERE user_id = ? OR student_id = ?', studentId, studentId) || {};
      const skills = query.all('SELECT skill_name FROM student_skills WHERE student_id = ?', studentId).map(s => s.skill_name);

      const resumeId = `res-${studentId}`;
      const defaultData = {
        id: resumeId,
        student_id: studentId,
        title: 'Software Engineering Resume',
        full_name: user.full_name || 'Ananya Sharma',
        email: user.email || 'demo@saarathi.edu.in',
        phone: user.phone || '+91 98765 43210',
        location: `${profile.state || 'Telangana'}, India`,
        target_role: profile.target_role || 'Software Development Intern',
        summary: 'Proactive engineering student with hands-on expertise in JavaScript, Python, REST APIs, and relational databases. Eager to contribute high-quality code and engineering rigour.',
        education_json: JSON.stringify([
          { degree: 'B.Tech in Computer Science', institution: 'JNTU Hyderabad', year: '2026', cgpa: profile.cgpa || 8.5 }
        ]),
        skills_json: JSON.stringify(skills.length > 0 ? skills : ['Python', 'SQL', 'JavaScript', 'Git', 'React', 'Docker']),
        projects_json: JSON.stringify([
          { title: 'Saarathi Career Companion', description: 'Engineered deterministic scholarship evaluation and career copilot with Node.js and SQLite.', tech: 'Node.js, React, SQLite', url: 'https://github.com/saarathi' },
          { title: 'High-Throughput Analytics Dashboard', description: 'Built interactive visual metrics tracking 50+ student performance indicators.', tech: 'Recharts, Express, Tailwind', url: 'https://github.com/saarathi/dash' }
        ]),
        experience_json: JSON.stringify([
          { role: 'Technical Lead', org: 'College Open-Source Club', period: '2024 - Present', bullets: 'Conducted weekly workshops for 120+ undergraduates on Git workflow and REST architectures.' }
        ]),
        certifications_json: JSON.stringify(['NPTEL Programming, Data Structures and Algorithms Using Python']),
        ats_score: 88,
        ats_feedback_json: JSON.stringify(['Resume format demonstrates strong ATS extractability.'])
      };

      query.run(`
        INSERT INTO resumes (id, student_id, title, full_name, email, phone, location, target_role, summary, education_json, skills_json, projects_json, experience_json, certifications_json, ats_score, ats_feedback_json, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `, defaultData.id, defaultData.student_id, defaultData.title, defaultData.full_name, defaultData.email, defaultData.phone, defaultData.location, defaultData.target_role, defaultData.summary, defaultData.education_json, defaultData.skills_json, defaultData.projects_json, defaultData.experience_json, defaultData.certifications_json, defaultData.ats_score, defaultData.ats_feedback_json);

      resume = query.get('SELECT * FROM resumes WHERE student_id = ?', studentId);
    }

    return res.json({
      success: true,
      resume: {
        ...resume,
        education: JSON.parse(resume.education_json || '[]'),
        skills: JSON.parse(resume.skills_json || '[]'),
        projects: JSON.parse(resume.projects_json || '[]'),
        experience: JSON.parse(resume.experience_json || '[]'),
        certifications: JSON.parse(resume.certifications_json || '[]'),
        ats_feedback: JSON.parse(resume.ats_feedback_json || '[]')
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/resume
router.post('/', authenticate, (req, res) => {
  try {
    const studentId = req.user.id;
    const body = req.body;

    const { ats_score, feedback } = calculateAtsScore(body);

    query.run(`
      INSERT INTO resumes (id, student_id, title, full_name, email, phone, location, target_role, summary, education_json, skills_json, projects_json, experience_json, certifications_json, ats_score, ats_feedback_json, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        full_name = excluded.full_name,
        email = excluded.email,
        phone = excluded.phone,
        location = excluded.location,
        target_role = excluded.target_role,
        summary = excluded.summary,
        education_json = excluded.education_json,
        skills_json = excluded.skills_json,
        projects_json = excluded.projects_json,
        experience_json = excluded.experience_json,
        certifications_json = excluded.certifications_json,
        ats_score = excluded.ats_score,
        ats_feedback_json = excluded.ats_feedback_json,
        updated_at = datetime('now')
    `, `res-${studentId}`, studentId, body.title || 'Primary Resume', body.full_name, body.email, body.phone, body.location, body.target_role, body.summary, JSON.stringify(body.education || []), JSON.stringify(body.skills || []), JSON.stringify(body.projects || []), JSON.stringify(body.experience || []), JSON.stringify(body.certifications || []), ats_score, JSON.stringify(feedback));

    return res.json({
      success: true,
      message: 'Resume updated successfully',
      ats_score,
      feedback
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/resume/pdf - Stream PDF
router.get('/pdf', authenticate, (req, res) => {
  try {
    const studentId = req.user.id;
    let resume = query.get('SELECT * FROM resumes WHERE student_id = ?', studentId);

    const doc = new PDFDocument({ margin: 45, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Saarathi_ATS_Resume.pdf"');

    doc.pipe(res);

    // Color definitions
    const primaryColor = '#74182F'; // Wine
    const darkSlate = '#111827';
    const textMuted = '#4B5563';

    // Header: Name and contact
    const fullName = resume?.full_name || req.user.full_name || 'Ananya Sharma';
    const email = resume?.email || req.user.email || 'demo@saarathi.edu.in';
    const phone = resume?.phone || '+91 98765 43210';
    const location = resume?.location || 'Hyderabad, Telangana, India';
    const targetRole = resume?.target_role || 'Software Development Intern';

    doc.fontSize(22).fillColor(primaryColor).text(fullName.toUpperCase(), { align: 'center', characterSpacing: 1 });
    doc.moveDown(0.2);
    doc.fontSize(11).fillColor(textMuted).text(`${targetRole}  |  ${email}  |  ${phone}  |  ${location}`, { align: 'center' });
    doc.moveDown(0.5);

    // Line separator
    doc.strokeColor(primaryColor).lineWidth(1.5).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.8);

    // Section: Summary
    const summary = resume?.summary || 'Dedicated student with strong foundations in software engineering, algorithms, and web development.';
    doc.fontSize(12).fillColor(primaryColor).text('PROFESSIONAL SUMMARY', { underline: false });
    doc.moveDown(0.2);
    doc.fontSize(9.5).fillColor(darkSlate).text(summary, { lineGap: 2 });
    doc.moveDown(0.8);

    // Section: Education
    const education = JSON.parse(resume?.education_json || '[{"degree":"B.Tech in Computer Science","institution":"JNTU Hyderabad","year":"2026","cgpa":8.5}]');
    doc.fontSize(12).fillColor(primaryColor).text('EDUCATION', { underline: false });
    doc.moveDown(0.2);
    education.forEach(edu => {
      doc.fontSize(10).fillColor(darkSlate).text(`${edu.degree} - ${edu.institution}`, { bold: true });
      doc.fontSize(9).fillColor(textMuted).text(`Graduation Year: ${edu.year || '2026'}  |  Score: CGPA ${edu.cgpa || '8.5'}`);
      doc.moveDown(0.4);
    });
    doc.moveDown(0.5);

    // Section: Technical Skills
    const skills = JSON.parse(resume?.skills_json || '["Python", "SQL", "JavaScript", "Git", "React", "Docker"]');
    doc.fontSize(12).fillColor(primaryColor).text('TECHNICAL SKILLS', { underline: false });
    doc.moveDown(0.2);
    doc.fontSize(9.5).fillColor(darkSlate).text(skills.join('  •  '));
    doc.moveDown(0.8);

    // Section: Flagship Projects
    const projects = JSON.parse(resume?.projects_json || '[{"title":"Saarathi Career Companion","description":"Deterministic scholarship eligibility engine and AI copilot with Node.js and SQLite.","tech":"Node.js, React, SQLite","url":"https://github.com/saarathi"}]');
    doc.fontSize(12).fillColor(primaryColor).text('PROJECTS', { underline: false });
    doc.moveDown(0.2);
    projects.forEach(p => {
      doc.fontSize(10).fillColor(darkSlate).text(`${p.title} (${p.tech || 'Full Stack'})`, { bold: true });
      if (p.url) {
        doc.fontSize(8.5).fillColor(primaryColor).text(`Repository / Live: ${p.url}`);
      }
      doc.fontSize(9.5).fillColor(textMuted).text(p.description, { lineGap: 2 });
      doc.moveDown(0.5);
    });

    // Section: Experience / Leadership
    const experience = JSON.parse(resume?.experience_json || '[]');
    if (experience.length > 0) {
      doc.fontSize(12).fillColor(primaryColor).text('EXPERIENCE & LEADERSHIP', { underline: false });
      doc.moveDown(0.2);
      experience.forEach(exp => {
        doc.fontSize(10).fillColor(darkSlate).text(`${exp.role} - ${exp.org}`, { bold: true });
        if (exp.period) doc.fontSize(8.5).fillColor(textMuted).text(exp.period);
        doc.fontSize(9.5).fillColor(darkSlate).text(exp.bullets || '');
        doc.moveDown(0.4);
      });
    }

    doc.end();
  } catch (err) {
    console.error('PDF Generation Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
