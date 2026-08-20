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
    '逃避': '想缓一缓', '回避': '先退一步', '焦虑': '有些在意', '担心': '有些担心', '恐惧': '有些害怕'
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
    q.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      var picked = state.answers[state.index] === i;
      if (picked) btn.classList.add('on');
      var html = '<span>' + letters[i] + ' · ' + opt.text + '</span>';
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
    if (QUIZ.scoring === 'inneros') return computeInnerOS();
    var scores = {};
    Object.keys(QUIZ.results).forEach(function (k) { scores[k] = 0; });
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

    if (QUIZ.scoring === 'inneros') {
      renderInnerOS();
    } else {
      renderStandard();
    }
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    var html = resultCardHTML(QUIZ.iconSVG || starSVG(), p.name, p.en, tarotSVG(), '塔罗象征 · ' + p.tarot);
    html += '<div class="result-sections">';
    if (THEORY[QUIZ.key]) {
      html += '<div class="theory-badge">专业依据 · ' + THEORY[QUIZ.key] + '</div>';
    }
    html += '<div class="result-block wide"><h4>核心特征</h4>' + deepBlock('core', p) + '</div>';
    html += '<div class="result-block wide"><h4>内在冲突</h4>' + deepBlock('conflict', p) + '</div>';
    html += '<div class="result-block wide"><h4>成长方向</h4>' + deepBlock('growth', p) + '</div>';
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
    var otherList = collectOthers();
    if (otherList.length) {
      html += block('你的声音', listHTML(otherList), 'wide');
    }
    var pathList = collectPath();
    if (pathList.length) {
      html += block('你的选择轨迹 · 你怎样走到这里', listHTML(pathList), 'wide');
    }
    if (QUIZ.depth && QUIZ.depth.title) {
      html += block('关于' + (QUIZ.categoryTitle || '这个板块') + ' · 深度文章',
        '<p>' + QUIZ.depth.lead + '</p><p>' + QUIZ.depth.body + '</p>' +
        (QUIZ.depth.closing ? '<p><strong>' + QUIZ.depth.closing + '</strong></p>' : ''),
        'wide');
    }
    html += '</div>';
    html += actionsHTML(r.primary, p.name);
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
    var otherList = collectOthers();
    if (otherList.length) {
      html += block('你的声音', listHTML(otherList), 'wide');
    }
    var pathList = collectPath();
    if (pathList.length) {
      html += block('你的选择轨迹 · 你怎样走到这里', listHTML(pathList), 'wide');
    }
    if (QUIZ.depth && QUIZ.depth.title) {
      html += block('关于' + (QUIZ.categoryTitle || '这个板块') + ' · 深度文章',
        '<p>' + QUIZ.depth.lead + '</p><p>' + QUIZ.depth.body + '</p>' +
        (QUIZ.depth.closing ? '<p><strong>' + QUIZ.depth.closing + '</strong></p>' : ''),
        'wide');
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
          list.push('在第 ' + (qi + 1) + ' 题，你选择了「' + opt.text.slice(0, 18) + (opt.text.length > 18 ? '…' : '') + '」——这透露了你此刻的真实倾向。');
        }
      }
    });
    return list.slice(0, 5);
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

  function deepBlock(kind, p) {
    var prof = profileData();
    var paras = [];

    if (kind === 'core') {
      paras.push(p.core);
      if (QUIZ.depth && QUIZ.depth.body) {
        paras.push(QUIZ.depth.lead);
        paras.push(QUIZ.depth.body.split('。').slice(0, 2).join('。') + '。');
      }
      paras.push('塔罗里有一张牌，叫做「' + p.tarot + '」。它并不预言你的人生，而是像一面古老的镜子，映照出你此刻正在经验的主题。牌面里的象征——无论是一段旅程、一座塔、还是一盏灯——都在提醒你：你正在经历的，是人类心灵里早就被反复描绘过的章节。你不是孤独的，也不是奇怪的，你正走在许多人都走过的路上。');
      paras.push('这个特质最常在这样一些时刻显现：当别人还在犹豫时，你已经迈出了那一步；当生活变得一成不变，你是最先感到不安的那一个；当身边的人需要支持，你会下意识地用自己的方式伸出手。它不是只在重要时刻才出现，而是藏在你的日常里，像一条安静而持续的河流。');
      var archetype = testResult('guan_archetype');
      var drain = testResult('guan_drain');
      var values = testResult('guan_values');
      paras.push('「' + p.name + '」不是贴在你身上的标签，而是你面对世界时最常用的一种姿势。它往往不是深思熟虑的选择，而是你早年为了被爱、被接纳、被保护而学会的——所以它那么自然，自然到你几乎意识不到它正在运行。');
      paras.push('当这份特质被善待时，它会变成你最稳定的力量：它让你在人群里有自己的位置，让你在困难面前有自己的方式，也让那些了解你的人，一想到你就感到安心。它从来不是需要被纠正的问题，而是需要被好好使用的能力。');
      paras.push('如果你愿意，可以试着在今天留意它一次：注意你在哪个瞬间使用了' + p.name + '的能量，那一刻你是感到充实，还是感到勉强？这个觉察本身，就是你和自己关系变深的开始。');
      if (archetype) {
        paras.push('你的人生原型测试同样指向「' + archetype.split(' · ')[0] + '」的能量，这不是巧合：原型是你更深处的剧本，而' + p.name + '是这出戏里你出场的方式。两者叠加在一起，构成了你独特的存在感。');
      }
      if (drain) {
        var drainKind = drain.split(' · ')[0];
        paras.push('你的内耗常来自「' + drainKind + '」——这恰恰说明' + p.name + '这一面的能量容易在无人看见的地方消耗。它不是你不够好，而是你这一面太用力了。');
      }
      if (prof.zodiac) {
        paras.push('你出生在' + prof.zodiac + '的时节，星象学里这个位置承载着特定的原型色彩——但它从来不是命运，而是一种语言：帮助你辨认自己身上那些本来就有的质地。');
      }
      if (values) {
        paras.push('你真正看重的价值是「' + values.split(' · ')[0] + '」——当你活得贴合这个价值时，' + p.name + '的一面会格外明亮；当它被压抑时，你会先感到疲惫。');
      }
      paras.push('而无论这份特质此刻带给你的是力量还是疲惫，它都值得被记住一个事实：它是你的一部分，但它不是你的一切。你比任何单一的特质都更大、更丰富。');
      paras.push('所以，核心特征这一栏，与其说是「诊断」，不如说是「欢迎词」：欢迎你看见自己身上这个一直在努力的部分。它值得被温柔地认识。');
    }

    if (kind === 'conflict') {
      paras.push(p.conflict);
      if (QUIZ.depth && QUIZ.depth.body) {
        paras.push(QUIZ.depth.body.split('。').slice(2, 4).join('。') + '。');
      }
      paras.push('这个冲突，很可能曾经帮过你。它让你在不确定的关系里保护自己，让你在竞争的环境里保持警觉，让你在受伤之后还能站起来继续走。它不是你性格的缺陷，而是你在某个阶段为自己找到的生存方式——只是时过境迁，它服务的那个「过去」，已经不再是你现在的生活。');
      paras.push('冲突最常被看见的地方，往往不是大事，而是小事：一句没回的话、一次临时的变动、一个不被满足的期待，都能在瞬间把那个旧的你唤醒。你可能会惊讶于自己的反应比事情本身大得多——那不是你小题大做，而是旧的声音在你心里响了一下。');
      paras.push('这个冲突不是凭空出现的。它往往来自两种同时存在的需要：一边想被爱、被接纳，一边想保护自己、不受伤。' + p.name + '的姿态，正是这两种需要反复协商后的产物——所以它那么矛盾，又那么真实。');
      paras.push('你可以在这些场景里看见它的影子：在你反复纠结的深夜、在你答应不想答应的事之后、在你明明在意却假装没事的瞬间。它不是你的敌人，它是你的保护者——只是它用的方式，已经不再适合现在的你。');
      paras.push('如果用一个词来描述这个冲突的底色，也许是「恐惧」：害怕被否定、害怕被丢下、害怕自己不够好。恐惧本身没有错，它是人类最古老的信使。只是这个信使跑得太勤了，常常在并不危险的时刻拉响警报。');
      var attachment = testResult('guan_attachment');
      if (attachment) {
        paras.push('你的依恋测试指向「' + attachment.split(' · ')[0] + '」——这解释了为什么有些冲突会反复出现在关系里：那不是对方的问题，而是你的旧模式在熟悉的场景里自动启动。看清它，不是责怪自己，而是让自动变成可选。');
      }
      paras.push('与这个冲突相处，不需要你立刻战胜它。你可以先认识它：它出现时，身体哪里在紧张？心里在重复哪句话？它想保护的那个「过去的你」，现在还需要它这样用力保护吗？这些问题本身，就是松动的开始。');
      paras.push('塔罗里与这张牌相对的意象，也暗示着一种和解的可能：当' + p.tarot + '的力量被理解，它就不再是威胁，而会转化为一种清醒。同一股能量，在恐惧手里是枷锁，在理解手里是钥匙。');
      paras.push('如果这个冲突一直不被看见，它会以另一种方式继续存在：可能是身体的疲惫，可能是关系里的疏远，可能是「说不清为什么」的低落。它不是在惩罚你，它只是在用它的方式提醒你：这里有一个需要被处理的内在课题。');
      paras.push('所以，内在冲突这一栏，不是一份判决书，而是一份邀请：邀请你以好奇而不是恐惧，去看一看这个一直陪着你、却从未被好好倾听的部分。你不需要立刻解决它——你只需要承认它存在。');
    }

    if (kind === 'growth') {
      paras.push(p.growth);
      paras.push('「成长」这个词，常常让人想到「变成更好的自己」。但请允许我们换一种理解：成长不是否定现在的你，而是让现在的你，多出几种选择。你不是要离开' + p.name + '，而是要让它从唯一的姿态，变成众多姿态之一。');
      paras.push('塔罗里关于成长的象征，从来不是「变得完美」，而是「变得完整」：把被压抑的部分接回来，把被忽略的需要看见，把那个一直躲在暗处的声音请到光里。完整，比完美更重要——这也是' + p.tarot + '想提醒你的。');
      paras.push('成长方向不是一份「你应该变成什么样」的命令。恰恰相反：真正的成长，是允许自己先完整地成为现在的样子，再慢慢长出新的可能性。你现在需要做的，不是「改正」自己，而是「扩展」自己——在' + p.name + '的姿态之外，学习另一种姿势。');
      var soft = (p.actions || []).slice(0, 2);
      if (soft.length) {
        paras.push('如果愿意，可以从这里轻轻开始：' + soft[0] + '。它不需要你立刻做到，不需要你坚持多少天——它只是一个方向，让你在明天、后天，或某个合适的时刻，可以试着往那里走一步。');
        if (soft[1]) paras.push('另一个同样轻的选择是：' + soft[1] + '。你不必两个都做，选一个当下最不费力的，就足够。');
      }
      paras.push('你可能会担心「慢慢来」会让别人超过你。但请相信：人生不是一场和所有人比的赛跑，而是一条只有你知道路况的路。别人的节奏是别人的，你的节奏是你这些年一步步长出来的——它值得被尊重，而不是被催促。');
      var stage = testResult('guan_stage');
      if (stage) {
        paras.push('你的人生阶段显示你正处在「' + stage.split(' · ')[0] + '」——这个阶段的功课不是冲刺，而是与' + stage.split(' · ')[0] + '相处。你在成长方向上的尝试，需要配上这个阶段该有的节奏：探索期多试，重构期先修复，积累期做深，转型期酝酿。');
      }
      paras.push('回望过去，你或许能看到：每一次你以为自己「没有成长」的日子，其实都在悄悄积累着什么——那些独自消化的夜晚、那些坚持下来的小事、那些你为自己做的选择，都是你走到今天的台阶。');
      paras.push('而望向未来，你不必知道终点在哪里。你只需要知道：从今天起，每一次你对自己温柔一点，每一次你允许自己按自己的节奏走，都是在朝那个更完整的你，靠近一小步。');
      var energy = testResult('guan_energy');
      if (energy) {
        paras.push('你的能量状态是「' + energy.split(' · ')[0] + '」——在你电量不足的时候，成长不是再加码，而是先照顾自己。允许自己今天只做一个很小的动作，甚至只是写下「我想……」，就已经是向前。');
      }
      paras.push('回看过往，你会发现：你其实一直在以自己的方式成长——那些绕过的路、停过的站、走过的弯路，都是你走到这里的一部分。你不缺努力，你缺的只是对自己温和一点的眼光。');
      paras.push('所以，成长方向这一栏，最终想对你说的是：你不需要成为「更好的别人」。你只需要，成为更完整、更愿意理解自己的你。这一路，我们会陪你。');
    }

    return paras.map(deepParagraph).join('');
  }

  function listHTML(items) {
    if (!items || !items.length) return '';
    return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
  }

  function actionsHTML(label, summary) {
    return '' +
      '<div class="result-actions">' +
      '  <button type="button" class="btn btn-gold" data-copy>复制结果，分享到微信</button>' +
      '  <button type="button" class="btn" data-restart>重新测试</button>' +
      '  <a class="btn" href="tests.html">返回测试中心</a>' +
      '</div>' +
      '<div class="next-steps">' +
      '  <h4>接下来，你可以</h4>' +
      '  <div class="next-links">' +
      '    <a href="tests.html">继续探索 · 认识自己的另一面</a>' +
      '    <a href="design.html">去人生设计 · 把此刻的看见变成方向</a>' +
      '    <a href="simulator.html">去人生模拟 · 在沙盒里试走一条路</a>' +
      '    <a href="journey.html">开始三十天陪伴 · 慢慢陪自己</a>' +
      '  </div>' +
      '</div>' +
      (QUIZ.category ? crisisHTML(QUIZ.category) : '');
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
    var copyBtn = resultEl.querySelector('[data-copy]');
    var restartBtn = resultEl.querySelector('[data-restart]');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        if (navigator.share && navigator.canShare && navigator.canShare({ text: share })) {
          navigator.share({ title: '观己实验室 · ' + QUIZ.title, text: share }).catch(function () {});
          return;
        }
        window.guanCopy(share, function (ok) {
          window.guanToast(ok ? '已复制，去微信粘贴即可' : '复制失败，请手动选择文本');
        });
      });
    }
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
