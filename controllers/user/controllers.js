const service = require("../../service/users/service");
const crypt = require("bcrypt");
const scheme = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const UserScheme = require("../../models/userModel");
const crypto = require("node:crypto");

const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const sendEmailHelper = require("../../helpers/sendEmail");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (email) {
      const salt = await crypt.genSalt();
      const hashedPass = await crypt.hash(password, salt);
      const emailVerify = await scheme.findOne({ email });

      if (!emailVerify) {
        const verificationToken = crypto.randomUUID();

        await sendEmailHelper({
          to: email,
          subject: "Verification email sent",
          html: `Reg confirm <a href=http://localhost:3001/api/users/verify/${verificationToken}>Link</a>`,
          text: `Reg confirm http://localhost:3001/api/users/verify/${verificationToken}`,
        });

        const response = await service.createUser({
          email,
          password: hashedPass,
          verificationToken,
        });
        res.status(201).json({
          email: response.email,
          password: response.password,
        });
      } else {
        res.status(409).json({
          message: "Email in use",
        });
      }
    } else {
      res.status(400).json({
        message: "No email",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 400,
      message: "400 Bad Request",
    });
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const user = await scheme.findOne({ email });
      if (user === null) {
        return res.status(401).send({ message: "Email or password is wrong" });
      }

      const isValidPass = await crypt.compare(password, user.password);

      if (!isValidPass) {
        return res.json({
          status: 401,
          message: "Email or password is wrong",
        });
      }

      if (user.verify === false) {
        return res
          .status(401)
          .send({ message: "Your accaunt is not verified" });
      }

      const token = jwt.sign(
        { _id: user._id, email: user.email, subscription: user.subscription },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.send({ user, token });
    }
    return res.json({
      status: 401,
      message: "Email or password is wrong",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await scheme.findByIdAndUpdate(req.user._id, { token: null });
    res.status(204).end();
  } catch (error) {
    console.log(error);
    next();
  }
};

const current = async (req, res, next) => {
  const data = req.user;
  if (!data) {
    return res.send({ message: "Not authorized" });
  }
  res.send(data);
};

const patchImg = async (req, res, next) => {
  const uploadDir = path.join(__dirname, "../../public/avatars/");
  try {
    if (req.file) {
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
    } else {
      return res.json({
        status: 404,
        message: "Picture not found",
      });
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const verify = async (req, res, next) => {
  const { verifyToken } = req.params;
  try {
    const user = await UserScheme.findOne({
      verificationToken: verifyToken,
    }).exec();
    if (user === null) {
      return res.status(404).send({ message: "Not found" });
    }

    await UserScheme.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });
    return res.send({ message: "Email confirmed" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  current,
  register,
  login,
  logout,
  patchImg,
  verify,
};
