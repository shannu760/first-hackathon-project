import { Router } from 'express';
import { query } from '../../db/index.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// GET /api/v1/applications - List all student applications
router.get('/', authenticate, (req, res) => {
  try {
    const apps = query.all('SELECT * FROM student_applications WHERE student_id = ? ORDER BY updated_at DESC', req.user.id);
    return res.json({
      success: true,
      count: apps.length,
      applications: apps
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/applications - Create or track opportunity
router.post('/', authenticate, (req, res) => {
  try {
    const {
      opportunity_id = null,
      opportunity_type = 'internship',
      role_title,
      company_or_provider,
      status = 'To Apply',
      deadline = null,
      notes = '',
      official_url = ''
    } = req.body;

    if (!role_title || !company_or_provider) {
      return res.status(400).json({ success: false, error: 'Role title and company/provider are required' });
    }

    const id = `app-${req.user.id}-${Date.now()}`;

    query.run(`
      INSERT INTO student_applications (id, student_id, opportunity_id, opportunity_type, role_title, company_or_provider, status, deadline, notes, official_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(student_id, opportunity_id, role_title) DO UPDATE SET
        status = excluded.status,
        deadline = COALESCE(excluded.deadline, student_applications.deadline),
        notes = COALESCE(excluded.notes, student_applications.notes),
        updated_at = datetime('now')
    `, id, req.user.id, opportunity_id, opportunity_type, role_title, company_or_provider, status, deadline, notes, official_url);

    const saved = query.get('SELECT * FROM student_applications WHERE id = ? OR (student_id = ? AND role_title = ?)', id, req.user.id, role_title);

    return res.json({
      success: true,
      message: 'Application tracked successfully',
      application: saved
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/v1/applications/:id - Update status or notes
router.patch('/:id', authenticate, (req, res) => {
  try {
    const { status, notes, deadline } = req.body;
    const existing = query.get('SELECT * FROM student_applications WHERE id = ? AND student_id = ?', req.params.id, req.user.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Application record not found' });
    }

    const newStatus = status || existing.status;
    const newNotes = notes !== undefined ? notes : existing.notes;
    const newDeadline = deadline !== undefined ? deadline : existing.deadline;

    query.run(`
      UPDATE student_applications
      SET status = ?, notes = ?, deadline = ?, updated_at = datetime('now')
      WHERE id = ? AND student_id = ?
    `, newStatus, newNotes, newDeadline, req.params.id, req.user.id);

    const updated = query.get('SELECT * FROM student_applications WHERE id = ?', req.params.id);

    return res.json({
      success: true,
      message: 'Application updated',
      application: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/applications/:id - Remove application
router.delete('/:id', authenticate, (req, res) => {
  try {
    query.run('DELETE FROM student_applications WHERE id = ? AND student_id = ?', req.params.id, req.user.id);
    return res.json({ success: true, message: 'Application removed from tracker' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
