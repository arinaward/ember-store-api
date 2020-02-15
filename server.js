const http = require('http'); // Import http package
const app = require('./app'); // Import app.js file from current directory

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);