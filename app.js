const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require('dotenv').config();
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

// Connection to MongoDB Database

const mongodb_uri = process.env.MONGODB_URI || "mongodb+srv://arishilyaeva:" + process.env.MONGO_DB_PW + "@scluster-ftsg2.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(mongodb_uri,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS error-handling

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT, PATCH");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
