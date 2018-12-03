const fs = require("fs");

// import variables
const properties = require("../properties");
const static = properties.static;
const dynamic = properties.dynamic;
// static variables
const proto = static.proto;

exportFittedSolution = function(sessionVar, solutionID) {
  console.log("export fitted solution", solutionID);
  let rank = sessionVar.rankVar;
  sessionVar.rankVar = sessionVar.rankVar - 0.00000001;
  let solutionExportRequest = new proto.SolutionExportRequest();
  solutionExportRequest.setFittedSolutionId(
    sessionVar.solutions.get(solutionID).fit.fitID
  );
  solutionExportRequest.setRank(rank);
  const client = dynamic.client;
  client.solutionExport(solutionExportRequest, function(
    solutionExportResponse
  ) {
    // no content specified for this message
    console.log("solution exported");

    // Added by Alex, for the purpose of Pipeline Visulization
    let path = "responses/solutionExportResponse.json";
    let responseStr = JSON.stringify(solutionExportResponse);
    fs.writeFileSync(path, responseStr);
  });
};

module.exports = exportFittedSolution;
