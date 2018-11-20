const grpc = require("grpc");

const properties = require("./properties");

const helloLoop = require("./methods/helloLoop");
const searchSolutions = require("./methods/searchSolutions");
const fitSolutions = require("./methods/fitSolutions");
const produceSolutions = require("./methods/produceSolutions");
const scoreSolutions = require("./methods/scoreSolutions");
const exportFittedSolution = require("./methods/exportFittedSolution");
const endSearchSolutions = require("./methods/endSearchSolutions");
const describeSolutions = require("./methods/describeSolutions");

class Wrapper {
  constructor() {
    this.properties = properties;

    this.helloLoop = helloLoop;
    this.searchSolutions = searchSolutions;
    this.fitSolutions = fitSolutions;
    this.produceSolutions = produceSolutions;
    this.scoreSolutions = scoreSolutions;
    this.exportFittedSolution = exportFittedSolution;
    this.endSearchSolutions = endSearchSolutions;
    this.describeSolutions = describeSolutions;
  }
  connect(ta2_url) {
    console.log("Connect to:" + ta2_url);
    let proto = properties.proto;
    let client = new proto.Core(ta2_url, grpc.credentials.createInsecure());
    properties.client = client;
  }
  setEvaluationConfig(evaluationConfig) {
    properties.evaluationConfig = evaluationConfig;
  }
}

module.exports = Wrapper;
