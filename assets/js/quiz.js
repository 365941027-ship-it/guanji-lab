(function () {
  'use strict';

  var QUIZ = window.GUAN_QUIZ;
  if (!QUIZ) return;

  var state = {
    answers: new Array(QUIZ.questions.length).fill(null),
    index: 0
  };

  var letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  var SOFTEN = {
    '怕失败': '有点怕失败', '自我否定': '对自己严格', '灾难化': '想到最坏处', '被否定': '怕被否定',
    '被比下': '怕被比下去', '高期待': '被期待着', '被催': '被催促着', '被比较': '常被比较',
    '失眠': '睡不太好', '熬夜': '常熬夜', '前慢后急': '时间有点紧', '卡难题': '容易卡住',
    '手抖': '有点紧张', '审判': '把它看得很重', '无关联': '与复习无关', '不够': '总觉得不够',
    '别人多': '觉得别人准备得多', '身体先': '身体先紧张', '白复习': '觉得白费', '浪费': '怕浪费',
    '落后': '怕落后', '身体感觉': '身体很难受', '被念头拉走': '容易走神', '被时间拉走': '被时间追着',
    '被外界拉走': '容易分心', '被身体拉走': '被紧张带走', '求完美': '想做到完美', '怕评价': '怕被评价',
    '硬撑': '想再撑一下', '奢侈感': '觉得是奢侈', '假装': '假装没事', '不够好': '觉得自己不够好',
    '否定情绪': '先否定情绪', '忽略': '想忽略它', '掩盖': '想盖住它', '挑剔身体': '对身材苛刻',
    '工具化': '把它当工具', '努力归因': '归因于不够努力', '不配休息': '觉得不配休息', '教练': '像位严师',
    '不庆祝': '很少庆祝', '赶路': '忙着赶下一件', '自我归咎': '归咎自己', '硬忍': '硬忍着',
    '放纵论': '觉得是放纵', '高频': '几乎每天', '压制': '常压下去', '零容错': '几乎不容错',
    '空想': '反复想', '假装忙': '做别的事', '逃离': '想逃开', '怕累': '怕自己太累',
    '怕批评': '怕被批评', '不值': '觉得不值得', '怕难受': '怕不舒服', '拖延': '想慢一点',
    '逃避': '想缓一缓', '回避': '先退一步', '焦虑': '有些在意', '担心': '有些担心', '恐惧': '有些害怕',
    '讨好': '常先照顾别人', '怕冲突': '想避免摩擦', '求认可': '在意别人的看法', '低自我价值': '常觉得自己不够',
    '反刍': '常回想过去', '比较': '常和自己比较', '完美': '对自己要求高', '回避冲突': '先缓一缓再说',
    '停滞': '暂时停住了', '倦怠': '有些透支了', '冷漠': '暂时没了感觉', '意义失落': '有些找不到意义',
    '觉醒': '正在重新思考', '探索期': '还在找方向', '重构期': '正在重新整理', '积累期': '正在慢慢扎根',
    '转型期': '正在酝酿变化', '探索者': '好奇的那一面', '创造者': '想把事情做成的那一面',
    '觉知者': '感受力强的那一面', '重构者': '敢推翻重来的那一面', '守护者': '想照顾人的那一面',
    '自由': '渴望自由', '联结': '渴望联结', '创造': '渴望创造', '安定': '渴望安定',
    '安全型': '比较安心', '焦虑型': '容易不安', '回避型': '习惯保持距离', '恐惧回避': '既想靠近又怕受伤',
    '苛责型': '对自己有点严格', '关怀型': '对自己比较温柔', '忽视型': '容易忽略自己', '回避型': '习惯先回避',
    '结果型': '比较在意结果', '时间型': '容易觉得来不及', '比较型': '容易和别人比', '身体型': '身体反应比较明显',
    '畏难型': '觉得任务太大', '意义型': '在找做它的意义', '反刍型': '容易回想', '焦虑型': '容易担心',
    '孤独型': '有时感到孤独', '灵感型': '灵感常在深夜', '成就型': '看重成就', '关系型': '看重关系',
    '直球型': '习惯有话直说', '委婉型': '习惯委婉表达', '沉默型': '习惯先沉默', '讨好型': '习惯先照顾',
    '低价值': '常觉得自己不配', '稳固型': '比较相信自己', '依附型': '依赖外界认可', '防御型': '习惯先保护自己',
    '焦虑方言': '常用焦虑说话', '愤怒方言': '常用愤怒说话', '悲伤方言': '常用悲伤说话', '麻木方言': '常用麻木说话',
    '冒险': '先冲出去', '稳健': '先看清楚', '审慎': '比较谨慎', '自我关怀': '先照顾自己',
    '行动优先': '先行动', '稳健优先': '先稳一稳', '双轨': '两条腿走路', 'allin': '全力以赴',
    '自护': '先护住自己', '求助': '寻求支持', '借力': '借别人一把力', '独立': '先靠自己'
  };

  function softenTag(tag) {
    if (!tag) return '';
    if (SOFTEN[tag]) return SOFTEN[tag];
    return tag;
  }

  var THEORY = {
    guan_archetype: '荣格原型理论 · 塔罗象征学',
    guan_stage: '心理发展阶段理论 · 过渡期心理学',
    guan_inneros: '认知心理学 · 决策科学',
    guan_relationship: '关系动力学 · 沟通心理学',
    guan_energy: '能量管理 · 积极心理学',
    guan_values: '价值澄清理论 · 存在主义心理学',
    guan_learning: '学习风格理论 · 认知通道研究',
    guan_academic: '学业压力研究 · 认知行为视角',
    guan_burnout: '职业倦怠理论（Maslach）',
    guan_pivot: '职业转型研究 · 决策心理学',
    guan_drain: '反刍思维研究 · 自我决定理论',
    guan_attachment: '依恋理论（Bowlby / Ainsworth）',
    guan_pleasing: '讨好型人格研究 · 自我分化理论',
    guan_boundary: '边界理论 · 家庭系统视角',
    guan_selfcare: '自我关怀研究（Kristin Neff）',
    guan_night: '睡眠心理学 · 反刍与情绪调节',
    guan_exam: '考试焦虑研究 · 认知行为视角',
    guan_procrastination: '拖延心理学（情绪调节模型）',
    guan_drive: '自我决定理论（Deci & Ryan）',
    guan_communication: '非暴力沟通 · 关系语言研究',
    guan_selfworth: '自我价值理论 · 自尊研究',
    guan_emotions: '情绪粒度研究 · 情绪功能观',
    guan_majorfit: '霍兰德职业兴趣理论（RIASEC）',
    guan_attention: '注意力研究 · 心流理论（Csikszentmihalyi）',
    guan_family: '原生家庭心理学 · 依恋与代际传递研究',
    guan_flow: '心流理论（Csikszentmihalyi）',
    guan_confidence: '自我效能理论（Bandura）',
    guan_workvalues: '工作价值观研究 · 职业发展理论',
    guan_careergap: '职业空窗期研究 · 生涯过渡理论',
    guan_identity: '身份发展理论（Erikson）',
    guan_resilience: '心理韧性研究（Masten）',
    guan_conflictrepair: '关系修复研究（Gottman）',
    guan_goodbye: '哀伤理论（Worden）',
    guan_gad7: 'GAD-7 焦虑筛查量表（Spitzer 等）',
    guan_phq9: 'PHQ-9 抑郁筛查量表（Kroenke 等）',
    guan_swls: '生活满意度量表 SWLS（Diener 等）',
    guan_ucla: 'UCLA 孤独感量表（Russell）',
    guan_bigfive: '大五人格模型（Costa & McCrae）· IPIP-NEO 公开量表',
    guan_custom: '整合你的档案、测试与记录'
  };
  var stepEl = document.getElementById('quizStep');
  var optionsEl = document.getElementById('quizOptions');
  var titleEl = document.getElementById('questionTitle');
  var barEl = document.getElementById('quizBar');
  var countEl = document.getElementById('quizCount');
  var nextBtn = document.getElementById('quizNext');
  var backBtn = document.getElementById('quizBack');
  var resultEl = document.getElementById('quizResult');
  var quizEl = document.getElementById('quizCard');
  var otherEl = null;

  function totalQuestions() {
    return QUIZ.questions.length;
  }

  function renderQuestion() {
    var q = QUIZ.questions[state.index];
    titleEl.textContent = (state.index + 1) + '. ' + q.q;
    optionsEl.innerHTML = '';
    var opts = q.options || (QUIZ.isBigFive ? [1,2,3,4,5].map(function (v) {
      return { text: ['非常不同意','不同意','中立','同意','非常同意'][v-1], value: v };
    }) : []);
    opts.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      var picked = state.answers[state.index] === i;
      if (picked) btn.classList.add('on');
      var html = '<span>' + (opt.text || opt) + '</span>';
      if (opt.tag) html += '<span class="opt-tag">' + softenTag(opt.tag) + '</span>';
      btn.innerHTML = html;
      btn.addEventListener('click', function () {
        pick(i);
      });
      optionsEl.appendChild(btn);
    });
    // "Other" input row
    var otherRow = document.createElement('div');
    otherRow.className = 'other-row';
    var otherInput = document.createElement('input');
    otherInput.type = 'text';
    otherInput.className = 'other-input';
    otherInput.placeholder = '或者，写下你自己的答案……';
    otherInput.maxLength = 120;
    otherInput.setAttribute('aria-label', '写下你自己的答案');
    var otherBtn = document.createElement('button');
    otherBtn.type = 'button';
    otherBtn.className = 'btn btn-sm other-btn';
    otherBtn.textContent = '写下我的答案';
    otherRow.appendChild(otherInput);
    otherRow.appendChild(otherBtn);
    optionsEl.appendChild(otherRow);
    otherEl = otherInput;
    otherInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submitOther(); }
    });
    otherBtn.addEventListener('click', submitOther);
    barEl.style.width = (state.index / totalQuestions() * 100) + '%';
    countEl.textContent = (state.index + 1) + ' / ' + totalQuestions();
    backBtn.style.visibility = state.index === 0 ? 'hidden' : 'visible';
    nextBtn.style.visibility = 'hidden';
    resultEl.classList.add('hidden');
    quizEl.classList.remove('hidden');
    quizEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function pick(i) {
    if (state.answers[state.index] && state.answers[state.index].option === i) return;
    state.answers[state.index] = { option: i };
    var btns = optionsEl.querySelectorAll('.option');
    btns.forEach(function (b, idx) { b.classList.toggle('on', idx === i); });
    if (otherEl) otherEl.value = '';
    nextBtn.style.visibility = 'visible';
    setTimeout(function () {
      if (state.index < totalQuestions() - 1) {
        state.index += 1;
        renderQuestion();
      } else {
        finish();
      }
    }, 420);
  }

  function submitOther() {
    var text = (otherEl ? otherEl.value : '').trim();
    if (!text) { window.guanToast('先写下点什么，一句话就好'); return; }
    state.answers[state.index] = { other: text };
    var btns = optionsEl.querySelectorAll('.option');
    btns.forEach(function (b) { b.classList.remove('on'); });
    nextBtn.style.visibility = 'visible';
    setTimeout(function () {
      if (state.index < totalQuestions() - 1) {
        state.index += 1;
        renderQuestion();
      } else {
        finish();
      }
    }, 420);
  }

  function computeResult() {
    if (QUIZ.isBigFive) return computeBigFive();
    if (QUIZ.scoring === 'sum' || QUIZ.scoring === 'swls' || QUIZ.scoring === 'ucla') return computeSum();
    if (QUIZ.scoring === 'inneros') return computeInnerOS();
    var scores = {};
    var resultKeys = Object.keys(QUIZ.results || {});
    if (!resultKeys.length) {
      // 复合型测试（results 为空）：从题目选项收集所有计分维度
      QUIZ.questions.forEach(function (q) {
        (q.options || []).forEach(function (o) {
          Object.keys(o.score || {}).forEach(function (k) { if (!(k in scores)) scores[k] = 0; });
        });
      });
    } else {
      resultKeys.forEach(function (k) { scores[k] = 0; });
    }
    state.answers.forEach(function (a, qi) {
      if (!a || a.option === undefined) return;
      var opt = QUIZ.questions[qi].options[a.option];
      var s = opt.score || {};
      Object.keys(s).forEach(function (k) { scores[k] += s[k] || 0; });
    });
    var sorted = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; });
    var primary = sorted[0];
    var secondary = sorted[1] || null;
    return { primary: primary, secondary: secondary, scores: scores };
  }

  function computeBigFive() {
    var dims = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    var counts = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    state.answers.forEach(function (a, qi) {
      if (a && a.option !== undefined) {
        var q = QUIZ.questions[qi];
        var v = a.option + 1;
        if (q.rev) v = 6 - v;
        dims[q.dim] += v;
        counts[q.dim]++;
      }
    });
    var avg = {};
    Object.keys(dims).forEach(function (k) {
      avg[k] = dims[k] / (counts[k] || 1);
    });
    return avg;
  }

  function computeSum() {
    var total = 0;
    state.answers.forEach(function (a, qi) {
      if (a && a.option !== undefined) {
        var opt = QUIZ.questions[qi].options[a.option];
        total += (opt.score && opt.score._) || 0;
      }
    });
    var tier = QUIZ.sumScale[0];
    for (var i = 0; i < QUIZ.sumScale.length; i++) {
      if (total <= QUIZ.sumScale[i].max) { tier = QUIZ.sumScale[i]; break; }
      tier = QUIZ.sumScale[i];
    }
    return { total: total, tier: tier };
  }

  function computeInnerOS() {
    var dims = {};
    QUIZ.dimensions.forEach(function (d) {
      dims[d.key] = {};
      d.modes.forEach(function (m) { dims[d.key][m] = 0; });
    });
    state.answers.forEach(function (a, qi) {
      if (!a || a.option === undefined) return;
      var opt = QUIZ.questions[qi].options[a.option];
      var s = opt.score || {};
      Object.keys(s).forEach(function (dim) {
        Object.keys(s[dim]).forEach(function (mode) {
          dims[dim][mode] += s[dim][mode];
        });
      });
    });
    var result = { dims: {}, modes: [] };
    QUIZ.dimensions.forEach(function (d) {
      var entries = Object.keys(dims[d.key]).map(function (m) {
        return { key: m, score: dims[d.key][m] };
      }).sort(function (a, b) { return b.score - a.score; });
      var chosen = entries[0];
      var tied = entries.length > 1 && entries[1].score === chosen.score;
      var mode = QUIZ.dimensionModes[d.key][chosen.key];
      result.dims[d.key] = {
        key: chosen.key,
        name: mode.name,
        en: mode.en,
        desc: mode.desc,
        note: mode.note,
        letter: mode.letter,
        tied: tied
      };
      result.modes.push({
        dimKey: d.key,
        dimName: d.name,
        mode: result.dims[d.key]
      });
    });
    return result;
  }

  function buildResultView() {
    quizEl.classList.add('hidden');
    resultEl.classList.remove('hidden');
    resultEl.innerHTML = '';

    if (QUIZ.key === 'guan_who') {
      renderWho();
    } else if (QUIZ.isBigFive) {
      renderBigFive();
    } else if (QUIZ.isStandard) {
      renderStandardSum();
    } else if (QUIZ.scoring === 'inneros') {
      renderInnerOS();
    } else {
      renderStandard();
    }
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  var WHO_TEXT = {
    proto: {
      '探索者': ['你与世界相处的方式，是「出发」——新的人、新的地方、新的可能，是你的氧气。你不是逃避，你是在用移动寻找答案。', '你的原型是探索者：你身上那股「想去看看」的劲，是很多人羡慕的自由。'],
      '创造者': ['你与世界相处的方式，是「创造」——想法在你手里会变成真的。你不是空想家，你是那个让世界多出一点东西的人。', '你的原型是创造者：你把「我想要」变成「我做到了」，这是你最扎实的底气。'],
      '觉知者': ['你与世界相处的方式，是「觉察」——你能看见别人看不见的细节，听懂没说出口的话。你的敏感不是负担，是你的天线。', '你的原型是觉知者：你看得深、听得懂，这份细腻让你与很多人的灵魂相连。'],
      '重构者': ['你与世界相处的方式，是「重构」——当旧的东西不再成立，你是那个敢拆掉重来的人。你的清醒，常常在别人还犹豫时已经看见了答案。', '你的原型是重构者：你敢于对旧生活说不，这份决断让你在动荡里反而最稳。'],
      '守护者': ['你与世界相处的方式，是「守护」——你让身边的人感到安心，你的温柔是很多人回家的理由。', '你的原型是守护者：你天生会照顾人，而当你也照顾自己，这份温柔会更有力量。']
    },
    stage: {
      '探索期': '你正处在探索期——别急着交卷，方向是试出来的，不是想出来的。',
      '重构期': '你正处在重构期——旧的地基在换，慢一点没关系，先稳住自己。',
      '积累期': '你正处在积累期——你在扎根，很多看不见的努力，正在悄悄变深。',
      '转型期': '你正处在转型期——旧路快到尽头了，新的方向正在酝酿，别怕。'
    },
    val: {
      '自由': '你最看重自由——它提醒你：为生活留一点「我说了算」的空间。',
      '联结': '你最看重联结——它提醒你：重要的不是数量，是那几个懂你的人。',
      '创造': '你最看重创造——它提醒你：你来到这世上，是想留下点什么。',
      '安定': '你最看重安定——它提醒你：稳定的生活不是平淡，是让你敢出发的基地。'
    },
    id: {
      '探索身份': '关于「你是谁」，你还在探索——这不是空白，是你在用心画自己的地图。',
      '角色身份': '关于「你是谁」，你较多通过角色定义自己——角色给了你位置，也别忘了角色之外的你。',
      '流动身份': '关于「你是谁」，你比较流动——你的丰富让你在不同场景都鲜活，试着找一个核心感受当锚。',
      '整合身份': '关于「你是谁」，你已经比较整合——你清楚自己要什么，这是长期探索的果实。'
    }
  };

  function renderWho() {
    var r = computeResult();
    var m = QUIZ._map(r);
    var html = resultCardHTML(starSVG(), '你如何成为我', '一份四维的自我画像', '', '');
    html += '<div class="result-sections">';
    html += '<div class="result-block wide"><h4>你的四维自我画像</h4>' +
      '<p><strong style="color:var(--gold-bright)">原型：</strong>' + WHO_TEXT.proto[m.proto][0] + '</p>' +
      '<p style="margin-top:10px"><strong style="color:var(--gold-bright)">阶段：</strong>' + WHO_TEXT.stage[m.stage] + '</p>' +
      '<p style="margin-top:10px"><strong style="color:var(--gold-bright)">价值：</strong>' + WHO_TEXT.val[m.val] + '</p>' +
      '<p style="margin-top:10px"><strong style="color:var(--gold-bright)">身份：</strong>' + WHO_TEXT.id[m.id] + '</p></div>';
    html += '<div class="result-block wide"><h4>把它们放在一起</h4><p>' +
      '所以，此刻的你可以被这样理解：你是一个以「' + m.proto + '」姿态与世界相处的人，正处在' + m.stage + '，心里最放不下的是「' + m.val + '」，而关于「我是谁」，你' +
      (m.id === '整合身份' ? '已经相当清楚。' : m.id === '探索身份' ? '还在慢慢探索。' : m.id === '角色身份' ? '更多通过角色认识自己。' : '处于一种流动之中。') +
      '这四个维度不是四个标签，而是你此刻生命的一幅快照——它们会变，而你也在变。</p></div>';
    html += '<div class="result-block wide"><h4>给你的第一句话</h4><p>' +
      WHO_TEXT.proto[m.proto][1] + ' ' + WHO_TEXT.stage[m.stage].replace('你正处在', '你正处在') + ' ' + WHO_TEXT.val[m.val].replace('它提醒你：', '它提醒你：') + '</p></div>';
    html += '</div>';
    html += actionsHTML('who', m.proto + ' · ' + m.stage + ' · ' + m.val, '');
    resultEl.innerHTML = html;
    var label = m.proto + ' · ' + m.stage + ' · ' + m.val;
    window.guanSet(QUIZ.key, label);
    bindResultActions(shareText(QUIZ.title, label, '我的四维自我画像'));
  }

  function renderBigFive() {
    var avg = computeResult();
    var html = resultCardHTML(starSVG(), '你的人格剖面', 'Big Five · 五维地图', '', '');
    html += '<div class="result-sections">';
    html += '<div class="result-block wide"><h4>五维人格剖面</h4><div class="bigfive-bars">' +
      QUIZ.dimensions.map(function (d) {
        var v = avg[d.key];
        var pct = Math.round((v - 1) / 4 * 100);
        var desc = v >= 3.7 ? '偏高' : v <= 2.3 ? '偏低' : '中等';
        return '<div class="bf-row"><div class="bf-head"><b>' + d.name + '</b><span>' + d.en + ' · ' + desc + '</span></div>' +
          '<div class="bf-bar"><i style="width:' + pct + '%"></i></div>' +
          '<em>' + v.toFixed(1) + '/5</em></div>';
      }).join('') + '</div></div>';
    html += '<div class="result-block wide"><h4>这意味着什么</h4><p>' +
      QUIZ.dimensions.map(function (d) {
        var v = avg[d.key];
        var word = v >= 3.7 ? '你在「' + d.name + '」这一面比较突出' : v <= 2.3 ? '你在「' + d.name + '」这一面偏内敛' : '你在「' + d.name + '」这一面比较均衡';
        return word + '：' + d.desc;
      }).join('</p><p>') + '</p></div>';
    html += '<div class="result-block wide"><h4>请记得</h4><p>大五人格不是标签，而是一张地图——它没有「好坏」，只有「特点」。每个维度的高与低，都对应不同的优势与需要留意的部分。</p></div>';
    html += '</div>';
    html += actionsHTML('bigfive', '人格剖面', '');
    resultEl.innerHTML = html;
    var label = QUIZ.dimensions.map(function (d) {
      return d.name + (avg[d.key] >= 3.7 ? '偏高' : avg[d.key] <= 2.3 ? '偏低' : '中等');
    }).join(' · ');
    window.guanSet(QUIZ.key, label);
    bindResultActions(shareText(QUIZ.title, label, '我的大五人格剖面'));
  }

  function renderStandardSum() {
    var r = computeResult();
    var tier = r.tier;
    var html = resultCardHTML(starSVG(), tier.name, '标准计分 ' + r.total + ' 分', '', '');
    html += '<div class="result-sections">';
    html += block('量表结果', '<p style="font-size:26px;color:var(--gold-bright);font-family:var(--serif)">' + r.total + ' / ' + (QUIZ.sumScale[QUIZ.sumScale.length - 1].max) + ' 分</p>', 'wide');
    html += block('这意味着什么', '<p>' + tier.desc + '</p>', 'wide');
    html += block('请记得', '<p>这份量表是自我觉察的工具，不是诊断。如果你感到困扰持续存在，请寻求专业心理支持——你值得被帮助。</p>', 'wide');
    if (r.total >= (QUIZ.scoring === 'phq9' ? 10 : QUIZ.scoring === 'gad7' ? 10 : 25)) {
      html += '<div class="crisis-note">你的得分提示你最近可能负担较重。如果情绪难以承受，请拨打心理援助热线 400-161-9995，或前往最近的精神卫生中心。</div>';
    }
    html += '</div>';
    html += actionsHTML(r.total + '分', tier.name, tier.desc);
    resultEl.innerHTML = html;
    window.guanSet(QUIZ.key, tier.name + '（' + r.total + '分）');
    bindResultActions(shareText(QUIZ.title, tier.name + '（' + r.total + '分）', tier.desc));
  }

  function resultCardHTML(iconSvg, title, en, chipSvg, chipText) {
    return '' +
      '<div class="result-hero">' +
      '  <div class="result-icon">' + iconSvg + '</div>' +
      '  <h2>' + title + '</h2>' +
      '  <div class="result-en">' + en + '</div>' +
      (chipText ? '<div class="tarot-chip">' + chipSvg + chipText + '</div>' : '') +
      '</div>';
  }

  function renderStandard() {
    var r = computeResult();
    var p = QUIZ.results[r.primary];
    var prof = profileData();
    var nickname = prof.nickname ? prof.nickname + '，' : '';
    var html = resultCardHTML(QUIZ.iconSVG || starSVG(), p.name, p.en, tarotSVG(), '塔罗象征 · ' + p.tarot);
    html += '<div class="result-sections">';
    if (THEORY[QUIZ.key]) {
      html += '<div class="theory-badge">专业依据 · ' + THEORY[QUIZ.key] + '</div>';
    }
    // 第 2 层：先复述用户的选择（真正的互动感）
    html += '<div class="result-block wide"><h4>你刚刚告诉我的</h4>' +
      '<p>' + nickname + '你选了几件很具体的事——让我先复述一下，确认我没有听错：</p>' +
      '<ul>' + echoPicks().map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>' +
      '<p style="margin-top:10px">这些答案不是随手勾的。它们连在一起，构成了我下面要对你说的判断。</p></div>';
    html += '<div class="result-block wide"><h4>核心特征</h4>' + personBlock('core', p) + '</div>';
    html += '<div class="result-block wide"><h4>内在冲突</h4>' + personBlock('conflict', p) + '</div>';
    html += '<div class="result-block wide"><h4>成长方向</h4>' + personBlock('growth', p) + '</div>';
    if (p.possibilities) {
      html += block('新的可能 · 你未曾想过的方向', listHTML(p.possibilities), 'wide');
    }
    var softActions = (p.actions || []).slice(0, 2);
    if (softActions.length) {
      html += block('如果愿意，可以轻轻试一步', listHTML(softActions), 'wide');
    }
    html += block('今日一问', '<p>' + p.question + '</p>' +
      '<p style="margin-top:12px"><a class="btn btn-gold btn-sm" href="growth.html">把这一刻记下来 →</a></p>', 'wide');
    if (p.letter) {
      html += renderLetter(p.letter);
    }
    var insightList = collectInsights();
    if (insightList.length) {
      html += block('属于你的个性化解读', listHTML(insightList), 'wide');
    }
    html += '</div>';
    html += actionsHTML(r.primary, p.name, p.core);
    resultEl.innerHTML = html;
    window.guanSet(QUIZ.key, p.name);
    bindResultActions(shareText(r.primary, p.name, p.core));
  }

  function renderInnerOS() {
    var r = computeResult();
    var summary = '你的内在系统由 ' + r.modes.map(function (m) { return '「' + m.mode.name + '」' + m.dimName; }).join('、') + ' 组成。';
    var version = r.modes.map(function (m) { return m.mode.en; }).join(' · ');
    var html = resultCardHTML(QUIZ.iconSVG || starSVG(), '系统已识别', 'Inner OS v1.0', chipSVG(), '系统版本 · ' + version);
    html += '<div class="result-sections">';
    html += block('系统概况', summary, 'wide');
    html += '<div class="result-block wide"><h4>四维详情</h4>';
    r.modes.forEach(function (m) {
      html += '<div class="dimension-row">';
      html += '<h5>' + m.dimName + ' · ' + m.mode.name + (m.mode.tied ? '（处于交界）' : '') + '</h5>';
      html += '<p>' + m.mode.desc + '</p>';
      if (m.mode.note) html += '<p style="margin-top:6px">' + m.mode.note + '</p>';
      if (m.mode.letter) html += '<p style="margin-top:10px;color:var(--gold-bright)">给此刻的你：' + m.mode.letter + '</p>';
      html += '</div>';
    });
    html += '</div>';
    html += block('升级建议', listHTML(QUIZ.upgrade || []), 'wide');
    html += block('每日维护', QUIZ.maintenance || '', 'wide');
    var letterText = '你身上同时住着「' + r.modes.map(function (m) { return m.mode.name; }).join('」「') + '」。它们不是四个标签，而是你与世界的四种相处方式：你如何接收信息，如何做决定，如何安放情绪，如何长大。' +
      (r.modes[0] ? '其中，' + r.modes[0].mode.name + '是你最熟悉也最常用的那一面——它帮过你很多，也偶尔让你疲惫。这不是需要修理的缺陷，而是你独特的形状。' : '') +
      '请记得：系统测试不是为了给版本号，而是为了让你知道——你本来就是一个完整而独特的系统，只是过去没有人这样告诉你。';
    html += renderLetter(letterText);
    var insightList = collectInsights();
    if (insightList.length) {
      html += block('属于你的个性化解读', listHTML(insightList), 'wide');
    }
    html += '</div>';
    html += actionsHTML('inneros', summary);
    resultEl.innerHTML = html;
    window.guanSet(QUIZ.key, r.modes.map(function (m) { return m.mode.name; }).join(' · '));
    bindResultActions(shareText('inneros', '「' + summary + '」', ''));
  }

  function collectInsights() {
    var list = [];
    if (!QUIZ.insights || !QUIZ.insights.length) return list;
    QUIZ.insights.forEach(function (ins) {
      var hit = ins.match.every(function (m) {
        return state.answers[m.q] && state.answers[m.q].option === m.option;
      });
      if (hit) list.push(ins.text);
    });
    return list;
  }

  function collectOthers() {
    var list = [];
    state.answers.forEach(function (a, qi) {
      if (a && a.other) {
        var q = QUIZ.questions[qi];
        var text = a.other;
        var interpretation = interpretOther(text);
        list.push('关于「' + q.q.slice(0, 22) + (q.q.length > 22 ? '…' : '') + '」，你写下了：「' + text + '」。' + interpretation);
      }
    });
    return list.slice(0, 5);
  }

  function collectPath() {
    var list = [];
    state.answers.forEach(function (a, qi) {
      if (!a) return;
      var q = QUIZ.questions[qi];
      if (a.option !== undefined) {
        var opt = q.options[a.option];
        if (opt) {
          var brief = opt.text.replace(/^我有时会——/, '').slice(0, 16);
          list.push('你选了「' + brief + (opt.text.length > 16 ? '…' : '') + '」——这一笔，其实在替你说出一句没来得及说出口的话。');
        }
      }
    });
    return list.slice(0, 5);
  }

  // 复述用户的选择（用于结果开头，产生「被听见」感）
  function echoPicks() {
    var list = [];
    state.answers.forEach(function (a, qi) {
      if (!a) return;
      var q = QUIZ.questions[qi];
      if (a.option !== undefined && q && q.options && q.options[a.option]) {
        var opt = q.options[a.option];
        list.push('在「' + q.q.slice(0, 14) + (q.q.length > 14 ? '…' : '') + '」上，你选择了「' + opt.text.slice(0, 18) + (opt.text.length > 18 ? '…' : '') + '」');
      } else if (a.other) {
        list.push('你还写下了自己的答案：「' + a.other.slice(0, 24) + (a.other.length > 24 ? '…' : '') + '」');
      }
    });
    return list.slice(0, 4);
  }

  function interpretOther(text) {
    var response = '';
    if (/累|撑不住|坚持不了|不行了|想放弃/.test(text)) {
      response = '这句话里藏着很真实的疲惫。能写出来，说明你已经在诚实面对自己了——这不是失败，是你在给自己一个停下来的许可。';
    } else if (/怕|担心|不敢|害怕|焦虑/.test(text)) {
      response = '你提到的这份害怕，不是弱点，而是你认真对待这件事的证据。我们往往只害怕真正在意的东西。';
    } else if (/迷茫|不知道|没方向|找不到|不确定/.test(text)) {
      response = '不确定不是空白，而是答案正在成形前的那段时间。你不需要现在就知道全部，只需要允许自己先「不知道」。';
    } else if (/想|希望|渴望|期待|愿意|想要/.test(text)) {
      response = '这句话里有一个很重要的信号：你心里有渴望。渴望不是贪心，它是你生命力的指针——请认真听它，哪怕它现在还很轻。';
    } else if (/开心|喜欢|高兴|幸福|平静|好/.test(text)) {
      response = '你写下的这个感受值得被记住。它提醒你：即使生活忙碌，你的心里也有地方是亮的——那里，就是你需要更多前往的地方。';
    } else if (/人|关系|朋友|家人|伴侣|ta/.test(text)) {
      response = '你提到的关系，是你此刻真正在意的一部分。关系里的感受常常没有对错，只有「被看见」与「没被看见」——你愿意把它写下来，已经是在照顾自己了。';
    } else if (/工作|学习|考试|作业|职业|转行|上班/.test(text)) {
      response = '你提到的这件事，占据了你很多的注意力和能量。它对你的意义，也许不止于表面——试着问自己：在这件事里，我真正想要的是什么？';
    } else {
      response = '这句话是你自己的语言，不是任何选项能替代的。它比任何标准答案都更接近真实的你——请把它留在心里，下次记录时再回头看看，它会告诉你更多。';
    }
    return response;
  }

  function renderLetter(text) {
    return '<div class="result-block wide result-letter">' +
      '<div class="letter-date">来自观己实验室</div>' +
      '<h4 style="font-family:var(--serif);font-size:17px;letter-spacing:.1em;color:var(--gold-bright);margin:8px 0 12px">给此刻的你 · 一封信</h4>' +
      '<p style="color:var(--muted);font-size:14.5px;line-height:2">亲爱的你：</p>' +
      '<p style="color:var(--muted);font-size:14.5px;line-height:2;margin-top:8px">' + text + '</p>' +
      '<p style="color:var(--gold-bright);font-family:var(--serif);letter-spacing:.12em;margin-top:14px">—— 观己实验室，随时欢迎你回来</p>' +
      '</div>';
  }

  function block(title, body, cls) {
    var wide = cls === 'wide' ? ' wide' : '';
    var bodyHTML = typeof body === 'string' ? '<p>' + body + '</p>' : body;
    return '<div class="result-block' + wide + '"><h4>' + title + '</h4>' + bodyHTML + '</div>';
  }

  function profileData() {
    try {
      return JSON.parse(window.guanGet('guan_profile') || '{}');
    } catch (e) {
      return {};
    }
  }

  function testResult(key) {
    return localStorage.getItem(key) || '';
  }

  function deepParagraph(text) {
    return '<p style="margin-bottom:12px">' + text + '</p>';
  }

  // 个性化结果：每个板块 = 该结果独有的文本 + 基于你的选择与档案的呼应（不与其他测试雷同）
  function personBlock(kind, p) {
    var prof = profileData();
    var paras = [];
    var text = kind === 'core' ? p.core : kind === 'conflict' ? p.conflict : p.growth;
    paras.push(text);

    // 呼应用户的真实选择（从答案里挑一两个）
    var picks = [];
    state.answers.forEach(function (a, qi) {
      if (a && a.option !== undefined && picks.length < 2) {
        var opt = QUIZ.questions[qi] && QUIZ.questions[qi].options[a.option];
        if (opt) picks.push(opt.text.replace(/^我有时会——/, '').slice(0, 14));
      }
    });
    if (picks.length) {
      paras.push('你在作答时选择了「' + picks.join('」「') + '」——这和你' + (kind === 'conflict' ? '内在的拉扯' : kind === 'growth' ? '想去的方向' : '本来的样子') + '是连在一起的：它不是随手的勾选，而是你心里早已有过的声音。');
    }
    // 引用用户自定义输入（若有）
    state.answers.forEach(function (a) {
      if (a && a.other && kind === 'growth') {
        paras.push('你还写下了自己的答案：「' + a.other + '」。这句话比任何选项都更接近真实的你——上面的成长方向，就是顺着这句话展开的。');
      }
    });

    // 融入档案（星座/八字/阶段/自我描述）
    if (kind === 'core' && prof.zodiac) {
      paras.push('你出生在' + prof.zodiac + '的时节。星座不是命运，但它像一门古老的语言，帮你辨认自己身上本来就有的质地——而这份质地，和上面的描述暗暗呼应。');
    }
    if (kind === 'conflict' && prof.selfDesc) {
      paras.push('你在档案里写道：「' + prof.selfDesc.slice(0, 30) + (prof.selfDesc.length > 30 ? '…' : '') + '」。这份诚实，恰恰是理解这个冲突最好的钥匙——它说明你已经准备好面对它了。');
    }
    if (kind === 'growth' && prof.bazi) {
      paras.push('你的八字排盘是「' + prof.bazi + '」。命理不替你决定方向，但它提醒你：你带着自己的时区走到今天。成长不必追上别人的季节，按你自己的时区来就好。');
    }
    if (kind === 'growth' && prof.stage) {
      paras.push('你正在' + prof.stage.split(' · ')[0] + '——这个阶段的功课，不是和别的阶段比速度，而是完成这个阶段该完成的事。');
    }
    if (prof.focus && kind === 'growth') {
      paras.push('你写下的探索议题是「' + prof.focus + '」——上面说的成长方向，恰好可以成为这个议题的第一步落点。');
    }
    return paras.map(deepParagraph).join('');
  }

  function listHTML(items) {
    if (!items || !items.length) return '';
    return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
  }

  function actionsHTML(label, summary, core) {
    return '' +
      '<div class="result-actions">' +
      '  <button type="button" class="btn btn-gold" data-share>分享这一刻</button>' +
      '  <button type="button" class="btn btn-ai" data-ai-deep>✨ AI 深度解读</button>' +
      '  <button type="button" class="btn" data-restart>重新测试</button>' +
      '  <a class="btn" href="tests.html">返回测试中心</a>' +
      '</div>' +
      keepTalkingHTML() +
      '<div class="deep-reading" id="deepReading" style="display:none"></div>' +
      aiKeyModalHTML() +
      (label && label !== 'inneros' ? '<div class="share-modal" id="shareModal">' +
      '  <div class="share-card" id="shareCard">' +
      '    <div class="share-logo">' + (window.guanProfile && window.guanProfile().nickname ? window.guanProfile().nickname : '观己者') + ' · ' + QUIZ.title + '</div>' +
      '    <div class="share-big">' + (typeof label === 'string' && label.indexOf('inneros') > -1 ? summary : (summary || label)) + '</div>' +
      '    <div class="share-quote">理解自己，设计人生</div>' +
      '    <div class="share-foot">观己实验室 · SELF INSIGHT LAB</div>' +
      '  </div>' +
      '  <div class="share-actions">' +
      '    <button type="button" class="btn btn-gold btn-sm" data-share-download>保存卡片</button>' +
      '    <button type="button" class="btn btn-sm" data-share-close>关闭</button>' +
      '  </div>' +
      '</div>' : '') +
      (QUIZ.category ? crisisHTML(QUIZ.category) : '');
  }

  function aiKeyModalHTML() {
    return '<div class="ai-modal" id="aiKeyModal" style="display:none">' +
      '  <div class="ai-modal-card">' +
      '    <h4>开启 AI 深度解读</h4>' +
      '    <p class="ai-modal-desc">解读会基于你刚刚的全部回答、你的档案与命盘，由 AI 为你一个人生成。选择一家你已有 Key 的服务，Key 只保存在这台设备。</p>' +
      '    <div class="form-field"><label>选择 AI 服务</label>' +
      '      <select id="aiProvider">' +
      '        <option value="openai">OpenAI（需付费额度）</option>' +
      '        <option value="gemini">Google Gemini（有免费额度）</option>' +
      '        <option value="deepseek">DeepSeek（价格低）</option>' +
      '      </select></div>' +
      '    <div class="form-field"><label id="aiKeyLabel">API Key</label>' +
      '      <input type="password" id="aiKeyInput" placeholder="sk-..." autocomplete="off"></div>' +
      '    <p class="ai-key-hint" id="aiKeyHint">如何获取：</p>' +
      '    <label class="ai-keep"><input type="checkbox" id="aiKeyKeep" checked> 记住在这台设备上</label>' +
      '    <p class="ai-warn">Key 仅存本机、仅用于本次请求。正式产品应改用服务端代理。</p>' +
      '    <div class="ai-modal-actions">' +
      '      <button type="button" class="btn btn-gold btn-sm" data-ai-confirm>开始解读</button>' +
      '      <button type="button" class="btn btn-sm" data-ai-cancel>取消</button>' +
      '    </div>' +
      '  </div>' +
      '</div>';
  }

  // 结果后「继续对话」：基于结果精准推荐 1 个相关测试 + 追问（替代全部推荐）
  function keepTalkingHTML() {
    var r = computeResult();
    var key = r && r.primary ? r.primary : (r.tier ? r.tier.name : '');
    var rec = relatedTest(QUIZ.key, key);
    var followups = followupsFor(QUIZ.key, key);
    return '<div class="keep-talking">' +
      '<h4>再往下走一步</h4>' +
      (rec ? '<div class="kt-rec"><b>既然你' + (rec.reason || '）') + '，去这里看看会更完整：</b>' +
        '<a href="' + rec.href + '" class="btn btn-gold btn-sm">' + rec.label + ' →</a></div>' : '') +
      (followups.length ? '<div class="kt-followups"><b>如果你想继续聊聊自己：</b>' +
        followups.map(function (f) { return '<button type="button" class="btn btn-sm" data-followup>' + f + '</button>'; }).join('') +
        '</div>' : '') +
      '<p class="kt-note">选一个追问，或直接去推荐的测试——这次探索不用停在这里。</p>' +
      '</div>';
  }

  var RELATED = {
    guan_archetype: [
      { key: '探索者', test: 'guan_stage', href: 'test-life-stage.html', label: '你现在走到的季节', reason: '看见了自己的原型，下一步值得看看自己正处在哪个季节' },
      { key: '创造者', test: 'guan_flow', href: 'test-flow.html', label: '什么让我忘记时间', reason: '创造者的能量，需要知道它流向哪里' },
      { key: '觉知者', test: 'guan_emotions', href: 'test-emotions.html', label: '你的情绪语言', reason: '觉知者的敏感，需要用情绪语言来安放' },
      { key: '重构者', test: 'guan_burnout', href: 'test-burnout.html', label: '当工作开始抽干你', reason: '重构者的疲惫，常常来自旧结构的拉扯' },
      { key: '守护者', test: 'guan_boundary', href: 'test-boundary.html', label: '你的门与墙', reason: '守护者最需要学习的，是边界' }
    ],
    guan_drain: [
      { key: '反刍型', test: 'guan_goodbye', href: 'test-goodbye.html', label: '告别之后', reason: '反复回想，往往和没有完成的告别有关' },
      { key: '比较型', test: 'guan_confidence', href: 'test-confidence.html', label: '我相信自己能做到什么', reason: '比较的背后，是自信地图上的一块暗区' },
      { key: '完美型', test: 'guan_selfcare', href: 'test-selfcare.html', label: '你如何对待自己', reason: '完美主义的钥匙，藏在你对自己的话里' },
      { key: '讨好型', test: 'guan_pleasing', href: 'test-pleasing.html', label: '不必讨好也值得被爱', reason: '讨好的模式，值得单独被看见' }
    ],
    guan_burnout: [
      { key: '疲惫耗竭', test: 'guan_energy', href: 'test-energy.html', label: '今天的电量', reason: '先看看你的电量还剩多少' },
      { key: '冷漠疏离', test: 'guan_selfcare', href: 'test-selfcare.html', label: '你如何对待自己', reason: '麻木的时候，最需要听见对自己的话' },
      { key: '意义失落', test: 'guan_workvalues', href: 'test-workvalues.html', label: '工作对你意味着什么', reason: '意义感的丢失，和工作的坐标有关' },
      { key: '觉醒转型', test: 'guan_pivot', href: 'test-pivot.html', label: '换一条路之前', reason: '觉醒期最需要的，是换路前的准备' }
    ],
    guan_attachment: [
      { key: '焦虑型', test: 'guan_selfworth', href: 'test-selfworth.html', label: '你配得上什么', reason: '焦虑的底层，常常是「我配吗」' },
      { key: '回避型', test: 'guan_boundary', href: 'test-boundary.html', label: '你的门与墙', reason: '回避的背后，是一堵很高的墙' },
      { key: '恐惧回避', test: 'guan_pleasing', href: 'test-pleasing.html', label: '不必讨好也值得被爱', reason: '既想靠近又怕受伤，和讨好模式常常交织' }
    ]
  };

  function relatedTest(quizKey, resultKey) {
    var list = RELATED[quizKey];
    if (!list) return null;
    var hit = list.filter(function (x) { return x.key === resultKey; })[0];
    return hit || list[0];
  }

  function followupsFor(quizKey, resultKey) {
    var map = {
      guan_archetype: ['「我这样的姿态，最早是从什么时候开始的？」', '「如果换一种姿态，我会先失去什么？」', '「我最想把这个原型用在哪个场景里？」'],
      guan_drain: ['「这个声音，最早是谁对我说的？」', '「如果今天允许自己松手一样东西，会是什么？」'],
      guan_burnout: ['「如果休息不是逃避，我敢不敢先停下来一天？」', '「这份工作里，还有什么是值得留下的？」'],
      guan_attachment: ['「我最早在谁身上学会了这样靠近？」', '「如果我允许自己慢慢来，最怕发生什么？」']
    };
    return map[quizKey] || ['「这个结果里，最戳中我的是哪一句？」'];
  }

  function followupHints() {
    var map = {
      guan_archetype: [
        '试着回想：最早让你觉得「这样做是对的」的那个时刻。那个时刻里，藏着你现在姿态的来处。',
        '把它写下来。你会发现，你害怕失去的东西，恰恰是你在旧姿态里一直保护的东西。',
        '不是所有场景都需要同一种姿态。认出「哪里它最有用」，就是你开始自由使用它的地方。'
      ],
      guan_drain: [
        '也许不是任何人对你说过，而是你很久以前为了保护自己，自己学会的。它不是你的敌人，它是旧日的你。',
        '选最小的那一样。松手不是失去，是给手腾出空间。'
      ],
      guan_burnout: [
        '把「休息」从任务清单之外挪进任务清单里，它才可能真正发生。',
        '哪怕只有一件。它是你接下来选择的地基。'
      ],
      guan_attachment: [
        '也许是父母，也许是某段重要的关系。看见来处，不是责怪，是理解。',
        '把它说出来。恐惧一旦被命名，就不再有那么大力量。'
      ]
    };
    return map[QUIZ.key] || ['这个问题没有标准答案，但它值得你给自己十分钟。'];
  }

  // ---------- AI 深度解读 ----------
  var AI_PROVIDERS = {
    openai: {
      label: 'OpenAI',
      keyHint: '在 platform.openai.com → API keys 创建。注意：OpenAI 需要账户有余额，余额为 0 时会失败。',
      placeholder: 'sk-...'
    },
    gemini: {
      label: 'Google Gemini',
      keyHint: '在 aistudio.google.com/app/apikey 免费创建（有免费额度，适合个人使用）。',
      placeholder: 'AIza...'
    },
    deepseek: {
      label: 'DeepSeek',
      keyHint: '在 platform.deepseek.com → API keys 创建。价格很低，适合个人使用。',
      placeholder: 'sk-...'
    }
  };

  function aiKeyFor(provider) {
    return localStorage.getItem('guan_ai_key_' + provider) || '';
  }

  function openAiDeep() {
    var modal = resultEl.querySelector('#aiKeyModal');
    var providerSel = resultEl.querySelector('#aiProvider');
    var saved = aiKeyFor(providerSel.value);
    var input = resultEl.querySelector('#aiKeyInput');
    if (input) {
      input.value = saved;
    }
    updateAiProviderUI();
    modal.style.display = 'flex';
  }

  function updateAiProviderUI() {
    var providerSel = resultEl.querySelector('#aiProvider');
    var p = AI_PROVIDERS[providerSel.value];
    var input = resultEl.querySelector('#aiKeyInput');
    var label = resultEl.querySelector('#aiKeyLabel');
    var hint = resultEl.querySelector('#aiKeyHint');
    var saved = aiKeyFor(providerSel.value);
    if (label) label.textContent = p.label + ' API Key';
    if (input) {
      input.placeholder = saved ? '已保存，可直接开始（' + saved.slice(0, 6) + '…）' : p.placeholder;
    }
    if (hint) hint.textContent = p.keyHint;
  }

  function runAiDeep() {
    var providerSel = resultEl.querySelector('#aiProvider');
    var provider = providerSel ? providerSel.value : 'openai';
    var input = resultEl.querySelector('#aiKeyInput');
    var keep = resultEl.querySelector('#aiKeyKeep');
    var key = (input && input.value.trim()) || aiKeyFor(provider) || '';
    if (!key) {
      window.guanToast('请先填入你的 API Key');
      return;
    }
    if (keep && keep.checked) {
      localStorage.setItem('guan_ai_key_' + provider, key);
    }
    resultEl.querySelector('#aiKeyModal').style.display = 'none';

    var readingBox = resultEl.querySelector('#deepReading');
    readingBox.style.display = 'block';
    readingBox.innerHTML = '<div class="deep-loading"><div class="spinner"></div><h4>正在倾听你的故事…</h4><p>AI 正在读你刚才的每一个回答，并把它和你的人生地图放在一起看。</p></div>';
    readingBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

    var prompt = buildAiPrompt();
    callChat(provider, key, prompt).then(function (text) {
      renderDeepReading(text);
    }).catch(function (err) {
      readingBox.innerHTML = '<div class="deep-error"><h4>解读没有完成</h4><p>' + (err && err.message ? err.message : '网络或服务异常，请稍后重试。') + '</p>' +
        '<p class="deep-error-hint">如果是 Key 无效，请检查后重试；如果一直失败，可以稍后再试。</p></div>';
    });
  }

  function buildAiPrompt() {
    var prof = profileData();
    // 收集用户的真实回答（题目 + 选项原文）
    var answers = [];
    state.answers.forEach(function (a, qi) {
      if (!a) return;
      var q = QUIZ.questions[qi];
      if (a.option !== undefined && q && q.options && q.options[a.option]) {
        answers.push('Q' + (qi + 1) + '「' + q.q + '」→ 我选了「' + q.options[a.option].text + '」');
      } else if (a.other) {
        answers.push('Q' + (qi + 1) + '「' + q.q + '」→ 我自己写了「' + a.other + '」');
      }
    });
    var profLines = [];
    if (prof.nickname) profLines.push('称呼：' + prof.nickname);
    if (prof.zodiac) profLines.push('星座：' + prof.zodiac);
    if (prof.bazi) profLines.push('八字（近似）：' + prof.bazi);
    if (prof.moon) profLines.push('月亮星座（近似）：' + prof.moon);
    if (prof.stage) profLines.push('人生阶段：' + prof.stage);
    if (prof.selfDesc) profLines.push('TA对自己的描述：' + prof.selfDesc);
    if (prof.focus) profLines.push('TA想探索的议题：' + prof.focus);

    return {
      role: 'system',
      content: '你是「观己实验室」的深度解读者。你融合东方智慧、哲学与心理学的视角，但不是算命师、不是心理治疗师、更不是说教者。你的任务：基于用户刚刚在「' + QUIZ.title + '」中给出的每一个真实回答，以及TA的档案信息，写一段真正属于TA的深度解读。' +
        '要求：1）至少引用 2-3 个用户的具体回答原文，让TA感到被听见；2）把星座/八字等作为「象征语言」而非命运断言，与TA的回答交织在一起谈；3）不贴标签、不武断下结论；4）语言温暖、有画面、有共鸣，像一位懂TA的老朋友在深夜慢慢说话；5）给出 1-2 个具体、轻柔、可做的下一步，不命令；6）全文 800-1200 字，用中文，分 4-6 段。'
    };
  }

  function callChat(provider, key, sysPrompt) {
    var userText = buildAiUserText();
    if (provider === 'gemini') {
      return callGemini(key, sysPrompt.content, userText);
    }
    if (provider === 'deepseek') {
      return callDeepSeek(key, sysPrompt.content, userText);
    }
    return callOpenAI(key, sysPrompt.content, userText);
  }

  function callOpenAI(key, sys, user) {
    return fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: user }
        ],
        max_tokens: 1600,
        temperature: 0.8
      })
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (data) {
          var msg = (data && data.error && data.error.message) || ('请求失败（' + res.status + '）');
          throw new Error(msg);
        });
      }
      return res.json();
    }).then(function (data) {
      var text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!text) throw new Error('没有收到解读内容，请重试。');
      return text.trim();
    });
  }

  function callGemini(key, sys, user) {
    return fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: sys + '\n\n以下是用户的回答：\n' + user }] }
        ],
        generationConfig: { maxOutputTokens: 1600, temperature: 0.8 }
      })
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (data) {
          var msg = (data && data.error && data.error.message) || ('请求失败（' + res.status + '）');
          throw new Error(msg);
        });
      }
      return res.json();
    }).then(function (data) {
      var text = data && data.candidates && data.candidates[0] && data.candidates[0].content &&
        data.candidates[0].content.parts && data.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('');
      if (!text) throw new Error('没有收到解读内容，请重试。');
      return text.trim();
    });
  }

  function callDeepSeek(key, sys, user) {
    return fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: user }
        ],
        max_tokens: 1600,
        temperature: 0.8
      })
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (data) {
          var msg = (data && data.error && data.error.message) || ('请求失败（' + res.status + '）');
          throw new Error(msg);
        });
      }
      return res.json();
    }).then(function (data) {
      var text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!text) throw new Error('没有收到解读内容，请重试。');
      return text.trim();
    });
  }

  function buildAiUserText() {
    var prof = profileData();
    var lines = ['我刚刚完成了「' + QUIZ.title + '」这个测试。以下是我对每一题的诚实回答：', ''];
    state.answers.forEach(function (a, qi) {
      if (!a) return;
      var q = QUIZ.questions[qi];
      if (a.option !== undefined && q && q.options && q.options[a.option]) {
        lines.push((qi + 1) + '. ' + q.q + ' → 我选了：「' + q.options[a.option].text + '」');
      } else if (a.other) {
        lines.push((qi + 1) + '. ' + q.q + ' → 我自己写了：「' + a.other + '」');
      }
    });
    lines.push('', '关于我自己的一些信息：');
    if (prof.nickname) lines.push('- 可以叫我：' + prof.nickname);
    if (prof.zodiac) lines.push('- 星座：' + prof.zodiac);
    if (prof.bazi) lines.push('- 八字（近似）：' + prof.bazi);
    if (prof.moon) lines.push('- 月亮星座（近似）：' + prof.moon);
    if (prof.stage) lines.push('- 我处在：' + prof.stage);
    if (prof.selfDesc) lines.push('- 我对自己说：' + prof.selfDesc);
    if (prof.focus) lines.push('- 我最想探索：' + prof.focus);
    lines.push('', '请根据以上内容，给我一段只属于我的深度解读。');
    return lines.join('\n');
  }

  function renderDeepReading(text) {
    var box = resultEl.querySelector('#deepReading');
    var paras = text.split(/\n{2,}/).map(function (p) {
      return '<p>' + p.replace(/^[-*]\s+/g, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</p>';
    }).join('');
    box.innerHTML = '<div class="deep-result">' +
      '<div class="deep-head"><h4>你的专属深度解读</h4><span>由 AI 基于你的回答生成 · 仅供参考</span></div>' +
      '<div class="deep-body">' + paras + '</div>' +
      '<div class="deep-actions"><button type="button" class="btn btn-gold btn-sm" data-deep-copy>复制这段解读</button>' +
      '<a class="btn btn-sm" href="growth.html">记入成长轨迹</a></div>' +
      '<p class="deep-note">解读由 AI 生成，观点不构成专业建议。如果它让你感到被理解，很好；如果哪里说得不对，请相信你自己的感受。</p>' +
      '</div>';
    var copyBtn = box.querySelector('[data-deep-copy]');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      window.guanCopy(text, function (ok) {
        window.guanToast(ok ? '解读已复制' : '复制失败');
      });
    });
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function crisisHTML(cat) {
    var note = '';
    if (cat === 'relation') {
      note = '如果在关系中你正在经历伤害、暴力或持续的恐惧，请优先保护自己：拨打 12338（全国妇联维权热线）或 110。';
    } else if (cat === 'self') {
      note = '如果你此刻有持续的自伤念头，请别一个人扛：拨打心理援助热线 400-161-9995，或前往最近的精神卫生中心。';
    } else if (cat === 'career') {
      note = '如果你因为职业压力长期失眠、情绪持续低落，请记得：工作值得被认真对待，但你的身心健康永远排在它前面。可以拨打心理援助热线 400-161-9995 寻求支持。';
    } else {
      note = '如果你此刻感到难以承受，请拨打心理援助热线 400-161-9995——有人愿意听你说话。';
    }
    return '<div class="crisis-note">' + note + '</div>';
  }

  function bindResultActions(share) {
    var shareBtn = resultEl.querySelector('[data-share]');
    var restartBtn = resultEl.querySelector('[data-restart]');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        var modal = resultEl.querySelector('#shareModal');
        if (modal) modal.classList.add('show');
      });
    }
    var closeBtn = resultEl.querySelector('[data-share-close]');
    if (closeBtn) closeBtn.addEventListener('click', function () {
      resultEl.querySelector('#shareModal').classList.remove('show');
    });
    var dlBtn = resultEl.querySelector('[data-share-download]');
    if (dlBtn) dlBtn.addEventListener('click', function () {
      var card = resultEl.querySelector('#shareCard');
      if (card && window.html2canvas) {
        window.html2canvas(card, { backgroundColor: '#0a0f1c', scale: 2 }).then(function (canvas) {
          var a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = 'guanji-share.png';
          a.click();
          window.guanToast('分享卡片已保存');
        });
      } else {
        window.guanCopy(share, function (ok) {
          window.guanToast(ok ? '已复制分享文字' : '复制失败');
        });
      }
    });
    resultEl.querySelectorAll('[data-followup]').forEach(function (btn, idx) {
      btn.addEventListener('click', function () {
        var sections = resultEl.querySelector('.result-sections');
        if (!sections) return;
        var box = resultEl.querySelector('#followupAnswer');
        if (!box) {
          box = document.createElement('div');
          box.id = 'followupAnswer';
          box.className = 'result-block wide followup-box';
          sections.appendChild(box);
        }
        var hints = followupHints();
        box.innerHTML = '<h4>关于这个问题，我想对你说</h4><p>' + (hints[idx] || '这个问题没有标准答案——但它值得你给自己十分钟，认真想一想。') + '</p>' +
          '<p style="margin-top:10px"><a class="btn btn-gold btn-sm" href="growth.html">把答案记下来 →</a></p>';
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
    // AI 深度解读
    var aiBtn = resultEl.querySelector('[data-ai-deep]');
    if (aiBtn) aiBtn.addEventListener('click', openAiDeep);
    var aiConfirm = resultEl.querySelector('[data-ai-confirm]');
    if (aiConfirm) aiConfirm.addEventListener('click', runAiDeep);
    var aiCancel = resultEl.querySelector('[data-ai-cancel]');
    if (aiCancel) aiCancel.addEventListener('click', function () {
      resultEl.querySelector('#aiKeyModal').style.display = 'none';
    });
    var aiProviderSel = resultEl.querySelector('#aiProvider');
    if (aiProviderSel) aiProviderSel.addEventListener('change', updateAiProviderUI);
    if (restartBtn) {
      restartBtn.addEventListener('click', function () {
        state.answers = new Array(QUIZ.questions.length).fill(null);
        state.index = 0;
        renderQuestion();
      });
    }
  }

  function shareText(label, name, core) {
    var head = '我在「观己实验室」完成了' + QUIZ.title + '。';
    var line = QUIZ.scoring === 'inneros'
      ? '我的内在操作系统：' + name
      : '我的' + (QUIZ.resultLabel || '结果') + '是：' + name + '。' + (core ? core : '');
    return head + '\n' + line + '\n\n—— 观己实验室 · 理解自己，设计人生\n东方智慧 × 哲学思考 × 数字工具';
  }

  function starSVG() {
    return '<svg viewBox="0 0 120 120" width="46" height="46" fill="#e0c07e">' +
      '<path d="M60 18 L65.4 47.8 L96 50.4 L73 69.2 L80.8 98.6 L60 81.4 L39.2 98.6 L47 69.2 L24 50.4 L54.6 47.8 Z"/></svg>';
  }

  function tarotSVG() {
    return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4">' +
      '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M12 8v8M8.5 11h7"/></svg>';
  }

  function chipSVG() {
    return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4">' +
      '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/></svg>';
  }

  function finish() {
    if (state.answers.indexOf(null) > -1) return;
    buildResultView();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (state.index < totalQuestions() - 1) {
        state.index += 1;
        renderQuestion();
      } else {
        finish();
      }
    });
  }
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      if (state.index > 0) {
        state.index -= 1;
        renderQuestion();
      }
    });
  }

  // Data-driven page chrome: keep badge, intro and meta description in sync
  // with the quiz data file so pages never show stale counts or copied copy.
  (function syncPageChrome() {
    var n = totalQuestions();
    var minutes = Math.max(3, Math.round(n / 4));
    var badge = document.querySelector('.quiz-head .badge-gold');
    if (badge) badge.textContent = n + ' 题 · 约 ' + minutes + ' 分钟';
    var intro = document.querySelector('.quiz-head p');
    if (intro && QUIZ.desc) intro.textContent = QUIZ.desc;
    var md = document.querySelector('meta[name="description"]');
    if (md && QUIZ.desc) {
      var clean = QUIZ.desc.replace(/。+$/, '');
      md.setAttribute('content', QUIZ.title + '：' + clean + '。观己实验室 · 理解自己，设计人生');
    }
  })();

  renderQuestion();
})();
