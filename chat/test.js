var assert = require('assert');
var request = require('supertest');
var io = require('socket.io-client');

var server = require('./app.js');
var appUrl = 'http://localhost:' + server.address().port;

var ioOptions ={
  transports: ['websocket'],
  'force new connection': true
};

describe('Chat App', function() {
  var client1, client2;

  beforeEach(function(done) {
    client1 = io.connect(appUrl, ioOptions);
    client1.on('connect', done);
  });

  it('should announce new users', function(done) {
    client1.once('new user', function(data) {
      assert.equal(data, 'New user joined!');
      done();
    });
    client2 = io.connect(appUrl, ioOptions);
  });

  it('should broadcast messages to other users', function(done) {
    client1.once('message', function(data) {
      assert.deepEqual(data, {text: 'Do you see me?'});
      done();
    });

    client2 = io.connect(appUrl, ioOptions);
    client2.once('connect', function() {
      client2.emit('message', 'Do you see me?');
    });
  });

  it('should let users register a username', function(done) {
    client1.once('message', function(data) {
      assert.deepEqual(data, {username: 'brodude232', text: 'yo bro'});
      done();
    });

    client2 = io.connect(appUrl, ioOptions);
    client2.once('connect', function() {
      client2.emit('username', 'brodude232');
      client2.emit('message', 'yo bro');
    });
  });

  it('should let users create and join rooms', function(done) {
    client1.once('message', function(data) {
      assert.deepEqual(data, {text: 'yo bro'});
      done();
    });

    client2 = io.connect(appUrl, ioOptions);
    client2.once('connect', function() {
      // Implicit creation when joining a non-existent room.
      client2.emit('room', 'coolpeople');
      client1.emit('room', 'coolpeople');

      client2.emit('message', {text: 'yo bro'});
    });
  });
});
