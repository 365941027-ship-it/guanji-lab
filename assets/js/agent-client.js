// 观己实验室 · 前端 Agent 客户端
// 职责：
//  1) 从 localStorage（本地账号模式）读取用户档案 / 测试历史 / 成长记录；
//  2) 调用 /api/chat（多角色 LLM 调度），按 pageType 选择 Agent；
//  3) 提供 markSelfCheckUpdate()，在完成测试/设计后通知后端刷新“专属自查”。
// 用法示例：
//  window.guanAgentChat({ pageType:'test', userInput:'...' }).then(r=>console.log(r.text))

(function () {
  'use strict';

  function readJSON(key, fallback) {
    try {
      var v = window.guanGet ? window.guanGet(key) : localStorage.getItem(key);
      if (!v) return fallback;
      return JSON.parse(v);
    } catch (e) { return fallback; }
  }

  function readString(key) {
    try {
      return (window.guanGet ? window.guanGet(key) : localStorage.getItem(key)) || '';
    } catch (e) { return ''; }
  }

  function currentUserId() {
    try {
      var s = JSON.parse(localStorage.getItem('guan_session') || 'null');
      return (s && s.email) || '';
    } catch (e) { return ''; }
  }

  // 汇总当前设备上的用户档案快照（供 /api/chat 装配 injectedContext）
  window.guanBuildUserContext = function (overrides) {
    var o = overrides || {};
    var history = readJSON('guan_test_history', []);
    var growth = readJSON('guan_growth', []);
    var design = readJSON('guan_design_saved', null);
    var profile = readJSON('guan_profile', {});
    // 成长记录可能是对象数组 / 对象键值，统一拍平
    var growthArr = Array.isArray(growth) ? growth : [];
    if (!Array.isArray(growth) && growth && typeof growth === 'object') {
      growthArr = Object.keys(growth).map(function (k) { return growth[k]; });
    }
    return {
      profile: o.profile || profile,
      history: o.history || history,
      growth: o.growth || growthArr,
      recentInputs: o.recentInputs || [],
      designSnapshot: o.designSnapshot || design,
      userId: o.userId || currentUserId(),
      pageType: o.pageType || ''
    };
  };

  // 核心：调用多 Agent 调度路由
  window.guanAgentChat = function (opts) {
    var pageType = String(opts.pageType || '').trim();
    if (!pageType) return Promise.reject(new Error('缺少 pageType（test/design/simulate/mirror）'));
    var ctx = window.guanBuildUserContext(opts);
    var endpoint = (opts.endpoint || '/api/chat').replace(/\/$/, '');
    var body = {
      pageType: pageType,
      userInput: String(opts.userInput || opts.question || '').trim(),
      provider: opts.provider || 'deepseek',
      userId: ctx.userId,
      profile: ctx.profile,
      history: ctx.history,
      growth: ctx.growth,
      recentInputs: ctx.recentInputs,
      designSnapshot: ctx.designSnapshot,
      extra: opts.extra || {},
      max_tokens: opts.maxTokens || 5000,
      temperature: opts.temperature !== undefined ? opts.temperature : 0.8,
      markSelfCheckUpdate: opts.markSelfCheckUpdate === true,
      source: opts.source || pageType,
      lastSelfCheckUpdate: opts.lastSelfCheckUpdate || ''
    };
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok || !data.ok) {
          var msg = (data && data.error && data.error.message) || ('请求失败（' + res.status + '）');
          var err = new Error(msg);
          err.code = (data && data.error && data.error.code) || '';
          throw err;
        }
        return data;
      });
    });
  };

  // 完成测试/设计后调用：通知后端刷新 lastSelfCheckUpdate
  window.guanMarkSelfCheckUpdate = function (source) {
    var userId = currentUserId();
    if (!userId) return Promise.resolve({ ok: true, configured: false });
    return fetch('/api/selfcheck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId, source: source || 'complete' })
    }).then(function (r) { return r.json().catch(function () { return {}; }); })
      .catch(function () { return { ok: false }; });
  };
})();
