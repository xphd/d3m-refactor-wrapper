const grpc = require("grpc");
const appRoot = require("app-root-path");
const PROTO_PATH = appRoot + "/lib/js/protos/v2018.7.7/core.proto";

const properties = {
  evaluationConfig: null,
  client: null,
  proto: grpc.load(PROTO_PATH),
  sessionVar: {
    ta2Ident: null,
    connected: false,
    solutions: new Map(),
    //produceSolutionRequests: [],
    //solutionResults: [],
    // NIST eval plan: only ranks 1-20 are considered (lower is better)
    rankVar: 20
  },

  userAgentTA3: "TA3-TGW",
  grpcVersion: "2018.7.7",
  allowed_val_types: [1, 2, 3]
};

module.exports = properties;
