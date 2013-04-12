var proxy = require('http-proxy');
var seaport = require('seaport');

// Start Seaport server.
var ports = seaport.createServer();
ports.listen(5001);

// Route incoming requests to different services.
var server = proxy.createServer(function (req, res, proxy) {
    // Get first part of URL;
    var service = req.url.split('/')[1];

    // Default to gallery
    if(service == '') service = 'gallery';

    // Query seaport for services.
    var services = ports.query(service + '@1.0.x');

    // No services found :(
    if (services.length === 0) {
	res.statusCode = 404;
        res.end(service + ' not available\n');
    } else {
	// Route to first service in array.
        proxy.proxyRequest(req, res, services[0]);
    }
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