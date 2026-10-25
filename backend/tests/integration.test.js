import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { app } from '../src/app.js';

let server;
let baseUrl;
let sessionCookie = '';

describe('Saarathi Full-Stack API Integration Tests', () => {

  before(async () => {
    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  test('1. Health Check returns 200 and healthy status', async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'healthy');
    assert.strictEqual(data.service, 'saarathi-backend');
  });

  test('2. Authentication: Login with demo credentials sets session cookie', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'demo@saarathi.edu.in',
        password: 'Password@123',
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.email, 'demo@saarathi.edu.in');

    const rawCookie = res.headers.get('set-cookie');
    assert.ok(rawCookie, 'Expected set-cookie header');
    sessionCookie = rawCookie.split(';')[0];
  });

  test('3. Protected Route: GET /api/v1/auth/me returns authenticated student and profile', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: { 'Cookie': sessionCookie }
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.full_name, 'Ananya Sharma');
    assert.strictEqual(data.profile.education_level, 'UG');
  });

  test('4. Opportunities: Returns verified schemes with computed eligibility', async () => {
    const res = await fetch(`${baseUrl}/api/v1/opportunities`, {
      headers: { 'Cookie': sessionCookie }
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.count >= 4);

    const pmUsp = data.opportunities.find(o => o.id === 'scheme-pm-usp-01');
    assert.ok(pmUsp);
    assert.ok(pmUsp.eligibility);
    assert.strictEqual(pmUsp.eligibility.eligibility_status, 'likely_eligible');
    assert.strictEqual(pmUsp.eligibility.match_score, 100);
  });

  test('5. Recommendations: Returns 3 tabs (Schemes, Courses, Internships) with explanations', async () => {
    const res = await fetch(`${baseUrl}/api/v1/recommendations`, {
      headers: { 'Cookie': sessionCookie }
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.schemes.length > 0);
    assert.ok(data.internships.length > 0);
    assert.ok(data.courses.length > 0);
    assert.ok(data.skillGap.readiness_score > 0);
  });

  test('6. PDF Resume Generation: Returns valid application/pdf binary stream', async () => {
    const res = await fetch(`${baseUrl}/api/v1/resume/pdf`, {
      headers: { 'Cookie': sessionCookie }
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('content-type'), 'application/pdf');
    const buffer = await res.arrayBuffer();
    assert.ok(buffer.byteLength > 1000, 'PDF buffer should be non-empty');
  });

  test('7. AI Status: Returns OpenRouter/Demo mode status payload', async () => {
    const res = await fetch(`${baseUrl}/api/v1/ai/status`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.enabled, true);
  });

  test('8. Single Page App: Static frontend index.html served on root /', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Saarathi'));
    assert.ok(html.includes('<div id="root"></div>'));
  });
});
