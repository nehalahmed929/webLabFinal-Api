var { validate } = require("../models/product");

function validateProduct(req, res, next) {
  console.log(req.body);
  let { error } = validate(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}

module.exports = validateProduct;
