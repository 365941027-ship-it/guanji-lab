(function () {
  'use strict';

  function read(key, fallback) {
    try {
      var v = JSON.parse(window.guanGet(key));
      return v || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function resultOf(key) {
    return window.guanGet(key) || '';
  }

  var profile = read('guan_profile', {});
  var growth = read('guan_growth', []);
  var nickname = profile.nickname || '';

  var themes = {
    care: 0, explore: 0, steady: 0, express: 0, boundary: 0, meaning: 0
  };

  function q(text, options) {
    options.forEach(function (o) {
      Object.keys(o.score || {}).forEach(function (t) {
        themes[t] = 0; // initialize
      });
    });
    return { q: text, options: options };
  }

  function opt(text, tag, scores) {
    return { text: text, tag: tag, score: scores };
  }

  // Build questions tailored to the user's data
  var questions = [];

  var archetype = resultOf('guan_archetype');
  var stage = resultOf('guan_stage');
  var energy = resultOf('guan_energy');
  var values = resultOf('guan_values');
  var burnout = resultOf('guan_burnout');
  var attachment = resultOf('guan_attachment');
  var drain = resultOf('guan_drain');
  var pleasing = resultOf('guan_pleasing');

  // Q1: state
  questions.push(q(
    (nickname ? nickname + '，' : '') + '此刻回顾最近的日子，你心里最接近的一种感受是？',
    [
      opt('有一种想往前走的劲，但方向还不完全清楚', '跃跃欲试', { explore: 2, meaning: 1 }),
      opt('有点累，想先喘口气，不想被催着走', '需要休息', { care: 2, steady: 1 }),
      opt('心里装了挺多事，想找人说一说', '想被听见', { express: 2, care: 1 }),
      opt('日子照常，但隐约觉得该有什么不同了', '暗流涌动', { meaning: 2, boundary: 1 })
    ]
  ));

  // Q2: crossing dimension (unique to custom test, not in fixed tests)
  questions.push(q('如果把最近的生活比作一本书，你正读到的章节更像？', [
    opt('序章：很多可能还没展开', '序章', { explore: 2 }),
    opt('转折章：旧情节正在退场', '转折', { meaning: 2 }),
    opt('沉淀章：情节在慢慢扎根', '沉淀', { steady: 2 }),
    opt('空页：还没想好下一章写什么', '空页', { care: 2, meaning: 1 })
  ]));

  // Q3: based on drain
  if (drain.indexOf('反刍') > -1) {
    questions.push(q('你的内耗常来自反复回放过去。当旧事又一次浮上来时，什么最能帮到你？', [
      opt('有人告诉我「都过去了，你已经做得很好了」', '被安抚', { care: 2, express: 1 }),
      opt('自己写下来，把乱麻理一理', '被整理', { steady: 1, boundary: 1 }),
      opt('动起来，让身体把念头打断', '被转移', { explore: 2 })
    ]));
  } else if (drain.indexOf('比较') > -1) {
    questions.push(q('你的内耗常来自比较。当你看到别人过得「更好」时，你其实真正想对自己说的是？', [
      opt('我也想被看见、被认可', '渴望认可', { express: 2, care: 1 }),
      opt('我是不是走得太慢了', '自我怀疑', { care: 2 }),
      opt('我不想过成别人的样子', '要自己的路', { boundary: 2, meaning: 1 })
    ]));
  } else if (drain.indexOf('完美') > -1) {
    questions.push(q('你的内耗常来自对自己要求太高。如果今天允许自己「不完美地完成」一件事，你最想完成什么？', [
      opt('完成一件拖了很久的小事', '先完成', { steady: 2 }),
      opt('说出一句一直没说的话', '先表达', { express: 2 }),
      opt('只是休息，不产出任何东西', '先休息', { care: 2 })
    ]));
  } else if (drain.indexOf('讨好') > -1) {
    questions.push(q('你的内耗常来自太在意别人。如果今天练习一次「先照顾自己」，你更想从哪开始？', [
      opt('拒绝一件不想做的事', '学说不', { boundary: 2 }),
      opt('先做一件只取悦自己的事', '学爱己', { care: 2 }),
      opt('直接说出一个真实的需要', '学表达', { express: 2 })
    ]));
  } else {
    questions.push(q('最近，什么最容易悄悄消耗你的能量？', [
      opt('想太多，做得太少', '思虑过载', { steady: 2 }),
      opt('答应了太多不想答应的事', '边界模糊', { boundary: 2 }),
      opt('重要的话没说出来', '表达压抑', { express: 2 })
    ]));
  }

  // Q4: unique relational lens, not repeating attachment test
  questions.push(q('你最近与人的相处中，最常出现的一种「隐形动态」是？', [
    opt('我常常先替对方找理由', '替人解释', { care: 2, express: 1 }),
    opt('我习惯先听，很少说自己', '只听不说', { express: 2 }),
    opt('我嘴上说没事，心里希望被看穿', '口是心非', { care: 2, boundary: 1 }),
    opt('我害怕打扰别人，宁可自己消化', '怕打扰', { boundary: 2, care: 1 })
  ]));

  // Q5: based on values
  if (values.indexOf('自由') > -1) {
    questions.push(q('你最看重自由。那么，最近生活里最让你感到「被绑住」的，是？', [
      opt('日程被别人填满，没有自己的时间', '时间被占', { boundary: 2 }),
      opt('被期待活成某种样子', '期待捆绑', { boundary: 2, meaning: 1 }),
      opt('没有选择，只能按部就班', '无路可选', { explore: 2 })
    ]));
  } else if (values.indexOf('联结') > -1) {
    questions.push(q('你最看重联结。那么，最近你与重要的人之间，最需要修复的是？', [
      opt('有些话一直没说出口', '未说之话', { express: 2 }),
      opt('相处的时间太少', '陪伴缺失', { care: 2 }),
      opt('我付出很多，却很少被接住', '单向付出', { boundary: 2 })
    ]));
  } else if (values.indexOf('创造') > -1) {
    questions.push(q('你最看重创造。如果今天可以留下一个小作品，它更可能是？', [
      opt('一段文字、一张图、一首歌', '微小创作', { explore: 2 }),
      opt('把一件事从头做到尾', '完成作品', { steady: 2 }),
      opt('帮助一个人解决一个问题', '助人作品', { meaning: 2, express: 1 })
    ]));
  } else if (values.indexOf('安定') > -1) {
    questions.push(q('你最看重安定。最近最让你感到「不安定」的，是？', [
      opt('变化太多，来不及适应', '变化过载', { steady: 2, care: 1 }),
      opt('未来的不确定性', '前路未明', { meaning: 2 }),
      opt('关系里的忽冷忽热', '关系波动', { express: 2, care: 1 })
    ]));
  } else {
    questions.push(q('关于「什么对你最重要」，你最近更接近哪种感受？', [
      opt('我需要更多自由和空间', '要自由', { boundary: 2, explore: 1 }),
      opt('我需要更深的联结', '要联结', { express: 2, care: 1 }),
      opt('我需要做成点什么事', '要创造', { steady: 2, meaning: 1 })
    ]));
  }

  // Q6: based on burnout
  if (burnout.indexOf('疲惫') > -1) {
    questions.push(q('你的倦怠测试显示你已很疲惫。此刻最不被允许、但你最需要的事是？', [
      opt('彻底休息，什么都不做', '休息', { care: 2 }),
      opt('承认「我撑不住了」，不再硬撑', '示弱', { express: 2 }),
      opt('把一部分责任放下', '卸担', { boundary: 2 })
    ]));
  } else if (burnout.indexOf('觉醒') > -1) {
    questions.push(q('你的倦怠测试显示你正在觉醒：你知道该变了。你更希望下一步是？', [
      opt('先保住现状，再悄悄试新路', '双轨', { steady: 2, explore: 1 }),
      opt('尽快开始新的尝试，不等了', '起步', { explore: 2 }),
      opt('先想清楚自己要什么，再动', '澄清', { meaning: 2 })
    ]));
  } else {
    questions.push(q('关于「工作或学业」，你目前最真实的感受是？', [
      opt('还能走，但心里在问「然后呢」', '意义追问', { meaning: 2 }),
      opt('想认真，但总被什么拖住', '心力不足', { care: 2 }),
      opt('我想往一个更感兴趣的方向走', '方向萌动', { explore: 2 })
    ]));
  }

  // Q7: based on pleasing
  if (pleasing.indexOf('照顾') > -1) {
    questions.push(q('你的模式里带着「习惯照顾别人」。如果今天把照顾的力气分一点给自己，你最想为自己做的是？', [
      opt('好好吃一顿、睡一觉', '照顾身体', { care: 2 }),
      opt('做一件一直想做但「没时间」的事', '照顾心愿', { explore: 2, meaning: 1 }),
      opt('什么都不安排，留白', '照顾空白', { steady: 2 })
    ]));
  } else if (pleasing.indexOf('怕冲突') > -1) {
    questions.push(q('你习惯避免冲突。如果今天练习一次「温柔地表达不同」，你更想从哪里开始？', [
      opt('对一件小事说「我有不同想法」', '小表达', { express: 2, boundary: 1 }),
      opt('拒绝一次不想答应的请求', '小拒绝', { boundary: 2 }),
      opt('说出一个自己的需要', '小请求', { express: 2, care: 1 })
    ]));
  } else {
    questions.push(q('在关系里，你希望自己被怎样对待？', [
      opt('被认真倾听', '被听见', { express: 2, care: 1 }),
      opt('被尊重边界', '被尊重', { boundary: 2 }),
      opt('被主动想起', '被惦记', { care: 2, express: 1 })
    ]));
  }

  // Q8: from growth records
  var recent = growth.slice(-3).map(function (g) { return g.note || ''; }).join(' ');
  if (recent) {
    questions.push(q('你在成长轨迹里记录过：「' + recent.slice(0, 34) + (recent.length > 34 ? '…' : '') + '」。回看这些记录，你最想对自己说的是？', [
      opt('我已经在往前走，哪怕步子小', '肯定自己', { care: 2, meaning: 1 }),
      opt('我想让记录里的那个愿望真的发生', '推进愿望', { explore: 2, steady: 1 }),
      opt('有些记录让我心疼，我想抱抱那时的自己', '心疼自己', { care: 2, express: 1 })
    ]));
  } else {
    questions.push(q('你还没有开始记录成长轨迹。如果今天开始记录第一笔，你最想记下的是？', [
      opt('此刻真实的感受', '记感受', { express: 2 }),
      opt('今天完成的一件事', '记小事', { steady: 2 }),
      opt('我想改变的一件事', '记愿望', { explore: 2, meaning: 1 })
    ]));
  }

  // Q9: profile stage
  if (profile.stage) {
    questions.push(q('你的档案写着，你正处在' + profile.stage + '。这个阶段里，你最需要被允许的是？', [
      opt('不必立刻有答案', '允许模糊', { meaning: 2, care: 1 }),
      opt('走得慢一点', '允许慢', { steady: 2 }),
      opt('先照顾好自己的感受', '允许自爱', { care: 2, boundary: 1 })
    ]));
  } else {
    questions.push(q('如果现在可以放下「应该」，你最想对自己说的是？', [
      opt('「你可以慢一点」', '慢', { care: 2, steady: 1 }),
      opt('「你可以试错」', '试', { explore: 2 }),
      opt('「你可以说出真实感受」', '说', { express: 2 })
    ]));
  }

  // Q10: profile focus
  if (profile.focus) {
    questions.push(q('你在档案里写道，最近最想探索的是「' + profile.focus + '」。关于它，你此刻最需要的是？', [
      opt('一个可以开始的小行动', '要起步', { explore: 2, steady: 1 }),
      opt('有人陪我把这件事聊清楚', '要对话', { express: 2 }),
      opt('允许自己暂时没想清楚', '要空间', { meaning: 2, care: 1 })
    ]));
  } else {
    questions.push(q('如果此刻有一个小小的愿望，它最可能是？', [
      opt('想清楚下一步该往哪走', '方向', { meaning: 2 }),
      opt('有一段不被打扰的时间', '安宁', { care: 2, steady: 1 }),
      opt('和某个人重新连接', '联结', { express: 2 })
    ]));
  }

  // Q11: archetype shadow
  if (archetype.indexOf('探索者') > -1) {
    questions.push(q('你的原型是探索者。当你想一直「在路上」时，你其实也在逃避什么？', [
      opt('深耕的枯燥', '怕枯燥', { steady: 2 }),
      opt('面对一个具体的选择', '怕选择', { meaning: 2 }),
      opt('停下来面对自己', '怕面对', { care: 2 })
    ]));
  } else if (archetype.indexOf('创造者') > -1) {
    questions.push(q('你的原型是创造者。当你想「把所有事都做成」时，你最需要练习的是？', [
      opt('只选一件事做完', '做减法', { steady: 2 }),
      opt('允许作品不完美', '接受粗糙', { care: 2, boundary: 1 }),
      opt('休息，不必一直在产出', '允许停', { care: 2 })
    ]));
  } else if (archetype.indexOf('觉知者') > -1) {
    questions.push(q('你的原型是觉知者。当你看得太透、想得太多时，什么最能帮到你？', [
      opt('把洞察变成行动', '知行合一', { explore: 2, steady: 1 }),
      opt('不再独自消化，找人说说', '分享洞察', { express: 2 }),
      opt('允许自己「不用什么都懂」', '放下透彻', { care: 2 })
    ]));
  } else if (archetype.indexOf('重构者') > -1) {
    questions.push(q('你的原型是重构者。当你想「推翻重来」时，你真正需要分辨的是？', [
      opt('这栋房子该拆，还是该修', '拆或修', { steady: 2, meaning: 1 }),
      opt('我在逃离，还是在重建', '逃或建', { meaning: 2, care: 1 }),
      opt('重建之后，我想住在什么样的生活里', '要什么', { explore: 2 })
    ]));
  } else if (archetype.indexOf('守护者') > -1) {
    questions.push(q('你的原型是守护者。当你想「先安顿所有人」时，你最需要练习的是？', [
      opt('把自己也放进被照顾的名单', '自爱', { care: 2 }),
      opt('直接说出「我需要」', '表达需要', { express: 2, boundary: 1 }),
      opt('允许别人照顾我一次', '接受照顾', { care: 2, boundary: 1 })
    ]));
  } else {
    questions.push(q('面对一件让你犹豫的事，你更接近哪种内心状态？', [
      opt('想清楚再动', '先想', { steady: 2 }),
      opt('动起来才知道', '先动', { explore: 2 }),
      opt('先听听自己真正想要什么', '先听心', { meaning: 2, care: 1 })
    ]));
  }

  // Q12: closing
  questions.push(q('最后一个问题：如果这份自察能给你留下一样东西，你最希望它是什么？', [
    opt('一句让我安心的理解', '被理解', { care: 2, express: 1 }),
    opt('一个可以开始的小方向', '小方向', { explore: 2, meaning: 1 }),
    opt('一点允许自己慢慢来的空间', '被允许', { steady: 2, care: 1 })
  ]));

  // Ensure all themes have at least one result map
  var themeNames = {
    care: '把照顾留给自己',
    explore: '允许自己向前试',
    steady: '稳一点，也是前进',
    express: '让声音出来',
    boundary: '边界是温柔的门',
    meaning: '先听心里的答案'
  };

  function topThemes() {
    return Object.keys(themes).sort(function (a, b) { return themes[b] - themes[a]; });
  }

  function buildResults() {
    var results = {};
    var top = topThemes();
    top.slice(0, 3).forEach(function (t, idx) {
      var name = themeNames[t];
      var lines = [];
      lines.push('这份自察由你的档案、测试与记录共同生成。你此刻最需要的，或许是「' + name + '」。');
      if (profile.zodiac) lines.push('你出生在' + profile.zodiac + '的时节，你的' + (profile.mbti ? profile.mbti + '与' : '') + '内在倾向，都只是你的一部分——它们不是标签，而是你用来理解自己的语言。');
      if (archetype) lines.push('你在人生原型中偏向' + archetype.split(' · ')[0] + '的能量，在' + (stage || '寻找方向') + '的路上，你的这些特质会在对的时候发光。');
      if (growth.length) lines.push('你已经在成长轨迹里留下了 ' + growth.length + ' 条记录——这本身，就是你在认真对待自己的证明。');
      if (profile.focus) lines.push('你心里那个关于「' + profile.focus + '」的念头，值得被温柔对待：它不是你焦虑的来源，是你正在生长的方向。');
      lines.push('如果只能带走一句话，请带走这句：你不需要变成另一个人，你只需要成为更完整的自己。');
      results[name] = {
        name: name,
        en: idx === 0 ? 'Your Own Signal' : 'A Gentle Direction',
        tarot: '专属',
        core: lines.join(' '),
        conflict: '没有人的轨迹是直线。你现在感到的犹豫、疲惫或不确定，都是你在长大的证据，而不是你需要消灭的故障。',
        growth: '把这份自察带回你的记录里：写下此刻的感受，过几天回看，你会看见自己正在变化。',
        possibilities: ['你正在学习用自己的语言理解自己——这是最深的独立', '你的记录会在未来成为你回看时最温柔的镜子', '每一次自察，都在让你离真实的自己更近一步'],
        actions: [
          (t === 'care' ? '今天为自己做一件只取悦自己的小事' : t === 'boundary' ? '今天练习一次温柔而坚定的拒绝' : t === 'express' ? '今天说出一个真实的想法或感受' : t === 'steady' ? '今天只完成最重要的一件小事，然后停下来' : '今天为那个愿望安排一个最小行动'),
          '把这一刻的感受记进成长轨迹'
        ],
        question: '如果我允许自己按现在的节奏走，我会更接近什么？',
        quote: '',
        letter: (nickname ? nickname + '：' : '亲爱的你：') + '这份问卷是为你一个人生成的。它不来自任何固定的题库，而是来自你的档案、你的测试、你留下的记录。我想告诉你：你愿意停下来做这份自察，本身就是在认真对待自己——这比大多数人都勇敢。' + (growth.length ? '你记录过的那些日子，我都替你记着。它们证明你一直在走，哪怕有时慢，哪怕有时绕路。' : '') + '接下来的路，不必一次想清楚。今天只需要带走一个问题，或者一句让你安心的话。我会在这里，等你下次回来。'
      };
    });
    return results;
  }

  window.GUAN_QUIZ = {
    key: 'guan_custom',
    title: '我的专属自察',
    en: 'A Test Made For You',
    resultLabel: '自察结果',
    scoring: 'stage',
    category: 'self',
    categoryTitle: '自我成长',
    desc: '根据你的档案、测试结果与成长记录生成的专属自察。',
    questions: questions,
    results: buildResults(),
    insights: []
  };
})();
