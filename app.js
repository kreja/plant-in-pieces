'use strict';
var compress = require('koa-compress');
var logger = require('koa-logger');
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var app = module.exports = koa();
var messages = require('./controllers/messages');
var mailer = require('./controllers/mailer');
var comment = require('./controllers/comment');

// Logger
app.use(logger());

app.use(route.get('/', messages.home));
app.use(route.post('/getPlant', messages.getPlant)); // 获取植物信息
app.use(route.post('/sendCard', mailer.sendCard)); // 发送电子贺卡
app.use(route.get('/getComment', comment.getComment)); // 获取评论
app.use(route.post('/sendComment', comment.sendComment)); // 发送评论

// Serve static files
app.use(serve(path.join(__dirname, 'public/')));

// 跨域 options 确认
app.use(function * (next){
    this.response.set({
        "Access-Control-Allow-Origin": "*"
    });
    this.response.set('Content-Type', 'application/json');
    this.response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    this.response.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

    this.body = '可以跨域';
    yield next;
});

// Compresss
app.use(compress());

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}
