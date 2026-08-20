window.GUAN_QUIZ = {
  key: 'guan_energy_map',
  title: '我的能量地图',
  en: 'My Energy Map',
  resultLabel: '能量处方',
  scoring: 'stage',
  category: 'self',
  categoryTitle: '心灵疗愈',
  desc: '你的能量在哪里悄悄漏掉？你需要怎样的疗愈？',
  questions: [
    // 维度1：能量去哪了（4类）
    { q: '忙完一天，你最累的时刻通常是？', options: [
      { text: '躺下之后，脑子还在转', tag: '回想', score: { 反刍耗: 1 } },
      { text: '睡前刷手机，越刷越空', tag: '比较耗', score: { 比较耗: 1 } },
      { text: '想起还有事没做，心里一紧', tag: '标准耗', score: { 标准耗: 1 } },
      { text: '一直在回别人的消息', tag: '讨好耗', score: { 讨好耗: 1 } }] },
    { q: '你的能量，最常在什么时候悄悄漏掉？', options: [
      { text: '独处时，脑子开始放电影', tag: '独处漏', score: { 反刍耗: 1 } },
      { text: '刷到别人过得好时', tag: '比较漏', score: { 比较耗: 1 } },
      { text: '事情没按计划走时', tag: '失控漏', score: { 标准耗: 1 } },
      { text: '别人对我有期待时', tag: '期待漏', score: { 讨好耗: 1 } }] },
    { q: '你心里最常出现的声音是？', options: [
      { text: '「当时我要是那样说就好了」', tag: '悔', score: { 反刍耗: 1 } },
      { text: '「TA怎么那么厉害，我太差了」', tag: '比', score: { 比较耗: 1 } },
      { text: '「还不够好，还能更好」', tag: '挑', score: { 标准耗: 1 } },
      { text: '「我这样说TA会不会不高兴」', tag: '怕', score: { 讨好耗: 1 } }] },
    { q: '你「真正放松」的频率是？', options: [
      { text: '很难，脑子总在转', tag: '难松', score: { 反刍耗: 1 } },
      { text: '一放松就慌', tag: '慌', score: { 比较耗: 1 } },
      { text: '放松有罪恶感', tag: '罪', score: { 标准耗: 1 } },
      { text: '别人一有事就立刻待命', tag: '待命', score: { 讨好耗: 1 } }] },
    { q: '你的「情绪垃圾桶」里最常装的是？', options: [
      { text: '旧事重提的委屈', tag: '旧', score: { 反刍耗: 1 } },
      { text: '不甘心的比较', tag: '不甘', score: { 比较耗: 1 } },
      { text: '对自己的失望', tag: '失望', score: { 标准耗: 1 } },
      { text: '没说出口的委屈', tag: '咽', score: { 讨好耗: 1 } }] },
    // 维度2：能量状态（4类）
    { q: '最近一周，你醒来时最接近？', options: [
      { text: '有想做的事，身体有劲', tag: '满格', score: { 饱满: 2 } },
      { text: '不着急，像湖面一样平静', tag: '平静', score: { 平静: 2 } },
      { text: '光是起床就用掉一半力气', tag: '低电', score: { 疲惫: 2 } },
      { text: '说不清，既兴奋又混乱', tag: '萌芽', score: { 萌芽: 2 } }] },
    { q: '最近你做事的状态是？', options: [
      { text: '灵感来了就停不下来', tag: '流', score: { 饱满: 2 } },
      { text: '按自己节拍，不追赶', tag: '稳', score: { 平静: 2 } },
      { text: '做一会儿就需要停下来', tag: '断', score: { 疲惫: 2 } },
      { text: '想法很多但落不了地', tag: '散', score: { 萌芽: 2 } }] },
    { q: '你最近与「未来」的关系是？', options: [
      { text: '期待，觉得好戏在后头', tag: '盼', score: { 饱满: 2 } },
      { text: '相信慢慢来比较快', tag: '信', score: { 平静: 2 } },
      { text: '有点怕，想先休息', tag: '怕', score: { 疲惫: 2 } },
      { text: '看不清，但隐约想试试', tag: '试', score: { 萌芽: 2 } }] },
    { q: '你最近一次「真正开心」来自？', options: [
      { text: '做成/推进了一件事', tag: '成', score: { 饱满: 2 } },
      { text: '生活里的小确幸', tag: '幸', score: { 平静: 2 } },
      { text: '终于可以什么都不做', tag: '空', score: { 疲惫: 2 } },
      { text: '想到某个未来的可能', tag: '望', score: { 萌芽: 2 } }] },
    // 维度3：疗愈需要（4类）
    { q: '此刻的你，最需要被允许的是？', options: [
      { text: '大胆一点，别收敛', tag: '释放', score: { 疗愈释放: 1 } },
      { text: '不着急，慢慢来', tag: '从容', score: { 疗愈安顿: 1 } },
      { text: '停下来，什么都不做', tag: '休息', score: { 疗愈修复: 1 } },
      { text: '承认自己也不知道', tag: '未知', score: { 疗愈萌芽: 1 } }] },
    { q: '你希望别人此刻怎么待你？', options: [
      { text: '给我舞台和掌声', tag: '舞台', score: { 疗愈释放: 1 } },
      { text: '安静陪我，不打扰', tag: '静伴', score: { 疗愈安顿: 1 } },
      { text: '别要求我，让我歇着', tag: '谅解', score: { 疗愈修复: 1 } },
      { text: '陪我把模糊的念头聊清楚', tag: '对话', score: { 疗愈萌芽: 1 } }] },
    { q: '你「充电」最快的方式是？', options: [
      { text: '做一件让我兴奋的事', tag: '燃', score: { 疗愈释放: 1 } },
      { text: '散步、做饭、看闲书', tag: '养', score: { 疗愈安顿: 1 } },
      { text: '躺平、发呆、补觉', tag: '休', score: { 疗愈修复: 1 } },
      { text: '找人聊聊或写下来', tag: '说', score: { 疗愈萌芽: 1 } }] },
    // 维度4：自我关怀（4类）
    { q: '犯错之后，你对自己说的第一句话是？', options: [
      { text: '「你怎么又这样」', tag: '苛', score: { 苛责: 1 } },
      { text: '「没关系，下次注意」', tag: '宽', score: { 关怀: 1 } },
      { text: '「我是不是不行」', tag: '疑', score: { 忽视: 1 } },
      { text: '「没事，没人看见就好」', tag: '避', score: { 回避: 1 } }] },
    { q: '你对自己身体的感受是？', options: [
      { text: '「还不够好」', tag: '挑', score: { 苛责: 1 } },
      { text: '「它陪我走到今天，谢谢它」', tag: '谢', score: { 关怀: 1 } },
      { text: '很少注意它', tag: '忽', score: { 忽视: 1 } },
      { text: '「别生病，别拖后腿」', tag: '用', score: { 回避: 1 } }] },
    { q: '你内心那位「对话者」更像？', options: [
      { text: '严格的教练', tag: '严', score: { 苛责: 1 } },
      { text: '温柔的朋友', tag: '柔', score: { 关怀: 1 } },
      { text: '沉默的旁观者', tag: '默', score: { 忽视: 1 } },
      { text: '催促的闹钟', tag: '催', score: { 回避: 1 } }] },
    { q: '你如何庆祝自己的成功？', options: [
      { text: '几乎不庆祝，怕骄傲', tag: '怕', score: { 苛责: 1 } },
      { text: '认真为自己庆祝', tag: '庆', score: { 关怀: 1 } },
      { text: '没想过要庆祝', tag: '没', score: { 忽视: 1 } },
      { text: '马上投入下一目标', tag: '赶', score: { 回避: 1 } }] },
    // 维度5：深夜信号（4类）
    { q: '深夜睡不着时，你脑海中最常出现的是？', options: [
      { text: '反复回放白天说过的话', tag: '回放', score: { 夜反刍: 1 } },
      { text: '担心明天或未来', tag: '忧', score: { 夜焦虑: 1 } },
      { text: '一种说不清的孤独', tag: '孤', score: { 夜孤独: 1 } },
      { text: '突然想到想做的事', tag: '灵', score: { 夜灵感: 1 } }] },
    { q: '你的深夜念头更像？', options: [
      { text: '一场反复播放的旧电影', tag: '旧片', score: { 夜反刍: 1 } },
      { text: '一封写给未来的担忧信', tag: '忧信', score: { 夜焦虑: 1 } },
      { text: '一句「有人懂我吗」', tag: '问', score: { 夜孤独: 1 } },
      { text: '一张还没画完的地图', tag: '图', score: { 夜灵感: 1 } }] },
    { q: '你深夜最需要的陪伴是？', options: [
      { text: '有个人听我说说话', tag: '听', score: { 夜反刍: 1 } },
      { text: '一句「都会好的」', tag: '安', score: { 夜焦虑: 1 } },
      { text: '安静地独自待着', tag: '静', score: { 夜孤独: 1 } },
      { text: '纸和笔，把想法写下来', tag: '写', score: { 夜灵感: 1 } }] }
  ],
  results: {},
  insights: [],
  _map: function (r) {
    var s = r.scores;
    function top(keys) { return keys.sort(function (a, b) { return (s[b] || 0) - (s[a] || 0); })[0]; }
    var leak = top(['反刍耗', '比较耗', '标准耗', '讨好耗']);
    var state = top(['饱满', '平静', '疲惫', '萌芽']);
    var heal = top(['疗愈释放', '疗愈安顿', '疗愈修复', '疗愈萌芽']);
    var care = top(['苛责', '关怀', '忽视', '回避']);
    var night = top(['夜反刍', '夜焦虑', '夜孤独', '夜灵感']);
    return { leak: leak, state: state, heal: heal, care: care, night: night };
  }
};
