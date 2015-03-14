var request = require('request');
var events = require('events');
var cheerio = require('cheerio');

var parser = new events.EventEmitter;

var HACKERNEWS_URL = 'https://news.ycombinator.com/news?p=';

parser.on('parse', function(html) {
  var $ = cheerio.load(html);
  
  html = $('#hnmain > tr').get(2);
  html = $(html)
          .children('td')
          .children('table')
          .get(0);
  //.get(0);
  //console.log(html.children);
  console.log('====================================');
  html.children.forEach(function(value, index) {
    if (index % 3 != 0) return;
    try {
      var a = value.children[2].children[1];
      console.log(a.children[0].data);
      console.log(a.attribs.href);
    } catch (err) {
      // console.log(err);
    } 
  });
});

var LIMIT = 5;

(function(limit) {
  var page = 1;

  var crawl = function() { 
    console.log('page = ' + page);
    var url = HACKERNEWS_URL + page;
    request(url, function(err, res, body) {
      parser.emit('parse', body);
    });

    ++page;
    if (page > limit) {
      clearInterval(crawlProcess);
    }
  };

  var crawlProcess = setInterval(crawl, 1000);
})(LIMIT);
