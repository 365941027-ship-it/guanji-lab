window.GUAN_QUIZ = {
  key: 'guan_gad7',
  title: '最近两周的焦虑',
  en: 'GAD-7',
  resultLabel: '焦虑程度',
  scoring: 'sum',
  category: 'self',
  categoryTitle: '自我成长',
  desc: '这是一份被广泛用于自我觉察的焦虑倾向自察（GAD-7 改编）。它不给你贴标签，只帮你看看：最近两周，焦虑在多大程度上影响着你。',
  sumScale: [
    { max: 4, name: '几乎没有焦虑', desc: '你的焦虑水平很低。你可能偶尔会担心，但大多数时候能安顿下来——这份平稳，值得珍惜。' },
    { max: 9, name: '轻度焦虑', desc: '你有一些焦虑的信号：可能在某些时刻感到紧张、担心、难以放松。这不是问题，是提醒——你最近有些在意的事，需要被照顾。' },
    { max: 14, name: '中度焦虑', desc: '焦虑已经在你生活里占据了一些空间：可能影响睡眠、专注或心情。这不是你的错，是身体在说：最近的负担有点重了。' },
    { max: 21, name: '重度焦虑', desc: '你的焦虑程度偏高，可能在很多方面都感到被它影响。请别一个人扛——把你的感受告诉信任的人，或考虑寻求专业帮助。' }
  ],
  instructions: '在过去两周，你有多经常被以下问题困扰？',
  questions: [
    { q: '感到紧张、焦虑或急切', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '无法停止或控制担忧', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '对各种各样的事情担忧过多', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '很难放松下来', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '由于不安而无法静坐', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '变得容易烦恼或急躁', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '感到似乎将有可怕的事情发生而害怕', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) }
  ],
  results: {},
  insights: [],
  isStandard: true
};
