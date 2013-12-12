// rendersvgtest.js
rendersvg = require("rendersvg");

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

		var readStream = fs.createReadStream(infile);
		var writeStream = fs.createWriteStream(outfile);
            
		rendersvg(readStream, writeStream, null, function() {
			 console.log('rendering callback');
			//callback();
    
		});
            

 		rendersvg(body, outfile);



		console.log(outfile);
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
