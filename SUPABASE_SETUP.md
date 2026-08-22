# 接入真实账号系统（Supabase）

观己实验室从「本地账号」升级为「真实账号系统」，使用 Supabase（免费档）提供邮箱密码登录、跨设备数据同步与找回密码。

## 1. 注册并创建项目

1. 打开 <https://supabase.com>，用 GitHub 登录（不需要手机号）。
2. 创建新项目，选新加坡或东京节点（国内访问更稳），设置数据库密码。
3. 项目创建完成后：
   - **Project Settings → API**：复制 Project URL 与 anon public key。
   - **Authentication → Sign In / Providers**：启用 Email 登录；需要邮箱验证则打开「Confirm email」，否则关闭。

## 2. 初始化数据库

打开 Supabase 控制台 → **SQL Editor** → 新建查询，把 `supabase/migrations/001_init.sql` 的内容粘贴进去并运行。

## 3. 把配置写入网站

编辑 `assets/js/supabase-config.js`：

```js
window.SUPABASE_CONFIG = {
  url: 'https://你的项目.supabase.co',
  anonKey: '你的 anon public key',
  wechatAppId: '',
  emailConfirm: false
};
```

注意：anon key 是公开的，配合数据库行级安全（RLS）保护数据，不把 service_role key 放到前端。

## 4. 引入 SDK 与登录脚本

在 `login.html` 与所有需要登录状态的页面，`</body>` 前加入：

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="assets/js/supabase-config.js"></script>
<script src="assets/js/auth.js"></script>
```

## 5. 验证

1. 打开登录页，用邮箱注册一个账号。
2. 填写档案、做一次测试，检查 Supabase 控制台 Table Editor 中 `profiles`、`test_results` 是否有数据。
3. 换一个浏览器/设备登录同一账号，确认数据同步。

## 微信扫码登录（预留）

微信扫码需要**微信开放平台网站应用**：企业认证 + 域名 ICP 备案 + 平台审核，个人无法开通。资质就绪后：

1. 在 `supabase-config.js` 填 `wechatAppId`；
2. 通过微信 OAuth 授权码回调，用 Supabase Auth Admin API 创建/关联用户（需一个服务端函数，可复用现有 Vercel 代理）；
3. 在登录页显示微信扫码按钮（`auth.js` 中 `guanWechatLogin` 已预留）。

## 费用

免费档：5 万月活、500MB 数据库、每日 5 万 API 请求，小范围分享足够。
