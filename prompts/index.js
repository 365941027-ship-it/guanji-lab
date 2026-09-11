// 多角色 LLM 调度系统 · 提示词注册表
import { AGENT_EXPLORER } from './agentExplorer.js';
import { AGENT_DESIGNER } from './agentDesigner.js';
import { AGENT_SIMULATOR } from './agentSimulator.js';
import { AGENT_MIRROR } from './agentMirror.js';
import { buildCatalogBlock } from './catalog.js';

// 原始提示词原文一字未改；只是在后面统一追加一份「站内真实入口」的事实资料，
// 避免模型推荐站内并不存在的测试（详见 catalog.js 顶部说明）。
const CATALOG_BLOCK = buildCatalogBlock();
const withCatalog = (prompt) => prompt + '\n\n' + CATALOG_BLOCK;

export const AGENTS = {
  test: { key: 'test', name: 'agentExplorer', system: withCatalog(AGENT_EXPLORER) },
  design: { key: 'design', name: 'agentDesigner', system: withCatalog(AGENT_DESIGNER) },
  simulate: { key: 'simulate', name: 'agentSimulator', system: withCatalog(AGENT_SIMULATOR) },
  mirror: { key: 'mirror', name: 'agentMirror', system: withCatalog(AGENT_MIRROR) }
};

export function resolveAgent(pageType) {
  return AGENTS[pageType] || null;
}

export default AGENTS;
