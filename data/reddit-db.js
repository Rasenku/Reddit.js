/* Mongoose Connection */
const mongoose = require("mongoose");
const assert = require("assert");

const url = "mongodb://localhost/reddit-db";
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://localhost/reddit-db",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to database");

    // turn on for testing
    // db.close();
  }
);
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection Error:"));
mongoose.set("debug", true);

module.exports = mongoose.connection;
