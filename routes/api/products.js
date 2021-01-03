var express = require("express");
var router = express.Router();
var validate = require("../../middlewares/validateProduct");
var auth = require("../../middlewares/auth");
var admin = require("../../middlewares/admin");
var { Product } = require("../../models/product");

var multer = require("multer");
var cldnryConfig = require("../../config/cloudinary.json");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: cldnryConfig.cloudName,
  api_key: cldnryConfig.apiKey,
  api_secret: cldnryConfig.apiSecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: {
    folder: "insta",
    // allowedFormats: ["png"],
    // transformation: [{ width: 30, height: 30, crop: "limit" }],
  },
});
const parser = multer({ storage: storage });

router.get("/", async function (req, res, next) {
  console.log(req.user);
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let products = await Product.find().skip(skipRecords).limit(perPage);
  let total = await Product.find().countDocuments();
  res.send({ total, products });
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

router.put("/:id", validate, auth, admin, async function (req, res, next) {
  let product = await Product.findById(req.params.id);
  product.name = req.body.name;
  product.price = req.body.price;
  await product.save();
  res.send(product);
});

router.delete("/:id", auth, admin, async function (req, res, next) {
  let product = await Product.findByIdAndDelete(req.params.id);

  res.send(product);
});

router.post("/", parser.single("image"), async function (req, res, next) {
  let product = new Product();
  product.name = req.body.name;
  product.price = req.body.price;
  product.category = req.body.category;
  product.imageUrl = req.file.path;
  product.details = req.body.details;
  await product.save();
  res.send(product);
});

module.exports = router;
