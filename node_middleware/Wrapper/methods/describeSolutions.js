const fs = require("fs");

// import properties
const properties = require("../properties");
const proto = properties.proto;

describeSolutions = function(sessionVar) {
  console.log("describeSolutions called");
  let solutions = Array.from(sessionVar.solutions.values());

  let chain = Promise.resolve();
  for (let i = 0; i < solutions.length; i++) {
    let solution = solutions[i];
    chain = chain.then(solutionID => {
      return describeSolution(solution);
    });
  }
  return new Promise(function(fulfill, reject) {
    let _fulfill = fulfill;
    let _reject = reject;
    chain
      .then(function(res) {
        _fulfill(sessionVar);
      })
      .catch(function(err) {
        _reject(err);
      });
  });
};

function describeSolution(solution) {
  // doing the shortcut now and see how far this takes us
  // console.log("WARNING: TAKING THE DESCRIBE-SOLUTION SHORTCUT FOR NOW");
  // return new Promise(function(fulfill, reject) {
  //   solution.finalOutput = "outputs.0";
  //   fulfill(solution);
  // });
  // THIS DOES NOT GET EXECUTED FOR NOW
  console.log("request describe solution with id", solution.solutionID);
  let describeSolutionRequest = new proto.DescribeSolutionRequest();
  describeSolutionRequest.setSolutionId(solution.solutionID);

  // Added by Alex, for the purpose of Pipeline Visulization
  let pathPrefix = "responses/describeSolutionResponses/";
  if (!fs.existsSync(pathPrefix)) {
    fs.mkdirSync(pathPrefix);
  }

  return new Promise(function(fulfill, reject) {
    properties.client.describeSolution(
      describeSolutionRequest,
      (err, describeSolutionResponse) => {
        if (err) {
          reject(err);
        } else {
          console.log("PipelineDescription Begin");
          console.log(describeSolutionResponse);
          console.log("END");

          // this is a PipelineDescription message
          let pipeline = describeSolutionResponse.pipeline;
          // console.log(pipeline);
          let outputs = pipeline.outputs;
          console.log(outputs);
          let finalOutput = outputs[outputs.length - 1].data;
          console.log(
            "selecting final output for ",
            solution.solutionID,
            finalOutput
          );
          solution.finalOutput = finalOutput;
          fulfill(solution);

          // Added by Alex, for the purpose of Pipeline Visulization
          let pathPrefix = "responses/describeSolutionResponses/";
          let pathMid = solution.solutionID;
          let pathAffix = ".json";
          let path = pathPrefix + pathMid + pathAffix;
          let responseStr = JSON.stringify(describeSolutionResponse);
          fs.writeFileSync(path, responseStr);
        }
      }
    );
  });
}

module.exports = describeSolutions;