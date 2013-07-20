var net = function () {
	/*** Captain's log
	 *		Ibland kan jag inte söka efter just compartment [Processing Support], t ex om jag lägger till COIS först...
	 *		Slopa link_count - använd weight istället!
	 * 		Bygg om hälften med: array.every(callback[, thisObject])
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
			nodes.forEach(function (n, i) {
				net.center.push({
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
				var n = nodes[c.index];
				x += n.x;
				y += n.y;
			});
			return {
				x: x / this.center.length,
				y: y / this.center.length
			};
		},
		ix: function (id) {
			return nodes.map(function(n) { return n.id; }).indexOf(id);
		},
		getNeighbors: function (id) { // returns duplicates if two systems host multiple integrations
			var neighbor_links = net.links.filter(function (l) {return l.target.id == id || l.source.id == id;});
			return neighbor_links.map(function (l) {return l.target.id == id ? l.source.id : l.target.id;});
		},
		drop: function (id) {
			this.dropLinks(id);
			this.dropNode(id);
			this.determineCenter();
		},
		dropNode: function (id) {
			nodes.splice(this.ix(id), 1);
		},
		dropLinks: function (id) { // a node id!!
			var dirty = false;
			for (var i = links.length; i != 0; i--) {
				if (links[i - 1].source.id == id || links[i - 1].target.id == id) {
					net.dropLink(i - 1); dirty = true;
				}
			}
			return dirty;
		},
		addNode: function (id) {
			if (this.ix(id)>=0) return;
			nodes.push(SS.n(id));
			if (this.dropLinks(id)){ throw("Found garbage links to drop before adding node."); debugger; } 
			links = links.concat(SS.l(id));
		},
		supernova: function (id) { // node explosion!
			SS.l(id).forEach(function (l) { addNode(SS.n(l.source)); addNode(SS.n(l.target));})
		},
		toggleFixed: function(name) {
			var n = net.nodes[this.ix(id)];
			n.fixed = !n.fixed;
		},
		linkDistance: function(l,i) {
			var linkD = Math.sqrt(l.source.link_count*l.target.link_count);
			var sizeD = Math.sqrt(l.source.size*l.source.size+l.target.size*l.target.size);
			return  Math.floor(net.linkConstant*linkD+sizeD/net.sizeConstant); /* behöver inte round:a */
		},
		linkConstant: 25,
		linkConstantUpdate: function () {
		    net.linkConstant = d3.select("#linkConstant").property("value");
		    d3.select("#linkLabel").text("linkConstant: "+d3.format("f")(net.linkConstant));
			update();
		    return net.linkConstant;
		},
		sizeConstant: 1,
		sizeConstantUpdate: function () {
		    net.sizeConstant = d3.select("#sizeConstant").property("value");
		    d3.select("#sizeLabel").text("sizeConstant: "+d3.format("f")(net.sizeConstant));
			update();
		    return net.sizeConstant;
		},
		setup: function (w, h) {
			this.force = d3.layout.force()
			.linkDistance(net.linkDistance)
			.gravity(0.1)
			.charge(-600)
			.friction(0.5)
			.size([$(window).width(), $(window).height()])
				.nodes(nodes).links(links);
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
			    net.force.resume(); // restart annealing
			}
		})
		.on("dragend", function(d){
		  d.fixed &= ~6; // unset bits 2 and 3
			leftDrag = false;
		}),
		dump: function (n, l) {
			n = n || nodes;
			l = l || links;
			console.table(n);
			l.forEach(function (i) {
				console.table(i);
			});
		},
		export: function () {
			return JSON.stringify(nodes);
		},
		reset: function(node, link) {
			this.links = [];
			this.nodes = [];
			update();
//			node.data([]);
//			link.data([]);
		}
	}
}();

// UNIT TESTING::Network
if (false) {
	var VDR = {
		name: "VDR",
		compartment: "Processing Support"
	};
	var COIS = {
		name: "COIS",
		compartment: "Processing Support"
	};
	var IKP = {
		name: "IKP",
		compartment: "Front"
	};
	var ISIS = {
		name: "ISIS",
		compartment: "Processing Support"
	};
	var PhM = {
		name: "Physical Mail",
		compartment: "Processing Support"
	};

	var net = new Network();
	net.dump();

	var VDRCOIS = {
		source: VDR,
		target: COIS
	};
	net.addLink(VDR, COIS);
	net.dump();

	var VDRCOIS2 = {
		source: VDR,
		target: COIS
	};
	net.addLink(VDR, COIS); // should not add anything
	net.dump();

	var VDRIKP = {
		source: VDR,
		target: IKP
	};
	net.addLink(VDR, IKP);
	net.dump();

	var ISISPhM = {
		source: ISIS,
		target: PhM
	};
	net.addLink(ISIS, PhM);
	net.dump();

	var ISISCOIS = {
		source: ISIS,
		target: COIS
	};
	net.addLink(ISIS, COIS);
	net.dump();
}

var SS = function () {
	var nodes, links;
	return {
		nodes: this.nodes,
		links: this.links,
		n: function (id) { // return node with id
			var i=0; while (id != SS.nodes[i].id){i++;} return SS.nodes[i];
		},
		l: function (id) { // returns all links involving (node.)id
			return SS.links.filter(function (l) {return l.target.id == id || l.source.id == id;});
		}
	}
}();

// helpers, not really force related
var Compartments = function () {
	var compartments = [{
			name: "[Account & Liquidity]",
			short: "Accounts",
			compartment: "Account & Liquidity System",
			description: "compartment"
		}, {
			name: "[Business Intelligence]",
			short: "BI",
			compartment: "Business Intelligence",
			description: "compartment"
		}, {
			name: "[Core]",
			short: "Core",
			compartment: "Core Systems",
			description: "compartment"
		}, {
			name: "[Financing & Loans]",
			short: "Loans",
			compartment: "FinancingLoans Systems",
			description: "compartment"
		}, {
			name: "[Front]",
			short: "Front",
			compartment: "Front System",
			description: "compartment"
		}, {
			name: "[Fund & Portfolio Management]",
			short: "F&Pm",
			compartment: "Fund & Portfolio Management",
			description: "compartment"
		}, {
			name: "[Rogue]",
			short: "?",
			compartment: "Other SEB Systems",
			description: "compartment"
		}, {
			name: "[Payments]",
			short: "Payments",
			compartment: "Payment Systems",
			description: "compartment"
		}, {
			name: "[Processing Support]",
			short: "ProcSup",
			compartment: "Processing Support Systems",
			description: "compartment"
		}, {
			name: "[Securities]",
			short: "Securities",
			compartment: "Securities Systems",
			description: "compartment"
		}, {
			name: "[Trading]",
			short: "Trading",
			compartment: "Trading Systems",
			description: "compartment"
		}, {
			name: "[External]",
			short: "External",
			compartment: "ExternalSystems",
			description: "compartment"
		}, {
			name: "[Finance Systems]",
			short: "F&R",
			compartment: "[Finance Systems]",
			description: "compartment"
		}, {
			name: "[Finance & Risk]",
			short: "F&R",
			compartment: "Finance&Risk Systems",
			description: "compartment"
		}, {
			name: "[Finance & Risk] Finance systems",
			short: "F&R",
			compartment: "Finance Systems",
			description: "compartment"
		}, {
			name: "[Finance & Risk] Risk systems",
			short: "F&R",
			compartment: "Risk Systems",
			description: "compartment"
		}, {
			name: "[Finance & Risk] Compliance Systems",
			short: "F&R",
			compartment: "Compliance Systems",
			description: "compartment"
		}, {
			name: "[SEB Kort]",
			short: "Kort",
			compartment: "Cards",
			description: "compartment"
		}, {
			name: "[Group Staff]",
			short: "Group Staff",
			compartment: "Group Staff Systems",
			description: "compartment"
		}, {
			name: "[TryggLiv]",
			short: "TL",
			compartment: "Life insurance",
			description: "compartment"
		}];
	return {
		all: compartments,
		RSA2short: function (RSA) {
			var ret = undefined;
			compartments.forEach(function (c) {
				if (RSA == c.compartment) ret = c.short;
			});
			return ret;
		},
		RSA: function () {
			var a = [];
			compartments.forEach(function (c) {
				a.push(c.compartment);
			});
			return a;
		},
		name2RSA: function (name) {
			var match = false;
			var i = 0;
			while (!match && i < compartments.length) {
				if (name == compartments[i].name) match = compartments[i].compartment;
				i++;
			}
			return match;
		},
		RSA2name: function (RSA) {
			var ret = undefined;
			compartments.forEach(function (c) {
				if (RSA == c.compartment) ret = c.name;
			});
			return ret;
		}

	};
}();


function elem2id(elem) {
//	debugger;
	var nodeText = elem[0].innerText; // xVDR
	var nodeName = nodeText.substring(1, nodeText.length); // VDR
	return nodeName;
}

function autoSuggestFilter2js(p) {
	var s = "update([";
	p.split("×").forEach(function (str) {
		if ( !! str) s += "{name: \"" + str + "\"},";
	});
	s = s.substring(0, s.length - 1);
	s += "]);"
	return s;
}

var FPS = function () {
	var s, tick, tot = [];
	return {
		init: function () {
			tick = 0;
			s = (new Date()).getSeconds();
		},
		sample: function () {
			tick++;
			var d = (new Date()).getSeconds();
			if (d != s) {
				tot.push(tick);
				s = d;
				this.report();
				tick = 0;
			} else {
				tick++;
			}
		},
		report: function () {
			var total = 0;
			tot.forEach(function (t) {
				total += t;
			});
			console.log("this: " + tick + " - average: " + total / tot.length);
			// false: false: 56, 64, 60, 63
			// rotate_labels = true: 34, 32, 37
			// force2: 28, 28
			// rot & force2: 
		}
	};
}();


function myAtan(y, x) { // http://dspguru.com/dsp/tricks/fixed-point-atan2-with-self-normalization
	var coeff_1 = Math.PI / 4;
	var coeff_2 = 3 * coeff_1;
	var abs_y = y > 0 ? y : -y;
	var angle, r;
	if (x >= 0) {
		r = (x - abs_y) / (x + abs_y);
		angle = coeff_1 - coeff_1 * r;
	} else {
		r = (x + abs_y) / (abs_y - x);
		angle = coeff_2 - coeff_1 * r;
	}
	return y < 0 ? -angle : angle;
}

function EncodeBookmarklet(verbose) {
	if (verbose) console.log("update(JSON.parse('" + net.export() + "'), false, true);");
	return MakeBM("update(JSON.parse('" + net.export() + "'), false, true);");
}

/*
// SATELLITE

g.append("circle").attr("r", function (n) {
	return (3);
})
	.style("fill", function (d) {
	return "#fff";
})
//	.attr("transform", function (n) {var offset=9+n.size*0.2; return "translate("+offset+","+offset+")";})
.attr("cx", function (n) {
	return 9 + n.size * 0.2;
})
	.attr("cy", function (n) {
	return 9 + n.size * 0.2;
})
	.append("animateTransform")
	.attr("attributeType", "xml")
	.attr("attributeName", "transform")
	.attr("type", "rotate")
	.attr("from", function (n) {
	var offset = n.size * 0.02;
	return "0 -" + offset + " -" + offset;
})
	.attr("to", function (n) {
	var offset = n.size * 0.02;
	return "1000 -" + offset + " -" + offset;
})
	.attr("dur", "10s")
	.attr("repeatCount", "indefinately");

*/
