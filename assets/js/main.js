(function () {
  'use strict';

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

  // Account chip in header
  var session = null;
  try {
    session = JSON.parse(localStorage.getItem('guan_session') || 'null');
  } catch (e) { session = null; }
  var headerInner = document.querySelector('.header-inner');
  if (headerInner) {
    var chip = document.createElement('a');
    chip.className = 'account-chip' + (session && session.name ? '' : ' login');
    chip.style.cssText = 'flex:none';
    if (session && session.name) {
      chip.href = 'profile.html';
      chip.innerHTML = '<span class="av">' + (session.avatar || '🌙') + '</span><span class="name">' + session.name + '</span><span class="logout">退出</span>';
      chip.title = '我的档案';
      chip.addEventListener('click', function (e) {
        if (e.target.classList.contains('logout')) {
          e.preventDefault();
          localStorage.removeItem('guan_session');
          window.location.reload();
        }
      });
    } else {
      chip.href = 'login.html';
      chip.textContent = '登录 / 注册';
    }
    var navToggle = document.getElementById('navToggle');
    if (navToggle) {
      headerInner.insertBefore(chip, navToggle);
    } else {
      headerInner.appendChild(chip);
    }
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
  window.guanGet = function (key) {
    return localStorage.getItem(window.guanDataKey ? window.guanDataKey(key) : key);
  };
  window.guanSet = function (key, val) {
    localStorage.setItem(window.guanDataKey ? window.guanDataKey(key) : key, val);
  };
  window.guanRemove = function (key) {
    localStorage.removeItem(window.guanDataKey ? window.guanDataKey(key) : key);
  };

  // Show recent quiz results on the tests hub
  var resultKeys = {
    guan_who: '我如何成为我',
    guan_energy_map: '我的能量地图',
    guan_relation_map: '我在关系里的位置',
    guan_talent: '我的天赋信号',
    guan_pressure: '我正被什么压着',
    guan_life_want: '我真正想要的生活'
  };
  Object.keys(resultKeys).forEach(function (key) {
    // 账户命名空间优先，兼容旧的裸 localStorage
    var val = (window.guanGet ? window.guanGet(key) : null) || localStorage.getItem(key);
    var el = document.querySelector('[data-result-for="' + key + '"]');
    if (val && el) {
      el.textContent = '最近一次：' + val.slice(0, 40);
      el.classList.add('show');
    }
  });
})();
