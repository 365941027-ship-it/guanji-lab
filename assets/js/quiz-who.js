window.GUAN_QUIZ = {
  key: 'guan_who',
  title: '我如何成为我',
  en: 'Who Am I Becoming',
  resultLabel: '自我坐标',
  scoring: 'stage',
  category: 'self',
  categoryTitle: '自我探索',
  desc: '你是谁？你正处在人生的哪个阶段？你真正想要什么？',
  questions: [
    // 维度1：原型（5个方向）
    { q: '没有任何安排的周末清晨，你更可能？', options: [
      { text: '临时起意，去个没去过的地方', tag: '出发', score: { 探索者: 2 } },
      { text: '把房间整理一遍，或做点想做的事', tag: '创造', score: { 创造者: 2 } },
      { text: '什么都不安排，发发呆听听自己', tag: '觉察', score: { 觉知者: 2 } },
      { text: '盘算一下最近哪里不太对劲', tag: '审视', score: { 重构者: 2 } },
      { text: '约家人朋友，确认他们过得如何', tag: '守护', score: { 守护者: 2 } }] },
    { q: '朋友遇到烦心事找你，你通常会？', options: [
      { text: '带TA出去走走，换个心情', tag: '同行', score: { 探索者: 2 } },
      { text: '帮TA把问题拆开找条路', tag: '解构', score: { 创造者: 2 } },
      { text: '安静听完，让TA把话说完', tag: '倾听', score: { 觉知者: 2 } },
      { text: '直说TA没看见的那一面', tag: '点破', score: { 重构者: 2 } },
      { text: '陪着TA，哪怕什么都不说', tag: '陪伴', score: { 守护者: 2 } }] },
    { q: '对你来说，「自由」最接近？', options: [
      { text: '想去哪就能去哪', tag: '移动', score: { 探索者: 2 } },
      { text: '想做什么就能做出来', tag: '创造', score: { 创造者: 2 } },
      { text: '不用装，做真实的自己', tag: '真实', score: { 觉知者: 2 } },
      { text: '不被任何框架绑住', tag: '无框', score: { 重构者: 2 } },
      { text: '爱的人平平安安', tag: '安心', score: { 守护者: 2 } }] },
    { q: '做完什么事，你会觉得「又活过来了」？', options: [
      { text: '接触了新鲜的人和事', tag: '尝新', score: { 探索者: 2 } },
      { text: '把一个想法真正做出来了', tag: '落地', score: { 创造者: 2 } },
      { text: '和一个懂你的人深聊一次', tag: '深聊', score: { 觉知者: 2 } },
      { text: '把一直堵着的事彻底理清', tag: '理清', score: { 重构者: 2 } },
      { text: '帮到了一个需要帮助的人', tag: '助人', score: { 守护者: 2 } }] },
    { q: '心里那个挑剔的声音，常对你说？', options: [
      { text: '「你还没见过真正的世界」', tag: '见识', score: { 探索者: 2 } },
      { text: '「你只是想想，什么都没做出来」', tag: '行动', score: { 创造者: 2 } },
      { text: '「你连自己都不了解」', tag: '自知', score: { 觉知者: 2 } },
      { text: '「你还在假装一切都好」', tag: '真实', score: { 重构者: 2 } },
      { text: '「你没照顾好重要的人」', tag: '责任', score: { 守护者: 2 } }] },
    { q: '如果人生是一本书，你希望自己是？', options: [
      { text: '公路小说，一路在路上', tag: '公路', score: { 探索者: 2 } },
      { text: '建筑师手记，一步步盖起来', tag: '建造', score: { 创造者: 2 } },
      { text: '哲学随笔，追问人生', tag: '追问', score: { 觉知者: 2 } },
      { text: '重构之书，旧的推翻重写', tag: '重写', score: { 重构者: 2 } },
      { text: '温暖的故事集，关于人', tag: '人情', score: { 守护者: 2 } }] },
    // 维度2：身份（4个方向）
    { q: '有人问「你是个什么样的人」，你？', options: [
      { text: '一时说不上来', tag: '探索中', score: { 探索身份: 1 } },
      { text: '说出几个角色（工作/家庭）', tag: '角色', score: { 角色身份: 1 } },
      { text: '「我还在变」', tag: '流动', score: { 流动身份: 1 } },
      { text: '说出核心价值', tag: '整合', score: { 整合身份: 1 } }] },
    { q: '你「最像自己」的时刻是？', options: [
      { text: '尝试新事物时', tag: '尝试', score: { 探索身份: 1 } },
      { text: '尽责任时', tag: '尽责', score: { 角色身份: 1 } },
      { text: '独处时', tag: '独处', score: { 流动身份: 1 } },
      { text: '做符合价值观的事时', tag: '价值', score: { 整合身份: 1 } }] },
    { q: '你的身份更像？', options: [
      { text: '一片还在画的地图', tag: '地图', score: { 探索身份: 1 } },
      { text: '一件合身的衣服', tag: '衣服', score: { 角色身份: 1 } },
      { text: '一条流动的河', tag: '河', score: { 流动身份: 1 } },
      { text: '一棵扎了根的树', tag: '树', score: { 整合身份: 1 } }] },
    { q: '你「最怕」的自我问题是？', options: [
      { text: '怕一直找不到自己', tag: '怕迷', score: { 探索身份: 1 } },
      { text: '怕被角色吞没', tag: '怕吞', score: { 角色身份: 1 } },
      { text: '怕变到认不出', tag: '怕变', score: { 流动身份: 1 } },
      { text: '怕活成别人', tag: '怕假', score: { 整合身份: 1 } }] },
    // 维度3：人生阶段（4个方向）
    { q: '最近半年，你生活的主旋律更接近？', options: [
      { text: '试了很多新东西，但方向未定', tag: '播种', score: { 探索期: 2 } },
      { text: '经历了一场重要的崩塌或告别', tag: '换土', score: { 重构期: 2 } },
      { text: '在一条路上稳步积累', tag: '扎根', score: { 积累期: 2 } },
      { text: '隐约感到这条路快到尽头了', tag: '酝酿', score: { 转型期: 2 } }] },
    { q: '想到未来一年，你心里最强烈的是？', options: [
      { text: '想试试看，但不知选哪条', tag: '多选', score: { 探索期: 2 } },
      { text: '先把自己修好再说别的', tag: '修复', score: { 重构期: 2 } },
      { text: '继续深耕，做得更好', tag: '深耕', score: { 积累期: 2 } },
      { text: '想换一种活法，还在酝酿', tag: '酝酿变', score: { 转型期: 2 } }] },
    { q: '你与「确定感」的关系是？', options: [
      { text: '很想要，但找不到', tag: '渴求', score: { 探索期: 2 } },
      { text: '曾经确定的都碎了', tag: '重建', score: { 重构期: 2 } },
      { text: '比较确定，按计划走', tag: '稳定', score: { 积累期: 2 } },
      { text: '太确定了，反而怀疑', tag: '怀疑', score: { 转型期: 2 } }] },
    { q: '你最近最消耗你的，是？', options: [
      { text: '选择太多，不知往哪走', tag: '方向', score: { 探索期: 2 } },
      { text: '旧伤旧模式反复出现', tag: '旧事', score: { 重构期: 2 } },
      { text: '事情太多时间不够', tag: '忙碌', score: { 积累期: 2 } },
      { text: '价值感下降，提不起劲', tag: '意义', score: { 转型期: 2 } }] },
    // 维度4：价值观（4个方向）
    { q: '如果生活必须舍弃一样，你最难割舍的是？', options: [
      { text: '随时出发、不被束缚的自由', tag: '自由', score: { 自由: 2 } },
      { text: '和重要的人紧密联结', tag: '联结', score: { 联结: 2 } },
      { text: '做自己想做的事', tag: '创造', score: { 创造: 2 } },
      { text: '稳定可预期的生活', tag: '安定', score: { 安定: 2 } }] },
    { q: '你羡慕的生活更接近？', options: [
      { text: '浪迹天涯，不被定义', tag: '流浪', score: { 自由: 2 } },
      { text: '三两知己围炉夜话', tag: '知己', score: { 联结: 2 } },
      { text: '留下自己的作品', tag: '作品', score: { 创造: 2 } },
      { text: '一屋两人三餐四季', tag: '日常', score: { 安定: 2 } }] },
    { q: '你更希望被怎样记住？', options: [
      { text: '一个不被定义的人', tag: '不定义', score: { 自由: 2 } },
      { text: '一个真诚温暖的人', tag: '温暖', score: { 联结: 2 } },
      { text: '一个留下作品的人', tag: '留下', score: { 创造: 2 } },
      { text: '一个把日子过好的人', tag: '过好', score: { 安定: 2 } }] },
    { q: '夜深人静时，你常被哪种念头触碰？', options: [
      { text: '世界那么大', tag: '远方', score: { 自由: 2 } },
      { text: '某某现在还好吗', tag: '牵挂', score: { 联结: 2 } },
      { text: '我还可以做点什么', tag: '可能', score: { 创造: 2 } },
      { text: '现在这样也挺好', tag: '知足', score: { 安定: 2 } }] }
  ],
  results: {},
  insights: [],
  depthTitle: '你是谁、你在哪个阶段、你要什么——这三问放在一起，才是完整的你。',
  _map: function (r) {
    // 主维度 = 得分最高的原型 + 阶段 + 价值 + 身份
    var proto = ['探索者', '创造者', '觉知者', '重构者', '守护者'].sort(function (a, b) { return (r.scores[b] || 0) - (r.scores[a] || 0); })[0];
    var stage = ['探索期', '重构期', '积累期', '转型期'].sort(function (a, b) { return (r.scores[b] || 0) - (r.scores[a] || 0); })[0];
    var val = ['自由', '联结', '创造', '安定'].sort(function (a, b) { return (r.scores[b] || 0) - (r.scores[a] || 0); })[0];
    var id = ['探索身份', '角色身份', '流动身份', '整合身份'].sort(function (a, b) { return (r.scores[b] || 0) - (r.scores[a] || 0); })[0];
    return { proto: proto, stage: stage, val: val, id: id };
  }
};
