// This backend is used to work with vue frontend
// it reads files in the folder of "responses" and send wanted infors to frontend

"use strict";
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

console.log("Server listening 9090");
// server.listen(9090);
// const socket = socketIO(server, { origins: "*:*" });
// socket.on("connection", () => {
//   console.log("Server: socket connected!!");
//   socket.emit("connected", "Hello from server");
// });

const folder = "./responses/describeSolutionResponses/";
const descriptionPathList = [];
fs.readdirSync(folder).forEach(file => {
  descriptionPathList.push(file);
  //   console.log(file);
});
// console.log("descriptiongs");
// console.log(descriptions[0]);

const descriptionPath = descriptionPathList[0];

const descriptionStr = fs.readFileSync(folder + descriptionPath, "utf8");
// console.log(description);
const descriptionJSON = JSON.parse(descriptionStr);

console.log(
  descriptionJSON["pipeline"]["steps"][0]["primitive"]["primitive"]["name"]
);
