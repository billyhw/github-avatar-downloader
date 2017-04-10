// require the request module
var request = require('request');

console.log('Welcome to the Github Avatar Downloader!');

// user and token info:
var GITHUB_USER = "billyhw";
var GITHUB_TOKEN = "5957ca0dfef761f8d00f1cd8a629f2da66b10f04";

// The function to obtain repository contributors URL
// input:
// repoOwner: the owner of the query repository
// repoName: the name of the repositiory name
// cb: a callback function to handle errors and return results

function getRepoContributors(repoOwner, repoName, cb) {

  // generate the request URL,
  // note that GITHUB_USER and GITHUB_TOKEN are defined globally.
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  console.log(requestURL);

}

// a manual test

getRepoContributors("jquery", "jquery", function (err, result) {
  console.log("Errors", err);
  console.log("Result:", result);
});
