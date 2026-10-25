import { Router } from 'express';
import { query } from '../../db/index.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// GET /api/v1/courses
router.get('/', authenticate, (req, res) => {
  try {
    const { language, level, provider, search } = req.query;
    let sql = 'SELECT * FROM courses WHERE 1=1';
    const params = [];

    if (language && language !== 'all') {
      sql += ' AND LOWER(language) LIKE LOWER(?)';
      params.push(`%${language}%`);
    }

    if (level && level !== 'all') {
      sql += ' AND LOWER(level) = LOWER(?)';
      params.push(level);
    }

    if (provider && provider !== 'all') {
      sql += ' AND LOWER(provider) LIKE LOWER(?)';
      params.push(`%${provider}%`);
    }

    if (search) {
      sql += ' AND (LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY learning_path_order ASC, title ASC';
    const courses = query.all(sql, ...params);

    // Fetch user progress for these courses
    const progressRecords = query.all('SELECT * FROM student_course_progress WHERE student_id = ?', req.user.id);
    const progressMap = new Map();
    for (const p of progressRecords) {
      progressMap.set(p.course_id, p);
    }

    const enhanced = courses.map(course => {
      const prog = progressMap.get(course.id);
      return {
        ...course,
        skills: JSON.parse(course.skills_json || '[]'),
        user_progress: prog ? {
          status: prog.status,
          progress_pct: prog.progress_pct,
          completed_at: prog.completed_at
        } : {
          status: 'not_started',
          progress_pct: 0,
          completed_at: null
        }
      };
    });

    return res.json({
      success: true,
      count: enhanced.length,
      courses: enhanced
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/courses/:id
router.get('/:id', authenticate, (req, res) => {
  try {
    const course = query.get('SELECT * FROM courses WHERE id = ?', req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const prog = query.get('SELECT * FROM student_course_progress WHERE student_id = ? AND course_id = ?', req.user.id, course.id);

    return res.json({
      success: true,
      course: {
        ...course,
        skills: JSON.parse(course.skills_json || '[]'),
        user_progress: prog ? {
          status: prog.status,
          progress_pct: prog.progress_pct,
          completed_at: prog.completed_at
        } : {
          status: 'not_started',
          progress_pct: 0,
          completed_at: null
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/courses/:id/progress
router.post('/:id/progress', authenticate, (req, res) => {
  try {
    const { progress_pct, status } = req.body;
    const course = query.get('SELECT * FROM courses WHERE id = ?', req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const pct = Math.max(0, Math.min(100, Number(progress_pct || 0)));
    const st = status || (pct >= 100 ? 'completed' : (pct > 0 ? 'in_progress' : 'not_started'));
    const completedAt = st === 'completed' ? new Date().toISOString() : null;

    query.run(`
      INSERT INTO student_course_progress (id, student_id, course_id, status, progress_pct, completed_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(student_id, course_id) DO UPDATE SET
        status = excluded.status,
        progress_pct = excluded.progress_pct,
        completed_at = COALESCE(excluded.completed_at, student_course_progress.completed_at),
        updated_at = datetime('now')
    `, `prog-${req.user.id}-${req.params.id}`, req.user.id, req.params.id, st, pct, completedAt);

    return res.json({
      success: true,
      message: 'Course progress updated successfully',
      progress: {
        course_id: req.params.id,
        status: st,
        progress_pct: pct,
        completed_at: completedAt
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
