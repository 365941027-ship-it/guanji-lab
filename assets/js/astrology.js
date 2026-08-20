(function () {
  'use strict';

  var GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  var ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  var ZODIACS = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];

  // 节气（公历近似日期）：立春、惊蛰、清明、立夏、芒种、小暑、立秋、白露、寒露、立冬、大雪、小寒
  var SOLAR_TERMS = [
    { m: 2, d: 4 }, { m: 3, d: 6 }, { m: 4, d: 5 }, { m: 5, d: 6 },
    { m: 6, d: 6 }, { m: 7, d: 7 }, { m: 8, d: 7 }, { m: 9, d: 8 },
    { m: 10, d: 8 }, { m: 11, d: 7 }, { m: 12, d: 7 }, { m: 1, d: 6 }
  ];

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

  // 八字：近似排盘（立春分年、节气表分月）
  function baziPillars(y, m, d, hour) {
    var yy = y;
    // 立春近似（2月4日）前算上一年
    if (m < 2 || (m === 2 && d < 4)) yy -= 1;
    var yearGan = GAN[mod(yy - 4, 10)];
    var yearZhi = ZHI[mod(yy - 4, 12)];

    // 月支：按节气近似。1月6日小寒后为丑月；2月4日立春后为寅月……
    var monthZhiIdx = -1;
    if (m === 1) monthZhiIdx = d >= 6 ? 1 : 0; // 丑 or 子
    else if (m === 2) monthZhiIdx = d >= 4 ? 2 : 1;
    else if (m === 3) monthZhiIdx = d >= 6 ? 3 : 2;
    else if (m === 4) monthZhiIdx = d >= 5 ? 4 : 3;
    else if (m === 5) monthZhiIdx = d >= 6 ? 5 : 4;
    else if (m === 6) monthZhiIdx = d >= 6 ? 6 : 5;
    else if (m === 7) monthZhiIdx = d >= 7 ? 7 : 6;
    else if (m === 8) monthZhiIdx = d >= 7 ? 8 : 7;
    else if (m === 9) monthZhiIdx = d >= 8 ? 9 : 8;
    else if (m === 10) monthZhiIdx = d >= 8 ? 10 : 9;
    else if (m === 11) monthZhiIdx = d >= 7 ? 11 : 10;
    else if (m === 12) monthZhiIdx = d >= 7 ? 0 : 11; // 大雪后为子月

    // 月干（五虎遁）：甲己年丙寅起
    var ganIdx = mod(yy - 4, 10);
    var monthStemStart = [2, 4, 6, 8, 0][ganIdx % 5]; // 甲己丙、乙庚戊、丙辛庚、丁壬壬、戊癸甲
    var monthGan = GAN[mod(monthStemStart + monthZhiIdx, 10)];
    var monthZhi = ZHI[monthZhiIdx];

    // 日柱：以 2000-01-01（戊午，序 54）为基准
    var base = Date.UTC(2000, 0, 1);
    var days = Math.floor((Date.UTC(y, m - 1, d) - base) / 86400000);
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
    var days = (Date.UTC(y, m - 1, d) - Date.UTC(2000, 0, 1)) / 86400000;
    var lon = 218.316 + 13.176396 * days;
    var idx = Math.floor(mod(lon, 360) / 30);
    return ZODIACS[idx];
  }

  // 上升星座：简化公式，需要城市经纬度与出生时刻
  function risingZodiac(y, m, d, hour, city) {
    var loc = city ? CITIES[city.trim()] : null;
    if (!loc) return { ok: false, reason: '未提供出生城市，无法精确排上升星座' };
    if (hour === null) return { ok: false, reason: '未提供出生时辰，无法排上升星座' };
    var lon = loc[0], lat = loc[1];
    // 儒略日（近似）
    var jd = (Date.UTC(y, m - 1, d, hour) / 86400000) + 2440587.5;
    // 格林尼治恒星时（度）
    var gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0);
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
