const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  customer_name: { type: String, required: true },
  customer_phone: { type: Number, required: true },
  products: {},
  products_count: { type: Number },
  date_time: {},
  total_price: { type: Number },
  address: { type: String, required: true }
});

module.exports = mongoose.model("Order", orderSchema);
