// require the request and fs module
var request = require('request');
var fs = require('fs');

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
  // check if repoOwner or repoName are undefined (i.e. not supplied)
  // if so return error
  if (repoOwner === undefined || repoName === undefined) {
    try {
      throw Error("Please supply a repository owner name and repository name.");
    } catch (e) {
      console.log(e.name + ": " + e.message);
    }
    return;
  }
  // generate the request URL, and set the User-Agent header
  // note that GITHUB_USER and GITHUB_TOKEN are defined globally.
  var requestURL = {
    url: 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };
  // run the request and use the callback to obtain results
  request(requestURL, cb);
}

// The function to obtain the image from the url
// input:
// url: the image url
// filePath: a local path to put the images
function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function (err) { // check error
    throw err;
  })
  .pipe(fs.createWriteStream(filePath));
}

// The callback function to check errors and status, then obtain the avatars
function getAvatars(err, result, body) {
  // return error if present
  if (err) {
    console.log("Error: ", err);
    return;
  }
  // check statusCode, if == 200  then obtain the avatar from the avatar url
  // if == 404 return not found
  if (result.statusCode === 200) {
    var json =  JSON.parse(body);
    json.forEach(function(x) {
      // note here we name each avatar .jpg by the login id name
      downloadImageByURL(x.avatar_url, "./avatar/" + x.login + ".jpg") ;});
  } else if (result.statusCode === 404) {
    console.log('endpoint not found!');
    return
  }
}

// a manual test

getRepoContributors(process.argv[2], process.argv[3], getAvatars);

// // manual test for downloadImageURL
// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "./avatar/kvirani.jpg")

