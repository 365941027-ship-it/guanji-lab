// 观己实验室 · 镜像站跳转
//
// GitHub Pages 是纯静态托管，没有 /api/*，
// 账号、登录、档案、AI 解读在那个地址上都跑不起来（用户会遇到“登录不了”）。
// 它只是早期留下的镜像，所以一旦被打开，就立刻跳到真正的服务器地址。
//
// 这个脚本放在 <head> 里最先执行，页面还没开始渲染就跳走，避免用户看到半截旧页面。
// 以后买了域名，只需要改下面这一行。
(function () {
  'use strict';

  // 唯一对外地址（买了域名后改成 https://你的域名）
  var CANONICAL_ORIGIN = 'http://162.14.105.122:8787';

  // 需要跳转的旧镜像站；本机调试地址不在其中，不会被跳走。
  // 注意：Vercel 那份是 2026-08 的旧副本，早于本脚本，所以它自己不会跳转
  //（已经在 Vercel 后台删掉该部署）。若将来又部署到别处，在这里加一行即可。
  var MIRRORS = {
    // GitHub Pages 的项目站会把仓库名带在路径里，跳转时要剥掉
    '365941027-ship-it.github.io': '/guanji-lab'
  };

  var host = String(location.hostname || '').toLowerCase();
  if (!Object.prototype.hasOwnProperty.call(MIRRORS, host)) return;

  var base = MIRRORS[host];
  var path = String(location.pathname || '/');

  // 剥掉镜像站自身的前缀（GitHub Pages 的 /guanji-lab），换成服务器的根路径
  if (base && path.indexOf(base) === 0) path = path.slice(base.length);
  if (!path || path.charAt(0) !== '/') path = '/' + path;

  // 目标地址不对外暴露内测码，所以这里只做跳转，不附加其他参数
  location.replace(CANONICAL_ORIGIN + path + location.search + location.hash);
})();
