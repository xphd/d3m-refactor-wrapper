const fs = require("fs");
const fse = require("fs-extra");

// import variables
const properties = require("../properties");
const static = properties.static;
const dynamic = properties.dynamic;
// static variables
const proto = static.proto;

helloLoop = function() {
  // Added by Alex, for the purpose of Pipeline Visulization
  console.log("helloLoop begin");
  let pathPrefix = "responses/";
  if (fs.existsSync(pathPrefix)) {
    console.log("Remove old responses folder!");
    fse.removeSync(pathPrefix);
  }
  console.log("Create a new responses folder!!");
  fs.mkdirSync(pathPrefix);

  return new Promise(function(fulfill, reject) {
    // const connectionString = dynamic.connectionString;
    // console.log("connectionString:", connectionString);
    // dynamic.client = new proto.Core(
    //   connectionString,
    //   grpc.credentials.createInsecure()
    // );

    let request = new proto.HelloRequest();
    let waiting = false;
    setInterval(function() {
      const sessionVar = dynamic.sessionVar;
      if (waiting || sessionVar.connected) return;
      waiting = true;
      const client = dynamic.client;
      client.Hello(request, function(err, response) {
        if (err) {
          console.log("Error!Hello", err);
          sessionVar.connected = false;
          waiting = false;
          // we do not reject here, because ta2 can becaome available at some point
          // reject(err);
        } else {
          sessionVar.connected = true;
          console.log("Success!Hello", response);
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
