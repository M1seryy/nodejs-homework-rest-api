const service = require("../../service/users/service");
const crypt = require("bcrypt");
const scheme = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const salt = await crypt.genSalt();
    const hashedPass = await crypt.hash(password, salt);
    const emailVerify = await scheme.findOne({ email });

    if (!emailVerify) {
      const response = await service.createUser({
        email,
        password: hashedPass,
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

module.exports = {
  current,
  register,
  login,
  logout,
};
