(function () {
  'use strict';

  var TOPICS = [
    {
      id: 't1',
      title: '你在哪个瞬间，决定开始理解自己？',
      desc: '是某个深夜，某段关系的结束，还是某句突然击中你的话？',
      seed: [
        '大概是发现自己总是在同样的问题上跌倒的那一天。',
        '朋友说「你好像很了解所有人，除了你自己」——那天晚上我失眠了。',
        '辞职之后，第一次有空问自己：我到底想要什么？'
      ]
    },
    {
      id: 't2',
      title: '低谷教会了你什么？',
      desc: '那些最难的日子里，你后来发现最重要的是什么？',
      seed: [
        '低谷教会我：不是所有事都要立刻变好。',
        '原来「休息」不是认输，是重新蓄力。',
        '低谷让我第一次看清，谁是真的在。'
      ]
    },
    {
      id: 't3',
      title: '如果人生可以重新设计，你最想保留哪一部分？',
      desc: '不急着推翻一切——先看看现在拥有的，哪些值得带走。',
      seed: [
        '保留我的好奇心，它带我去过很多地方。',
        '保留那些愿意听我说废话的朋友。',
        '保留低谷教会我的清醒。'
      ]
    },
    {
      id: 't4',
      title: '你最近一次「觉得自己活着」是什么时刻？',
      desc: '不是成功的时刻，而是突然感到「人间值得」的瞬间。',
      seed: [
        '傍晚散步时，风刚好吹过来，我突然不想死了。',
        '做完一顿饭，端上桌的那一刻。',
        '深夜和最好的朋友笑到肚子疼。'
      ]
    },
    {
      id: 't5',
      title: '哪句话，你希望小时候的自己能听到？',
      desc: '写给过去的自己，也是写给现在的自己。',
      seed: [
        '「你不是麻烦，你只是需要时间。」',
        '「考砸了天不会塌，真的。」',
        '「你不用变得完美才值得被爱。」'
      ]
    },
    {
      id: 't6',
      title: '低谷里，谁曾轻轻接住过你？',
      desc: '那个人可能不知道，TA的一个动作陪你走了很远。',
      seed: [
        '朋友什么都没问，只是陪我在公园坐了一下午。',
        '妈妈在电话里说「回来吧，饭做好了」。',
        '一个陌生人的一句「会好起来的」，我记到现在。'
      ]
    },
    {
      id: 't7',
      title: '最近让你「卡住」的是工作、关系，还是方向？',
      desc: '写下来就好——被说出口的困境，就已经松动了一点。',
      seed: [
        '工作让我累的不是事，是不知道为了什么。',
        '明明在意，却总把重要的话咽回去。',
        '什么都想要一点，结果哪条路都没走深。'
      ]
    },
    {
      id: 't8',
      title: '如果可以对自己「免责」一天，你最想卸下什么？',
      desc: '不做什么、不成为什么、不证明什么的一天。',
      seed: [
        '卸下「我必须让所有人满意」。',
        '卸下「我该更快一点」。',
        '卸下「我要想清楚才能开始」。'
      ]
    },
    {
      id: 't9',
      title: '你身上最像「礼物」的特质是什么？',
      desc: '不一定是优点清单里的那种——是你自己悄悄知道的那个。',
      seed: [
        '我好像总能第一个发现朋友情绪不对。',
        '我很会给自己找乐子，一个人也能玩得很开心。',
        '我不太会说话，但答应的事一定会做到。'
      ]
    },
    {
      id: 't10',
      title: '如果一年后的你给现在的你写信，TA会说什么？',
      desc: '未来的你会感谢现在的你什么？',
      seed: [
        '「谢谢你那时候没有放弃，虽然你总觉得自己很糟。」',
        '「谢谢你终于允许自己慢下来了。」',
        '「谢谢你敢说出那句话，它改变了一切。」'
      ]
    },
    {
      id: 't11',
      title: '你心里一直没放下的一件事是什么？',
      desc: '这里没有评判。有些事，说出来才算真正开始处理。',
      seed: [
        '一句没来得及说的再见。',
        '一次我本可以勇敢却没勇敢的选择。',
        '对某个人的亏欠，我一直没敢面对。'
      ]
    },
    {
      id: 't12',
      title: '最近有什么小小的「好事」发生了？',
      desc: '花园里也欢迎好消息——它们同样是真实生活的一部分。',
      seed: [
        '今天地铁上有人给我让座，我愣了半天。',
        '种的花冒芽了。',
        '终于把拖了两周的报告写完了，没有想象中难。'
      ]
    }
  ];

  function read(key, fallback) {
    try {
      var v = JSON.parse(window.guanGet(key));
      return v || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function profile() {
    try {
      return JSON.parse(window.guanGet('guan_profile') || '{}');
    } catch (e) {
      return {};
    }
  }

  function firstResult(key) {
    var v = window.guanGet(key);
    return v || '';
  }

  function buildCard() {
    var p = profile();
    var archetype = firstResult('guan_archetype');
    var values = firstResult('guan_values');
    var stage = firstResult('guan_stage');
    var energy = firstResult('guan_energy');
    var mbti = p.mbti || '';
    var name = p.nickname || '观己者';
    var code = [];
    if (archetype) code.push('原型·' + archetype.split(' · ')[0]);
    if (values) code.push('价值·' + values.split(' · ')[0]);
    if (mbti) code.push('MBTI·' + mbti);
    if (stage) code.push('阶段·' + stage.split(' · ')[0]);
    if (code.length === 0) code.push('等你完成第一次探索');

    document.getElementById('rcName').textContent = name;
    document.getElementById('rcCode').textContent = code.join(' ｜ ');
    var tags = [];
    if (archetype) tags.push(archetype.split(' · ')[0]);
    if (stage) tags.push(stage.split(' · ')[0]);
    if (values) tags.push(values.split(' · ')[0]);
    if (mbti) tags.push(mbti);
    if (energy) tags.push(energy.split(' · ')[0] || energy);
    document.getElementById('rcTags').innerHTML = tags.map(function (t) {
      return '<span class="badge badge-gold">' + t + '</span>';
    }).join('') || '<span class="badge">等待探索</span>';
    var note = '我在「观己实验室」探索自己，正走在' + (stage ? stage.split(' · ')[0] + '的路上' : '寻找方向的路上') + '。' +
      (p.focus ? '最近在想：「' + p.focus + '」。' : '') +
      '如果你也在这里，也许我们会在同一片花园里认出彼此。';
    document.getElementById('rcNote').textContent = note;
    document.getElementById('resonanceCard').classList.add('show');
    window.guanSet('guan_card', JSON.stringify({ name: name, code: code.join(' ｜ '), tags: tags, note: note }));
  }

  function renderTopics() {
    var comments = read('guan_garden_comments', {});
    var el = document.getElementById('topics');
    el.innerHTML = '';
    TOPICS.forEach(function (t) {
      var div = document.createElement('div');
      div.className = 'topic-box';
      var items = (comments[t.id] || []).slice();
      var list = items.concat(t.seed).slice(-6).map(function (c) { return '<li>' + c + '</li>'; }).join('');
      div.innerHTML = '<h4>' + t.title + '</h4><p>' + t.desc + '</p>' +
        '<ul class="topic-comments">' + list + '</ul>' +
        '<input class="topic-input" data-topic="' + t.id + '" placeholder="留下你的声音…">' +
        '<button type="button" class="btn btn-sm" data-send="' + t.id + '" style="margin-top:8px">写下我的</button>';
      el.appendChild(div);
    });
    el.querySelectorAll('[data-send]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tid = btn.getAttribute('data-send');
        var input = el.querySelector('[data-topic="' + tid + '"]');
        var text = input.value.trim();
        if (!text) { window.guanToast('先写下一句你的声音'); return; }
        var all = read('guan_garden_comments', {});
        all[tid] = all[tid] || [];
        all[tid].push(text);
        window.guanSet('guan_garden_comments', JSON.stringify(all));
        input.value = '';
        renderTopics();
        window.guanToast('已留下 · 花园里多了一粒种子');
      });
    });
  }

  document.getElementById('genCard').addEventListener('click', buildCard);
  document.getElementById('copyCard').addEventListener('click', function () {
    var card = read('guan_card', null);
    if (!card) { window.guanToast('先生成你的名片'); return; }
    var text = '【我的同频名片 · 观己实验室】\n' + card.name + '\n' + card.code + '\n' +
      card.tags.join(' · ') + '\n\n' + card.note + '\n\n—— 观己实验室 · 理解自己，设计人生';
    window.guanCopy(text, function (ok) {
      window.guanToast(ok ? '名片已复制，去你的社群分享吧' : '复制失败');
    });
  });

  renderTopics();
  if (read('guan_card', null)) buildCard();
})();
