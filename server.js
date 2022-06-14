require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const User = require("./models/user");

connect();
async function connect() {
  await mongoose.connect("mongodb://mongo:27017/fh-api", () => {
    console.log("Connected to MongoDB Database...");
    //run();
  });
}

const db = mongoose.connection;

app.use(express.json());

const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const resRouter = require("./routes/reservation");
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/reservation", resRouter);

app.listen(port, () => console.log("API is ready to use"));
