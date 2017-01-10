'use strict';

const fs = require("fs");
const path = require("path");
const http = require("http");
const urlModel = require("url");

const request = require("request");

/**
 * 通过文章列表配置和爬虫获取到每周技术内容，生成html
 * @param  {Object}   articleConfig  文章列表配置
 * @param  {Function} callback      回调函数
 * @return {Undefined}
 */
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

/**
 * 通过articleList获取HTML片段
 * @param  {Array} contentList 获取到的文章列表
 * @return {String}             生成的HTML内容
 */
function getMailHtml(contentList) {
  let htmlContent = '';
  contentList.forEach((article) => {
    htmlContent += article.articleHtml
  })

  htmlContent += `<p>——————————————————————————————————————————————————</p>
    <p>该技术周报由<a href='https://github.com/xiongwilee/Techweekly'>Techweekly</a>强力驱动</p>`;

  return htmlContent
}

/**
 * 通过页面连接获取文档内容的HTML
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
 * 获取所有文档列表页面的页面HTML
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
