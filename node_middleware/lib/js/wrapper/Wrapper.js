const grpc = require("grpc");
const appRoot = require("app-root-path");

const PROTO_PATH = appRoot + "/lib/js" + "/protos/v2018.7.7/core.proto";

const properties = require("./properties");

const helloLoop = require("./methods/helloLoop");
// const searchSolutions = require("./methods/searchSolutions");
// const fitSolutions = require("./methods/fitSolutions");
// const produceSolutions = require("./methods/produceSolutions");
// const scoreSolutions = require("./methods/scoreSolutions");
// const exportFittedSolution = require("./methods/exportFittedSolution");
// const endSearchSolutions = require("./methods/endSearchSolutions");
// const describeSolutions = require("./methods/describeSolutions");

class Wrapper {
  constructor() {
    this.properties = properties;

    this.helloLoop = helloLoop;
    //     this.searchSolutions = searchSolutions;
    //     this.fitSolutions = fitSolutions;
    //     this.produceSolutions = produceSolutions;
    //     this.scoreSolutions = scoreSolutions;
    //     this.exportFittedSolution = exportFittedSolution;
    //     this.endSearchSolutions = endSearchSolutions;
    //     this.describeSolutions = describeSolutions;
  }
  connect(ta2_url) {
    console.log("Connect to:" + ta2_url);
    let proto = grpc.load(PROTO_PATH);
    properties.proto = proto;
    properties.client = new proto.Core(
      ta2_url,
      grpc.credentials.createInsecure()
    );
  }
}

module.exports = Wrapper;
