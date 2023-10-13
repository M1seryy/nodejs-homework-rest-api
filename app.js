const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const mongoose = require("mongoose");
// mongoose.Promise = global.Promise;
require("dotenv").config();

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/contacts",
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

const uriDb = process.env.MONGO_DB_HOST;

//  mongoose
//   .connect(uriDb, {
//     useNewUrlParser: true,
//     // useCreateIndex: true,
//     useUnifiedTopology: true,
//   })
const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
});
connection
  .then(() => {
    app.listen(process.env.PORT, function () {
      console.log(`Server running. Use our API on port:${process.env.PORT}`);
    });
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`)
  );

module.exports = app;
