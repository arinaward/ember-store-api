# ember-store-api

Simple REST API for an Online shopping store: https://github.com/arinabarnett/ember-store. Built with Node.js, Express and MongoDB. 

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Express](https://expressjs.com/)
* [Mongoose](https://mongoosejs.com/)

## API Methods

Products

* GET '/products' - get the list of all products from DB
* POST '/products' - add your own products to the DB (Each product should have the following properties: name, price, description, img_src: "url-of-the-image", available_quantity)
* GET '/products/:productId' - get a product by id
* PATCH '/products/:productId' - change the specific prouct's property
* DELETE '/products/:productId' - remove the product from DB 

Orders 

* GET '/orders' - get the list of all orders from DB
* POST '/orders' - add a new order to the DB
* GET '/orders/:orderId' - get an order by id
* DELETE '/orders/:orderId' - remove the order from DB 

## Installation

* `git clone <repository-url>` this repository
* `cd ember-store-api`
* `npm install`

## Running / Development

* `npm start`
* Visit your app at [http://localhost:3000](http://localhost:3000).
