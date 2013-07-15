var net = function() {
	/*** Captain's log
	 *		Ibland kan jag inte söka efter just compartment [Processing Support], t ex om jag lägger till COIS först...
	 *		Söljstöd 2 gånger?! Propub 2 gånger?!
	 */
	
	var L = function(str) {
		var debug = false;
		if (debug) console.log(str);
	}
	var force;
	var nodes = []; var links = []; var center = [];
	return {
		nodes: nodes,
		links: links,
		force: force,
		center: center,
		determineCenter: function() {
			this.center = [];
			nodes.forEach(function (n,i) {
				net.center.push({index: i, size:n.size});
			});
			this.center.sort(function(a,b) {return a.size < b.size;});
			this.center.splice(3, this.center.length-3);
		},
		getCenter: function() {
			var x = y = 0;
			
			this.center.forEach(function (c) {
				var n = nodes[c.index];
				x += n.x;
				y += n.y;
			});
			return {x: x/this.center.length, y: y/this.center.length};
		},
		ix: function(name) {
			var i = nodes.length;
			if (!i) {
				return -1;
			}
			while (nodes[--i] && nodes[i].name != name);
			return i;
		},
		getLinksIx: function(n) {
			var i = this.ix(n.name);
			var m = [];
			links.forEach(function (l, li) {
				if (l.target.index == i || l.source.index == i) m.push(li);
			})
			return m;
		},
		getNeighbors: function(n) {
			var i = this.ix(n.name);
			var m = [];
			links.forEach(function (l, li) {
				if (l.target.index == i) m.push(l.source);
				if (l.source.index == i) m.push(l.target);
			})
			return m;
		},
		drop: function(name) {
			var i = this.ix(name);
			if (i != -1) {
				this.dropNode(i);
				this.dropLinks(i);
				this.determineCenter();
				this.dump();
			} else {
				console.log("No such node to drop: ");
				console.log(name);
			}			
		},
		dropNode: function(ix) { // Takes an array index
			if (nodes[ix]) nodes.splice(ix, 1);
		},
		dropLinks: function(ix) { // Takes an array NODE index
			for (var i=links.length;i!=0;i--) {
				var l = links[i-1];
				if (l.source.index == ix || l.target.index == ix) {
					net.dropLink(i-1);
				}
			}
		},
		dropLink: function(ix) { // Takes an array LINK index
			this.links.splice(ix,1);
		},
		addNode: function(n, hungry) {
			if (typeof hungry == "undefined") hungry = false;
			
			var i = this.ix(n.name);
			if (i<0) {
				n.link_count = 0;
				i = nodes.push(n)-1;
			}
			
			// add n:s links from SuperSet
			SS.getLinks(n).forEach(function (l) {
				net.addLink(SS.nodes[l.source], SS.nodes[l.target], hungry);
			});
			this.determineCenter();
			return i;
		},
		addLink: function(source, target, hungry, attributes) { // attr: link description etc, currently not supported
			var link = {};
			var found = false;
			link.source = this.ix(source.name);
			link.target = this.ix(target.name);

			// IFF source and target are visible
			if (link.source != -1 && link.target != -1) {
				var k = links.forEach(function (l) {
					if (l.source == link.source && l.target == link.target) {
						found = true;
						return;
					}
				}); // does not exist - add it!
				if (!found) {
					nodes[link.source].link_count++
					nodes[link.target].link_count++
					return this.links.push(link);
				}
			} else if (hungry) {
				this.addNode(source);
				this.addNode(target);
			}
			return false;
		},
		setup: function(w,h) {
			/* Fund & Portfolio management har 91 länkar
			 * 
			 *
			 */
			/*
			this.force = d3.layout.force()
				.linkDistance(function(n) {
					return 60;
				})
				.gravity(0.7)
				.charge(function(n) {if (n.size > 0) return -2000; else return -50;})
				.friction(0.7)
				.size([w, h])
				.nodes(nodes).links(links);
				*/
				this.force = d3.layout.force()
			      .linkDistance(function(l, i) {
			      var n1 = l.source, n2 = l.target;
			    return 60 +
			      Math.min(20 * Math.min((n1.size || (n1.group != n2.group ? n1.size : 0)),
			                             (n2.size || (n1.group != n2.group ? n2.size : 0))),
			           -30 +
			           30 * Math.min((n1.link_count || (n1.group != n2.group ? n1.link_count : 0)),
			                         (n2.link_count || (n1.group != n2.group ? n2.link_count : 0))),
			           100);
			    })
			    .gravity(0.1)   // gravity+charge tweaked to ensure good 'grouped' view (e.g. green group not smack between blue&orange, ... CLA CHANGED FROM 0.05 for SMALL CLUSTERS
			    .charge(-600)    // ... charge is important to turn single-linked groups to the outside
			    .friction(0.5)   // friction adjusted to get dampened display: less bouncy bouncy ball [Swedish Chef, anyone?]
					.size([$(window).width(), $(window).height()])
					.nodes(nodes).links(links);
			
		},			
		dump: function() {
			console.log("Nodes in network:");
			var tmp = [];
			nodes.forEach(function (n) {
				tmp.push(n.name);
			});
			console.log(tmp);
			console.log("Links in network:");
			var tmp = [];
			links.forEach(function (l) {
				tmp.push(l.source.name + " -> " + l.target.name);
			});
			console.log(tmp);
		},
		export: function() {
			return JSON.stringify(nodes);
		},
	}
}();

// UNIT TESTING::Network
if (false) {
	var VDR = {name:"VDR", compartment:"Processing Support"};
	var COIS = {name:"COIS", compartment:"Processing Support"};
	var IKP = {name:"IKP", compartment:"Front"};
	var ISIS = {name:"ISIS", compartment:"Processing Support"};
	var PhM = {name:"Physical Mail", compartment:"Processing Support"};

	var net = new Network();
	net.dump();

	var VDRCOIS = {source:VDR, target:COIS};
	net.addLink(VDR,COIS);
	net.dump();

	var VDRCOIS2 = {source:VDR, target:COIS};
	net.addLink(VDR,COIS); // should not add anything
	net.dump();

	var VDRIKP = {source:VDR, target:IKP};
	net.addLink(VDR,IKP);
	net.dump();

	var ISISPhM = {source:ISIS, target:PhM};
	net.addLink(ISIS,PhM);
	net.dump();

	var ISISCOIS = {source:ISIS, target:COIS};
	net.addLink(ISIS,COIS);
	net.dump();
}

var SS = function() {
	var nodes, links;
	return {
		nodes: this.nodes,
		links: this.links,
		
		/*** filterNodes
		 *	 Returns [array of] all nodes in [node list] haystack that match [object] filter, AND-wise
		 **/
		filterNodes: function(filter, haystack){
			var filtered = (typeof haystack == "undefined") ? SS.nodes: haystack;
			var subset = [];
			for (a in filter) {
				console.log("<filter attr=\"" + a + "\">" + filter[a] + "</filter>");
				filtered.forEach(function (n) {
					if (n[a] == filter[a]) {
						subset.push(n);
					}
				});
				filtered = subset;
				subset = [];
			}
			return filtered;
		},
		getLinks: function(n){ // returns all links involving n(ode)
			var subset = [];
			SS.links.forEach(function (l){
				if (n.name == SS.nodes[l.target].name) {
					subset.push(l);
				}
				else if (n.name == SS.nodes[l.source].name) {
					subset.push(l);
				}
			});
			// contains links to nodes OUTSIDE nodes!!
			// determine "local size" before returning
			return subset;
		}
	}
}();

// helpers, not really force related
function elem2name(elem) {
	var nodeText = elem[0].innerText; // xVDR
	var nodeName = nodeText.substring(1,nodeText.length); // VDR
	return nodeName;
}

function autoSuggestFilter2js(p) {
	var s = "update([";
	p.split("×").forEach(function (str) { if (!!str) s+="{name: \""+str+"\"},";});
	s = s.substring(0, s.length-1);
	s += "]);"
	return s;
}

var FPS = function() {
	var s, tick, tot = [];
	return {
		init: function() {
			tick = 0;
			s = (new Date()).getSeconds();			
		},
		sample: function(){
			tick++;
			var d = (new Date()).getSeconds();
			if (d!=s) {
				tot.push(tick);
				s = d;
				this.report();
				tick = 0;
			} else {
				tick++;
			}
		},
		report: function() {
			var total = 0;
			tot.forEach(function(t){
				total += t;
			});
			console.log("this: " + tick + " - average: " + total/tot.length);
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