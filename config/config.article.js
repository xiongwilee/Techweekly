/**
 * 文章源配置文件
 * @author xiongwilee
 */

'use strict';

const cheerio = require("cheerio");

module.exports = {
  "fex": {
    /**
     * 页面连接，可以是一个string, 也可以是function
     * @return {String} 页面URL
     */
    url: function() {
      let year = new Date().getFullYear();
      return `https://github.com/zenany/weekly/blob/master/software/${year}/`
    },

    /**
     * 通过url获取文章内容URL的方法
     * @param  {string} html 通过页面连接爬取到的页面html
     * @return {String}      从html中解析到的文章内容的链接
     */
    getLink: function(html) {
      try {
        let curLink = 'https://github.com/';

        let $ = cheerio.load(html);
        let links = $('table.files .content a');
        return curLink + $(links[links.length - 1]).attr('href');
      } catch (err) {
        return;
      }
    },

    /**
     * 通过文章内容的链接爬取到文章主体
     * @param  {String} html 通过文章内容的链接爬取到文章的html
     * @return {String}      文章主体部分的html
     */
    getContent: function(html) {
      let $ = cheerio.load(html);
      try{
        let html = $('.entry-content').html();
        html = html.replace('<p>-- THE END --</p>','');
        return html;
      }catch(err){
        return;
      }
    }
  },
  "75team": {
    url: "https://weekly.75team.com/",
    getLink: function(html) {
      try {
        let curLink = 'https://weekly.75team.com/';

        let $ = cheerio.load(html);
        return curLink + $('.issue-list li:first-child a').attr('href');
      } catch (err) {
        return;
      }
    },
    getContent: function(html) {
      let $ = cheerio.load(html);
      try{
        let contentDom = $('#main #content>ul');
        return contentDom.html();
      }catch(err){
        return;
      }
    }
  }
}
