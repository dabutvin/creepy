
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var seed = "https://azure.microsoft.com";
var pageCount = {};

function increasePageCount(page) {
    if(!pageCount[page]) {
        pageCount[page] = 1;
    } else {
        pageCount[page] = pageCount[page] + 1;
    }
}

function makeRequest(url, callback) {
    console.log("Visiting page " + url);    
    
    request({ url: seed, strictSSL: false }, function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
        } else {
            console.log("Status code: " + response.statusCode);

            if(response.statusCode === 200) {
                increasePageCount(url);
                var $ = cheerio.load(body);
                console.log("Page title:  " + $('title').text());
                
                callback($);
            }
        }
    });
}

makeRequest(seed, function($) {

     var relativeLinks = $("a[href^='/']");
     
     relativeLinks.each(function () {
        makeRequest(seed + $(this).attr('href'), function (child$) {
                var childRelativeLinks = child$("a[href^='/']");

                childRelativeLinks.each(function () {
                    makeRequest(seed + child$(this).attr('href'), function (childChild$) {
                        console.log("Done: " + pageCount.length);
                    });
                });
            });
    });
 });
