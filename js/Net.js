var Net = function () {
	/*** Captain's log
	 *
	 */

	var force,nodes = [], links = [], center = [];
	return {
		nodes: nodes,
		links: links,
		force: force,
		center: center,
		determineCenter: function () {
			var weight = 3;
			this.center = [];
			Net.nodes.forEach(function (n, i) {
				Net.center.push({
					index: i,
					size: n.size
				});
			});
			this.center.sort(function (a, b) {
				return a.size < b.size;
			});
			this.center.splice(weight, this.center.length - weight);
		},
		getCenter: function () {
			var x = y = 0;

			this.center.forEach(function (c) {
				var n = Net.nodes[c.index];
				x += n.x;
				y += n.y;
			});
			return {
				x: x / this.center.length,
				y: y / this.center.length
			};
		},
		ix: function (id) {
			return Net.nodes.map(function(n) { return n.id; }).indexOf(id);
		},
		getNeighbors: function (id) { // returns duplicate NODES if two systems host multiple integrations
			var neighbor_links = Net.links.filter(function (l) {return l.target.id == id || l.source.id == id;});
			var neighbor_nodes = neighbor_links.map(function (l) {return l.target.id == id ? l.source.id : l.target.id;});
			return neighbor_nodes.map(function (id) { return Net.nodes[Net.ix(id)];})
		},
		drop: function (id) {
			this.dropLinks(id);
			this.dropNode(id);
			this.determineCenter();
		},
		dropNode: function (id) {
			Net.nodes.splice(this.ix(id), 1);
		},
		dropLinks: function (id) { // a node id!!
			var dirty = false;
			for (var i = Net.links.length; i != 0; i--) {
				if (Net.links[i - 1].source.id == id || Net.links[i - 1].target.id == id) {
					Net.dropLink(i - 1); dirty = true;
				}
			}
			return dirty;
		},
		/*** addNode(n = node to add (as opposed to a node_is, being passed to N - this way we can add nodes with positions)
		 *			 L = callback, returns array of node's links
		 *			 N = callback, returns a node id given what's in link.source and link.target (id or index)
		 ***/
		addNode: function (n) {
			if (!Net.node2links) {throw "undefined callback: node2links"; return;}
			if (this.ix(n.id)>=0) return; // already in set
			var ix = Net.nodes.push(n)-1;
			if (this.dropLinks(n.id)){ throw("Found garbage links to drop before adding node."); debugger; }
			Net.node2links(n).forEach(function(l) {Net.addLink(l);});
			this.determineCenter();
			return Net.nodes[ix];
		},
		addLink: function (l){
			var s = Net.ix(l.source), t = Net.ix(l.target);
			if (s>=0&&t>=0)	{
				Net.links.push({"source":s, "target":t});
			}
		},
		supernova: function (id) { // node explosion!
			SS.l(id).forEach(function (l) { addNode(SS.n(l.source)); addNode(SS.n(l.target));})
		},
		toggleFixed: function(name) {
			var n = Net.nodes[this.ix(id)];
			n.fixed = !n.fixed;
		},
		linkDistance: function(l,i) {
			var linkD = Math.sqrt(l.source.weight*l.target.weight);
			var sizeD = Math.sqrt(l.source.size*l.source.size+l.target.size*l.target.size);
			return  Net.linkConstant*linkD+sizeD/Net.sizeConstant;
		},
		linkConstant: 25,
		linkConstantUpdate: function () {
		    Net.linkConstant = d3.select("#linkConstant").property("value");
		    d3.select("#linkLabel").text("linkConstant: "+d3.format("f")(Net.linkConstant));
			update();
		    return Net.linkConstant;
		},
		sizeConstant: 1,
		sizeConstantUpdate: function () {
		    Net.sizeConstant = d3.select("#sizeConstant").property("value");
		    d3.select("#sizeLabel").text("sizeConstant: "+d3.format("f")(Net.sizeConstant));
			update();
		    return Net.sizeConstant;
		},
		setup: function (w, h) {
			this.force = d3.layout.force()
			.linkDistance(Net.linkDistance)
			.gravity(0.1)
			.charge(-600)
			.friction(0.5)
			.size([w, h])
			.nodes(Net.nodes).links(Net.links);
		},
		d3_layout_forceMouseover: function(d) { // got these from d3's force.js
		  d.fixed |= 4; // set bit 3
		  d.px = d.x, d.py = d.y; // set velocity to zero
		},
		d3_layout_forceMouseout: function (d) {// got these from d3's force.js
		  d.fixed &= ~4; // unset bit 3
		},
		leftDrag: true,
		nodeDrag: d3.behavior.drag().on("dragstart", function(d){
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
			    Net.force.resume(); // restart annealing
			}
		})
		.on("dragend", function(d){
		  d.fixed &= ~6; // unset bits 2 and 3
			leftDrag = false;
		}),
		dump: function (n, l) {
			n = n || Net.nodes;
			l = l || Net.links;
			l.forEach(function (i) {
				console.table(i);
			});
		},
		export: function (verbose) {
			var b = "Net.import(JSON.parse('" + JSON.stringify(Net.nodes) + "'));";
			if (verbose) console.log(b);
			return MakeBM(b);
		},
		import: function (ns) {
			if (!ns) { throw("couldn't import roughly anything =/"); return; }
			Net.nodes = [];
			Net.links = [];
			ns.forEach(function (n) {Net.addNode(n);});
			Net.force.nodes(Net.nodes);
			Net.force.links(Net.links);
			update();
		},
		reset: function(node, link) {
			Net.links = [];
			Net.nodes = [];
			update();
//			node.data([]);
//			link.data([]);
		}
	}
}();