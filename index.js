'use strict';

const config = require('./src/config');
const crawler = require('./src/crawler');
const mailer = require('./src/mailer');

let mailConfig = config.getConfig('mail');
let articleConfig = config.getConfig('article');

crawler(articleConfig, (content) => {
  mailer.sendMail(mailConfig, content);
})
