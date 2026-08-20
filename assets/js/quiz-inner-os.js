window.GUAN_QUIZ = {
  key: 'guan_inneros',
  title: '你如何运行你自己',
  en: 'Inner OS Test',
  resultLabel: '系统概况',
  scoring: 'inneros',
  category: 'self',
  categoryTitle: '自我成长',
  desc: '你的输入方式、决策机制、情绪处理与成长路径，组成了你的内在 OS。了解它，才能优化它。',
  depth: {
    title: '你不是一台需要修复的机器',
    lead: '把内在比作操作系统，是为了方便理解，而不是为了让你把自己当成一个有 bug 的程序。',
    body: '真正的好系统，不是没有缺陷的系统，而是知道自己特性的系统。直觉型系统不需要强迫自己变成分析型——它需要的是在关键时刻加一道校验；行动型系统不需要强迫自己慢下来——它需要的是在重大决定前加一个暂停键。你的「短板」很少是缺陷，更多是某种特质的影子：过度付出是温柔的影子，犹豫是谨慎的影子，拖延是对意义的坚持。看见这些影子，不是为了消除它们，而是学会与它们共处，让它们在最合适的位置发光。',
    closing: '最好的系统不是「完美」，而是「知道自己是谁，并愿意为重要的事调整」。'
  },
  dimensions: [
    { key: 'input', name: '输入方式', modes: ['intuitive', 'analytical'] },
    { key: 'decision', name: '决策机制', modes: ['prudent', 'action'] },
    { key: 'emotion', name: '情绪处理', modes: ['expressive', 'internal'] },
    { key: 'growth', name: '成长路径', modes: ['deep', 'broad'] }
  ],
  dimensionModes: {
    input: {
      intuitive: {
        name: '直觉型',
        en: 'Intuitive',
        desc: '你靠氛围、感觉和第一印象理解世界，常常先「觉得」再「证明」。',
        note: '优化方向：给直觉加一道事实校验——「我觉得对」之后，再问一次「证据是什么」。',
        letter: '你的直觉不是玄学，是你多年经验在后台高速运算的结果。请别因为「说不出理由」就怀疑它。世界需要你这样的人——先看见，再理解。只是在重大决定时，给你的直觉配一个温柔的助手：让它在行动前多问一次「证据是什么」。'
      },
      analytical: {
        name: '分析型',
        en: 'Analytical',
        desc: '你靠数据、结构和逻辑理解世界，习惯先看清全貌再表态。',
        note: '优化方向：给分析设一个停止条件——「信息够不够」比「信息全不全」更重要。',
        letter: '你习惯把世界想清楚再行动，这份严谨保护你避开了很多坑。但请记得：人生有些重要的事，永远无法靠分析获得答案——比如爱，比如勇气，比如你真正想要的生活。试着让分析停下来，让心走一段路。'
      }
    },
    decision: {
      prudent: {
        name: '稳妥型',
        en: 'Prudent',
        desc: '你倾向收集足够信息、确认风险可控之后再行动。',
        note: '优化方向：用「最小决策成本」代替「最优决策」——很多机会不会等你算完。',
        letter: '你的谨慎让很多人可以放心依赖你。但我想提醒你：人生不是所有选择都有「足够信息」的一天。有时候，你只需要一个「够好」的决定和一颗愿意修正的心。试着在小事上练习「不完美地行动」——你会发现，世界比想象中宽容。'
      },
      action: {
        name: '行动型',
        en: 'Action-Oriented',
        desc: '你通过行动获取反馈，先做了再说，错了再调。',
        note: '优化方向：给重大决定加一个「暂停键」，在出发前问一次「这个反悔成本是多少」。',
        letter: '你的行动力是很多人羡慕的超能力——你让事情发生。但超能力也需要充电：在你冲出去之前，试着多问自己一句「这件事值得我投入吗」。停下来不是犹豫，是让每一次出发都更有分量。'
      }
    },
    emotion: {
      expressive: {
        name: '外放型',
        en: 'Expressive',
        desc: '你的情绪需要被看见、被表达，说出来本身就是处理。',
        note: '优化方向：表达时区分「情绪」与「结论」，避免在情绪峰值做重大决定。',
        letter: '你的情绪像河，流动起来才健康。请继续表达——你的真实让身边的人感到安全。只是记住：情绪最烫的时候，先让它流一会儿，再决定要不要用它做决定。你的感受值得被听见，也值得被好好安放。'
      },
      internal: {
        name: '内化型',
        en: 'Internalized',
        desc: '你习惯自己消化情绪，表面平静，内里翻涌。',
        note: '优化方向：主动给情绪一个出口——写作、运动、一次谈话，都比独自硬扛有效。',
        letter: '你表面平静，内里却装了很多。那些没说出口的话、没流出来的眼泪，不是不存在，只是被你的「我可以」压住了。请给自己一个出口：写下、跑起来、或告诉一个可信的人。你不必一直那么坚强——让情绪出来透透气，你才会真正轻松。'
      }
    },
    growth: {
      deep: {
        name: '深挖型',
        en: 'Deep-Dive',
        desc: '你倾向一次专注一个领域，把它挖深挖透。',
        note: '优化方向：定期抬头看看相邻领域，深挖型最大的盲区是「隧道视野」。',
        letter: '你专注的样子很动人——把一件事做到极致，是这个时代稀缺的品质。但请记得偶尔抬头：看看相邻的领域、听听不同的声音。深挖让你站稳，而开阔让你走远。两者都需要。'
      },
      broad: {
        name: '广谱型',
        en: 'Generalist',
        desc: '你靠多线并行和跨界连接学习，新领域是你的养分。',
        note: '优化方向：为每个新领域设置「入门闭环」——学完能做出一个作品，再进入下一个。',
        letter: '你是天生的连接者——别人眼里的散点，在你这里织成了网。这份广博让你比很多人都看得远。只是注意：你的网需要几根深埋的柱子，才能撑得住。挑一两个领域挖深一点，让广度与深度相互支撑。'
      }
    }
  },
  questions: [
    {
      q: '面对一个全新的领域，你通常先？',
      options: [
        { text: '看几篇「感觉对」的文章，或找人聊一聊', tag: '先建立感觉', score: { input: { intuitive: 1 } } },
        { text: '先找数据、报告和结构图', tag: '先建立结构', score: { input: { analytical: 1 } } }
      ]
    },
    {
      q: '做重要决定之前，你最依赖的是？',
      options: [
        { text: '那个反复出现的「就是它」的感觉', tag: '感觉即信号', score: { input: { intuitive: 1 } } },
        { text: '把利弊列成表，反复推演', tag: '推演即安全', score: { input: { analytical: 1 } } }
      ]
    },
    {
      q: '选择工作或方向时，你更接近？',
      options: [
        { text: '收集足够信息，确认稳妥再行动', tag: '先确认再出发', score: { decision: { prudent: 1 } } },
        { text: '先开始，错了再调整', tag: '先出发再校准', score: { decision: { action: 1 } } }
      ]
    },
    {
      q: '面对「条件还不成熟」的机会，你通常？',
      options: [
        { text: '大概率会等条件成熟', tag: '等待是策略', score: { decision: { prudent: 1 } } },
        { text: '大概率先上车再说', tag: '先占位置', score: { decision: { action: 1 } } }
      ]
    },
    {
      q: '情绪上来的时候，你更想？',
      options: [
        { text: '说出来，找人聊聊', tag: '表达即释放', score: { emotion: { expressive: 1 } } },
        { text: '自己待着，慢慢消化', tag: '独处即处理', score: { emotion: { internal: 1 } } }
      ]
    },
    {
      q: '在别人眼中，你的情绪状态通常是？',
      options: [
        { text: '比较透明，藏不住', tag: '写在脸上', score: { emotion: { expressive: 1 } } },
        { text: '比较神秘，看不出波动', tag: '深不见底', score: { emotion: { internal: 1 } } }
      ]
    },
    {
      q: '过去一年你学习的方式更接近？',
      options: [
        { text: '集中打透一两个主题', tag: '纵深优先', score: { growth: { deep: 1 } } },
        { text: '同时接触很多领域，寻找连接', tag: '广度优先', score: { growth: { broad: 1 } } }
      ]
    },
    {
      q: '如果有一个月的自由时间，你更想？',
      options: [
        { text: '把某个技能练到明显进步', tag: '看见深度', score: { growth: { deep: 1 } } },
        { text: '走访、阅读、体验不同领域', tag: '看见广度', score: { growth: { broad: 1 } } }
      ]
    },
    {
      q: '你更相信哪种判断？',
      options: [
        { text: '第一眼的直觉往往是对的', tag: '直觉优先', score: { input: { intuitive: 1 } } },
        { text: '经过分析后的判断更可靠', tag: '分析优先', score: { input: { analytical: 1 } } }
      ]
    },
    {
      q: '别人给你一个模糊的建议，你会？',
      options: [
        { text: '凭感觉决定要不要听', tag: '感觉筛选', score: { input: { intuitive: 1 } } },
        { text: '追着问清楚依据再判断', tag: '依据筛选', score: { input: { analytical: 1 } } }
      ]
    },
    {
      q: '一个决定迟迟做不了，通常是因为？',
      options: [
        { text: '选项都还行，但缺一个「心动」', tag: '缺感觉', score: { decision: { prudent: 1 } } },
        { text: '怕做了就不好改了', tag: '怕反悔', score: { decision: { prudent: 1 } } },
        { text: '其实心里有答案，但怕承担后果', tag: '怕承担', score: { decision: { action: 1 } } },
        { text: '问题是我太急着做决定了', tag: '太急', score: { decision: { action: 1 } } }
      ]
    },
    {
      q: '你更容易后悔哪种情况？',
      options: [
        { text: '没想清楚就做了', tag: '悔冲动', score: { decision: { prudent: 1 } } },
        { text: '想太久，机会走了', tag: '悔犹豫', score: { decision: { action: 1 } } }
      ]
    },
    {
      q: '情绪不好的时候，你最需要？',
      options: [
        { text: '一个能说话的人', tag: '需要出口', score: { emotion: { expressive: 1 } } },
        { text: '一段不说话的时间', tag: '需要空间', score: { emotion: { internal: 1 } } }
      ]
    },
    {
      q: '你如何处理「突然的委屈」？',
      options: [
        { text: '当下就会表达出来', tag: '即时表达', score: { emotion: { expressive: 1 } } },
        { text: '当时忍住，事后很久才说起', tag: '延迟表达', score: { emotion: { internal: 1 } } }
      ]
    },
    {
      q: '学新东西时，你更享受？',
      options: [
        { text: '把一个东西学到「精」', tag: '纵深乐趣', score: { growth: { deep: 1 } } },
        { text: '在不同领域间找到联系', tag: '横向乐趣', score: { growth: { broad: 1 } } }
      ]
    },
    {
      q: '你的知识结构更像？',
      options: [
        { text: '一口深井', tag: '深度结构', score: { growth: { deep: 1 } } },
        { text: '一张网', tag: '网络结构', score: { growth: { broad: 1 } } }
      ]
    },
    {
      q: '面对完全陌生的任务，你最先做的是？',
      options: [
        { text: '凭感觉先碰一碰，找找手感', tag: '先感后知', score: { input: { intuitive: 1 } } },
        { text: '先搜资料、列框架，摸清结构', tag: '先知后感', score: { input: { analytical: 1 } } }
      ]
    },
    {
      q: '你最容易「想太多」的场景是？',
      options: [
        { text: '信息太多，不知道信哪个', tag: '信号过载', score: { input: { analytical: 1 } } },
        { text: '选项都有感觉，没有压倒性的那个', tag: '感觉过载', score: { input: { intuitive: 1 } } }
      ]
    },
    {
      q: '做错决定后，你通常？',
      options: [
        { text: '复盘很久，下次更谨慎', tag: '复盘强化', score: { decision: { prudent: 1 } } },
        { text: '接受损失，尽快move on', tag: '快速翻篇', score: { decision: { action: 1 } } }
      ]
    },
    {
      q: '「最优解」对你意味着？',
      options: [
        { text: '值得等到它出现', tag: '等待最优', score: { decision: { prudent: 1 } } },
        { text: '不存在的幻觉，行动才有答案', tag: '行动优先', score: { decision: { action: 1 } } }
      ]
    },
    {
      q: '情绪低落时，你最不需要的是？',
      options: [
        { text: '一直被追问「你到底怎么了」', tag: '追问窒息', score: { emotion: { internal: 1 } } },
        { text: '「想开点」这类建议', tag: '建议窒息', score: { emotion: { expressive: 1 } } }
      ]
    },
    {
      q: '你的情绪「表达延迟」通常是？',
      options: [
        { text: '几乎没有，当下就会流露', tag: '即时外显', score: { emotion: { expressive: 1 } } },
        { text: '比较长，甚至隔天才知道自己在气什么', tag: '慢半拍', score: { emotion: { internal: 1 } } }
      ]
    },
    {
      q: '你学习时的「心流」更容易出现在？',
      options: [
        { text: '把一个难点反复打磨到通透', tag: '深潜型心流', score: { growth: { deep: 1 } } },
        { text: '在不同知识间建立新连接', tag: '跳跃型心流', score: { growth: { broad: 1 } } }
      ]
    },
    {
      q: '面对「学不完」的知识，你会？',
      options: [
        { text: '精选少数主题，学深学透', tag: '少即是多', score: { growth: { deep: 1 } } },
        { text: '广泛涉猎，先建认知地图', tag: '多即是全', score: { growth: { broad: 1 } } }
      ]
    },
    {
      q: '你的「灵感时刻」通常发生在？',
      options: [
        { text: '沉浸做一件事的时候', tag: '心流灵感', score: { input: { intuitive: 1 } } },
        { text: '信息齐备、逻辑清晰之后', tag: '结构灵感', score: { input: { analytical: 1 } } }
      ]
    }
  ],
  upgrade: [
    '给最强的维度加上反向练习：直觉型每周做一次事实核查，分析型每周做一次不完整信息下的决定',
    '为最弱的维度建立最小习惯：行动型启动「10 分钟开始法」，稳妥型设置「决定截止日」',
    '每月运行一次「系统体检」：回看这个月，哪一次情绪、决定或学习方法让你后悔，记录下来作为下次的输入',
    '为你的系统找一个互补的搭档：你的短板，正好是别人最强的部分'
  ],
  maintenance: '每天问自己三个问题：今天哪件事让我最有能量？哪件事在消耗我？明天最小的一步是什么？——这就是你的系统日志。'
  ,
  insights: [
    { match: [{ q: 8, option: 0 }], text: '你信任第一眼的感觉——这不是鲁莽，是你的系统在高频运转后的快速判断。给它加一道轻校验，会更稳。' },
    { match: [{ q: 10, option: 0 }], text: '「缺一个心动」让你迟迟不做决定——你在等待的其实不是更多信息，而是更真实的渴望。' },
    { match: [{ q: 12, option: 0 }], text: '你需要能说话的人——表达是你处理情绪的通道，请珍惜那些愿意听你说话的人。' },
    { match: [{ q: 15, option: 0 }], text: '你偏好「一口深井」式的学习——这是稀缺的专注力，记得定期抬头看看井口外的世界。' }
  ]
};
