var express    = require('express'),
    app        = express(),
    formidable = require('formidable'),
    fs         = require('fs'),
    lineReader = require('reverse-line-reader'),
    geoIpLite  = require('geoip-lite');

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

    var outputLog = ""; 

    // line reader added to read all log file
    lineReader.eachLine(file.path, function(line) {

      // check line have proper value
      if( line != "") {

        var log = {};

        var repLine = line.replace('HTTP/1.1"', "HTTP/1.1"),
            request = repLine.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);

        // var lineOpt = line.split(" ");
        // log.HTTP_METHOD              = request[0];
        // log.URL                      = request[1];
        // log.HTTP_VERSION             = request[2];
           log.ORIGIN_HEADER            = request[3];
        // log.SSL_CIPHER               = request[4];
        // log.SSL_PROTOCOL             = request[5];
        // log.DATETIME                 = request[6];
        // log.LB_NAME                  = request[7];
           log.CLIENT_IP                = request[8];
        // log.BACKEND_IP               = request[9];
        // log.request_processing_time  = request[10];
        // log.backend_processing_time  = request[11];
        // log.response_processing_time = request[12];
        // log.elb_status_code          = request[13];
        // log.backend_status_code      = request[14];
        // log.received_bytes           = request[15];
        // log.sent_bytes               = request[16];

        if( typeof log.ORIGIN_HEADER != "undefined" ) {

          if( log.ORIGIN_HEADER == '"MATLAB R2013a"'){

            outputLog += "<p><b>Yes</b>, "+ line + "</p>";
          }
          else {

            if ( typeof log.CLIENT_IP != "undefined" ) {

              var clientIpArr = log.CLIENT_IP.split(":")
              var geo = geoIpLite.lookup(clientIpArr[0]);

              if ( geo.country == "IN" ) {

                outputLog += "<p>No, "+ line + "</p>";
              }
              else {

                outputLog += "<p><b>Yes</b>, "+ line + "</p>";
              }
            }
            else {

              outputLog += "<p><b>Yes</b>, "+ line + "</p>";
            }
          }
        }
        else {

          outputLog += "<p><b>Yes</b>, "+ line + "</p>";
        }
      }
    }).then(function (err) {
      if (err) {
        res.end('error');
        return;
      }

      res.end(outputLog);
      return;
    });
  });

  // log any errors that occur
  form.on('error', function(err) {

    // res.end('error');
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {

    // res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

app.listen(port, function() {

  console.log('Our app is running on http://localhost:' + port);
});
