// endSearchSolutionsResponse

const fs = require("fs");

// import variables
const attributes = require("../attributes");
const static = attributes.static;
const dynamic = attributes.dynamic;
// static variables
const proto = static.proto;

endSearchSolutions = function(sessionVar) {
  return new Promise(function(fulfill, reject) {
    console.log("end search solutions for search", sessionVar.searchID);
    let endSearchSolutionsRequest = new proto.EndSearchSolutionsRequest();
    endSearchSolutionsRequest.setSearchId(sessionVar.searchID);
    const client = dynamic.client;
    client.endSearchSolutions(endSearchSolutionsRequest, function(
      err,
      endSearchSolutionsResponse
    ) {
      if (err) {
        reject(err);
      } else {
        sessionVar.searchEnded = true;
        fulfill(sessionVar);

        // Added by Alex, for the purpose of Pipeline Visulization
        let path = "responses/endSearchSolutionsResponse.json";
        let responseStr = JSON.stringify(endSearchSolutionsResponse);
        fs.writeFileSync(path, responseStr);
      }
    });
  });
};

module.exports = endSearchSolutions;
