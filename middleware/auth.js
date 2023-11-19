const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const [bearer, token] = authHeader.split(" ", 2);
    if (bearer !== "Bearer") {
      return res.send({ message: "Not authorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.send({ message: "Not authorized" });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.send({ message: "Not authorized" });
  }
};

module.exports = isAuth;
