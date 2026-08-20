(function () {
  'use strict';

  var SCENARIOS = {
    career: {
      title: '职业换轨',
      en: 'Career Pivot',
      desc: '站在岔路口的你，会怎么走这条路？每一种走法，都有它的代价与礼物。',
      start: '你已经加班到第九个深夜。关掉电脑的那一刻，一个念头又浮上来：「这真的是我想走的路吗？」你翻来覆去睡不着。第二天，你坐在咖啡馆里，面前有三个方向。',
      stages: [
        {
          q: '你决定从哪里开始？',
          options: [
            { text: '辞职，把全部时间押给想做的事', tag: '冒险', effect: { career: 2, self: 1, energy: -1 }, story: '辞职后的第一个月，你自由得发慌，也穷得发慌。你开始认真算每一笔钱，第一次知道「为自己负责」的滋味。' },
            { text: '边工作边准备，等条件成熟再走', tag: '稳健', effect: { career: 1, energy: 1, self: 1 }, story: '你保留了收入，也保留了退路。只是白天的工作消耗你，晚上才有一点时间给真正想做的事。' },
            { text: '先不动，继续观察一段时间', tag: '观望', effect: { career: -1, energy: 1, relation: 1 }, story: '你告诉自己再等等。日子照旧，但你知道，心里那颗种子已经开始发芽了。' }
          ]
        },
        {
          q: '半年后，你遇到了第一道坎。你会？',
          options: [
            { text: '加大投入，相信坚持能熬过去', tag: '坚持', effect: { career: 2, energy: -1, self: 1 }, story: '你把积蓄和精力都押了进去。夜里常常怀疑自己，但每次天亮，你又坐回桌前。' },
            { text: '调整策略，放慢节奏保住底线', tag: '灵活', effect: { career: 1, relation: 1, energy: 1 }, story: '你没有硬扛。你砍掉了一些不切实际的部分，重新安排节奏——慢一点，但稳一点。' },
            { text: '重新评估，准备退路', tag: '谨慎', effect: { relation: 1, energy: 1, self: 1 }, story: '你停下来算了算：如果这条路走不通，我最差能退回哪里？这个答案，反而让你敢继续往前走。' }
          ]
        },
        {
          q: '这时，一个合作机会出现在你面前。你会？',
          options: [
            { text: '接受合作，借力先跑起来', tag: '借力', effect: { career: 2, relation: 1 }, story: '你第一次尝到「有人一起走」的甜头。伙伴补上了你的短板，也带来了你一个人拿不到的舞台。' },
            { text: '婉拒合作，坚持自己做', tag: '独立', effect: { career: 1, self: 2 }, story: '你怕被带偏节奏，选择独自前行。这条路更孤独，但每一步都完完全全是你的。' },
            { text: '先谈清楚条件，再决定', tag: '审慎', effect: { relation: 1, career: 1, energy: 1 }, story: '你没有急着答应。你把合作的条件、边界、退出机制谈得清清楚楚——这让后来的合作走得很稳。' }
          ]
        },
        {
          q: '一年后，真正的分水岭来了。你会？',
          options: [
            { text: '把全部精力押上去，不再留后路', tag: 'allin', effect: { career: 2, self: 1, energy: -1 }, story: '你清空了退路，也因此有了破釜沉舟的专注。只是偶尔深夜，你会想念那个可以喊停的自己。' },
            { text: '维持双轨：主业保底，副业生长', tag: '双轨', effect: { career: 1, energy: 1, relation: 1 }, story: '你没有二选一，而是让两条轨道并行。慢一点，但你的选择里始终有余地。' },
            { text: '先暂停冲刺，照顾好自己再说', tag: '自我关怀', effect: { energy: 2, self: 2, career: -1 }, story: '你终于承认自己累了。你停下来休整，把健康和睡眠捡回来——这段停顿，反而让你想得更清楚了。' }
          ]
        }
      ],
      futures: {
        career: '三年后，你坐在自己亲手搭起来的轨道上。这条路不是最轻松的，但每一步都是你选的。你发现，「做自己想做的事」不是一种状态，而是一连串日常决定的总和——而你已经练会了做这些决定。',
        relation: '三年后，你回看这段换轨的岁月，发现真正支撑你的不是某个选择，而是那些在你最难时依然陪着你的人。你没有孤注一掷地赢，但你被稳稳地接住了。',
        energy: '三年后，你依然在路上，但你学会了另一种节奏：不再用燃烧自己证明决心。你走得不算最快，却是同路人里少数不喊累的——因为你知道，路还长。',
        self: '三年后，你也许还没有一个可以写进简历的答案，但你比谁都清楚自己是谁、想要什么、底线在哪里。你不再急着证明给谁看，因为你已经和自己和解了。'
      }
    },
    relation: {
      title: '关系课题',
      en: 'Relational Choice',
      desc: '一段反复让你内耗的关系，藏着你的旧剧本。这一次，你可以换个演法。',
      start: '你们已经三天没有好好说话了。你翻着聊天记录，看到自己打出又删掉的字：「算了。」你很清楚，这段关系在消耗你——但放手两个字，就是说不出口。',
      stages: [
        {
          q: '面对这段消耗，你的第一反应是？',
          options: [
            { text: '找对方摊开聊清楚', tag: '直面', effect: { relation: 2, self: 1 }, story: '你鼓起勇气开口。谈话很艰难，但至少，那层糊在关系上的雾被拨开了一点。' },
            { text: '先退一步，给自己一点空间', tag: '观察', effect: { energy: 2, self: 1 }, story: '你没有立刻摊牌，而是先拉开距离。在独处的几天里，你第一次听见自己真正想要什么。' },
            { text: '继续付出，希望对方能变', tag: '忍耐', effect: { relation: 1, energy: -1, self: -1 }, story: '你选择再忍一忍。可你知道，每一次咽下的话，都没有消失——它们只是沉到了更深的地方。' }
          ]
        },
        {
          q: '对方对你的靠近，反应很冷淡。你会？',
          options: [
            { text: '更用力地靠近，证明我在乎', tag: '追', effect: { relation: 1, energy: -1, self: -1 }, story: '你把自己放得很低，想用更多的付出换一次回应。但你越靠近，对方越后退。' },
            { text: '退到自己的位置，先稳住自己', tag: '稳', effect: { energy: 1, self: 2 }, story: '你停下来，不再追。你开始把那些照顾对方的力气，先用来照顾自己。' },
            { text: '直接说出我的需要：我需要被回应', tag: '表达', effect: { relation: 2, self: 1 }, story: '你说出了那句最难的话：「我需要被回应。」这句话，让你第一次在关系里站直了。' }
          ]
        },
        {
          q: '朋友劝你「别傻了」。你会？',
          options: [
            { text: '听朋友的，长痛不如短痛', tag: '听劝', effect: { self: 2, energy: 1 }, story: '你承认朋友看得比你看得清。你第一次允许自己，把「舍不得」放在「值不值得」后面。' },
            { text: '听自己的，我知道我的感受', tag: '自主', effect: { self: 2, relation: 1 }, story: '你没有把决定权交给任何人。即使别人不理解，你也想为自己负责一次。' },
            { text: '找一段专业咨询，把问题看清', tag: '求助', effect: { relation: 1, self: 1, energy: 1 }, story: '你不再一个人硬扛。有人帮你把纠缠的线一根根理顺，你终于看见了自己在关系里的剧本。' }
          ]
        },
        {
          q: '最后的决定，你会？',
          options: [
            { text: '留下，但换一种相处方式', tag: '重构', effect: { relation: 2, self: 1 }, story: '你没有逃跑，也没有硬撑。你重新划了边界，改了剧本——这段关系，活了过来。' },
            { text: '暂时分开，各自成长', tag: '暂停', effect: { self: 2, energy: 1, relation: -1 }, story: '你选择按下暂停键。分开的那段时间很痛，但也让你第一次完整地拥有了自己。' },
            { text: '结束它，带着学到的东西离开', tag: '放手', effect: { self: 2, relation: -1, energy: 1 }, story: '你说出了那句练习了很久的告别。心很空，但你知道——空出来的地方，会住进新的人。' }
          ]
        }
      ],
      futures: {
        relation: '三年后，你在一段真正让你安心的关系里。你发现，对的人不会让你一直猜——你终于被稳稳地、清晰地爱着。',
        self: '三年后，你不再需要通过被需要来确认自己的价值。你学会了先安顿自己，再与人同行——你身边的人，也换了一轮更健康的。',
        energy: '三年后，你不再在深夜反复咀嚼别人说过的话。你把力气还给了自己，关系变成了滋养，而不是消耗。',
        career: '三年后，你在其他领域也走得更好——因为当关系不再抽干你，你把省下的能量，投给了真正想做的事。'
      }
    },
    self: {
      title: '自我探索',
      en: 'Finding Direction',
      desc: '迷茫不是故障，是系统在重新校准。看看不同的活法，会开出什么不同的花。',
      start: '你已经迷茫好一阵了。朋友问起「最近怎么样」，你只能说「还行」。但你知道，「还行」不是答案。你站在人生的地图前，不知道该往哪个方向走。',
      stages: [
        {
          q: '面对迷茫，你会先？',
          options: [
            { text: '停下来，什么也不做地想一想', tag: '停顿', effect: { self: 2, energy: 1 }, story: '你给了自己一段空白。奇怪的是，什么都不做的那几天，很多答案自己浮了上来。' },
            { text: '到处去试，用行动找感觉', tag: '尝试', effect: { self: 1, career: 1, energy: 1 }, story: '你像做实验一样，把想试的都试了一遍。有的不合适，有的留下了一点火花。' },
            { text: '按现有轨道继续走，边走边看', tag: '延续', effect: { career: 1, relation: 1, self: -1 }, story: '你没有停下来。日子继续，但你知道，有些问题不会自己消失。' }
          ]
        },
        {
          q: '一个意外机会出现时，你会？',
          options: [
            { text: '抓住它，先试试再说', tag: '尝试', effect: { self: 2, career: 1 }, story: '你抓住了一个不确定的机会。它没有立刻改变人生，但给了你一个全新的视角。' },
            { text: '评估风险，准备好再上', tag: '审慎', effect: { career: 1, self: 1, relation: 1 }, story: '你把机会拆开看了一遍，确认自己输得起，才伸出手。这种慎重，让你走得更稳。' },
            { text: '拒绝分心，专注眼前的事', tag: '专注', effect: { career: 2, energy: 1 }, story: '你关上了那扇门。不是因为不心动，而是你知道，现在不是开新门的时候。' }
          ]
        },
        {
          q: '你又跌进了一个低谷。你会？',
          options: [
            { text: '一个人扛，不想麻烦别人', tag: '独立', effect: { self: 1, energy: -1, relation: -1 }, story: '你把自己关起来，想自己消化。扛过去之后你更坚强了，但那段路，也确实很黑。' },
            { text: '找信任的人说说', tag: '倾诉', effect: { relation: 2, energy: 1 }, story: '你拨通了那个很久没打的电话。说完之后你发现，担子没有变轻，但有人和你一起扛了。' },
            { text: '写下来，把乱麻整理清楚', tag: '书写', effect: { self: 2, energy: 1 }, story: '你开始写。写着写着，那些缠成一团的念头，第一次有了头绪。' }
          ]
        },
        {
          q: '当方向开始浮现，你会？',
          options: [
            { text: '选定一个，先深耕 90 天', tag: '深耕', effect: { career: 2, self: 1 }, story: '你选了一个方向，决定至少认真做 90 天。三个月后，你手上多了一件拿得出手的东西。' },
            { text: '保留多个可能，并行推进', tag: '并行', effect: { career: 1, self: 1, energy: -1 }, story: '你没有急着只选一个。并行很累，但你也因此没有错过任何一片风景。' },
            { text: '允许自己暂时没有答案', tag: '放下', effect: { self: 2, energy: 1 }, story: '你终于允许自己「暂时不知道」。这个允许，反而让你不再焦虑——答案在你不追它的时候，悄悄来了。' }
          ]
        }
      ],
      futures: {
        self: '三年后，你不再问「我该往哪走」。你心里有一张自己的地图——不是别人给的，是你用三年时间，一笔一笔画出来的。',
        career: '三年后，你有一个看得见摸得着的方向。那些迷茫期里试过的东西没有白费——它们成了你此刻立足的台阶。',
        relation: '三年后，你身边多了一群真正理解你的人。你不是一个人找到方向的——有人陪你走过最难的那段路。',
        energy: '三年后，你学会了和自己的低谷相处。你不再恐惧迷茫，因为你知道：每次重新校准，都让你离真实的自己更近一点。'
      }
    }
  };

  var state = { scenario: null, index: 0, picks: [] };
  var pickEl = document.getElementById('simPick');
  var cardEl = document.getElementById('simCard');
  var resultEl = document.getElementById('simResult');
  var titleEl = document.getElementById('simTitle');
  var descEl = document.getElementById('simDesc');
  var questionEl = document.getElementById('simQuestion');
  var optionsEl = document.getElementById('simOptions');
  var storyEl = document.getElementById('simStory');
  var countEl = document.getElementById('simCount');
  var dotsEl = document.getElementById('simDots');
  var backBtn = document.getElementById('simBack');

  function read(key, fb) {
    try {
      return JSON.parse(localStorage.getItem(key) || fb);
    } catch (e) {
      return fb;
    }
  }

  function resultOf(key) {
    return localStorage.getItem(key) || '';
  }

  function buildPersonalScenario() {
    var prof = read('guan_profile', {});
    var growth = read('guan_growth', []);
    var archetype = resultOf('guan_archetype');
    var stage = resultOf('guan_stage');
    var energy = resultOf('guan_energy');
    var burnout = resultOf('guan_burnout');
    var drain = resultOf('guan_drain');
    var attachment = resultOf('guan_attachment');
    var values = resultOf('guan_values');

    var focus = prof.focus || '找到自己的方向';
    var theme = 'career';
    var title = '职业换轨';
    if (prof.focus && /关系|感情|伴侣|朋友|家人/.test(prof.focus)) { theme = 'relation'; title = '关系课题'; }
    else if (prof.focus && /自我|成长|和解|迷茫|方向/.test(prof.focus)) { theme = 'self'; title = '自我探索'; }

    var start = '这是一段为你生成的人生模拟。你心里最放不下的事是「' + focus + '」。在一个不会真正受伤的沙盒里，替自己走一走这条路。';
    if (prof.nickname) start = '你好，' + prof.nickname + '。' + start;
    if (stage) start += '你正处在「' + stage.split(' · ')[0] + '」，这份处境会悄悄影响每个选择。';

    var stages = [];
    if (theme === 'career') {
      stages.push({
        q: '关于「' + focus + '」，你更愿意从哪里开始？',
        options: [
          { text: '先保住现在，悄悄为它腾出时间', tag: '双轨', effect: { career: 1, energy: 1, self: 1 }, story: '你没有急着放弃什么。你只是开始每天留出一小块时间，给那个念头一点生长的空间。' },
          { text: '认真投入，把它当成最重要的项目', tag: '投入', effect: { career: 2, self: 1, energy: -1 }, story: '你决定认真对待它。投入带来进展，也带来疲惫——但你知道，这是值得的。' },
          { text: '先停下来想清楚，再决定动不动', tag: '想清', effect: { self: 2, steady: 1 }, story: '你没有急着行动。你先问自己：这真的是我想要的，还是我以为我想要的？' }
        ]
      });
      stages.push({
        q: '进展没有想象中顺利时，你？',
        options: [
          { text: '调整方法，而不是放弃', tag: '灵活', effect: { career: 1, self: 1, energy: 1 }, story: '你把失败当成数据：这条路不通，换一条。你没有否定自己，只是换了个走法。' },
          { text: '停下来照顾自己的电量', tag: '自护', effect: { energy: 2, self: 1 }, story: '你承认自己需要休息。停下来不是放弃，是让接下来的路走得动。' },
          { text: '向一个走过这条路的人请教', tag: '求助', effect: { relation: 2, career: 1 }, story: '你没有一个人硬扛。你找到一个走过这条路的人，听TA讲真实的过程。' }
        ]
      });
      stages.push({
        q: '当「' + (values || '你真正在意的事') + '」和现实冲突时，你更愿意？',
        options: [
          { text: '守住我在意的东西，慢慢找平衡', tag: '守价值', effect: { self: 2, meaning: 1 }, story: '你选择不牺牲那个让你成为你的东西。慢一点，但方向没有偏。' },
          { text: '先解决现实，再回来追价值', tag: '先现实', effect: { career: 2, steady: 1 }, story: '你选择先稳住生活。你知道，有些梦需要先有地基。' },
          { text: '允许自己暂时两难，不急着选', tag: '允许两难', effect: { self: 2, care: 1 }, story: '你允许自己暂时没有答案。两难不是卡住，是你同时在认真对待两边。' }
        ]
      });
      stages.push({
        q: '一年后回看这次模拟，你希望自己记得什么？',
        options: [
          { text: '我曾经认真为自己做过选择', tag: '记得认真', effect: { self: 2, meaning: 1 }, story: '选择本身会过时，但「我为自己认真选择过」这件事，会一直陪着你。' },
          { text: '我在最难的时候也没有丢下自己', tag: '记得自护', effect: { care: 2, self: 1 }, story: '你记得的，不是结果，而是你始终没有丢下那个需要被照顾的自己。' },
          { text: '路是可以慢慢走的', tag: '记得节奏', effect: { steady: 2, energy: 1 }, story: '你不必一步跨到终点。慢慢走，也算走。' }
        ]
      });
    } else if (theme === 'relation') {
      stages.push({
        q: '面对「' + focus + '」，你第一反应是？',
        options: [
          { text: '先把话说开，哪怕会痛', tag: '直面', effect: { relation: 2, express: 1 }, story: '你选择诚实。诚实不保证不受伤，但它保证你不再假装。' },
          { text: '先退一步，听听自己真正想要什么', tag: '后退', effect: { self: 2, care: 1 }, story: '你给自己一点距离。有些答案，要离开几步才看得清。' },
          { text: '继续陪伴，但开始留意自己的感受', tag: '觉察', effect: { care: 1, self: 1, relation: 1 }, story: '你没有立刻改变什么，只是开始把「我的感受」也放进这段关系里。' }
        ]
      });
      stages.push({
        q: '对方没有按你期待的方式回应时，你？',
        options: [
          { text: '说出我的需要，而不是猜TA怎么想', tag: '表达需要', effect: { express: 2, relation: 1 }, story: '你练习把「我希望……」说出口。这是关系里最朴素也最难的一句话。' },
          { text: '照顾好自己，不把价值押在TA身上', tag: '自稳', effect: { self: 2, care: 1 }, story: '你把一部分注意力收回自己身上。不是不爱，是爱得更稳。' },
          { text: '给彼此一点时间，不逼对方', tag: '给时间', effect: { steady: 2, relation: 1 }, story: '你选择等待。有些回应需要时间，正如有些伤口需要时间。' }
        ]
      });
      stages.push({
        q: '这段关系的走向，你更希望？',
        options: [
          { text: '留下，但换一种相处方式', tag: '重构关系', effect: { relation: 2, boundary: 1 }, story: '你没有逃，也没有硬撑。你重新划了边界，换了剧本。' },
          { text: '暂时分开，各自成长', tag: '暂停', effect: { self: 2, energy: 1 }, story: '你按下暂停键。分开很痛，但你也第一次完整地拥有了自己。' },
          { text: '结束它，带着学到的东西离开', tag: '放手', effect: { self: 2, meaning: 1 }, story: '你说出了那句练习很久的告别。心很空，但空出来的地方会住进新的可能。' }
        ]
      });
      stages.push({
        q: '一年后回看，你希望这段关系教会你什么？',
        options: [
          { text: '我值得被好好对待', tag: '值得', effect: { self: 2, care: 1 }, story: '这句话会陪你去往下一段关系，也会陪你在独处时安顿自己。' },
          { text: '爱不是牺牲自己', tag: '爱有界', effect: { boundary: 2, self: 1 }, story: '真正的爱，是两个完整的人相遇，而不是一个人消失。' },
          { text: '我可以说出真实感受', tag: '敢说', effect: { express: 2 }, story: '你学会了把「我」放进句子里。这比什么都珍贵。' }
        ]
      });
    } else {
      stages.push({
        q: '面对「' + focus + '」，你更愿意先做什么？',
        options: [
          { text: '做一个小实验，先试试水', tag: '实验', effect: { explore: 2, meaning: 1 }, story: '你把「想清楚」换成「试一试」。一个最小的实验，比一百次想象更接近答案。' },
          { text: '先整理自己，再出发', tag: '整理', effect: { self: 2, care: 1 }, story: '你先安顿内心。不是拖延，是让出发更清醒。' },
          { text: '允许自己暂时没有答案', tag: '允许', effect: { meaning: 2, care: 1 }, story: '你允许自己不知道。这个允许，反而让答案有了出现的空间。' }
        ]
      });
      stages.push({
        q: '尝试没有立刻见效时，你？',
        options: [
          { text: '把「没见效」当成数据，继续调整', tag: '迭代', effect: { explore: 1, steady: 1, self: 1 }, story: '你把失败当反馈。每一条「此路不通」，都是地图的一部分。' },
          { text: '先休息，恢复能量再继续', tag: '蓄能', effect: { energy: 2, care: 1 }, story: '你允许自己充电。你知道，低电量时做的决定，常常不是好决定。' },
          { text: '找人聊聊，让想法更清晰', tag: '对话', effect: { express: 2, relation: 1 }, story: '你没有一个人闷头想。说出来，思路才开始成形。' }
        ]
      });
      stages.push({
        q: '当别人不理解你的选择时，你？',
        options: [
          { text: '温柔但坚定地走自己的路', tag: '笃定', effect: { self: 2, boundary: 1 }, story: '你不需要所有人理解。你只需要自己清楚，为什么走。' },
          { text: '听听他们的担忧，但决定权在自己', tag: '倾听自决', effect: { relation: 1, self: 2 }, story: '你愿意听，但钥匙还在你自己手里。' },
          { text: '把不理解当成重新确认的机会', tag: '确认', effect: { meaning: 2 }, story: '每一次被质疑，你都重新问自己一次：这是我想要的吗？答案没变，你就继续走。' }
        ]
      });
      stages.push({
        q: '一年后的你，会对现在的自己说什么？',
        options: [
          { text: '「谢谢你开始为自己走了」', tag: '感恩', effect: { self: 2, care: 1 }, story: '开始本身，就是最重要的那一步。' },
          { text: '「慢一点没关系，你已经在路上了」', tag: '慢行', effect: { steady: 2, energy: 1 }, story: '你不需要跑。你在路上，就已经足够。' },
          { text: '「答案会来的，带着你走过去」', tag: '期待', effect: { meaning: 2, explore: 1 }, story: '你相信答案不是等来的，是你走出来的。' }
        ]
      });
    }

    return {
      id: 'personal',
      title: title + ' · 为你生成',
      en: 'Made For You',
      desc: '这份模拟来自你的档案、测试与记录。它不是一个剧本，而是你人生的一个可能版本。',
      start: start,
      stages: stages,
      futures: {
        self: '一年后，你也许还没有抵达「终点」，但你已经不是出发时的你。你更清楚自己要什么、怕什么、为什么走——这是比到达更珍贵的收获。',
        meaning: '一年后回看，你会发现：那些犹豫、试探和绕路，都是你靠近自己的方式。方向不是被找到的，是被走出来的。',
        care: '一年后，你学会了在赶路时也照顾自己。这让你走得慢了一点，却走了更远。',
        boundary: '一年后，你更懂得什么时候该靠近、什么时候该守着自己。这份分寸，让你在关系里既真实又不失自己。',
        steady: '一年后，你不再急着证明什么。你按自己的节奏走，反而比很多慌忙的人走得更稳。',
        express: '一年后，那些曾经咽下去的话，你已经能说出来了。你被听见的机会，也随之变多。',
        explore: '一年后，你试过了几条不同的路。它们没有白费——它们共同告诉你，哪条路更像你。',
        relation: '一年后，你身边的关系变得更真实了。因为你先对自己真实了。',
        career: '一年后，你在自己选择的路上站稳了脚。它不是最轻松的路，但每一步都是你选的。',
        energy: '一年后，你学会了在赶路时也照顾自己的电量。你走得不算最快，却很少喊累。'
      }
    };
  }

  function personalDimsToCore(dims) {
    return {
      career: (dims.career || 0) + (dims.steady || 0) + (dims.meaning || 0),
      relation: (dims.relation || 0) + (dims.express || 0) + (dims.boundary || 0),
      energy: (dims.energy || 0) + (dims.care || 0),
      self: (dims.self || 0) + (dims.explore || 0) + (dims.meaning || 0) + (dims.boundary || 0)
    };
  }

  function startPersonal() {
    var sc = buildPersonalScenario();
    state.scenario = sc.id;
    state.index = 0;
    state.picks = [];
    SCENARIOS[sc.id] = sc;
    titleEl.textContent = sc.title;
    descEl.textContent = sc.desc;
    pickEl.classList.add('hidden');
    resultEl.classList.add('hidden');
    cardEl.classList.remove('hidden');
    renderStage();
    cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function dimsOf() {
    var dims = { career: 0, relation: 0, energy: 0, self: 0 };
    state.picks.forEach(function (p) {
      Object.keys(p.effect).forEach(function (k) { dims[k] += p.effect[k]; });
    });
    return dims;
  }

  function renderPick() {
    pickEl.classList.remove('hidden');
    cardEl.classList.add('hidden');
    resultEl.classList.add('hidden');
  }

  function startScenario(id) {
    state.scenario = id;
    state.index = 0;
    state.picks = [];
    var s = SCENARIOS[id];
    titleEl.textContent = s.title;
    descEl.textContent = s.desc;
    pickEl.classList.add('hidden');
    resultEl.classList.add('hidden');
    cardEl.classList.remove('hidden');
    renderStage();
    cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderStage() {
    var s = SCENARIOS[state.scenario];
    var st = s.stages[state.index];
    var isFirst = state.index === 0;
    var isLast = state.index === s.stages.length - 1;
    questionEl.textContent = (isFirst ? s.start + '\n\n' : '') + st.q;
    optionsEl.innerHTML = '';
    st.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sim-option';
      var picked = state.picks[state.index] && state.picks[state.index].index === i;
      if (picked) btn.classList.add('selected');
      btn.innerHTML = '<span>' + opt.text + '</span><span class="sim-opt-tag">' + opt.tag + '</span>';
      btn.addEventListener('click', function () { choose(i); });
      optionsEl.appendChild(btn);
    });
    countEl.textContent = (state.index + 1) + ' / ' + s.stages.length;
    dotsEl.innerHTML = s.stages.map(function (_, i) {
      return '<i class="' + (i < state.index ? 'done' : '') + '"></i>';
    }).join('');
    storyEl.classList.remove('show');
    storyEl.textContent = '';
    backBtn.style.visibility = state.index === 0 ? 'hidden' : 'visible';
    document.getElementById('simRestart').style.visibility = isLast ? 'visible' : 'hidden';
  }

  function choose(i) {
    var s = SCENARIOS[state.scenario];
    var st = s.stages[state.index];
    var opt = st.options[i];
    state.picks[state.index] = { index: i, tag: opt.tag, text: opt.text, effect: opt.effect, story: opt.story };
    var btns = optionsEl.querySelectorAll('.sim-option');
    btns.forEach(function (b, idx) { b.classList.toggle('selected', idx === i); });
    storyEl.textContent = opt.story;
    storyEl.classList.add('show');
    setTimeout(function () {
      if (state.index < s.stages.length - 1) {
        state.index += 1;
        renderStage();
      } else {
        finish();
      }
    }, 900);
  }

  function dominantDim() {
    var dims = dimsOf();
    return Object.keys(dims).sort(function (a, b) { return dims[b] - dims[a]; })[0];
  }

  function styleOf() {
    var tags = state.picks.map(function (p) { return p.tag; });
    var style;
    if (tags.indexOf('冒险') > -1 || tags.indexOf('allin') > -1) {
      style = '你偏向「行动优先」：先做了再说。你相信反馈比想象更有用，也愿意为选择承担后果。这样的你，往往比犹豫的人更早拿到答案——但也容易在冲劲里忽略自己的电量。你选择的那几条路，都带着一种「我信自己」的底气：不是因为你确定结果，而是因为你确定自己可以处理结果。';
    } else if (tags.indexOf('观察') > -1 || tags.indexOf('谨慎') > -1 || tags.indexOf('审慎') > -1 || tags.indexOf('稳') > -1) {
      style = '你偏向「稳健优先」：先看清再走。你在选择里反复确认边界、衡量代价，不是因为胆小，而是因为你认真对待每一次出发。这样的你很少莽撞，也极少后悔——你付出的代价，是偶尔会比别人慢一步，或者在等待中错过一些需要「先跳再说」的机会。';
    } else if (tags.indexOf('自我关怀') > -1 || tags.indexOf('放下') > -1 || tags.indexOf('停顿') > -1) {
      style = '你偏向「自我关怀」：在好几个分岔口，你都选择了照顾自己的电量、允许自己慢下来。这不是逃避，这是最被低估的勇敢——因为世界总在鼓励我们透支自己，而你选择听见自己。这样的选择，短期看起来「少走了几步」，长期却让你成为同行者里少数不喊累的人。';
    } else {
      style = '你在不同选择间保持平衡：该行动时你有行动力，该停下来时你允许自己停。你没有把自己锁进任何一种风格，而是根据每个情境的需要做出回应。这种弹性，恰恰是长期走得远的关键——因为人生从来不是用同一种姿势可以走完的。';
    }
    return style;
  }

  function buildDeepInsight(s, style) {
    var paras = [];
    paras.push(style);
    paras.push('如果你回看自己刚才的四个选择，会发现它们并不是随机的：它们背后站着一个一直在替你权衡的「你」。有人把选择交给了安全，有人交给了勇气，有人交给了对自己的照顾——而你把它们交给了' + style.slice(0, 10) + '。这不是一次模拟的结果，而是你面对人生时真实的行事方式。');
    paras.push('值得留意的是：你做出的每一个选择，都不是孤立的。它们连在一起，构成了一条只有你能走的路——这条路里有你的恐惧、你的渴望、你的底线，也有你还没来得及说出口的期待。模拟只是把这条路投影出来给你看，而它真正的起点，一直握在你手里。');
    paras.push('模拟的意义，从来不是预言「你会怎样」，而是让你看见「当你这样选择时，会发生什么」。你刚才看到的三年后，不是命运，是你价值观的投影：你选择的方向，会慢慢长成你选择的生活。这不是可怕的真相，反而是好消息——因为它意味着，你一直握着改写剧本的手。');
    paras.push('关于那些你「没有选」的选项：它们不代表错误，只代表此刻的你暂时不需要它们。但请记得它们的名字——它们是你未来某个阶段可能需要的能力。今天你选择稳，也许明年你需要的是勇气；今天你选择照顾自己，也许某天你需要的是为在意的事豁出去一次。你没有被任何一次选择定型。');
    return paras;
  }

  function buildFutures(s, primary, secondary) {
    var labels = { career: '事业', relation: '关系', energy: '能量', self: '自我' };
    var primaryFuture = s.futures[primary];
    var secondaryFuture = s.futures[secondary];
    var extra = '<p style="margin-top:8px">这个方向之所以成为你的主旋律，是因为它此刻最需要你的关注。它不是你唯一的面向，而是你现阶段最活跃的课题——当它被好好照顾，其他维度也会慢慢明亮起来。</p>';
    return '<div class="sim-future"><h5>三年后 · 如果你继续这样选择</h5><p>' + primaryFuture + '</p>' + extra + '</div>' +
      '<div class="sim-future"><h5>另一种可能 · 如果你开始注意' + labels[secondary] + '</h5><p>' + secondaryFuture + '</p>' +
      '<p style="margin-top:8px">你生命里的' + labels[secondary] + '维度，是这次模拟里相对安静的一角。它不是不重要，只是还没有被你的选择真正激活。试着在未来日子里，偶尔把注意力分给它一点——它可能会给你带来意想不到的回报。</p></div>' +
      '<div class="sim-future"><h5>反事实 · 如果换一个关键选择</h5><p>重新点「再试一次」，在第一个分岔口选一个你现实中不会选的方向。那个答案，往往藏着你现在最需要的信号——它不一定告诉你「该选什么」，但会告诉你「你害怕的，可能没有想象中可怕」。</p></div>';
  }

  function finish() {
    cardEl.classList.add('hidden');
    resultEl.classList.remove('hidden');
    var s = SCENARIOS[state.scenario];
    var rawDims = dimsOf();
    var dims = s.id === 'personal' ? personalDimsToCore(rawDims) : rawDims;
    document.getElementById('simResultTitle').textContent = s.title + ' · 你的可能轨迹';
    document.getElementById('simResultSub').textContent = '这不是预言，而是你这一组选择展开后的一种可能。';

    document.getElementById('simTimeline').innerHTML = state.picks.map(function (p) {
      return '<li><strong>' + p.text + '</strong><br>' + p.story + '</li>';
    }).join('');

    var labels = { career: '事业', relation: '关系', energy: '能量', self: '自我' };
    var max = 8;
    document.getElementById('simDims').innerHTML = Object.keys(labels).map(function (k) {
      var v = Math.max(0, Math.min(max, dims[k]));
      return '<div class="sim-dim"><h5>' + labels[k] + '</h5><div class="bar"><i style="width:' + (v / max * 100) + '%"></i></div><span>' + v + ' / ' + max + '</span></div>';
    }).join('');

    var style = styleOf();
    document.getElementById('simInsight').innerHTML = buildDeepInsight(s, style).map(function (p) {
      return '<p style="margin-bottom:12px">' + p + '</p>';
    }).join('');

    var primary = dominantDim();
    var ordered = Object.keys(dims).sort(function (a, b) { return dims[b] - dims[a]; });
    var secondary = ordered[1];
    document.getElementById('simFutures').innerHTML = buildFutures(s, primary, secondary);

    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  pickEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.sim-script');
    if (btn) startScenario(btn.getAttribute('data-scenario'));
  });
  document.getElementById('simPersonalBtn').addEventListener('click', startPersonal);
  backBtn.addEventListener('click', function () {
    if (state.index > 0) {
      state.index -= 1;
      state.picks.pop();
      renderStage();
    }
  });
  document.getElementById('simRestart').addEventListener('click', function () {
    state.index = 0;
    state.picks = [];
    renderStage();
    cardEl.classList.remove('hidden');
    resultEl.classList.add('hidden');
    cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('simAgain').addEventListener('click', function () {
    state.index = 0;
    state.picks = [];
    renderStage();
    resultEl.classList.add('hidden');
    cardEl.classList.remove('hidden');
    cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('simSave').addEventListener('click', function () {
    var s = SCENARIOS[state.scenario];
    var dims = dimsOf();
    var record = {
      scenario: state.scenario,
      title: s.title,
      date: new Date().toISOString(),
      picks: state.picks.map(function (p) { return { text: p.text, tag: p.tag }; }),
      dims: dims,
      insight: styleOf()
    };
    window.guanSet('guan_sim', JSON.stringify(record));
    window.guanToast('已保存 · 可以带回人生设计页继续推敲');
  });
})();
