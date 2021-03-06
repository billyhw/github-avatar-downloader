// require the request and fs module
var request = require('request');
var fs = require('fs');
require('dotenv').config()

console.log('Welcome to the Github Avatar Downloader!');

// check for existence of .env, and check whether .env has a GITHUB_USER and a GITHUB_TOKEN field
fs.exists('.env', function(exists) {
  if (!exists) {
    console.log('Note that a .env file with your github user name and API Token is not found.');
    console.log('This may not affect the download, but may run into issues if your IP address has exceeded Github daily download limit.');
  } else {
    if (process.env.GITHUB_USER === undefined || process.env.GITHUB_TOKEN === undefined) {
      console.log("Note that the .env file may be missing a GITHUB_USER or a GITHUB_TOKEN value.")
      console.log('This may not affect the download, but may run into issues if your IP address has exceeded Github daily download limit.');
    }
  }
});

// The function to obtain repository contributors URL
// input:
// repoOwner: the owner of the query repository
// repoName: the name of the repositiory name
// cb: a callback function to handle errors and return results
function getRepoContributors(repoOwner, repoName, cb) {
  // check if repoOwner or repoName are undefined (i.e. not supplied)
  // or if too many arguments are provided if so return error
  if (repoOwner === undefined || repoName === undefined || process.argv.length > 4 || process.argv.length === 2) {
    try {
      throw Error("Please supply only a repository owner name and repository name.");
    } catch (e) {
      console.log(e.name + ": " + e.message);
    }
    return;
  }
  // generate the request URL, and set the User-Agent header
  // note that GITHUB_USER and GITHUB_TOKEN are defined globally.
  var requestURL = {
    url: 'https://'+ process.env.GITHUB_USER + ':' + process.env.GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
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
  if (result.statusCode === 200) {
    // check if photo_dir exist
    var photo_dir = "./avatar/";
    fs.exists(photo_dir, function(exists) {
      if (!exists) {
        try {
            throw Error(`photo directory ${photo_dir} does not exist.`);
          } catch (e) {
            console.log(e.name + ": " + e.message);
          }
        }
        else {
          // proceed to downloading the photos.
          var json =  JSON.parse(body);
          json.forEach(function(x) {
            // note here we name each avatar .jpg by the login id name
            downloadImageByURL(x.avatar_url, photo_dir + x.login + ".jpg") ;});
        }
    });
  } else if (result.statusCode === 404) {
    // if == 404 return not found
    console.error(`Requested repository '${process.argv[2]}' and/or repository owner '${process.argv[3]}' not found.`);
  }
}

// a manual test

getRepoContributors(process.argv[2], process.argv[3], getAvatars);

// // manual test for downloadImageURL
// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "./avatar/kvirani.jpg")

