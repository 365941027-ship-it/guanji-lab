(function () {
  'use strict';

  var painEl = document.getElementById('painInput');
  var wishEl = document.getElementById('wishInput');
  var resEl = document.getElementById('resourceInput');
  var output = document.getElementById('designOutput');
  var routesEl = document.getElementById('designRoutes');
  var principlesEl = document.getElementById('designPrinciples');
  var introEl = document.getElementById('designIntro');
  var simBlockEl = document.getElementById('designSimBlock');

  var lastPlan = null;

  function profile() {
    try {
      return JSON.parse(window.guanGet('guan_profile') || '{}');
    } catch (e) {
      return {};
    }
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
    if (theme === 'work' || theme === 'growth') {
      routes.push({
        tag: '原型 A · 微转型',
        title: '在旧路上长出新方向',
        body: '不急着辞职。在现有工作里找出一个你相对有热情的小切口，用 30 天把它做成「你的作品」。',
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
        tag: '原型 B · 访谈实验',
        title: '向已经在路上的人提问',
        body: '列出三位正在做你想做之事的人，每周约谈一位，听真实的故事。',
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
        tag: '原型 C · 作品实验',
        title: '用作品说话',
        body: '围绕你的渴望，30 天产出一个最小的公开作品，让世界告诉你下一步。',
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
        tag: '原型 A · 每日创造',
        title: '让创造成为日常',
        body: '每天留出 45 分钟的创造时间，只做你热爱的产出，30 天不断档。',
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
        tag: '原型 B · 作品发布',
        title: '第一次被看见',
        body: '选一个你最满意的作品，公开发布，观察真实反馈。',
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
        tag: '原型 C · 服务实验',
        title: '把热爱变成服务',
        body: '找一个真实的人，用你的创造能力为 TA 免费做一件小事。',
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
        tag: '原型 A · 诚实表达',
        title: '练习说出真实需要',
        body: '每周至少一次，向一个重要的人说出一个真实的感受或需要。',
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
        tag: '原型 B · 界限练习',
        title: '温柔而坚定地说不',
        body: '每周练习一次带着善意的拒绝。界限不是关系的敌人，模糊才是。',
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
        tag: '原型 C · 深度对话',
        title: '一次深入的对话',
        body: '安排一次与重要之人的深度对话，不解决问题，只在场。',
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
      routes.push({
        tag: '原型 A · 最小自由',
        title: '在当下开一扇窗',
        body: '不改变全局，先在生活里制造一个「自由孤岛」。',
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
        tag: '原型 B · 探索实验',
        title: '去一个没去过的地方',
        body: '三十天里做三次低成本探索，让新的输入带来新的选择。',
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
        tag: '原型 C · 建立基地',
        title: '先建好出发的营地',
        body: '自由需要基地支撑：先把一项基础打牢。',
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
    var archetype = window.guanGet('guan_archetype');
    var stage = window.guanGet('guan_stage');
    var values = window.guanGet('guan_values');
    var energy = window.guanGet('guan_energy');
    var burnout = window.guanGet('guan_burnout');
    var attachment = window.guanGet('guan_attachment');
    var drain = window.guanGet('guan_drain');
    var pleasing = window.guanGet('guan_pleasing');
    var learning = window.guanGet('guan_learning');
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
    if (energy && energy.indexOf('疲惫') > -1) list.push('你最近的能量状态偏疲惫——先执行两周「减半计划」：日程砍半、睡眠补足，再启动原型实验。');
    if (energy && energy.indexOf('饱满') > -1) list.push('你最近能量饱满——现在适合启动原型实验，把你的创造力集中投给一个方向。');
    if (energy && energy.indexOf('萌芽') > -1) list.push('你正处在萌芽期——别急着要结果，先为你的新想法安排最小的一步，让它先活着。');
    if (burnout && burnout.indexOf('疲惫') > -1) list.push('你的倦怠测试显示你处于疲惫耗竭——请把「恢复」写进方案的前两周，日程先减半再谈推进。');
    if (burnout && burnout.indexOf('冷漠') > -1) list.push('你的倦怠测试显示你在情感上需要节能——请减少消耗性社交，给感受一个慢慢回流的空间。');
    if (burnout && burnout.indexOf('意义') > -1) list.push('你的倦怠核心是意义失落——请为方案里的每个行动写清「为什么」，意义是你最重要的燃料。');
    if (burnout && burnout.indexOf('觉醒') > -1) list.push('你的倦怠测试显示你正处在觉醒期——方案请按「双轨实验」设计：保住现状，同时每周固定投入新方向。');
    if (attachment && attachment.indexOf('焦虑') > -1) list.push('你的依恋风格偏焦虑——执行方案时请找一个「稳定同行者」定期同步，你会因此更有安全感。');
    if (attachment && attachment.indexOf('回避') > -1) list.push('你的依恋风格偏回避——方案请保留足够的独处空间，但也请每周向一个人同步一次进度。');
    if (drain && drain.indexOf('反刍') > -1) list.push('你的内耗主要来自反复回放过去——请给方案加一个「复盘截止线」：想清楚学到什么就结束。');
    if (drain && drain.indexOf('比较') > -1) list.push('你的内耗主要来自比较——执行方案时请只记录「我自己的进度」，不设任何他人参照。');
    if (drain && drain.indexOf('完美') > -1) list.push('你的内耗主要来自完美主义——方案里的每个行动都设「完成线」而不是「完美线」。');
    if (drain && drain.indexOf('讨好') > -1) list.push('你的内耗主要来自讨好——执行方案时请每周练习一次「温柔拒绝」，把边界写进你的计划。');
    if (pleasing && pleasing.indexOf('照顾') > -1) list.push('你的讨好模式偏习惯照顾——方案请把「照顾自己」列为每日固定动作，像照顾别人一样认真。');
    if (learning && learning.indexOf('直觉') > -1) list.push('你的学习风格是直觉探索型——学习新东西时先看整体、找感觉，再用好奇心驱动深入。');
    if (learning && learning.indexOf('逻辑') > -1) list.push('你的学习风格是逻辑建构型——学习时先搭框架，但请记得框架到 60% 就开工。');
    if (learning && learning.indexOf('体验') > -1) list.push('你的学习风格是体验实践型——请把每个目标翻译成一个「立刻能做的小作品」。');
    if (learning && learning.indexOf('交流') > -1) list.push('你的学习风格是交流输出型——请把方案讲给一个人听，输出会让你的计划更清晰。');
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
      var key = result.split(' · ')[0];
      if (map[key]) {
        list.push({ icon: map[key].icon, name: map[key].name, desc: map[key].desc });
      }
    }
    push(window.guanGet('guan_archetype') || '', {
      '探索者': { icon: '🧭', name: '探索的眼睛', desc: '你对未知天然不设防，总能看到别人看不见的路。这份好奇，会在你迷茫时带你走出新的可能。' },
      '创造者': { icon: '🛠️', name: '造物者的手', desc: '你天生能把想法变成现实。别人还在想象时，你已经做出了第一版。这份落地力，是你最稀缺的天赋。' },
      '觉知者': { icon: '🫧', name: '深海的听者', desc: '你能感知到别人没说出口的情绪和气氛。这份敏感不是负担，是你连接世界的天线。' },
      '重构者': { icon: '🌄', name: '破晓的勇气', desc: '你敢于对旧结构说不，敢于在废墟上重新开始。这份勇气，会在所有人沉默时替你发声。' },
      '守护者': { icon: '🕊️', name: '安心的怀抱', desc: '你的存在本身就让人安心。你天生会照顾人，而当你学会照顾自己，这份温柔会更有力量。' }
    });
    push(window.guanGet('guan_drain') || '', {
      '反刍型': { icon: '📖', name: '记忆的整理师', desc: '你能从经历里提炼出别人看不到的领悟。当你不让反刍变成循环，它会成为你最深的智慧。' },
      '比较型': { icon: '🔭', name: '榜样的翻译者', desc: '你敏锐地看见「好」，也渴望靠近它。当比较转为参照，你会以惊人的速度成长。' },
      '完美型': { icon: '🪞', name: '质感的雕刻家', desc: '你对「好」有极高的标准，这让你经手的一切都有品质。当标准不再变成枷锁，它是你最好的名片。' },
      '讨好型': { icon: '💗', name: '温柔的共情者', desc: '你天生能接住别人的情绪，这是许多人渴望的礼物。当这份温柔也流向你自己，你会完整地发光。' }
    });
    push(window.guanGet('guan_attachment') || '', {
      '焦虑型': { icon: '🌊', name: '深情的守望者', desc: '你对关系投入的深度，是很多麻木的人羡慕的。当这份深情配上安全感，它会让身边的人深深被爱。' },
      '回避型': { icon: '🌿', name: '独立的光', desc: '你不依附、不纠缠，拥有许多人求而不得的独立。当你学会有边界的靠近，你会拥有真正深刻的联结。' },
      '安全型': { icon: '⚓', name: '安定的锚', desc: '你在关系里自带一种让人安心的稳定。你是那个能接住别人的人——也请记得，偶尔让别人接住你。' }
    });
    push(window.guanGet('guan_values') || '', {
      '自由': { icon: '🌾', name: '旷野的诗人', desc: '你天生向往不被定义的生活。这份对自由的直觉，会让你在人群里始终保持自己的方向。' },
      '联结': { icon: '🌉', name: '人群的桥', desc: '你拥有把陌生人变成同行者的天赋。你的存在，让许多人感到不再孤单。' },
      '创造': { icon: '🎨', name: '新世界的造物主', desc: '你想为世界留下点什么。这份创造欲，是你生命力的重要出口。' },
      '安定': { icon: '🏡', name: '秩序的守护者', desc: '你给身边的人提供珍贵的确定性。在一个动荡的世界里，你的稳定本身就是礼物。' }
    });
    push(window.guanGet('guan_learning') || '', {
      '直觉探索型': { icon: '🎈', name: '灵感的接收者', desc: '你先看见整体，再走向细节。你的学习像探险，总能在未知里发现惊喜。' },
      '逻辑建构型': { icon: '🧱', name: '结构的建筑师', desc: '你把混乱变成秩序的能力，是很多人依靠的底气。你的框架让复杂变得可以理解。' },
      '体验实践型': { icon: '✋', name: '双手的实践者', desc: '你通过行动理解世界，做出的东西就是你的思考。你的学习成果，总是拿得出手。' },
      '交流输出型': { icon: '📣', name: '故事的传声者', desc: '你通过表达理解世界，也让好内容流动起来。你是那个让知识活起来的人。' }
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

  function render() {
    // Remove blocks appended on previous renders so repeated generation
    // doesn't stack duplicate talent/analysis/risk sections.
    document.querySelectorAll('.design-dynamic').forEach(function (el) {
      el.remove();
    });
    var pain = painEl.value.trim();
    var wish = wishEl.value.trim();
    var resource = resEl.value.trim();
    if (!pain || !wish) {
      window.guanToast('至少写下「卡在哪里」和「想去哪里」，设计才能开始');
      return;
    }
    var theme = pickTheme(pain, wish);
    var routes = buildRoutes(theme, wish, resource);
    var principles = buildPrinciples();
    introEl.textContent = '基于你描述的处境、渴望与档案信息，我们为你写了三条思路。它们不是任务清单，而是三个可以慢慢走的方向——你不需要打卡，不需要赶进度，只需要在愿意的时候，朝其中一个方向看一看。';

    var talents = buildTalents();
    routesEl.innerHTML = '';
    routes.forEach(function (r) {
      var div = document.createElement('div');
      div.className = 'design-route';
      var paras = (r.deep && r.deep.length ? r.deep : [r.body]);
      paras = paras.concat([
        (talents.length ? '在你身上，有一个天赋叫「' + talents[0].name + '」——' + talents[0].desc + '走这条路时，它会是你的同行者，而不是需要被你赶着走的负担。' : '') +
        '这条路不要求你立刻走完，也不要求你每天打卡。它只是在你心里放下一张地图：当你愿意的时候，可以朝这个方向看一眼；当你累了，可以合上它休息。方向不是任务，它是你在黑夜里的参照。'
      ]);
      div.innerHTML = '<span class="route-tag">' + r.tag + '</span><h4>' + r.title + '</h4>' +
        paras.map(function (p) { return '<p style="margin-bottom:12px">' + p + '</p>'; }).join('');
      routesEl.appendChild(div);
    });

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
      resource: resource,
      routes: routes,
      principles: principles,
      analysis: analysis,
      risks: risks,
      talents: talents
    };
    output.classList.add('show');
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function copyPlan() {
    if (!lastPlan) return;
    var text = '【我的人生设计方案 · 观己实验室】\n\n卡点：' + lastPlan.pain + '\n渴望：' + lastPlan.wish + '\n投入：' + (lastPlan.resource || '未填写') + '\n\n';
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
