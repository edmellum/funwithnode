var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

// Serve static files from ./public
app.use(express.static(__dirname + '/public'));

// Quiet you.
io.set('log level', 1);

// Store users.
var users = [];

// Listen for Socket.IO connections
io.sockets.on('connection', function (socket) {
  // Add new user to the list.
  users.push(socket.id);

  // Emit one event to one client.
  socket.emit('news', { hello: 'world' });

  // Listen for events from the client.
  socket.on('my other event', function (data) {
    // Broadcast something
    io.sockets.emit('broad', 'broadcastin stuff!');

    // Log the pretty data to the console.
    console.log(data);
  });
});


// Check if we are testing
if(require.main === module) {
  // Not testing, spin it up!
  server.listen(8023);
  var appUrl = 'http://localhost:' + server.address().port;
  console.log('Running! Open ' + appUrl + ' in a browser to see');
} else {
  server.listen(8045);
  // Let our tests get at our server.
  module.exports = server;
}