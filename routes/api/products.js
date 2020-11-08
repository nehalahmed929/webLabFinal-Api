var express = require("express");
var router = express.Router();
var validate = require("../../middlewares/validateProduct");
var auth = require("../../middlewares/auth");
var admin = require("../../middlewares/admin");
var { Product } = require("../../models/product");

router.get("/", auth, admin, async function (req, res, next) {
  console.log(req.user);
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let product = await Product.find().skip(skipRecords).limit(perPage);
  res.send(product);
});

router.get("/:id", async function (req, res, next) {
  try {
    let product = await Product.findById(req.params.id);
    if (!product)
      return res.status(400).send("product with given id is not present");
    return res.status(200).send(product);
  } catch (err) {
    res.status(400).send("invalid id");
  }
});

router.put("/:id", validate, async function (req, res, next) {
  let product = await Product.findById(req.params.id);
  product.name = req.body.name;
  product.price = req.body.price;
  await product.save();
  res.send(product);
});

router.delete("/:id", async function (req, res, next) {
  let product = await Product.findByIdAndDelete(req.params.id);

  res.send(product);
});

router.post("/", validate, async function (req, res, next) {
  let product = new Product();
  product.name = req.body.name;
  product.price = req.body.price;
  await product.save();
  res.send(product);
});

module.exports = router;
