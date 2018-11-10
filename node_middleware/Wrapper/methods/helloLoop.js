const fs = require("fs");
const fse = require("fs-extra");

const properties = require("../properties");
const proto = properties.proto;
const sessionVar = properties.sessionVar;

helloLoop = function() {
  console.log("helloLoop begin");
  // Added by Alex, for the purpose of Pipeline Visulization
  let pathPrefix = "responses/";
  if (fs.existsSync(pathPrefix)) {
    console.log("Remove old responses folder!");
    fse.removeSync(pathPrefix);
  }
  console.log("Create a new responses folder!!");
  fs.mkdirSync(pathPrefix);

  return new Promise(function(fulfill, reject) {
    let request = new proto.HelloRequest();
    let waiting = false;
    setInterval(function() {
      if (waiting || sessionVar.connected) return;
      waiting = true;
      properties.client.Hello(request, function(err, response) {
        if (err) {
          console.log("Error!Hello", err);
          sessionVar.connected = false;
          waiting = false;
          // we do not reject here, because ta2 can becaome available at some point
          // reject(err);
        } else {
          sessionVar.connected = true;
          console.log("Success!");
          console.log("HelloResponse", response);
          sessionVar.ta2Ident = response;
          fulfill(sessionVar);
          // Added by Alex, for the purpose of Pipeline Visulization
          let pathPrefix = "responses/";
          let pathMid = "helloResponse";
          let pathAffix = ".json";
          let path = pathPrefix + pathMid + pathAffix;
          let responseStr = JSON.stringify(response);
          fs.writeFileSync(path, responseStr);
        }
      });
    }, 10000);
  });
};

module.exports = helloLoop;
