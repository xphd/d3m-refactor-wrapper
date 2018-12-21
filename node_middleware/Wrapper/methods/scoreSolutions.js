const fs = require("fs");
const _ = require("lodash");
const appRoot = require("app-root-path");
const evaluationConfig = require(appRoot + "/tufts_gt_wisc_configuration.json");

// import variables
const properties = require("../properties");
const static = properties.static;
const dynamic = properties.dynamic;
// proto
const proto = static.proto;

// import mappings
const metric_mappings = require("../mappings/metric_mappings");

// import functions
const getMappedType = require("../functions/getMappedType");
const getProblemSchema = require("../functions/getProblemSchema");
const handleImageUrl = require("../functions/handleImageUrl");

scoreSolutions = function(sessionVar) {
  // console.log("scoreSolutions called");
  let solutions = Array.from(sessionVar.solutions.values());

  let chain = Promise.resolve();
  for (let i = 0; i < solutions.length; i++) {
    let solution = solutions[i];
    chain = chain.then(solutionID => {
      return scoreSolution(solution);
    });
  }

  // Added by Alex, for the purpose of Pipeline Visulization
  // onetime response
  let pathPrefix = "responses/scoreSolutionResponses/";
  if (!fs.existsSync(pathPrefix)) {
    fs.mkdirSync(pathPrefix);
  }
  pathPrefix = "responses/getScoreSolutionResultsResponses/";
  if (!fs.existsSync(pathPrefix)) {
    fs.mkdirSync(pathPrefix);
  }

  return new Promise(function(fulfill, reject) {
    let _fulfill = fulfill;
    chain
      .then(function(res) {
        for (let i = 0; i < solutions.length; i++) {
          let solution = solutions[i];
          if (!solution.scores) {
            console.log(
              "WARNING: solution " +
                solution.solutionID +
                " has no scores; removing from results set"
            );
            sessionVar.solutions.delete(solution.solutionID);
          }
        }
        _fulfill(sessionVar);
      })
      .catch(function(err) {
        // console.log("ERR", err);
        reject(err);
      });
  });
};

function scoreSolution(solution) {
  console.log("scoring solution with id", solution.solutionID);
  let scoreSolutionRequest = new proto.ScoreSolutionRequest();
  scoreSolutionRequest.setSolutionId(solution.solutionID);

  let dataset_input = new proto.Value();
  dataset_input.setDatasetUri(
    "file://" + handleImageUrl(evaluationConfig.dataset_schema)
  );
  scoreSolutionRequest.setInputs(dataset_input);

  const problemSchema = getProblemSchema();

  let metrics = problemSchema.inputs.performanceMetrics.map(d => d.metric);
  let mapped_metrics = metrics.map(metric =>
    getMappedType(metric_mappings, metric)
  );
  let problemPerformanceMetrics = mapped_metrics.map(mapped_metric => {
    let newMetric = new proto.ProblemPerformanceMetric();
    newMetric.setMetric(mapped_metric);
    return newMetric;
  });
  scoreSolutionRequest.setPerformanceMetrics(problemPerformanceMetrics);

  // TODO: the user stuff is actually all optional
  // let solutionRunUser = new proto.SolutionRunUser;
  // solutionRunUser.setId("user1");
  // solutionRunUser.setChoosen(false);
  // solutionRunUser.setReason("none");
  // scoreSolutionRequest.setUsers(solutionRunUser);

  // TODO: scoringConfiguration lets us influence cross valuation
  // and many other evaluation parameters; ignore for now
  let scoringConfiguration = new proto.ScoringConfiguration();
  // TODO: we should do better here
  // scoringConfiguration.setMethod(proto.EvaluationMethod.TRAINING_DATA);
  // I think TRAINING_DATA is pretty much what we did last time, but it's unsupported so far
  // scoringConfiguration.setMethod(proto.EvaluationMethod.HOLDOUT);
  scoringConfiguration.setMethod(proto.EvaluationMethod.HOLDOUT);
  scoringConfiguration.setTrainTestRatio(0.8);
  // TODO: use holdout for now, but let users specify in the future
  // scoringConfiguration.setFolds(2);
  scoreSolutionRequest.setConfiguration(scoringConfiguration);

  return new Promise(function(fulfill, reject) {
    const client = dynamic.client;
    client.scoreSolution(scoreSolutionRequest, function(
      err,
      scoreSolutionResponse
    ) {
      if (err) {
        reject(err);
      } else {
        let scoreRequestID = scoreSolutionResponse.request_id;

        // Added by Alex, for the purpose of Pipeline Visulization
        let pathPrefix = "responses/scoreSolutionResponses/";
        // let pathMid = scoreRequestID;
        let pathMid = solution.solutionID;
        let pathAffix = ".json";
        let path = pathPrefix + pathMid + pathAffix;
        let responseStr = JSON.stringify(scoreSolutionResponse);
        fs.writeFileSync(path, responseStr);

        getScoreSolutionResults(solution, scoreRequestID, fulfill, reject);
      }
    });
  });
}

function getScoreSolutionResults(solution, scoreRequestID, fulfill, reject) {
  let _fulfill = fulfill;
  let _reject = reject;
  let getScoreSolutionResultsRequest = new proto.GetScoreSolutionResultsRequest();
  getScoreSolutionResultsRequest.setRequestId(scoreRequestID);
  const client = dynamic.client;
  let call = client.getScoreSolutionResults(getScoreSolutionResultsRequest);
  call.on("data", function(getScoreSolutionResultsResponse) {
    if (getScoreSolutionResultsResponse.progress.state === "COMPLETED") {
      // console.log("scoreSolutionResultsResponse", getScoreSolutionResultsResponse);
      /*
        let targets = getScoreSolutionResultsResponse.scores.map(score => score.targets);
        */
      let value_keys = getScoreSolutionResultsResponse.scores.map(
        score => score.value.value
      );
      let metrics = getScoreSolutionResultsResponse.scores.map(
        score => score.metric
      );
      let values = value_keys.map(
        (key, i) => getScoreSolutionResultsResponse.scores[i].value[key]
      );
      values = values.map(thing => thing[thing.raw]);
      // console.log("METRICS", metrics);
      // console.log("VALUES", values);
      solution.scores = {};
      for (let i = 0; i < metrics.length; i++) {
        // solution.scores = { f1Macro: _.mean(values) };
        console.log("METRICS", metrics[i], values, "num values", values.length);
        solution.scores[metrics[i].metric] = _.mean(values);
      }
    } else {
      console.log(
        "scoreSolutionResultsResponse INTERMEDIATE",
        getScoreSolutionResultsResponse
      );
    }

    // Added by Alex, for the purpose of Pipeline Visulization
    let pathPrefix = "responses/getScoreSolutionResultsResponses/";
    let pathMid = scoreRequestID;
    let pathAffix = ".json";
    let path = pathPrefix + pathMid + pathAffix;
    let responseStr = JSON.stringify(getScoreSolutionResultsResponse);
    fs.writeFileSync(path, responseStr);
  });
  call.on("error", function(err) {
    console.log("Error!getScoreSolutionResults: ", scoreRequestID);
    _reject(err);
  });
  call.on("end", function(err) {
    console.log("End of score solution result: ", scoreRequestID);
    if (err) console.log("err is ", err);
    _fulfill(scoreRequestID);
  });
}

module.exports = scoreSolutions;
