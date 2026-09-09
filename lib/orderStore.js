// 观己实验室 · 订单自动核对存储（金数据数据推送 → 本文件 → 前端轮询解锁）
// 金数据后台开启「数据推送」后，付款成功会把表单数据 POST 到 /api/order/webhook；
// 前端在付款后轮询 /api/order/status，命中即自动解锁深度解读，无需手动输入订单号。
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'orders.json');

function ensure() {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
  if (!fs.existsSync(FILE)) {
    try { fs.writeFileSync(FILE, '{}', 'utf-8'); } catch (e) {}
  }
}

function read() {
  ensure();
  try { return JSON.parse(fs.readFileSync(FILE, 'utf-8') || '{}'); } catch (e) { return {}; }
}

function write(orders) {
  ensure();
  try { fs.writeFileSync(FILE, JSON.stringify(orders, null, 2), 'utf-8'); } catch (e) {}
}

function normalizeKey(email, quiz) {
  return String(email || '').trim().toLowerCase() + '::' + String(quiz || '').trim();
}

export function recordOrder(payload) {
  // 兼容金数据推送的不同字段命名
  const p = payload || {};
  const email =
    p.email || p.contact_email || p['联系邮箱'] || p['邮箱'] ||
    (p.data && (p.data.email || p.data['联系邮箱'] || p.data['邮箱'])) || '';
  const quiz =
    p.quiz || p.quiz_key || p['测试'] || p['测试名称'] || p.source ||
    (p.data && (p.data.quiz || p.data.quiz_key || p.data['测试'] || p.data['测试名称'])) || '';
  const orderNo =
    p.order_no || p.orderNo || p.out_trade_no || p['订单号'] || p.charge_id ||
    (p.data && (p.data.order_no || p.data.out_trade_no || p.data['订单号'])) || '';
  const amount = Number(p.amount || p.total_fee || (p.data && (p.data.amount || p.data.total_fee)) || 0);

  if (!email || !quiz) {
    return { recorded: false, reason: 'missing_email_or_quiz', raw: p };
  }
  const orders = read();
  const key = normalizeKey(email, quiz);
  const now = new Date().toISOString();
  orders[key] = {
    paid: true,
    email: String(email).trim().toLowerCase(),
    quiz: String(quiz).trim(),
    orderNo: String(orderNo || ''),
    amount,
    source: String(p.event || p.type || 'push'),
    recordedAt: now
  };
  write(orders);
  return { recorded: true, key, at: now };
}

export function queryOrder(email, quiz) {
  if (!email || !quiz) return { paid: false };
  const orders = read();
  const rec = orders[normalizeKey(email, quiz)];
  return { paid: !!(rec && rec.paid), order: rec || null };
}

export default { recordOrder, queryOrder };
