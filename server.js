var express = require('express');
var morgan = require('morgan');

var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(morgan("combined"));

app.get('/api/v3/check', function(req, res) {
  var plate = req.query.plate;

  var childArgs = [ path.join(__dirname, 'check_plate.js'), plate ];

  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    res.send(JSON.parse(stdout.toString('utf8')));
  });
});

var server = app.listen(app.get('port'), function() {
  var host = server.address().address;

  console.log("DivAPi listening on port %s", app.get('port'));
});
