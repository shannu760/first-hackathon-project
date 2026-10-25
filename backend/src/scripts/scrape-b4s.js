import fs from 'node:fs';

async function testDetail4() {
  const res = await fetch('https://www.buddy4study.com/scholarship/satya-scholarship-program', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  const nextMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
  if (nextMatch) {
    const data = JSON.parse(nextMatch[1]);
    const bp = data.props?.pageProps?.scholarship?.brandPage || {};
    console.log('bp.scholarships:', JSON.stringify(bp.scholarships, null, 2));
    console.log('bp.attachedScholarships:', JSON.stringify(bp.attachedScholarships, null, 2));
  }
}

testDetail4();
