var mongoose = require("mongoose");
var joi = require("@hapi/joi");
var bcrypt = require("bcryptjs");
const { string } = require("@hapi/joi");

userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "user",
  },
});

userSchema.methods.genHashPass = async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

let User = mongoose.model("User", userSchema);

function validateUser(data) {
  const schema = joi.object({
    name: joi.string().min(3).max(10).required(),
    email: joi.string().email().min(3).required(),
    password: joi.string().min(8).required(),
  });
  return schema.validate(data, { abortEarly: false });
}

function validateUserLogin(data) {
  const schema = joi.object({
    email: joi.string().email().min(3).required(),
    password: joi.string().min(8).required(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.User = User;
module.exports.validateRegister = validateUser;
module.exports.validateLogin = validateUserLogin;
