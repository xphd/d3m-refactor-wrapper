// // searchSolutionsResponse
// // getSearchSolutionsResultsResponse
// const fs = require("fs");

// // import variables
// const properties = require("../properties");
// const static = properties.static;
// const dynamic = properties.dynamic;
// // static variables
// const proto = static.proto;
// const userAgentTA3 = static.userAgentTA3;
// const grpcVersion = static.grpcVersion;
// const allowed_val_types = static.allowed_val_types;
// // import functions
// const getMappedType = require("../functions/getMappedType");
// const getProblemSchema = require("../functions/getProblemSchema");
// const handleImageUrl = require("../functions/handleImageUrl");
// // import mappings
// const metric_mappings = require("../mappings/metric_mappings");
// const task_subtype_mappings = require("../mappings/task_subtype_mappings");
// const task_type_mappings = require("../mappings/task_type_mappings");

// listPrimitives = function() {
//   return new Promise(function(fulfill, reject) {
//     console.log("connectionString:", connectionString);
//     const connectionString = dynamic.connectionString;
//     const client = new proto.Core(
//         connectionString,
//         grpc.credentials.createInsecure()
//       );

//     dynamic.client = new proto.Core(
//       connectionString,
//       grpc.credentials.createInsecure()
//     );

//     let request = new proto.ListPrimitivesRequest();
//     client.listPrimitives(request. (error, response))
//   });
// };

// module.exports = listPrimitives;
