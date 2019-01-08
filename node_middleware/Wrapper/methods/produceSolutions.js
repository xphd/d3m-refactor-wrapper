const fs = require("fs");
const appRoot = require("app-root-path");
const evaluationConfig = require(appRoot + "/tufts_gt_wisc_configuration.json");

// import variables
const properties = require("../properties");
const proto = properties.proto;

// import functions
const handleImageUrl = require("../functions/handleImageUrl");

produceSolutions = function(sessionVar) {
  let solutions = Array.from(sessionVar.solutions.values());
  let chain = Promise.resolve();
  for (let i = 0; i < solutions.length; i++) {
    let solution = solutions[i];
    chain = chain.then(solutionID => {
      return produceSolution(solution, sessionVar);
    });
  }

  // Added by Alex, for the purpose of Pipeline Visulization
  let pathPrefix = "responses/produceSolutionResponses/";
  if (!fs.existsSync(pathPrefix)) {
    fs.mkdirSync(pathPrefix);
  }
  pathPrefix = "responses/getProduceSolutionResultsResponses/";
  if (!fs.existsSync(pathPrefix)) {
    fs.mkdirSync(pathPrefix);
  }

  return new Promise(function(fulfill, reject) {
    chain
      .then(function(res) {
        console.log("produce solutions RES", res);
        fulfill(sessionVar);
      })
      .catch(function(err) {
        // console.log("produce solutions ERR", err);
        reject(err);
      });
  });
};

function produceSolution(solution, sessionVar) {
  // console.log("produce solution called");
  let produceSolutionRequest = new proto.ProduceSolutionRequest();
  produceSolutionRequest.setFittedSolutionId(solution.fit.fitID);
  let dataset_input = new proto.Value();
  dataset_input.setDatasetUri(
    "file://" + handleImageUrl(evaluationConfig.dataset_schema)
  );
  produceSolutionRequest.setInputs(dataset_input);
  /*
    if (sessionVar.ta2Ident.user_agent === "cmu_ta2") {
      produceSolutionRequest.setExposeOutputs("");
    }*/
  produceSolutionRequest.setExposeOutputs(solution.finalOutput);
  produceSolutionRequest.setExposeValueTypes([proto.ValueType.CSV_URI]);
  // leaving empty: repeated SolutionRunUser users = 5;

  return new Promise(function(fulfill, reject) {
    const client = properties.client;
    client.produceSolution(produceSolutionRequest, function(
      err,
      produceSolutionResponse
    ) {
      if (err) {
        reject(err);
      } else {
        let produceSolutionRequestID = produceSolutionResponse.request_id;
        getProduceSolutionResults(
          solution,
          produceSolutionRequestID,
          fulfill,
          reject
        );

        // Added by Alex, for the purpose of Pipeline Visulization
        let pathPrefix = "responses/produceSolutionResponses/";
        // let pathMid = produceSolutionRequestID;
        let pathMid = solution.solutionID;
        let pathAffix = ".json";
        let path = pathPrefix + pathMid + pathAffix;
        let responseStr = JSON.stringify(produceSolutionResponse);
        fs.writeFileSync(path, responseStr);
      }
    });
  });
}

function getProduceSolutionResults(
  solution,
  produceSolutionRequestID,
  fulfill,
  reject
) {
  // console.log("get produce solution called");
  let _fulfill = fulfill;
  let _reject = reject;
  let getProduceSolutionResultsRequest = new proto.GetProduceSolutionResultsRequest();
  getProduceSolutionResultsRequest.setRequestId(produceSolutionRequestID);

  return new Promise(function(fulfill, reject) {
    const client = properties.client;
    let call = client.GetProduceSolutionResults(
      getProduceSolutionResultsRequest
    );
    call.on("data", function(getProduceSolutionResultsResponse) {
      // console.log("getProduceSolutionResultsResponse", getProduceSolutionResultsResponse);
      if (getProduceSolutionResultsResponse.progress.state === "COMPLETED") {
        // fitting solution is finished
        let exposedOutputs = getProduceSolutionResultsResponse.exposed_outputs;
        // console.log("PRODUCE SOLUTION COMPLETED", produceSolutionResponseID);
        // console.log("EXPOSED OUTPUTS", exposedOutputs);
        let steps = Object.keys(exposedOutputs);
        if (steps.length !== 1) {
          console.log("EXPOSED OUTPUTS:", exposedOutputs);
          console.log("ONLY USING FIRST STEP OF", steps);
        }
        solution.fit.outputCsv = exposedOutputs[steps[0]]["csv_uri"].replace(
          "file://",
          ""
        );
        if (!solution.fit.outputCsv.trim()) {
          console.log(
            "WARNING: solution " +
              solution.solutionID +
              " has not output file; removing from results set"
          );
          sessionVar.solutions.delete(solution.solutionID);
        }
        // console.log("solution.fit.outputCsv", solution.fit.outputCsv);
      }

      // Added by Alex, for the purpose of Pipeline Visulization
      let pathPrefix = "responses/getProduceSolutionResultsResponses/";
      let pathMid = produceSolutionRequestID;
      let pathAffix = ".json";
      let path = pathPrefix + pathMid + pathAffix;
      let responseStr = JSON.stringify(getProduceSolutionResultsResponse);
      fs.writeFileSync(path, responseStr);
    });
    call.on("error", function(err) {
      console.log("Error!getProduceSolutionResults", produceSolutionRequestID);
      _reject(err);
    });
    call.on("end", function(err) {
      console.log("End of produce solution results", produceSolutionRequestID);
      if (err) console.log("err is ", err);
      _fulfill(produceSolutionRequestID);
    });
  });
}

module.exports = produceSolutions;
