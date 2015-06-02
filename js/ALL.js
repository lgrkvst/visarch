/** __ALL__ is a simple utility closure, containing the entire nodes and links structure. It has a number of convenience methods for selecting nodes and links by name, id, group and neighbors.
 * 
 * @author Christian Lagerkvist [christian.lagerkvist@seb.se]
 */

/** @constant */
var ALL = (function () {
	/** Internal (private) representation of all __nodes__ and __links__ */
	var nodes = [], links = [];

	/** n selects __node__ from its __id__ */
	var n = function (id) {
		var i=0;
		while (id != nodes[i].id && nodes[++i]);
		return nodes[i];
		};
	
	/** Return __array_of_nodes__ by (case-insensitive) __name__ */
	var nByName = function (name) { 
		name = name.toLowerCase();
		return nodes.filter(function(n){return n.name.toLowerCase()==name;});
		};
	
	/** Return all __links__ involving __(node.)id__ */
	var l = function (id) { 
		return links.filter(function (l) {return nodes[l.target].id == id || nodes[l.source].id == id;});
		};

	/** Return __neighbouring_nodes__ by __id__ */
	var nodeSource = function (id) { 
		//  _nodeSource is used as a callback (Net.add)_
		return l(id).map(function (l) {return {"source":nodes[l.source], "target":nodes[l.target], "name": l.name, "type": l.type, "description": l.description};});
		};

	/** Return __nodes__ in group __g__ */
	var nsByGroup = function(g) {
		return nodes.filter(function (n) {return n.group == g;})
		};
		
	/** Initialize _this_ */
	var init = function(ns, ls) {
		nodes = ns;
		links = ls;
		};
	
	/** Revealing module pattern */
	return {
		n: n,
		nByName: nByName,
		l: l,
		nodeSource: nodeSource,
		nsByGroup: nsByGroup,
		init: init
		}
})();

/** Dual exposure - __ALL__ is also a REST module... */
if ((typeof module) === 'undefined') {
    window.ALL = ALL;
} else {
    module.exports = ALL;
}