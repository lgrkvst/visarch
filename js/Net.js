var Net = (function () {
	/*** Captain's log
	 *
	 *
	 */

	var nodes = [], links = [], center = [], node2links;
	
	var determineCenter = function () {
		center = Net.nodes.map(function(n) {return ix(n.id);});
		if (center.length>3) {
			center.sort(function(a,b) { return (nodes[a].weight > nodes[b].weight) ? -1 : 1; });
			center.splice(3, center.length - 3);
			}
	};
	var getCenter = function () {
		var x = y = 0;
		center.forEach(function (c) {
			var n = nodes[c];
			x += n.x;
			y += n.y;
			});
		return {
			x: x / center.length,
			y: y / center.length
			};
		};
	var ix = function (id) {
		return nodes.map(function(n) { return n.id; }).indexOf(id);
		};
	var lix = function(six, tix) {
		return links.filter(function (l){return (l.source == six && l.target == tix);});
	}
	var getNeighbors = function (id) { // returns duplicate NODES if two systems host multiple integrations
		var neighbor_links = links.filter(function (l) {return l.target.id == id || l.source.id == id;});
		var neighbor_nodes = neighbor_links.map(function (l) {return l.target.id == id ? l.source.id : l.target.id;});
		return neighbor_nodes.map(function (id) { return nodes[ix(id)];})
		};
	var drop = function (id) {
		var save = ix(id);
		dropLinks(id);
		dropNode(id);
		determineCenter(save);
		};
	var dropNode = function (id) {
		nodes.splice(ix(id), 1);
		};
	var dropLinks = function (id) { // a node id!!
		var dirty = false;
		for (var i = links.length; i != 0; i--) {
			if (links[i - 1].source.id == id || links[i - 1].target.id == id) {
				dropLink(i - 1); dirty = true;
				}
			}
			return dirty;
		};
	var dropLink = function(ix) {
		links.splice(ix, 1);
	};
	/*** add(n = node to add (as opposed to a node_is, being passed to N - this way we can add nodes with positions)
	 *			 L = callback, returns array of node's links
	 *			 N = callback, returns a node id given what's in link.source and link.target (id or index)
	 ***/
	var add = function (n) {
		if (!node2links) {throw "undefined callback: node2links"; return;}
		if (!n.id) {throw "node lacks id"; return;}
		if (typeof n.size == "undefined") {n.size=0; console.warn("Net added explicit size for node " + n.name);}
		if (ix(n.id) < 0) var index = nodes.push(n)-1;
		else return; // return if already among nodes
		if (dropLinks(n.id)){ throw("Found garbage links to drop before adding node."); debugger; }
		node2links(n.id).forEach(function(l) {addLink(l);});
		determineCenter(index, n.size);
		return nodes[index];
		};
	var addLink = function (l){
		var s = ix(l.source.id), t = ix(l.target.id);
		if (s==t) return; // no self-linking
		if (s>=0&&t>=0 && !lix(s,t).length)	{
			links.push({"source":s, "target":t, "name": l.name, "type": l.type});
			}
		};
	var supernova = function (id) { // node explosion!
			node2links(id).forEach(function (l) { add(l.source); add(l.target);})
		};
	var toggleFixed = function(id) {
		var n = nodes[ix(id)];
		n.fixed = !n.fixed;
		};
	var init = function (callback) {
			node2links = callback;			
		};
	var dump = function (n, l) {
		n = n || nodes;
		l = l || links;
		l.forEach(function (i) {
			console.table(i);
			});
		};
	var exportN = function (verbose) {
		var b = "Net.importN(JSON.parse('" + JSON.stringify(nodes) + "'));";
		if (verbose) console.log(b);
			return MakeBM(b);
		};
	var importN = function (ns) {
		nodes.length = 0;
		links.length = 0;
		center.length = 0;
		if (ns.length) ns.forEach(function (n) {add(n);});
		update();
		};
		
	return {
		nodes: nodes,
		links: links,
		getCenter: getCenter,
		getNeighbors: getNeighbors,
		drop: drop,
		add: add,
		supernova: supernova,
		toggleFixed: toggleFixed,
		init: init,
		dump: dump,
		exportN: exportN,
		importN: importN
		};
	})();