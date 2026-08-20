window.GUAN_QUIZ = {
  key: 'guan_ucla',
  title: '孤独感自察',
  en: 'UCLA Loneliness',
  resultLabel: '孤独感',
  scoring: 'ucla',
  category: 'self',
  categoryTitle: '自我成长',
  desc: 'UCLA 孤独感量表用于测量主观孤独体验。孤独不是缺陷，它只是你心里一块还没被照亮的角落。',
  instructions: '请根据你通常的感受作答（1 = 从不，2 = 很少，3 = 有时，4 = 一直）。',
  questions: [
    { q: '你常感到缺少同伴吗？', options: [1,2,3,4].map(function (v) { return { text: ['从不','很少','有时','一直'][v-1], score: { _: v } }; }) },
    { q: '你常感到没人可以倾诉吗？', options: [1,2,3,4].map(function (v) { return { text: ['从不','很少','有时','一直'][v-1], score: { _: v } }; }) },
    { q: '你常感到自己内向吗？', options: [1,2,3,4].map(function (v) { return { text: ['从不','很少','有时','一直'][v-1], score: { _: v } }; }) },
    { q: '你常感到孤独吗？', options: [1,2,3,4].map(function (v) { return { text: ['从不','很少','有时','一直'][v-1], score: { _: v } }; }) },
    { q: '你常感到自己是朋友中的一员吗？（反向）', options: [1,2,3,4].map(function (v) { return { text: ['从不','很少','有时','一直'][v-1], score: { _: 5 - v } }; }) },
    { q: '你常感到和别人有很多共同点吗？（反向）', options: [1,2,3,4].map(function (v) { return { text: ['从不','很少','有时','一直'][v-1], score: { _: 5 - v } }; }) },
    { q: '你常感到与任何人都不再亲近吗？', options: [1,2,3,4].map(function (v) { return { text: ['从不','很少','有时','一直'][v-1], score: { _: v } }; }) },
    { q: '你常感到别人围绕着你但并没有真正懂你吗？', options: [1,2,3,4].map(function (v) { return { text: ['从不','很少','有时','一直'][v-1], score: { _: v } }; }) },
    { q: '你常感到有人真正了解你吗？（反向）', options: [1,2,3,4].map(function (v) { return { text: ['从不','很少','有时','一直'][v-1], score: { _: 5 - v } }; }) },
    { q: '你常感到与人疏远吗？', options: [1,2,3,4].map(function (v) { return { text: ['从不','很少','有时','一直'][v-1], score: { _: v } }; }) }
  ],
  sumScale: [
    { max: 19, name: '孤独感较低', desc: '你很少感到孤独——你心里有足够的联结感，也知道有人懂你。这份感受很珍贵，请继续滋养它。' },
    { max: 29, name: '孤独感中等', desc: '你有一定的孤独感：有时觉得缺少同伴或没人真正懂你。这不是缺陷，是你心里渴望更深的联结——这份渴望，值得被认真对待。' },
    { max: 40, name: '孤独感偏高', desc: '你经常感到孤独——可能是缺少亲近的人，或是身边有人却没被真正理解。请别让孤独变成沉默：主动联系一个人，或把感受写下来，都是开始。' }
  ],
  results: {},
  insights: [],
  isStandard: true
};
