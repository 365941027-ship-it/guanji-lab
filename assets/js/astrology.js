(function () {
  'use strict';

  var GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  var ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  var ZODIACS = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];

  // 节气黄经：立春315°、惊蛰345°、清明15°、立夏45°、芒种75°、小暑105°、
  // 立秋135°、白露165°、寒露195°、立冬225°、大雪255°、小寒285°
  var TERM_LONGS = [315, 345, 15, 45, 75, 105, 135, 165, 195, 225, 255, 285];
  var TERM_NAMES = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];

  // 主要城市经纬度（用于上升星座近似排盘）
  var CITIES = {
    '北京': [116.4, 39.9], '上海': [121.5, 31.2], '广州': [113.3, 23.1], '深圳': [114.1, 22.5],
    '成都': [104.1, 30.6], '杭州': [120.2, 30.3], '重庆': [106.5, 29.6], '武汉': [114.3, 30.6],
    '南京': [118.8, 32.1], '西安': [108.9, 34.3], '长沙': [112.9, 28.2], '青岛': [120.4, 36.1],
    '天津': [117.2, 39.1], '苏州': [120.6, 31.3], '郑州': [113.6, 34.7], '沈阳': [123.4, 41.8],
    '厦门': [118.1, 24.5], '福州': [119.3, 26.1], '昆明': [102.7, 25.0], '贵阳': [106.6, 26.6],
    '哈尔滨': [126.5, 45.8], '长春': [125.3, 43.9], '济南': [117.0, 36.7], '太原': [112.5, 37.9],
    '合肥': [117.2, 31.8], '南昌': [115.9, 28.7], '南宁': [108.3, 22.8], '海口': [110.3, 20.0],
    '乌鲁木齐': [87.6, 43.8], '兰州': [103.8, 36.1], '呼和浩特': [111.7, 40.8], '石家庄': [114.5, 38.0]
  };

  // 时辰 -> 中点小时
  var HOUR_MID = {
    '子': 0, '丑': 2, '寅': 4, '卯': 6, '辰': 8, '巳': 10,
    '午': 12, '未': 14, '申': 16, '酉': 18, '戌': 20, '亥': 22
  };

  function parseBirth(text) {
    if (!text) return null;
    var m = text.match(/(\d{4})[-\/年.](\d{1,2})[-\/月.](\d{1,2})日?/);
    if (!m) return null;
    return { y: parseInt(m[1], 10), m: parseInt(m[2], 10), d: parseInt(m[3], 10) };
  }

  function parseHour(text) {
    if (!text) return null;
    var m = text.match(/[子丑寅卯辰巳午未申酉戌亥]/);
    return m ? HOUR_MID[m[0]] : null;
  }

  function zodiacOfBirth(y, m, d) {
    var bounds = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
    return d < bounds[m - 1] ? ZODIACS[m - 1] : ZODIACS[m % 12];
  }

  function rad(deg) { return deg * Math.PI / 180; }

  function julianDay(y, m, d, ut) {
    // 儒略日（公历）
    var Y = y, M = m;
    if (M <= 2) { Y -= 1; M += 12; }
    var A = Math.floor(Y / 100);
    var B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5 + (ut || 0) / 24.0;
  }

  // 求太阳到达指定黄经的儒略日：在当年内扫描 + 线性插值（可靠，精度约分钟级）
  function julianForSolarLongitude(targetLon, y, m, d) {
    var startJd = julianDay(y, 1, 1, 0);
    var endJd = julianDay(y + 1, 1, 1, 0);
    var prev = startJd;
    var prevLon = solarLongitudeRaw(prev);
    var step = 0.5; // 半天步长，插值后精度足够
    for (var t = startJd + step; t <= endJd + step; t += step) {
      var lon = solarLongitudeRaw(t);
      // 判断是否跨越目标黄经（处理 0° 环绕）
      var d1 = mod(lon - targetLon + 180, 360) - 180;
      var d0 = mod(prevLon - targetLon + 180, 360) - 180;
      if (d0 * d1 < 0 || (Math.abs(d1) < 0.005)) {
        // 线性插值
        var frac = Math.abs(d0) / (Math.abs(d0) + Math.abs(d1) || 1);
        return prev + frac * step;
      }
      prev = t;
      prevLon = lon;
    }
    return julianDay(y, m, d, 12);
  }

  function solarLongitudeRaw(jd) {
    var T = (jd - 2451545.0) / 36525.0;
    var L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    var M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(rad(M)) +
      (0.019993 - 0.000101 * T) * Math.sin(rad(2 * M)) + 0.000289 * Math.sin(rad(3 * M));
    var trueLon = L0 + C - 0.00569 - 0.00478 * Math.sin(rad(125.04 - 1934.136 * T));
    return mod(trueLon, 360);
  }

  // 给定公历日期，判断太阳是否已越过某节气黄经（用于月柱）
  function passedTerm(jd, targetLon, y, m, d) {
    var termJd = julianForSolarLongitude(targetLon, y, m, d);
    return jd >= termJd;
  }

  // 八字：以太阳黄经节气为准（准确性显著提升）
  function baziPillars(y, m, d, hour) {
    var yy = y;
    var jd = julianDay(y, m, d, hour === null ? 12 : hour);
    // 年柱：立春（黄经315°）分界
    if (!passedTerm(jd, 315, y, m, d)) yy -= 1;
    var yearGan = GAN[mod(yy - 4, 10)];
    var yearZhi = ZHI[mod(yy - 4, 12)];

    // 月柱：由太阳黄经连续映射，大雪255°=子月起（一年连续，无分支错误）
    var sunLon = solarLongitudeRaw(jd);
    var monthIndex = Math.floor(mod(sunLon - 255, 360) / 30); // 0=子
    var monthZhiIdx = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11][monthIndex];

    // 月干（五虎遁）：甲己年丙寅起
    var ganIdx = mod(yy - 4, 10);
    var monthStemStart = [2, 4, 6, 8, 0][ganIdx % 5]; // 甲己丙、乙庚戊、丙辛庚、丁壬壬、戊癸甲
    // 寅月为起点，月干偏移 = 月支距寅的偏移
    var offset = mod(monthZhiIdx - 2, 12);
    var monthGan = GAN[mod(monthStemStart + offset, 10)];
    var monthZhi = ZHI[monthZhiIdx];

    // 日柱：以 2000-01-01（戊午，序 54）为基准
    var base = julianDay(2000, 1, 1, 12);
    var days = Math.round(jd - base);
    var dayIdx = mod(days + 54, 60);
    var dayGan = GAN[dayIdx % 10];
    var dayZhi = ZHI[dayIdx % 12];

    // 时柱：五鼠遁
    var hourZhiIdx = hour === null ? -1 : Math.floor(((hour + 1) % 24) / 2);
    var hourGan = '', hourZhi = '';
    if (hourZhiIdx > -1) {
      var hourStemStart = [0, 2, 4, 6, 8][dayIdx % 10 % 5];
      hourGan = GAN[mod(hourStemStart + hourZhiIdx, 10)];
      hourZhi = ZHI[hourZhiIdx];
    }

    return {
      year: yearGan + yearZhi,
      month: monthGan + monthZhi,
      day: dayGan + dayZhi,
      hour: hour === null ? '未知' : hourGan + hourZhi
    };
  }

  // 月亮星座：平均黄经近似（忽略摄动，标注近似）
  function moonZodiac(y, m, d) {
    var days = julianDay(y, m, d, 12) - 2451545.0;
    // 主要摄动项（Meeus 方法，精度 ~0.3°）
    var Lp = 218.3164477 + 481267.88123421 * days / 36525.0;
    var D = 297.8501921 + 445267.1114034 * days / 36525.0;
    var M = 357.5291092 + 35999.0502909 * days / 36525.0;
    var Mp = 134.9633964 + 477198.8675055 * days / 36525.0;
    var F = 93.2720950 + 483202.0175233 * days / 36525.0;
    var lon = Lp
      + 6.288774 * Math.sin(rad(Mp))
      + 1.274027 * Math.sin(rad(2 * D - Mp))
      + 0.658314 * Math.sin(rad(2 * D))
      + 0.213618 * Math.sin(rad(2 * Mp))
      - 0.185116 * Math.sin(rad(M))
      - 0.114332 * Math.sin(rad(2 * F))
      + 0.058793 * Math.sin(rad(2 * D - 2 * Mp))
      + 0.057066 * Math.sin(rad(2 * D - M - Mp))
      + 0.053322 * Math.sin(rad(2 * D + Mp));
    var idx = Math.floor(mod(lon, 360) / 30);
    return ZODIACS[idx];
  }

  // 上升星座：更精确的 GMST 公式（IAU 1982）
  function risingZodiac(y, m, d, hour, city) {
    var loc = city ? CITIES[city.trim()] : null;
    if (!loc) return { ok: false, reason: '未提供出生城市，无法精确排上升星座' };
    if (hour === null) return { ok: false, reason: '未提供出生时辰，无法排上升星座' };
    var lon = loc[0], lat = loc[1];
    var jd = julianDay(y, m, d, hour);
    var T = (jd - 2451545.0) / 36525.0;
    // IAU 1982 GMST（度）
    var gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
      0.000387933 * T * T - T * T * T / 38710000.0;
    var lst = mod(gmst + lon, 360) * Math.PI / 180;
    var eps = 23.4393 * Math.PI / 180;
    var phi = lat * Math.PI / 180;
    var asc = Math.atan2(
      -Math.cos(lst),
      Math.sin(lst) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)
    );
    var ascDeg = mod(asc * 180 / Math.PI, 360);
    return { ok: true, zodiac: ZODIACS[Math.floor(ascDeg / 30)], degree: Math.round(ascDeg % 30) };
  }

  function mod(a, n) {
    return ((a % n) + n) % n;
  }

  window.guanAstrology = {
    parseBirth: parseBirth,
    parseHour: parseHour,
    bazi: baziPillars,
    moon: moonZodiac,
    rising: risingZodiac,
    zodiacOfBirth: zodiacOfBirth,
    cities: CITIES
  };
})();
