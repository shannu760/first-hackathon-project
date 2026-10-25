import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (f.endsWith('.js')) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.includes('datetime("now")')) {
        content = content.replaceAll('datetime("now")', "datetime('now')");
        fs.writeFileSync(full, content, 'utf8');
        console.log('Fixed in:', full);
      }
    }
  }
}

walk('d:/hackathon/backend/src');
