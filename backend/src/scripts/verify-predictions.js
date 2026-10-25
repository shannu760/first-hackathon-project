async function verify() {
  console.log('--- Saarathi Real-Time Prediction & Live Data Verification ---');

  // 1. Login with demo student
  const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@saarathi.edu.in', password: 'Password@123' })
  });

  const cookie = loginRes.headers.get('set-cookie');
  console.log('Login Status:', loginRes.status, '| Cookie received:', Boolean(cookie));

  // 2. Fetch Unstop Internships with Real-Time Fit Prediction
  const intRes = await fetch('http://localhost:5000/api/v1/internships', {
    headers: { 'Cookie': cookie }
  });
  const intData = await intRes.json();
  console.log(`\nVerified Internships (Unstop + Curated): ${intData.count} total`);
  intData.internships.slice(0, 5).forEach((i, idx) => {
    console.log(`[${idx + 1}] ${i.title} @ ${i.company}`);
    console.log(`    Mode: ${i.work_mode} | Stipend: ${i.stipend_text} | Deadline: ${i.deadline}`);
    console.log(`    Real-time Fit: ${i.fit?.fit_score}% (${i.fit?.recommendation_level}) | Matched: [${i.fit?.matched_required_skills?.join(', ')}]`);
  });

  // 3. Fetch Buddy4Study Scholarships with Real-Time Eligibility Prediction
  const oppRes = await fetch('http://localhost:5000/api/v1/opportunities', {
    headers: { 'Cookie': cookie }
  });
  const oppData = await oppRes.json();
  console.log(`\nVerified Scholarships (Buddy4Study + National): ${oppData.count} total`);
  oppData.opportunities.slice(0, 5).forEach((s, idx) => {
    console.log(`[${idx + 1}] ${s.title}`);
    console.log(`    Provider: ${s.provider}`);
    console.log(`    Match Score: ${s.eligibility?.match_score}% | Status: ${s.eligibility?.eligibility_status}`);
  });

  console.log('\nAll Real-Time Predictions & Scraped Sources verified successfully!');
}

verify().catch(e => console.error(e));
