var Net = (function () {
	/*** Captain's log
	 *	Lägger till [Fund...], därefter vdr, därefter ISIS, ingen länk!
	 */

	var nodes = [], links = [], force, center = [], linkConstant = 25, sizeConstant = 1, leftDrag = true, node2links;
	
	var get_force = function() {return force;}
	var determineCenter = function (ix, s) {
		var weight = 3;
		if (s) { // node added
			center.push({index:ix, size:s});
			} else { // node ix dropped, recalculate
			
			}
		if (center.length>3) {
			center.sort(function(a,b) {
				return a.size < b.size;
				});
			center.splice(weight, center.length - weight);
			}
	};
	var getCenter = function () {
		var x = y = 0;

		center.forEach(function (c) {
			var n = nodes[c.index];
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
	/*** add(n = node to add (as opposed to a node_is, being passed to N - this way we can add nodes with positions)
	 *			 L = callback, returns array of node's links
	 *			 N = callback, returns a node id given what's in link.source and link.target (id or index)
	 ***/
	var add = function (n) {
		if (!node2links) {throw "undefined callback: node2links"; return;}
		if (ix(n.id) < 0) var index = nodes.push(n)-1;
		else return; // return if already among nodes
		if (dropLinks(n.id)){ throw("Found garbage links to drop before adding node."); debugger; }
		node2links(n).forEach(function(l) {addLink(l);});
		determineCenter(index, n.size);
		return nodes[index];
		};
	var addLink = function (l){
		var s = ix(l.source), t = ix(l.target);
		if (s>=0&&t>=0 && !lix(s,t).length)	{
			links.push({"source":s, "target":t});
			}
		};
	var supernova = function (id) { // node explosion!
			SS.l(id).forEach(function (l) { add(SS.n(l.source)); add(SS.n(l.target));})
		};
	var toggleFixed = function(name) {
		var n = nodes[ix(id)];
		n.fixed = !n.fixed;
		};
	var linkDistance = function(l,i) {

		var linkD = Math.sqrt(l.source.weight*l.target.weight);
		var sizeD = Math.sqrt(l.source.size*l.source.size+l.target.size*l.target.size);
		
		return linkConstant*linkD+sizeD/sizeConstant-nodes.length;
		};
	var linkConstantUpdate = function () {
	    linkConstant = d3.select("#linkConstant").property("value");
	    d3.select("#linkLabel").text("linkConstant: "+d3.format("f")(linkConstant));
		update();
	    return linkConstant;
		};
	var sizeConstantUpdate = function () {
	    sizeConstant = d3.select("#sizeConstant").property("value");
	    d3.select("#sizeLabel").text("sizeConstant: "+d3.format("f")(sizeConstant));
		update();
	    return sizeConstant;
		};
	var init = function (w, h, callback) { /* callback(node) { return all_links(node); } */
		force = d3.layout.force()
			.linkDistance(linkDistance)
			.gravity(0.1)
			.charge(-1200)
			.friction(0.5)
			.size([w, h])
			.nodes(nodes).links(links);
		node2links = callback;
		};
	var d3_layout_forceMouseover = function(d) { // got these from d3's force.js
	  	d.fixed |= 4; // set bit 3
	  	d.px = d.x, d.py = d.y; // set velocity to zero
		};
	var d3_layout_forceMouseout = function (d) {// got these from d3's force.js
	  	d.fixed &= ~4; // unset bit 3
		};
	var nodeDrag = d3.behavior.drag().on("dragstart", function(d){
		d.fixed |= 2; // set bit 2		  
		if (d3.event.sourceEvent.which==1 && !d3.event.sourceEvent.ctrlKey) {
			// primary mouse button, no mac contextmenu (ctrl-click)
			leftDrag = true;
			} else {
			leftDrag = false;
			}
		})
		.on("drag", function (d) {
			if (leftDrag) {
			    d.px = d3.event.x, d.py = d3.event.y;
			    force.resume(); // callback
				}
			})
		.on("dragend", function(d){
	  		d.fixed &= ~6; // unset bits 2 and 3
			leftDrag = false;
			});
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
		if (!ns) { throw("couldn't import roughly anything =/"); return; }
		nodes = [];
		links = [];
		ns.forEach(function (n) {add(n);});
		force.nodes(nodes);
		force.links(links);
		update();
		};
	var reset = function(node, link) {
		links = [];
		nodes = [];
		update();
//		node.data([]);
//		link.data([]);
		};
		
	return {
		nodes: nodes,
		links: links,
		force: get_force,
		getCenter: getCenter,
		getNeighbors: getNeighbors,
		drop: drop,
		add: add,
		supernova: supernova,
		toggleFixed: toggleFixed,
		init: init,
		sizeConstantUpdate: sizeConstantUpdate,
		linkConstantUpdate: linkConstantUpdate,
		nodeDrag: nodeDrag,
		dump: dump,
		exportN: exportN,
		importN: importN,
		reset: reset,
		};

		/* ta bort d3-event-grejerna ur public */
})();