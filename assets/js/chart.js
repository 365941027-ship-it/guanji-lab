(function () {
  'use strict';

  var prof;
  try {
    prof = JSON.parse(window.guanGet('guan_profile') || '{}');
  } catch (e) {
    prof = {};
  }

  var birth = window.guanAstrology.parseBirth(prof.birth || '');
  var hour = window.guanAstrology.parseHour(prof.hour || '');
  var city = prof.city || '';
  var gender = prof.gender || '';

  if (!birth || hour === null || !city) {
    document.getElementById('chartNote').textContent = '请先在「我的档案」里填写出生日期、出生时辰与出生城市（性别可选），保存后再回来生成命盘。';
    return;
  }

  var b = window.guanAstrology.bazi(birth.y, birth.m, birth.d, hour);
  var A = window.guanAstrology;
  var loc = A.cities[city.trim()];
  var dayGan = b.day.charAt(0);

  document.getElementById('chartGrid').style.display = 'grid';
  document.getElementById('chartNote').textContent = '命盘基于：' + prof.birth + ' · ' + prof.hour + ' · ' + (city || '未填城市') + (gender ? ' · ' + gender : '');

  // 四柱
  document.getElementById('chartPillars').innerHTML = ['year', 'month', 'day', 'hour'].map(function (k, i) {
    var gan = b[k].charAt(0), zhi = b[k].charAt(1);
    return '<div class="pillar-box"><div class="pillar-label">' + ['年柱', '月柱', '日柱', '时柱'][i] + '</div>' +
      '<div class="pillar-gz"><span class="g">' + gan + '</span><span class="z">' + zhi + '</span></div>' +
      '<div class="pillar-wx">' + A.WUXING[gan] + '/' + A.ZHI_WUXING[zhi] + '</div>' +
      '<div class="pillar-ss">' + (i === 2 ? '日元' : A.shishenOf(dayGan, gan)) + '</div></div>';
  }).join('');

  // 真太阳时
  var tst = loc ? A.trueSolarTime(birth.y, birth.m, birth.d, hour, loc[0]).toFixed(2) : '需城市经纬度';
  document.getElementById('chartTST').textContent = '真太阳时：' + tst + ' 点';

  // 五行分布
  var wxCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  ['year', 'month', 'day', 'hour'].forEach(function (k) {
    wxCount[A.WUXING[b[k].charAt(0)]]++;
    wxCount[A.ZHI_WUXING[b[k].charAt(1)]]++;
  });
  var maxWx = Math.max.apply(null, Object.keys(wxCount).map(function (k) { return wxCount[k]; }));
  document.getElementById('chartWuxing').innerHTML = Object.keys(wxCount).map(function (k) {
    return '<div class="wx-row"><span>' + k + '</span><div class="wx-bar"><i style="width:' + (wxCount[k] / maxWx * 100) + '%"></i></div><b>' + wxCount[k] + '</b></div>';
  }).join('');

  // 十神
  document.getElementById('chartShishen').innerHTML = ['year', 'month', 'day', 'hour'].map(function (k, i) {
    return '<div class="ss-cell"><b>' + ['年', '月', '日', '时'][i] + '</b><span>' + b[k] + '</span><em>' + A.shishenOf(dayGan, b[k].charAt(0)) + '</em></div>';
  }).join('');

  // 大运
  var dayuns = A.dayun(birth.y, birth.m, birth.d, hour, gender);
  document.getElementById('chartDayun').innerHTML = dayuns.map(function (d) {
    var parts = d.split(' ');
    return '<div class="dy-cell"><b>' + parts[0] + '</b><span>' + parts[1] + '</span></div>';
  }).join('');
})();
