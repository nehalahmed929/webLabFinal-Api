var { validate } = require("../models/product");
var { User } = require("../models/user");
var jwt = require("jsonwebtoken");
var config = require("config");

async function auth(req, res, next) {
  let token = req.header("x-auth-token");
  if (!token) return res.status(400).send("Token not provided");
  try {
    let user = jwt.verify(token, config.get("jwtPrivateKey"));
    console.log(user);
    req.user = await User.findById(user._id);
  } catch (err) {
    res.status(401).send(err);
  }
  next();
}

module.exports = auth;
