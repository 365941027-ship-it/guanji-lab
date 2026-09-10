// 观己实验室 · 用户数据存储（Agent 3 相关字段）
// 说明：项目当前使用「本地账号模式」，服务器尚无关系型数据库，
// 因此这里以 JSON 文件持久化，字段与表结构一一对应：
//   user_ideal_scenario   TEXT   → record.idealScenario
//   user_agent3_history   JSON   → record.agent3History
//   agent2_prototypes     JSON   → record.prototypes
//   agent3_defense_map    JSON   → record.defenseMap
// 升级到 PostgreSQL 后，只需把本文件的读写替换为对应用户表的查询。
import fs from 'node:fs';
import path from 'node:path';
import { touchSelfCheck } from './selfCheckStore.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'users.json');
const MAX_HISTORY = 50;

function ensure() {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
  if (!fs.existsSync(FILE)) {
    try { fs.writeFileSync(FILE, '{}', 'utf-8'); } catch (e) {}
  }
}

function readAll() {
  ensure();
  try { return JSON.parse(fs.readFileSync(FILE, 'utf-8') || '{}'); } catch (e) { return {}; }
}

function writeAll(all) {
  ensure();
  try { fs.writeFileSync(FILE, JSON.stringify(all, null, 2), 'utf-8'); } catch (e) {}
}

function key(userId) {
  return String(userId || '').trim().toLowerCase();
}

function blank() {
  return {
    prototypes: null,        // Agent 2 最近一次输出的三个原型（原文）
    prototypesUpdatedAt: '',
    defenseMap: {},          // { "原型A": { "A": "合理化", ... } }
    agent3History: [],       // 每次模拟的选择记录
    idealScenario: '',       // 用户提交的理想结局
    idealScenarioUpdatedAt: '',
    updatedAt: ''
  };
}

export function getUserRecord(userId) {
  const k = key(userId);
  if (!k) return blank();
  const all = readAll();
  return Object.assign(blank(), all[k] || {});
}

function patch(userId, updates) {
  const k = key(userId);
  if (!k) return null;
  const all = readAll();
  const cur = Object.assign(blank(), all[k] || {});
  all[k] = Object.assign(cur, updates || {}, { updatedAt: new Date().toISOString() });
  writeAll(all);
  return all[k];
}

/**
 * 保存 Agent 2 生成的原型（进入模拟页时供 Agent 3 读取）
 * @param {string} userId
 * @param {string} prototypesRaw Agent 2 输出的完整文本
 * @param {Array}  prototypes 结构化原型（可选，[{key,name,careers,shortboard,fit}]）
 */
export function savePrototypes(userId, prototypesRaw, prototypes) {
  return patch(userId, {
    prototypes: {
      raw: String(prototypesRaw || '').slice(0, 20000),
      list: Array.isArray(prototypes) ? prototypes.slice(0, 3) : []
    },
    prototypesUpdatedAt: new Date().toISOString()
  });
}

/** 保存某原型的「防御机制映射表」（仅后台使用，不返回前端） */
export function saveDefenseMap(userId, prototypeKey, map) {
  const rec = getUserRecord(userId);
  const merged = Object.assign({}, rec.defenseMap || {});
  merged['原型' + String(prototypeKey || '').replace(/^原型/, '')] = map || {};
  return patch(userId, { defenseMap: merged });
}

/** 读取某原型的防御机制映射表 */
export function getDefenseMap(userId, prototypeKey) {
  const rec = getUserRecord(userId);
  const k = '原型' + String(prototypeKey || '').replace(/^原型/, '');
  return (rec.defenseMap && rec.defenseMap[k]) || {};
}

/** 追加一次模拟的选择记录（user_agent3_history） */
export function appendAgent3History(userId, entry) {
  const rec = getUserRecord(userId);
  const list = Array.isArray(rec.agent3History) ? rec.agent3History.slice() : [];
  list.push(Object.assign({ at: new Date().toISOString() }, entry || {}));
  return patch(userId, { agent3History: list.slice(-MAX_HISTORY) });
}

/** 读取模拟历史（供 Agent 4 引用） */
export function getAgent3History(userId, limit) {
  const rec = getUserRecord(userId);
  const list = Array.isArray(rec.agent3History) ? rec.agent3History : [];
  const n = Number(limit) > 0 ? Number(limit) : 3;
  return list.slice(-n);
}

/**
 * 保存用户提交的理想结局（user_ideal_scenario）
 * 同时触发 lastSelfCheckUpdate 刷新，使下次 Agent 4 强制重新生成自查。
 */
export function saveIdealScenario(userId, prototypeKey, ideal) {
  const text = String(ideal || '').trim().slice(0, 4000);
  const rec = patch(userId, {
    idealScenario: text,
    idealScenarioUpdatedAt: new Date().toISOString()
  });
  // 触发自查刷新事件
  const selfCheck = touchSelfCheck(userId, 'agent3_ideal');
  appendAgent3History(userId, { type: 'ideal', prototypeKey, ideal: text });
  return { idealScenario: text, selfCheck };
}

/** 读取理想结局（供 Agent 3 上下文与 Agent 4 自查引用） */
export function getIdealScenario(userId) {
  return getUserRecord(userId).idealScenario || '';
}

export default {
  getUserRecord,
  savePrototypes,
  saveDefenseMap,
  getDefenseMap,
  appendAgent3History,
  getAgent3History,
  saveIdealScenario,
  getIdealScenario
};
