
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var seed = "https://azure.microsoft.com";
var successCount = 0;
var errorCount = 0;

console.log("Visiting page " + seed);
request({ url: seed, strictSSL: false }, function(error, response, body) {
    if(error) {
        console.log("Error: " + error);
        errorCount++;
    }
   // Check status code (200 is HTTP OK)
   console.log("Status code: " + response.statusCode);
   if(response.statusCode === 200) {
    successCount++;
     // Parse the document body
     var $ = cheerio.load(body);
     console.log("Page title:  " + $('title').text());
     var relativeLinks = $("a[href^='/']");
     
     relativeLinks.each(function () {
        console.log("Visiting child page: " + seed + $(this).attr('href'));
        request({url: seed + $(this).attr('href'), strictSSL: false}, function (error, response, body) {
            if(error) {
                errorCount++;
                console.log("Error: " + error);
            }
            // Check status code (200 is HTTP OK)
            console.log("Status code: " + response.statusCode);
            if(response.statusCode === 200) {
                successCount++;
                // Parse the document body
                var child$ = cheerio.load(body);
                console.log("Page title:  " + child$('title').text());

                var childRelativeLinks = child$("a[href^='/']");

                childRelativeLinks.each(function () {
                    console.log("Visiting child child page: " + seed + child$(this).attr('href'));
                    request({url: seed + child$(this).attr('href'), strictSSL: false}, function (error, response, body) {
                        if(error) {
                            errorCount++;
                            console.log("Error: " + error);
                        }

                        console.log("Status code: " + response.statusCode);
                        if(response.statusCode === 200) {
                            successCount++;
                            var childChild$ = cheerio.load(body);
                            console.log("Page title:  " + childChild$('title').text());
                        }

                        console.log("Errors: " + errorCount);
                        console.log("Succes: " + successCount);
                    });
                });
            }
        });
     });
 }});
