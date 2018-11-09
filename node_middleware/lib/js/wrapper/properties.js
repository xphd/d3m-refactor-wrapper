const properties = {
  client: null,
  proto: null,
  sessionVar: {
    ta2Ident: null,
    connected: false,
    solutions: new Map(),
    //produceSolutionRequests: [],
    //solutionResults: [],
    // NIST eval plan: only ranks 1-20 are considered (lower is better)
    rankVar: 20
  },
  staticVar: {
    userAgentTA3: "TA3-TGW",
    grpcVersion: "2018.7.7",
    allowed_val_types: [1, 2, 3]
  }
};

module.exports = properties;
