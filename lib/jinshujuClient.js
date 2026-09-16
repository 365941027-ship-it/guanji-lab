// 观己实验室 · 金数据订单查询（主动拉取，替代付费版 Webhook）
//
// 背景：金数据的「Webhook 推送」「对外查询」都要专业版（599 元/年）才开放，
// 但「API v1」是**所有套餐都能用**的（免费版 100 次/小时，官方文档明确写的）。
// 所以改成反过来：不是金数据推给我们，而是用户点「我已付款，立即核对」时，
// 我们主动去金数据查一次「这个邮箱有没有付款记录」。
//
// 这样既能自动解锁（用户不用等你手动补记），又不用付套餐费。
//
// 两道自我保护（免费版额度有限，不能随便烧）：
//   1. 同一邮箱短时间内的重复查询走缓存，避免前端 88 秒轮询打出几十个请求；
//   2. 全局每小时调用次数封顶，接近上限时停止外呼并返回「暂不可查」，
//      由前端提示用户稍后再试或走人工补记，绝不会因为超限而报错。

const API_BASE = 'https://jinshuju.net/api/v1';

// 同一邮箱的查询结果缓存多久（毫秒）
const CACHE_TTL_MS = 10 * 1000;
// 每小时最多调用金数据多少次（免费版额度 100 次/小时，留出余量给别的用途）
const MAX_CALLS_PER_HOUR = 80;

const cache = new Map();      // email → { at, entries }
const callLog = [];           // 调用时间戳，用于滑动窗口限流

/** 金数据是否配置好了 */
export function isConfigured() {
  return !!(process.env.JINSHUJU_ACCESS_TOKEN && process.env.JINSHUJU_FORM_TOKEN);
}

function formToken() {
  return String(process.env.JINSHUJU_FORM_TOKEN || '').trim();
}

function accessToken() {
  return String(process.env.JINSHUJU_ACCESS_TOKEN || '').trim();
}

/** 滑动窗口限流：返回 true 表示还能调用 */
function withinQuota() {
  const now = Date.now();
  const cutoff = now - 60 * 60 * 1000;
  while (callLog.length && callLog[0] < cutoff) callLog.shift();
  return callLog.length < MAX_CALLS_PER_HOUR;
}

function noteCall() {
  callLog.push(Date.now());
}

/**
 * 把一条金数据记录里所有值摊平成一个字符串数组，便于查找邮箱/测试编号。
 * 记录形如 { serial_number, field_1: 'x', field_2: 'y', created_at, ... }
 */
function valuesOf(entry) {
  const out = [];
  Object.keys(entry || {}).forEach((k) => {
    const v = entry[k];
    if (v === null || v === undefined) return;
    if (typeof v === 'string' || typeof v === 'number') out.push(String(v));
    else out.push(JSON.stringify(v));
  });
  return out;
}

// 从任意文本里挑出「像邮箱的那一段」。
// 不能直接用 indexOf 找子串：那样 a@x.com 会命中 ba@x.com，
// 等于把别人的付款算到这个用户头上。这里要求整段完全一致。
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

/** 记录里是否真的出现过这个邮箱（要求完整匹配，避免 a@x.com 命中 ba@x.com） */
function entryHasEmail(entry, email) {
  const want = String(email || '').trim().toLowerCase();
  if (!want) return false;
  return valuesOf(entry).some(function (v) {
    const found = String(v).match(EMAIL_RE);
    if (!found) return false;
    return found.some(function (candidate) {
      return candidate.toLowerCase() === want;
    });
  });
}

/**
 * 从记录里找测试编号（guan_xxx）。
 * 若付款链接把 quiz 带进了表单，这里就能读到；读不到就返回 null，
 * 由调用方按「用户当前正在问哪个测试」来判定。
 */
function quizOf(entry) {
  for (const v of valuesOf(entry)) {
    const m = v.match(/guan_[a-z_]+/i);
    if (m) return m[0].toLowerCase();
  }
  return null;
}

/** 只认最近这段时间内的付款记录，避免把很久以前的单子重复算数 */
const MAX_AGE_DAYS = 90;

function isRecent(entry) {
  const t = Date.parse(entry && entry.created_at);
  if (!Number.isFinite(t)) return true;   // 没有时间就不过滤，宁可宽松（有人确实付了钱）
  return Date.now() - t < MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * 查这个邮箱在金数据里有没有付款记录。
 *
 * @param {string} email
 * @returns {Promise<{ok:boolean, entries?:Array, reason?:string}>}
 *   ok=true 时 entries 是匹配到的记录列表（可能为空数组 = 确实没付）
 */
export async function findEntriesByEmail(email) {
  const mail = String(email || '').trim().toLowerCase();
  if (!mail) return { ok: false, reason: 'no_email' };
  if (!isConfigured()) return { ok: false, reason: 'not_configured' };

  const cached = cache.get(mail);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return { ok: true, entries: cached.entries, cached: true };
  }

  if (!withinQuota()) {
    console.warn('[jinshuju] 已达本小时调用上限，暂停外呼（免费版额度 100 次/小时）');
    return { ok: false, reason: 'quota_exceeded' };
  }

  // keyword 是全文搜索，不用先取字段列表；邮箱落在哪个字段都能搜到
  const url = API_BASE + '/forms/' + encodeURIComponent(formToken()) +
    '/entries?keyword=' + encodeURIComponent(mail);

  let res;
  try {
    noteCall();
    res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + accessToken()
      }
    });
  } catch (e) {
    console.warn('[jinshuju] 请求失败：', e && e.message);
    return { ok: false, reason: 'network_error' };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.warn('[jinshuju] 接口返回 ' + res.status + '：' + String(text).slice(0, 300));
    // 401/403 通常是 Token 不对或表单不属于该账号，值得让站长知道
    return { ok: false, reason: res.status === 401 || res.status === 403 ? 'bad_token' : 'api_error', status: res.status };
  }

  let body;
  try {
    body = await res.json();
  } catch (e) {
    return { ok: false, reason: 'bad_json' };
  }

  const list = Array.isArray(body && body.data) ? body.data : [];
  // keyword 是子串匹配，这里再精确确认一次，避免误把别人的订单算给这个用户
  const matched = list.filter((e) => entryHasEmail(e, mail) && isRecent(e));

  cache.set(mail, { at: Date.now(), entries: matched });
  return { ok: true, entries: matched };
}

/**
 * 从匹配到的记录里挑一条能用来解锁的。
 *
 * 「能用来解锁」的判断：这条记录要么明确带着同一个测试编号，
 * 要么没带编号（表单没接住 quiz）且没有被别的测试用过——否则一次付款
 * 会把六个测试全解锁。
 *
 * @param {Array} entries   金数据记录
 * @param {string} quiz     用户当前正在问的测试编号
 * @param {Set<string>} usedSerials 已被别的测试消费过的记录号
 */
export function pickUsableEntry(entries, quiz, usedSerials) {
  const used = usedSerials || new Set();
  const want = String(quiz || '').trim();
  const list = (entries || []).slice().sort(function (a, b) {
    return Date.parse(b.created_at || 0) - Date.parse(a.created_at || 0);
  });

  for (const e of list) {
    const serial = String(e.serial_number || '');
    if (serial && used.has(serial)) continue;      // 已被别的测试用过
    const q = quizOf(e);
    if (q) {
      if (q === want) return { entry: e, quiz: q, certain: true };
      continue;                                    // 这条是付给另一个测试的
    }
    // 表单没接住 quiz：只能按用户当前在问的测试来算，且该记录未被消费过
    if (want) return { entry: e, quiz: want, certain: false };
  }
  return null;
}

/** 仅供排查：清掉缓存与限流计数 */
export function resetState() {
  cache.clear();
  callLog.length = 0;
}

export default { isConfigured, findEntriesByEmail, pickUsableEntry, resetState };
