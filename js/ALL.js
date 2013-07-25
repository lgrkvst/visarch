var ALL = function () {
	var nodes = [], links = [];
	return {
		n: function (id) { // return node by id
			var i=0;
			while (id != ALL.nodes[i].id) {
				i++;
			}
			return ALL.nodes[i];
		},
		nByName: function (name) { // return first node by (case-insensitive) name
			var i=0; while (name.toLowerCase() != ALL.nodes[i].name.toLowerCase()){i++;} return ALL.nodes[i];
		},
		l: function (id) { // returns all links involving (node.)id
			return ALL.links.filter(function (l) {return ALL.nodes[l.target].id == id || ALL.nodes[l.source].id == id;});
		},
		node2links: function(n) {
			return ALL.l(n.id).map(function (n) {return {"source":ALL.nodes[n.source].id, "target":ALL.nodes[n.target].id};});
		},
		nsByCompartment: function(c) {
			return ALL.nodes.filter(function (n) {return n.compartment == c;})
		}
	}
}();
