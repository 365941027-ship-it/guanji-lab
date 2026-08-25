window.GUAN_QUIZ = {
  key: 'guan_phq9',
  title: '最近两周的情绪',
  en: 'PHQ-9',
  resultLabel: '情绪状态',
  scoring: 'sum',
  category: 'self',
  categoryTitle: '自我成长',
  desc: '这是一份被广泛用于自我觉察的抑郁倾向自察（PHQ-9 改编）。请如实作答——看清它，是照顾自己的第一步。',
  sumScale: [
    { max: 4, name: '几乎没有低落', desc: '你的情绪整体平稳。你可能会偶尔难过，但大多数时候能回到自己的节奏里——这份状态，值得好好保持。' },
    { max: 9, name: '轻度情绪波动', desc: '你有一些情绪低落的信号：可能偶尔失去兴趣、容易疲惫。这不是软弱，是身体在提醒你：最近需要多照顾自己一点。' },
    { max: 14, name: '中度情绪困扰', desc: '情绪低落已经在你生活里占了不小的空间：可能影响睡眠、食欲或动力。请别硬扛——把感受告诉信任的人，或考虑专业帮助。' },
    { max: 19, name: '中重度情绪困扰', desc: '你的情绪负担较重，可能在很多方面都感到被它拖住。请一定寻求支持：心理咨询师、信任的人，或当地心理援助热线。' },
    { max: 27, name: '重度情绪困扰', desc: '你此刻的情绪负担很重。请优先照顾自己，尽快联系专业心理支持——你值得被帮助，也一定能好起来。' }
  ],
  instructions: '在过去两周，你有多经常被以下问题困扰？',
  questions: [
    { q: '做事时提不起劲或没有兴趣', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '感到心情低落、沮丧或绝望', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '入睡困难、睡不安稳或睡眠过多', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '感到疲倦或没有活力', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '胃口不好或吃太多', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '觉得自己很糟，或觉得自己让家人失望了', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '对事情专注有困难，例如看报纸或看电视时', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '动作或说话速度缓慢到别人已经察觉，或正好相反——变得比平日更烦躁或坐立不安', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) },
    { q: '有不如死掉或用某种方式伤害自己的念头', options: [0,1,2,3].map(function (v, i) { return { text: ['完全没有', '几天', '一半以上天数', '几乎每天'][i], score: { _: v } }; }) }
  ],
  results: {},
  insights: [],
  isStandard: true
};
