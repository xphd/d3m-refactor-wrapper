// endSearchSolutionsResponse

const fs = require("fs");

// import properties
const properties = require("../properties");
const proto = properties.proto;

endSearchSolutions = function(sessionVar) {
  return new Promise(function(fulfill, reject) {
    console.log("end search solutions for search", sessionVar.searchID);
    let endSearchSolutionsRequest = new proto.EndSearchSolutionsRequest();
    endSearchSolutionsRequest.setSearchId(sessionVar.searchID);

    properties.client.endSearchSolutions(
      endSearchSolutionsRequest,
      (err, endSearchSolutionsResponse) => {
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
      }
    );
  });
};

module.exports = endSearchSolutions;
