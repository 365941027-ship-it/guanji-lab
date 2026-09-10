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

  // 最近 3 轮用户输入（用于风格分类器的历史轮次判定）
  function recentRounds() {
    try {
      var raw = window.guanGet ? window.guanGet('guan_rounds') : localStorage.getItem('guan_rounds');
      var list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) return [];
      return list.slice(-3).map(function (x) {
        return typeof x === 'string' ? x : ((x && x.text) || '');
      }).filter(Boolean);
    } catch (e) { return []; }
  }

  // 记录一轮用户输入（每次完成测试 / 设计 / 模拟 / 自查时调用）
  window.guanRecordRound = function (text) {
    var t = String(text || '').trim();
    if (!t) return;
    try {
      var raw = window.guanGet ? window.guanGet('guan_rounds') : localStorage.getItem('guan_rounds');
      var list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];
      list.push({ text: t.slice(0, 300), ts: Date.now() });
      window.guanSet('guan_rounds', JSON.stringify(list.slice(-12)));
    } catch (e) {}
  };

  // 采集用户的「原话」：题目自填答案、设计输入、模拟备注、理想、成长记录
  function collectUserVoices() {
    var voices = [];
    // 1) 测试里用户手写的「其他」答案（由 quiz.js 持久化）
    try {
      var raw = window.guanGet ? window.guanGet('guan_voices') : null;
      if (raw) {
        JSON.parse(raw).forEach(function (v) {
          if (v && v.text) voices.push({ text: String(v.text).trim(), source: 'answer' });
        });
      }
    } catch (e) {}
    // 1b) 各测试里用户手写的「其他」答案（旧格式兼容）
    try {
      ['guan_who', 'guan_energy_map', 'guan_relation_map', 'guan_talent', 'guan_pressure', 'guan_life_want', 'guan_custom'].forEach(function (k) {
        var r = window.guanGet ? window.guanGet('guan_answers_' + k) : null;
        if (!r) return;
        try {
          JSON.parse(r).forEach(function (a) {
            if (a && a.other && String(a.other).trim()) voices.push({ text: String(a.other).trim(), source: 'answer' });
          });
        } catch (e) {}
      });
    } catch (e) {}
    // 2) 人生设计里写下的输入
    try {
      var design = JSON.parse(localStorage.getItem('guan_design_saved') || 'null');
      if (design) {
        ['pain', 'wish', 'block', 'goal'].forEach(function (f) {
          if (design[f]) voices.push({ text: String(design[f]), source: 'input' });
        });
        if (design.inputs) {
          ['pain', 'wish', 'block', 'goal'].forEach(function (f) {
            if (design.inputs[f]) voices.push({ text: String(design.inputs[f]), source: 'input' });
          });
        }
      }
    } catch (e) {}
    // 3) 模拟里的补充备注
    try {
      var sim = JSON.parse(localStorage.getItem('guan_sim') || 'null');
      if (sim && Array.isArray(sim.picks)) {
        sim.picks.forEach(function (p, i) {
          if (p && p.note) voices.push({ text: String(p.note), source: 'input' });
        });
      }
    } catch (e) {}
    // 4) 用户写下的理想
    try {
      var ideal = JSON.parse(localStorage.getItem('guan_ideal') || 'null');
      if (ideal && ideal.ideal) voices.push({ text: String(ideal.ideal), source: 'input' });
    } catch (e) {}
    return voices;
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
      recentInputs: (o.recentInputs && o.recentInputs.length) ? o.recentInputs : collectUserVoices(),
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
      styleSample: String(opts.styleSample || '').trim(),
      provider: opts.provider || 'deepseek',
      userId: ctx.userId,
      historyRounds: recentRounds(),
      profile: ctx.profile,
      history: ctx.history,
      growth: ctx.growth,
      recentInputs: ctx.recentInputs,
      designSnapshot: ctx.designSnapshot,
      extra: opts.extra || {},
      max_tokens: opts.maxTokens || 8000,
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

  // ---------- Agent 结果渲染助手（供 design / simulate / mirror 三个页面共用） ----------
  // 输出为「前 30% 免费预览 + 付费解锁全文」；已付费用户直接看全文。
  window.guanAgentIsPaid = function (key) {
    return !!(window.guanHasEntitlement && window.guanHasEntitlement(key || 'agent', 'paid'));
  };

  window.guanAgentCacheGet = function (key) {
    try { return (window.guanGet ? window.guanGet('guan_agent_' + key) : null) || ''; } catch (e) { return ''; }
  };

  window.guanAgentCacheSet = function (key, text) {
    try { if (window.guanSet) window.guanSet('guan_agent_' + key, String(text || '').slice(0, 16000)); } catch (e) {}
  };

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function mdish(text) {
    return String(text || '').split(/\n{2,}/).map(function (p) {
      var t = p.trim();
      if (!t) return '';
      t = esc(t);
      return '<p>' + t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }

  function cutPreview(text, ratio) {
    var paras = String(text || '').split(/\n{2,}/).filter(function (p) { return p.trim(); });
    if (!paras.length) return { html: '', remaining: 0, total: 0 };
    var full = text.length;
    var acc = 0;
    var kept = [];
    for (var i = 0; i < paras.length; i += 1) {
      acc += paras[i].length;
      kept.push(paras[i]);
      if (acc >= full * (ratio || 0.3)) break;
    }
    return { kept: kept, total: paras.length };
  }

  // 打开金数据支付并轮询解锁；unlockKey 默认与 agentKey 相同
  window.guanAgentPayDone = function (agentKey, unlockKey, done) {
    var key = unlockKey || agentKey;
    var cfg = window.GUAN_PAY_CONFIG || {};
    var goods = cfg.goods || {};
    var url = goods[key] || goods.default || '';
    if (!url || !cfg.enabled) {
      window.guanToast('付费通道正在准备中，很快开放');
      return;
    }
    var email = '';
    try {
      var s = JSON.parse(localStorage.getItem('guan_session') || 'null');
      email = (s && s.email) || '';
    } catch (e) {}
    var win;
    if (url.indexOf('jsform.com') > -1) {
      var sep = url.indexOf('?') > -1 ? '&' : '?';
      var payUrl = email ? url + sep + 'email=' + encodeURIComponent(email) + '&quiz=' + encodeURIComponent(key) : url;
      win = window.open(payUrl, '_blank');
    } else {
      var ret = location.href.split('?')[0].split('#')[0] + '?paid=1&quiz=' + encodeURIComponent(key) + '&order=' + Date.now();
      var s2 = url.indexOf('?') > -1 ? '&' : '?';
      win = window.open(url + s2 + 'return_url=' + encodeURIComponent(ret), '_blank');
    }
    if (win) {
      window.guanToast('已为你打开付款页。完成后回到本页会自动解锁');
      window.guanAgentStartPaidPoll(key, function () {
        if (done) done();
        else try { location.reload(); } catch (e) {}
      });
    } else {
      window.guanToast('浏览器拦截了付款页，请从页面链接前往');
    }
  };

  window.guanAgentPay = function (agentKey, unlockKey) {
    window.guanAgentPayDone(agentKey, unlockKey, null);
  };

  window.guanAgentStartPaidPoll = function (unlockKey, done) {
    var email = '';
    try {
      var s = JSON.parse(localStorage.getItem('guan_session') || 'null');
      email = (s && s.email) || '';
    } catch (e) {}
    if (!email) return;
    var key = unlockKey || 'agent';
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (tries > 30) { clearInterval(timer); return; }
      fetch('/api/order/status?email=' + encodeURIComponent(email) + '&quiz=' + encodeURIComponent(key), { cache: 'no-store' })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (data) {
          if (data && data.paid) {
            clearInterval(timer);
            if (window.guanMarkEntitlement) window.guanMarkEntitlement(key, 'paid', (data.order && data.order.orderNo) || 'auto');
            if (window.guanMarkSelfCheckUpdate) window.guanMarkSelfCheckUpdate('pay');
            if (done) done();
          }
        })
        .catch(function () {});
    }, 4000);
  };

  // 渲染 Agent 长文：免费 30% 或全文
  window.guanAgentRenderResult = function (opts) {
    var text = String(opts.text || '');
    var key = opts.key || 'agent';
    var container = opts.container;
    if (!container || !text) return;
    window.guanAgentCacheSet(key, text);
    var paid = window.guanAgentIsPaid(key);
    var title = opts.title || '你的深度解读';
    var sub = opts.sub || (paid ? '完整版' : '免费预览 · 前 30%');
    var html;
    if (paid) {
      html = mdish(text);
    } else {
      var cut = cutPreview(text, 0.3);
      html = cut.kept.map(function (p) {
        return '<p>' + esc(p).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') + '</p>';
      }).join('') + '<p style="opacity:.7">……</p>';
    }
    var price = (window.GUAN_PRICE ? window.GUAN_PRICE(key) : 9.9) || 9.9;
    var lockHtml = paid ? '' :
      '<div class="deep-lock"><div><b>以上为免费预览 · 前 30%</b>' +
      '<span>解锁后查看完整 ' + title + '，并自动存入「我的档案」。</span></div>' +
      '<button type="button" class="btn btn-gold btn-sm" data-guan-agent-pay>解锁完整 · ¥' + price + '</button></div>';
    container.innerHTML = '<div class="deep-result guan-agent-result">' +
      '<div class="deep-head"><h4>' + title + '</h4><span>' + sub + '</span></div>' +
      '<div class="deep-body">' + html + lockHtml + '</div>' +
      '<div class="deep-actions">' +
      '<button type="button" class="btn btn-gold btn-sm" data-guan-agent-archive>存入我的档案</button>' +
      '<a class="btn btn-sm" href="growth.html">记入成长轨迹</a>' +
      '</div>' +
      '<p class="deep-note">由观己实验室为你单独生成，仅供自我探索参考，不构成专业建议。</p></div>';
    var payBtn = container.querySelector('[data-guan-agent-pay]');
    if (payBtn) payBtn.addEventListener('click', function () {
      window.guanAgentPayDone(key, key, function () {
        if (opts.onPaid) opts.onPaid();
        else try { location.reload(); } catch (e) {}
      });
    });
    var archiveBtn = container.querySelector('[data-guan-agent-archive]');
    if (archiveBtn) archiveBtn.addEventListener('click', function () {
      try {
        if (window.guanSaveToArchive) {
          window.guanSaveToArchive({ type: 'agent', key: key, title: title, result: title, detail: { text: text.slice(0, 16000), date: new Date().toISOString() } });
        }
        var growth = [];
        try { growth = JSON.parse(window.guanGet('guan_growth') || '[]'); } catch (e) { growth = []; }
        var d = new Date();
        function pad(n) { return String(n).padStart(2, '0'); }
        growth.push({ date: d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()), mood: '平静', energy: 3, note: title + ' · 已保存并存入我的档案', design: '' });
        window.guanSet('guan_growth', JSON.stringify(growth.slice(-500)));
        if (window.guanSyncGrowth) window.guanSyncGrowth('growth', growth.slice(-500));
      } catch (e) {}
      window.guanToast('已存入我的档案与成长记录');
    });
    return paid;
  };
})();
