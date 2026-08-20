(function () {
  'use strict';

  var KEY = 'guan_companion';

  // 成长阶段：种子 → 幼芽 → 小树 → 成人 → 理想形象
  var STAGES = [
    { min: 0, name: '奶猫期', sprite: 'cat', body: '#c9a86e', ear: '#a9854a', cheek: '#e8cfa0', desc: '一只刚睁开眼的小奶猫，正在等待被好好照顾。' },
    { min: 30, name: '幼猫期', sprite: 'cat', body: '#b98f5e', ear: '#96703f', cheek: '#e2c493', desc: '小猫开始长开，会蹭你、会等你的记录了。' },
    { min: 90, name: '成长期', sprite: 'cat', body: '#9c7448', ear: '#7a5733', cheek: '#d9b47e', desc: '它有了自己的性格，也开始像你理想中的样子。' },
    { min: 180, name: '成熟期', sprite: 'cat', body: '#7f5c36', ear: '#61431f', cheek: '#d0a66b', desc: '它站得更稳了，眼神里有你的影子。' },
    { min: 365, name: '理想期', sprite: 'cat', body: '#6b4a26', ear: '#4e3315', cheek: '#c9995c', desc: '连续陪伴一年——它正在成为你理想中的样子。' }
  ];

  // 装扮商店：用奖章兑换
  var SHOP = [
    { id: 'bow', name: '小领结', icon: '🎀', cost: 3, type: 'bow', desc: '给小猫系上一个蝴蝶结。' },
    { id: 'scarf', name: '红围巾', icon: '🧣', cost: 5, type: 'scarf', desc: '天冷的时候，记得照顾自己。' },
    { id: 'glasses', name: '圆眼镜', icon: '👓', cost: 8, type: 'glasses', desc: '戴上眼镜，更有书卷气。' },
    { id: 'hat', name: '小礼帽', icon: '🎩', cost: 7, type: 'hat', desc: '一顶神气的小礼帽。' },
    { id: 'crown', name: '星月小冠', icon: '👑', cost: 12, type: 'crown', desc: '为它戴上，走夜路也不怕。' }
  ];

  var BADGES = [
    { id: 'first', name: '第一次相遇', icon: '🐾', need: '第一笔记录', check: function (d) { return d.days >= 1; } },
    { id: 'streak7', name: '七日之约', icon: '🌙', need: '连续 7 天', check: function (d) { return d.streak >= 7; } },
    { id: 'streak21', name: '二十一天', icon: '🐱', need: '连续 21 天', check: function (d) { return d.streak >= 21; } },
    { id: 'streak30', name: '满月', icon: '🌕', need: '连续 30 天', check: function (d) { return d.streak >= 30; } },
    { id: 'days30', name: '三十次日落', icon: '🌇', need: '累计 30 天', check: function (d) { return d.days >= 30; } },
    { id: 'days100', name: '百日之约', icon: '🏔️', need: '累计 100 天', check: function (d) { return d.days >= 100; } },
    { id: 'days365', name: '一年之期', icon: '🎂', need: '累计 365 天', check: function (d) { return d.days >= 365; } },
    { id: 'words50', name: '五十次心声', icon: '💬', need: '50 条带文字的记录', check: function (d) { return d.words >= 50; } },
    { id: 'report', name: '看见轨迹', icon: '🔭', need: '生成过成长报告', check: function (d) { return d.report === 1; } }
  ];

  function read() {
    try {
      return JSON.parse(window.guanGet(KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function save(d) {
    window.guanSet(KEY, JSON.stringify(d));
  }

  function computeState() {
    var growth = [];
    try {
      growth = JSON.parse(window.guanGet('guan_growth') || '[]');
    } catch (e) { growth = []; }
    var journey = [];
    try {
      journey = JSON.parse(window.guanGet('guan_journey') || '[]');
    } catch (e) { journey = []; }
    var ideal = null;
    try {
      ideal = JSON.parse(window.guanGet('guan_ideal') || 'null');
    } catch (e) { ideal = null; }
    var report = window.guanGet('guan_report_generated') === '1' ? 1 : 0;

    var all = growth.concat(journey);
    var daysSet = {};
    var words = 0;
    var streak = 0;
    all.forEach(function (r) {
      if (r.date) daysSet[r.date] = 1;
      if (r.note && r.note !== '（未写文字）' && r.note !== '（只记了一个情绪）') words++;
    });
    var days = Object.keys(daysSet).length;
    // 连续天数（从今天或昨天向前）
    var d = new Date();
    function dstr(x) { return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); }
    var cur = new Date(d);
    if (!daysSet[dstr(cur)]) cur.setDate(cur.getDate() - 1);
    while (daysSet[dstr(cur)]) { streak++; cur.setDate(cur.getDate() - 1); }

    return { days: days, words: words, streak: streak, report: report, ideal: ideal, growth: growth };
  }

  function expFor(d) {
    // 成长值：天数 * 10 + 文字 * 2 + 连续加成
    return d.days * 10 + d.words * 2 + Math.min(d.streak, 30) * 2;
  }

  function stageFor(exp) {
    // 等级与阶段：经验阈值递增
    var level = 1;
    var need = 50;
    var acc = 0;
    while (exp >= acc + need && level < 50) {
      acc += need;
      level++;
      need = Math.round(need * 1.35);
    }
    var stageIdx = 0;
    if (exp >= 3650) stageIdx = 4;
    else if (exp >= 1800) stageIdx = 3;
    else if (exp >= 900) stageIdx = 2;
    else if (exp >= 300) stageIdx = 1;
    return { level: level, stage: STAGES[stageIdx], acc: acc, need: need, exp: exp };
  }

  function goalHint(ideal, stage) {
    if (!ideal || !ideal.ideal) return '还没有写下理想。去人生模拟里，写下一个「想成为的自己」。';
    var t = ideal.ideal;
    var role = '';
    if (/医生|医/.test(t)) role = '医生';
    else if (/老师|教师|教育/.test(t)) role = '老师';
    else if (/作家|写|创作|画|设计|艺术/.test(t)) role = '创作者';
    else if (/程序员|工程师|开发/.test(t)) role = '工程师';
    else role = '理想中的自己';
    return '你在走向「' + role + '」。连续记录与真诚的成长值，会让这个形象一点点靠近它。';
  }

  function catSVG(body, ear, cheek, equipped) {
    var e = equipped || {};
    var extras = '';
    if (e.bow === 1) extras += '<ellipse cx="60" cy="72" rx="8" ry="6" fill="#d65a5a"/><ellipse cx="60" cy="78" rx="10" ry="7" fill="#b84444"/>';
    if (e.scarf === 1) extras += '<path d="M42 74 Q60 84 78 74 L76 96 Q60 104 44 96 Z" fill="#c0392b"/>';
    if (e.glasses === 1) extras += '<circle cx="46" cy="52" r="8" fill="none" stroke="#3b3b3b" stroke-width="2.5"/><circle cx="74" cy="52" r="8" fill="none" stroke="#3b3b3b" stroke-width="2.5"/><path d="M54 52 H66" stroke="#3b3b3b" stroke-width="2.5"/>';
    if (e.hat === 1) extras += '<path d="M34 42 Q40 22 60 22 Q80 22 86 42 Z" fill="#2c3e50"/><path d="M32 42 H88 L84 48 H36 Z" fill="#1f2c38"/>';
    if (e.crown === 1) extras += '<path d="M44 36 L50 22 L58 32 L66 20 L76 36 Z" fill="#e0c07e" stroke="#a9854a" stroke-width="1.5"/><circle cx="50" cy="26" r="2.5" fill="#fff"/><circle cx="66" cy="25" r="2.5" fill="#fff"/>';
    return '<svg viewBox="0 0 120 120" width="150" height="150">' +
      '<ellipse cx="60" cy="96" rx="26" ry="6" fill="rgba(0,0,0,.18)"/>' +
      '<path d="M28 66 Q20 34 44 40 Q40 26 52 30 Q60 24 68 30 Q80 26 76 40 Q100 34 92 66 Q88 88 60 92 Q32 88 28 66 Z" fill="' + body + '"/>' +
      '<path d="M30 50 Q22 30 42 38 L44 52 Z" fill="' + ear + '"/>' +
      '<path d="M90 50 Q98 30 78 38 L76 52 Z" fill="' + ear + '"/>' +
      '<path d="M36 44 Q34 36 42 40 Z" fill="#e8b4b8"/>' +
      '<path d="M84 44 Q86 36 78 40 Z" fill="#e8b4b8"/>' +
      '<ellipse cx="46" cy="54" rx="2.8" ry="3.4" fill="#2b2b2b"/>' +
      '<ellipse cx="74" cy="54" rx="2.8" ry="3.4" fill="#2b2b2b"/>' +
      '<path d="M55 58 Q60 63 65 58" fill="none" stroke="#2b2b2b" stroke-width="1.8" stroke-linecap="round"/>' +
      '<path d="M60 62 V66 M56 66 H64" stroke="#2b2b2b" stroke-width="1.4" stroke-linecap="round" fill="none"/>' +
      '<path d="M34 72 Q20 82 26 90" stroke="' + body + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M86 72 Q100 82 94 90" stroke="' + body + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M34 88 Q48 98 60 98 Q72 98 86 88" fill="none" stroke="' + body + '" stroke-width="5" stroke-linecap="round"/>' +
      extras +
      '</svg>';
  }

  function render() {
    if (!document.getElementById('companionSprite')) return;
    var d = computeState();
    var exp = expFor(d);
    var s = stageFor(exp);
    var pct = Math.min(100, Math.round((exp - s.acc) / s.need * 100));

    var own2 = read();
    document.getElementById('companionSprite').innerHTML = catSVG(s.stage.body, s.stage.ear, s.stage.cheek, own2.equipped || {});
    document.getElementById('companionSprite').style.fontSize = '0';
    document.getElementById('companionStage').textContent = s.stage.name;
    document.getElementById('companionName').textContent = d.ideal && d.ideal.ideal ? '正在成为：' + d.ideal.ideal.slice(0, 12) : '小小的我';
    document.getElementById('cLevel').textContent = 'Lv.' + s.level;
    document.getElementById('cExp').textContent = String(exp);
    document.getElementById('cDays').textContent = String(d.days);
    document.getElementById('cExpBar').style.width = pct + '%';
    document.getElementById('goalText').textContent = goalHint(d.ideal, s.stage);
    document.getElementById('companionTip').textContent = s.stage.desc + ' 每次记录，都在给 TA 一点成长值。';

    var own = read();
    var coins = own.coins || 0;
    var equipped = own.equipped || {};
    document.getElementById('cBadges').textContent = String(coins);

    renderBadges(d, coins);
    renderShop(coins, equipped);
    renderGoal(d);
  }

  function renderBadges(d, coins) {
    var el = document.getElementById('badgesBody');
    var unlocked = {};
    BADGES.forEach(function (b) {
      if (b.check(d)) unlocked[b.id] = 1;
    });
    el.innerHTML = '<div class="badges">' + BADGES.map(function (b) {
      var on = !!unlocked[b.id];
      return '<div class="badge-item ' + (on ? 'unlocked' : 'locked') + '">' +
        '<div class="bi">' + b.icon + '</div><b>' + b.name + '</b><span>' + b.need + '</span></div>';
    }).join('') + '</div>' +
      '<p class="comp-note">奖章会自动按你的记录解锁。每一枚奖章 = 1 点装扮币，可在商店兑换。</p>';
  }

  function renderShop(coins, equipped) {
    var el = document.getElementById('shopBody');
    el.innerHTML = '<div class="shop-list">' + SHOP.map(function (it) {
      var on = equipped[it.id] === 1;
      var afford = coins >= it.cost;
      return '<div class="shop-item ' + (on ? 'owned' : '') + '">' +
        '<div class="shop-icon">' + it.icon + '</div>' +
        '<div class="shop-info"><b>' + it.name + '</b><p>' + it.desc + '</p></div>' +
        '<div class="shop-actions">' +
        (on ? '<span class="owned-tag">已拥有</span>' : '<button class="btn btn-sm" data-buy="' + it.id + '" ' + (afford ? '' : 'disabled') + '>兑换</button>') +
        '<button class="btn btn-sm" data-equip="' + it.id + '" ' + (on ? '' : 'disabled') + '>' + (equipped[it.id] === 1 ? '使用中' : '穿戴') + '</button>' +
        '</div></div>';
    }).join('') + '</div>' +
      '<p class="comp-note">你有 ' + coins + ' 枚装扮币。记录越多，奖章越多，能兑换的装扮就越多。</p>';
    el.querySelectorAll('[data-buy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var own = read();
        own.coins = (own.coins || 0) - SHOP.find(function (s) { return s.id === b.getAttribute('data-buy'); }).cost;
        own.owned = own.owned || {};
        own.owned[b.getAttribute('data-buy')] = 1;
        save(own);
        render();
        window.guanToast('兑换成功，快去穿戴看看');
      });
    });
    el.querySelectorAll('[data-equip]').forEach(function (b) {
      b.addEventListener('click', function () {
        var own = read();
        own.equipped = own.equipped || {};
        var id = b.getAttribute('data-equip');
        own.equipped[id] = own.equipped[id] === 1 ? 0 : 1;
        save(own);
        render();
        window.guanToast(own.equipped[id] === 1 ? '已穿戴' : '已取下');
      });
    });
  }

  function renderGoal(d) {
    var el = document.getElementById('goalBody');
    var ideal = d.ideal;
    if (!ideal || !ideal.ideal) {
      el.innerHTML = '<p class="comp-note">还没有写下你的理想。去人生模拟的「如果预见的成果不是你想要的」那里，写下一个你真正想成为的样子——它会成为这个形象长大的方向。</p>' +
        '<a class="btn btn-gold btn-sm" href="simulator.html">去写下理想</a>';
      return;
    }
    var hint = goalHint(ideal, stageFor(expFor(d)).stage);
    el.innerHTML = '<div class="goal-box"><b>我的理想</b><p>' + ideal.ideal + '</p></div>' +
      '<p class="comp-note">' + hint + '</p>' +
      '<p class="comp-note">理想不是一天到达的。每一条记录，都是你在朝 TA 走过去的一步。等你连续记录满一年，这个小形象会长成它的样子——而那时，你离真正的自己也更近了。</p>';
  }

  // 每保存一条记录后调用：累计装扮币（首次解锁奖章自动发放）
  window.guanCompanionAddCoins = function (n) {
    var own = read();
    own.coins = (own.coins || 0) + (n || 1);
    save(own);
  };

  // 在成长轨迹/三十天保存记录时调用
  window.guanCompanionFeed = function () {
    var own = read();
    var before = own.lastCount || 0;
    var d = computeState();
    // 每满 7 天成长值自动发 1 币
    var gained = Math.floor(d.days / 7) - Math.floor(before / 7);
    if (gained > 0) {
      own.coins = (own.coins || 0) + gained;
      own.lastCount = d.days;
      save(own);
    }
  };

  document.querySelectorAll('.comp-tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.comp-tab').forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      ['badges', 'shop', 'goal'].forEach(function (id) {
        document.getElementById(id + 'Body').classList.toggle('hidden', id !== t.getAttribute('data-tab'));
      });
    });
  });

  render();
})();
