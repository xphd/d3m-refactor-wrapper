// import variables
const properties = require("../properties");
const proto = properties.proto;

listPrimitives = function() {
  return new Promise(function(fulfill, reject) {
    console.log("connectionString:", connectionString);
    const connectionString = dynamic.connectionString;
    const client = new proto.Core(
      connectionString,
      grpc.credentials.createInsecure()
    );

    dynamic.client = new proto.Core(
      connectionString,
      grpc.credentials.createInsecure()
    );

    let request = new proto.ListPrimitivesRequest();
    client.listPrimitives(request, (error, response));
  });
};

module.exports = listPrimitives;
