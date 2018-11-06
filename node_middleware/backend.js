// This backend is used to work with vue frontend
// it reads files in the folder of "responses" and send wanted infors to frontend

"use strict";
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const fs = require("fs");
const app = express();

const server = http.createServer(app);
const serverSocket = socketIO(server, { origins: "*:*" });

console.log("Server listening 9090");
server.listen(9090);

const folder = "./responses/describeSolutionResponses/";
const descriptionPathList = [];
fs.readdirSync(folder).forEach(file => {
  descriptionPathList.push(file);
  //   console.log(file);
});

const descriptionPath = descriptionPathList[0];

const descriptionStr = fs.readFileSync(folder + descriptionPath, "utf8");

const descriptionJSON = JSON.parse(descriptionStr);

const steps = descriptionJSON["pipeline"]["steps"];
console.log(steps.length);

serverSocket.on("connection", socket => {
  console.log("Server: socket connected!!");
  socket.on("requestFlowchart", () => {
    console.log("Server: responseFlowchart");
    // console.log(steps.length);
    socket.emit("responseFlowchart", steps);
  });
});
