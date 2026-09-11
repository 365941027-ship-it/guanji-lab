// 观己实验室 · 登录页交互
// 提交时调用自建后端（/api/auth/register、/api/auth/login），
// 成功后浏览器会拿到 httpOnly 会话 Cookie，前端无需（也无法）自己保存登录状态。
(function () {
  'use strict';

  var mode = 'login';                 // 'login' | 'register'
  var MIN_PASSWORD = 8;               // 与后端 api/auth.js 的校验保持一致

  var msg = document.getElementById('loginMsg');
  var emailInput = document.getElementById('loginEmail');
  var passInput = document.getElementById('loginPass');
  var loginBtn = document.getElementById('loginBtn');

  function setMsg(text, ok) {
    if (!msg) return;
    msg.textContent = text || '';
    msg.style.color = ok ? 'var(--gold-bright)' : '#d98f8f';
  }

  // 切换「登录 / 注册」
  document.querySelectorAll('.login-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      mode = tab.getAttribute('data-tab');
      document.querySelectorAll('.login-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      if (loginBtn) loginBtn.textContent = mode === 'login' ? '登录' : '创建我的账号';
      setMsg('');
    });
  });

  function validate() {
    var email = (emailInput && emailInput.value || '').trim();
    var pass = (passInput && passInput.value) || '';
    if (!email || email.indexOf('@') < 1) { setMsg('请输入正确的邮箱'); return null; }
    if (pass.length < MIN_PASSWORD) { setMsg('密码至少 ' + MIN_PASSWORD + ' 位'); return null; }
    return { email: email, password: pass };
  }

  var submitting = false;

  async function submit() {
    if (submitting) return;               // 防止连点重复提交
    var v = validate();
    if (!v) return;

    submitting = true;
    if (loginBtn) { loginBtn.disabled = true; loginBtn.textContent = '正在连接…'; }
    setMsg('正在连接…');

    var result = null;
    try {
      result = mode === 'register'
        ? await window.guanSignUp(v.email, v.password)
        : await window.guanSignIn(v.email, v.password);
    } catch (e) {
      result = null;
    }

    submitting = false;
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.textContent = mode === 'login' ? '登录' : '创建我的账号';
    }

    if (result && result.user) {
      setMsg(mode === 'register' ? '注册成功，正在进入…' : '欢迎回来，正在进入…', true);
      setTimeout(function () { window.location.href = 'index.html'; }, 600);
      return;
    }

    // 失败原因由 guanSignUp / guanSignIn 通过 toast 提示，这里给一个兜底文案
    var toastEl = document.querySelector('.toast');
    var t = toastEl && toastEl.textContent ? toastEl.textContent : '';
    setMsg(t || (mode === 'register' ? '注册未完成，请重试' : '登录失败，请检查邮箱和密码'));
  }

  if (loginBtn) loginBtn.addEventListener('click', submit);

  // 回车提交
  [emailInput, passInput].forEach(function (el) {
    if (el) el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });
  });

  // 已登录则提示（会话由 Cookie 维持，刷新页面也认得出）
  if (window.guanRefreshSession) {
    window.guanRefreshSession().then(function (user) {
      if (user) {
        setMsg('你已以 ' + (user.email || '') + ' 登录', true);
        if (loginBtn) loginBtn.textContent = '进入观己';
      }
    }).catch(function () {});
  }
})();
