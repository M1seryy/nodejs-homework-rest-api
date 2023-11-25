const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const UserScheme = require("./models/userModel");

const contactsRouter = require("./routes/api/contacts");
const userRouter = require("./routes/api/users");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const mongoose = require("mongoose");
const isAuth = require("./middleware/auth");
const upload = require("./middleware/upload");
const Jimp = require("jimp");
// mongoose.Promise = global.Promise;
require("dotenv").config();

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// const storeImage = path.join(process.cwd(), "images");

app.use("/api/contacts", isAuth, contactsRouter);
app.use("/api/users", userRouter);

app.patch(
  "/uploads",
  isAuth,
  upload.single("picture"),
  async (req, res, next) => {
    const uploadDir = path.join(__dirname, "public/avatars/");
    try {
      Jimp.read(req.file.path, async function (err, image) {
        if (err) throw err;
        image
          .resize(250, 250)
          .quality(50)
          .write(uploadDir + req.file.originalname);
        await fs.rename(req.file.path, uploadDir + req.file.originalname);

        const result = await UserScheme.findByIdAndUpdate(
          req.user._id,
          { avatar: req.file.originalname },
          { new: true }
        ).exec();
        if (result === null) {
          res.status(404).send({
            message: "User not found",
          });
        }
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
);
app.use(
  "/users/avatar",
  isAuth,
  express.static(path.join(__dirname, "/public/avatars"))
);
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
