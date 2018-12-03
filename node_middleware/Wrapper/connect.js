// import all methods
const helloLoop = require("./methods/helloLoop");
const searchSolutions = require("./methods/searchSolutions");
const fitSolutions = require("./methods/fitSolutions");
const produceSolutions = require("./methods/produceSolutions");
const scoreSolutions = require("./methods/scoreSolutions");
const exportFittedSolution = require("./methods/exportFittedSolution");
const endSearchSolutions = require("./methods/endSearchSolutions");
const describeSolutions = require("./methods/describeSolutions");

// import variables to use.
const properties = require("./properties");
const dynamic = properties.dynamic;

connect = function(connectionString) {
  dynamic.connectionString = connectionString;
  console.log("CLIENT WRAPPER", dynamic.connectionString);

  let obj = {};
  obj.sessionVar = dynamic.sessionVar;

  obj.helloLoop = helloLoop;
  obj.searchSolutions = searchSolutions;
  obj.fitSolutions = fitSolutions;
  obj.produceSolutions = produceSolutions;
  obj.scoreSolutions = scoreSolutions;
  obj.exportFittedSolution = exportFittedSolution;
  obj.endSearchSolutions = endSearchSolutions;
  obj.describeSolutions = describeSolutions;

  // obj.runStartSession;
  // here we return the object that is accessible to everyone through the app
  return obj;
};

module.exports = connect;
