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

  var state = { scenario: null, index: 0, picks: [], notes: [] };
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
  var noteInput = document.getElementById('simNoteInput');

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

  function planResult() {
    try {
      return JSON.parse(window.guanGet('guan_plan') || 'null');
    } catch (e) {
      return null;
    }
  }

  function roleScenario(role, theme) {
    var text = role + '';
    var template;
    if (/医生|医|护理/.test(text)) {
      template = {
        title: '成为「' + role + '」的模拟',
        start: '你穿上了白大褂。这份职业的光环背后，是每天面对真实的病痛、家属的焦虑，和那些你必须独自做决定的时刻。',
        stages: [
          { q: '值班的深夜，一位病人病情突然变化，你会？', options: [
            { text: '立刻按流程处理，即使心里也慌', tag: '专业', effect: { career: 2, self: 1 }, story: '你选择相信训练。手在抖，但流程让你稳住了。' },
            { text: '先请上级/同事支援，不独自扛', tag: '协作', effect: { relation: 2, career: 1 }, story: '你懂得求助不是无能——医疗从来不是一个人的战斗。' },
            { text: '先安抚家属，再处理病情', tag: '共情', effect: { relation: 2, energy: 1 }, story: '你看见的不只是病，还有人。这份看见，让沟通变得不同。' }
          ] },
          { q: '一位病人不信任你，反复质疑，你会？', options: [
            { text: '耐心解释，不因情绪而敷衍', tag: '耐心', effect: { relation: 2, career: 1 }, story: '你把质疑当成一次沟通的开始，而不是冒犯。' },
            { text: '保持专业边界，不被他带节奏', tag: '边界', effect: { career: 2, self: 1 }, story: '你清楚自己的职责，也不让情绪影响判断。' },
            { text: '请更有经验的同事一起沟通', tag: '求助', effect: { relation: 2 }, story: '你懂得在需要时借力——这是成熟，不是退缩。' }
          ] },
          { q: '连续值班让你身心俱疲，你会？', options: [
            { text: '坚持，因为病人需要我', tag: '坚持', effect: { career: 2, energy: -1 }, story: '你选择留下。但身体在记账，这份债需要被偿还。' },
            { text: '申请轮休，先照顾好自己', tag: '自护', effect: { energy: 2, care: 1 }, story: '你明白：只有自己不倒下，才能一直守护别人。' },
            { text: '和同行聊聊，分担这份沉重', tag: '倾诉', effect: { relation: 2, energy: 1 }, story: '你没有把沉重都咽下去——说出来，轻了一半。' }
          ] },
          { q: '三年后，你希望自己成为怎样的医者？', options: [
            { text: '技术过硬、值得托付的医生', tag: '精进', effect: { career: 2, meaning: 1 }, story: '你选择在专业上不断深耕，让「可靠」成为你的名字。' },
            { text: '既专业又懂人心的医者', tag: '人文', effect: { relation: 2, meaning: 1 }, story: '你相信医学是科学，也是对人的关怀。' },
            { text: '能平衡工作与生活的医者', tag: '平衡', effect: { energy: 2, self: 1 }, story: '你不想燃烧自己成全职业——你想走得远，也活得久。' }
          ] }
        ]
      };
    } else if (/老师|教师|教育/.test(text)) {
      template = {
        title: '成为「' + role + '」的模拟',
        start: '你站上了讲台。教书这件事，比想象中更复杂：你要面对的，不只是知识，还有一个个真实的孩子和他们的家庭。',
        stages: [
          { q: '一个学生明显不在状态，你会？', options: [
            { text: '课后单独找TA聊聊', tag: '关怀', effect: { relation: 2, care: 1 }, story: '你没有当众点破，而是留了一个温柔的空间。' },
            { text: '先观察，找合适的时机', tag: '观察', effect: { self: 2 }, story: '你相信每个孩子都有自己的节奏，先看懂再介入。' },
            { text: '和班主任/家长沟通', tag: '协作', effect: { relation: 2 }, story: '你懂得教育是合力，不独自扛。' }
          ] },
          { q: '备课、批改、家长沟通压在一起，你会？', options: [
            { text: '排优先级，重要的先做', tag: '规划', effect: { career: 2, energy: 1 }, story: '你没有被琐事淹没，而是先做最重要的事。' },
            { text: '先停下来，重新安排节奏', tag: '调整', effect: { energy: 2 }, story: '你知道硬撑只会让质量下降，先稳住自己。' },
            { text: '和同事分担、互相支持', tag: '协作', effect: { relation: 2 }, story: '你发现同行者能让这条路轻很多。' }
          ] },
          { q: '你发现自己开始麻木，会？', options: [
            { text: '找回最初选择教育的理由', tag: '初心', effect: { meaning: 2 }, story: '你回到那个「想点亮什么人」的起点。' },
            { text: '给自己休息，允许暂时失去热情', tag: '允许', effect: { energy: 2, care: 1 }, story: '你允许热情休息，而不是假装它还在。' },
            { text: '和学生多接触，从他们身上找回能量', tag: '联结', effect: { relation: 2 }, story: '你发现孩子的眼睛，会重新点亮你。' }
          ] },
          { q: '三年后，你希望自己是怎样的老师？', options: [
            { text: '能真正影响一些孩子的老师', tag: '影响', effect: { meaning: 2, relation: 1 }, story: '你希望自己教的不只是知识，还有勇气。' },
            { text: '既专业又受学生信任的老师', tag: '专业', effect: { career: 2, relation: 1 }, story: '你相信信任是最好的讲台。' },
            { text: '能保持热爱的老师', tag: '热爱', effect: { energy: 2, meaning: 1 }, story: '你不想在日复一日里磨掉最初的光。' }
          ] }
        ]
      };
    } else if (/创作|作家|写|画|设计|艺术/.test(text)) {
      template = {
        title: '成为「' + role + '」的模拟',
        start: '你开始靠创作生活。自由背后，是收入的不确定、灵感的起伏，和无数个「没人看见」的时刻。',
        stages: [
          { q: '灵感枯竭、什么都写不出来时，你会？', options: [
            { text: '允许空白，去散步、发呆、换环境', tag: '留白', effect: { energy: 2, explore: 1 }, story: '你懂得灵感不是逼出来的，是养出来的。' },
            { text: '先做大量输入，喂养自己', tag: '输入', effect: { career: 2, self: 1 }, story: '你把空白当成补给期，而不是失败。' },
            { text: '硬写，相信先完成后完美', tag: '行动', effect: { career: 2, energy: -1 }, story: '你相信动作本身会带来灵感。' }
          ] },
          { q: '作品没什么人看时，你会？', options: [
            { text: '继续做，为自己而做', tag: '自持', effect: { self: 2, meaning: 1 }, story: '你记得最初创作的快乐，不需要掌声确认。' },
            { text: '研究别人怎么做，调整方向', tag: '学习', effect: { career: 2 }, story: '你把无人问津当成数据，而不是判决。' },
            { text: '和同行交流，获得反馈', tag: '联结', effect: { relation: 2 }, story: '你没有在孤岛里硬撑。' }
          ] },
          { q: '收入不稳定让你焦虑，你会？', options: [
            { text: '接一些能糊口的活，保障基本生活', tag: '务实', effect: { career: 2, energy: 1 }, story: '你明白理想需要现实托底。' },
            { text: '相信长期积累，继续专注作品', tag: '专注', effect: { meaning: 2, self: 1 }, story: '你选择相信复利，哪怕短期看不到。' },
            { text: '规划多渠道收入，不把鸡蛋放一个篮子', tag: '经营', effect: { career: 2, steady: 1 }, story: '你开始像经营一个小事业一样经营创作。' }
          ] },
          { q: '三年后，你希望自己的创作状态是？', options: [
            { text: '能靠创作养活自己', tag: '自立', effect: { career: 2, meaning: 1 }, story: '你希望热爱与生存不再对立。' },
            { text: '作品被一些人真心喜欢', tag: '共鸣', effect: { relation: 2, meaning: 1 }, story: '你在意的是「被懂」，而不是「被多少人懂」。' },
            { text: '一直保持创作的快乐', tag: '热爱', effect: { energy: 2, self: 1 }, story: '你不愿让创作变成新的牢笼。' }
          ] }
        ]
      };
    } else if (/翻译|口译|外语/.test(text)) {
      template = {
        title: '成为「' + role + '」的模拟',
        start: '你开始走翻译这条路。它看起来是「会外语」，实际是「在两个世界之间搭桥」——每一句话，都要在准确与温度之间做选择。',
        stages: [
          { q: '一场重要会谈，发言人语速很快还带口音，你会？', options: [
            { text: '专注抓核心意思，流畅转述', tag: '顺译', effect: { career: 2, meaning: 1 }, story: '你没有被细节绊住，把意思稳稳传了过去。' },
            { text: '请对方放慢，确保准确', tag: '准确', effect: { career: 2, steady: 1 }, story: '你宁可慢一点，也不让一句话被误解。' },
            { text: '提前做足功课，熟悉背景', tag: '准备', effect: { career: 2, energy: 1 }, story: '你把功夫下在会前，现场才能从容。' }
          ] },
          { q: '你翻的一句话，双方理解出现偏差，你会？', options: [
            { text: '主动澄清，把两边的意思对齐', tag: '澄清', effect: { relation: 2, career: 1 }, story: '你没有让误解滚雪球，及时把桥修好了。' },
            { text: '如实说明，不替任何一边美化', tag: '如实', effect: { career: 2, meaning: 1 }, story: '你守住了翻译的底线：忠实。' },
            { text: '会后私下提醒，避免现场尴尬', tag: '体贴', effect: { relation: 2 }, story: '你既守住了专业，也留住了体面。' }
          ] },
          { q: '长期赶稿/连场让你疲惫，你会？', options: [
            { text: '接单有度，保护自己的节奏', tag: '节律', effect: { energy: 2, steady: 1 }, story: '你学会了说不，反而走得更远。' },
            { text: '趁热多接，快速积累', tag: '冲刺', effect: { career: 2, energy: -1 }, story: '你积累很快，但身体在记账。' },
            { text: '在专业领域深耕，做出口碑', tag: '深耕', effect: { career: 2, meaning: 1 }, story: '你选择做窄做深，成为某个领域的可靠译手。' }
          ] },
          { q: '三年后，你希望自己成为怎样的译者？', options: [
            { text: '专业扎实、值得托付的译者', tag: '专业', effect: { career: 2, meaning: 1 }, story: '你希望「TA翻的，可以放心」。' },
            { text: '能传递温度与文化的译者', tag: '人文', effect: { relation: 2, meaning: 1 }, story: '你相信翻译是让不同世界互相理解。' },
            { text: '工作与生活平衡的译者', tag: '平衡', effect: { energy: 2, self: 1 }, story: '你不想被赶稿淹没，想一直热爱这件事。' }
          ] }
        ]
      };
    } else if (/律师|法律|法务|仲裁/.test(text)) {
      template = {
        title: '成为「' + role + '」的模拟',
        start: '你走进法律这条路。它听起来是「背法条」，实际是「在规则里守护公平」——每一份文书背后，都站着真实的人和他们的命运。',
        stages: [
          { q: '接手一个证据不理想的案子，你会？', options: [
            { text: '如实评估风险，不夸大希望', tag: '诚实', effect: { career: 2, meaning: 1 }, story: '你没有给对方虚假的希望，而是给了真实的路径。' },
            { text: '全力找突破口，不轻易放弃', tag: '坚持', effect: { career: 2, energy: 1 }, story: '你在细节里找到了别人没看见的角度。' },
            { text: '建议和解，权衡利弊', tag: '务实', effect: { steady: 2, relation: 1 }, story: '你懂得有时最好的结果不是赢，而是止损。' }
          ] },
          { q: '对方提出有违你原则的要求，你会？', options: [
            { text: '守住底线，明确拒绝', tag: '底线', effect: { meaning: 2, boundary: 1 }, story: '你清楚有些线不能越，哪怕会失去一个客户。' },
            { text: '在法律框架内据理力争', tag: '据理', effect: { career: 2, meaning: 1 }, story: '你用规则说话，而不是情绪。' },
            { text: '先沟通，理解对方的真实诉求', tag: '沟通', effect: { relation: 2 }, story: '你发现很多僵局，源于没有真正听懂彼此。' }
          ] },
          { q: '长期高压、案件堆积，你会？', options: [
            { text: '建立自己的案件管理系统', tag: '系统', effect: { career: 2, steady: 1 }, story: '你靠秩序对抗混乱，让每个案子都有进度。' },
            { text: '学会把部分工作交给伙伴', tag: '协作', effect: { relation: 2, energy: 1 }, story: '你不再一个人扛，团队让你走得更远。' },
            { text: '定期运动/休息，护住自己', tag: '自护', effect: { energy: 2, care: 1 }, story: '你明白，倒下的律师帮不了任何人。' }
          ] },
          { q: '三年后，你希望自己成为怎样的法律人？', options: [
            { text: '专业过硬、让当事人安心的法律人', tag: '专业', effect: { career: 2, meaning: 1 }, story: '你希望「交给TA，我放心」。' },
            { text: '既懂规则又有温度的法律人', tag: '温度', effect: { relation: 2, meaning: 1 }, story: '你相信法律不是冰冷的条文。' },
            { text: '在专业领域深耕出独特定位', tag: '深耕', effect: { career: 2, self: 1 }, story: '你想做窄做深，成为某个领域的名字。' }
          ] }
        ]
      };
    } else if (/自媒体|博主|视频|up主|网红/.test(text)) {
      template = {
        title: '成为「' + role + '」的模拟',
        start: '你开始做自媒体。它看起来是「拍视频」，实际是「持续真诚地表达」——流量是结果，但热度会起伏，你需要在喧嚣里找到自己的节奏。',
        stages: [
          { q: '做了很久没什么人看，你会？', options: [
            { text: '复盘内容，调整方向', tag: '复盘', effect: { career: 2, steady: 1 }, story: '你把数据当地图，而不是判决。' },
            { text: '坚持做自己真正想做的', tag: '自持', effect: { meaning: 2, self: 1 }, story: '你相信真诚的内容，会等到对的人。' },
            { text: '去研究同领域做得好的账号', tag: '学习', effect: { career: 2, relation: 1 }, story: '你从别人身上学，而不是嫉妒。' }
          ] },
          { q: '评论区出现攻击性言论，你会？', options: [
            { text: '不回应，专注内容本身', tag: '稳', effect: { energy: 2, boundary: 1 }, story: '你没有让噪音带走你的注意力。' },
            { text: '理性回应一次，澄清误解', tag: '澄清', effect: { career: 1, boundary: 1 }, story: '你澄清了，但没陷入骂战。' },
            { text: '设置界限，维护创作环境', tag: '界限', effect: { boundary: 2, energy: 1 }, story: '你懂得保护自己，才能持续表达。' }
          ] },
          { q: '灵感枯竭、更新压力大，你会？', options: [
            { text: '去生活，输入新的素材', tag: '输入', effect: { explore: 2, energy: 1 }, story: '你明白没有输入，就没有输出。' },
            { text: '允许自己休息，不断更焦虑', tag: '允许', effect: { energy: 2, care: 1 }, story: '你允许热情休息，而不是假装它还在。' },
            { text: '和观众互动，听他们的故事', tag: '互动', effect: { relation: 2 }, story: '你发现观众的故事，就是最好的素材。' }
          ] },
          { q: '三年后，你希望自己的自媒体状态是？', options: [
            { text: '能靠内容体面生活', tag: '自立', effect: { career: 2, meaning: 1 }, story: '你希望表达与生存不再对立。' },
            { text: '内容被一群真正懂的人喜欢', tag: '共鸣', effect: { relation: 2, meaning: 1 }, story: '你在意的是被懂，不是被多少人懂。' },
            { text: '一直保持创作的快乐', tag: '热爱', effect: { energy: 2, self: 1 }, story: '你不愿让更新变成新的牢笼。' }
          ] }
        ]
      };
    } else if (/工程师|程序员|开发|技术/.test(text)) {
      template = {
        title: '成为「' + role + '」的模拟',
        start: '你开始走技术这条路。它看起来是「写代码」，实际是「在复杂系统里找到优雅解法」——你每天面对的是真实的问题和真实的人。',
        stages: [
          { q: '一个 bug 反复出现，你会？', options: [
            { text: '沉下心看日志，追根溯源', tag: '深挖', effect: { career: 2, self: 1 }, story: '你没有打补丁糊弄，而是找到了根因。' },
            { text: '和同事一起排查', tag: '协作', effect: { relation: 2 }, story: '你懂得「一起看」常常比独自熬更快。' },
            { text: '先记录，排好优先级', tag: '有序', effect: { career: 2, steady: 1 }, story: '你没有让一个 bug 打乱整个节奏。' }
          ] },
          { q: '产品经理提了一个模糊的需求，你会？', options: [
            { text: '追问清楚，把边界定好', tag: '澄清', effect: { career: 2, relation: 1 }, story: '你在动手前把问题问清楚了。' },
            { text: '先做最小版本，快速反馈', tag: '迭代', effect: { career: 2, explore: 1 }, story: '你用行动代替空谈。' },
            { text: '提出更合理的方案', tag: '建议', effect: { career: 2, meaning: 1 }, story: '你不只是执行，而是贡献判断。' }
          ] },
          { q: '技术更新太快，焦虑跟不上，你会？', options: [
            { text: '先吃透一门，再向外延展', tag: '纵深', effect: { career: 2, steady: 1 }, story: '你选择用深度对抗焦虑。' },
            { text: '跟热点，保持广泛接触', tag: '广度', effect: { explore: 2 }, story: '你保持嗅觉，不错过趋势。' },
            { text: '把基础打牢，以不变应万变', tag: '根基', effect: { career: 2, meaning: 1 }, story: '你相信底层能力永远不过时。' }
          ] },
          { q: '三年后，你希望自己成为怎样的工程师？', options: [
            { text: '能独当一面、解决难题的工程师', tag: '独当', effect: { career: 2, meaning: 1 }, story: '你希望成为团队里可靠的那个人。' },
            { text: '能带新人、让团队更好的工程师', tag: '带领', effect: { relation: 2, career: 1 }, story: '你希望自己的经验能点亮别人。' },
            { text: '工作与生活平衡的工程师', tag: '平衡', effect: { energy: 2, self: 1 }, story: '你不愿让代码吞掉生活。' }
          ] }
        ]
      };
    } else {
      template = {
        title: '成为「' + role + '」的模拟',
        start: '你开始走向「' + role + '」这条路。它比想象中具体：有琐事、有瓶颈、有诱惑你放弃的时刻。',
        stages: [
          { q: '刚起步，事情多而杂，你会？', options: [
            { text: '先做最重要的一件事', tag: '聚焦', effect: { career: 2, energy: 1 }, story: '你没有被琐事淹没，先抓住核心。' },
            { text: '搭好流程和习惯，再往前走', tag: '系统', effect: { steady: 2 }, story: '你相信好系统能陪你走很远。' },
            { text: '找前辈请教，少走弯路', tag: '请教', effect: { relation: 2 }, story: '你懂得借别人的经验，而不是全部亲自踩坑。' }
          ] },
          { q: '遇到一个很大的坎，你会？', options: [
            { text: '拆成小块，一步步解决', tag: '拆解', effect: { career: 2, steady: 1 }, story: '你把大山拆成可以搬的石头。' },
            { text: '先照顾好情绪，再面对问题', tag: '自护', effect: { energy: 2, care: 1 }, story: '你明白状态是解决问题的前提。' },
            { text: '向信任的人求助', tag: '求助', effect: { relation: 2 }, story: '你没有独自硬扛，这让路轻了很多。' }
          ] },
          { q: '你开始怀疑「这真的是我想要的吗」，你会？', options: [
            { text: '回到最初的动机，重新确认', tag: '回望', effect: { meaning: 2 }, story: '你问自己：当时为什么出发？' },
            { text: '允许怀疑，把它当成信息', tag: '允许', effect: { self: 2, care: 1 }, story: '你没有否定怀疑，而是听它想说什么。' },
            { text: '做一次小实验验证，而不是空想', tag: '验证', effect: { explore: 2 }, story: '你用行动回答怀疑，而不是用更多想象。' }
          ] },
          { q: '三年后，你希望自己走成什么样？', options: [
            { text: '站稳了，有了自己的位置', tag: '立足', effect: { career: 2, meaning: 1 }, story: '你希望这条路走得踏实。' },
            { text: '被一些人真心认可', tag: '认可', effect: { relation: 2 }, story: '你在意的是真实的联结。' },
            { text: '还在走，而且依然热爱', tag: '热爱', effect: { energy: 2, self: 1 }, story: '你希望热情没有在路上被磨灭。' }
          ] }
        ]
      };
    }
    return template;
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
    state.notes = [];
    SCENARIOS[sc.id] = sc;
    titleEl.textContent = sc.title;
    descEl.textContent = sc.desc;
    pickEl.classList.add('hidden');
    resultEl.classList.add('hidden');
    cardEl.classList.remove('hidden');
    renderStage();
    cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function startRoleScenario(role, theme) {
    var sc = roleScenario(role, theme);
    sc.id = 'role_' + role.slice(0, 8);
    sc.desc = '这是基于你人生设计里「或许可以成为」的方向，生成的一段职业推演。它不是预言，而是一组真实会面临的选择。';
    sc.futures = {
      career: '三年后，你在这条路上有了自己的位置。它不是最轻松的路，但每一步都是你选的。你发现，「成为' + role + '」不是一种状态，而是一连串日常决定的总和——而你已经练会了做这些决定。',
      relation: '三年后，你回看这段路，发现真正支撑你的不只是成就，还有那些陪你走过困难时刻的人。',
      energy: '三年后，你依然在路上，但你学会了另一种节奏：不再用燃烧自己证明决心。你走得不算最快，却是少数不喊累的人。',
      self: '三年后，你也许还没有抵达终点，但你比谁都清楚自己是谁、想要什么、底线在哪里。',
      meaning: '三年后，你做的事开始对一些人有了意义——而这份意义，也反过来滋养了你。',
      steady: '三年后，你不再急着证明什么。你按自己的节奏走，反而比很多慌忙的人走得更稳。',
      express: '三年后，那些曾经咽下去的话，你已经能说出来了。你被听见的机会，也随之变多。',
      explore: '三年后，你试过了几条不同的路。它们没有白费——它们共同告诉你，哪条路更像你。',
      boundary: '三年后，你更懂得什么时候该靠近、什么时候该守着自己。这份分寸，让你走得既真实又不失自己。',
      care: '三年后，你学会了在赶路时也照顾自己。这让你走得慢了一点，却走了更远。'
    };
    state.scenario = sc.id;
    state.index = 0;
    state.picks = [];
    state.notes = [];
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
    state.notes = [];
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
    if (noteInput) {
      noteInput.value = state.notes[state.index] || '';
      noteInput.setAttribute('data-idx', state.index);
    }
    backBtn.style.visibility = state.index === 0 ? 'hidden' : 'visible';
    document.getElementById('simRestart').style.visibility = isLast ? 'visible' : 'hidden';
  }

  function choose(i) {
    var s = SCENARIOS[state.scenario];
    var st = s.stages[state.index];
    var opt = st.options[i];
    state.picks[state.index] = { index: i, tag: opt.tag, text: opt.text, effect: opt.effect, story: opt.story };
    if (noteInput) {
      var n = noteInput.value.trim();
      if (n) state.notes[state.index] = n;
    }
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

  // 职业规划师确定性解读（规则版）：身份 / 优势 / 局限 / 规避 / 30天第一步
  function buildPlannerInsight() {
    var tags = state.picks.map(function (p) { return p.tag; });
    var notes = state.notes.filter(function (n) { return n; });
    var s = SCENARIOS[state.scenario];
    var isRole = state.scenario.indexOf('role_') === 0;
    var role = '';
    if (isRole && s.title) role = s.title.replace('成为「', '').replace('」的模拟', '');
    var profileTxt = (function () {
      try {
        var p = JSON.parse(window.guanGet('guan_profile') || '{}');
        var bits = [];
        if (p.job) bits.push('职业：' + p.job);
        if (p.mbti) bits.push('MBTI：' + p.mbti);
        if (p.stage) bits.push('阶段：' + p.stage);
        return bits.join('；');
      } catch (e) { return ''; }
    })();
    var paras = [];

    if (isRole && role) {
      paras.push('【你将扮演的身份】在这条路上，你会是一个「' + role + '」。不是光环里的那个头衔，而是每天面对真实问题、做真实决定的人：你要对结果负责，也要在重复与琐碎里保持方向感。');
      paras.push('【你能发挥的性格优势】结合你的档案（' + (profileTxt || '暂未填写，建议补充') + '），你在这类职业里最可能被看见的优势是：你' + (tags.indexOf('协作') > -1 || tags.indexOf('求助') > -1 || tags.indexOf('倾诉') > -1 ? '懂得借力与协作，不独自硬扛——这在职业里是成熟的信号' : tags.indexOf('边界') > -1 || tags.indexOf('界限') > -1 ? '边界清晰、能温柔而坚定地守住自己，这让你在高压职业里不易被消耗' : tags.indexOf('专业') > -1 || tags.indexOf('精进') > -1 || tags.indexOf('深耕') > -1 ? '愿意在专业上持续精进，靠谱是你最硬的招牌' : '能在压力下做出选择并承担后果，这是很多岗位最稀缺的品质') + '。');
      paras.push('【你的局限性】这条路的短板也很具体：' + (tags.indexOf('坚持') > -1 || tags.indexOf('allin') > -1 ? '你倾向投入到底，容易忽略自己的电量，长期可能倦怠' : tags.indexOf('谨慎') > -1 || tags.indexOf('审慎') > -1 || tags.indexOf('观望') > -1 ? '你习惯先看清再走，在需要「先跳再说」的机会面前可能错过窗口' : '你可能高估「只要够努力就能成」，低估了行业周期与运气成分') + '。如果不提前规避，它会成为你三年后最累的部分。');
      paras.push('【如何规避】① 给这份职业设一个「止损线」：投入多少时间/金钱后必须复盘一次；② 每周保留 2 小时做与职业无关的自己；③ 找一个同行或前辈定期对齐，避免闭门造车。');
      paras.push('【30 天第一步】' + (role.indexOf('医生') > -1 || role.indexOf('医') > -1 ? '这周先去找一位正在做这份工作的前辈做一次 30 分钟访谈，问 TA「最真实的一天是什么样的」' : role.indexOf('老师') > -1 || role.indexOf('教师') > -1 ? '这周先旁听/体验一次真实的课堂或带一次小课，感受自己是否享受「与人深度互动」' : role.indexOf('翻译') > -1 ? '这周接一个最小的真实任务（或模拟一场），看自己是否享受「在两种语言之间搭桥」' : role.indexOf('律师') > -1 || role.indexOf('法律') > -1 ? '这周读一份真实判例并写下你的分析，或约一位法律从业者聊一次' : role.indexOf('自媒体') > -1 ? '这周完成并发布一条内容，收集 3 个真实反馈' : role.indexOf('工程师') > -1 || role.indexOf('开发') > -1 ? '这周完成一个小项目（哪怕 100 行），让它跑起来' : '这周完成一次与该职业相关的真实小任务') + '。');
    } else {
      paras.push('【你将扮演的身份】你目前选择的方向，对应的不是某一个岗位，而是一组能力：' + (tags.indexOf('行动') > -1 || tags.indexOf('尝试') > -1 ? '快速试错、在行动中学习的人' : tags.indexOf('稳') > -1 || tags.indexOf('双轨') > -1 ? '在稳定与探索之间走平衡木的人' : '在自我照顾中慢慢前进的人') + '。这类人在职场里的常见落点是：项目负责人、独立执行者或「能扛事」的专业骨干。');
      paras.push('【你能发挥的性格优势】' + (tags.indexOf('借力') > -1 ? '你擅长连接资源与伙伴，适合需要协作的位置（产品、运营、咨询）。' : tags.indexOf('独立') > -1 ? '你能独立把事做完，适合需要自驱力的位置（创作者、工程师、顾问）。' : '你在压力下仍能照顾自己，适合长期主义的位置——很多岗位缺的不是聪明，是「不崩」的稳定。'));
      paras.push('【你的局限性】如果只按这次模拟的选择发展，你可能' + (tags.indexOf('allin') > -1 ? '过度投入单一方向，抗风险能力偏弱' : tags.indexOf('观望') > -1 || tags.indexOf('谨慎') > -1 ? '过于保守，错失需要果断的机会' : '节奏偏慢，容易被外部标准带跑') + '。');
      paras.push('【如何规避】① 每 30 天做一次「方向体检」：这个方向还让我有能量吗？② 保留 20% 的时间做与主线无关的探索；③ 用「完成一件最小作品」代替「想清楚再动」。');
      paras.push('【30 天第一步】' + (notes.length ? '结合你写下的「' + notes[notes.length - 1].slice(0, 30) + '…」，本周就做一件与之相关的最小真实动作，做完记录感受。' : '本周做一次与该方向相关的真实小任务（约谈一人 / 完成一个小作品 / 参加一次体验），并记录：这件事让你有能量还是消耗？'));
    }
    return paras;
  }

  function runPlannerLLM(extra) {
    var body = document.getElementById('simPlannerBody');
    if (!body) return;
    var proxyReady = !!(window.GUAN_PROXY_URL);
    var key = localStorage.getItem('guan_ai_key_deepseek') || '';
    if (!proxyReady && !key) {
      window.guanToast('内置解读通道未配置，先展示规则版分析');
      return;
    }
    body.innerHTML = '<div class="deep-loading"><div class="spinner"></div><p>正在以职业规划师视角分析你的选择…</p></div>';
    var s = SCENARIOS[state.scenario];
    var picksText = state.picks.map(function (p, i) { return (i + 1) + '. ' + p.text + (state.notes[i] ? '（你的想法：' + state.notes[i] + '）' : ''); }).join('\n');
    var profileText = '';
    try {
      var p = JSON.parse(window.guanGet('guan_profile') || '{}');
      profileText = JSON.stringify({ job: p.job, mbti: p.mbti, zodiac: p.zodiac, stage: p.stage, selfDesc: p.selfDesc, focus: p.focus });
    } catch (e) {}
    var sys = '你是专业的职业规划师。请基于用户的人生模拟选择、补充信息和档案，给出确定性的职业分析，分四段：\n' +
      '1）【你将扮演的身份】这个选择对应的职业/身份是什么，具体一点（如：自媒体内容创作者、项目经理、独立手作人）。\n' +
      '2）【你能发挥的优势】结合用户档案中的性格特质，指出哪些优势会在该职业中真正被看见。\n' +
      '3）【局限与规避】这个选择对用户的具体局限是什么，以及如何规避。\n' +
      '4）【30 天第一步】给出一个今天就能开始的、具体的行动。\n' +
      '语言要专业、确定、可执行，不空泛安慰，不夸大保证。';
    var user = '我的模拟场景：' + (s ? s.title : '') + '\n我的选择轨迹：\n' + picksText + '\n\n我的补充信息：' + (extra || '（无）') + '\n我的档案：' + (profileText || '（无）') + '\n\n请给我确定性的职业规划分析。';
    var callUrl = window.GUAN_PROXY_URL;
    if (callUrl) {
      fetch(callUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'deepseek', messages: [{ role: 'system', content: sys }, { role: 'user', content: user }], max_tokens: 2000, temperature: 0.7 })
      }).then(function (res) { return res.json(); }).then(function (data) {
        if (data && data.text) {
          body.innerHTML = data.text.split(/\n{2,}/).map(function (para) {
            return '<p style="margin-bottom:12px;line-height:2">' + para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</p>';
          }).join('');
        } else {
          window.guanToast('生成失败，展示规则版分析');
        }
      }).catch(function () { window.guanToast('生成失败，展示规则版分析'); });
    }
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

    // 职业规划师确定性解读（规则版即时展示）
    var plannerBody = document.getElementById('simPlannerBody');
    if (plannerBody) {
      plannerBody.innerHTML = buildPlannerInsight().map(function (p) {
        return '<p style="margin-bottom:12px;line-height:2">' + p + '</p>';
      }).join('');
    }
    var plannerBtn = document.getElementById('plannerBtn');
    if (plannerBtn) {
      plannerBtn.onclick = function () {
        var extra = (document.getElementById('plannerInput') || {}).value || '';
        runPlannerLLM(extra);
      };
    }

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
  // 设计方案的「或许可以成为」入口
  var planEntry = document.getElementById('simPlanEntry');
  var plan = planResult();
  if (plan && plan.roles && planEntry) {
    planEntry.style.display = 'flex';
    var roleBox = document.getElementById('simPlanRoles');
    plan.roles.forEach(function (r, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sim-script role-btn';
      btn.innerHTML = '<span class="sim-en">原型 ' + ['A', 'B', 'C'][i] + '</span><h3>' + r.role + '</h3><p>' + r.desc + '</p>';
      btn.addEventListener('click', function () {
        startRoleScenario(r.role, plan.theme);
      });
      roleBox.appendChild(btn);
    });
  }

  // 不满意预见结果 -> 写下理想 -> 联动档案
  document.getElementById('idealSave').addEventListener('click', function () {
    var ideal = document.getElementById('idealInput').value.trim();
    if (!ideal) { window.guanToast('先写下一个你真正想成为的样子'); return; }
    window.guanSet('guan_ideal', JSON.stringify({ ideal: ideal, date: new Date().toISOString() }));
    document.getElementById('idealNote').textContent = '已记入你的档案。从现在开始，它不再只是一个念头——它是一份三十天路径的起点。去「三十天陪伴」里，让第一个星期为你而开始。';
    document.getElementById('idealNote').innerHTML = '已记入你的档案。从现在开始，它不再只是一个念头——它是一份三十天路径的起点。<a href="journey.html" class="btn btn-gold btn-sm" style="margin-top:8px">去三十天陪伴，开始第一周</a>';
    window.guanToast('已记下你的理想，路径已生成');
  });
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
