const express = require("express");
const app = express();

// Serve up static files from /public
app.use(express.static("public"));

// index.html is the main page the game is loaded on
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

// Serve up an un-minified Phaser direct from node_modules for development
app.get("/phaser.js", function(request, response) {
  response.sendFile(__dirname + "/node_modules/phaser/dist/phaser.js");
});

// When you're not actively developing, use the minified Phaser to reduce load times.
app.get("/phaser.min.js", function(request, response) {
  response.sendFile(__dirname + "/node_modules/phaser/dist/phaser.min.js");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
