var http = require('http');
var seaport = require('seaport');
var express = require('express');

// Connect to Seaport server/router
var ports = seaport.connect('localhost', 5001);

var app = express();
var server = http.createServer(app);

app.use(express.bodyParser());

// Show image upload form
app.get('/upload', function(req, res) {
    var form = '<form method="post" enctype="multipart/form-data">'
	+ '<p>Image: <input type="file" name="image" /></p>'
	+ '<p><input type="submit" value="Upload" /></p>'
	+ '</form>';
    res.send(form);
    res.end();
});

// Handle image uploads
app.post('/upload', function(req, res) {
    // Show the user what they sent. *hint* this is where you save it.
    res.send('You just sent ' + JSON.stringify(req.files));
});

// Connect to Seaport server
server.listen(ports.register('upload@1.0.0'));

module.exports = server;