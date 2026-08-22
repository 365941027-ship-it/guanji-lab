(function () {
  'use strict';

  var USERS_KEY = 'guan_users';
  var SESSION_KEY = 'guan_session';
  var DATA_PREFIX = 'guan_data_';

  function readUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function session() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }

  window.guanSession = session;

  // 找回账号：列出这台设备上已注册的昵称（仅本机，用于提示用户）
  window.guanLocalAccounts = function () {
    return Object.keys(readUsers());
  };

  // Per-account data namespace
  window.guanDataKey = function (key) {
    var s = session();
    return s && s.name ? DATA_PREFIX + encodeURIComponent(s.name) + '_' + key : key;
  };

  function migrateLegacyData(name) {
    // Move the current browser's data to the account namespace on first login
    var legacy = ['guan_profile', 'guan_growth', 'guan_journal', 'guan_journey', 'guan_archetype', 'guan_stage', 'guan_inneros',
      'guan_relationship', 'guan_energy', 'guan_values', 'guan_learning', 'guan_academic', 'guan_burnout', 'guan_pivot',
      'guan_drain', 'guan_attachment', 'guan_pleasing', 'guan_boundary', 'guan_custom', 'guan_sim', 'guan_card', 'guan_garden_comments',
      'guan_report_generated'];
    var moved = 0;
    legacy.forEach(function (k) {
      var v = localStorage.getItem(k);
      if (v) {
        localStorage.setItem(window.guanDataKey(k), v);
        moved++;
      }
    });
    return moved;
  }

  function setSession(u) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  }

  var mode = 'login';
  var avatar = '🌙';
  var msg = document.getElementById('loginMsg');

  function setMsg(text, ok) {
    msg.textContent = text || '';
    msg.style.color = ok ? 'var(--gold-bright)' : 'var(--gold-bright)';
  }

  document.querySelectorAll('.login-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      mode = tab.getAttribute('data-tab');
      document.querySelectorAll('.login-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      document.getElementById('pass2Field').classList.toggle('hidden', mode === 'login');
      document.getElementById('loginBtn').textContent = mode === 'login' ? '进入' : '创建我的花园';
      setMsg('');
    });
  });

  document.querySelectorAll('.avatar-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.avatar-btn').forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
      avatar = btn.getAttribute('data-avatar');
    });
  });

  document.getElementById('loginBtn').addEventListener('click', function () {
    var name = document.getElementById('loginName').value.trim();
    var pass = document.getElementById('loginPass').value;
    if (!name) { setMsg('给自己取个昵称吧'); return; }
    if (pass.length < 4) { setMsg('口令至少 4 位'); return; }

    var users = readUsers();
    var existing = users[name];

    if (mode === 'register') {
      var pass2 = document.getElementById('loginPass2').value;
      if (pass !== pass2) { setMsg('两次输入的口令不一致'); return; }
      if (existing) {
        if (existing.pass === pass) {
          setSession({ name: name, avatar: existing.avatar || '🌙' });
          window.location.href = 'profile.html';
          return;
        }
        setMsg('这个昵称已经有人用了，换一个，或直接登录'); return;
      }
      users[name] = { pass: pass, avatar: avatar, created: Date.now() };
      saveUsers(users);
      setSession({ name: name, avatar: avatar });
      migrateLegacyData(name);
      setMsg('欢迎回来，' + name + '。你的花园已经为你打开。', true);
      setTimeout(function () { window.location.href = 'profile.html'; }, 600);
      return;
    }

    if (!existing) {
      setMsg('还没有这个昵称——换个「注册」，创建属于你的花园');
      return;
    }
    if (existing.pass !== pass) { setMsg('口令不对，再想想'); return; }
    setSession({ name: name, avatar: existing.avatar || '🌙' });
    migrateLegacyData(name);
    setMsg('欢迎回来，' + name + '。', true);
    setTimeout(function () { window.location.href = 'profile.html'; }, 500);
  });

  var findBtn = document.getElementById('findAccount');
  if (findBtn) {
    findBtn.addEventListener('click', function () {
      var list = document.getElementById('accountList');
      if (!list) return;
      var names = window.guanLocalAccounts();
      if (!names.length) {
        list.innerHTML = '<p class="login-note">这台设备上还没有注册过账号。如果你想用之前的账号，很可能是换了浏览器、设备，或清除了浏览器数据——那些数据只在旧设备上，无法从服务器找回。</p>';
      } else {
        list.innerHTML = '<p class="login-note">这台设备上注册过的昵称：' +
          names.map(function (n) { return '「' + n + '」'; }).join('、') +
          '。找到你的昵称后，输入注册时设置的口令即可登录。</p>';
      }
      list.classList.toggle('hidden');
      findBtn.textContent = list.classList.contains('hidden') ? '忘了昵称？查看本机已注册的账号' : '收起';
    });
  }

  // If already logged in, show a notice instead of silently redirecting
  var s = session();
  if (s && s.name && window.location.pathname.indexOf('login.html') > -1) {
    var already = document.getElementById('loginMsg');
    if (already) {
      already.textContent = '你已经以「' + s.name + '」的身份在花园里了。';
      var btn = document.getElementById('loginBtn');
      if (btn) {
        btn.textContent = '进入我的花园';
        btn.addEventListener('click', function () {
          window.location.href = 'profile.html';
        });
      }
    }
  }
})();
