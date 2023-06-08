const path = require("path");

const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Product = require("../models/product-model");
const Errors = require("../errors");

exports.getAllProducts = async (req, res, next) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products });
};

exports.getSingleProductReviews = (req, res, next) => {
  res.send("getSingleProductReviews");
};

exports.getSingleProduct = async (req, res, next) => {
  const { productId } = req.params;

  // TODO: Add this check as a method on the product model
  const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);
  if (!isValidObjectId) {
    throw new Errors.BadRequestError(`Invalid product Id: ${productId}`);
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Errors.NotFoundError(`Product with ${productId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ product });
};

exports.createProduct = async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ product: newProduct });
};

exports.uploadImage = (req, res, next) => {
  res.status(StatusCodes.OK).json({
    msg: "Successfully uploaded image",
    imagePath: path.join("src", "uploads", req.file.filename),
  });
};

exports.updateProduct = async (req, res, next) => {
  const { productId } = req.params;

  const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);
  if (!isValidObjectId) {
    throw new Errors.BadRequestError(`Invalid product Id: ${productId}`);
  }

  const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(StatusCodes.OK).json({ product: updatedProduct });
};

exports.deleteProduct = async (req, res, next) => {
  const { productId } = req.params;

  const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);
  if (!isValidObjectId) {
    throw new Errors.BadRequestError(`Invalid product Id: ${productId}`);
  }

  await Product.findByIdAndDelete(productId);

  res
    .status(StatusCodes.OK)
    .json({ msg: `Product with id "${productId}" successfully deleted` });
};
