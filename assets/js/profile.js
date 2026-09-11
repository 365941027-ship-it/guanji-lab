(function () {
  'use strict';

  var KEY = 'guan_profile';
  var EDIT_LIMIT = 3;
  var LOCK_KEY = 'guan_profile_lock';

  function monthKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  function lockState() {
    try {
      var lock = JSON.parse(localStorage.getItem(LOCK_KEY) || '{}');
      if (lock.month !== monthKey()) {
        lock = { month: monthKey(), count: 0 };
        localStorage.setItem(LOCK_KEY, JSON.stringify(lock));
      }
      return lock;
    } catch (e) {
      return { month: monthKey(), count: 0 };
    }
  }

  function renderLockUI() {
    var lock = lockState();
    var remaining = EDIT_LIMIT - lock.count;
    var note = document.getElementById('profileLockNote');
    var upd = document.getElementById('updateProfile');
    var save = document.getElementById('saveProfile');
    if (lock.count > 0) {
      document.querySelectorAll('.profile-form input, .profile-form select, .profile-form textarea, #pAvatarFile').forEach(function (el) {
        el.disabled = true;
      });
      save.style.display = 'none';
      upd.style.display = 'block';
      upd.textContent = remaining > 0 ? '更新档案（本月剩余 ' + remaining + ' 次）' : '本月更新次数已用完，下月 1 日恢复';
      upd.disabled = remaining <= 0;
      note.textContent = '档案已锁定：本月已保存 ' + lock.count + ' 次（每月最多 3 次）。如需修改，请点「更新档案」。';
    }
  }

  function unlockForm() {
    document.querySelectorAll('.profile-form input, .profile-form select, .profile-form textarea, #pAvatarFile').forEach(function (el) {
      el.disabled = false;
    });
    document.getElementById('saveProfile').style.display = 'block';
    document.getElementById('updateProfile').style.display = 'none';
    document.getElementById('profileLockNote').textContent = '';
  }

  function read() {
    try {
      return JSON.parse(window.guanGet(KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  // ---------- 档案读写：以服务器为准 ----------

  /** 统一的请求封装：带上会话 Cookie，错误时抛出带 .status 的对象 */
  function api(path, options) {
    var opts = options || {};
    opts.credentials = 'same-origin';
    if (opts.body && typeof opts.body !== 'string') {
      opts.headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
      opts.body = JSON.stringify(opts.body);
    }
    return fetch(path, opts).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var m = (data && data.error) || '请求失败';
          if (m && typeof m === 'object') m = m.message || '请求失败';
          var err = new Error(m);
          err.status = res.status;
          throw err;
        }
        return data;
      });
    });
  }

  /**
   * 找出本机上所有「旧版档案」的存放位置。
   *
   * 历史原因，旧档案可能落在两种 key 上：
   *   1) 裸 key：guan_profile        —— 从未建过本地账号的用户
   *   2) 命名空间 key：guan_data_<昵称>_guan_profile —— 建过本地账号的用户
   * 只扫裸 key 会让第 2 类用户的旧数据永远同步不上来，所以这里两个都找。
   */
  function legacyProfileKeys() {
    var keys = [];
    try {
      if (localStorage.getItem(KEY)) keys.push(KEY);
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k === KEY) continue;
        if (k.indexOf('guan_data_') === 0 && k.slice(-('_' + KEY).length) === '_' + KEY) {
          if (keys.indexOf(k) < 0) keys.push(k);
        }
      }
    } catch (e) {}
    return keys;
  }

  /** 本地是否还有「未上传过的旧档案」；多个来源时按字段合并，缺的字段不覆盖已有的 */
  function localLegacyProfile() {
    var merged = {};
    legacyProfileKeys().forEach(function (k) {
      try {
        var p = JSON.parse(localStorage.getItem(k) || 'null');
        if (!p || typeof p !== 'object') return;
        Object.keys(p).forEach(function (field) {
          var v = p[field];
          if (v === undefined || v === null || v === '') return;
          if (merged[field] === undefined || merged[field] === null || merged[field] === '') merged[field] = v;
        });
      } catch (e) {}
    });
    return Object.keys(merged).length ? merged : null;
  }

  /** 清掉本机上所有旧档案副本（上传成功后调用，避免下次重复上传） */
  function clearLocalLegacyProfile() {
    legacyProfileKeys().forEach(function (k) {
      try { localStorage.removeItem(k); } catch (e) {}
    });
  }

  /**
   * 旧档案迁移（方案A）：把本机遗留的旧档案上传到服务器。
   * 只在「已登录」且「服务器档案为空」且「本机有旧数据」时才执行，
   * 避免把用户已经更新过的云端档案覆盖回旧版本。
   * @returns {Promise<{migrated:boolean, reason?:string}>}
   */
  async function migrateLocalProfile() {
    var local = localLegacyProfile();
    if (!local) return { migrated: false, reason: 'no_local' };

    var user = window.guanCurrentUser ? window.guanCurrentUser() : null;
    if (!user) return { migrated: false, reason: 'not_logged_in' };

    // 先看服务器上有没有档案
    var server = {};
    try {
      var data = await api('/api/account/profile', { method: 'GET' });
      server = (data && data.profile) || {};
    } catch (e) {
      return { migrated: false, reason: 'load_failed' };
    }
    if (server && Object.keys(server).length) {
      // 服务器已有档案：以服务器为准，清掉本机旧的，避免以后重复上传
      clearLocalLegacyProfile();
      return { migrated: false, reason: 'server_has_data' };
    }

    try {
      await api('/api/account/profile', { method: 'POST', body: { profile: local } });
    } catch (e) {
      return { migrated: false, reason: 'upload_failed' };
    }

    clearLocalLegacyProfile();
    if (window.guanSetProfileCache) window.guanSetProfileCache(local);
    window.guanToast('已把本机档案同步到你的账号');
    return { migrated: true };
  }

  // 暴露给 auth.js：登录成功后立即尝试迁移
  window.guanMigrateLocalProfile = function () { return migrateLocalProfile(); };

  /** 从服务器加载档案并渲染（页面打开时调用） */
  async function loadProfileFromServer() {
    var migrated = await migrateLocalProfile();
    if (migrated.migrated) return;      // 迁移成功，页面上已经填好了

    var data;
    try {
      data = await api('/api/account/profile', { method: 'GET' });
    } catch (err) {
      if (err && err.status === 401) return;   // 未登录：保持本地展示
      console.warn('[profile] 加载档案失败：', err && err.message);
      return;
    }
    var p = (data && data.profile) || {};
    if (window.guanSetProfileCache) window.guanSetProfileCache(p);
    if (!Object.keys(p).length) return;        // 服务器暂无档案：保留当前表单内容
    fillForm(p);
    renderPreview(p);
    renderCharts();
  }

  /** 保存档案到服务器 */
  async function saveProfileToServer(p) {
    var data = await api('/api/account/profile', { method: 'POST', body: { profile: p } });
    if (window.guanSetProfileCache) window.guanSetProfileCache((data && data.profile) || p);
    return data;
  }

  function fillForm(p) {
    if (!p) return;
    document.getElementById('pNick').value = p.nickname || '';
    document.getElementById('pGender').value = p.gender || '';
    document.getElementById('pJob').value = p.job || '';
    if (p.avatar && p.avatar.length <= 8) setAvatar(p.avatar);
    else if (p.avatar && p.avatar.length > 8) avatar = p.avatar;
    document.getElementById('pBirth').value = p.birth || '';
    document.getElementById('pHour').value = p.hour || '';
    document.getElementById('pCity').value = p.city || '';
    document.getElementById('pMbti').value = p.mbti || '';
    document.getElementById('pEnnea').value = p.ennea || '';
    document.getElementById('pStage').value = p.stage || '';
    document.getElementById('pSelfDesc').value = p.selfDesc || '';
    document.getElementById('pFocus').value = p.focus || '';
  }

  // 我的测试档案：从历史存档渲染已完成测试
  function renderTestHistory() {
    var el = document.getElementById('testHistory');
    if (!el) return;
    var list = [];
    try { list = JSON.parse(window.guanGet('guan_test_history') || '[]'); } catch (e) { list = []; }
    if (!list.length) {
      el.innerHTML = '<p style="opacity:.6">还没有完成过测试。去「探索」做一次，档案会自动留下记录。</p>';
      return;
    }
    el.innerHTML = list.map(function (it) {
      var href = it.url || 'tests.html';
      var result = (window.guanPrettyResult && it.key) ? window.guanPrettyResult(it.key, it.result) : it.result;
      return '<div class="test-history-item">' +
        '<div class="th-main"><b>' + (it.title || '一次探索') + '</b>' +
        '<span class="th-date">' + (it.date || '') + ' ' + (it.time || '') + '</span></div>' +
        '<div class="th-result">' + (result || '已记录') + '</div>' +
        '<a class="btn btn-sm" href="' + href + '">重新探索</a>' +
        '</div>';
    }).join('');
  }

  async function loadCloudTestHistory() {
    if (!window.guanLoadTestHistory) return;
    try {
      var list = await window.guanLoadTestHistory();
      if (list) renderTestHistory();
    } catch (e) {}
  }

  // 我的人生设计：从存档渲染已保存的方案
  function renderDesignArchive() {
    var el = document.getElementById('designArchive');
    if (!el) return;
    var saved = null;
    try { saved = JSON.parse(window.guanGet('guan_design_saved') || 'null'); } catch (e) { saved = null; }
    if (!saved || !saved.routes || !saved.routes.length) {
      el.innerHTML = '<p style="opacity:.6">还没有保存过人生设计方案。去「设计」生成一次，点「保存到我的档案」即可留档。</p>';
      return;
    }
    var careers = saved.routes.slice(0, 3).map(function (r, i) {
      return '<div class="test-history-item">' +
        '<div class="th-main"><b>原型 ' + ['A', 'B', 'C'][i] + ' · ' + (r.tag || r.title) + '</b>' +
        '<span class="th-date">' + (saved.date || '') + ' ' + (saved.time || '') + '</span></div>' +
        '<div class="th-result">' + (r.careers && r.careers.length ? '参考职业：' + r.careers.join('、') : r.body || '') + '</div>' +
        '<a class="btn btn-sm" href="design.html">重新查看设计</a>' +
        '</div>';
    }).join('');
    var plan30 = (saved.plan30 || []).length ?
      '<div class="test-history-item"><div class="th-main"><b>三十天计划</b></div>' +
      '<div class="th-result">' + saved.plan30.map(function (w) { return w.week + '：' + w.plan; }).join('；').slice(0, 180) + '…</div></div>' : '';
    el.innerHTML = careers + plan30 +
      '<p style="font-size:12px;color:var(--muted-2);margin-top:10px">保存于 ' + (saved.date || '') + ' ' + (saved.time || '') + '。如果想重新生成不同方案，去「设计」页再试一次。</p>';
  }

  // 我的探索存档：测试/设计/模拟汇总
  function renderExploreArchive() {
    var el = document.getElementById('exploreArchive');
    if (!el) return;
    var list = [];
    try { list = JSON.parse(localStorage.getItem('guan_archive') || '[]'); } catch (e) { list = []; }
    if (!list.length) {
      el.innerHTML = '<p style="opacity:.6">还没有保存过任何结果。完成一次测试/设计/模拟后，点「保存到我的档案」即可留档。</p>';
      return;
    }
    var typeNames = { test: '测试', design: '设计', sim: '模拟' };
    el.innerHTML = list.slice(0, 10).map(function (it) {
      var href = it.type === 'test' ? 'tests.html' : it.type === 'design' ? 'design.html' : 'simulator.html';
      var result = (window.guanPrettyResult && it.key) ? window.guanPrettyResult(it.key, it.result) : it.result;
      return '<div class="test-history-item">' +
        '<div class="th-main"><b>[' + (typeNames[it.type] || it.type) + '] ' + (it.title || '') + '</b>' +
        '<span class="th-date">' + (it.date || '') + ' ' + (it.time || '') + '</span></div>' +
        '<div class="th-result">' + (result || '已记录') + '</div>' +
        '<a class="btn btn-sm" href="' + href + '">再看看</a>' +
        '</div>';
    }).join('') +
      '<p style="font-size:12px;color:var(--muted-2);margin-top:10px">保存的结果会在你下一次测试/设计/模拟时被参考，帮助生成更准确、更贴合你的内容。</p>';
  }

  async function loadCloudExploreArchive() {
    if (!window.guanLoadArchive) return;
    try {
      var list = await window.guanLoadArchive();
      if (list) renderExploreArchive();
    } catch (e) {}
  }

  // 我的成长记录：本地 + 云端拉取展示
  function renderGrowthArchive() {
    var el = document.getElementById('growthArchive');
    if (!el) return;
    var items = [];
    try { items = JSON.parse(window.guanGet('guan_growth') || '[]'); } catch (e) { items = []; }
    var journey = [];
    try { journey = JSON.parse(window.guanGet('guan_journey') || '[]'); } catch (e) { journey = []; }
    if (!items.length && !journey.length) {
      el.innerHTML = '<p style="opacity:.6">还没有成长记录。去「轨迹」或「三十天」写第一笔吧。</p>';
      return;
    }
    var list = [];
    items.slice(-3).reverse().forEach(function (g) {
      list.push({ title: '轨迹 · ' + (g.date || ''), text: g.note || g.mood || '' });
    });
    journey.slice(-3).reverse().forEach(function (j) {
      list.push({ title: '三十天 · ' + (j.date || ''), text: j.note || j.mood || '' });
    });
    el.innerHTML = list.slice(0, 5).map(function (it) {
      return '<div class="test-history-item">' +
        '<div class="th-main"><b>' + it.title + '</b></div>' +
        '<div class="th-result">' + (it.text || '已记录') + '</div>' +
        '<a class="btn btn-sm" href="growth.html">去记录</a>' +
        '</div>';
    }).join('') +
      '<p style="font-size:12px;color:var(--muted-2);margin-top:10px">记录会自动同步到你的账号（需登录）。</p>';
  }

  async function loadCloudGrowthArchive() {
    if (!window.guanLoadGrowth) return;
    try {
      var rows = await window.guanLoadGrowth();
      if (rows) renderGrowthArchive();
    } catch (e) {}
  }

  window.guanProfile = read;

  var avatar = '🌙';

  function setAvatar(val) {
    avatar = val;
    document.querySelectorAll('#pAvatarRow .avatar-btn').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-avatar') === val);
    });
  }

  function session() {
    try {
      return JSON.parse(localStorage.getItem('guan_session') || 'null');
    } catch (e) {
      return null;
    }
  }

  (function checkLogin() {
    var s = session();
    var reminder = document.getElementById('loginReminder');
    if (reminder) {
      if (!s || !s.name) {
        reminder.classList.remove('hidden');
      } else {
        reminder.classList.add('hidden');
        if (!document.getElementById('pNick').value) {
          document.getElementById('pNick').value = s.name;
        }
      }
    }
  })();

  function collect() {
    var birthText = document.getElementById('pBirth').value.trim();
    var birth = window.guanAstrology.parseBirth(birthText);
    var hourText = document.getElementById('pHour').value;
    var hour = window.guanAstrology.parseHour(hourText);
    var city = document.getElementById('pCity').value.trim();

    var bazi = null, moon = null, rising = null, zodiac = '';
    if (birth) {
      zodiac = window.guanAstrology.zodiacOfBirth(birth.y, birth.m, birth.d);
      bazi = window.guanAstrology.bazi(birth.y, birth.m, birth.d, hour);
      moon = window.guanAstrology.moon(birth.y, birth.m, birth.d);
      var r = window.guanAstrology.rising(birth.y, birth.m, birth.d, hour, city);
      rising = r.ok ? r.zodiac : r.reason;
    }

    var p = {
      nickname: document.getElementById('pNick').value.trim(),
      gender: document.getElementById('pGender').value,
      job: document.getElementById('pJob').value.trim(),
      avatar: avatar,
      birth: birthText,
      hour: document.getElementById('pHour').value,
      city: city,
      mbti: document.getElementById('pMbti').value,
      ennea: document.getElementById('pEnnea').value,
      // 优先用用户校对后的值；未校对则用自动排盘值
      bazi: document.getElementById('baziChart').value.trim() || (bazi ? bazi.year + ' ' + bazi.month + ' ' + bazi.day + ' ' + bazi.hour : ''),
      rising: document.getElementById('risingAuto').value || rising || '',
      moon: document.getElementById('moonAuto').value || moon || '',
      verified: {
        bazi: document.getElementById('baziVerify').classList.contains('verified'),
        rising: document.getElementById('risingVerify').classList.contains('verified'),
        moon: document.getElementById('moonVerify').classList.contains('verified')
      },
      stage: document.getElementById('pStage').value,
      selfDesc: document.getElementById('pSelfDesc').value.trim(),
      focus: document.getElementById('pFocus').value.trim()
    };
    p.zodiac = zodiac;
    return p;
  }

  function renderCharts() {
    var birthText = document.getElementById('pBirth').value.trim();
    var hourText = document.getElementById('pHour').value;
    var birth = window.guanAstrology.parseBirth(birthText);
    var hour = window.guanAstrology.parseHour(hourText);
    if (!birth) {
      document.getElementById('baziChart').value = '';
      document.getElementById('risingAuto').value = '';
      document.getElementById('moonAuto').value = '';
      return;
    }
    var bazi = window.guanAstrology.bazi(birth.y, birth.m, birth.d, hour);
    document.getElementById('baziChart').value = bazi.year + ' ' + bazi.month + ' ' + bazi.day + ' ' + bazi.hour;
    document.getElementById('moonAuto').value = window.guanAstrology.moon(birth.y, birth.m, birth.d);
    var city = document.getElementById('pCity').value.trim();
    var r = window.guanAstrology.rising(birth.y, birth.m, birth.d, hour, city);
    document.getElementById('risingAuto').value = r.ok ? r.zodiac : '';
  }

  function renderPreview(p) {
    var el = document.getElementById('profilePreview');
    var body = document.getElementById('previewBody');
    document.getElementById('previewName').textContent = (p.nickname || '我的') + ' · 档案';
    var lines = [];
    lines.push(['出生日期', p.birth || '未填写']);
    lines.push(['星座', p.zodiac || '未填写']);
    lines.push(['出生时辰', p.hour || '未填写']);
    lines.push(['头像', p.avatar || '🌙']);
    if (p.gender) lines.push(['性别', p.gender]);
    if (p.job) lines.push(['职业 / 身份', p.job]);
    if (p.mbti) lines.push(['MBTI', p.mbti]);
    if (p.ennea) lines.push(['九型人格', p.ennea]);
    if (p.bazi) lines.push(['八字（近似）', p.bazi]);
    if (p.rising) lines.push(['上升星座', p.rising]);
    if (p.moon) lines.push(['月亮星座（近似）', p.moon]);
    if (p.stage) lines.push(['人生阶段', p.stage]);
    if (p.selfDesc) lines.push(['此刻的我', p.selfDesc]);
    if (p.focus) lines.push(['探索议题', p.focus]);
    body.innerHTML = lines.map(function (l) {
      return '<div class="profile-line"><span>' + l[0] + '</span><b>' + l[1] + '</b></div>';
    }).join('') || '<div class="profile-line"><span>档案还是空的</span><b>先填写左边</b></div>';
    el.classList.add('show');
  }

  /**
   * 把用户选的照片压成一张小方图，返回 dataURL。
   * 思路：先按最长边缩到 256px，再从中间裁成正方形，最后输出 JPEG（质量 0.82）。
   * 这样一张手机照片通常只有 20–60KB，既够清楚，又不会把档案撑大。
   * @param {File} file
   * @returns {Promise<string>}
   */
  function shrinkImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        try {
          var SIDE = 256;
          var canvas = document.createElement('canvas');
          canvas.width = SIDE;
          canvas.height = SIDE;
          var ctx = canvas.getContext('2d');

          // 居中裁成正方形，避免人脸被拉扁
          var min = Math.min(img.width, img.height);
          var sx = (img.width - min) / 2;
          var sy = (img.height - min) / 2;
          ctx.drawImage(img, sx, sy, min, min, 0, 0, SIDE, SIDE);

          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } catch (e) {
          URL.revokeObjectURL(url);
          reject(e);
        }
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('image_load_failed'));
      };
      img.src = url;
    });
  }

  document.getElementById('saveProfile').addEventListener('click', async function () {
    var lock = lockState();
    if (lock.count >= EDIT_LIMIT) {
      window.guanToast('本月更新次数已用完，下月 1 日恢复');
      return;
    }
    var p = collect();

    // 先写服务器；失败就不消耗本月的修改次数，也不锁定表单
    try {
      await saveProfileToServer(p);
    } catch (err) {
      if (err && err.status === 401) {
        window.guanToast('请先登录后再保存档案');
      } else {
        window.guanToast('保存失败：' + (err && err.message ? err.message : '请稍后重试'));
      }
      return;
    }

    renderPreview(p);
    lock.count += 1;
    localStorage.setItem(LOCK_KEY, JSON.stringify(lock));
    renderLockUI();
    window.guanToast('档案已保存，之后的设计与模拟会参考它');
  });

  document.getElementById('updateProfile').addEventListener('click', function () {
    var lock = lockState();
    if (lock.count >= EDIT_LIMIT) {
      window.guanToast('本月更新次数已用完，下月 1 日恢复');
      return;
    }
    unlockForm();
    window.guanToast('档案已解锁，改完后点「保存我的档案」生效');
  });

  // Avatar upload
  document.getElementById('pAvatarFile').addEventListener('change', function () {
    var file = this.files && this.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      window.guanToast('请选择一张图片文件');
      return;
    }
    // 手机直出的照片动辄三五 MB，直接转 base64 会超出接口上限、也把档案撑得很大。
    // 这里先在浏览器里压成 256×256 的小图（约 20–60KB）再上传，清晰度足够做头像。
    shrinkImage(file).then(function (dataUrl) {
      avatar = dataUrl;
      document.querySelectorAll('#pAvatarRow .avatar-btn').forEach(function (b) { b.classList.remove('on'); });
      window.guanToast('照片头像已读取，保存档案后生效');
    }).catch(function () {
      // 压缩失败（极老的浏览器）时退回原图，至少不让用户卡住
      var reader = new FileReader();
      reader.onload = function (e) {
        avatar = e.target.result;
        if (avatar.length > 700000) {
          window.guanToast('这张照片太大了，请换一张较小（1MB 以内）的图片');
          avatar = '🌙';
          return;
        }
        document.querySelectorAll('#pAvatarRow .avatar-btn').forEach(function (b) { b.classList.remove('on'); });
        window.guanToast('照片头像已读取，保存档案后生效');
      };
      reader.readAsDataURL(file);
    });
  });

  document.querySelectorAll('#pAvatarRow .avatar-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      setAvatar(b.getAttribute('data-avatar'));
    });
  });

  document.getElementById('pBirth').addEventListener('change', renderCharts);
  document.getElementById('pBirth').addEventListener('input', renderCharts);
  document.getElementById('pHour').addEventListener('change', renderCharts);
  document.getElementById('pCity').addEventListener('input', renderCharts);

  // 编辑校对：解锁对应排盘控件，标记已校对
  document.querySelectorAll('[data-editable]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-editable');
      var el = document.getElementById(id);
      var verifyId = id === 'baziChart' ? 'baziVerify' : id === 'risingAuto' ? 'risingVerify' : 'moonVerify';
      if (el.readOnly !== undefined) el.readOnly = false;
      if (el.disabled !== undefined) el.disabled = false;
      el.focus();
      var verify = document.getElementById(verifyId);
      if (verify) {
        verify.textContent = '已由本人校对 ✓';
        verify.classList.add('verified');
      }
      window.guanToast('已解锁，可修改；修改后记得保存档案');
    });
  });

  document.getElementById('exportProfile').addEventListener('click', function () {
    var p = collect();
    var lines = [
      '【我的档案 · 观己实验室】',
      '导出时间：' + new Date().toLocaleString('zh-CN'),
      '昵称：' + (p.nickname || '未填写'),
      '出生日期：' + (p.birth || '未填写'),
      '星座：' + (p.zodiac || '未填写'),
      '出生时辰：' + (p.hour || '未填写'),
      'MBTI：' + (p.mbti || '未填写'),
      '九型人格：' + (p.ennea || '未填写'),
      '八字四柱：' + (p.bazi || '未填写'),
      '上升星座：' + (p.rising || '未填写'),
      '月亮星座：' + (p.moon || '未填写'),
      '人生阶段：' + (p.stage || '未填写'),
      '探索议题：' + (p.focus || '未填写'),
      '',
      '—— 观己实验室 · 理解自己，设计人生'
    ];
    var blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'guanji-profile-' + new Date().toISOString().slice(0, 10) + '.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    window.guanToast('档案已导出');
  });

  document.getElementById('backupData').addEventListener('click', function () {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf('guan_') === 0) data[k] = localStorage.getItem(k);
    }
    var keys = Object.keys(data);
    if (!keys.length) { window.guanToast('还没有可备份的数据'); return; }
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'guanji-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    window.guanToast('已备份 ' + keys.length + ' 项数据，请妥善保存文件');
  });

  document.getElementById('restoreFile').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var count = 0;
        Object.keys(data).forEach(function (k) {
          if (k.indexOf('guan_') === 0) {
            localStorage.setItem(k, data[k]);
            count++;
          }
        });
        window.guanToast(count ? '已恢复 ' + count + ' 项数据，正在刷新页面' : '备份文件里没有可恢复的数据');
        if (count) setTimeout(function () { window.location.reload(); }, 900);
      } catch (err) {
        window.guanToast('文件格式不对，请选择「备份全部数据」生成的 JSON 文件');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  var existing = read();
  if (existing && Object.keys(existing).length && existing.birth) {
    document.getElementById('pNick').value = existing.nickname || '';
    document.getElementById('pGender').value = existing.gender || '';
    document.getElementById('pJob').value = existing.job || '';
    if (existing.avatar && existing.avatar.length <= 8) setAvatar(existing.avatar);
    else if (existing.avatar && existing.avatar.length > 8) avatar = existing.avatar;
    document.getElementById('pBirth').value = existing.birth || '';
    document.getElementById('pHour').value = existing.hour || '';
    document.getElementById('pCity').value = existing.city || '';
    document.getElementById('pMbti').value = existing.mbti || '';
    document.getElementById('pEnnea').value = existing.ennea || '';
    document.getElementById('pStage').value = existing.stage || '';
    document.getElementById('pSelfDesc').value = existing.selfDesc || '';
    document.getElementById('pFocus').value = existing.focus || '';
    renderPreview(existing);
    renderCharts();
  }
  renderLockUI();
  renderTestHistory();
  renderDesignArchive();
  renderExploreArchive();
  renderGrowthArchive();
  loadProfileFromServer();
})();
