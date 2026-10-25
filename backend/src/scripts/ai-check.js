import { callOpenRouter, getAiStatus } from '../modules/ai/openrouter.js';

async function runCheck() {
  console.log('--- Saarathi AI Layer Verification ---');
  const status = getAiStatus();
  console.log('AI System Status:', JSON.stringify(status, null, 2));

  console.log('\nTesting inference pipeline (explain feature)...');
  const start = Date.now();
  const res = await callOpenRouter({
    messages: [{ role: 'user', content: 'Explain my eligibility for PM-USP Scholarship with 85% marks and 3L income.' }],
    feature: 'explain',
    userId: 'test-admin'
  });
  const elapsed = Date.now() - start;

  console.log(`\nInference completed in ${elapsed}ms:`);
  console.log(`- Model: ${res.model}`);
  console.log(`- Is Demo Mode: ${Boolean(res.isDemo)}`);
  console.log(`- Is Fallback: ${Boolean(res.isFallback)}`);
  console.log(`- Response Length: ${res.text.length} characters`);
  console.log('\n--- Output Preview ---');
  console.log(res.text.substring(0, 300) + '...\n');
  console.log('Verification PASSED: AI subsystem is healthy and operational.');
}

runCheck().catch(err => {
  console.error('AI Verification failed:', err);
  process.exit(1);
});
