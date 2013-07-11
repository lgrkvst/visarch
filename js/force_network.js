var net = function() {
	/*** Captain's log
	 *		Ibland kan jag inte söka efter just compartment [Processing Support], t ex om jag lägger till COIS först...
	 *		Söljstöd 2 gånger?!
	 */
	
	var L = function(str) {
		var debug = false;
		if (debug) console.log(str);
	}
	var force;
	var nodes = []; var links = [];
	return {
		nodes: nodes,
		links: links,
		force: force,
		ix: function(name) {
			var i = nodes.length;
			if (!i) {
				return -1;
			}
			while (nodes[--i] && nodes[i].name != name);
			return i;
		},
		drop: function(name) {
			var i = this.ix(name);
			if (i != -1) {
				this.dropNode(i);
				this.dropLinks(i);
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
		addNode: function(n) {
			var i = this.ix(n.name);
			if (i<0) {
				n.link_count = 0;
				i = nodes.push(n)-1;
			}
			return i;
		},
		// adds a link along with its source and target nodes
		addLinkAggressive: function(source, target, attributes) { // attr: link description etc, currently not supported
			var link = {source:source, target:target}; // waste of space? we're settings this 3-4 lines further down
			var found = false;

			// add source
			link.source = this.addNode(link.source);
			link.target = this.addNode(link.target);

			// check if link exists
			var k = this.links.forEach(function (l) {
				if (l.source == link.source && l.target == link.target) {
					found = true;
					return;
				}
			}); // does not exist - add it!
			if (!found) {
				nodes[link.source].link_count++
				nodes[link.target].link_count++
				return links.push(link);
			}
			return false;
		},
		addLink: function(source, target, attributes) { // attr: link description etc, currently not supported
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
			}
			return false;
		},
		setup: function(w,h) {
			this.force = d3.layout.force()
				.linkDistance(function(n) {
					return 60;
				})
				.gravity(0.7)
				.charge(function(n) {if (n.size > 0) return -2000; else return -50;})
				.friction(0.7)
				.size([w, h])
				.nodes(nodes).links(links);
				
				/*
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
			    .gravity(0.05)   // gravity+charge tweaked to ensure good 'grouped' view (e.g. green group not smack between blue&orange, ... CLA CHANGED FROM 0.05 for SMALL CLUSTERS
			    .charge(-600)    // ... charge is important to turn single-linked groups to the outside
			    .friction(0.5)   // friction adjusted to get dampened display: less bouncy bouncy ball [Swedish Chef, anyone?]
					.size([$(window).width(), $(window).height()])
					.nodes(nodes).links(links);
				*/
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
		}
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
			var filtered = (typeof haystack == "undefined") ? this.nodes: haystack;
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
		filterLinks: function(haystack){ // haystack is an array of nodes
			var filtered = (typeof haystack == "undefined") ? this.nodes: haystack;
			var subset = [];
			var superNodes = this.nodes;
			this.links.forEach(function (l){
				// cannot access this.nodes inside this forEach. Hence superNodes... Odd...
				filtered.forEach(function(n) {
					if (n.name == superNodes[l.target].name) {
						subset.push(l);
					}
					else if (n.name == superNodes[l.source].name) {
						subset.push(l);
					}
				});
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
