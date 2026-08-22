// 观己实验室 · Supabase 配置
// 部署说明见 SUPABASE_SETUP.md
// 创建 Supabase 项目后，把下面的 URL 与 anon key 替换成你自己的：
//  - URL 形如 https://xxxx.supabase.co
//  - anon key 是 Project Settings → API → Project API keys → anon public
window.SUPABASE_CONFIG = {
  url: 'https://npsmpxfpxjhspymnxrrv.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wc21weGZweGpoc3B5bW54cnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNjI1MTIsImV4cCI6MjEwMjkzODUxMn0.9agyMYWqh6tkIrTfIs4OJgd4dvQeSuoHUJqPi954Toc',
  // 微信扫码登录预留：等微信开放平台企业认证就绪后，在此填写 Web 端 AppID
  wechatAppId: '',
  // 邮箱登录是否需要邮箱验证（true 会发验证邮件，false 注册即登录）
  emailConfirm: false
};
