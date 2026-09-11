-- 观己实验室 · 基础三表：users / sessions / profiles
-- 执行方式见 db/README.md
-- 说明：gen_random_uuid() 为 PostgreSQL 13+ 内置函数，无需额外扩展。

-- 1. users：账号表
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

-- 2. sessions：登录会话表
--    用户被删除时，其会话一并级联删除。
CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions (expires_at);

-- 3. profiles：用户档案表
--    birth_data 存出生日期/时辰/出生地等，basic_info 存性别、职业、阶段等自由字段。
CREATE TABLE IF NOT EXISTS profiles (
  user_id    UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  birth_data JSONB,
  zodiac     TEXT,
  mbti       TEXT,
  basic_info JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
