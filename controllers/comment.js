'use strict';
var views = require('co-views');
var parse = require('co-body');
var monk = require('monk');
var wrap = require('co-monk');
var db = monk('localhost/plantLib');
var dbComments = wrap(db.get('comments'));

var render = views(__dirname + '/../views', {
  map: { html: 'swig' }
});

/**
 * 获取评论
 * @yield {[type]} [description]
 */
module.exports.getComment = function *getComment() {
  var commentLists = yield dbComments.find({});

  if(this.header.origin){ //跨域
    this.response.set({
        "Access-Control-Allow-Origin": "*"
    });
    this.response.set('Content-Type', 'application/json');
    this.response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    this.response.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  }

  this.body = commentLists.reverse();
};

/**
 * 发送评论
 * @yield {[type]} [description]
 */
module.exports.sendComment = function *sendComment() {
  var newComment = yield parse(this);

  yield dbComments.insert(newComment);

  var commentLists = yield dbComments.find({});

  if(this.header.origin){ //跨域
    this.response.set({
        "Access-Control-Allow-Origin": "*"
    });
    this.response.set('Content-Type', 'application/json');
    this.response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    this.response.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  }
  this.body = commentLists.reverse();
};
