'use strict';

const fs = require("fs");
const path = require("path");
const http = require("http");
const urlModel = require("url");

const cheerio = require("cheerio");
const request = require("request");
const async = require("async");


function crawler(articleConfig, callback) {
  let promiseAll = allArticle(articleConfig);

  promiseAll.then((linkList) => {

    let promiseList = [];

    linkList.forEach((article) => {
      if (!article.linkBody) return;

      let contentPromise = getContentPromise(article);
      contentPromise && promiseList.push(contentPromise);
    })

    Promise.all(promiseList).then((articleList) => {
      let contentList = [];

      articleList.forEach((article) => {
        if (!article.articleBody) return;

        let content = article.getContent(article.articleBody)
        if (!content) return;

        contentList.push(Object.assign(article, {
          articleHtml: content
        }))
      })

      let htmlContent = getMailHtml(contentList);
      callback(htmlContent)
    })
  })
}

function getMailHtml(contentList) {
  let htmlContent = '';
  contentList.forEach((article) => {
    htmlContent += article.articleHtml
  })

  htmlContent += `<p>——————————————————————————————————————————————————</p>
    <p>该技术周报由<a href='https://github.com/zdz1993/crawler'>crawler</a>强力驱动</p>`;

  return htmlContent
}

/**
 * 通过列表页的连接，获取真实的URL
 * @param  {Object} article 文档列表页
 * @return {Object}         Promise
 */
function getContentPromise(article) {
  if (!article.linkBody) return;

  let contentLink = article.getLink(article.linkBody);
  if (!contentLink) return;

  return new Promise((resolve, reject) => {
    request(contentLink, (error, res, body) => {
      resolve(Object.assign(article, {
        articleBody: body
      }))
    })
  })
}

/**
 * 获取所有文档页面的所有页面内容
 * @param  {Object}   articleConfig 文章列表配置
 * @return {Obejct}                 Promise
 */
function allArticle(articleConfig) {
  let promiseList = [];

  for (let key in articleConfig) {
    let article = articleConfig[key];
    let url = typeof article.url == 'function' ? article.url() : article.url;

    promiseList.push(new Promise((resolve, reject) => {
      request(url, (error, res, body) => {
        resolve(Object.assign(article, {
          linkBody: body
        }));
      })
    }))
  }

  return Promise.all(promiseList)
}

module.exports = crawler;
