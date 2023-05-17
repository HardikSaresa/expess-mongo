const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const homerouter = require("./routers/homeRouter");
const port = process.env.port || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.listen(port);
app.use("/", homerouter);

// db connection
mongoose.connect(
  "mongodb+srv://<username>:<password>@<servername>.oclubrm.mongodb.net/<DBname>?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
const db = mongoose.connection;
db.on("error", () => {
  console.log("errr");
});
db.once("open", () => {
  console.log("connected to db");
});
