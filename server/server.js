// Set up
var express = require("express");
var app = express(); // create our app w/ express
var mongoose = require("mongoose"); // mongoose for mongodb
var morgan = require("morgan"); // log requests to the console (express4)
var bodyParser = require("body-parser"); // pull information from HTML POST (express4)
var methodOverride = require("method-override"); // simulate DELETE and PUT (express4)
var cors = require("cors");

// Configuration
const MONGO_PWD = "1EkPVmBj45uclfkF";
const MONGO_URI =
  "mongodb+srv://labmember:h!ekataKen@cluster0-n2ecu.mongodb.net/test?retryWrites=true&w=majority";
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    //useMongoClient: false
  })
  .then(() => {
    console.log("mongoose atlas was successful");
  })
  .catch(err => {
    console.log(err);
  });
//mongoose.connect("mongodb://localhost:27017/meeting");

/* mongoose.connection.on("error", error => {
  console.log(error);
}); */

app.use(morgan("dev")); // log every request to the console
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Models
var Transcript = mongoose.model("Transcript", {
  meetingId: String,
  userId: String,
  scriptMsg: String
});

// Routes

// Get transcripts
app.get("/api/transcripts", function(req, res) {
  console.log("fetching transcripts");

  // use mongoose to get all transcripts in the database
  Transcript.find(function(err, transcripts) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(transcripts); // return all transcripts in JSON format
  });
});

// create transcript and send back all transcripts after creation
app.post("/api/transcripts", function(req, res) {
  console.log("creating transcript");

  // create a transcript, information comes from request from Ionic
  Transcript.create(
    {
      meetingId: req.body.meetingId,
      userId: req.body.userId,
      scriptMsg: req.body.scriptMsg,
      done: false
    },
    function(err, transcript) {
      if (err) res.send(err);

      // get and return all the transcripts after you create another
      Transcript.find(function(err, transcripts) {
        if (err) res.send(err);
        res.json(transcripts);
      });
    }
  );
});

// delete a transcript
app.delete("/api/transcripts/:review_id", function(req, res) {
  Transcript.remove(
    {
      _id: req.params.review_id
    },
    function(err, transcript) {}
  );
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
