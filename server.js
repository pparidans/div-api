var express = require("express");
var morgan = require("morgan");
var Pool = require("phantomjs-pool").Pool;
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(morgan("combined"));

var platesQueue = [];

app.get('/api/v3/check', function(req, res) {
  var plate = req.query.plate;
  platesQueue.push({
    plate: plate,
    onSuccess: function(plateStatus) {
      res.send(plateStatus);
    },
    onError: function(error) {
      res.status(500).send({ error: "Error", message: error.message });
    }
  });
});

var onWorkerReady = function (job, worker, index) {
  console.log(worker, index)
  setInterval(function() {
    if(platesQueue.length !== 0) {
      var plateEnquiry = platesQueue.pop();
      var plate = plateEnquiry.plate;
      console.log("Processing...", plate);
      job({ plate: plate }, function(err, data) {
        console.log("DONE", err, data);
        if(err === null) {
          plateEnquiry.onSuccess(data);
        } else {
          plateEnquiry.onError(err);
        }
      });
    }
  }, 100);
};

var pool = new Pool({
  numWorkers: 2,
  jobCallback: onWorkerReady,
  workerFile: __dirname + "/check_plate.js"
});

pool.start();

var server = app.listen(app.get('port'), function() {
  var host = server.address().address;

  console.log("DivAPi listening on port %s", app.get('port'));
});
