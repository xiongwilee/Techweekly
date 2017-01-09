'use strict';

const nodemailer = require("nodemailer");

//配置邮件服务信息
let smtpTransport;


function sendMail(mailConfig, html) {
  smtpTransport = smtpTransport || nodemailer.createTransport(mailConfig.sender);

  smtpTransport.sendMail({
    subject: mailConfig.subject,
    from: mailConfig.from,
    to: mailConfig.to.join(','),
    html: html
  }, (error, response) => {
    if (error) {
      console.log("error:" + error);
    } else {
      console.log(response);
    }
    smtpTransport.close();
  });
}

exports.sendMail = sendMail;