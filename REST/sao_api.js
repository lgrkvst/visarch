var fs = require('fs');
var ALL = require('../js/ALL.js');
var Net = require('../js/Net.js');
var nodes_links = require('../json/nodes_links.js');
// ---
var restify = require('restify');
 
var server = restify.createServer({ name: 'sao_rest',
									formatters: {
									  'application/json': myCustomFormatJSON
									}
	 								});

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())
									  
server.listen(3001, function () {
	console.log('%s listening at %s', server.name, server.url)
});

/* what are these? */

ALL.init(nodes_links.nodes, nodes_links.links);

server.get("/", function (req, res, next) {
	res.send(nodes_links);
});

server.get("/index", function (req, res, next) {
	var index = nodes_links.nodes.map(function (node) {
		return {"id": node.id, "name": node.name};
	});
	res.send(index);
});

server.get('/node', function (req, res, next) {
	res.send(nodes_links.nodes);
});

server.get('/node/id/:id', function (req, res, next) {
	res.send(ALL.n(decodeURIComponent(req.params.id)));
});

server.get('/group/id/:id', function (req, res, next) {
	res.send(ALL.nsByGroup(decodeURIComponent(req.params.id)));
});

server.get('/node/id/:id/links', function (req, res, next) {
	var id = decodeURIComponent(req.params.id);
	res.send(ALL.ls(id));
});






function myCustomFormatJSON(req, res, body) {
  if (!body) {
    if (res.getHeader('Content-Length') === undefined &&
        res.contentLength === undefined) {
      res.setHeader('Content-Length', 0);
    }
    return null;
  }

  if (body instanceof Error) {
    // snoop for RestError or HttpError, but don't rely on instanceof
    if ((body.restCode || body.httpCode) && body.body) {
      body = body.body;
    } else {
      body = {
        message: body.message
      };
    }
  }

  if (Buffer.isBuffer(body))
    body = body.toString('base64');

  var data = JSON.stringify(body, null, 2);

  if (res.getHeader('Content-Length') === undefined &&
      res.contentLength === undefined) {
    res.setHeader('Content-Length', Buffer.byteLength(data));
  }

  return data;
}