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
      bazi: bazi ? bazi.year + ' ' + bazi.month + ' ' + bazi.day + ' ' + bazi.hour : '',
      rising: rising || '',
      moon: moon || '',
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
      document.getElementById('baziChart').textContent = '填写出生日期与时辰后自动生成';
      document.getElementById('risingAuto').textContent = '填写出生日期与时辰后自动生成';
      document.getElementById('moonAuto').textContent = '填写出生日期与时辰后自动生成';
      return;
    }
    var bazi = window.guanAstrology.bazi(birth.y, birth.m, birth.d, hour);
    document.getElementById('baziChart').innerHTML =
      '<span class="pillar">' + bazi.year + '</span><span class="pillar">' + bazi.month + '</span>' +
      '<span class="pillar">' + bazi.day + '</span><span class="pillar">' + bazi.hour + '</span>' +
      '<span class="pillar-label">年柱 月柱 日柱 时柱</span>';
    document.getElementById('moonAuto').textContent = window.guanAstrology.moon(birth.y, birth.m, birth.d) + '（近似）';
    var city = document.getElementById('pCity').value.trim();
    var r = window.guanAstrology.rising(birth.y, birth.m, birth.d, hour, city);
    document.getElementById('risingAuto').textContent = r.ok ? r.zodiac + '（近似）' : (r.reason + '：可填写城市后自动校准');
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

  document.getElementById('saveProfile').addEventListener('click', function () {
    var lock = lockState();
    if (lock.count >= EDIT_LIMIT) {
      window.guanToast('本月更新次数已用完，下月 1 日恢复');
      return;
    }
    var p = collect();
    window.guanSet(KEY, JSON.stringify(p));
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
    var reader = new FileReader();
    reader.onload = function (e) {
      avatar = e.target.result;
      document.querySelectorAll('#pAvatarRow .avatar-btn').forEach(function (b) { b.classList.remove('on'); });
      window.guanToast('照片头像已读取，保存档案后生效');
    };
    reader.readAsDataURL(file);
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
})();
