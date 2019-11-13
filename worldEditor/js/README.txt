Updating bundle.js:
Bundle.js is a file generated using the project classes to use them in browser.
To edit the page's javascript, you must edit index.js, then to update it you must
Install browserify:
 In a command line editor `npm install -g browserify`
Then in this location:
  `browserify -s logic index.js > bundle.js`
