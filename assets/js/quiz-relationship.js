window.GUAN_QUIZ = {
  key: 'guan_relationship',
  title: '你在关系里的姿态',
  en: 'Relational Patterns',
  resultLabel: '关系语言',
  scoring: 'inneros',
  category: 'relation',
  categoryTitle: '关系困扰',
  desc: '不是给你定义，而是帮你看清自己在关系中的姿态：你如何靠近、如何冲突、如何信任、如何付出。',
  depth: {
    title: '关系里的你，是被早年经历塑造的',
    lead: '你在关系里「自动」做出的反应，很少是深思熟虑的结果，更多是早年学会的生存策略。',
    body: '小时候，我们通过观察和体验学会了「怎样才能被爱、被接纳、不被抛弃」：有的人学会讨好，有的人学会躲开，有的人学会用愤怒保护自己。这些策略在当时帮我们活了下来，但长大后，它们常常变得不再适用——我们带着旧地图走进新关系，却发现对不上号。这不是你的错，但它是你的责任：看清自己的旧剧本，才能写出新剧本。关系模式的改变不是一朝一夕，它始于一次诚实的好奇：「我为什么会对这件事反应这么强烈？」',
    closing: '你不需要成为一个「完美的关系者」。你只需要愿意看见自己的模式，并一次一次地，选择新的回应。'
  },
  dimensions: [
    { key: 'closeness', name: '靠近', modes: ['seeking', 'reserved'] },
    { key: 'conflict', name: '冲突', modes: ['direct', 'withdraw'] },
    { key: 'trust', name: '信任', modes: ['open', 'cautious'] },
    { key: 'giving', name: '付出', modes: ['giving', 'boundary'] }
  ],
  dimensionModes: {
    closeness: {
      seeking: {
        name: '主动靠近',
        en: 'Seeking Closeness',
        desc: '你需要真实的联结，习惯主动表达关心、分享生活。靠近对你不是负担，而是确认彼此存在的方式。',
      note: '当你主动靠近却得不到回应时，你容易解读为「不被在意」。其实很多时候，对方只是用另一种节奏爱你。'
      ,
      letter: '你主动靠近的样子，是一种勇敢——不是每个人都敢先伸出手。但请记得：靠近是为了联结，不是为了证明自己。当对方没有立刻回应时，那不是你的失败，只是你们的节奏不同。你已经很勇敢了，偶尔也允许自己站在原地，等对方走几步。'
      },
      reserved: {
        name: '保持空间',
        en: 'Reserved',
        desc: '你珍惜自己的空间，也尊重他人的边界。亲密需要时间慢慢建立，太多太快会让你本能后退。',
      note: '你的疏离常被误读为冷漠。练习在感到安全时，多说一句「我不是不想靠近，只是需要慢慢来」。'
      ,
      letter: '你不是冷漠，你只是需要慢慢来。世界上有人用「快」表达爱，就有人用「慢」珍惜关系。请别为自己的节奏道歉。你不需要变成另一个人来被爱——你只需要让重要的人知道：你的慢，不是拒绝，是你的认真。'
      }
    },
    conflict: {
      direct: {
        name: '直面冲突',
        en: 'Direct',
        desc: '你认为问题必须摊开说。冲突对你不是关系的终点，而是重新对齐的机会，即使过程难受。',
      note: '注意在情绪最烫的时候开口，容易把「问题」说成「指责」。先说出自己的感受，再谈对方的。'
      ,
      letter: '你敢于直面冲突，这是很多关系里最稀缺的勇气。但请记得：你的目的是「靠近」，不是「赢」。下次开口时，试着把「你总是」换成「我感到」——你会发现，同一个真相，换一种语气，就换了一种结局。'
      },
      withdraw: {
        name: '回避冲突',
        en: 'Withdrawing',
        desc: '你倾向于先消化情绪，等平静了再谈。避免冲突不是逃避，而是你保护关系的方式。',
      note: '长期不表达会让委屈累积成隔阂。试着在当天说出一个小小的不舒服，而不是等它变成大的。'
      ,
      letter: '你选择先消化情绪，是因为你珍惜这段关系。但那些咽下去的话，不会真的消失——它们会变成距离。试着把一个小小的不舒服，在当天说出来。你会发现，表达不是破坏关系，而是保护它。'
      }
    },
    trust: {
      open: {
        name: '先相信',
        en: 'Open',
        desc: '你愿意先交付信任，再根据对方的回应调整。你相信真诚会换来真诚，即使偶尔受伤。',
      note: '你的开放是一种勇气，但也需要判断：真正的信任，是在对方证明可靠之后逐渐加深的，而不是一次给完。'
      ,
      letter: '你愿意先相信，这份赤诚很珍贵。世界曾让你失望，但你依然选择相信——这本身就很了不起。请继续相信，但也可以学会分期交付：一次给一点，看看对方怎么接住。真正的信任不是一次赌注，而是很多次小小的确认。'
      },
      cautious: {
        name: '先观察',
        en: 'Cautious',
        desc: '你需要通过时间和细节确认对方，才会慢慢打开自己。谨慎保护了你，也可能挡住了值得的人。',
      note: '信任可以在行动中建立：给一个小的试探性开放，观察对方如何接住，再决定要不要给更多。'
      ,
      letter: '你的谨慎不是缺陷，是你认真对待每段关系的证明。你只是需要时间和证据，这完全合理。请别因为「别人都很快」就怀疑自己。你的心门值得一把好锁，也值得一个对的人用耐心换来钥匙。'
      }
    },
    giving: {
      giving: {
        name: '习惯给予',
        en: 'Giving',
        desc: '你通过付出确认爱：照顾、陪伴、记得对方的需要。付出让你感到有价值，也是你表达在意的方式。',
      note: '当付出长期得不到回应，你会感到枯竭。真正的亲密不需要你一直给予——你也值得被稳稳接住。'
      ,
      letter: '你通过付出表达爱，是因为你曾被这样爱过，或曾渴望被这样爱。但爱不应该是单行道。你值得被记得、被照顾、被稳稳接住——不是因为你先付出了什么，而是因为你本身就是珍贵的。试着让一些人走近你，让他们也为你做点什么。'
      },
      boundary: {
        name: '保持界限',
        en: 'Boundaried',
        desc: '你清楚自己的底线，不容易被情感绑架。界限让你的爱更真实，也让你能持续地给出而不耗尽自己。',
      note: '界限感强有时会让对方觉得「你不需要我」。试着让重要的人知道：你的界限不是拒绝，而是想让关系更长久。'
      ,
      letter: '你的界限是你给关系的长久承诺——你很早就明白，只有先保护自己，才能持续地去爱。这是很多人一生都学不会的智慧。请别因为对方的不理解而动摇。温柔地告诉他们：我的边界不是墙，是我为「我们可以走很远」而做的准备。'
      }
    }
  },
  questions: [
    {
      q: '刚认识一个人时，你更容易？',
      options: [
        { text: '主动分享生活，制造联结', tag: '先伸出手', score: { closeness: { seeking: 1 } } },
        { text: '保持礼貌的距离，观察对方', tag: '先看清楚', score: { closeness: { reserved: 1 } } }
      ]
    },
    {
      q: '一段关系里让你最有安全感的是？',
      options: [
        { text: '频繁的交流与被想起', tag: '联结感', score: { closeness: { seeking: 1 } } },
        { text: '各自忙碌但知道对方在', tag: '空间感', score: { closeness: { reserved: 1 } } }
      ]
    },
    {
      q: '当你需要支持时，你通常？',
      options: [
        { text: '直接说出需要', tag: '表达求助', score: { closeness: { seeking: 1 } } },
        { text: '先自己处理，实在不行再说', tag: '独立消化', score: { closeness: { reserved: 1 } } }
      ]
    },
    {
      q: '伴侣或密友长时间不回消息，你更容易？',
      options: [
        { text: '感到不安，想确认对方怎么了', tag: '联结渴望', score: { closeness: { seeking: 1 } } },
        { text: '认为对方有自己的事，等对方回来', tag: '空间理解', score: { closeness: { reserved: 1 } } }
      ]
    },
    {
      q: '意见不合时，你的第一反应是？',
      options: [
        { text: '当场说清楚，不留疙瘩', tag: '速战速决', score: { conflict: { direct: 1 } } },
        { text: '先避开，等情绪冷却再说', tag: '冷却处理', score: { conflict: { withdraw: 1 } } }
      ]
    },
    {
      q: '关系中出现矛盾，你更怕的是？',
      options: [
        { text: '问题被藏着，关系带着刺往前走', tag: '怕积压', score: { conflict: { direct: 1 } } },
        { text: '话赶话说出伤人的东西', tag: '怕失控', score: { conflict: { withdraw: 1 } } }
      ]
    },
    {
      q: '被误解的时候，你通常？',
      options: [
        { text: '立刻解释，直到对方听懂', tag: '坚持澄清', score: { conflict: { direct: 1 } } },
        { text: '觉得解释没用，等对方自己想明白', tag: '沉默等待', score: { conflict: { withdraw: 1 } } }
      ]
    },
    {
      q: '朋友之间出现沉默的冷战，你会？',
      options: [
        { text: '主动破冰，把话摊开', tag: '主动解决', score: { conflict: { direct: 1 } } },
        { text: '给彼此时间，等对方先开口', tag: '等待时机', score: { conflict: { withdraw: 1 } } }
      ]
    },
    {
      q: '向新朋友透露心事，你更接近？',
      options: [
        { text: '聊得深了，自然会说', tag: '顺势开放', score: { trust: { open: 1 } } },
        { text: '确认对方可靠之后才说', tag: '先验再交', score: { trust: { cautious: 1 } } }
      ]
    },
    {
      q: '被重要的人辜负一次之后，你会？',
      options: [
        { text: '给机会，再相信一次', tag: '愿意修复', score: { trust: { open: 1 } } },
        { text: '建立更高的防线', tag: '自我保护', score: { trust: { cautious: 1 } } }
      ]
    },
    {
      q: '你更认同哪句话？',
      options: [
        { text: '信任是关系的起点', tag: '先信后验', score: { trust: { open: 1 } } },
        { text: '信任是关系的成果', tag: '先验后信', score: { trust: { cautious: 1 } } }
      ]
    },
    {
      q: '对方迟到一小时且没提前说，你更容易？',
      options: [
        { text: '先问原因，选择相信有苦衷', tag: '善意假设', score: { trust: { open: 1 } } },
        { text: '记住这次失约，下次降低预期', tag: '细节记账', score: { trust: { cautious: 1 } } }
      ]
    },
    {
      q: '你表达爱意最常用的方式是？',
      options: [
        { text: '为对方做事、照顾细节', tag: '行动付出', score: { giving: { giving: 1 } } },
        { text: '尊重对方独立，不过度介入', tag: '边界尊重', score: { giving: { boundary: 1 } } }
      ]
    },
    {
      q: '朋友向你倾诉困难，你通常？',
      options: [
        { text: '立刻想办法帮ta', tag: '优先给予', score: { giving: { giving: 1 } } },
        { text: '先问ta需要什么，再决定帮多少', tag: '量力给予', score: { giving: { boundary: 1 } } }
      ]
    },
    {
      q: '你感到被掏空时，更多是因为？',
      options: [
        { text: '给了太多，忘了留给自己', tag: '过度付出', score: { giving: { giving: 1 } } },
        { text: '被期待无休止地回应', tag: '边界被踩', score: { giving: { boundary: 1 } } }
      ]
    },
    {
      q: '你更希望对方如何爱你？',
      options: [
        { text: '记得我的需要，主动给我', tag: '被照顾', score: { giving: { giving: 1 } } },
        { text: '尊重我的节奏，不逼我', tag: '被理解', score: { giving: { boundary: 1 } } }
      ]
    },
    {
      q: '当对方突然沉默，你更容易？',
      options: [
        { text: '反复想自己是不是做错了什么', tag: '自我归因', score: { closeness: { seeking: 1 } } },
        { text: '觉得对方需要空间，我也安静', tag: '尊重沉默', score: { closeness: { reserved: 1 } } }
      ]
    },
    {
      q: '对方指出你的问题，你第一反应是？',
      options: [
        { text: '解释或反击，先守住自己', tag: '防御', score: { conflict: { direct: 1 } } },
        { text: '沉默，但心里很难受', tag: '内伤', score: { conflict: { withdraw: 1 } } }
      ]
    },
    {
      q: '「被拒绝」对你意味着？',
      options: [
        { text: '被拒绝=我不够好', tag: '拒绝等于否定', score: { trust: { cautious: 1 } } },
        { text: '被拒绝=这件事不行，与我无关', tag: '拒绝等于信号', score: { trust: { open: 1 } } }
      ]
    },
    {
      q: '你最难开口的一句话是？',
      options: [
        { text: '「我不需要你」', tag: '难说独立', score: { giving: { giving: 1 } } },
        { text: '「我需要你」', tag: '难说依赖', score: { giving: { boundary: 1 } } }
      ]
    },
    {
      q: '关系里的「公平」，你更看重？',
      options: [
        { text: '付出要被看见、被回应', tag: '对等付出', score: { giving: { giving: 1 } } },
        { text: '彼此都不越界', tag: '对等边界', score: { giving: { boundary: 1 } } }
      ]
    },
    {
      q: '如果你可以改变一种关系模式，你会选？',
      options: [
        { text: '不再那么害怕失去', tag: '恐惧松动', score: { closeness: { seeking: 1 } } },
        { text: '不再那么害怕靠近', tag: '高墙松动', score: { closeness: { reserved: 1 } } },
        { text: '冲突时能好好说话', tag: '表达升级', score: { conflict: { direct: 1 } } },
        { text: '不满时不再憋着', tag: '表达勇气', score: { conflict: { withdraw: 1 } } },
        { text: '先相信别人一次', tag: '信任练习', score: { trust: { open: 1 } } },
        { text: '不再用付出来换爱', tag: '价值松动', score: { giving: { giving: 1 } } }
      ]
    },
    {
      q: '一段好的关系，在你心里更像？',
      options: [
        { text: '两个人并肩走', tag: '同行', score: { closeness: { seeking: 1 } } },
        { text: '各自发光，偶尔交会', tag: '独立交会', score: { closeness: { reserved: 1 } } }
      ]
    },
    {
      q: '你处理「关系里的小委屈」通常是？',
      options: [
        { text: '当时就会说出来', tag: '即时表达', score: { conflict: { direct: 1 } } },
        { text: '先压着，攒多了才爆发', tag: '延迟爆发', score: { conflict: { withdraw: 1 } } }
      ]
    },
    {
      q: '关系让你最累的时刻是？',
      options: [
        { text: '我一直在靠近，ta却在后退', tag: '单向奔赴', score: { closeness: { seeking: 1 } } },
        { text: '被要求无话不谈', tag: '空间被占', score: { closeness: { reserved: 1 } } },
        { text: '冲突永远说不清', tag: '无效沟通', score: { conflict: { withdraw: 1 } } },
        { text: '我付出很多却没被看见', tag: '付出失衡', score: { giving: { giving: 1 } } }
      ]
    }
  ],
  upgrade: [
    '主动靠近的你：每天给重要的人一次不期待回应的表达，练习「付出本身已是爱」',
    '保持空间的你：每周告诉一个人你的真实状态，哪怕只有一句「我今天有点累」',
    '直面冲突的你：冲突时先说「我感到……」，而不是「你总是……」',
    '回避冲突的你：练习在当天说出一个小的不舒服，不让它累积成大的',
    '先相信的你：把信任分期交付，让对方有机会一次次证明',
    '先观察的你：每周做一次小小的开放尝试，观察对方如何接住',
    '习惯给予的你：每天为自己做一件小事，练习「我也值得被照顾」',
    '保持界限的你：让重要的人知道，你的界限是为了关系更长久'
  ],
  maintenance: '关系不是一场考试。它是一场持续的对话——每一次靠近、冲突、信任和付出，都是对话里的一个句子。',
  insights: [
    { match: [{ q: 0, option: 0 }], text: '你在刚认识时选择主动分享，说明你习惯用「给出自己」来建立联结——这是勇气，也请记得对方需要时间接住你。' },
    { match: [{ q: 4, option: 0 }], text: '你选择当场说清矛盾，说明你重视关系的真实。试着在情绪顶点先暂停十秒，把话从「指责」换成「感受」。' },
    { match: [{ q: 8, option: 1 }], text: '你在信任上选择先观察，这不是冷漠，而是你认真对待每一次交付。试着给值得的人一个小台阶。' },
    { match: [{ q: 12, option: 0 }], text: '你习惯用行动付出爱意。记得偶尔也让自己被照顾——爱是双向的河流，不是单向的灌溉。' },
    { match: [{ q: 13, option: 1 }], text: '你会先问对方需要什么再决定帮助，这是难得的边界智慧。它让你的给予更持久、更真诚。' }
  ]
};
