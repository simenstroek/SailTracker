// One-off: node tools/import.mjs "H:\My Drive\_Claude\Tracker"
// Needs env SUPABASE_SECRET_KEY (never commit it). Safe to re-run: upserts by id.
import { createClient } from '@supabase/supabase-js';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2];
const key = process.env.SUPABASE_SECRET_KEY;
if (!root || !key) { console.error('usage: SUPABASE_SECRET_KEY=... node tools/import.mjs <Tracker folder>'); process.exit(1); }
const sb = createClient('https://wludxeuixayesejwdiny.supabase.co', key);
const clean = p => p.split('/').map(s => s.replace(/[^\w.\-]+/g, '_')).join('/');

async function upload(a) {                       // a = {file:"attachments/0007/x.png"}; rewrites a.file to the stored key
  const src = join(root, 'data', a.file);
  const k = clean(a.file.replace(/^attachments\//, ''));
  if (!existsSync(src)) { console.warn('  missing file', a.file); return; }
  const { error } = await sb.storage.from('attachments').upload(k, readFileSync(src), { upsert: true });
  if (error) throw new Error(a.file + ': ' + error.message);
  a.file = 'attachments/' + k;
}

const dir = join(root, 'data', 'issues');
for (const name of readdirSync(dir).filter(n => n.endsWith('.json'))) {
  const o = JSON.parse(readFileSync(join(dir, name), 'utf8'));
  o.id = o.id || name.replace('.json', '');
  for (const a of o.attachments || []) await upload(a);
  for (const c of o.comments || []) for (const a of c.attachments || []) await upload(a);
  const { error } = await sb.from('issues').upsert({ id: o.id, data: o });
  if (error) throw new Error(o.id + ': ' + error.message);
  console.log('imported', o.id, o.title);
}
