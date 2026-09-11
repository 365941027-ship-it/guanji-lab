// 观己实验室 · 账号系统（对接自建后端）
//
// 会话机制：登录成功后后端把会话 token 写进 httpOnly Cookie，前端 JavaScript
// 读不到它（防 XSS 窃取），也不需要读——每次请求浏览器自动带上。
// 判断「当前是否登录」的唯一方式：GET /api/account/profile
//   200 → 已登录，把用户信息存进内存变量
//   401 → 未登录
//
// 【安全约定】用户信息只存内存，不写 localStorage。
//   之前把邮箱等信息存 localStorage，任何 XSS 或浏览器扩展都能读到；
//   现在改成每次打开页面重新向后端确认一次。
(function () {
  'use strict';

  // 内存中的当前用户；页面刷新后会重新向后端确认，不落盘
  var currentUser = null;
  // 避免并发重复请求：多个模块同时问「我是谁」时只发一次请求
  var inflight = null;

  function toast(msg) {
    if (window.guanToast) window.guanToast(msg);
    else alert(msg);
  }

  /** 统一请求：带上 Cookie，解析 JSON，非 2xx 时抛出带 .status 的错误 */
  function request(url, options) {
    var opts = options || {};
    opts.credentials = 'same-origin';   // 关键：带上会话 Cookie
    if (opts.body && typeof opts.body !== 'string') {
      opts.headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
      opts.body = JSON.stringify(opts.body);
    }
    return fetch(url, opts).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var msg = (data && data.error) || ('请求失败（' + res.status + '）');
          // 后端错误格式是 {error: "..."}，这里统一成字符串
          if (msg && typeof msg === 'object') msg = msg.message || '请求失败';
          var err = new Error(msg);
          err.status = res.status;
          err.data = data;
          throw err;
        }
        return data;
      });
    });
  }

  // ---------- 会话 ----------

  /**
   * 向后端确认当前登录状态
   * @returns {Promise<object|null>} 用户对象（{id,email,nickname}）或 null
   */
  window.guanRefreshSession = function () {
    if (inflight) return inflight;
    inflight = request('/api/account/profile', { method: 'GET' })
      .then(function (data) {
        currentUser = (data && data.user) || null;
        // 后端如果没返回 user 字段，退一步用 userId 自建最小对象
        if (!currentUser && data && data.userId) currentUser = { id: data.userId, email: '', nickname: '' };
        // 顺手把档案缓存好，供其他页面同步读取
        if (data && data.profile) window.guanSetProfileCache(data.profile);
        if (window.guanRenderAccount) window.guanRenderAccount(currentUser);
        return currentUser;
      })
      .catch(function (err) {
        // 401 = 未登录，属正常情况；其他错误也按未登录处理，但不影响页面
        currentUser = null;
        window.guanSetProfileCache(null);
        if (err && err.status !== 401) {
          console.warn('[auth] 会话检查失败：', err.message);
        }
        if (window.guanRenderAccount) window.guanRenderAccount(null);
        return null;
      })
      .then(function (u) {
        inflight = null;
        return u;
      });
    return inflight;
  };

  /** 同步读取内存中的当前用户（可能为 null，仅在 guanRefreshSession 之后可靠） */
  window.guanCurrentUser = function () {
    return currentUser;
  };

  // ---------- 档案缓存 ----------
  // 档案的权威副本在服务器。但测试 / 设计 / 模拟等页面需要「同步」读取档案来拼装
  // AI 上下文，而 localStorage 是同步的、fetch 是异步的，所以这里做一层缓存：
  //   内存变量（当前页） + sessionStorage（同一标签页内的其他页面）
  // 用 sessionStorage 而不是 localStorage：关掉标签页即失效，不长期留存。
  var PROFILE_CACHE_KEY = 'guan_profile_cache';

  window.guanSetProfileCache = function (profile) {
    try {
      if (profile && Object.keys(profile).length) {
        sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
      } else {
        sessionStorage.removeItem(PROFILE_CACHE_KEY);
      }
    } catch (e) {}
  };

  window.guanGetProfileCache = function () {
    try {
      var raw = sessionStorage.getItem(PROFILE_CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  };

  // 单独拉一次服务器档案（供需要确保最新档案的页面调用）
  window.guanLoadServerProfile = function () {
    return request('/api/account/profile', { method: 'GET' })
      .then(function (data) {
        var p = (data && data.profile) || {};
        window.guanSetProfileCache(p);
        return p;
      })
      .catch(function () { return null; });
  };

  // 兼容旧调用名：返回形状与原来的 Supabase getUser 一致
  window.guanSupabaseUser = function () {
    return window.guanRefreshSession().then(function (u) {
      return { data: { user: u || null } };
    });
  };

  // ---------- 注册 / 登录 / 登出 ----------

  window.guanSignUp = async function (email, password, nickname) {
    try {
      var data = await request('/api/auth/register', {
        method: 'POST',
        body: { email: email, password: password, nickname: nickname || '' }
      });
      currentUser = data.user || null;
      if (window.guanRenderAccount) window.guanRenderAccount(currentUser);
      toast('注册成功，欢迎来到观己');
      await migrateLocalProfile();
      return { user: currentUser, session: true };
    } catch (err) {
      toast(err.message);
      return null;
    }
  };

  window.guanSignIn = async function (email, password) {
    try {
      var data = await request('/api/auth/login', {
        method: 'POST',
        body: { email: email, password: password }
      });
      currentUser = data.user || null;
      if (window.guanRenderAccount) window.guanRenderAccount(currentUser);
      toast('欢迎回来');
      await migrateLocalProfile();
      return { user: currentUser, session: true };
    } catch (err) {
      toast(err.message);
      return null;
    }
  };

  window.guanSignOut = async function () {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // 即使后端失败，本地也要清干净，避免出现「看着已登出其实还登录着」
      console.warn('[auth] 登出请求失败：', e && e.message);
    }
    currentUser = null;
    if (window.guanRenderAccount) window.guanRenderAccount(null);
    if (window.location.pathname.indexOf('login.html') < 0) window.location.href = 'login.html';
  };

  window.guanResetPassword = async function () {
    toast('内测版暂不支持找回密码，请记住你的密码或联系管理员');
  };

  // 微信扫码登录需要微信开放平台企业认证 + ICP 备案，个人暂时无法开通
  window.guanWechatLogin = function () {
    toast('微信扫码登录正在准备中：需要微信开放平台企业认证后才能开通');
  };

  // ---------- 旧档案迁移（方案A） ----------
  // 用户首次登录时，如果这台设备的 localStorage 里还留着旧档案，
  // 自动上传到服务器，上传成功后清掉本地副本，避免「换设备数据不见了」。
  // 由 lib/profile-migrate.js 提供具体实现；未加载时静默跳过。
  async function migrateLocalProfile() {
    try {
      if (window.guanMigrateLocalProfile) await window.guanMigrateLocalProfile();
    } catch (e) {
      console.warn('[auth] 旧档案迁移失败：', e && e.message);
    }
  }

  // ---------- 以下为云端同步接口（暂未接入新后端） ----------
  // 原来的实现走 Supabase，现已停用。为保证调用方不报错，这里保底返回空值。
  // 下一步接入自建后端后，再逐个实现（测试历史 / 成长记录 / 存档）。
  window.guanSyncTestHistory = async function () { return null; };
  window.guanLoadTestHistory = async function () { return null; };
  window.guanSyncArchive = async function () { return null; };
  window.guanLoadArchive = async function () { return null; };
  window.guanSyncGrowth = async function () { return null; };
  window.guanLoadGrowth = async function () { return null; };

  // ---------- 页面加载时自动确认一次登录状态 ----------
  // 不阻塞页面渲染：结果回来后通过 guanRenderAccount 更新页头。
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.guanRefreshSession(); });
  } else {
    window.guanRefreshSession();
  }
})();
