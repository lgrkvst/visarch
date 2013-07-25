var ALL = (function () {
	var nodes = [], links = [];

	var n = function (id) { // return node by id
		var i=0;
		while (id != nodes[i].id && nodes[++i]);
		return nodes[i];
		};
	var nByName = function (name) { // return array of nodes by (case-insensitive) name
		name = name.toLowerCase();
		return nodes.filter(function(n){return n.name.toLowerCase()==name;});
		};
	var l = function (id) { // return all links involving (node.)id
		return links.filter(function (l) {return nodes[l.target].id == id || nodes[l.source].id == id;});
		};
	var node2links = function (n) { // return n's neighbors
		/*  node2links is used as a callback (Net.addNode) */
		var match =  l(n.id).map(function (n) {return {"source":nodes[n.source].id, "target":nodes[n.target].id};});
return match
		var arr = {};
		for ( var i=0; i < match.length; i++ )
		    arr[match[i]['source']] = match[i];
		match = new Array();
		for ( key in arr )
		    match.push(arr[key]);
		return match;
		};
	var nsByCompartment = function(c) {
		return nodes.filter(function (n) {return n.compartment == c;})
		};
	var init = function(ns, ls) {
		nodes = ns;
		links = ls;
		};
	return {
		n:n,
		nByName: nByName,
		l: l,
		node2links: node2links,
		nsByCompartment: nsByCompartment,
		init: init
		}
})();
