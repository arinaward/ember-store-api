const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  description: String,
  img_src: String,
  available_quantity: Number
});

module.exports = mongoose.model("Product", productSchema);
