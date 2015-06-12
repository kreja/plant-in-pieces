'use strict';
var views = require('co-views');
var parse = require('co-body');
var nodemailer = require('nodemailer');
var fs = require('fs');

var render = views(__dirname + '/../views', {
  map: { html: 'swig' }
});

var transporter = nodemailer.createTransport({
    service: 'QQ',
    auth: {
        user: '3276383016@qq.com',
        pass: 'madebykelly2015'
    }
});

/**
 * 发送电子贺卡
 */
module.exports.sendCard = function *sendCard() {
  var me = this;
  var param = yield parse(this);
  var emailHtml = yield render('emailTemplate.html', {msg:param}); // 得到模板
  var sendRes = yield send(param,emailHtml);

  if(me.header.origin){ //跨域
    me.response.set({
        "Access-Control-Allow-Origin": "*"
    });
    me.response.set('Content-Type', 'application/json');
    me.response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    me.response.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  }

  me.body = {
    err: sendRes.error,
    msg: sendRes.msg
  }
};

/**
 * 发送贺卡
 * @param  {[type]} msg       [填表信息]
 * @param  {[type]} emailHtml [邮件模板的html]
 * @return {[type]}           [{error:error,msg:''}]
 */
function send(msg,emailHtml){
  console.log(__dirname + '/../views'+'/kreja.jpg');
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: 'plant-in-pieces <3276383016@qq.com>', // sender address
      to: msg.toEmail, // list of receivers
      subject: msg.fromName +'从植物碎片寄来的贺卡', // Subject line
      html: emailHtml, // html body
      attachments: [{
        filename: 'kreja.jpg',
        path: __dirname + '/../public/'+msg.imgPath,
        cid: 'unique@kreja.ee' //same cid value as in the html img src
      },{
        filename: 'stamp.jpg',
        path: __dirname + '/../public/images/stamp.jpg',
        cid: 'stamp' //same cid value as in the html img src
      },{
        filename: 'banner.jpg',
        path: __dirname + '/../public/images/banner.jpg',
        cid: 'banner' //same cid value as in the html img src
      }]
  };

  return function(done){
    sendMail(done);
  };

  function sendMail(callback){
    transporter.sendMail(mailOptions,function(error, info){
      if(error){
          console.log(error);
          callback && callback(error, {error:error,msg:'发送失败'});
          return ;
      }
      callback && callback(error, {error:error,msg:'发送成功'});
    });
  }
}
