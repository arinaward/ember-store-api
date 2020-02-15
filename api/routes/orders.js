const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const async = require("async");

const Order = require("../models/order");
const Product = require("../models/product");

// Handling incoming GET requests to /orders

router.get("/", (req, res) => {
  Order.find()
    .select("-__v")
    .then(docs => {
      res.status(200).json({
        orders: docs.map(doc => {
          return {
            _id: doc.id,
            customer_name: doc.customer_name,
            customer_phone: doc.customer_phone,
            address: doc.address,
            date_time: doc.date_time,
            total_price: doc.total_price,
            products_count: doc.products_count,
            products: doc.products,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

// Handling incoming POST requests to /orders

router.post("/", async (req, res) => {
  try {
    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      customer_name: req.body.order.customer_name,
      customer_phone: req.body.order.customer_phone,
      address: req.body.order.address,
      date_time: req.body.order.date_time,
      total_price: req.body.order.total_price,
      products_count: req.body.order.products_count,
      products: req.body.order.products
    });
    let newOrder = await order.save();

    async.eachSeries(
      newOrder.products,
      function updateObject(obj, done) {
        Product.update(
          { _id: obj.id },
          { $set: { available_quantity: obj.available_quantity } },
          done
        );
      },
      function allDone(err) {
        // This will be called when all the updates are done or an error occurred during the iteration
        if (err) {
          throw new Error("Something went wrong.");
        }
        res.status(201).json({
          order: {
            id: newOrder.id,
            customer_name: newOrder.customer_name,
            customer_phone: newOrder.customer_phone,
            date_time: newOrder.date_time
          }
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      message: "Bad request",
      error: err
    });
  }
});

// Handling incoming GET requests to /orders/:orderId

router.get("/:orderId", (req, res) => {
  Order.findById(req.params.orderId)
    .populate("product")
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Order doesn't exist",
        error: err
      });
    });
});

// Handling incoming DELETE requests to /orders/:orderId

router.delete("/:orderId", (req, res) => {
  Order.remove({ _id: req.params.orderId })
    .then(result => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders/",
          body: { productId: "ID", ordered_quantity: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
