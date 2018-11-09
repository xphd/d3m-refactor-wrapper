const grpc = require("grpc");
const appRoot = require("app-root-path");

const PROTO_PATH = appRoot + "/lib/js" + "/protos/v2018.7.7/core.proto";

const properties = require("./properties");
// const client = require("./properties/client");
// const proto = require("./properties/proto");
// const sessionVar = require("./properties/sessionVar");
// const staticVar = require("./properties/staticVar");

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
    this.client = properties.client;
    this.proto = properties.proto;
    this.sessionVar = properties.sessionVar;
    this.staticVar = properties.staticVar;

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
    properties.proto = grpc.load(PROTO_PATH);
    let proto = properties.proto;
    properties.client = new proto.Core(
      ta2_url,
      grpc.credentials.createInsecure()
    );
  }
}

module.exports = Wrapper;
