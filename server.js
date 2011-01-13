var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

var getContentType = (function() {
  var filetypes = {
    js: 'application/x-javascript',
    html: 'text/html',
    txt: 'text/plain'
  };

  return function(filename) {
    var extension = filename.split('.').pop();
    var filetype = filetypes[extension];
    if (!filetype) throw 'error: unknown extension: ".'+extension+'"';
    return filetype;
  }
})();

function passError(response, err) {
  response.writeHead(500, {'Content-Type': 'text/plain'});
  response.write(err);
  response.end();
}

http.createServer(function(request, response) {
  var uri = url.parse(request.url).pathname;
  var requestPathParts = uri.split('/');
  requestPathParts.shift();
  var requestType = requestPathParts.shift();
  if (requestType=='static') {
    var filename = path.join(process.cwd()+'/frontend', uri.substr('/static/'.length));
    fs.stat(filename, function(err, stats) {
      if (err||!stats.isFile()) {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write('file not found');
        response.end();
        return;
      }

      fs.readFile(filename, "binary", function(err, file) {
        if (err) {
          passError(response, err);
          return;
        }

        response.writeHead(200, {
          'Content-Type': getContentType(filename),
          'Content-Length': stats.size
        });
        response.write(file, 'binary');
        response.end();
      });
    });
  } else {
    response.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    response.write('unknown requestType:'+requestType);
    response.end();
  }
}).listen(8080);
