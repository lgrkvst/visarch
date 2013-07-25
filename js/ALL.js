var ALL = (function () {
	var _this;
	var nodes = [], links = [];
	var seek = function(key, val) {
		var i = 0;
		while (val != nodes[i]["key"] && nodes[++i]);
		return nodes[i];
	}
	return {
		n: function (id) { // return node by id
			var i=0;
			while (id != nodes[i].id && nodes[++i]);
			return nodes[i];
		},
		nByName: function (name) { // return first node by (case-insensitive) name
			var i=0, name = name.toLowerCase();
			while (name != nodes[i].name.toLowerCase() && nodes[++i]);
			return nodes[i];
		},
		l: function (id) { // return all links involving (node.)id
			return links.filter(function (l) {return nodes[l.target].id == id || nodes[l.source].id == id;});
		},
		node2links: function (n) { // return n's neighbors
			/*  node2links is used as a callback (Net.addNode), thus loosing its 'this' scope.
			 	Here's a work-around. Seems I must set _this from init though (tried declaring by var ALL = (...).call({}) - no luck there) */
			return _this.l(n.id).map(function (n) {return {"source":nodes[n.source].id, "target":nodes[n.target].id};});
		},
		nsByCompartment: function(c) {
			return nodes.filter(function (n) {return n.compartment == c;})
		},
		init: function(ns, ls) {
			nodes = ns;
			links = ls;
			_this = this;
		}
	}
})();
