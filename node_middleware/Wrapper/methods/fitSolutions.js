const fs = require("fs");
const appRoot = require("app-root-path");
const evaluationConfig = require(appRoot + "/tufts_gt_wisc_configuration.json");

// import variables
const properties = require("../properties");
const proto = properties.proto;

// import functions
const handleImageUrl = require("../functions/handleImageUrl");

const getFitSolutionResults = require("./getFitSolutionResults.js");

fitSolutions = function(sessionVar) {
  console.log("fitSolutions called");

  // Added by Alex, for the purpose of Pipeline Visulization
  let pathPrefix = "responses/fitSolutionResponses/";
  if (!fs.existsSync(pathPrefix)) {
    fs.mkdirSync(pathPrefix);
  }
  pathPrefix = "responses/getFitSolutionResultsResponses/";
  if (!fs.existsSync(pathPrefix)) {
    fs.mkdirSync(pathPrefix);
  }

  let solutions = Array.from(sessionVar.solutions.values());

  let chain = Promise.resolve();
  for (let i = 0; i < solutions.length; i++) {
    let solution = solutions[i];
    chain = chain.then(solutionID => {
      return fitSolution(solution, sessionVar);
    });
  }
  return new Promise(function(fulfill, reject) {
    chain
      .then(function(res) {
        // console.log("RES", res);
        fulfill(sessionVar);
      })
      .catch(function(err) {
        // console.log("ERR", err);
        reject(err);
      });
  });
};

function fitSolution(solution, sessionVar) {
  // TODO: fix function
  let fitSolutionRequest = new proto.FitSolutionRequest();
  fitSolutionRequest.setSolutionId(solution.solutionID);
  var dataset_input = new proto.Value();
  dataset_input.setDatasetUri(
    "file://" + handleImageUrl(evaluationConfig.dataset_schema)
  );
  fitSolutionRequest.setInputs(dataset_input);
  fitSolutionRequest.setExposeOutputs(solution.finalOutput);
  fitSolutionRequest.setExposeValueTypes([proto.ValueType.CSV_URI]);
  // leave empty: repeated SolutionRunUser users = 5;
  return new Promise(function(fulfill, reject) {
    const client = properties.client;
    client.fitSolution(fitSolutionRequest, function(err, fitSolutionResponse) {
      if (err) {
        reject(err);
      } else {
        let fitSolutionResponseID = fitSolutionResponse.request_id;
        getFitSolutionResults(solution, fitSolutionResponseID, fulfill, reject);

        // Added by Alex, for the purpose of Pipeline Visulization
        let pathPrefix = "responses/fitSolutionResponses/";
        let pathMid = solution.solutionID;
        let pathAffix = ".json";
        let path = pathPrefix + pathMid + pathAffix;
        let responseStr = JSON.stringify(fitSolutionResponse);
        fs.writeFileSync(path, responseStr);
      }
    });
  });
}

module.exports = fitSolutions;
