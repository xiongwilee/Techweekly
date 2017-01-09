'use strict';

const cheerio = require("cheerio");

module.exports = {
  "fex": {
    url: function() {
      let year = new Date().getFullYear();
      return `https://github.com/zenany/weekly/blob/master/software/${year}/`
    },
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
