var fs = require('fs');
var http = require('http');
var async = require('async');
var assert = require('assert');
var request = require('supertest');
var seaport = require('seaport');

var server = require('./router.js');
var gallery = require('./gallery.js');
var upload = require('./upload.js');

// Connect to Seaport server/router
var ports = seaport.connect('localhost', 5001);

describe('Image-Host', function() {
  it('should save image uploads', function(done) {
    request(server)
      .post('/upload')
      .attach('image', 'test.png')
      .expect(200)
      .end(function(err, res) {
	if(err) done(err);
	fs.readdir('uploads', function(err, images) {
	  assert(images.indexOf('test.png') >= 0);
	  done();
	});
      });
  });

  it('should show uploaded images', function(done) {
    request(server)
      .post('/upload')
      .attach('image', 'test.png')
      .end(function(err, res) {
	if(err) done(err);
	request(server)
	  .get('/')
	  .expect(200)
	  .expect(/test.png/, done);
      });
  });

  it('should round-robing between services', function(done) {
    var visited = 0;
    var tester = http.createServer(function(req, res) {
      visited++;
      res.end();
    });

    tester.listen(ports.register('gallery@1.0.1'));

    async.times(4, function(n, next) {
      request(server)
	.get('/gallery')
	.end(next);
    }, function(err) {
      assert.equal(visited, 2);
      done(err);
    });
  });
});
