var webpage = require("webpage");
var system = require("system");
var url = "http://www.mobilit.fgov.be/WebdivPub_FR/wmvpstv1_fr";
var loadingCheckerInterval = 100;
var loadingCheckerCount = 100;
var plate = system.args[1];
var page = webpage.create();
page.clearCookies();

page.onLoadFinished = function(status) {
  var loadingCheckerId = setInterval(function(){
    loadingCheckerCount--;
    if(loadingCheckerCount === 0) {
      clearInterval(loadingCheckerId);
      console.log(JSON.stringify({ error: "NoResponseReceived" }));
      phantom.exit(1);
    }
    page.switchToFrame("AppWindow");
    var message = page.evaluate(function() {
      var resultContainer = document.getElementById('Readonly1');
      if(resultContainer === null) {
        return null;
      }
      return resultContainer.value;
    });
    if(typeof message === 'string' && message.trim() !== "") {
      clearInterval(loadingCheckerId);
      console.log(JSON.stringify({ plate: plate, message: message }));
      phantom.exit(0);
    }
  }, loadingCheckerInterval);
};

page.open(url, function(status) {
  if(status !== "success") {
    console.log(JSON.stringify({ error: "Error: CannotLoadPage " + url }));
  } else {
    page.switchToFrame("AppWindow");
    page.evaluate(function(plate) {
      document.getElementById("Writable2").value = plate;
      document.getElementById("btnOphalen").click();
    }, plate);
  }
});
