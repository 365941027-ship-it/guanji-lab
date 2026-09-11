// 观己实验室 · “我的专属自查”刷新状态存储
//
// 【重要】userId 是 users.id（UUID），不再是邮箱。
//
// 数据落在 PostgreSQL 的 user_agent_state.last_self_check_update 列，
// 通过 lib/repos/profileRepo.js 读写（与 Agent 状态共用同一张表、同一行）。
//
// 说明：原实现里还有 lastSource / previousUpdate 两个字段，用于排查。
// 按当前的表结构（user_agent_state 只有 last_self_check_update 一列可用），
// 这两个字段不再落库：lastSource 仅在本次调用的返回值里体现，
// previousUpdate 由写入前的旧值推导。它们没有被任何业务逻辑消费，
// 因此不影响功能；若以后需要留存，加一列即可。
import { getAgentState, updateAgentStateField } from './repos/profileRepo.js';

/**
 * 读取自查刷新记录
 * @param {string} userId UUID
 * @returns {Promise<object|null>} 从未刷新过时返回 null
 */
export async function getSelfCheck(userId) {
  if (!userId) return null;
  const row = await getAgentState(userId);
  if (!row || !row.lastSelfCheckUpdate) return null;
  return {
    lastSelfCheckUpdate: row.lastSelfCheckUpdate,
    lastSource: '',
    previousUpdate: null
  };
}

/**
 * 刷新自查时间戳（用户完成测试 / 设计 / 提交理想结局后调用）
 * 下次打开专属自查时，Agent 4 会据此强制重新生成问题，不读缓存。
 * @param {string} userId UUID
 * @param {string} source 触发来源，仅用于返回值与日志
 * @returns {Promise<object|null>}
 */
export async function touchSelfCheck(userId, source) {
  if (!userId) return null;
  // 先取旧值，用于返回 previousUpdate
  const prev = await getAgentState(userId);
  const before = prev ? prev.lastSelfCheckUpdate : '';
  const now = new Date().toISOString();
  const row = await updateAgentStateField(userId, 'lastSelfCheckUpdate', now);
  return {
    lastSelfCheckUpdate: (row && row.lastSelfCheckUpdate) || now,
    lastSource: String(source || ''),
    previousUpdate: before || null
  };
}

/**
 * 判断是否需要重新生成专属自查
 * @param {string} userId UUID
 * @param {string} requestedTs 前端手上的时间戳
 * @returns {Promise<{regenerate:boolean, reason:string, lastSelfCheckUpdate?:string}>}
 */
export async function shouldRegenerate(userId, requestedTs) {
  const rec = await getSelfCheck(userId);
  if (!rec) return { regenerate: true, reason: 'no_record' };
  // 前端带的是旧时间戳，说明此后有新测试 / 设计完成，强制重生成
  if (requestedTs && rec.lastSelfCheckUpdate && requestedTs !== rec.lastSelfCheckUpdate) {
    return { regenerate: true, reason: 'stale', lastSelfCheckUpdate: rec.lastSelfCheckUpdate };
  }
  return { regenerate: true, reason: 'always_fresh' };
}

export default { getSelfCheck, touchSelfCheck, shouldRegenerate };
