const koa = require('koa');
const Router = require('@koa/router');
const { log } = require('../src/utils/log');
const { getModules } = require('../src/utils');

const app = new koa();
const router = new Router();

getModules().forEach(({ fileName, path }) => {
  const routerPath = `/${fileName}`;
  const api = require(path);

  app[fileName] = api;

  log(`✅ 生成路由 ${routerPath}`);

  router.get(routerPath, async (ctx, next) => {
    ctx.status = 200;
    ctx.body = await api(ctx.request.query, ctx);
    next();
  });
});

app.use(router.routes()).use(router.allowedMethods());

// Vercel Serverless 入口 - 导出 handler
module.exports = app.callback();
