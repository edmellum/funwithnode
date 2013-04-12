var http = require('http');
var seaport = require('seaport');
var express = require('express');

// Connect to Seaport server/router
var ports = seaport.connect('localhost', 5001);

var app = express();
var server = http.createServer(app);

// Show image gallery
app.get('/', function(req, res) {
  var image = '<img src="http://nodejs.org/images/logo-light.png" />';
  res.send(image);
});

// Connect to Seaport server
server.listen(ports.register('gallery@1.0.1'));

module.exports = server;