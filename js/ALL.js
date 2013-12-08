/** __ALL__ is a simple utility closure, containing the entire nodes and links structure.
	It has a number of convenience methods for digging up nodes and links by name, id, compartment and neighbors. */

var ALL = (function () {
	/** Privates... */
	var nodes = [], links = [];

	/**
	 * n digs up a node from its id
	 *
	 * @param {String} id of node, e.g. "_j3kln2ln2lkn2kj31"
	 * @return {node} a node object
	 * @api public
	 */
	var n = function (id) {
		var i=0;
		while (id != nodes[i].id && nodes[++i]);
		return nodes[i];
		};
	
	// Return __array_of_nodes__ by (case-insensitive) __name__
	var nByName = function (name) { 
		name = name.toLowerCase();
		return nodes.filter(function(n){return n.name.toLowerCase()==name;});
		};
	
	// Return all __links__ involving __(node.)id__
	var l = function (id) { 
		return links.filter(function (l) {return nodes[l.target].id == id || nodes[l.source].id == id;});
		};

	// Return __neighbouring_nodes__ by __id__
	var node2links = function (id) { 
		//  _node2links is used as a callback (Net.addNode)_
		return l(id).map(function (l) {return {"source":nodes[l.source], "target":nodes[l.target], "name": l.name, "type": l.type, "description": l.description};});
		};

	// Return __nodes__ in compartment __c__
	var nsByCompartment = function(c) {
		return nodes.filter(function (n) {return n.compartment == c;})
		};
		
	// Initialize _this_
	var init = function(ns, ls) {
		nodes = ns;
		links = ls;
		};
	
	// Revealing module pattern
	return {
		n: n,
		nByName: nByName,
		l: l,
		node2links: node2links,
		nsByCompartment: nsByCompartment,
		init: init
		}
})();

if ((typeof module) === 'undefined') {
    window.ALL = ALL;
} else {
    module.exports = ALL;
}