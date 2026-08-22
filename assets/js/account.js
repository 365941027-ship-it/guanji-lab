// 观己实验室 · 登录页逻辑（Supabase 邮箱密码 + 微信预留）
(function () {
  'use strict';

  var mode = 'login';
  var msg = document.getElementById('loginMsg');
  var emailInput = document.getElementById('loginEmail');
  var passInput = document.getElementById('loginPass');
  var loginBtn = document.getElementById('loginBtn');
  var resetBtn = document.getElementById('resetPass');
  var wechatBtn = document.getElementById('wechatBtn');

  function setMsg(text, ok) {
    if (!msg) return;
    msg.textContent = text || '';
    msg.style.color = ok ? 'var(--gold-bright)' : '#d98f8f';
  }

  document.querySelectorAll('.login-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      mode = tab.getAttribute('data-tab');
      document.querySelectorAll('.login-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      loginBtn.textContent = mode === 'login' ? '登录' : '创建我的账号';
      setMsg('');
    });
  });

  function validate() {
    var email = emailInput.value.trim();
    var pass = passInput.value;
    if (!email || email.indexOf('@') < 1) { setMsg('请输入正确的邮箱'); return null; }
    if (pass.length < 6) { setMsg('密码至少 6 位'); return null; }
    return { email: email, password: pass };
  }

  loginBtn.addEventListener('click', function () {
    var v = validate();
    if (!v) return;
    setMsg('正在连接…');
    var p = mode === 'register' ? window.guanSignUp(v.email, v.password) : window.guanSignIn(v.email, v.password);
    if (p && p.then) {
      p.then(function (session) {
        if (session) {
          setMsg('欢迎回来', true);
          setTimeout(function () { window.location.href = 'profile.html'; }, 600);
        } else {
          var t = (document.querySelector('.toast') || {}).textContent || '';
          setMsg(t || (mode === 'register' ? '注册未完成，请重试' : '未能登录，请检查邮箱和密码'));
        }
      });
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      var email = emailInput.value.trim();
      if (!email || email.indexOf('@') < 1) { setMsg('先输入注册时的邮箱'); return; }
      window.guanResetPassword(email);
    });
  }

  if (wechatBtn) {
    wechatBtn.addEventListener('click', function () {
      window.guanWechatLogin();
    });
  }

  // 回车提交
  [emailInput, passInput].forEach(function (el) {
    if (el) el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') loginBtn.click();
    });
  });

  // 已登录则提示
  if (window.guanSupabaseUser) {
    window.guanSupabaseUser().then(function (res) {
      if (res && res.data && res.data.user) {
        setMsg('你已以 ' + (res.data.user.email || '') + ' 登录', true);
        loginBtn.textContent = '进入我的花园';
      }
    }).catch(function () {});
  }
})();
