(function () {
  'use strict';

  // 服务端解读代理（免用户 Key）
  // 部署代理后，把 GUAN_PROXY_DEFAULT 改为完整 URL，例如 'https://your-app.vercel.app/api/interpret'
  // 个人调试可用 localStorage.setItem('guan_proxy_url', '...') 覆盖
  var GUAN_PROXY_DEFAULT = 'https://guanji-lab.vercel.app/api/interpret';
  window.GUAN_PROXY_URL = (function () {
    try {
      return localStorage.getItem('guan_proxy_url') || GUAN_PROXY_DEFAULT || '';
    } catch (e) {
      return GUAN_PROXY_DEFAULT || '';
    }
  })();

  // Mobile nav
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Splash screen (first visit, brand introduction)
  if (!localStorage.getItem('guan_splash_seen')) {
    var splash = document.createElement('div');
    splash.id = 'splash';
    splash.innerHTML =
      '<div class="splash-card">' +
      '  <img src="assets/img/logo.svg" alt="观己实验室" class="splash-logo">' +
      '  <div class="splash-name">观己实验室</div>' +
      '  <div class="splash-en">SELF INSIGHT LAB</div>' +
      '  <p class="splash-lead">理解自己，设计人生。</p>' +
      '  <p class="splash-desc">我们相信，真正的成长不是变成更好的别人，而是成为更完整的自己。</p>' +
      '  <div class="splash-path">' +
      '    <div><b>理解</b><span>先看清自己</span></div>' +
      '    <div><b>设计</b><span>再选择方向</span></div>' +
      '    <div><b>记录</b><span>在轨迹里看见变化</span></div>' +
      '    <div><b>成长</b><span>慢慢成为自己</span></div>' +
      '  </div>' +
      '  <div class="splash-links">' +
      '    <a href="letters.html">读一封来信</a>' +
      '    <a href="wisdom.html">看思想源头</a>' +
      '  </div>' +
      '  <button type="button" class="btn btn-gold" id="splashEnter">开始这段旅程</button>' +
      '</div>';
    document.body.appendChild(splash);
    document.getElementById('splashEnter').addEventListener('click', function () {
      localStorage.setItem('guan_splash_seen', '1');
      splash.classList.add('hide');
      setTimeout(function () { splash.remove(); }, 500);
    });
    // 点击「读一封来信 / 看思想源头」：先记录已看过开屏，再跳转，避免下一页又弹出
    splash.querySelectorAll('.splash-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        localStorage.setItem('guan_splash_seen', '1');
      });
    });
  }

  // Floating help button (crisis support)
  var helpBtn = document.createElement('button');
  helpBtn.type = 'button';
  helpBtn.id = 'helpBtn';
  helpBtn.setAttribute('aria-label', '需要帮助');
  helpBtn.innerHTML = '☎';
  document.body.appendChild(helpBtn);
  var helpCard = document.createElement('div');
  helpCard.id = 'helpCard';
  helpCard.className = 'hidden';
  helpCard.innerHTML =
    '<button type="button" class="help-close" aria-label="关闭">×</button>' +
    '<h4>此刻需要帮助吗？</h4>' +
    '<p>如果你正经历难以承受的情绪，请知道：有人愿意听你说话，你不需要一个人扛。</p>' +
    '<a href="tel:4001619995">全国心理援助热线 400-161-9995</a>' +
    '<a href="tel:12338">妇女维权热线 12338（关系安全）</a>' +
    '<a href="https://www.psy525.cn" target="_blank" rel="noopener">寻找专业心理咨询</a>' +
    '<p class="help-foot">紧急情况请拨打 110 或前往最近的医院急诊。</p>';
  document.body.appendChild(helpCard);
  helpBtn.addEventListener('click', function () {
    helpCard.classList.toggle('hidden');
  });
  helpCard.querySelector('.help-close').addEventListener('click', function () {
    helpCard.classList.add('hidden');
  });

  // Privacy banner (once per device)
  if (!localStorage.getItem('guan_privacy_ok')) {
    var bar = document.createElement('div');
    bar.className = 'privacy-bar';
    bar.innerHTML = '<span><strong>关于你的数据：</strong>所有测试结果、档案与记录只保存在这台设备的浏览器里，不上传任何服务器。</span>' +
      '<button type="button">我知道了</button>';
    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.classList.add('show'); });
    bar.querySelector('button').addEventListener('click', function () {
      localStorage.setItem('guan_privacy_ok', '1');
      bar.classList.remove('show');
      setTimeout(function () { bar.remove(); }, 350);
    });
  }

  // Account chip in header（支持 Supabase 会话；auth.js 加载后会自动刷新）
  var chip = null;
  function renderAccountChip(user) {
    var headerInner = document.querySelector('.header-inner');
    if (!headerInner) return;
    if (!chip) {
      chip = document.createElement('a');
      chip.className = 'account-chip';
      chip.style.cssText = 'flex:none';
      var navToggle = document.getElementById('navToggle');
      if (navToggle) headerInner.insertBefore(chip, navToggle);
      else headerInner.appendChild(chip);
    }
    if (user && (user.email || user.name)) {
      var name = user.name || (user.email || '').split('@')[0] || '我';
      chip.href = 'profile.html';
      chip.className = 'account-chip';
      chip.innerHTML = '<span class="av">🌙</span><span class="name">' + name + '</span><span class="logout">退出</span>';
      chip.title = '我的档案';
      chip.onclick = function (e) {
        if (e.target.classList.contains('logout')) {
          e.preventDefault();
          if (window.guanSignOut) window.guanSignOut();
          else window.location.reload();
        }
      };
    } else {
      chip.href = 'login.html';
      chip.className = 'account-chip login';
      chip.textContent = '登录 / 注册';
      chip.onclick = null;
    }
  }
  window.guanRenderAccount = renderAccountChip;

  // 初始化：优先 Supabase 会话，其次本地旧会话
  var legacySession = null;
  try {
    legacySession = JSON.parse(localStorage.getItem('guan_session') || 'null');
  } catch (e) { legacySession = null; }
  if (legacySession && legacySession.name) {
    renderAccountChip({ name: legacySession.name, avatar: legacySession.avatar });
  } else {
    renderAccountChip(null);
  }
  if (window.supabase && window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey) {
    var sbClient = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
    sbClient.auth.getSession().then(function (res) {
      var u = res.data && res.data.session && res.data.session.user;
      if (u) renderAccountChip({ email: u.email });
    }).catch(function () {});
  }

  // Toast helper
  window.guanToast = function (msg) {
    var old = document.querySelector('.toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 350);
    }, 2400);
  };

  // Copy helper for share results
  window.guanCopy = function (text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (done) done(true);
      }, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  };

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      if (done) done(true);
    } catch (e) {
      if (done) done(false);
    }
    ta.remove();
  }

  // Shared profile accessor (used by growth report / design / garden)
  window.guanSession = function () {
    try {
      return JSON.parse(localStorage.getItem('guan_session') || 'null');
    } catch (e) {
      return null;
    }
  };
  window.guanDataKey = function (key) {
    var s = window.guanSession();
    return s && s.name ? 'guan_data_' + encodeURIComponent(s.name) + '_' + key : key;
  };
  window.guanProfile = function () {
    try {
      var key = window.guanDataKey ? window.guanDataKey('guan_profile') : 'guan_profile';
      return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (e) {
      return {};
    }
  };

  // Account-aware storage helpers
  function usingCloudAccount() {
    if (!window.supabase || !window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.url) return false;
    var ref = window.SUPABASE_CONFIG.url.replace(/^https?:\/\//, '').replace(/\.supabase\.co.*$/, '');
    return !!localStorage.getItem('sb-' + ref + '-auth-token');
  }

  window.guanGet = function (key) {
    // Supabase 云端账号已按用户隔离，直接读裸 key；本地旧账号仍走命名空间
    if (usingCloudAccount()) return localStorage.getItem(key);
    return localStorage.getItem(window.guanDataKey ? window.guanDataKey(key) : key);
  };
  window.guanSet = function (key, val) {
    if (usingCloudAccount()) { localStorage.setItem(key, val); return; }
    localStorage.setItem(window.guanDataKey ? window.guanDataKey(key) : key, val);
  };
  window.guanRemove = function (key) {
    if (usingCloudAccount()) { localStorage.removeItem(key); return; }
    localStorage.removeItem(window.guanDataKey ? window.guanDataKey(key) : key);
  };

  // 全量人话映射：把内部缩写（如「依安全」「复安顿」「心匠人」）统一转换为用户能读懂的短词
  window.GUAN_PRETTY = {
    guan_who: {
      '探索者': '探索者', '创造者': '创造者', '觉知者': '觉知者', '重构者': '重构者', '守护者': '守护者',
      '探索期': '探索期', '重构期': '重构期', '积累期': '积累期', '转型期': '转型期',
      '自由': '自由', '联结': '联结', '创造': '创造', '安定': '安定',
      '探索身份': '探索中的身份', '角色身份': '角色中的身份', '流动身份': '流动的身份', '整合身份': '整合的身份'
    },
    guan_energy_map: {
      '反刍耗': '反复回想', '比较耗': '与人比较', '标准耗': '要求过高', '讨好耗': '讨好他人',
      '饱满': '能量饱满', '平静': '平静稳定', '疲惫': '电量偏低', '萌芽': '能量萌芽',
      '疗愈释放': '释放', '疗愈安顿': '安顿', '疗愈修复': '修复', '疗愈萌芽': '萌芽',
      '苛责': '自我苛责', '关怀': '自我关怀', '忽视': '自我忽视', '回避': '自我回避',
      '夜反刍': '夜晚反刍', '夜焦虑': '夜晚焦虑', '夜孤独': '夜晚孤独', '夜灵感': '夜晚灵感'
    },
    guan_relation_map: {
      '依安全': '安全型靠近', '依焦虑': '焦虑型靠近', '依回避': '回避型靠近', '依混乱': '矛盾型靠近',
      '讨习惯': '习惯性付出', '讨怕冲': '怕冲突而让步', '讨求认': '依赖认可', '讨低值': '容易低估自己',
      '边模糊': '边界偏模糊', '边僵硬': '边界偏硬', '边健康': '边界健康', '边成长': '边界正在成形',
      '冲靠近': '冲突后主动靠近', '冲冷静': '冲突后需要冷静', '冲回避': '冲突后倾向回避', '冲内省': '冲突后反复思量',
      '告反刍': '告别后反复回想', '告麻木': '告别后有些麻木', '告波动': '告别后情绪起伏', '告愈合': '告别后正在愈合'
    },
    guan_talent: {
      '心匠人': '匠人之心', '心解题': '解题之心', '心创造': '创造之心', '心联结': '联结之心',
      '性开放': '开放', '性尽责': '尽责', '性外向': '外向', '性宜人': '宜人', '性稳定': '稳定',
      '学直觉': '直觉学习', '学逻辑': '逻辑学习', '学实践': '实践学习', '学交流': '交流学习',
      '信经验': '经验自信', '信专长': '专长自信', '信自我': '自我认可', '信方法': '方法自信'
    },
    guan_pressure: {
      '复行动': '动起来', '复安顿': '安顿下来', '复休息': '好好休息', '复联结': '与人联结',
      '资经历': '过往经历', '资信念': '内心信念', '资关系': '重要关系', '资自我': '自我信任',
      '长探索': '向外探索', '长扎根': '向下扎根', '长蜕变': '蜕变重生', '长蓄力': '安静蓄力',
      '命创造': '创造', '命联结': '联结', '命自由': '自由', '命意义': '意义'
    },
    guan_life_want: {
      '工成长': '成长', '工稳定': '稳定', '工成就': '成就', '工归属': '归属',
      '满低': '满意度偏低', '满中': '满意度中等', '满高': '满意度较高',
      '欲自由': '自由', '欲创造': '创造', '欲真实': '真实', '欲安定': '安定',
      '向自由': '迈向自由', '向创造': '开始创造', '向真实': '回归真实', '向安定': '走向安定'
    }
  };
  window.guanPrettyResult = function (key, raw) {
    if (!raw) return raw;
    var map = window.GUAN_PRETTY[key] || null;
    if (!map) return raw;
    return String(raw).split(/[·、,，]/).map(function (part) {
      var p = part.trim();
      return map[p] || p;
    }).join(' · ');
  };

  // 统一「保存到我的档案」：测试/设计/模拟共用
  window.guanSaveToArchive = function (item) {
    if (!item || !item.type || !item.title) {
      if (window.guanToast) window.guanToast('保存失败，请重试');
      return;
    }
    try {
      var list = [];
      try { list = JSON.parse(localStorage.getItem('guan_archive') || '[]'); } catch (e) { list = []; }
      var entry = {
        type: item.type,
        key: item.key || '',
        title: item.title,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        result: item.result || '',
        detail: item.detail || {}
      };
      // 同类型同 key 只保留最新
      var dedupKey = entry.type + '|' + entry.key;
      list = list.filter(function (it) { return (it.type + '|' + it.key) !== dedupKey; });
      list.unshift(entry);
      list = list.slice(0, 50);
      localStorage.setItem('guan_archive', JSON.stringify(list));
      if (window.guanSyncArchive) window.guanSyncArchive(list);
      if (window.guanToast) {
        window.guanToast('已保存到我的档案。之后再做探索时，结果会更懂你、更准确');
      }
    } catch (e) {
      if (window.guanToast) window.guanToast('保存失败，请重试');
    }
  };

  // Show recent quiz results on the tests hub
  var resultKeys = {
    guan_who: '我如何成为我',
    guan_energy_map: '我的能量地图',
    guan_relation_map: '我在关系里的位置',
    guan_talent: '我的天赋信号',
    guan_pressure: '我如何重新生长',
    guan_life_want: '我真正想要的生活'
  };
  Object.keys(resultKeys).forEach(function (key) {
    // 账户命名空间优先，兼容旧的裸 localStorage
    var val = (window.guanGet ? window.guanGet(key) : null) || localStorage.getItem(key);
    var el = document.querySelector('[data-result-for="' + key + '"]');
    if (val && el) {
      el.textContent = '最近一次：' + window.guanPrettyResult(key, val).slice(0, 40);
      el.classList.add('show');
    }
  });
})();
