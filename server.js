var express    = require('express'),
    app        = express(),
    request    = require("request");
    path       = require('path');
    formidable = require('formidable');
    fs         = require('fs'),
    lineReader = require('reverse-line-reader');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {

  // ejs render automatically looks in the views folder
  res.render('index');
});

app.get('/upload', function(req, res){

  // ejs render automatically looks in the views folder
  res.render('upload');
});

app.post('/uploadSubmit', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {

    lineReader.eachLine(file.path, function(line) {
      if( line != "") {

        console.log(line);
        console.log("line==========>");
      }
    }).then(function (err) {
      if (err) throw err;
      console.log("I'm done!!");
    });
  });

  // log any errors that occur
  form.on('error', function(err) {

    res.end('error');
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {

    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

app.listen(port, function() {

  console.log('Our app is running on http://localhost:' + port);
});
