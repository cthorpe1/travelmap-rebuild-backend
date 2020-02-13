const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json()); //Parses JSON in body of requests
app.use(express.urlencoded({ extended: false }));
app.use(cors()); //Cross Origin Allow

//DB Connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

app.listen(PORT, () => {
  console.log(`Server started up on ${PORT}...`);
});
