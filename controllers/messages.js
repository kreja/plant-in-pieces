'use strict';
var views = require('co-views');
var parse = require('co-body');

var render = views(__dirname + '/../views', {
  map: { html: 'swig' }
});

module.exports.home = function *home() {
  this.body = yield render('index.jade', {});
};
