// fitSolutionResponse
// getFitSolutionResultsResponse

const fs = require("fs");

// import properties
const properties = require("../properties");
const proto = properties.proto;

// import functions
const handleImageUrl = require("../functions/handleImageUrl");

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
  let dataset_input = new proto.Value();
  const evaluationConfig = properties.evaluationConfig;
  dataset_input.setDatasetUri(
    "file://" + handleImageUrl(evaluationConfig.dataset_schema)
  );
  fitSolutionRequest.setInputs(dataset_input);
  fitSolutionRequest.setExposeOutputs(solution.finalOutput);
  fitSolutionRequest.setExposeValueTypes([proto.ValueType.CSV_URI]);
  // leave empty: repeated SolutionRunUser users = 5;

  return new Promise(function(fulfill, reject) {
    properties.client.fitSolution(
      fitSolutionRequest,
      (err, fitSolutionResponse) => {
        if (err) {
          reject(err);
        } else {
          let fitSolutionResponseID = fitSolutionResponse.request_id;
          getFitSolutionResults(
            solution,
            fitSolutionResponseID,
            fulfill,
            reject
          );

          // Added by Alex, for the purpose of Pipeline Visulization
          let pathPrefix = "responses/fitSolutionResponses/";
          let pathMid = fitSolutionResponseID;
          let pathAffix = ".json";
          let path = pathPrefix + pathMid + pathAffix;
          let responseStr = JSON.stringify(fitSolutionResponse);
          fs.writeFileSync(path, responseStr);
        }
      }
    );
  });
}

function getFitSolutionResults(
  solution,
  fitSolutionResponseID,
  fulfill,
  reject
) {
  let _fulfill = fulfill;
  let _reject = reject;
  let getFitSolutionResultsRequest = new proto.GetFitSolutionResultsRequest();
  getFitSolutionResultsRequest.setRequestId(fitSolutionResponseID);

  return new Promise(function(fulfill, reject) {
    let call = properties.client.getFitSolutionResults(
      getFitSolutionResultsRequest
    );
    call.on("data", function(getFitSolutionResultsResponse) {
      // console.log("getfitSolutionResultsResponse", getFitSolutionResultsResponse);
      if (getFitSolutionResultsResponse.progress.state === "COMPLETED") {
        // fitting solution is finished
        let fitID = getFitSolutionResultsResponse.fitted_solution_id;
        let exposedOutputs = getFitSolutionResultsResponse.exposed_outputs;
        // console.log("FITTED SOLUTION COMPLETED", fitID);
        // console.log("EXPOSED OUTPUTS", exposedOutputs);
        solution.fit = {
          fitID: fitID,
          exposedOutputs: exposedOutputs
        };

        // Added by Alex, for the purpose of Pipeline Visulization
        let pathPrefix = "responses/getFitSolutionResultsResponses/";
        let pathMid = fitID;
        let pathAffix = ".json";
        let path = pathPrefix + pathMid + pathAffix;
        let responseStr = JSON.stringify(getFitSolutionResultsResponse);
        fs.writeFileSync(path, responseStr);
      }
    });
    call.on("error", function(err) {
      console.log("Error!getFitSolutionResults", fitSolutionResponseID);
      _reject(err);
    });
    call.on("end", function(err) {
      console.log("End of fitted solution results", fitSolutionResponseID);
      if (err) console.log("err is ", err);
      _fulfill(fitSolutionResponseID);
    });
  });
}

module.exports = fitSolutions;
