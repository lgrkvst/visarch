/** __config.js__ defines data sources for nodes and links. It has a number of convenience methods for selecting nodes and links by name, id, group and neighbors.
 * 
 * @author Christian Lagerkvist [christian.lagerkvist@seb.se]
 */

var nodes = function() {
	var index = [];
	var data = {
		"APP":
			{
			"name": "Applications",
			"tag": "APP",
			"api":
				{
					"index": "http://localhost:3001/index",
					"node": "http://localhost:3001/node/id/:id",
					"nodesInGroup": "http://localhost:3001/group/id/:id",
					"nodeLinks": "http://localhost:3001/node/id/:id/links"
				}
			}
		};
		
	// initialise search index for each source
	for (var tag in data) {
		// tag = type of node, for instance M_class_planet
		var source = data[tag]
		
		$.getJSON(source.api.index, function( data ) {
			$.each(data, function( i, o ) {
				index.push(jQuery.extend(true, o, {"tag" : tag}));
			});
		});
	}
	
	var id_into_str = function(str, id){
		return str.replace(":id", id);
	}
	
	var add = function(n) {
		$.getJSON(id_into_str(data[n.tag].api.node, n.id), function (node) {
			Net.add(node, function(){return [];});
		});
	}

	var getLinks = function(n) {
		$.getJSON(id_into_str(data[n.tag].api.node, n.id), function (node) {
			Net.add(node);
		});
	}

	
	return {
		data: data,
		index: index,
		add: add
	};
}();