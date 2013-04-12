# Image-Host App
A distributed and fault-tolerant image hosting app. It has an image upload page and a gallery page, both backed by their own service. Using [Seaport](https://github.com/substack/seaport) as a service registry we can coordinate and route between the services easily!

## Installation
You'll need [Node.js](http://nodejs.org/)
Install dependencies and run the server.
```bash
$ npm install
$ node app.js
> Running! Open http://localhost:8032 in a browser to see
```
To run the other services you will need to open more terminals and run them there.
```bash
$ node gallery.js
```
```bash
$ node upload.js
```

## Tests
```bash
$ npm test
```

## Todo
✓ Tests  
✗ Image uploads  
✗ Image display  
✗ Round-robin between services  
✗ Push service pushing new images to users  
