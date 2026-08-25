// 观己实验室 · 真实账号系统（Supabase Auth）
// 负责：邮箱注册/登录/登出/会话保持、本地数据云端同步、微信扫码预留
(function () {
  'use strict';

  var CFG = window.SUPABASE_CONFIG || {};

  function supabaseReady() {
    return !!(window.supabase && CFG.url && CFG.anonKey);
  }

  var sb = null;
  function client() {
    if (sb) return sb;
    if (!window.supabase || !CFG.url || !CFG.anonKey) return null;
    sb = window.supabase.createClient(CFG.url, CFG.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
    return sb;
  }

  function toast(msg) {
    if (window.guanToast) window.guanToast(msg);
    else alert(msg);
  }

  // ---------- 邮箱密码 ----------
  window.guanSignUp = async function (email, password) {
    var c = client();
    if (!c) { toast('账号服务尚未配置，请先完成 Supabase 设置'); return null; }
    var opts = {};
    if (CFG.emailConfirm !== true) opts.data = {};
    var res = await c.auth.signUp({ email: email, password: password, options: opts });
    if (res.error) { toast(res.error.message); return null; }
    if (res.data && res.data.session) {
      await migrateLocalToCloud();
      return res.data.session;
    }
    toast('注册成功，请到邮箱点击验证链接后再登录');
    return null;
  };

  window.guanSignIn = async function (email, password) {
    var c = client();
    if (!c) { toast('账号服务尚未配置，请先完成 Supabase 设置'); return null; }
    var res = await c.auth.signInWithPassword({ email: email, password: password });
    if (res.error) { toast(res.error.message); return null; }
    await migrateLocalToCloud();
    return res.data.session;
  };

  window.guanSignOut = async function () {
    var c = client();
    if (c) await c.auth.signOut();
    try { localStorage.removeItem('guan_session'); } catch (e) {}
    try { localStorage.removeItem('guan_users'); } catch (e) {}
    if (window.location.pathname.indexOf('login.html') < 0) window.location.href = 'login.html';
  };

  window.guanResetPassword = async function (email) {
    var c = client();
    if (!c) { toast('账号服务尚未配置'); return; }
    var res = await c.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname.replace(/[^/]*$/, 'reset.html')
    });
    if (res.error) toast(res.error.message);
    else toast('重置链接已发送到邮箱，请查收');
  };

  // ---------- 微信扫码（预留） ----------
  // 微信开放平台 Web 登录需要企业认证 + ICP 备案 + 审核，个人暂时无法开通。
  // 资质就绪后，在 supabase-config.js 填 wechatAppId，并在这里接 OAuth 回调流程。
  window.guanWechatLogin = function () {
    toast('微信扫码登录正在准备中：需要微信开放平台企业认证后才能开通');
  };

  // ---------- 会话 ----------
  window.guanSupabaseUser = function () {
    return Promise.resolve().then(function () {
      var c = client();
      if (!c) return { data: { user: null } };
      return c.auth.getUser();
    });
  };

  // ---------- 本地数据 → 云端 ----------
  function localDataKeys() {
    return [
      'guan_profile', 'guan_test_history', 'guan_growth', 'guan_journal', 'guan_journey',
      'guan_who', 'guan_energy_map', 'guan_relation_map', 'guan_talent', 'guan_pressure', 'guan_life_want',
      'guan_deep_guan_who', 'guan_deep_guan_energy_map', 'guan_deep_guan_relation_map',
      'guan_deep_guan_talent', 'guan_deep_guan_pressure', 'guan_deep_guan_life_want'
    ];
  }

  async function migrateLocalToCloud() {
    var c = client();
    if (!c) return;
    var sess = await c.auth.getSession();
    var userId = sess.data && sess.data.session && sess.data.session.user && sess.data.session.user.id;
    if (!userId) return;

    // 1) 档案
    var profile = localStorage.getItem('guan_profile');
    if (profile) {
      try {
        await c.from('profiles').upsert({ id: userId, data: JSON.parse(profile), updated_at: new Date().toISOString() }, { onConflict: 'id' });
      } catch (e) {}
    }

    // 2) 测试历史
    var history = localStorage.getItem('guan_test_history');
    if (history) {
      try {
        await c.from('test_results').upsert({ user_id: userId, history: JSON.parse(history), updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
      } catch (e) {}
    }

    // 3) 成长记录
    ['guan_growth', 'guan_journal', 'guan_journey'].forEach(function (k) {
      var v = localStorage.getItem(k);
      if (!v) return;
      try {
        c.from('growth_records').upsert({ user_id: userId, kind: k.replace('guan_', ''), data: JSON.parse(v), updated_at: new Date().toISOString() }, { onConflict: 'user_id,kind' });
      } catch (e) {}
    });
  }

  // 测试历史同步到云端（完成测试后调用）
  window.guanSyncTestHistory = async function (history) {
    var c = client();
    if (!c) return;
    var sess = await c.auth.getSession();
    var uid = sess.data && sess.data.session && sess.data.session.user && sess.data.session.user.id;
    if (!uid) return;
    try {
      await c.from('test_results').upsert({ user_id: uid, history: history, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    } catch (e) {}
  };

  // 从云端拉取测试历史
  window.guanLoadTestHistory = async function () {
    var c = client();
    if (!c) return null;
    var sess = await c.auth.getSession();
    var uid = sess.data && sess.data.session && sess.data.session.user && sess.data.session.user.id;
    if (!uid) return null;
    try {
      var res = await c.from('test_results').select('history').eq('user_id', uid).maybeSingle();
      if (res.data && res.data.history) {
        window.guanSet('guan_test_history', JSON.stringify(res.data.history));
        return res.data.history;
      }
    } catch (e) {}
    return null;
  };

  // 我的探索存档（测试/设计/模拟）同步云端
  window.guanSyncArchive = async function (list) {
    var c = client();
    if (!c) return;
    var sess = await c.auth.getSession();
    var uid = sess.data && sess.data.session && sess.data.session.user && sess.data.session.user.id;
    if (!uid) return;
    try {
      await c.from('growth_records').upsert({ user_id: uid, kind: 'archive', data: list, updated_at: new Date().toISOString() }, { onConflict: 'user_id,kind' });
    } catch (e) {}
  };

  window.guanLoadArchive = async function () {
    var c = client();
    if (!c) return null;
    var sess = await c.auth.getSession();
    var uid = sess.data && sess.data.session && sess.data.session.user && sess.data.session.user.id;
    if (!uid) return null;
    try {
      var res = await c.from('growth_records').select('data').eq('user_id', uid).eq('kind', 'archive').maybeSingle();
      if (res.data && res.data.data) {
        localStorage.setItem('guan_archive', JSON.stringify(res.data.data));
        return res.data.data;
      }
    } catch (e) {}
    return null;
  };

  // 成长记录（轨迹/日记/三十天）同步云端
  window.guanSyncGrowth = async function (kind, data) {
    var c = client();
    if (!c) return;
    var sess = await c.auth.getSession();
    var uid = sess.data && sess.data.session && sess.data.session.user && sess.data.session.user.id;
    if (!uid) return;
    try {
      await c.from('growth_records').upsert({ user_id: uid, kind: kind, data: data, updated_at: new Date().toISOString() }, { onConflict: 'user_id,kind' });
    } catch (e) {}
  };

  // 从云端拉取成长记录并写回本地
  window.guanLoadGrowth = async function () {
    var c = client();
    if (!c) return null;
    var sess = await c.auth.getSession();
    var uid = sess.data && sess.data.session && sess.data.session.user && sess.data.session.user.id;
    if (!uid) return null;
    try {
      var res = await c.from('growth_records').select('kind,data').eq('user_id', uid);
      if (res.data && res.data.length) {
        res.data.forEach(function (row) {
          var localKey = 'guan_' + row.kind;
          if (row.data) localStorage.setItem(localKey, JSON.stringify(row.data));
        });
        return res.data;
      }
    } catch (e) {}
    return null;
  };

  // 页面加载时：如果有会话则恢复导航身份显示
  (function init() {
    if (!supabaseReady()) return;
    var c = client();
    c.auth.onAuthStateChange(function (event, session) {
      if (event === 'SIGNED_IN' && session) {
        try { localStorage.setItem('guan_session', JSON.stringify({ name: (session.user.email || '').split('@')[0], email: session.user.email })); } catch (e) {}
        migrateLocalToCloud();
      }
      if (event === 'SIGNED_OUT') {
        try { localStorage.removeItem('guan_session'); } catch (e) {}
      }
    });
  })();
})();
