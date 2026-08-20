window.GUAN_QUIZ = {
  key: 'guan_pressure',
  title: '我正被什么压着',
  en: 'What Weighs On Me',
  resultLabel: '压力画像',
  scoring: 'stage',
  category: 'self',
  categoryTitle: '自我成长',
  desc: '你正扛着什么，哪一样最重？',
  questions: [
    // 维度1：倦怠（4类）
    { q: '闹钟响的时候，你心里先冒出来的是什么？', options: [
      { text: '又要撑一天了，好累', tag: '耗竭', score: { 倦耗竭: 1 } },
      { text: '又是这样的一天，没什么感觉', tag: '疏离', score: { 倦疏离: 1 } },
      { text: '「做这些到底有什么意义」', tag: '无义', score: { 倦无义: 1 } },
      { text: '最近总在想「是不是该换条路」', tag: '觉醒', score: { 倦觉醒: 1 } }] },
    { q: '下班回到家，你更像？', options: [
      { text: '整个人摊在沙发上，不想动', tag: '瘫', score: { 倦耗竭: 1 } },
      { text: '不想和任何人说话', tag: '静', score: { 倦疏离: 1 } },
      { text: '刷手机到很晚，却说不上在干嘛', tag: '空刷', score: { 倦无义: 1 } },
      { text: '偶尔在想「要不要改变」', tag: '想变', score: { 倦觉醒: 1 } }] },
    { q: '你最近对自己的评价是？', options: [
      { text: '我是不是能力不行', tag: '能', score: { 倦耗竭: 1 } },
      { text: '我是不是变得很冷血', tag: '冷', score: { 倦疏离: 1 } },
      { text: '我是不是一事无成', tag: '无成', score: { 倦无义: 1 } },
      { text: '我不是不行，是路不对', tag: '路', score: { 倦觉醒: 1 } }] },
    { q: '如果现在能休息一个月，你会？', options: [
      { text: '先睡三天', tag: '睡', score: { 倦耗竭: 1 } },
      { text: '出去走走，离开这一切', tag: '走', score: { 倦疏离: 1 } },
      { text: '好好想想自己要什么', tag: '想', score: { 倦无义: 1 } },
      { text: '试试一直想做的事', tag: '试', score: { 倦觉醒: 1 } }] },
    { q: '你心里那句没说出口的话，最接近？', options: [
      { text: '「我撑不下去了」', tag: '撑', score: { 倦耗竭: 1 } },
      { text: '「我无所谓了」', tag: '无', score: { 倦疏离: 1 } },
      { text: '「我到底在干嘛」', tag: '干嘛', score: { 倦无义: 1 } },
      { text: '「我想换一种活法」', tag: '换', score: { 倦觉醒: 1 } }] },
    // 维度2：焦虑（4类）
    { q: '最近两周，你「无法停止担忧」的频率？', options: [
      { text: '几乎没有', tag: '低', score: { 焦低: 1 } },
      { text: '几天一次', tag: '中低', score: { 焦中低: 1 } },
      { text: '一半以上的天数', tag: '中高', score: { 焦中高: 1 } },
      { text: '几乎每天', tag: '高', score: { 焦高: 1 } }] },
    { q: '你「很难放松下来」的时候多吗？', options: [
      { text: '几乎没有', tag: '低', score: { 焦低: 1 } },
      { text: '偶尔', tag: '中低', score: { 焦中低: 1 } },
      { text: '经常', tag: '中高', score: { 焦中高: 1 } },
      { text: '几乎一直', tag: '高', score: { 焦高: 1 } }] },
    { q: '你「容易烦恼或急躁」吗？', options: [
      { text: '几乎没有', tag: '低', score: { 焦低: 1 } },
      { text: '偶尔', tag: '中低', score: { 焦中低: 1 } },
      { text: '经常', tag: '中高', score: { 焦中高: 1 } },
      { text: '几乎一直', tag: '高', score: { 焦高: 1 } }] },
    { q: '你「担心可怕的事会发生」吗？', options: [
      { text: '几乎没有', tag: '低', score: { 焦低: 1 } },
      { text: '偶尔', tag: '中低', score: { 焦中低: 1 } },
      { text: '经常', tag: '中高', score: { 焦中高: 1 } },
      { text: '几乎一直', tag: '高', score: { 焦高: 1 } }] },
    // 维度3：空窗/停滞（4类）
    { q: '你最近的生活节奏，更像？', options: [
      { text: '在探索，但方向未定', tag: '探', score: { 空探索: 1 } },
      { text: '在整理，旧的东西还没收拾完', tag: '整', score: { 空重整: 1 } },
      { text: '在积累，但觉得有点闷', tag: '积', score: { 空积累: 1 } },
      { text: '在酝酿变化，但还没行动', tag: '酝酿', score: { 空转型: 1 } }] },
    { q: '你「最怕」的是？', options: [
      { text: '一直找不到方向', tag: '怕向', score: { 空探索: 1 } },
      { text: '一直好不起来', tag: '怕好', score: { 空重整: 1 } },
      { text: '努力却没有成果', tag: '怕果', score: { 空积累: 1 } },
      { text: '想变却不敢变', tag: '怕变', score: { 空转型: 1 } }] },
    { q: '你心里最诚实的一句话是？', options: [
      { text: '「我不知道自己想要什么」', tag: '不知', score: { 空探索: 1 } },
      { text: '「我还没缓过来」', tag: '没缓', score: { 空重整: 1 } },
      { text: '「我在硬撑」', tag: '硬撑', score: { 空积累: 1 } },
      { text: '「我知道该变，但怕错」', tag: '怕错', score: { 空转型: 1 } }] },
    // 维度4：意义（4类）
    { q: '你最近「做事的动力」是？', options: [
      { text: '有明确的目标，劲头十足', tag: '足', score: { 义充足: 1 } },
      { text: '还行，偶尔会问「这有意义吗」', tag: '偶问', score: { 义偶失: 1 } },
      { text: '常常觉得「做了又怎样」', tag: '常失', score: { 义常失: 1 } },
      { text: '不知道为了什么', tag: '不知', score: { 义迷失: 1 } }] },
    { q: '完成一件事后，你通常？', options: [
      { text: '有成就感', tag: '成', score: { 义充足: 1 } },
      { text: '「还行吧」', tag: '还行', score: { 义偶失: 1 } },
      { text: '「然后又怎样」', tag: '又', score: { 义常失: 1 } },
      { text: '「这有什么意义」', tag: '义', score: { 义迷失: 1 } }] },
    { q: '你心里最深的追问是？', options: [
      { text: '「我在为什么而活」', tag: '活', score: { 义迷失: 1 } },
      { text: '「这一切值得吗」', tag: '值', score: { 义常失: 1 } },
      { text: '「我的路对吗」', tag: '对', score: { 义偶失: 1 } },
      { text: '「我正在做想做的事」', tag: '在做', score: { 义充足: 1 } }] },
    { q: '如果重新选一次，你希望？', options: [
      { text: '找到真正想做的事', tag: '找到', score: { 义充足: 1 } },
      { text: '少一点怀疑，多一点笃定', tag: '笃定', score: { 义偶失: 1 } },
      { text: '找回那股劲', tag: '劲', score: { 义常失: 1 } },
      { text: '先想清楚为什么', tag: '为何', score: { 义迷失: 1 } }] }
  ],
  results: {},
  insights: [],
  _map: function (r) {
    var s = r.scores;
    function top(keys) { return keys.sort(function (a, b) { return (s[b] || 0) - (s[a] || 0); })[0]; }
    return {
      burn: top(['倦耗竭', '倦疏离', '倦无义', '倦觉醒']),
      anxiety: top(['焦低', '焦中低', '焦中高', '焦高']),
      gap: top(['空探索', '空重整', '空积累', '空转型']),
      meaning: top(['义充足', '义偶失', '义常失', '义迷失'])
    };
  }
};
