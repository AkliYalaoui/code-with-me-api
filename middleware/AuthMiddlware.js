const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    let token;
    let payload;

    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      payload = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = payload._id;
      next();
    } else {
      return res.status(401).json({
        status: 401,
        message: "You are unauthorized, Bad Token",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: 401,
      message: "You are unauthorized, Bad Token",
    });
  }
};

module.exports = { protect };
