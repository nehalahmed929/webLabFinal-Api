var mongoose = require("mongoose");
var joi = require("@hapi/joi");

productSchema = mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  details: String,
  imageUrl: String,
});

let Product = mongoose.model("Product", productSchema);

function validateProduct(data) {
  const schema = joi.object({
    name: joi.string().min(3).max(100).required(),
    price: joi.number().min(0).required(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.Product = Product;
module.exports.validate = validateProduct;
