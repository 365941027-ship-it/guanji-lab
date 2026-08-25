(function () {
  'use strict';

  var painEl = document.getElementById('painInput');
  var wishEl = document.getElementById('wishInput');
  var timeEl = document.getElementById('timeInput');
  var moneyEl = document.getElementById('moneyInput');
  var assetEl = document.getElementById('assetInput');
  var blockEl = document.getElementById('blockInput');
  var goalEl = document.getElementById('goalInput');
  var output = document.getElementById('designOutput');
  var routesEl = document.getElementById('designRoutes');
  var principlesEl = document.getElementById('designPrinciples');
  var introEl = document.getElementById('designIntro');
  var simBlockEl = document.getElementById('designSimBlock');
  var becomingEl = document.getElementById('designBecoming');
  var plan30El = document.getElementById('designPlan30');

  var lastPlan = null;

  function profile() {
    try {
      return JSON.parse(window.guanGet('guan_profile') || '{}');
    } catch (e) {
      return {};
    }
  }

  // 职业规划师对标库：每个主题下三个原型 → 参考职业 + 优势 + 短板 + 转变
  var CAREER_MAP = {
    work: [
      {
        tag: '原型 A · 把热爱做成事业',
        title: '在旧路上长出新方向',
        careers: [
          { name: '自媒体人 / 内容创作者', why: '你的核心是把「感兴趣的事」持续产出并被人看见——这正是内容创作的工作方式。' },
          { name: '自由撰稿人 / 专栏作者', why: '你能把一个主题研究透、写出有温度的表达，适合以文字建立个人品牌。' },
          { name: '手作 / 独立品牌主理人', why: '你重视亲手做出「自己的作品」，小体量品牌让你从 0 到 1 完整走一遍。' }
        ]
      },
      {
        tag: '原型 B · 敢为方向做决定',
        title: '向已经在路上的人提问',
        careers: [
          { name: '产品经理', why: '你习惯先想清楚方向再行动，擅长在不确定里做决定并推进落地。' },
          { name: '项目管理 / 运营负责人', why: '你擅长连接人、资源和节奏，把「想清楚」变成「做出来」。' },
          { name: '创业顾问 / 商业分析', why: '你擅长访谈、拆解真实案例，把别人的路变成可借鉴的方法。' }
        ]
      },
      {
        tag: '原型 C · 平衡现实与理想',
        title: '用作品说话',
        careers: [
          { name: '设计师 / 创意策划', why: '你既在意表达，也在意落地——设计是把理想装进现实的容器。' },
          { name: '教师 / 培训师', why: '你擅长把复杂的东西讲清楚，并在稳定的职业框架里保留表达空间。' },
          { name: '咨询顾问 / 教练', why: '你用作品和对话帮助具体的人，同时保持现实层面的可持续。' }
        ]
      }
    ],
    create: [
      {
        tag: '原型 A · 让创造成为日常',
        title: '每天留 45 分钟给热爱',
        careers: [
          { name: '插画师 / 独立创作者', why: '你的天赋是稳定产出——这是自由创作者最稀缺的能力。' },
          { name: '设计师 / 视觉传达', why: '你愿意每天打磨手艺，视觉行业奖励持续投入的人。' },
          { name: '写作者 / 文案策划', why: '你相信日常练习的力量，写作是复利最明显的职业。' }
        ]
      },
      {
        tag: '原型 B · 让作品被看见',
        title: '第一次公开发布',
        careers: [
          { name: '内容运营 / 自媒体', why: '你敢于把作品放到世界面前，并愿意根据反馈迭代。' },
          { name: '短视频编导 / 视频创作者', why: '「被看见」本身就是这个职业的日常，你的勇气是入场券。' },
          { name: '公关 / 品牌传播', why: '你理解「作品如何被接收」，这是传播工作的核心。' }
        ]
      },
      {
        tag: '原型 C · 让热爱服务他人',
        title: '用热爱为一个人解决问题',
        careers: [
          { name: '自由职业者 / 个人服务', why: '你愿意把能力用在具体的人身上，服务型自由职业正好是这条路。' },
          { name: '咨询顾问 / 生涯教练', why: '你的共情+创造组合，能让对方感到被理解也被推进。' },
          { name: '教育者 / 技能导师', why: '你用热爱帮助别人成长，把「我的擅长」变成「别人的能力」。' }
        ]
      }
    ],
    relation: [
      {
        tag: '原型 A · 练习说出真实需要',
        title: '诚实表达',
        careers: [
          { name: '心理咨询师 / 倾听师', why: '你重视真实表达与情感连接，助人工作是这种天赋的自然延伸。' },
          { name: 'HR / 组织发展', why: '你擅长在人与组织之间搭桥，沟通敏感度高是核心竞争力。' },
          { name: '教练 / 调解人', why: '你敢于说出别人不敢说的话，调解正是把冲突变成对话。' }
        ]
      },
      {
        tag: '原型 B · 温柔而坚定地设界',
        title: '界限练习',
        careers: [
          { name: '管理者 / 团队负责人', why: '边界清晰的管理者最能保护团队，也最受信任。' },
          { name: '律师 / 法务', why: '你在规则里守住底线，正是法律职业的核心素质。' },
          { name: '创业者 / 独立负责人', why: '创业每天都要说不，你的界限感是长期生存的前提。' }
        ]
      },
      {
        tag: '原型 C · 深度对话',
        title: '一次深入的在场',
        careers: [
          { name: '教师 / 导师', why: '你擅长让人被看见、被倾听，教育的内核正是深度对话。' },
          { name: '咨询师 / 社工', why: '你的在场能力让脆弱的人感到安全，这是助人职业的地基。' },
          { name: '记者 / 访谈类内容', why: '你善于挖掘真实故事，深度访谈是你的表达方式。' }
        ]
      }
    ],
    freedom: [
      {
        tag: '原型 A · 在当下开一扇窗',
        title: '最小自由',
        careers: [
          { name: '自由职业者（先副业后转正）', why: '你需要的不是立刻辞职，而是先拥有「我说了算」的时段——副业是最安全的练习。' },
          { name: '数字游民类岗位（远程工作）', why: '远程岗位把「地点自由」变成可选项，适合先以现有技能切换。' }
        ]
      },
      {
        tag: '原型 B · 探索实验',
        title: '去一个没去过的地方',
        careers: [
          { name: '跨领域从业者（如转行）', why: '你的探索本能适合在行业边缘找机会，那里竞争小、可能性大。' },
          { name: '品牌 / 市场 / 新业务开拓', why: '你愿意接触陌生领域，市场岗位奖励这种「新输入」。' }
        ]
      },
      {
        tag: '原型 C · 建立基地',
        title: '先建好出发的营地',
        careers: [
          { name: '技术工匠 / 专业纵深岗位', why: '你把基础打牢，专业纵深本身就是最稳的自由基地。' },
          { name: '财务 / 稳定型专业岗位', why: '你重视安全感，这类岗位能给你「可以随时出发」的底气。' }
        ]
      }
    ],
    stable: [
      {
        tag: '原型 A · 在当下开一扇窗',
        title: '最小自由',
        careers: [
          { name: '稳定平台 + 副业创作者', why: '你在稳定里留一扇窗，把热爱放在下班后的固定时段。' },
          { name: '事业单位 / 国企 + 兴趣深耕', why: '稳定不是牢笼，配上兴趣就是双引擎。' }
        ]
      },
      {
        tag: '原型 B · 探索实验',
        title: '去一个没去过的地方',
        careers: [
          { name: '内部转岗 / 新项目负责人', why: '你不必换公司，先在现有平台里探索新的位置。' },
          { name: '考证 / 进修后转岗', why: '用确定的学习换未来的选择权，是最稳的探索。' }
        ]
      },
      {
        tag: '原型 C · 建立基地',
        title: '先建好出发的营地',
        careers: [
          { name: '会计 / 审计 / 风控', why: '你的稳健倾向与这类职业高度匹配，越久越值钱。' },
          { name: '公务员 / 事业单位', why: '你重视可预期性，体制内的长期主义适合你。' }
        ]
      }
    ],
    growth: [
      {
        tag: '原型 A · 把热爱做成事业',
        title: '在旧路上长出新方向',
        careers: [
          { name: '内容创作者 / 自媒体人', why: '成长型的人适合「边学边输出」，内容职业把学习变成资产。' },
          { name: '知识付费 / 课程设计', why: '你善于把迷茫变成方法论，帮助同样在找方向的人。' }
        ]
      },
      {
        tag: '原型 B · 敢为方向做决定',
        title: '向已经在路上的人提问',
        careers: [
          { name: '生涯规划师 / 职业顾问', why: '你自己走过探索期，最能帮别人把路看清。' },
          { name: '行业研究 / 战略分析', why: '你擅长收集真实案例并提炼规律，这是研究工作的本质。' }
        ]
      },
      {
        tag: '原型 C · 平衡现实与理想',
        title: '用作品说话',
        careers: [
          { name: '产品 / 项目双轨从业者', why: '你既能仰望方向，也能落地执行，正是产品岗位需要的组合。' },
          { name: '教师 / 导师', why: '你把成长的困惑转化为可教的路径，教育的价值就在于此。' }
        ]
      }
    ]
  };

  function themeMapKey(theme) {
    return CAREER_MAP[theme] ? theme : 'growth';
  }

  function userIdentity() {
    var p = profile();
    var job = (p.job || '').trim();
    if (/学生|在读|研究生|大学生/.test(job)) return 'student';
    if (/自由|创业者|个体/.test(job)) return 'freelancer';
    if (job) return 'worker';
    return '';
  }

  function identityHint() {
    var id = userIdentity();
    if (id === 'student') return '你是学生身份，下面的方案会围绕「学业之外的时间、实习/项目/作品集」展开，不会建议你在学业上冒险。';
    if (id === 'freelancer') return '你已经有自由职业的底子，方案会把「时间自由」当作既有资源来放大。';
    if (id === 'worker') return '方案会基于你「在职」的现状设计，先不辞职、用最小实验验证方向。';
    return '';
  }

  function simResult() {
    try {
      return JSON.parse(window.guanGet('guan_sim') || 'null');
    } catch (e) {
      return null;
    }
  }

  function has(q, words) {
    return words.some(function (w) { return q.indexOf(w) > -1; });
  }

  function pickTheme(pain, wish) {
    var text = pain + wish;
    var score = { work: 0, create: 0, relation: 0, freedom: 0, stable: 0, growth: 0 };
    score.work += has(text, ['工作', '职业', '事业', '上班', '老板', '升职', '同事', '行业']) ? 2 : 0;
    score.create += has(text, ['创造', '创作', '作品', '写作', '画画', '音乐', '产品', '项目', '手艺']) ? 2 : 0;
    score.relation += has(text, ['关系', '感情', '伴侣', '朋友', '家人', '婚姻', '孤独', '亲密']) ? 2 : 0;
    score.freedom += has(text, ['自由', '时间自由', '不被', '束缚', '远方', '旅行', '辞职']) ? 2 : 0;
    score.stable += has(text, ['稳定', '安稳', '安全感', '房子', '储蓄', '保险', '踏实']) ? 2 : 0;
    score.growth += has(text, ['成长', '学习', '进步', '迷茫', '方向', '意义', '内耗', '消耗', '探索']) ? 2 : 0;
    var sorted = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; });
    return sorted[0];
  }

  function buildRoutes(theme, wish, resource) {
    var routes = [];
    var res = resource ? '用「' + resource + '」作为实验边界' : '用你愿意投入的最小资源作为边界';
    var cm = CAREER_MAP[themeMapKey(theme)];
    if (theme === 'work' || theme === 'growth') {
      routes.push({
        tag: cm[0].tag,
        title: '在旧路上长出新方向',
        body: '不急着辞职。在现有工作里找出一个你相对有热情的小切口，用 30 天把它做成「你的作品」。',
        careers: cm[0].careers,
        deep: [
          '「微转型」的意思，不是让你在现状里硬撑，而是让你在旧路上开一扇新窗。很多时候，我们想离开一份工作，不是这份工作完全没有价值，而是我们在这份工作里已经找不到「我还在成长」的证据。而成长的证据，往往不是换一个环境就能获得的——它需要在某个具体的事上，重新被看见。',
          '所以这条思路建议你做的第一件事，不是辞职，而是「找一个切口」：在你现有的工作里，找出一个你相对有热情、有一定自主空间、又能被看见的小方向。它可能是一个一直没人认真做的新项目，可能是一项你想学但一直没机会用的技能，也可能是一个你早就想改进却总被搁置的流程。',
          '选定切口之后，用三十天把它做成一件「你的作品」：不追求完美，只追求完成。做完之后，你会得到一份比任何分析都真实的反馈——这件事做起来，是让你感到消耗，还是让你忘记时间？是让你更确信方向，还是让你看清自己并不喜欢它？',
          '这个实验最珍贵的地方在于：它不赌上你的全部。你保留着收入、退路和安全感，同时给了「可能」一个真实发生的空间。如果它让你感到兴奋，你就拿到了下一步的线索；如果它让你疲惫，你也拿到了同样珍贵的排除项。',
          '很多人不敢「微转型」，是因为怕它太慢。但请相信：真正的换轨很少是跳过去的，大多是像火车一样，在减速中慢慢驶入另一条轨道。你今天的 30 天实验，就是那段减速——它不是拖延，是让改变以你承受得起的节奏发生。',
          '你不需要在这 30 天里找到「人生答案」。你只需要回答一个小问题：当我给那个念头一块真实的时间，它会长成什么？这个答案，会成为你下一段路的地图。'
        ]
      });
      routes.push({
        tag: cm[1].tag,
        title: '向已经在路上的人提问',
        body: '列出三位正在做你想做之事的人，每周约谈一位，听真实的故事。',
        careers: cm[1].careers,
        deep: [
          '在你犹豫是否换一条路的时候，最危险的并不是「不知道」，而是「靠想象知道」。我们很容易把别人的生活想象得很美好，也很容易把自己的未来想象得很可怕——这两种想象，都会让我们做出失真的决定。',
          '访谈实验，就是用真实取代想象。请列出三位正在做你想做之事的人，不一定是大人物，甚至最好是比你早走两三年的普通人：他们离你的位置最近，也最了解这条路上的真实路况。',
          '约谈时，别问「我该不该转行」——这个问题没有人能替你回答。去问那些具体的问题：你是怎么开始的？开始之前你准备了什么？最难的时候是什么样？如果重来一次，你会怎么走？这些问题会给你三样东西：真实的过程、具体的困难、以及「原来这条路也有人走过」的踏实感。',
          '你可能会发现，那些看似光鲜的路，背后也有漫长的枯燥和不确定；你也可能会发现，那些看起来很难的障碍，其实有现成的过法。无论哪种发现，都比你在原地想象一百遍更有价值。',
          '访谈不是请对方替你决定，而是请对方借给你一双眼睛。听完三个人的故事，你未必会立刻知道「我要不要走」，但你一定会更清楚「这条路真实的样子」——而真实，是任何决定的底气。',
          '请带着好奇而不是求证的心去。你不是去确认「我应该转」，也不是去收集「我不行的证据」——你只是去听，去问，去把想象换成故事。故事听够了，方向自然会慢慢浮现。'
        ]
      });
      routes.push({
        tag: cm[2].tag,
        title: '用作品说话',
        body: '围绕你的渴望，30 天产出一个最小的公开作品，让世界告诉你下一步。',
        careers: cm[2].careers,
        deep: [
          '「作品实验」的前提很简单：与其反复问「我能不能行」，不如做出一件东西，让世界回答你。想法在头脑里永远是模糊的，只有被做成作品，它才会第一次以真实的形状出现在你面前——也会第一次收到真实的反馈。',
          '这个作品不需要大，但它需要「完成并被人看见」：可以是一篇你思考了很久的文章，可以是一个小工具、一份分析、一次分享，也可以是你一直想做的某个创作。关键是：它必须是完整的，而不是完美的；它必须被至少一个人看见，而不是只存在你的草稿箱里。',
          '你可能会害怕作品不够好。请记得：第一件作品的任务从来不是惊艳世界，而是让你和世界开始对话。别人会告诉你他们被什么触动、在哪里困惑、想要更多什么——这些反馈，比你自己纠结一百遍「好不好」有价值得多。',
          '在做的过程中，你也会更了解自己：什么让你愿意熬夜，什么让你想放弃，什么让你在完成后感到满足。这些感受，是比任何测试都准的方向信号。',
          '如果你担心「现在还没准备好」，请允许自己用粗糙的版本开始。粗糙的完成，好过完美的想象。因为想象不会给你反馈，而作品会。',
          '三十天后，无论作品反响如何，你都已经是「做出过作品的人」了。这个身份本身，就会悄悄改变你看待自己的方式——你不再是那个「想换路却什么都没做」的人，而是那个「已经留下了第一块石头」的人。'
        ]
      });
    } else if (theme === 'create') {
      routes.push({
        tag: cm[0].tag,
        title: '让创造成为日常',
        body: '每天留出 45 分钟的创造时间，只做你热爱的产出，30 天不断档。',
        careers: cm[0].careers,
        deep: [
          '「每日创造」不是逼自己每天都有灵感，而是给创造一个稳定的位置。灵感是客人，它来去不定；但如果你连一张椅子都没有摆好，客人来了也无处可坐。每天 45 分钟，就是在为灵感摆好那张椅子。',
          '这 45 分钟里，你只需要做一件事：在你热爱的方向上持续在场。写作也好，画画也好，做设计也好，做手工也好——重要的不是产出多少，而是你每天都会回到这里。创造最怕的不是慢，是断；断掉一次，重启的心理成本会成倍增加。',
          '你可能会遇到「今天没状态」的日子。请允许那天坐在椅子上，什么也不做，或者做得很烂。在场本身就够——因为创造的本质，不是每一次都出成果，而是你选择一次次回来。',
          '三十天之后，你会拥有一件最珍贵的东西：证据。你不再只是「想创造的人」，你是「连续三十天创造过的人」。这个证据会改变你和创造的关系：它不再是需要等待灵感的奢侈，而是你可以随时回到的地方。',
          '如果你担心坚持不下来，请把 45 分钟放在一天里你最不容易被打扰的时段，并且把标准降到最低：今天写三行也行，画一个圈也行。低门槛的开始，才能换来持续的在场。',
          '创造不是为了成为大师，而是为了让你的一部分以具体的形式存在。你每天给它的那 45 分钟，是在对自己说：我想做的事，值得被认真对待。'
        ]
      });
      routes.push({
        tag: cm[1].tag,
        title: '第一次被看见',
        body: '选一个你最满意的作品，公开发布，观察真实反馈。',
        careers: cm[1].careers,
        deep: [
          '作品如果不被看见，就还只是自我表达；被看见之后，它才开始和世界对话。「第一次被看见」这条思路，是邀请你迈出这一步：选一个你相对满意的作品，公开发布到任何一个平台。',
          '发布之前，请先调整期待：这次发布的使命不是「爆红」，而是「收到真实反馈」。哪怕只有一个人回应，那也是真实世界给你的第一条信息——它比你在内心演练一百遍观众反应更有价值。',
          '你可能会紧张，担心被评价。请记得：观众看到的，不是你全部的犹豫和修改过程，他们看到的只是作品本身。而作品是会被原谅的——它不完美，但它存在。这已经胜过许多从未被看见的完美想象。',
          '发布之后，请认真观察反馈：谁停留了？谁回应了？他们问了什么问题？哪些地方让他们共鸣？这些反馈不是对你好坏的评判，而是地图——它告诉你，你的表达与世界之间，哪里相通，哪里还有距离。',
          '如果你不知道发什么平台，就从你日常待得最久的地方开始：朋友圈、小红书、公众号、视频号，都可以。平台不是重点，重点是「让作品出门」这件事本身。',
          '三十天后，你会有第一个关于「我的作品被世界如何接收」的真实样本。无论结果如何，你都已经完成了创造者最重要的一课：把作品从心里，放到世界上。'
        ]
      });
      routes.push({
        tag: cm[2].tag,
        title: '把热爱变成服务',
        body: '找一个真实的人，用你的创造能力为 TA 免费做一件小事。',
        careers: cm[2].careers,
        deep: [
          '热爱一旦开始为别人服务，它就从「我喜欢」变成了「对你有用」——这是创造走向价值的第一步。「服务实验」邀请你：找一个真实的人，用你的创造能力，免费为 TA 做一件小事。',
          '可以是为朋友写一篇小文章，可以为同事做一页设计，可以帮家人整理一份方案，也可以为一个你想帮助的群体做一个小工具。关键是：这件事要用上你热爱的能力，并且服务于一个真实的人。',
          '做完之后，请认真地问 TA 一个问题：「这对你有帮助吗？」——不是问「我做得怎么样」，而是问「它有没有真的帮到你」。这个答案，会告诉你两件事：你的热爱里，哪些部分能转化为别人的价值；以及你离「用热爱做事」还差多远。',
          '你可能会担心自己「还不够专业」。请放心：对于第一次服务，真诚比专业更重要。你不需要完美，你只需要用心，并且愿意倾听反馈。',
          '这次实验真正的礼物，是让你尝到「我的热爱有用」的滋味。那是一种很不一样的能量：它不再只是自我满足，而是一种与世界相连的踏实感。',
          '三十天后，无论对方给出什么反馈，你都已经完成了一次完整的闭环：从热爱出发，穿过真实的需求，抵达价值。这条路径，你已经走通了第一次——而它，正是你未来方向最实在的预演。'
        ]
      });
    } else if (theme === 'relation') {
      routes.push({
        tag: cm[0].tag,
        title: '练习说出真实需要',
        body: '每周至少一次，向一个重要的人说出一个真实的感受或需要。',
        careers: cm[0].careers,
        deep: [
          '关系中许多的「没办法」，其实都不是没办法，而是「说不出口」。我们习惯先猜对方怎么想，习惯把需要咽回去，习惯用沉默和情绪代替语言——直到关系里积满未说出口的话。',
          '「诚实表达」这条路，邀请你做一件很小但很不容易的事：每周至少一次，向一个重要的人，说出一个真实的感受或需要。不需要完美的措辞，不需要选在完美的时机——说出来，本身就是最大的练习。',
          '你可以从最小的真实开始：「我今天有点累，想安静一会儿」；「你刚才那句话让我有点难过」；「我希望周末我们能好好待一会儿」。这些话听起来简单，却是许多关系里最稀缺的勇气。',
          '每次表达之后，请记下你的感受：对方接住了吗？关系有变化吗？你心里是更轻松，还是更害怕？这些记录，会慢慢绘出你的关系地图——你会在上面看见，哪些表达带来了靠近，哪些还需要练习。',
          '你可能会担心表达会让对方生气。请记得：真实的表达不保证被接受，但它保证了「你不再假装」。而真正让关系受伤的，从来不是表达，而是长期的沉默。',
          '三十天后，你会发现一件微妙的事：那些曾经咽下去的话，开始有了出口；而关系，也开始因为你的真实而重新流动。你没有改变任何人，你只是不再替所有人保密。'
        ]
      });
      routes.push({
        tag: cm[1].tag,
        title: '温柔而坚定地说不',
        body: '每周练习一次带着善意的拒绝。界限不是关系的敌人，模糊才是。',
        careers: cm[1].careers,
        deep: [
          '「不」这个字，对很多人来说，是关系里最难说出口的话。我们怕拒绝会伤害关系，怕对方失望，怕自己被评价为自私——于是我们把「不」咽下去，把委屈咽下去，直到某天发现，自己已经在关系里消失很久了。',
          '界限练习邀请你重新认识「不」：它不是关系的敌人，而是让关系长久的基础设施。一个从不说不的人，给出的「是」也会渐渐失去分量；而一个能温柔说不的人，他的「是」才真正有意义。',
          '练习可以从最小的事开始：拒绝一件不想参加的活动，拒绝一次不想答应的请求，拒绝一个临时加进来的安排。说「不」的时候，不需要长篇解释，不需要反复道歉——一句「这次不行」加上真实的理由，就足够。',
          '每次练习后，请留意你的感受：对方生气了吗？关系崩塌了吗？还是说，天并没有塌，而你第一次觉得，自己站在了属于自己的位置上？',
          '你会慢慢发现，真正在意你的人，不会因为一次拒绝离开；而那些因为你设限而离开的人，本来就不值得你耗尽自己。界限不是把别人推开，而是让愿意靠近的人，知道怎么靠近你。',
          '三十天后，你可能会惊讶：原来「不」可以如此温柔，也如此有力。它不是一堵墙，而是一扇你终于学会开关的门。'
        ]
      });
      routes.push({
        tag: cm[2].tag,
        title: '一次深入的对话',
        body: '安排一次与重要之人的深度对话，不解决问题，只在场。',
        careers: cm[2].careers,
        deep: [
          '日常的关系里，我们交换信息，却很少交换真实。我们聊天气、聊工作、聊安排，却很少坐下来问对方：「你最近在经历什么？你最需要的是什么？」——而这两个问题，恰恰是关系最深处的入口。',
          '「深度对话」邀请你：安排一次与重要之人的对话，一到两个小时，没有手机，没有其他安排。它不是一场谈判，不是一次说教，也不是一次审判——它只是两个人，认真地听，认真地讲。',
          '对话不需要主题，只需要两个问题作为入口：你最近在经历什么？你现在最需要的是什么？然后，让话自然地流淌。允许沉默存在——沉默不是尴尬，是话正在心里成形。',
          '在这两个小时里，请放下「我要解决你的问题」的念头。很多时候，对方需要的不是方案，而是「我在」的确认。被认真倾听，本身就是一种深深的疗愈。',
          '你可能会担心「不知道说什么」。请放心：对话的质量不取决于话题，而取决于在场。当你真正听的时候，对方会感受到；当你真正说的时候，你也会听见自己。',
          '三十天后，你会拥有一个属于你们的时刻——它可能改变不了所有问题，但它会成为你们关系里的一盏灯：提醒你们，即使生活再忙，也曾经有这样一次，彼此完整地在场。'
        ]
      });
    } else {
      var fm = CAREER_MAP[themeMapKey(theme)];
      routes.push({
        tag: fm[0].tag,
        title: '在当下开一扇窗',
        body: '不改变全局，先在生活里制造一个「自由孤岛」。',
        careers: fm[0].careers,
        deep: [
          '当你感到被生活困住时，改变全局看起来遥不可及——但自由不一定只存在于远方。它也可以是一个很小的孤岛：每周一段完全属于你的时间，一个完全由你决定的决定，一件只为取悦你而做的事。',
          '「最小自由」这条思路，是邀请你先在当下的生活里，开一扇窗。你不需要辞职、不需要远行、不需要推翻一切——你只需要在每天或每周的某个角落，为「我想要」留出一个位置。',
          '这个位置可以是周五晚上的两小时，可以是早晨醒来后的二十分钟，可以是一件你一直想做却总说「没时间」的小事。它的关键不在于大小，而在于：这段时间里，没有任何人安排你，只有你在选择自己。',
          '你可能会发现，仅仅「知道自己每周有一块完全属于自己的时间」，就足以让一周的压力变得可以承受。自由不需要很大，它需要真实——真实的自由，是「我说了算」的感觉。',
          '三十天后，你会拥有一个自己的锚点。它不是逃离现实的出口，而是让你在现实中站稳的方式：因为你知道了，无论生活多拥挤，你都有能力为自己留出空间。',
          '请记住：你不是在等自由来，你是在练习拥有自由的能力。而这项能力，会陪你走很远——远到有一天，那个小小的孤岛，会长成你真正想住的地方。'
        ]
      });
      routes.push({
        tag: fm[1].tag,
        title: '去一个没去过的地方',
        body: '三十天里做三次低成本探索，让新的输入带来新的选择。',
        careers: fm[1].careers,
        deep: [
          '人不是被环境困住的，是被「已知」困住的：我们反复走同一条路、见同一群人、想同一个问题，然后惊讶于生活没有新意。其实，新的选择很少来自更努力地思考，更多来自新的输入。',
          '「探索实验」邀请你：三十天里做三次低成本的探索。去一个从没去过的街区，参加一个陌生领域的活动，和一位新认识的人聊三十分钟。每一次探索都不需要宏大，只需要「新」。',
          '新的地方会激活新的感官，新的人会带来新的视角，新的领域会让你发现「原来还有这样的活法」。这些输入不会立刻改变你的人生，但它们会在你的心里种下新的选项——而选项，是自由的前提。',
          '你可能会觉得「这些有什么意义」。请相信：意义不总是立刻显现的。很多重要的转折，最初都只是一个小小的「原来还可以这样」。你现在的探索，就是在为未来的转折储备可能性。',
          '请带着开放而不是评判的心去。不要急着判断「这个适不适合我」，先让它进来。适合与否，是之后的事；此刻，你只需要让自己被世界的新鲜触碰。',
          '三十天后，你可能会发现：世界比你想象的更大，而你自己，也比想象中更有选择。那些你以为的「别无选择」，很多时候只是因为还没见过足够多的可能。'
        ]
      });
      routes.push({
        tag: fm[2].tag,
        title: '先建好出发的营地',
        body: '自由需要基地支撑：先把一项基础打牢。',
        careers: fm[2].careers,
        deep: [
          '我们常常把自由理解成「没有牵绊」——没有房贷、没有责任、没有必须做的事。但真正的自由，其实是有能力选择自己的牵绊：你可以选择留下，也可以选择出发，而两者都不让你恐惧。这种自由，需要基地。',
          '「建立基地」这条思路，邀请你先打牢一项基础：存款、技能、健康、或住所的稳定。不必全部做到，只选一项，三十天内让它前进一小步。',
          '不要小看这一步。一个月的存款会给你选择的底气，一项技能的进步会给你改变的资本，规律的睡眠会给你面对风浪的体力。基地不是束缚，它是你出发时脚下的地面。',
          '你可能会觉得「这太慢了」。但请想想：所有让你羡慕的「说走就走」，背后都有一块别人看不见的地基。你今天的慢，是在为未来的自由蓄力。',
          '在打地基的三十天里，请同时保持一个小小的窗口：每周做一件与未来相关的探索。基地和窗口缺一不可——没有基地，探索会变成冒险；没有窗口，基地会变成牢笼。',
          '三十天后，你会站在一块更稳的地面上。然后你会发现：自由不是没有牵绊，而是你有能力选择自己的牵绊。而你，正在获得这个能力。'
        ]
      });
    }
    return routes;
  }

  function buildPrinciples() {
    var list = [];
    var p = profile();
    var who = window.guanGet('guan_who') || '';
    var archetype = who;
    var stage = who;
    var energy = window.guanGet('guan_energy_map') || '';
    var burnout = window.guanGet('guan_pressure') || '';
    var attachment = window.guanGet('guan_relation_map') || '';
    var drain = window.guanGet('guan_energy_map') || '';
    var pleasing = window.guanGet('guan_relation_map') || '';
    var learning = window.guanGet('guan_talent') || '';
    var values = window.guanGet('guan_life_want') || '';
    if (archetype && archetype.indexOf('探索者') > -1) list.push('你的原型倾向是探索者——设计里记得留出「新」的部分，但也要为它配上「留下来深耕」的锚。');
    if (archetype && archetype.indexOf('创造者') > -1) list.push('你的原型倾向是创造者——每次只选一个作品集中完成，比同时开十个头更接近成品。');
    if (archetype && archetype.indexOf('觉知者') > -1) list.push('你的原型倾向是觉知者——把直觉写下来、说出来，让它从感受变成选择。');
    if (archetype && archetype.indexOf('重构者') > -1) list.push('你的原型倾向是重构者——打破之前先问：这个结构是必须拆，还是可以修？');
    if (archetype && archetype.indexOf('守护者') > -1) list.push('你的原型倾向是守护者——设计里请把「照顾自己」列为第一优先级，像照顾别人一样。');
    if (stage && stage.indexOf('探索期') > -1) list.push('你处于探索期——30 天的目标不是选对，而是试够：低成本实验的数量决定方向浮现的速度。');
    if (stage && stage.indexOf('重构期') > -1) list.push('你处于重构期——前两周先整理旧地基（情绪、旧模式），再启动新计划，顺序不能反。');
    if (stage && stage.indexOf('积累期') > -1) list.push('你处于积累期——砍掉分散目标的事，把 80% 精力押注在唯一核心目标上。');
    if (stage && stage.indexOf('转型期') > -1) list.push('你处于转型期——不要一次跳跃，先让新路在旧路边缘长出嫩芽，再决定换轨。');
    if (values && values.indexOf('自由') > -1) list.push('你重视自由——设计方案里请保留「可退出」的选项，这会让你更敢于开始。');
    if (values && values.indexOf('联结') > -1) list.push('你重视联结——把重要的人写进你的计划：你的设计需要同行者，而不是孤独执行。');
    if (values && values.indexOf('创造') > -1) list.push('你重视创造——为每个阶段设定一个「作品」，让过程有可看见的产出。');
    if (values && values.indexOf('安定') > -1) list.push('你重视安定——设计里的每一步都配上「安全垫」，你会因此走得更稳、更远。');
    if (energy && energy.indexOf('电量偏低') > -1) list.push('你最近的能量状态偏疲惫——先执行两周「减半计划」：日程砍半、睡眠补足，再启动原型实验。');
    if (energy && energy.indexOf('能量饱满') > -1) list.push('你最近能量饱满——现在适合启动原型实验，把你的创造力集中投给一个方向。');
    if (energy && energy.indexOf('能量萌芽') > -1) list.push('你正处在萌芽期——别急着要结果，先为你的新想法安排最小的一步，让它先活着。');
    if (burnout && burnout.indexOf('安静蓄力') > -1) list.push('你的生长测试显示你正在蓄力——方案前两周请以「恢复+准备」为主，不急着冲刺。');
    if (burnout && burnout.indexOf('蜕变重生') > -1) list.push('你的生长测试显示你正在蜕变——方案请按「双轨实验」设计：保留现有一部分，同时每周固定投入新方向。');
    if (burnout && burnout.indexOf('向外探索') > -1) list.push('你正在向外探索——请为方案里的每个行动写清「为什么」，探索需要意义感作为燃料。');
    if (burnout && burnout.indexOf('向下扎根') > -1) list.push('你正在向下扎根——方案请少开新头，把 80% 精力押注在唯一核心方向上。');
    if (attachment && attachment.indexOf('焦虑型靠近') > -1) list.push('你的依恋风格偏焦虑——执行方案时请找一个「稳定同行者」定期同步，你会因此更有安全感。');
    if (attachment && attachment.indexOf('回避型靠近') > -1) list.push('你的依恋风格偏回避——方案请保留足够的独处空间，但也请每周向一个人同步一次进度。');
    if (drain && drain.indexOf('反复回想') > -1) list.push('你的能量常漏在反复回放过去——请给方案加一个「复盘截止线」：想清楚学到什么就结束。');
    if (drain && drain.indexOf('与人比较') > -1) list.push('你的能量常漏在比较——执行方案时请只记录「我自己的进度」，不设任何他人参照。');
    if (drain && drain.indexOf('要求过高') > -1) list.push('你的能量常漏在对自己要求太高——方案里的每个行动都设「完成线」而不是「完美线」。');
    if (drain && drain.indexOf('讨好他人') > -1) list.push('你的能量常漏在照顾别人——执行方案时请每周练习一次「温柔拒绝」，把边界写进你的计划。');
    if (pleasing && pleasing.indexOf('习惯性付出') > -1) list.push('你的关系模式偏习惯照顾——方案请把「照顾自己」列为每日固定动作，像照顾别人一样认真。');
    if (learning && learning.indexOf('直觉学习') > -1) list.push('你的学习风格是直觉探索型——学习新东西时先看整体、找感觉，再用好奇心驱动深入。');
    if (learning && learning.indexOf('逻辑学习') > -1) list.push('你的学习风格是逻辑建构型——学习时先搭框架，但请记得框架到 60% 就开工。');
    if (learning && learning.indexOf('实践学习') > -1) list.push('你的学习风格是体验实践型——请把每个目标翻译成一个「立刻能做的小作品」。');
    if (learning && learning.indexOf('交流学习') > -1) list.push('你的学习风格是交流输出型——请把方案讲给一个人听，输出会让你的计划更清晰。');
    if (list.length === 0) {
      list.push('先完成一次自我探索（如人生原型、价值观罗盘），方案会为你的个人特质定制。');
      list.push('无论测试结果如何，都请记住：方案是草稿，你有权随时修改它。');
    }
    if (list.length === 1) list.push('设计人生最重要的原则：先做小，再做对。小的行动会带来真实反馈，真实反馈会带你找到对的版本。');
    return list.slice(0, 4);
  }

  function buildAnalysis(theme) {
    var p = profile();
    var analysis = [];

    var mbtiMap = {
      I: 'MBTI 中的 I（内向）：你从独处中恢复能量——请把独处时间写进方案，它是你的必需品，不是奢侈。',
      E: 'MBTI 中的 E（外向）：你从交流中获得能量——给你的方案配一个「同行者」，一个人闷头做会让你更快耗尽。',
      N: 'MBTI 中的 N（直觉）：你容易被宏大图景点燃——请把方案与「意义」绑定，否则你会很快失去动力。',
      S: 'MBTI 中的 S（实感）：你需要具体的步骤——把「开始做某件事」拆到能直接执行的最小动作。',
      T: 'MBTI 中的 T（思考）：你会用逻辑做决定——给方案配上一组「衡量指标」，让进展可以被验证。',
      F: 'MBTI 中的 F（情感）：你在意反馈与关系——请把「和谁一起做、为谁而做」写进方案。',
      J: 'MBTI 中的 J（判断）：你有天然的规划力——为每个阶段设好截止日期，你会因此安心。',
      P: 'MBTI 中的 P（感知）：你偏好弹性——请保留调整空间，但也给自己一个「最低完成线」。'
    };
    if (p.mbti) {
      var m = p.mbti.toUpperCase();
      m.split('').forEach(function (c) {
        if (mbtiMap[c]) analysis.push(mbtiMap[c]);
      });
    }

    var zodiacNote = {
      '白羊座': '你是白羊座——启动力很强，但容易三分钟热度。方案里请加一个「30 天承诺」：开始之前先想清楚为什么坚持。',
      '金牛座': '你是金牛座——稳定是你最大的资源。方案请从「小步、可重复」开始，你不需要激进，你需要持续。',
      '双子座': '你是双子座——兴趣多变是你的天性。请给方案设一个「探索上限」：同时最多试两件事，留一件收尾。',
      '巨蟹座': '你是巨蟹座——安全感对你很重要。方案里请先准备「安全垫」（存款、退路、支持的人），你会因此更敢出发。',
      '狮子座': '你是狮子座——你需要被看见。请为你的成果找一个展示的舞台，认可本身就是你的燃料。',
      '处女座': '你是处女座——你对细节有惊人的掌控力。请警惕完美主义拖延：先发布，再完善。',
      '天秤座': '你是天秤座——平衡对你很重要。方案请兼顾事业与关系，单边投入会让你失衡内耗。',
      '天蝎座': '你是天蝎座——你愿意为真正在意的事投入到底。请确认这件事真的值得，再决定深潜。',
      '射手座': '你是射手座——自由是你的氧气。方案请保留「可退出」的选项，被绑住的感觉会让你提前放弃。',
      '摩羯座': '你是摩羯座——长期主义是你的天赋。请为方案设好里程碑，你会享受每一步扎实的推进。',
      '水瓶座': '你是水瓶座——你需要与众不同。请允许方案偏离主流，你的独特性本身就是方向。',
      '双鱼座': '你是双鱼座——你的感受力很强。请给方案配上一个「现实的锚」：预算、日期、清单，它们会保护你的想象。'
    };
    if (p.zodiac && zodiacNote[p.zodiac]) analysis.push(zodiacNote[p.zodiac]);

    if (p.bazi) {
      analysis.push('已记录你的八字四柱（' + p.bazi + '）。当前的方案基于你的处境与心理特质生成，四柱与星盘的深度命理解读将在后续服务中提供。');
    }
    if (p.stage) {
      analysis.push('你的档案显示你处于' + p.stage + '——这与测试结果一致时，请以它校准方案节奏；不一致时，请以此刻真实的感受为准。');
    }
    if (p.focus) {
      analysis.push('你在档案里写下的核心议题是「' + p.focus + '」——请把方案的第一步与它直接相连，你会更容易坚持。');
    }
    return analysis.slice(0, 5);
  }

  function buildRisks(theme) {
    var risks = {
      work: [
        ['最大风险：在没验证清楚前就辞职', '对策：先完成 30 天原型实验，用真实反馈代替头脑中的「应该」。'],
        ['最大风险：把新方向想得太浪漫', '对策：提前写下最坏情况与可承受的损失，再决定投入多少。']
      ],
      create: [
        ['最大风险：完美主义导致永远不发布', '对策：为作品设定「完成日」，先发布粗糙的 80 分版本。'],
        ['最大风险：热爱变成新的自我消耗', '对策：设定每周创造时间的上限，保护自己的精力边界。']
      ],
      relation: [
        ['最大风险：用「再等等」掩盖真实感受', '对策：每周固定一次诚实表达练习，从小事开始。'],
        ['最大风险：改变自己与改变对方混淆', '对策：只负责自己的部分——边界、表达、选择，不负责对方的态度。']
      ],
      default: [
        ['最大风险：把自由等同于无约束', '对策：自由需要结构支撑，先建立「自由的框架」（时间、预算、边界）。'],
        ['最大风险：改变迟迟不开始', '对策：把第一个行动压缩到 15 分钟内能完成。']
      ]
    };
    return risks[theme] || risks.default;
  }

  function buildTalents() {
    var list = [];
    function push(result, map) {
      // 结果可能是人话短词（如「探索者 · 探索期 · 联结」或「匠人之心 · 开放」）
      var parts = String(result).split(' · ');
      for (var i = 0; i < parts.length; i++) {
        var key = parts[i].trim();
        if (map[key]) {
          list.push({ icon: map[key].icon, name: map[key].name, desc: map[key].desc });
          break;
        }
      }
    }
    push(window.guanGet('guan_who') || '', {
      '探索者': { icon: '🧭', name: '探索的眼睛', desc: '你对未知天然不设防，总能看到别人看不见的路。这份好奇，会在你迷茫时带你走出新的可能。' },
      '创造者': { icon: '🛠️', name: '造物者的手', desc: '你天生能把想法变成现实。别人还在想象时，你已经做出了第一版。这份落地力，是你最稀缺的天赋。' },
      '觉知者': { icon: '🫧', name: '深海的听者', desc: '你能感知到别人没说出口的情绪和气氛。这份敏感不是负担，是你连接世界的天线。' },
      '重构者': { icon: '🌄', name: '破晓的勇气', desc: '你敢于对旧结构说不，敢于在废墟上重新开始。这份勇气，会在所有人沉默时替你发声。' },
      '守护者': { icon: '🕊️', name: '安心的怀抱', desc: '你的存在本身就让人安心。你天生会照顾人，而当你学会照顾自己，这份温柔会更有力量。' }
    });
    push(window.guanGet('guan_energy_map') || '', {
      '反复回想': { icon: '📖', name: '记忆的整理师', desc: '你能从经历里提炼出别人看不到的领悟。当你不让反刍变成循环，它会成为你最深的智慧。' },
      '与人比较': { icon: '🔭', name: '榜样的翻译者', desc: '你敏锐地看见「好」，也渴望靠近它。当比较转为参照，你会以惊人的速度成长。' },
      '要求过高': { icon: '🪞', name: '质感的雕刻家', desc: '你对「好」有极高的标准，这让你经手的一切都有品质。当标准不再变成枷锁，它是你最好的名片。' },
      '讨好他人': { icon: '💗', name: '温柔的共情者', desc: '你天生能接住别人的情绪，这是许多人渴望的礼物。当这份温柔也流向你自己，你会完整地发光。' }
    });
    push(window.guanGet('guan_relation_map') || '', {
      '焦虑型靠近': { icon: '🌊', name: '深情的守望者', desc: '你对关系投入的深度，是很多麻木的人羡慕的。当这份深情配上安全感，它会让身边的人深深被爱。' },
      '回避型靠近': { icon: '🌿', name: '独立的光', desc: '你不依附、不纠缠，拥有许多人求而不得的独立。当你学会有边界的靠近，你会拥有真正深刻的联结。' },
      '安全型靠近': { icon: '⚓', name: '安定的锚', desc: '你在关系里自带一种让人安心的稳定。你是那个能接住别人的人——也请记得，偶尔让别人接住你。' }
    });
    push(window.guanGet('guan_life_want') || '', {
      '自由': { icon: '🌾', name: '旷野的诗人', desc: '你天生向往不被定义的生活。这份对自由的直觉，会让你在人群里始终保持自己的方向。' },
      '联结': { icon: '🌉', name: '人群的桥', desc: '你拥有把陌生人变成同行者的天赋。你的存在，让许多人感到不再孤单。' },
      '创造': { icon: '🎨', name: '新世界的造物主', desc: '你想为世界留下点什么。这份创造欲，是你生命力的重要出口。' },
      '安定': { icon: '🏡', name: '秩序的守护者', desc: '你给身边的人提供珍贵的确定性。在一个动荡的世界里，你的稳定本身就是礼物。' }
    });
    push(window.guanGet('guan_talent') || '', {
      '直觉学习': { icon: '🎈', name: '灵感的接收者', desc: '你先看见整体，再走向细节。你的学习像探险，总能在未知里发现惊喜。' },
      '逻辑学习': { icon: '🧱', name: '结构的建筑师', desc: '你把混乱变成秩序的能力，是很多人依靠的底气。你的框架让复杂变得可以理解。' },
      '实践学习': { icon: '✋', name: '双手的实践者', desc: '你通过行动理解世界，做出的东西就是你的思考。你的学习成果，总是拿得出手。' },
      '交流学习': { icon: '📣', name: '故事的传声者', desc: '你通过表达理解世界，也让好内容流动起来。你是那个让知识活起来的人。' }
    });
    push(window.guanGet('guan_pressure') || '', {
      '动起来': { icon: '🏃', name: '行动的回血者', desc: '你靠行动恢复能量——越是困住，越要动起来。这份本能让你在低谷也能快速重启。' },
      '安顿下来': { icon: '🍵', name: '安顿的整理者', desc: '你靠整理与秩序回血，能把混乱的生活重新理顺。这份能力让身边的人也感到安稳。' },
      '好好休息': { icon: '🛌', name: '诚实的休养者', desc: '你懂得休息不是浪费，是让身体和心重新蓄电。这份诚实，是长期主义的底气。' },
      '与人联结': { icon: '🤝', name: '关系的充电者', desc: '你靠联结恢复能量，和人的温度是你的燃料。这份能力让你在低谷时总有依靠。' },
      '过往经历': { icon: '🏔️', name: '经验的持有者', desc: '你从经历里获得力量——你知道自己熬过更难的时候。这份底气，是别人拿不走的。' },
      '内心信念': { icon: '✨', name: '信念的守护者', desc: '你心里有一句一直相信的话，它是你风暴中的锚。' },
      '重要关系': { icon: '🫂', name: '关系的承接者', desc: '你知道有人会接住你——这份安全感，让你敢于走更远。' },
      '自我信任': { icon: '🪨', name: '自我的磐石', desc: '你相信自己的判断和力量，这是最难培养、也最稳的底气。' }
    });
    var p = profile();
    if (p.mbti) {
      var m = p.mbti.toUpperCase();
      if (m.indexOf('N') > -1) list.push({ icon: '🔮', name: '直觉的翻译者', desc: '你能看见事物背后的模式与可能。别人看到现象，你看到方向。' });
      if (m.indexOf('F') > -1) list.push({ icon: '🫂', name: '共情的回应者', desc: '你做决定时习惯把「人」放在里面。这份温度，是冰冷的效率时代最稀缺的东西。' });
      if (m.indexOf('T') > -1) list.push({ icon: '⚖️', name: '清醒的判断者', desc: '你在情绪翻涌时依然能保持理性。这份清醒，让重要决定少走弯路。' });
    }
    if (list.length === 0) {
      list.push({ icon: '🕯️', name: '愿意看自己的你', desc: '你愿意停下来做这些自察，本身就是一种天赋：不是每个人都有勇气，认真看看自己。' });
    }
    // de-duplicate by name, no cap: show all talents
    var seen = {};
    var out = [];
    list.forEach(function (t) {
      if (!t || !t.name || seen[t.name]) return;
      seen[t.name] = 1;
      out.push(t);
    });
    return out;
  }

  // 根据测试结果判断用户需要的语气：敏感/不自信 -> 更多情绪价值；行动派 -> 更落地
  function buildVoice() {
    var drain = window.guanGet('guan_energy_map') || '';
    var relation = window.guanGet('guan_relation_map') || '';
    var energy = window.guanGet('guan_energy_map') || '';
    var talent = window.guanGet('guan_talent') || '';
    var voice = {
      warm: 0,
      concrete: 0
    };
    if (drain.indexOf('反复回想') > -1 || drain.indexOf('与人比较') > -1 || drain.indexOf('要求过高') > -1) voice.warm += 1;
    if (relation.indexOf('容易低估自己') > -1) voice.warm += 2;
    if (energy.indexOf('电量偏低') > -1) voice.warm += 1;
    if (talent.indexOf('实践学习') > -1 || talent.indexOf('方法自信') > -1) voice.concrete += 1;
    if (drain.indexOf('讨好他人') > -1) voice.warm += 1;

    if (voice.warm >= 2) {
      return {
        kind: 'warm',
        tone: '你最近对自己可能有些苛刻，所以这份方案里，我想先对你说：你已经很努力了。接下来的每一步，都不需要证明给谁看。',
        closing: '慢慢来。你不需要在三十天里变成另一个人——你只需要，比今天更靠近自己一点。'
      };
    }
    if (voice.concrete >= 1) {
      return {
        kind: 'concrete',
        tone: '你是一个习惯行动的人，所以我尽量把方向说得具体：什么时候做、做什么、做到什么程度。你不需要听完就全做，只需要挑一件，先开始。',
        closing: '你这样的人，最需要的是「开始」而不是「犹豫」。挑一件，今天就动起来。'
      };
    }
    return {
      kind: 'balanced',
      tone: '这份方案不是任务清单，它只是几条可以慢慢走的路。你可以挑一条最不费力的，先走一小步。',
      closing: '无论你今天走不走，愿意停下来看看自己，已经是很重要的一步了。'
    };
  }

  // 「或许可以成为」：从方案主题映射可能的身份方向，并联动人生模拟
  function buildBecoming(theme, wish, plan) {
    var cm = CAREER_MAP[themeMapKey(theme)];
    var scene = theme === 'relation' ? 'relation' : (theme === 'freedom' || theme === 'stable' ? 'self' : 'career');
    var list = cm.map(function (c, i) {
      return {
        role: c.tag.replace(/^原型 [ABC] · /, ''),
        desc: c.title + '——参考职业：' + c.careers.map(function (cc) { return cc.name; }).join('、'),
        scene: scene,
        careers: c.careers
      };
    });
    // 保存方案供模拟器读取
    window.guanSet('guan_plan', JSON.stringify({ theme: theme, wish: wish, roles: list, routes: cm }));
    return list;
  }

  // 30 天成长计划（免费），3-6 个月 / 1-3 年为深化版
  function buildPlan30(inputs, voice) {
    var time = inputs.time || '每周一些时间';
    var money = inputs.money || '你愿意投入的预算';
    var goal = inputs.goal || '看到一点真实的变化';
    var timeUnit = time.indexOf('每周') > -1 ? time.split('每周')[1] : time;
    var timeNum = parseFloat(time) || 0;
    var moneyNum = parseFloat(String(money).replace(/[^0-9.]/g, '')) || 0;
    var perDay = timeNum > 0 ? Math.max(1, Math.round(timeNum / 7)) : 1;
    var perWeekBudget = moneyNum > 0 ? Math.round(moneyNum / 4) : 0;
    var isStudent = userIdentity() === 'student';
    return [
      { week: '第一周 · 定向', plan: '把「' + goal + '」写下来贴在看得见的地方。' + (timeNum ? '你每周可投入约 ' + timeNum + ' 小时，摊到每天约 ' + perDay + ' 小时——请固定一个时段（如早上 30 分钟），形成「雷打不动」的日常。' : '）每天固定抽出 30 分钟，形成日常。') + ' 这一周不要求产出，只做三件事：①列出 3 个你想靠近的方向；②为每个方向写下「它吸引我的原因」；③选一个方向作为下周实验对象。' + (isStudent ? ' 作为学生，优先利用课后/周末时段，把它当作一个「个人项目」而非额外压力。' : '') },
      { week: '第二周 · 实验', plan: '用' + (perWeekBudget ? '每周约 ' + perWeekBudget + ' 元的预算' : money) + '做一次最小实验：买一本相关的书、约一位内行聊 30 分钟、或参加一次体验/试听课。' + (timeNum ? '把这周 ' + timeNum + ' 小时拆成：2/3 做实验动作，1/3 记录感受。' : '') + ' 每完成一个动作，回答三个问题：这件事让我有能量还是消耗？我看到什么新信息？我想继续靠近还是后退？' },
      { week: '第三周 · 调整', plan: '回看前两周的记录：什么让你有能量，什么在消耗你？砍掉消耗的部分，把时间留给有能量的方向。' + (timeNum ? '这一周把 ' + timeNum + ' 小时全部集中投给「最有能量」的那个方向，做一次比上周更完整的尝试（如完成一个小作品、一次完整访谈）。' : '') + ' 本周结束前，请确定：这个方向值不值得再投入 30 天？' },
      { week: '第四周 · 定稿', plan: '写下这一月的总结：①我验证了什么？②我发现自己擅长/不擅长什么？③下一步（未来 30 天）我要做什么？' + (perWeekBudget ? '把没用完的预算留到下一阶段，作为「继续实验」的燃料。' : '') + ' 然后带着这份答案，去「人生模拟」把选定的方向推演一遍，或再来一次设计，把方案升级成 3-6 个月版本。' }
    ];
  }

  // 综合解读：把用户输入、档案、排盘、测试结果融在一起（不拆成模式化板块）
  function buildIntegrated(inputs, p, voice) {
    var paras = [];
    paras.push(voice.tone);
    if (inputs.pain) paras.push('你说，你现在卡在「' + inputs.pain + '」。这句话本身很重要——能说清楚卡在哪里，就已经是开始。');
    if (inputs.wish) paras.push('你希望自己「' + inputs.wish + '」。这份渴望不是空想，它是你心里的方向感，值得被认真对待。');
    if (inputs.time) {
      var tn = parseFloat(inputs.time) || 0;
      var perD = tn > 0 ? Math.max(1, Math.round(tn / 7)) : 1;
      paras.push('你愿意每周投入 ' + inputs.time + '——这不是小数目，它意味着你每天约有 ' + perD + ' 小时可以给这件事。方案会按「每天固定一小块时间」来设计，而不是指望某天挤出大块时间。');
    }
    if (inputs.money) {
      var mn = parseFloat(String(inputs.money).replace(/[^0-9.]/g, '')) || 0;
      var pw = mn > 0 ? Math.round(mn / 4) : 0;
      paras.push('你提到每月大约有 ' + inputs.money + ' 的预算。拆开看，每周约 ' + pw + ' 元——足够做一次最小尝试（买一本书、约一次访谈、试听一节课），方案里每一步都会控制在这个范围内。');
    }
    if (inputs.asset) paras.push('你手里已经有「' + inputs.asset + '」。很多人看不见自己已有的资源，而你看见了——这些会成为你起步的台阶。');
    if (inputs.block) paras.push('你担心「' + inputs.block + '」。这份担心不是软弱，它说明你已经想过困难——方案里，我们会给这份担心留一个位置，而不是假装它不存在。');
    if (inputs.goal) paras.push('你希望三十天后「' + inputs.goal + '」。那就把它当作这条路的第一个路标。');
    if (p.nickname) paras.push(p.nickname + '，以上这些，都不是从模板里套出来的——它们来自你刚刚说出口的每一句话。');
    if (p.bazi) paras.push('你的八字近似排盘是「' + p.bazi + '」。我不是要给你算命，只想说：你在生命里走到今天，带着自己的时区与季节。方案会顺着你此刻的季节来，而不是催你越过它。');
    if (p.moon) paras.push('你的月亮星座（近似）落在' + p.moon + '——月亮更多代表你内在的柔软处。方案里也会照顾到它：不只要「做到」，也要让你在过程里不丢下自己的感受。');
    return paras;
  }

  function render() {
    // Remove blocks appended on previous renders so repeated generation
    // doesn't stack duplicate talent/analysis/risk sections.
    document.querySelectorAll('.design-dynamic').forEach(function (el) {
      el.remove();
    });
    var pain = painEl.value.trim();
    var wish = wishEl.value.trim();
    var inputs = {
      pain: pain,
      wish: wish,
      time: timeEl.value.trim(),
      money: moneyEl.value.trim(),
      asset: assetEl.value.trim(),
      block: blockEl.value.trim(),
      goal: goalEl.value.trim()
    };
    if (!pain || !wish) {
      window.guanToast('至少写下「卡在哪里」和「想去哪里」，我们才能慢慢聊');
      return;
    }
    var theme = pickTheme(pain, wish);
    var routes = buildRoutes(theme, wish, inputs.time);
    var principles = buildPrinciples();
    var voice = buildVoice();
    var p = profile();
    var integrated = buildIntegrated(inputs, p, voice);
    introEl.textContent = voice.tone;

    var talents = buildTalents();
    routesEl.innerHTML = '';
    routes.forEach(function (r) {
      var div = document.createElement('div');
      div.className = 'design-route';
      var careerBlock = (r.careers && r.careers.length) ?
        '<div class="design-career-map"><b>职业规划师对标 · 参考职业</b>' +
        r.careers.map(function (c) {
          return '<div class="career-line"><strong>' + c.name + '</strong><span>' + c.why + '</span></div>';
        }).join('') +
        '</div>' : '';
      var paras = (r.deep && r.deep.length ? r.deep : [r.body]);
      paras = paras.concat([
        (talents.length ? '在你身上，有一个天赋叫「' + talents[0].name + '」——' + talents[0].desc + '走这条路时，它会是你的同行者，而不是需要被你赶着走的负担。' : '') +
        '这条路不要求你立刻走完，也不要求你每天打卡。它只是在你心里放下一张地图：当你愿意的时候，可以朝这个方向看一眼；当你累了，可以合上它休息。方向不是任务，它是你在黑夜里的参照。'
      ]);
      div.innerHTML = '<span class="route-tag">' + r.tag + '</span><h4>' + r.title + '</h4>' +
        careerBlock +
        paras.map(function (p) { return '<p style="margin-bottom:12px">' + p + '</p>'; }).join('');
      routesEl.appendChild(div);
    });

    var idHint = identityHint();
    if (idHint && introEl) {
      introEl.textContent = idHint + ' ' + voice.tone;
    }

    var tDiv = document.createElement('div');
    tDiv.className = 'design-principles talent-block design-dynamic';
    tDiv.innerHTML = '<h4>你的个性天赋点</h4><div class="talent-grid">' +
      talents.map(function (t) {
        return '<div class="talent-card"><div class="talent-icon">' + t.icon + '</div>' +
          '<b>' + t.name + '</b><p>' + t.desc + '</p></div>';
      }).join('') +
      '</div>' +
      '<p style="font-size:13px;color:var(--gold-bright);margin-top:12px;line-height:1.9">这些不是要求你去完成的任务，而是你本来就带着的礼物。它们会在你放松做自己的时候，自然发光。</p>';
    principlesEl.parentNode.appendChild(tDiv);

    // 综合解读（提到用户输入，融在一起）
    var iDiv = document.createElement('div');
    iDiv.className = 'design-principles design-dynamic integrated-block';
    iDiv.innerHTML = '<h4>关于你，我们想说的</h4>' +
      integrated.map(function (p2) { return '<p style="margin-bottom:10px">' + p2 + '</p>'; }).join('');
    principlesEl.parentNode.insertBefore(iDiv, tDiv);

    principlesEl.innerHTML = '<h4>你的设计原则</h4><ul>' +
      principles.map(function (p) { return '<li>' + p + '</li>'; }).join('') +
      '</ul>';

    var analysis = buildAnalysis(theme);
    if (analysis.length) {
      var aDiv = document.createElement('div');
      aDiv.className = 'design-principles design-dynamic';
      aDiv.style.marginTop = '16px';
      aDiv.innerHTML = '<h4>基于你档案的具体分析</h4><ul>' +
        analysis.map(function (a) { return '<li>' + a + '</li>'; }).join('') +
        '</ul>';
      principlesEl.parentNode.appendChild(aDiv);
    }

    var risks = buildRisks(theme);
    var rDiv = document.createElement('div');
    rDiv.className = 'design-principles design-dynamic';
    rDiv.style.marginTop = '16px';
    rDiv.innerHTML = '<h4>关键风险与对策</h4><ul>' +
      risks.map(function (r) { return '<li><strong>' + r[0] + '</strong><br>' + r[1] + '</li>'; }).join('') +
      '</ul>';
    principlesEl.parentNode.appendChild(rDiv);

    // 或许可以成为 + 联动模拟
    var roles = buildBecoming(theme, wish, {});
    if (becomingEl) {
      becomingEl.innerHTML = '<h4>如果你在这条路上走下去，你或许可以成为……</h4>' +
        '<div class="becoming-grid">' +
        roles.map(function (r, i) {
          return '<div class="becoming-card"><div class="bc-num">原型 ' + ['A', 'B', 'C'][i] + '</div>' +
            '<b>' + r.role + '</b><p>' + r.desc + '</p></div>';
        }).join('') +
        '</div>' +
        '<p style="font-size:13px;color:var(--gold-bright);margin-top:12px;line-height:1.9">想先看看这样的你会经历什么吗？去人生模拟里，替自己走一段：</p>' +
        '<a class="btn btn-gold btn-sm" href="simulator.html">去人生模拟，预见可能的自己</a>';
      becomingEl.classList.add('show');
    }

    // 30 天计划
    var plan30 = buildPlan30(inputs, voice);
    if (plan30El) {
      plan30El.innerHTML = '<h4>你的三十天成长计划 · 免费版</h4>' +
        '<div class="plan30-list">' +
        plan30.map(function (w) {
          return '<div class="plan30-item"><b>' + w.week + '</b><p>' + w.plan + '</p></div>';
        }).join('') +
        '</div>' +
        '<p style="font-size:13px;color:var(--muted-2);margin-top:12px;line-height:1.9">三个月、一年、三年的深化规划正在路上——那会是陪你走更远的版本。</p>' +
        '<a class="btn btn-sm" href="journey.html" style="margin-top:8px">去三十天陪伴，开始第一周</a>';
      plan30El.classList.add('show');
    }

    var sim = simResult();
    if (sim && simBlockEl) {
      simBlockEl.classList.add('show');
      simBlockEl.innerHTML = '<h4>上次模拟的启示</h4>' +
        '<p>你在「' + sim.title + '」的模拟中选择了一条偏向「' + (sim.picks && sim.picks[0] ? sim.picks[0].tag : '未记录') + '」的路径。模拟的启示是：' + (sim.insight || '') + '</p>' +
        '<p style="margin-top:8px">把这次模拟当成方案的「预演」——你现在有三个真实的原型实验可以启动。</p>';
    } else if (simBlockEl) {
      simBlockEl.classList.remove('show');
    }

    lastPlan = {
      pain: pain,
      wish: wish,
      routes: routes,
      principles: principles,
      analysis: analysis,
      risks: risks,
      talents: talents,
      inputs: inputs,
      integrated: integrated,
      plan30: plan30
    };
    output.classList.add('show');
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function copyPlan() {
    if (!lastPlan) return;
    var it = lastPlan.inputs || {};
    var text = '【我的人生设计方案 · 观己实验室】\n\n卡点：' + lastPlan.pain + '\n渴望：' + lastPlan.wish +
      '\n每周时间：' + (it.time || '未填写') + '\n每月预算：' + (it.money || '未填写') +
      '\n已有资源：' + (it.asset || '未填写') + '\n担心的事：' + (it.block || '未填写') +
      '\n三十天愿望：' + (it.goal || '未填写') + '\n\n';
    lastPlan.routes.forEach(function (r, i) {
      text += (i + 1) + '. ' + r.title + '\n   ' + r.body + '\n';
    });
    text += '\n设计原则：\n' + lastPlan.principles.map(function (p) { return '· ' + p; }).join('\n');
    if (lastPlan.analysis && lastPlan.analysis.length) {
      text += '\n\n具体分析：\n' + lastPlan.analysis.map(function (a) { return '· ' + a; }).join('\n');
    }
    if (lastPlan.risks && lastPlan.risks.length) {
      text += '\n\n关键风险与对策：\n' + lastPlan.risks.map(function (r) { return '· ' + r[0] + ' — ' + r[1]; }).join('\n');
    }
    if (lastPlan.talents && lastPlan.talents.length) {
      text += '\n\n我的个性天赋点：\n' + lastPlan.talents.map(function (t) { return '· ' + t.name + '——' + t.desc; }).join('\n');
    }
    if (lastPlan.plan30 && lastPlan.plan30.length) {
      text += '\n\n三十天成长计划：\n' + lastPlan.plan30.map(function (w) { return '· ' + w.week + '：' + w.plan; }).join('\n');
    }
    text += '\n\n—— 观己实验室 · 理解自己，设计人生';
    window.guanCopy(text, function (ok) {
      window.guanToast(ok ? '方案已复制，去粘贴保存吧' : '复制失败，请手动选择文本');
    });
  }

  document.getElementById('designBtn').addEventListener('click', render);
  document.getElementById('copyDesign').addEventListener('click', copyPlan);
  document.getElementById('redoDesign').addEventListener('click', function () {
    output.classList.remove('show');
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
