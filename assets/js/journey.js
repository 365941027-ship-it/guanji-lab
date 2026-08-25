(function () {
  'use strict';

  var KEY = 'guan_journey';

  var AI_PROVIDERS = {
    openai: {
      url: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o-mini',
      headers: function (key) { return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }; },
      body: function (sys, user) { return { model: 'gpt-4o-mini', messages: [{ role: 'system', content: sys }, { role: 'user', content: user }], max_tokens: 200, temperature: 0.9 }; },
      parse: function (d) { return d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content; }
    },
    gemini: {
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      model: 'gemini-2.0-flash',
      headers: function (key) { return { 'Content-Type': 'application/json' }; },
      urlKey: function (key) { return '?key=' + encodeURIComponent(key); },
      body: function (sys, user) { return { contents: [{ role: 'user', parts: [{ text: sys + '\n\n' + user }] }], generationConfig: { maxOutputTokens: 200, temperature: 0.9 } }; },
      parse: function (d) { return d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts && d.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join(''); }
    },
    deepseek: {
      url: 'https://api.deepseek.com/chat/completions',
      model: 'deepseek-chat',
      headers: function (key) { return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }; },
      body: function (sys, user) { return { model: 'deepseek-v4-pro', messages: [{ role: 'system', content: sys }, { role: 'user', content: user }], max_tokens: 200, temperature: 0.9 }; },
      parse: function (d) { return d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content; }
    }
  };

  function availableKey() {
    return ['openai', 'gemini', 'deepseek'].filter(function (p) {
      return localStorage.getItem('guan_ai_key_' + p);
    })[0] || null;
  }

  function callAiDaily(prompt) {
    var proxyUrl = window.GUAN_PROXY_URL || '';
    if (proxyUrl) {
      return fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'deepseek',
          messages: [
            { role: 'system', content: prompt.sys },
            { role: 'user', content: prompt.user }
          ],
          max_tokens: 300,
          temperature: 0.9
        })
      }).then(function (res) {
        if (!res.ok) return null;
        return res.json();
      }).then(function (data) {
        var text = data && data.text;
        return text ? text.trim().slice(0, 120) : null;
      }).catch(function () { return null; });
    }
    var provider = availableKey();
    if (!provider) return Promise.resolve(null);
    var key = localStorage.getItem('guan_ai_key_' + provider);
    var cfg = AI_PROVIDERS[provider];
    var url = cfg.url + (cfg.urlKey ? cfg.urlKey(key) : '');
    return fetch(url, {
      method: 'POST',
      headers: cfg.headers(key),
      body: JSON.stringify(cfg.body(prompt.sys, prompt.user))
    }).then(function (res) {
      if (!res.ok) return null;
      return res.json();
    }).then(function (data) {
      if (!data) return null;
      var text = cfg.parse(data);
      return text ? text.trim().slice(0, 120) : null;
    }).catch(function () { return null; });
  }

  var DAYS = [
    '今天，只回答一个问题：此刻的我是怎样的？',
    '留意一个「让我有能量」的瞬间——它很小，但值得被看见。',
    '写下今天想感谢自己的一件事，哪怕很小。',
    '今天，允许自己有一件「没做完」的事。',
    '留意：今天我有没有在勉强自己？',
    '写下你最近反复想起的一句话或一个场景。',
    '今天，给自己一个不被打扰的二十分钟。'
  ];

  var WEEK_LETTERS = [
    {
      week: 1,
      title: '第一周 · 先认识此刻的自己',
      body: '这一周，我们不急着改变什么。你只需要开始做一件事：留意自己。留意你的情绪、你的能量、你反复想起的念头。认识自己是所有改变的地基——而认识，不是评判，是看见。这一周，请允许自己「不做任何事，只是看着自己」。你不需要变得更好，你只需要先承认：此刻的你是真实的，而真实的你值得被了解。',
      note: '第一周的目标很简单：每天留一点点时间，不评判地看看自己。你不需要记录得多好，只需要愿意回来。'
    },
    {
      week: 2,
      title: '第二周 · 看见你的模式',
      body: '这一周，试着在记录中寻找「重复」：什么情绪反复出现？什么场景反复触发你？什么话你反复对自己说？重复不是你的失败，它是你内在模式的地图。看见模式的那一刻，你已经不再只是「被困在其中的人」——你开始成为一个观察者。而观察者，拥有选择的权利。',
      note: '这一周，请带着「好奇」而不是「审判」回看你的记录。你寻找的不是错误，是线索。'
    },
    {
      week: 3,
      title: '第三周 · 倾听内心的声音',
      body: '当你开始看见模式，你会听见一个一直被忽略的声音——你内心真实的需要。它可能很小：「我想休息」「我想被听见」「我想做那件一直没做的事」。这一周，请练习把它说出来，至少写下来。需要不是弱点，它是你活着最真实的证据。',
      note: '这一周，试着每天写下一句「我今天真正需要的是……」。不需要实现它，只需要承认它。'
    },
    {
      week: 4,
      title: '第四周 · 把理解变成方向',
      body: '最后一周，把你三十天里看见的整合起来：你的模式、你的需要、你的变化。它们共同指向一个方向——不是别人给你的方向，是你自己长出来的。它可能还很模糊，没关系。方向不要求清晰，只要求真实。带着这三十天的记录，去做一次专属自察，或者去人生设计里，看看那个方向可以长成什么样子。',
      note: '这一周，请为自己写一封短信：未来的我，我想对你说……。这封信会成为你下一段路的起点。'
    }
  ];

  function read() {
    try {
      return JSON.parse(window.guanGet(KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function save(items) {
    window.guanSet(KEY, JSON.stringify(items));
    if (window.guanSyncGrowth) window.guanSyncGrowth('journey', items);
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function dayNumber() {
    var items = read();
    var today = todayStr();
    var idx = items.findIndex(function (it) { return it.date === today; });
    return idx > -1 ? idx + 1 : items.length + 1;
  }

  function render() {
    var items = read();
    var day = Math.min(dayNumber(), 30);
    var week = Math.min(Math.ceil(day / 7), 4);
    document.getElementById('journeyDay').textContent = '第 ' + day + ' 天';
    document.getElementById('journeyBar').style.width = (day / 30 * 100) + '%';
    document.getElementById('journeyCount').textContent = '共 30 天 · 你已经陪了自己 ' + Math.min(items.length, 30) + ' 天';

    var promptIdx = (day - 1) % DAYS.length;
    document.getElementById('dayPrompt').textContent = DAYS[promptIdx];
    document.getElementById('dayHint').textContent = '第 ' + day + ' 天 · 不需要做得很好，只要愿意回来。';

    // AI 每日一问：如果有 key，根据最近记录生成专属问题；失败则保留固定文案
    var recent = items.slice(-5).map(function (it) { return it.note || ''; }).filter(Boolean);
    var aiQ = callAiDaily({
      sys: '你是「观己实验室」的温柔陪伴者。请根据用户最近几天的记录，生成一句只属于今天的「每日一问」。要求：1）引用TA记录里的一个细节；2）语气温暖、像朋友；3）一句话，不超过50字；4）不评判、不给建议。',
      user: '我最近几天的记录：' + (recent.length ? recent.join('；') : '（还没有记录）') + '\n\n请生成今天的每日一问。'
    });
    aiQ.then(function (text) {
      if (text) document.getElementById('dayPrompt').textContent = text;
    });

    var letter = WEEK_LETTERS[week - 1];
    document.getElementById('letterWeek').textContent = letter.title;
    document.getElementById('letterBody').textContent = letter.body;
    document.getElementById('weekNote').textContent = letter.note;
    document.getElementById('letterSign').textContent = '—— 观己实验室';

    var history = document.getElementById('journeyHistory');
    history.innerHTML = '';
    items.slice(-5).reverse().forEach(function (it) {
      var li = document.createElement('li');
      var time = document.createElement('time');
      time.textContent = it.date + ' · ' + (it.mood || '未标记');
      li.appendChild(time);
      li.appendChild(document.createTextNode(it.note || ''));
      history.appendChild(li);
    });
    if (!items.length) {
      history.innerHTML = '<li style="opacity:.65">你还没有记录。今天，就是很好的第一天。</li>';
    }
  }

  var mood = null;
  document.querySelectorAll('#dayMoods .mood-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('#dayMoods .mood-btn').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      mood = b.getAttribute('data-mood');
    });
  });

  document.getElementById('journeySave').addEventListener('click', function () {
    var note = document.getElementById('dayNote').value.trim();
    if (!note && !mood) {
      window.guanToast('写一句话，或选一个情绪，都可以');
      return;
    }
    var items = read();
    var today = todayStr();
    var existing = items.findIndex(function (it) { return it.date === today; });
    var entry = { date: today, mood: mood || '未标记', note: note || '（只记了一个情绪）' };
    if (existing > -1) {
      items[existing] = entry;
    } else {
      items.push(entry);
    }
    save(items);
    if (window.guanCompanionFeed) window.guanCompanionFeed();
    if (window.guanCompanionAddCoins) window.guanCompanionAddCoins(1);
    document.getElementById('dayNote').value = '';
    document.querySelectorAll('#dayMoods .mood-btn').forEach(function (b) { b.classList.remove('on'); });
    mood = null;
    render();
    window.guanToast('已记下 · 今天你陪了自己一会儿');
  });

  document.getElementById('journeyToday').addEventListener('click', function () {
    document.getElementById('dayNote').scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('dayNote').focus();
  });

  render();
  if (window.guanCalendar) {
    window.guanCalendar({
      mount: 'journeyCal',
      getRecords: function () { return read(); }
    });
  }
})();
