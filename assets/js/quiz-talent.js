window.GUAN_QUIZ = {
  key: 'guan_talent',
  title: '我的天赋信号',
  en: 'My Talent Signal',
  resultLabel: '天赋地图',
  scoring: 'stage',
  category: 'self',
  categoryTitle: '天赋发掘',
  desc: '你的心流藏在哪？你的性格特质如何组合成独一无二的天赋？',
  questions: [
    // 维度1：心流入口（4类）
    { q: '最近一次「忘记时间」，你在做什么？', options: [
      { text: '做一件需要动手的事', tag: '实操', score: { 心匠人: 1 } },
      { text: '想清楚一个难题', tag: '思考', score: { 心解题: 1 } },
      { text: '创作/表达点什么', tag: '创作', score: { 心创造: 1 } },
      { text: '帮一个人解决麻烦', tag: '助人', score: { 心联结: 1 } }] },
    { q: '你的心流更像？', options: [
      { text: '打磨一件作品', tag: '打磨', score: { 心匠人: 1 } },
      { text: '解开一道谜题', tag: '解谜', score: { 心解题: 1 } },
      { text: '画一幅画', tag: '作画', score: { 心创造: 1 } },
      { text: '陪一个人走一段路', tag: '陪伴', score: { 心联结: 1 } }] },
    { q: '你的心流「燃料」是？', options: [
      { text: '具体的材料和工具', tag: '材料', score: { 心匠人: 1 } },
      { text: '复杂的问题', tag: '问题', score: { 心解题: 1 } },
      { text: '情绪和想象', tag: '想象', score: { 心创造: 1 } },
      { text: '真实的他人', tag: '他人', score: { 心联结: 1 } }] },
    { q: '你「做不下去」的时刻，通常是？', options: [
      { text: '看不到实际产出', tag: '无果', score: { 心匠人: 1 } },
      { text: '问题太简单/太重复', tag: '太易', score: { 心解题: 1 } },
      { text: '被要求按别人的方式来', tag: '被限', score: { 心创造: 1 } },
      { text: '人与人之间很冷漠', tag: '冷漠', score: { 心联结: 1 } }] },
    { q: '你「天赋信号」最常来自？', options: [
      { text: '我做的成果被认可', tag: '成果', score: { 心匠人: 1 } },
      { text: '我解开了难题', tag: '解题', score: { 心解题: 1 } },
      { text: '我的表达打动人', tag: '打动', score: { 心创造: 1 } },
      { text: '我帮到了人', tag: '帮到', score: { 心联结: 1 } }] },
    // 维度2：性格特质（大五 5 类）
    { q: '朋友眼中的你，更像？', options: [
      { text: '有创造力、点子多', tag: '开放', score: { 性开放: 1 } },
      { text: '靠谱、有始有终', tag: '尽责', score: { 性尽责: 1 } },
      { text: '热情、爱张罗', tag: '外向', score: { 性外向: 1 } },
      { text: '体贴、好相处', tag: '宜人', score: { 性宜人: 1 } },
      { text: '沉稳、不慌不乱', tag: '稳定', score: { 性稳定: 1 } }] },
    { q: '你做事的方式更像？', options: [
      { text: '喜欢尝试新方法', tag: '新法', score: { 性开放: 1 } },
      { text: '按计划稳稳推进', tag: '计划', score: { 性尽责: 1 } },
      { text: '边做边和人交流', tag: '交流', score: { 性外向: 1 } },
      { text: '照顾每个人的感受', tag: '照顾', score: { 性宜人: 1 } },
      { text: '情绪稳定、不轻易慌', tag: '稳', score: { 性稳定: 1 } }] },
    { q: '你「最有能量」的时刻是？', options: [
      { text: '接触新想法时', tag: '新想', score: { 性开放: 1 } },
      { text: '完成计划时', tag: '完成', score: { 性尽责: 1 } },
      { text: '和人热聊时', tag: '热聊', score: { 性外向: 1 } },
      { text: '帮到别人时', tag: '帮人', score: { 性宜人: 1 } },
      { text: '独处平静时', tag: '独平', score: { 性稳定: 1 } }] },
    { q: '你「最容易累」的是？', options: [
      { text: '一成不变时', tag: '不变', score: { 性开放: 1 } },
      { text: '计划被打乱时', tag: '打乱', score: { 性尽责: 1 } },
      { text: '独自闷着时', tag: '独闷', score: { 性外向: 1 } },
      { text: '和人冲突时', tag: '冲突', score: { 性宜人: 1 } },
      { text: '情绪起伏大时', tag: '起伏', score: { 性稳定: 1 } }] },
    // 维度3：学习偏好（4类）
    { q: '学新东西时，你更能坚持的方式是？', options: [
      { text: '先看到「学会后能做什么」的画面', tag: '愿景', score: { 学直觉: 1 } },
      { text: '拆成小步骤按计划走', tag: '计划', score: { 学逻辑: 1 } },
      { text: '立刻上手做个小作品', tag: '上手', score: { 学实践: 1 } },
      { text: '加入小组互相督促', tag: '小组', score: { 学交流: 1 } }] },
    { q: '你的笔记风格更接近？', options: [
      { text: '涂鸦、箭头、颜色，像地图', tag: '地图', score: { 学直觉: 1 } },
      { text: '层级清晰的大纲', tag: '大纲', score: { 学逻辑: 1 } },
      { text: '大量例子和解题过程', tag: '例子', score: { 学实践: 1 } },
      { text: '问题与回答的对话式记录', tag: '对话', score: { 学交流: 1 } }] },
    { q: '「学完了」对你意味着？', options: [
      { text: '有感觉了、通了', tag: '通了', score: { 学直觉: 1 } },
      { text: '逻辑闭环了', tag: '闭环', score: { 学逻辑: 1 } },
      { text: '能上手用了', tag: '会用', score: { 学实践: 1 } },
      { text: '能讲清楚给别人听', tag: '能讲', score: { 学交流: 1 } }] },
    { q: '你最容易进入状态的是？', options: [
      { text: '凭感觉挑重点看', tag: '挑重', score: { 学直觉: 1 } },
      { text: '按框架从头到尾过', tag: '框架', score: { 学逻辑: 1 } },
      { text: '边做题边查缺补漏', tag: '做题', score: { 学实践: 1 } },
      { text: '给同学讲题', tag: '讲题', score: { 学交流: 1 } }] },
    // 维度4：自信来源（4类）
    { q: '你的「自信」更多来自？', options: [
      { text: '过去做成的经验', tag: '经验', score: { 信经验: 1 } },
      { text: '我确实擅长这个', tag: '擅长', score: { 信专长: 1 } },
      { text: '自己对自己的认可', tag: '自认', score: { 信自我: 1 } },
      { text: '准备得够充分', tag: '准备', score: { 信方法: 1 } }] },
    { q: '你「最有把握」的是？', options: [
      { text: '已经做过很多次的事', tag: '熟', score: { 信经验: 1 } },
      { text: '我擅长领域里的事', tag: '专', score: { 信专长: 1 } },
      { text: '没人会评判的事', tag: '私', score: { 信自我: 1 } },
      { text: '有明确步骤的事', tag: '明', score: { 信方法: 1 } }] },
    { q: '你「建立自信」的方式更接近？', options: [
      { text: '多做，做到熟', tag: '多做', score: { 信经验: 1 } },
      { text: '在擅长领域深耕', tag: '深耕', score: { 信专长: 1 } },
      { text: '自己肯定自己', tag: '自肯', score: { 信自我: 1 } },
      { text: '充分准备', tag: '准备', score: { 信方法: 1 } }] }
  ],
  results: {},
  insights: [],
  _map: function (r) {
    var s = r.scores;
    function top(keys) { return keys.sort(function (a, b) { return (s[b] || 0) - (s[a] || 0); })[0]; }
    return {
      flow: top(['心匠人', '心解题', '心创造', '心联结']),
      trait: top(['性开放', '性尽责', '性外向', '性宜人', '性稳定']),
      learn: top(['学直觉', '学逻辑', '学实践', '学交流']),
      conf: top(['信经验', '信专长', '信自我', '信方法'])
    };
  }
};
