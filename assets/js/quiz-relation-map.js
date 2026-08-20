window.GUAN_QUIZ = {
  key: 'guan_relation_map',
  title: '我在关系里的位置',
  en: 'My Place In Love',
  resultLabel: '关系姿态',
  scoring: 'stage',
  category: 'self',
  categoryTitle: '心灵疗愈',
  desc: '你如何靠近、如何保护自己、如何付出、如何告别？',
  questions: [
    // 维度1：依恋（4类）
    { q: '对方几小时没回消息，你心里？', options: [
      { text: '有点好奇，但相信TA在忙', tag: '安心', score: { 依安全: 1 } },
      { text: '开始不安，反复看手机', tag: '不安', score: { 依焦虑: 1 } },
      { text: '无所谓，正好我也不想回', tag: '疏离', score: { 依回避: 1 } },
      { text: '既想联系又怕打扰，反复纠结', tag: '拉扯', score: { 依混乱: 1 } }] },
    { q: '吵完架之后，你通常？', options: [
      { text: '给彼此空间，再主动沟通', tag: '修复', score: { 依安全: 1 } },
      { text: '焦虑到睡不着，想立刻和好', tag: '急切', score: { 依焦虑: 1 } },
      { text: '冷处理，觉得解释没用', tag: '冷', score: { 依回避: 1 } },
      { text: '想靠近又怕被拒绝，僵在原地', tag: '僵', score: { 依混乱: 1 } }] },
    { q: '说出「我需要你」有多难？', options: [
      { text: '不难，可以直接说', tag: '直', score: { 依安全: 1 } },
      { text: '怕说多了把对方推开', tag: '怕推', score: { 依焦虑: 1 } },
      { text: '几乎不说，觉得没必要', tag: '不说', score: { 依回避: 1 } },
      { text: '有时说出来，有时又咽回去', tag: '反复', score: { 依混乱: 1 } }] },
    { q: '你对「承诺」的态度是？', options: [
      { text: '愿意承诺，也愿意经营', tag: '愿', score: { 依安全: 1 } },
      { text: '很想要承诺，怕对方不给', tag: '要', score: { 依焦虑: 1 } },
      { text: '承诺让我有压力', tag: '压', score: { 依回避: 1 } },
      { text: '想承诺又怕被束缚', tag: '缚', score: { 依混乱: 1 } }] },
    // 维度2：讨好（4类）
    { q: '别人向你求助，即使你很忙，你会？', options: [
      { text: '先答应，再挤时间', tag: '先应', score: { 讨习惯: 1 } },
      { text: '怕拒绝破坏关系', tag: '怕破', score: { 讨怕冲: 1 } },
      { text: '答应了才安心，证明我有用', tag: '证', score: { 讨求认: 1 } },
      { text: '其实不想，但说不出口', tag: '咽', score: { 讨低值: 1 } }] },
    { q: '你的「真实感受」通常？', options: [
      { text: '先照顾别人，自己的后说', tag: '后说', score: { 讨习惯: 1 } },
      { text: '怕冲突，就咽回去', tag: '咽', score: { 讨怕冲: 1 } },
      { text: '说之前先想会不会被喜欢', tag: '想评', score: { 讨求认: 1 } },
      { text: '自己也不太确定自己的感受', tag: '模糊', score: { 讨低值: 1 } }] },
    { q: '被「过度索取」时，你？', options: [
      { text: '一边累一边继续给', tag: '续给', score: { 讨习惯: 1 } },
      { text: '忍到极限才爆发', tag: '忍爆', score: { 讨怕冲: 1 } },
      { text: '更努力表现，希望被珍惜', tag: '更努', score: { 讨求认: 1 } },
      { text: '觉得「这就是我的命」', tag: '认命', score: { 讨低值: 1 } }] },
    // 维度3：边界（4类）
    { q: '别人未经同意用你的东西，你？', options: [
      { text: '算了，不想伤和气', tag: '算', score: { 边模糊: 1 } },
      { text: '很生气，甚至想翻脸', tag: '怒', score: { 边僵硬: 1 } },
      { text: '直接说「下次先问我」', tag: '直说', score: { 边健康: 1 } },
      { text: '心里不舒服但说不出口', tag: '咽', score: { 边成长: 1 } }] },
    { q: '你的「个人时间」被侵占时，你？', options: [
      { text: '配合，牺牲自己的安排', tag: '牺牲', score: { 边模糊: 1 } },
      { text: '很烦，但用冷漠表达', tag: '冷', score: { 边僵硬: 1 } },
      { text: '提前说清楚我的安排', tag: '声明', score: { 边健康: 1 } },
      { text: '事后才后悔没拒绝', tag: '悔', score: { 边成长: 1 } }] },
    { q: '你拒绝别人之后，通常？', options: [
      { text: '内疚很久，甚至道歉', tag: '疚', score: { 边模糊: 1 } },
      { text: '完全无所谓', tag: '无', score: { 边僵硬: 1 } },
      { text: '平静：拒绝是正常的', tag: '平', score: { 边健康: 1 } },
      { text: '反复想「是不是太狠了」', tag: '狠', score: { 边成长: 1 } }] },
    // 维度4：冲突修复（4类）
    { q: '吵完之后，你的第一反应是？', options: [
      { text: '想尽快和好', tag: '求和', score: { 冲靠近: 1 } },
      { text: '需要先冷静一下', tag: '冷', score: { 冲冷静: 1 } },
      { text: '不想说话', tag: '沉默', score: { 冲回避: 1 } },
      { text: '会想很多', tag: '想', score: { 冲内省: 1 } }] },
    { q: '你「主动和好」的难度是？', options: [
      { text: '不难，我会先开口', tag: '易', score: { 冲靠近: 1 } },
      { text: '要等情绪平复', tag: '等', score: { 冲冷静: 1 } },
      { text: '很难，等对方先', tag: '难', score: { 冲回避: 1 } },
      { text: '会反复想该怎么开口', tag: '反复', score: { 冲内省: 1 } }] },
    { q: '你「修复关系」的方式是？', options: [
      { text: '直接道歉/说明', tag: '直', score: { 冲靠近: 1 } },
      { text: '等大家都平静了再谈', tag: '谈', score: { 冲冷静: 1 } },
      { text: '用行动示好（做饭/帮忙）', tag: '动', score: { 冲回避: 1 } },
      { text: '写下来或认真思考', tag: '写', score: { 冲内省: 1 } }] },
    // 维度5：告别（4类）
    { q: '告别之后，你现在最常出现的是？', options: [
      { text: '反复回想', tag: '回', score: { 告反刍: 1 } },
      { text: '麻木、空落落', tag: '空', score: { 告麻木: 1 } },
      { text: '突然的难过', tag: '难', score: { 告波动: 1 } },
      { text: '慢慢在恢复', tag: '复', score: { 告愈合: 1 } }] },
    { q: '你「最怕」的是？', options: [
      { text: '忘了TA', tag: '忘', score: { 告反刍: 1 } },
      { text: '没有感觉', tag: '无感', score: { 告麻木: 1 } },
      { text: '一直好不起来', tag: '不好', score: { 告波动: 1 } },
      { text: '不再会爱', tag: '不会爱', score: { 告愈合: 1 } }] },
    { q: '你「心里最诚实」的一句话是？', options: [
      { text: '「我还在反复想」', tag: '想', score: { 告反刍: 1 } },
      { text: '「我好像麻木了」', tag: '麻', score: { 告麻木: 1 } },
      { text: '「我一会儿好一会儿糟」', tag: '糟', score: { 告波动: 1 } },
      { text: '「我在慢慢好」', tag: '好', score: { 告愈合: 1 } }] }
  ],
  results: {},
  insights: [],
  _map: function (r) {
    var s = r.scores;
    function top(keys) { return keys.sort(function (a, b) { return (s[b] || 0) - (s[a] || 0); })[0]; }
    return {
      attach: top(['依安全', '依焦虑', '依回避', '依混乱']),
      please: top(['讨习惯', '讨怕冲', '讨求认', '讨低值']),
      bound: top(['边模糊', '边僵硬', '边健康', '边成长']),
      conflict: top(['冲靠近', '冲冷静', '冲回避', '冲内省']),
      goodbye: top(['告反刍', '告麻木', '告波动', '告愈合'])
    };
  }
};
