var fs = require('fs');
var ALL = require('../js/ALL.js');
var Net = require('../js/Net.js');

Net.init(ALL.node2links);
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
									  
server.listen(3000, function () {
	console.log('%s listening at %s', server.name, server.url)
});

/* what are these? */

var graph;

fs.readFile('/Users/cla/github/visarch/json/nodes_links.json', function (err, data) {
  if (err) {
	  console.log(err);
  }
  graph = JSON.parse(data);
  ALL.init(graph.nodes, graph.links);  
});

server.get("/", function (req, res, next) {
	res.send(graph);
});

server.get('/name/:name', function (req, res, next) {
	var node = ALL.nByName(req.params.name);
	res.send(buildResponse(node[0]));
});

server.get('/id/:id', function (req, res, next) {
	var node = ALL.n(req.params.id);
	res.send(buildResponse(node));
});










function buildResponse(node) {
	Net.supernova(node.id)
	var outgoing = [];
	var incoming = [];
	var neighbor_links = Net.links.filter(function (l) {return Net.nodes[l.target].id == node.id || Net.nodes[l.source].id == node.id;});
	neighbor_links.forEach(function(n) {
		if (Net.nodes[n.source].id == node.id) {
			outgoing.push({
				"node": {
					"name":Net.nodes[n.target].name,
					"id":Net.nodes[n.target].id
				},
				"name": n.name,
				"type": n.type,
				"description": n.description
			});
		}
		else if (Net.nodes[n.target].id == node.id) {
			incoming.push({
				"name": Net.nodes[n.source].name,
				"type": n.type,
				"description": n.description
			});
		}
	});
	
	return {
		"node":node,
		"links":{
			"outgoing": outgoing,
			"incoming": incoming
		}
	};
}










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