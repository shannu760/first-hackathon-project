import { Router } from 'express';
import { query } from '../../db/index.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// GET /api/v1/notifications
router.get('/', authenticate, (req, res) => {
  try {
    const studentId = req.user.id;
    let notifs = query.all('SELECT * FROM notifications WHERE student_id = ? ORDER BY created_at DESC', studentId);

    // If student has no notifications yet, generate seed deadline radar notifications
    if (notifs.length === 0) {
      const defaultNotifs = [
        {
          id: `notif-${studentId}-1`,
          title: 'PM-USP Scholarship Verification Closes Soon',
          message: 'The Central Sector Scheme (PM-USP) application window requires Aadhaar-seeded bank account confirmation.',
          type: 'deadline',
          deadline: '2026-11-30',
          action_url: '/schemes/scheme-pm-usp-01'
        },
        {
          id: `notif-${studentId}-2`,
          title: 'Google STEP Internship Deadline Approaching',
          message: 'Final date to submit your ATS-compliant resume and transcript for Google STEP India.',
          type: 'deadline',
          deadline: '2026-11-15',
          action_url: '/internships/intern-google-step-01'
        },
        {
          id: `notif-${studentId}-3`,
          title: 'New Skill Taxonomy Match',
          message: 'A new NPTEL course matching your target role (Software Development Intern) is now enrolling.',
          type: 'recommendation',
          deadline: null,
          action_url: '/courses'
        }
      ];

      for (const n of defaultNotifs) {
        query.run(`
          INSERT INTO notifications (id, student_id, title, message, type, is_read, action_url, deadline, created_at)
          VALUES (?, ?, ?, ?, ?, 0, ?, ?, datetime('now'))
        `, n.id, studentId, n.title, n.message, n.type, n.action_url, n.deadline);
      }

      notifs = query.all('SELECT * FROM notifications WHERE student_id = ? ORDER BY created_at DESC', studentId);
    }

    const unreadCount = notifs.filter(n => n.is_read === 0).length;

    return res.json({
      success: true,
      unread_count: unreadCount,
      notifications: notifs
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/notifications/:id/read
router.post('/:id/read', authenticate, (req, res) => {
  try {
    query.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND student_id = ?', req.params.id, req.user.id);
    return res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/notifications/mark-all-read
router.post('/mark-all-read', authenticate, (req, res) => {
  try {
    query.run('UPDATE notifications SET is_read = 1 WHERE student_id = ?', req.user.id);
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
