// 观己实验室 · “我的专属自查”刷新状态存储
// 当前无数据库：以 JSON 文件持久化（容器重启后仍保留，升级数据库后替换为表查询）。
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'selfcheck-state.json');

function ensureFile() {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
  if (!fs.existsSync(FILE)) {
    try { fs.writeFileSync(FILE, '{}', 'utf-8'); } catch (e) {}
  }
}

function readState() {
  ensureFile();
  try { return JSON.parse(fs.readFileSync(FILE, 'utf-8') || '{}'); } catch (e) { return {}; }
}

function writeState(state) {
  ensureFile();
  try { fs.writeFileSync(FILE, JSON.stringify(state, null, 2), 'utf-8'); } catch (e) {}
}

export function getSelfCheck(userId) {
  if (!userId) return null;
  return readState()[String(userId)] || null;
}

export function touchSelfCheck(userId, source) {
  if (!userId) return null;
  const state = readState();
  const now = new Date().toISOString();
  const prev = state[String(userId)] || {};
  state[String(userId)] = {
    lastSelfCheckUpdate: now,
    lastSource: String(source || ''),
    previousUpdate: prev.lastSelfCheckUpdate || null
  };
  writeState(state);
  return state[String(userId)];
}

export function shouldRegenerate(userId, requestedTs) {
  const rec = getSelfCheck(userId);
  if (!rec) return { regenerate: true, reason: 'no_record' };
  // 若前端带来的是旧时间戳，说明有新测试/设计完成，强制重生成
  if (requestedTs && rec.lastSelfCheckUpdate && requestedTs !== rec.lastSelfCheckUpdate) {
    return { regenerate: true, reason: 'stale', lastSelfCheckUpdate: rec.lastSelfCheckUpdate };
  }
  return { regenerate: true, reason: 'always_fresh' };
}

export default { getSelfCheck, touchSelfCheck, shouldRegenerate };
