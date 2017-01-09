'use strict';

const fs = require('fs');
const path = require('path');

let config = {
  article: __dirname + '/../config/config.article.js',
  mail:  __dirname + '/../config/config.mail.js'
}

/**
 * 获取config
 * @param {string} type    配置类型
 */
exports.getConfig = function(type) {
  if (!config[type]) return;

  let filePath = path.resolve(config[type]);

  return require(filePath);
}

/**
 * 设置config
 * @param {string} type    配置类型
 * @param {Object} content 配置内容
 */
exports.setConfig = function(type, content) {
  if (!config[type]) return;

  let filePath = path.resolve(config[type])

  fs.writeFileSync(filePath, JSON.stringify(content, null, 4));

  return content;
}
