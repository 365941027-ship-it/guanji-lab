// 观己实验室 · PostgreSQL 连接池
// 职责：创建全局唯一的连接池，对外只暴露 query 方法。所有 SQL 都通过这里执行。
//
// 环境变量（写在服务器 /opt/guanji-lab/.env）：
//   DB_HOST      数据库主机，容器内网互通时用 127.0.0.1
//   DB_PORT      端口，默认 5432
//   DB_NAME      数据库名，默认 guanji
//   DB_USER      用户名，默认 guanji
//   DB_PASSWORD  密码（必填）
import pg from 'pg';

const { Pool } = pg;

// 用连接池而不是单连接：并发请求时复用连接，避免每次查询都重新握手。
// 内存受限（容器 256MB）时，max 不宜设大，10 个连接足够这个体量的站点使用。
const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'guanji',
  user: process.env.DB_USER || 'guanji',
  password: process.env.DB_PASSWORD || '',
  max: 10,                        // 连接池上限
  idleTimeoutMillis: 30000,       // 空闲连接 30 秒后释放
  connectionTimeoutMillis: 5000,  // 单次连接超时 5 秒，避免请求一直挂起
  statement_timeout: 10000        // 单条 SQL 超过 10 秒强制中断，防止慢查询拖垮服务
});

// 连接池里某个空闲连接出错时（例如数据库重启），不让它变成未捕获异常导致进程退出。
pool.on('error', (err) => {
  console.error('[db] 空闲连接异常：', err && err.message ? err.message : err);
});

/**
 * 执行一条 SQL。
 * @param {string} text  带 $1 $2 占位符的 SQL，禁止字符串拼接用户输入
 * @param {Array}  params 占位符对应的参数数组
 * @returns {Promise<import('pg').QueryResult>}
 *
 * 用法：
 *   const r = await query('select * from users where email = $1', [email]);
 *   r.rows[0]
 */
export function query(text, params) {
  return pool.query(text, params);
}

/**
 * 从连接池取一个连接，用于需要事务的多条语句。
 * 用法：
 *   const client = await getClient();
 *   try {
 *     await client.query('BEGIN');
 *     ...
 *     await client.query('COMMIT');
 *   } catch (e) {
 *     await client.query('ROLLBACK');
 *     throw e;
 *   } finally {
 *     client.release();   // 必须归还，否则连接池会被耗尽
 *   }
 */
export function getClient() {
  return pool.connect();
}

/**
 * 健康检查：确认数据库真的能连通。
 * 用于启动时自检或 /api/health 这类探针，不参与业务查询。
 */
export async function ping() {
  const r = await pool.query('select 1 as ok');
  return r.rows[0] && r.rows[0].ok === 1;
}

/** 关闭连接池（仅在进程退出时调用） */
export function closePool() {
  return pool.end();
}

export default { query, getClient, ping, closePool };
