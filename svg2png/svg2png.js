// svg2png.js
var path = require("path");
var execFile = require("child_process").execFile;

var phantomjsCmd = path.resolve(__dirname, "../node_modules/svg2png/node_modules/phantomjs/bin/phantomjs");
var converterFileName = path.resolve(__dirname, "../node_modules/svg2png/lib/converter.js");

function svgToPng(sourceFileName, destFileName, scale, cb) {
    if (typeof scale === "function") {
        cb = scale;
        scale = 1.0;
    }
    var args = [phantomjsCmd, converterFileName, sourceFileName, destFileName, scale];
	console.log(__dirname);
    execFile(process.execPath, args, function (err, stdout, stderr) {

        if (err) {
            cb(err);
        } else if (stdout.length > 0) { // PhantomJS always outputs to stdout.
			console.log("got here");
            cb(new Error(stdout.toString().trim()));
        } else if (stderr.length > 0) { // But hey something else might get to stderr.
			console.log("got here");
            cb(new Error(stderr.toString().trim()));
        } else {
			console.log("got here");
            cb(null);
        }
    });
};

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
	response.setHeader('Access-Control-Allow-Origin', request.headers['origin']);
	var body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	var query = require('url').parse(request.url,true).query;
	body += "<?xml-stylesheet type=\"text/css\" href=\"../../css/themes/"+query.t+"/theme.css\" ?>";
	body += "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">";
  request.on('data', function (chunk) {
    body += chunk;
  });
  request.on('end', function () {
		var success = true;
		var filename = "convert/" + (new Date()).getTime();
		var infile = filename + ".svg";
		var outfile = filename + ".png";
		fs.writeFileSync(infile, body);
 		svgToPng(infile, outfile, 2, function (err) {
			// PNGs for everyone!
    		success = false;
    		console.log(err);
			});
			
		if (success) {
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.end(outfile);
		}
  });
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(3000);

// Put a friendly message on the terminal
console.log("Server is running at http://127.0.0.1:3000/");
