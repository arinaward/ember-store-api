const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

// Handling incoming GET requests to /products

router.get("/", (req, res) => {
  Product.find()
    .select("-__v") // Fetch only specific fields
    .exec()
    .then(docs => {
      const response = {
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc.id,
            description: doc.description,
            img_src: doc.img_src,
            available_quantity: doc.available_quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Handling incoming POST requests to /products

router.post("/", (req, res) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    img_src: req.body.img_src,
    available_quantity: req.body.available_quantity
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Successfully created product",
        createdProduct: {
          name: result.name,
          price: result.price,
          description: result.description,
          img_src: result.img_src,
          available_quantity: result.available_quantity,
          _id: result.id,
          request: {
            type: "POST",
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Handling incoming GET requests to /products/:productId

router.get("/:productId", (req, res) => {
  const id = req.params.productId;
  Product.findById(id)
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "No valid entry found in provided ID"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Handling incoming PATCH requests to /products/:productId

//  Request bosy should look like this: [{
//     "propName": "name of the property",
//     "value": "value to be changed"
// }]

router.patch("/:productId", (req, res) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Handling incoming DELETE requests to /products/:product

router.delete("/:productId", (req, res) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
