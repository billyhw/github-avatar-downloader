var request = require('request');
var fs = require('fs');

console.log('Welcome to the Github Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  return request.get(`https://billyhw:5957ca0dfef761f8d00f1cd8a629f2da66b10f04/api.github.com/repos/${repoName}/${repoOwner}/contributors`);

}

getRepoContributors("jquery", "jquery", function (err, result) {
  console.log("Errors", err);
  console.log("Result:", result);
});
