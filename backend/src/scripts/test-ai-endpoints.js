import http from 'node:http';
import { app } from '../app.js';

const server = http.createServer(app);
server.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  console.log('Testing /api/v1/ai/chat with message payload...');
  const res = await fetch(`${baseUrl}/api/v1/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What are the main scholarship eligibility requirements in India?' })
  });

  console.log('Chat HTTP Status:', res.status);
  const data = await res.json();
  console.log('Chat Success:', data.success);
  console.log('Chat Model:', data.model);
  console.log('Chat Reply Length:', data.reply?.length);
  console.log('Chat Reply Preview:', data.reply?.substring(0, 250));
  console.log('Citations:', data.citations);

  console.log('\nTesting /api/v1/ai/explain...');
  const expRes = await fetch(`${baseUrl}/api/v1/ai/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      opportunity_title: 'Central Sector Scheme of Scholarship (PM-USP)',
      match_score: 95,
      passed_criteria: ['Class 12th marks >= 80%', 'Family income <= 4.5 Lakhs']
    })
  });
  console.log('Explain HTTP Status:', expRes.status);
  const expData = await expRes.json();
  console.log('Explain Success:', expData.success);
  console.log('Explain Length:', expData.explanation?.length);
  console.log('Explain Preview:', expData.explanation?.substring(0, 250));

  server.close();
});
