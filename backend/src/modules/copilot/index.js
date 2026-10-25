import { Router } from 'express';
import { query } from '../../db/index.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// Helper to generate default tasks for a plan
function generateDefaultTasks(planId, studentId, durationDays = 7, targetRole = 'Software Development Intern') {
  const tasks = [];
  if (durationDays === 7) {
    tasks.push(
      { day: 1, title: 'Profile & Quota Audit', desc: 'Verify domicile certificate, income certificate, and Aadhaar linkage in your student profile.', cat: 'Administration' },
      { day: 2, title: 'SQL & Database Optimization', desc: 'Complete NPTEL exercises on B-Tree indexing, execution plans, and normalization.', cat: 'Study' },
      { day: 3, title: 'Git & Portfolio Polish', desc: 'Add meaningful README, license, and architectural diagram to your flagship GitHub project.', cat: 'Project' },
      { day: 4, title: 'ATS Resume Keyword Injection', desc: 'Run your resume through the ATS scanner and align keywords with target internship descriptions.', cat: 'Resume' },
      { day: 5, title: 'Docker Containerization', desc: 'Write a Dockerfile and docker-compose.yml for your full-stack CRUD application.', cat: 'Technical' },
      { day: 6, title: 'Mock Technical Interview', desc: 'Practice 5 LeetCode medium questions on arrays, hash maps, and two-pointer techniques.', cat: 'Interview' },
      { day: 7, title: 'Submit 2 Verified Applications', desc: 'Apply to top-ranked AICTE / remote software internships using the Application Kanban.', cat: 'Application' }
    );
  } else if (durationDays === 30) {
    for (let w = 1; w <= 4; w++) {
      tasks.push(
        { day: (w - 1) * 7 + 1, title: `Week ${w}: Core Competency Mastery`, desc: `Focus on week ${w} milestone for ${targetRole}.`, cat: 'Study' },
        { day: (w - 1) * 7 + 4, title: `Week ${w}: Practical Project Sprint`, desc: `Implement key deliverables and write test suites.`, cat: 'Project' },
        { day: (w - 1) * 7 + 7, title: `Week ${w}: Application & Networking Review`, desc: `Follow up on existing applications and connect with 3 alumni.`, cat: 'Application' }
      );
    }
  } else {
    // 90 days
    for (let m = 1; m <= 3; m++) {
      tasks.push(
        { day: (m - 1) * 30 + 5, title: `Month ${m}: Deep Conceptual Review`, desc: `System design and advanced algorithms.`, cat: 'Study' },
        { day: (m - 1) * 30 + 15, title: `Month ${m}: Full-Stack Capstone`, desc: `Build and deploy end-to-end production application.`, cat: 'Project' },
        { day: (m - 1) * 30 + 25, title: `Month ${m}: Intensive Outreach`, desc: `Targeted campus and off-campus applications.`, cat: 'Application' }
      );
    }
  }

  return tasks.map((t, idx) => ({
    id: `task-${planId}-${idx + 1}`,
    plan_id: planId,
    student_id: studentId,
    day_number: t.day,
    title: t.title,
    description: t.desc,
    category: t.cat,
    is_completed: 0,
    completed_at: null
  }));
}

// GET /api/v1/copilot or GET /api/v1/copilot/plan
router.get('/', authenticate, (req, res) => {
  try {
    const studentId = req.user.id;
    let plan = query.get('SELECT * FROM preparation_plans WHERE student_id = ? ORDER BY created_at DESC LIMIT 1', studentId);

    if (!plan) {
      // Auto-create default 7-day plan
      const planId = `plan-${studentId}-${Date.now()}`;
      const defaultRole = 'Software Development Intern';
      query.run(`
        INSERT INTO preparation_plans (id, student_id, target_role, duration_days, title, status, progress_pct, plan_data_json, created_at, updated_at)
        VALUES (?, ?, ?, 7, '7-Day Quickstart Internship Sprint', 'active', 0, '{}', datetime('now'), datetime('now'))
      `, planId, studentId, defaultRole);

      const tasks = generateDefaultTasks(planId, studentId, 7, defaultRole);
      for (const t of tasks) {
        query.run(`
          INSERT INTO preparation_tasks (id, plan_id, student_id, day_number, title, description, category, is_completed, completed_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, t.id, t.plan_id, t.student_id, t.day_number, t.title, t.description, t.category, t.is_completed, t.completed_at);
      }

      plan = query.get('SELECT * FROM preparation_plans WHERE id = ?', planId);
    }

    const tasks = query.all('SELECT * FROM preparation_tasks WHERE plan_id = ? ORDER BY day_number ASC, id ASC', plan.id);
    const completedCount = tasks.filter(t => t.is_completed === 1).length;
    const progress_pct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    return res.json({
      success: true,
      plan: {
        ...plan,
        progress_pct,
        total_tasks: tasks.length,
        completed_tasks: completedCount,
        tasks
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/copilot/plan
router.post('/plan', authenticate, (req, res) => {
  try {
    const { duration_days = 7, target_role } = req.body;
    const duration = [7, 30, 90].includes(Number(duration_days)) ? Number(duration_days) : 7;
    const studentId = req.user.id;

    const profile = query.get('SELECT target_role FROM student_profiles WHERE user_id = ? OR student_id = ?', studentId, studentId) || {};
    const role = target_role || profile.target_role || 'Software Development Intern';
    const planId = `plan-${studentId}-${Date.now()}`;
    const title = `${duration}-Day Sprint for ${role}`;

    query.run(`
      INSERT INTO preparation_plans (id, student_id, target_role, duration_days, title, status, progress_pct, plan_data_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'active', 0, '{}', datetime('now'), datetime('now'))
    `, planId, studentId, role, duration, title);

    const tasks = generateDefaultTasks(planId, studentId, duration, role);
    for (const t of tasks) {
      query.run(`
        INSERT INTO preparation_tasks (id, plan_id, student_id, day_number, title, description, category, is_completed, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, t.id, t.plan_id, t.student_id, t.day_number, t.title, t.description, t.category, t.is_completed, t.completed_at);
    }

    return res.json({
      success: true,
      message: `${duration}-day roadmap created successfully`,
      planId
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/copilot/tasks/:id/toggle
router.post('/tasks/:id/toggle', authenticate, (req, res) => {
  try {
    const task = query.get('SELECT * FROM preparation_tasks WHERE id = ? AND student_id = ?', req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const nextState = task.is_completed === 1 ? 0 : 1;
    const completedAt = nextState === 1 ? new Date().toISOString() : null;

    query.run(`
      UPDATE preparation_tasks
      SET is_completed = ?, completed_at = ?
      WHERE id = ?
    `, nextState, completedAt, task.id);

    // Update plan progress pct
    const tasks = query.all('SELECT is_completed FROM preparation_tasks WHERE plan_id = ?', task.plan_id);
    const completedCount = tasks.filter(t => t.is_completed === 1).length;
    const progress_pct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    query.run(`UPDATE preparation_plans SET progress_pct = ?, updated_at = datetime('now') WHERE id = ?`, progress_pct, task.plan_id);

    return res.json({
      success: true,
      task_id: task.id,
      is_completed: nextState,
      completed_at: completedAt,
      progress_pct
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
