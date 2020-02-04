const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

require("./config/passport")(passport);
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); //Parses JSON in body of requests
app.use(express.urlencoded({ extended: false }));
app.use(cors()); //Cross Origin Allow

//Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

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
const usersRouter = require("./routes/users");

app.use("/", require("./routes/index"));
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server started up on ${PORT}...`);
});
