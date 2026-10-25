import { Router } from 'express';
import { callOpenRouter, getAiStatus } from './openrouter.js';
import { optionalAuth } from '../../middleware/auth.js';

const router = Router();

// GET /api/v1/ai/status
router.get('/status', (req, res) => {
  const status = getAiStatus();
  return res.json(status);
});

// POST /api/v1/ai/chat
router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { message, messages, context = {} } = req.body;

    let messageList = [];
    if (Array.isArray(messages) && messages.length > 0) {
      messageList = messages;
    } else if (message && typeof message === 'string') {
      messageList = [{ role: 'user', content: message }];
    } else {
      messageList = [{ role: 'user', content: 'Hello Saarathi AI, please guide me on scholarships and internships.' }];
    }

    const userId = req.user?.id || 'guest-user';
    const result = await callOpenRouter({
      messages: messageList,
      feature: 'chat',
      userId,
      context
    });

    const replyText = result.text || result.reply || '';
    const citations = result.groundTruthCitations || result.citations || [
      'National Scholarship Portal (scholarships.gov.in) Official Gazette',
      'AICTE Approved Internship Scheme Directory'
    ];

    return res.json({
      success: true,
      reply: replyText,
      text: replyText,
      content: replyText,
      citations,
      groundTruthCitations: citations,
      model: result.model || 'openai/gpt-4o',
      isDemo: Boolean(result.isDemo),
      isFallback: Boolean(result.isFallback)
    });
  } catch (err) {
    console.error('[AI Chat] Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message,
      reply: 'Namaste! I am your Saarathi career companion. Please verify eligibility guidelines on scholarships.gov.in and official recruiter portals.',
      text: 'Namaste! I am your Saarathi career companion. Please verify eligibility guidelines on scholarships.gov.in and official recruiter portals.',
      citations: ['National Scholarship Portal (scholarships.gov.in)']
    });
  }
});

// POST /api/v1/ai/explain
router.post('/explain', optionalAuth, async (req, res) => {
  try {
    const {
      opportunityId,
      opportunityTitle,
      opportunity_title,
      match_score,
      passed_criteria,
      failed_criteria,
      missing_information,
      prompt
    } = req.body;

    const title = opportunityTitle || opportunity_title || 'this opportunity';
    let userMessage = prompt;

    if (!userMessage) {
      userMessage = `Explain why a student with match score ${match_score || 85}% is eligible or conditionally eligible for "${title}".
Passed criteria: ${Array.isArray(passed_criteria) ? passed_criteria.join(', ') : 'Academic merits met'}.
Failed criteria: ${Array.isArray(failed_criteria) && failed_criteria.length > 0 ? failed_criteria.join(', ') : 'None'}.
Missing items: ${Array.isArray(missing_information) && missing_information.length > 0 ? missing_information.join(', ') : 'None'}.
Provide 3 concrete, bulleted recommendations to maximize sanction probability.`;
    }

    const userId = req.user?.id || 'guest-user';
    const result = await callOpenRouter({
      messages: [{ role: 'user', content: userMessage }],
      feature: 'explain',
      userId,
      context: { opportunityId, title }
    });

    const explanationText = result.text || result.reply || '';

    return res.json({
      success: true,
      explanation: explanationText,
      reply: explanationText,
      text: explanationText,
      model: result.model,
      isDemo: Boolean(result.isDemo)
    });
  } catch (err) {
    console.error('[AI Explain] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/ai/resume-review
router.post('/resume-review', optionalAuth, async (req, res) => {
  try {
    const { resumeData, resume_text, target_role } = req.body;
    const content = resume_text || JSON.stringify(resumeData || {});
    const role = target_role || 'Software Engineering Intern';

    const userId = req.user?.id || 'guest-user';
    const result = await callOpenRouter({
      messages: [{ role: 'user', content: `Review this student resume for ATS optimization targeting the role "${role}":\n\n${content}\n\nProvide ATS Score breakdown, keyword density critique, and 3 high-impact action bullets.` }],
      feature: 'resume-review',
      userId
    });

    const reviewText = result.text || result.reply || '';

    return res.json({
      success: true,
      review: reviewText,
      text: reviewText,
      model: result.model,
      isDemo: Boolean(result.isDemo)
    });
  } catch (err) {
    console.error('[AI Resume Review] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/ai/notice-summarizer
router.post('/notice-summarizer', optionalAuth, async (req, res) => {
  try {
    const { noticeText, notice_text, url } = req.body;
    const text = notice_text || noticeText || url || '';

    const userId = req.user?.id || 'guest-user';
    const result = await callOpenRouter({
      messages: [{ role: 'user', content: `Summarize this government or university circular for students:\n\n${text}` }],
      feature: 'notice-summarizer',
      userId
    });

    const summaryText = result.text || result.reply || '';

    return res.json({
      success: true,
      summary: summaryText,
      text: summaryText,
      model: result.model,
      isDemo: Boolean(result.isDemo)
    });
  } catch (err) {
    console.error('[AI Notice Summarizer] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
