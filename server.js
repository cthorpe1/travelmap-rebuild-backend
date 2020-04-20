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
  useUnifiedTopology: true,
  useFindAndModify: false
});
const connection = mongoose.connection;
try {
  connection.once("open", () => {
    console.log("MongoDB connection established successfully");
  });
} catch (e) {
  console.log(e);
}

//Routes
app.use("/users", require("./routes/users"));
app.use("/markers", require("./routes/markers"));
app.use("/photos", require("./routes/photos"));

app.listen(PORT, () => {
  console.log(`Server started up on ${PORT}...`);
});
