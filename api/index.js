const koa = require('koa');
const Router = require('@koa/router');
const path = require('path');
const glob = require('glob');

const app = new koa();
const router = new Router();

// 加载所有模块
const moduleDir = path.join(__dirname, '../src/module');
const files = glob.sync('*.js', { cwd: moduleDir });

files.forEach((file) => {
  const fileName = file.replace('.js', '');
  const filePath = path.join(moduleDir, file);
  const api = require(filePath);

  console.log(`✅ 生成路由 /${fileName}`);

  router.get(`/${fileName}`, async (ctx, next) => {
    try {
      ctx.status = 200;
      ctx.body = await api(ctx.request.query, ctx);
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
    next();
  });
});

app.use(router.routes()).use(router.allowedMethods());

// Vercel Serverless 入口
module.exports = app.callback();
