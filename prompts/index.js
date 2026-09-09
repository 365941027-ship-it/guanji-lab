// 多角色 LLM 调度系统 · 提示词注册表
import { AGENT_EXPLORER } from './agentExplorer.js';
import { AGENT_DESIGNER } from './agentDesigner.js';
import { AGENT_SIMULATOR } from './agentSimulator.js';
import { AGENT_MIRROR } from './agentMirror.js';

export const AGENTS = {
  test: { key: 'test', name: 'agentExplorer', system: AGENT_EXPLORER },
  design: { key: 'design', name: 'agentDesigner', system: AGENT_DESIGNER },
  simulate: { key: 'simulate', name: 'agentSimulator', system: AGENT_SIMULATOR },
  mirror: { key: 'mirror', name: 'agentMirror', system: AGENT_MIRROR }
};

export function resolveAgent(pageType) {
  return AGENTS[pageType] || null;
}

export default AGENTS;
