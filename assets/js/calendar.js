(function () {
  'use strict';

  // 简单月历：点击日期查看当天记录
  window.guanCalendar = function (opts) {
    var mount = document.getElementById(opts.mount);
    if (!mount) return;
    var getRecords = opts.getRecords || function () { return []; };
    var now = new Date();
    var viewY = now.getFullYear();
    var viewM = now.getMonth();
    var selected = null;

    function dstr(y, m, d) {
      return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    }

    function render() {
      var records = getRecords();
      var byDay = {};
      records.forEach(function (r) {
        if (r.date) byDay[r.date] = (byDay[r.date] || 0) + 1;
      });
      var first = new Date(viewY, viewM, 1);
      var startDay = first.getDay();
      var daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
      var html = '<div class="cal-head">' +
        '<button type="button" class="cal-nav" data-d="-1">‹</button>' +
        '<span class="cal-title">' + viewY + ' 年 ' + (viewM + 1) + ' 月</span>' +
        '<button type="button" class="cal-nav" data-d="1">›</button>' +
        '</div><div class="cal-grid">';
      ['日', '一', '二', '三', '四', '五', '六'].forEach(function (w) {
        html += '<div class="cal-week">' + w + '</div>';
      });
      for (var i = 0; i < startDay; i++) html += '<div class="cal-cell empty"></div>';
      for (var d = 1; d <= daysInMonth; d++) {
        var key = dstr(viewY, viewM, d);
        var has = byDay[key];
        var sel = selected === key ? ' sel' : '';
        html += '<div class="cal-cell' + (has ? ' has' : '') + sel + '" data-date="' + key + '">' +
          '<span>' + d + '</span>' + (has ? '<i></i>' : '') + '</div>';
      }
      html += '</div>';
      if (selected) {
        var dayRecords = records.filter(function (r) { return r.date === selected; });
        html += '<div class="cal-day-records"><b>' + selected + ' · ' + dayRecords.length + ' 条记录</b>';
        if (dayRecords.length) {
          html += dayRecords.slice(-3).map(function (r) {
            return '<p>' + (r.mood ? '【' + r.mood + '】' : '') + (r.note || '') + '</p>';
          }).join('');
        } else {
          html += '<p class="empty">这一天还没有记录。今天，就是很好的开始。</p>';
        }
        html += '</div>';
      }
      mount.innerHTML = html;
      mount.querySelectorAll('.cal-nav').forEach(function (b) {
        b.addEventListener('click', function () {
          viewM += parseInt(b.getAttribute('data-d'), 10);
          if (viewM < 0) { viewM = 11; viewY -= 1; }
          if (viewM > 11) { viewM = 0; viewY += 1; }
          render();
        });
      });
      mount.querySelectorAll('.cal-cell[data-date]').forEach(function (c) {
        c.addEventListener('click', function () {
          selected = c.getAttribute('data-date');
          render();
        });
      });
    }
    render();
  };
})();
