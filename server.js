var Pool = require("phantomjs-pool").Pool;

var plates = [ "1ACY003", "1BCY002", "1cCY001", "1DCY004", "1ECY005", "1FCY006", "1GCY007" ];

var onWorkerReady = function (job, worker, index) {
  if(plates.length === 0) {
    job(null);
  } else {
    var plate = plates.pop();
    console.log("Processing...", plate);
    job({ plate: plate }, function(err, data) {
      console.log("DONE", data);
    });
  }
};

var pool = new Pool({
  numWorkers: 2,
  jobCallback: onWorkerReady,
  workerFile: __dirname + "/check_plate.js"
});

pool.start();

