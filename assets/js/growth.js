(function () {
  'use strict';

  var STORE_KEY = 'guan_growth';
  var mood = null;
  var energy = null;

  var noteEl = document.getElementById('noteInput');
  var designEl = document.getElementById('designInput');
  var listEl = document.getElementById('growthList');
  var reportBox = document.getElementById('reportBox');
  var lastReport = '';
  var pendingAchievements = [];

  function load() {
    try {
      return JSON.parse(window.guanGet(STORE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function save(items) {
    window.guanSet(STORE_KEY, JSON.stringify(items));
    if (window.guanSyncGrowth) window.guanSyncGrowth('growth', items);
  }

  function dateStr(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function render() {
    var items = load();
    listEl.innerHTML = '';
    renderStats(items);
    renderStarTrail(items);
    renderBadges(items);
    if (!items.length) {
      listEl.innerHTML = '<li style="opacity:.7">还没有记录。从今天的第一条开始吧——哪怕只是一句话。</li>';
      return;
    }
    items.slice().reverse().forEach(function (it) {
      var li = document.createElement('li');
      var time = document.createElement('time');
      time.textContent = it.date + ' · ' + it.mood + ' · 能量 ' + it.energy + '/5';
      li.appendChild(time);
      li.appendChild(document.createTextNode(it.note || '（未写文字）'));
      if (it.design) {
        var d = document.createElement('div');
        d.style.cssText = 'margin-top:6px;color:var(--gold-bright);font-size:12.5px';
        d.textContent = '设计中的改变：' + it.design;
        li.appendChild(d);
      }
      listEl.appendChild(li);
    });
  }

  function uniqueDays(items) {
    var days = {};
    items.forEach(function (it) { days[it.date] = 1; });
    return Object.keys(days).sort();
  }

  function renderStats(items) {
    var days = uniqueDays(items);
    var streak = 0;
    var today = new Date();
    function dstr(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
    var set = {};
    days.forEach(function (d) { set[d] = 1; });
    var cursor = new Date(today);
    if (!set[dstr(cursor)]) cursor.setDate(cursor.getDate() - 1);
    while (set[dstr(cursor)]) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    var weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
    var weekCount = 0;
    days.forEach(function (d) {
      if (d >= dstr(weekStart) && d <= dstr(today)) weekCount += 1;
    });
    var badges = unlockedBadges(items);
    document.getElementById('stStreak').textContent = String(streak);
    document.getElementById('stTotal').textContent = String(items.length);
    document.getElementById('stWeek').textContent = String(weekCount);
    document.getElementById('stBadges').textContent = String(badges.length);
  }

  function renderStarTrail(items) {
    var el = document.getElementById('starTrail');
    var set = {};
    uniqueDays(items).forEach(function (d) { set[d] = 1; });
    var today = new Date();
    var html = '';
    for (var i = 13; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      var lit = !!set[key];
      html += '<div class="star' + (lit ? ' lit' : '') + '">' + (lit ? '✦' : '·') + '</div>';
    }
    el.innerHTML = html;
  }

  var BADGES = [
    { key: 'first', icon: '🌱', name: '第一次出发', desc: '完成第一条记录', check: function (items) { return items.length >= 1; } },
    { key: 'streak3', icon: '✨', name: '三日微光', desc: '连续记录 3 天', check: function (items) { return streakOf(items) >= 3; } },
    { key: 'streak7', icon: '🌙', name: '七日之约', desc: '连续记录 7 天', check: function (items) { return streakOf(items) >= 7; } },
    { key: 'total14', icon: '🌟', name: '十四次日落', desc: '累计记录 14 条', check: function (items) { return items.length >= 14; } },
    { key: 'week5', icon: '🗓️', name: '完整一周', desc: '7 天内记录 5 天', check: function (items) { return weekDaysOf(items) >= 5; } },
    { key: 'words10', icon: '📝', name: '愿意书写', desc: '10 条带文字的记录', check: function (items) { return items.filter(function (i) { return i.note && i.note !== '（未写文字）'; }).length >= 10; } },
    { key: 'report', icon: '🔭', name: '看见轨迹', desc: '生成第一份成长报告', check: function (items) { return items.length >= 1 && window.guanGet('guan_report_generated') === '1'; } }
  ];

  function streakOf(items) {
    var days = uniqueDays(items);
    var set = {};
    days.forEach(function (d) { set[d] = 1; });
    var today = new Date();
    function dstr(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
    var cursor = new Date(today);
    if (!set[dstr(cursor)]) cursor.setDate(cursor.getDate() - 1);
    var n = 0;
    while (set[dstr(cursor)]) { n += 1; cursor.setDate(cursor.getDate() - 1); }
    return n;
  }

  function weekDaysOf(items) {
    var set = {};
    uniqueDays(items).forEach(function (d) { set[d] = 1; });
    var today = new Date();
    var start = new Date(today);
    start.setDate(start.getDate() - 6);
    function dstr(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
    var n = 0;
    for (var d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      if (set[dstr(d)]) n += 1;
    }
    return n;
  }

  function unlockedBadges(items) {
    return BADGES.filter(function (b) { return b.check(items); });
  }

  function renderBadges(items) {
    var el = document.getElementById('badgeGrid');
    var unlocked = {};
    unlockedBadges(items).forEach(function (b) { unlocked[b.key] = 1; });
    el.innerHTML = BADGES.map(function (b) {
      var on = !!unlocked[b.key];
      return '<div class="badge-item ' + (on ? 'unlocked' : 'locked') + '">' +
        '<div class="bi">' + b.icon + '</div><b>' + b.name + '</b><span>' + b.desc + '</span></div>';
    }).join('');
  }

  function pickMood(btn) {
    document.querySelectorAll('#moodRow .mood-btn').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    mood = btn.getAttribute('data-mood');
  }

  function pickEnergy(btn) {
    document.querySelectorAll('#energyRow button').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    energy = parseInt(btn.getAttribute('data-energy'), 10);
  }

  function saveCheckin() {
    var note = noteEl.value.trim();
    if (!note && !mood && !energy) {
      window.guanToast('选一个情绪，或写一句话，都可以');
      return;
    }
    var items = load();
    items.push({
      date: dateStr(new Date()),
      time: new Date().toTimeString().slice(0, 5),
      mood: mood || '未标记',
      energy: energy || 3,
      note: note || '（未写文字）',
      design: designEl.value.trim() || ''
    });
    save(items);
    checkAchievements(items);
    if (window.guanCompanionFeed) window.guanCompanionFeed();
    if (window.guanCompanionAddCoins) window.guanCompanionAddCoins(1);
    noteEl.value = '';
    designEl.value = '';
    document.querySelectorAll('#moodRow .mood-btn, #energyRow button').forEach(function (b) { b.classList.remove('on'); });
    mood = null;
    energy = null;
    render();
    var praises = [
      '已保存 · 又点亮一颗星',
      '已保存 · 谢谢你今天愿意停下来看看自己',
      '已保存 · 每一个平凡的记录都在铺路',
      '已保存 · 今天的你，值得被记录'
    ];
    window.guanToast(praises[Math.floor(Math.random() * praises.length)]);
  }

  function checkAchievements(items) {
    var before = pendingAchievements;
    var unlocked = unlockedBadges(items);
    var newly = unlocked.filter(function (b) {
      return window.guanGet('guan_badge_' + b.key) !== '1';
    });
    newly.forEach(function (b) {
      window.guanSet('guan_badge_' + b.key, '1');
      setTimeout(function () {
        window.guanToast('成就解锁：' + b.name + ' ' + b.icon);
      }, 300);
    });
  }

  function moodOf(m) {
    var map = {
      '平静': '平静', '焦虑': '焦虑', '期待': '期待', '疲惫': '疲惫',
      '喜悦': '喜悦', '低落': '低落', '清晰': '清晰', '混乱': '混乱'
    };
    return map[m] || m || '未标记';
  }

  function themeOf(text) {
    var found = [];
    var rules = [
      ['工作', ['工作', '上班', '职业', '项目', '同事', '老板']],
      ['关系', ['关系', '朋友', '伴侣', '家人', '恋爱', '沟通']],
      ['创造', ['写', '画', '创作', '作品', '灵感', '设计', '视频', '内容']],
      ['身体', ['睡', '累', '健康', '运动', '失眠', '生病']],
      ['金钱', ['钱', '收入', '存款', '开销', '预算']],
      ['自由', ['自由', '辞职', '离开', '远方', '旅行']],
      ['方向', ['迷茫', '方向', '选择', '未来', '转型', '该不该']]
    ];
    rules.forEach(function (r) {
      if (r[1].some(function (w) { return text.indexOf(w) > -1; })) found.push(r[0]);
    });
    return found;
  }

  function generateReport() {
    var items = load();
    if (!items.length) {
      window.guanToast('先记录几天，轨迹才会长出形状');
      return;
    }

    var moods = {};
    var energySum = 0;
    var themes = {};
    items.forEach(function (it) {
      var m = moodOf(it.mood);
      moods[m] = (moods[m] || 0) + 1;
      energySum += it.energy || 3;
      themeOf((it.note || '') + (it.design || '')).forEach(function (t) {
        themes[t] = (themes[t] || 0) + 1;
      });
    });

    var avgEnergy = energySum / items.length;
    var half = Math.floor(items.length / 2);
    var first = items.slice(0, half);
    var second = items.slice(half);
    var firstAvg = first.length ? first.reduce(function (s, i) { return s + (i.energy || 3); }, 0) / first.length : avgEnergy;
    var secondAvg = second.length ? second.reduce(function (s, i) { return s + (i.energy || 3); }, 0) / second.length : avgEnergy;
    var trend = secondAvg - firstAvg;

    var sortedMoods = Object.keys(moods).sort(function (a, b) { return moods[b] - moods[a]; });
    var topMood = sortedMoods[0];
    var topThemes = Object.keys(themes).sort(function (a, b) { return themes[b] - themes[a]; }).slice(0, 3);

    var body = '';
    var p = window.guanProfile ? window.guanProfile() : {};
    var greeting = p.nickname ? p.nickname + '，' : '';
    body += '<div class="report-section"><strong>状态画像：</strong>' + greeting + '过去这段时间，你最多的情绪是「' + topMood + '」（出现 ' + moods[topMood] + ' 次），平均能量为 ' + avgEnergy.toFixed(1) + ' / 5。';
    if (topThemes.length) body += '你反复提到的话题是：' + topThemes.join('、') + '。';
    body += '</div>';

    if (trend > 0.35) {
      body += '<div class="report-section"><strong>能量趋势：</strong>你的能量正在回升（从 ' + firstAvg.toFixed(1) + ' 到 ' + secondAvg.toFixed(1) + '）。这可能是修复生效、方向变清晰，或你开始照顾自己了。请记住现在做对了什么——它值得被继续。</div>';
    } else if (trend < -0.35) {
      body += '<div class="report-section"><strong>能量趋势：</strong>你的能量近期在下降（从 ' + firstAvg.toFixed(1) + ' 到 ' + secondAvg.toFixed(1) + '）。这不是你的错，而是信号：你需要减少一些负担、增加一些休息，或重新确认方向。请把「照顾自己」提上日程。</div>';
    } else {
      body += '<div class="report-section"><strong>能量趋势：</strong>你的能量整体平稳（' + avgEnergy.toFixed(1) + ' / 5）。稳定是蓄力的前提——如果最近没有大起大落，说明你的节奏正在被自己掌握。</div>';
    }

    if (topMood === '疲惫' || topMood === '低落' || topMood === '焦虑' || topMood === '混乱') {
      body += '<div class="report-section"><strong>给此刻的你：</strong>「' + topMood + '」频繁出现，说明你正在经历一段需要被认真对待的时期。请别急着让它消失——先承认它，再减少日程、增加睡眠、给自己一个真正放松的下午。你不需要立刻变好，你只需要先被照顾。</div>';
    } else {
      body += '<div class="report-section"><strong>给此刻的你：</strong>「' + topMood + '」是你最近的主旋律，它是你内在状态的诚实反映。试着在接下来几天里，留意什么在滋养它、什么在消耗它——那会成为你设计下一步的依据。</div>';
    }

    if (topThemes.length) {
      body += '<div class="report-section"><strong>你的核心议题：</strong>' + topThemes.map(function (t) {
        var map = {
          '工作': '工作——你正在与职业角色深度相处，值得给自己一个关于「为什么做」的答案',
          '关系': '关系——关系议题正在你的生活中占据重要位置，练习直接表达会带来新的可能',
          '创造': '创造——你渴望留下点什么，请为它安排固定的时间，而不是等灵感',
          '身体': '身体——身体在向你传递信号，先回应它，再谈其他',
          '金钱': '金钱——金钱焦虑背后往往是对安全感的渴望，试着把它拆成具体数字',
          '自由': '自由——你对自由的需求正在变大，请为它设计出口，而不是压抑',
          '方向': '方向——你在寻找方向，答案不在思考里，在小的实验里'
        };
        return map[t] || t;
      }).join('；') + '。</div>';
    }

    var designs = items.filter(function (it) { return it.design; });
    if (designs.length) {
      var lastDesign = designs[designs.length - 1].design;
      body += '<div class="report-section"><strong>你在设计的改变：</strong>「' + lastDesign + '」。这是一颗正在发芽的种子——请为它安排一个最小行动，并在 30 天后回看这条记录。</div>';
    }

    body += '<div class="report-section"><strong>接下来的 30 天：</strong>每天继续一分钟记录；每周日回看本周轨迹，写下「一件值得继续的事」；30 天后再次生成报告，你会亲眼看见自己的变化。</div>';

    var days = items.length;
    document.getElementById('reportTitle').textContent = '你的实时成长报告';
    document.getElementById('reportDate').textContent = '基于 ' + days + ' 条记录 · ' + items[0].date + ' 至 ' + items[items.length - 1].date;
    document.getElementById('reportStats').innerHTML =
      '<div class="stat"><b>' + days + '</b><span>记录天数</span></div>' +
      '<div class="stat"><b>' + topMood + '</b><span>高频情绪</span></div>' +
      '<div class="stat"><b>' + avgEnergy.toFixed(1) + '</b><span>平均能量</span></div>' +
      '<div class="stat"><b>' + (topThemes[0] || '—') + '</b><span>核心议题</span></div>';
    document.getElementById('reportBody').innerHTML = body;
    document.getElementById('reportNote').textContent = '报告由你的记录实时生成，仅保存在本机。它描述的是趋势，不是对你的定义——真正的变化，只有你自己能完成。';
    reportBox.classList.add('show');
    window.guanSet('guan_report_generated', '1');
    renderBadges(load());
    renderStats(load());
    reportBox.scrollIntoView({ behavior: 'smooth', block: 'start' });

    lastReport = '【我的成长轨迹报告 · 观己实验室】\n基于 ' + days + ' 条记录（' + items[0].date + ' 至 ' + items[items.length - 1].date + '）\n\n' +
      body.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&') +
      '\n\n—— 观己实验室 · 理解自己，设计人生';
  }

  document.querySelectorAll('#moodRow .mood-btn').forEach(function (b) {
    b.addEventListener('click', function () { pickMood(b); });
  });
  document.querySelectorAll('#energyRow button').forEach(function (b) {
    b.addEventListener('click', function () { pickEnergy(b); });
  });
  document.getElementById('saveCheckin').addEventListener('click', saveCheckin);
  document.getElementById('generateReport').addEventListener('click', generateReport);
  document.getElementById('exportGrowth').addEventListener('click', function () {
    var items = load();
    if (!items.length) { window.guanToast('还没有可导出的记录'); return; }
    var text = '【我的成长轨迹 · 观己实验室】\n导出时间：' + new Date().toLocaleString('zh-CN') + '\n共 ' + items.length + ' 条记录\n\n';
    items.forEach(function (it) {
      text += it.date + ' ' + (it.time || '') + ' | ' + it.mood + ' | 能量 ' + it.energy + '/5\n';
      if (it.note && it.note !== '（未写文字）') text += '  记录：' + it.note + '\n';
      if (it.design) text += '  设计中：' + it.design + '\n';
      text += '\n';
    });
    text += '—— 观己实验室 · 理解自己，设计人生';
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'guanji-growth-' + new Date().toISOString().slice(0, 10) + '.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    window.guanToast('已导出，文件保存在你的下载目录');
  });
  document.getElementById('copyReport').addEventListener('click', function () {
    if (!lastReport) { window.guanToast('先生成一次报告'); return; }
    window.guanCopy(lastReport, function (ok) {
      window.guanToast(ok ? '报告已复制' : '复制失败');
    });
  });
  document.getElementById('clearGrowth').addEventListener('click', function () {
    if (load().length && window.confirm('确定清空所有成长记录吗？此操作不可恢复。')) {
      save([]);
      render();
      reportBox.classList.remove('show');
      window.guanToast('记录已清空，可以从今天重新开始');
    }
  });

  render();
  if (window.guanCalendar) {
    window.guanCalendar({
      mount: 'calendarBox',
      getRecords: function () { return load(); }
    });
  }
})();
