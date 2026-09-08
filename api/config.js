// 观己实验室 · 站点级配置接口（自建服务器使用）
// 返回付费墙 / 商品链接 / 支持邮箱等公开配置；敏感密钥不在此暴露。
// 环境变量：
//   GUAN_PAY_ENABLED=1
//   GUAN_PAY_PRICE=9.9
//   GUAN_PAY_GOODS_JSON={"default":"https://mbd.pub/o/...","guan_who":"https://...","guan_who_price":19.9}
//   GUAN_PAY_SUPPORT_EMAIL=xxx@example.com
export default async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { code: 'method_not_allowed' } });
  }

  let goods = {};
  try {
    goods = JSON.parse(process.env.GUAN_PAY_GOODS_JSON || '{}') || {};
  } catch (e) {
    goods = {};
  }
  const price = Number(process.env.GUAN_PAY_PRICE || 9.9);
  const enabled = process.env.GUAN_PAY_ENABLED === '1';
  const localAuth = process.env.GUAN_LOCAL_AUTH === '1';

  return res.status(200).json({
    ok: true,
    auth: {
      localOnly: localAuth
    },
    pay: {
      enabled,
      price: price > 0 ? price : 9.9,
      goods,
      supportEmail: process.env.GUAN_PAY_SUPPORT_EMAIL || ''
    }
  });
}
