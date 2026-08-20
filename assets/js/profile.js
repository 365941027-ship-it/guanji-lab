(function () {
  'use strict';

  var KEY = 'guan_profile';
  var ZODIACS = ['摩羯座', '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座'];
  var BOUNDS = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];

  function zodiacOf(dateStr) {
    if (!dateStr) return '';
    var parts = dateStr.split('-');
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);
    if (!m || !d) return '';
    return d < BOUNDS[m - 1] ? ZODIACS[m - 1] : ZODIACS[m % 12];
  }

  function read() {
    try {
      return JSON.parse(window.guanGet(KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  window.guanProfile = read;

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
    var p = {
      nickname: document.getElementById('pNick').value.trim(),
      birth: document.getElementById('pBirth').value,
      hour: document.getElementById('pHour').value,
      place: document.getElementById('pPlace').value.trim(),
      mbti: document.getElementById('pMbti').value,
      ennea: document.getElementById('pEnnea').value,
      bazi: [
        document.getElementById('pBazi1').value.trim(),
        document.getElementById('pBazi2').value.trim(),
        document.getElementById('pBazi3').value.trim(),
        document.getElementById('pBazi4').value.trim()
      ].filter(Boolean).join(' '),
      rising: document.getElementById('pRising').value,
      moon: document.getElementById('pMoon').value,
      stage: document.getElementById('pStage').value,
      focus: document.getElementById('pFocus').value.trim()
    };
    p.zodiac = zodiacOf(p.birth);
    return p;
  }

  function renderPreview(p) {
    var el = document.getElementById('profilePreview');
    var body = document.getElementById('previewBody');
    document.getElementById('previewName').textContent = (p.nickname || '我的') + ' · 档案';
    var lines = [];
    lines.push(['出生日期', p.birth || '未填写']);
    lines.push(['星座', p.zodiac || '未填写']);
    lines.push(['出生时辰', p.hour || '未填写']);
    if (p.mbti) lines.push(['MBTI', p.mbti]);
    if (p.ennea) lines.push(['九型人格', p.ennea]);
    if (p.bazi) lines.push(['八字四柱', p.bazi]);
    if (p.rising) lines.push(['上升星座', p.rising]);
    if (p.moon) lines.push(['月亮星座', p.moon]);
    if (p.stage) lines.push(['人生阶段', p.stage]);
    if (p.focus) lines.push(['探索议题', p.focus]);
    body.innerHTML = lines.map(function (l) {
      return '<div class="profile-line"><span>' + l[0] + '</span><b>' + l[1] + '</b></div>';
    }).join('') || '<div class="profile-line"><span>档案还是空的</span><b>先填写左边</b></div>';
    el.classList.add('show');
  }

  document.getElementById('saveProfile').addEventListener('click', function () {
    var p = collect();
    window.guanSet(KEY, JSON.stringify(p));
    renderPreview(p);
    window.guanToast('档案已保存，之后的设计与模拟会参考它');
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
    document.getElementById('pBirth').value = existing.birth || '';
    document.getElementById('pHour').value = existing.hour || '';
    document.getElementById('pPlace').value = existing.place || '';
    document.getElementById('pMbti').value = existing.mbti || '';
    document.getElementById('pEnnea').value = existing.ennea || '';
    var b = (existing.bazi || '').split(/\s+/).filter(Boolean);
    if (b[0]) document.getElementById('pBazi1').value = b[0];
    if (b[1]) document.getElementById('pBazi2').value = b[1];
    if (b[2]) document.getElementById('pBazi3').value = b[2];
    if (b[3]) document.getElementById('pBazi4').value = b[3];
    document.getElementById('pRising').value = existing.rising || '';
    document.getElementById('pMoon').value = existing.moon || '';
    document.getElementById('pStage').value = existing.stage || '';
    document.getElementById('pFocus').value = existing.focus || '';
    renderPreview(existing);
  }
})();
