-- 观己实验室 · Agent 状态表：user_agent_state
-- 用途：存放四个 Agent 跨会话需要保留的用户状态。
--   此前这些数据临时存在服务器 JSON 文件里（lib/userStore.js、lib/selfCheckStore.js），
--   现改为按用户 UUID 存进数据库。
-- 执行方式见 db/README.md

CREATE TABLE IF NOT EXISTS user_agent_state (
  user_id                 UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  prototypes              JSONB,       -- Agent 2 生成的三个原型（{raw, list}）
  defense_map             JSONB,       -- Agent 3 各选项对应的防御机制（仅后台使用，不返回前端）
  agent3_history          JSONB,       -- Agent 3 每次模拟的选择记录
  ideal_scenario          TEXT,        -- 用户在模拟里写下的理想结局
  last_self_check_update  TIMESTAMPTZ, -- 上次刷新专属自查的时间；Agent 4 据此判断是否需要重新生成
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 说明：
--   1. user_id 既是主键也是外键：一个用户只有一行状态记录，用户注销时自动清理。
--   2. 不为 JSONB 字段建 GIN 索引：当前查询都是「按 user_id 取单行」，
--      主键索引即可，额外的 GIN 索引在数据量小的时候只会拖慢写入、白占内存。
--   3. 各 JSONB 字段允许为 NULL，读取时由应用层兜底成空对象 / 空数组。
