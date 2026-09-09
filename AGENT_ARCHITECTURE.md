# 观己实验室 · 多角色 LLM 调度系统说明

## 架构概览

```
浏览器页面（test / design / simulate / mirror）
        │  window.guanAgentChat({ pageType, userInput })
        ▼
POST /api/chat
  1. resolveAgent(pageType)   → 选择 prompts/ 下对应 Agent
  2. buildUserContext(...)    → 组装 injectedContext（档案/量化资源/近期历史）
  3. detectStyle(userInput)   → 高情绪价值 / 高行动力模式
  4. callModel()              → DeepSeek（reasoning_effort=low）
        ▼
返回 { ok, agent, styleMode, injectedContext, selfCheck, text }
```

## 四个 Agent

| pageType | Agent | prompts 文件 | 用途 |
|---|---|---|---|
| `test` | 认知勘探员 | `prompts/agentExplorer.js` | 测试解读页 |
| `design` | 人生架构师 | `prompts/agentDesigner.js` | 人生设计页 |
| `simulate` | 平行宇宙叙事师 | `prompts/agentSimulator.js` | 模拟人生页 |
| `mirror` | 动态心理分析师+职业规划师 | `prompts/agentMirror.js` | 我的专属自查页 |

注册表统一在 `prompts/index.js`。

## 动态上下文注入

`userContextBuilder.js` 输出 `injectedContext`：

```json
{
  "identity": { "mbti": "INFP", "job": "产品经理", ... },
  "quantified": { "timeBudget": "8小时", "moneyBudget": "200块" },
  "astro": { "zodiac": "处女座", "bazi": "..." },
  "recentHistory": [ ... 最近3条测试摘要 ],
  "recentInputs": [ ... 最近3条主动输入 ],
  "designSnapshot": { "routes": [...], "inputs": {...} },
  "pageExtra": {}
}
```

注入方式（用户消息开头）：

> 用户的实时档案数据：{...}。现在用户的问题是：...

## 数据来源说明（重要）

当前站点为“本地账号模式”，用户数据保存在浏览器 localStorage；服务器尚无数据库，
因此 `agent-client.js` 负责在浏览器侧汇总 `guan_profile` / `guan_test_history` /
`guan_growth` / `guan_design_saved`，随请求传给后端 `userContextBuilder.js`。

未来接入 PostgreSQL 后，只需替换 `agent-client.js` 内的取数来源为后端 DB 查询，
后端 `userContextBuilder.js` 的签名与输出保持不变。

## 自查动态更新

两个入口：

1. 完成测试/设计后调用 `window.guanMarkSelfCheckUpdate('test'|'design')`
2. 后端写 `data/selfcheck-state.json`（记录 `lastSelfCheckUpdate`）

下次 `pageType=mirror` 调用时，服务端返回 `selfCheck.regenerate=true`，
保证每次重新生成、不使用缓存（待接入真实 DB 后替换文件存储）。

## 语言风格适配

在 `/api/chat` 内检测用户输入：

- 出现 ≥2 次“害怕/担心/焦虑/迷茫” → 高情绪价值模式
- 出现“计划/下周/安排/具体” → 高行动力模式

对应指令追加到用户消息末尾。

## 依赖

零新增 npm 依赖：Node ≥18 内置 `fetch`；持久化使用文件系统；无需 ORM / 日期库。
升级到数据库时可选 `pg` + `postgres`（或 Prisma），届时替换 `lib/selfCheckStore.js`。
