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

	/** Return all __links__ involving __(node.)id__ */
	var ls = function (id) { 
		//  _nodeSource is used as a callback (Net.add)_
		return links.filter(function (l) {return l.target == id || l.source == id;});
	};

	/** Return __nodes__ in group __g__ */
	var nsByGroup = function(g) {
		return nodes.filter(function (n) {return n.group == g;})
		};
		
	/** Initialize _this_ */
	var init = function(ns, ls) {
		nodes = ns;
		links = ls;
		nodes.forEach(function (n) {
			n.size = 0;
		});
		links.forEach(function (l) {
			n(l.source).size++;
			n(l.target).size++;
		})
		};
	
	/** Revealing module pattern */
	return {
		n: n,
		ls: ls,
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