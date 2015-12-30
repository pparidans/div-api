var webpage = require("webpage");
var url = "http://www.mobilit.fgov.be/WebdivPub_FR/wmvpstv1_fr";
var loadingCheckerInterval = 100;
var loadingCheckerCount = 100;

module.exports = function(data, done, worker) {
  var plate = data.plate;
  var page = webpage.create();
  page.clearCookies();

  page.onLoadFinished = function(status) {
    var loadingCheckerId = setInterval(function(){
      loadingCheckerCount--;
      if(loadingCheckerCount === 0) {
        clearInterval(loadingCheckerId);
        done(new Error("NoResponseReceived"));
      }
      page.switchToFrame("AppWindow");
      var message = page.evaluate(function() {
        return document.getElementById('Readonly1').value;
      });
      console.log("message", typeof message, message)
      if(message.trim() !== "") {
        clearInterval(loadingCheckerId);
        done(null, { plate: plate, message: message });
      }
    }, loadingCheckerInterval);
  };

  page.open(url, function(status) {
    if(status !== "success") {
      done(new Error("CannotLoadPage"), { url: url });
    } else {
      page.switchToFrame("AppWindow");
      // console.log(page)
      page.evaluate(function(plate) {
        document.getElementById("Writable2").value = plate;
        document.getElementById("btnOphalen").click();
      }, plate);
    }
  });
};
