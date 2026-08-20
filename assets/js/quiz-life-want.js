window.GUAN_QUIZ = {
  key: 'guan_life_want',
  title: '我真正想要的生活',
  en: 'The Life I Want',
  resultLabel: '生活坐标',
  scoring: 'stage',
  category: 'self',
  categoryTitle: '自我探索',
  desc: '你现在的位置，和你真正想去的地方。',
  questions: [
    // 维度1：工作坐标（4类）
    { q: '工作对你来说，最像？', options: [
      { text: '一个可以成长的学校', tag: '学', score: { 工成长: 1 } },
      { text: '一个可以安身的家', tag: '家', score: { 工稳定: 1 } },
      { text: '一个可以实现的舞台', tag: '台', score: { 工成就: 1 } },
      { text: '一群可以同行的人', tag: '人', score: { 工归属: 1 } }] },
    { q: '工作里让你「最值」的是？', options: [
      { text: '学到了新东西', tag: '新', score: { 工成长: 1 } },
      { text: '日子安稳', tag: '稳', score: { 工稳定: 1 } },
      { text: '做成了事', tag: '成', score: { 工成就: 1 } },
      { text: '被信任、被需要', tag: '信', score: { 工归属: 1 } }] },
    { q: '你「最不能接受」的工作状态是？', options: [
      { text: '原地踏步，学不到东西', tag: '无长', score: { 工成长: 1 } },
      { text: '朝不保夕，随时会变', tag: '无稳', score: { 工稳定: 1 } },
      { text: '做不成事，没有成果', tag: '无果', score: { 工成就: 1 } },
      { text: '人情冷漠，像个机器', tag: '无暖', score: { 工归属: 1 } }] },
    { q: '你「理想的一天工作」是？', options: [
      { text: '学到了新东西', tag: '新', score: { 工成长: 1 } },
      { text: '按计划稳稳完成', tag: '计', score: { 工稳定: 1 } },
      { text: '拿下了一个目标', tag: '标', score: { 工成就: 1 } },
      { text: '和伙伴们相处愉快', tag: '快', score: { 工归属: 1 } }] },
    // 维度2：生活满意度（4档）
    { q: '「在大多数方面，我的生活接近我的理想」——你？', options: [
      { text: '很不同意', tag: '很低', score: { 满低: 1 } },
      { text: '有点不同意', tag: '低', score: { 满低: 1 } },
      { text: '中立', tag: '中', score: { 满中: 1 } },
      { text: '有点同意', tag: '高', score: { 满高: 1 } },
      { text: '非常同意', tag: '很高', score: { 满高: 1 } }] },
    { q: '「我对我的生活感到满意」——你？', options: [
      { text: '很不同意', tag: '很低', score: { 满低: 1 } },
      { text: '有点不同意', tag: '低', score: { 满低: 1 } },
      { text: '中立', tag: '中', score: { 满中: 1 } },
      { text: '有点同意', tag: '高', score: { 满高: 1 } },
      { text: '非常同意', tag: '很高', score: { 满高: 1 } }] },
    { q: '「到目前为止，我得到了生活中想要的重要东西」——你？', options: [
      { text: '很不同意', tag: '很低', score: { 满低: 1 } },
      { text: '有点不同意', tag: '低', score: { 满低: 1 } },
      { text: '中立', tag: '中', score: { 满中: 1 } },
      { text: '有点同意', tag: '高', score: { 满高: 1 } },
      { text: '非常同意', tag: '很高', score: { 满高: 1 } }] },
    // 维度3：自由与安定（4类）
    { q: '对你来说，「自由」最接近？', options: [
      { text: '想去哪就能去哪', tag: '移', score: { 欲自由: 1 } },
      { text: '想做什么就能做出来', tag: '创', score: { 欲创造: 1 } },
      { text: '不用装，做真实的自己', tag: '真', score: { 欲真实: 1 } },
      { text: '不被任何框架绑住', tag: '无框', score: { 欲自由: 1 } }] },
    { q: '你「最渴望」的生活状态是？', options: [
      { text: '自由、不被定义', tag: '自', score: { 欲自由: 1 } },
      { text: '留下作品、创造价值', tag: '作', score: { 欲创造: 1 } },
      { text: '真实、内心安宁', tag: '宁', score: { 欲真实: 1 } },
      { text: '安稳、可预期', tag: '安', score: { 欲安定: 1 } }] },
    { q: '你「最怕」的生活是？', options: [
      { text: '一眼望到头', tag: '怕僵', score: { 欲自由: 1 } },
      { text: '一事无成', tag: '怕空', score: { 欲创造: 1 } },
      { text: '活成别人', tag: '怕假', score: { 欲真实: 1 } },
      { text: '动荡不安', tag: '怕乱', score: { 欲安定: 1 } }] },
    { q: '你「心里真正的渴望」是？', options: [
      { text: '更多选择的余地', tag: '余地', score: { 欲自由: 1 } },
      { text: '把想做的做出来', tag: '做出', score: { 欲创造: 1 } },
      { text: '和真实的自己在一起', tag: '真实', score: { 欲真实: 1 } },
      { text: '稳稳的幸福', tag: '稳', score: { 欲安定: 1 } }] },
    // 维度4：下一步方向（4类）
    { q: '你「接下来最想调整」的是？', options: [
      { text: '给自己更多自由和空间', tag: '空', score: { 向自由: 1 } },
      { text: '开始做一件一直想做的事', tag: '做', score: { 向创造: 1 } },
      { text: '先和自己和解、安顿内心', tag: '和', score: { 向真实: 1 } },
      { text: '把生活变得更稳', tag: '稳', score: { 向安定: 1 } }] },
    { q: '你「希望三十天后」的自己？', options: [
      { text: '多了一点自由', tag: '自', score: { 向自由: 1 } },
      { text: '开始做想做的事了', tag: '开', score: { 向创造: 1 } },
      { text: '内心更安定了', tag: '安', score: { 向真实: 1 } },
      { text: '日子更稳了', tag: '稳', score: { 向安定: 1 } }] },
    { q: '你心里最真实的一句话是？', options: [
      { text: '「我真正想要的是自由」', tag: '自', score: { 向自由: 1 } },
      { text: '「我真正想要的是创造」', tag: '创', score: { 向创造: 1 } },
      { text: '「我真正想要的是做自己」', tag: '自真', score: { 向真实: 1 } },
      { text: '「我真正想要的是安稳」', tag: '安', score: { 向安定: 1 } }] }
  ],
  results: {},
  insights: [],
  _map: function (r) {
    var s = r.scores;
    function top(keys) { return keys.sort(function (a, b) { return (s[b] || 0) - (s[a] || 0); })[0]; }
    return {
      work: top(['工成长', '工稳定', '工成就', '工归属']),
      sat: top(['满低', '满中', '满高']),
      desire: top(['欲自由', '欲创造', '欲真实', '欲安定']),
      next: top(['向自由', '向创造', '向真实', '向安定'])
    };
  }
};
