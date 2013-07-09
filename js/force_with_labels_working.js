var ss = new Superset();
var net = new Network();
var compartments = ["Account & Liquidity System", "Business Intelligence", "Core Systems", "FinancingLoans Systems", "Front System", "Fund & Portfolio Management", "Other SEB Systems", "Payment Systems", "Processing Support Systems", "Securities Systems", "Trading Systems", "ExternalSystems", "Finance Systems", "Risk Systems", "Compliance Systems"];

// http://stackoverflow.com/questions/9539294/adding-new-nodes-to-force-directed-layout

var w = $(window).width(),
	h = $(window).height();

	var force = d3.layout.force()
		.linkDistance(function(n) {
			return 60;
		})
		.gravity(1.0)
		.charge(function(n) {return -2000;
		})
		.friction(0.7)
		.size([$(window).width(), $(window).height()]);


// build the arrow.
var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
var node = svg.selectAll(".node");
var link = svg.selectAll(".link");


svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 35)
    .attr("refY", 0)
    .attr("markerWidth", 1)
    .attr("markerHeight", 1)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

d3.json("json/nodes_links.json", function(error, graph) {	
	$(function(){
		$("#q").autoSuggest(graph.nodes, {selectedValuesProp: "name", selectedItemProp: "name", searchObjProps: "name", startText: "Search...", selectionClick: function(elem){ console.log("selClick");elem.fadeTo("slow", 0.33); }, selectionRemoved: function(elem){ net.dropNode(elem);elem.fadeTo("fast", 0, function(){ elem.remove(); }); },resultClick: function(data){ kick(data.attributes); }});
	});

	ss.nodes = graph.nodes;
	ss.links = graph.links;
//	kick({compartment:"Processing Support Systems"});
//	kick({name:"COIS"});
//	kick({name:"VDR"});
//	kick({name:"Öka"});
//	kick({name:"Loro"});
//	kick({name:"Kofax"});
});

var labels = false;
var color = d3.scale.category20().domain(compartments);

// typeof filter = [node] Object, optional
function kick(filter) {
	if (!!filter) {
		var n = ss.filterNodes(filter);
		n.forEach(function (n) {
			net.addNode(n);
		});
		var l = [];
		if (true) l = ss.filterLinks(n);

		l.forEach(function (l) {
			console.log(l.source + " -> " + l.target);
			net.addLink(ss.nodes[l.source], ss.nodes[l.target]);
	//FAIL:		net.addLinkAggressive(ss.nodes[l.source], ss.nodes[l.target]);
		});

/*
		// MÅSTE HA LOCAL LINK COUNT för att smånoder ska pressas ut mot kanterna
		var force = d3.layout.force()
	      .linkDistance(function(l, i) {
	      var n1 = l.source, n2 = l.target;
	    // larger distance for bigger groups:
	    // both between single nodes and _other_ groups (where size of own node group still counts),
	    // and between two group nodes.
	    //
	    // reduce distance for groups with very few outer links,
	    // again both in expanded and grouped form, i.e. between individual nodes of a group and
	    // nodes of another group or other group node or between two group nodes.
	    //
	    // The latter was done to keep the single-link groups ('blue', rose, ...) close.
	    return 60 +
	      Math.min(20 * Math.min((n1.size || (n1.group != n2.group ? n1.size : 0)),
	                             (n2.size || (n1.group != n2.group ? n2.size : 0))),
	           -30 +
	           30 * Math.min((n1.link_count || (n1.group != n2.group ? n1.link_count : 0)),
	                         (n2.link_count || (n1.group != n2.group ? n2.link_count : 0))),
	           100);
	      //return 150;
	    })
	    .gravity(0.05)   // gravity+charge tweaked to ensure good 'grouped' view (e.g. green group not smack between blue&orange, ... CLA CHANGED FROM 0.05 for SMALL CLUSTERS
	    .charge(-600)    // ... charge is important to turn single-linked groups to the outside
	    .friction(0.5)   // friction adjusted to get dampened display: less bouncy bouncy ball [Swedish Chef, anyone?]
			.size([$(window).width(), $(window).height()]);

		*/
			// Bra värden förr i världen, men implementera local link count:

//	var f = svg.append("filter").attr("id", "blurMe").append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "1");
	force.nodes(net.nodes).links(net.links);
	force.start();
	
	link = svg.selectAll(".link").data(force.links());
	link.enter().insert("line", ".node").attr("class", "link");
	  link.exit().remove();
	/*.append("line")
		.attr("class", "link")
		.attr("marker-end", "url(#end)");
*/
//	node = node.data(net.nodes).enter().append("g").attr("class", "node");
	
	node = node.data(force.nodes(), function(d) { return d.index;});
	  node.enter().append("circle").attr("class", "node").attr("r", function(n) {
		return (4+n.size*0.5);
	});
	  node.exit().remove();
	node.call(force.drag);
	
/*
	node.append("circle")
	//				.attr("filter", "url('#blurMe')")
	.attr("r", function(n) {
		return (4+n.size*0.5);
	})
	.style("fill", function(d) { return color(d.compartment);})
	.style("stroke", "#FFF").style("stroke-width", 3);


	// add the text 
	if (!labels) {
	node.append("text")
	    .attr("x", 12)
	    .attr("dy", ".35em")
		.attr("font-size", function(n){
			if (n == filter) return 15;
			return 12;
		})
	    .text(function(n) { return n.name; });
	}
*/
/*
	node.append("title").text(function(d) {
		return d.name + "::" + d.compartment;
	});
*/

	if (labels) {
		var labelAnchors = [];
		var labelAnchorLinks = [];

		var force2 = d3.layout.force()
			.gravity(1.0)
			.linkDistance(0)
			.linkStrength(8)
			.charge(-500)
			.size([$(window).width(), $(window).height()]);

		net.nodes.forEach(function(n, i) {
			labelAnchors.push({
				node: n
			});
			labelAnchors.push({
				node: n
			});
			labelAnchorLinks.push({
				source: i * 2,
				target: i * 2 + 1,
				weight: 1
			});
		});
		var anchorLink = svg.selectAll("line.anchorLink").data(labelAnchorLinks).enter().append("svg:line").attr("class", "anchorLink").style("stroke", "#999");
		var anchorNode = svg.selectAll("g.anchorNode").data( /*labelAnchors*/
		function() {
			var ret = [];
			svg.selectAll(".node").data().forEach(function(n) {
				ret.push(labelAnchors[n.index * 2]);
				ret.push(labelAnchors[n.index * 2 + 1]);
			});
			return ret;
		}).enter().append("svg:g").attr("class", "anchorNode");

		anchorNode.append("svg:circle").attr("r", 0).style("fill", "#FFF");

		anchorNode.append("svg:text").text(function(d, i) {
			return i % 2 == 0 ? "" : d.node.name;
		}).style("fill", "#555").style("font-family", "Arial").style("font-size", 12);

		force2
			.nodes(labelAnchors)
			.links(labelAnchorLinks)
			.start();		
	}

}

/* ---------------------------- FOR SIMULATION ----------------------------- */
	var updateLink = function() {
			this.attr("x1", function(d) {
				return d.source.x;
			}).attr("y1", function(d) {
				return d.source.y;
			}).attr("x2", function(d) {
				return d.target.x;
			}).attr("y2", function(d) {
				return d.target.y;
			});

		}

	var updateNode = function() {
	  node.attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; })		
		/*
			this.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
*/
		}

	force.on("tick", function(e) {
/*		force.gravity(function (e) {return 100;}); */
/*
	 // Push different nodes in different directions for clustering.
	  var k = 6 * e.alpha;
	  nodes.forEach(function(o, i) {
	    o.y += i & 1 ? k : -k;
	    o.x += i & 2 ? k : -k;
	  });
*/




		node.call(updateNode);
		link.call(updateLink);

		if (labels) {
//			force2.start();
			anchorNode.each(function(d, i) {
				if(i % 2 == 0) {
					d.x = d.node.x;
					d.y = d.node.y;
				} else {
					var b = this.childNodes[1].getBBox();

					var diffX = d.x - d.node.x;
					var diffY = d.y - d.node.y;

					var dist = Math.sqrt(diffX * diffX + diffY * diffY);

					var shiftX = b.width * (diffX - dist) / (dist * 2);
					shiftX = Math.max(-b.width, Math.min(0, shiftX));
					var shiftY = 5;
					this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
				}
			});

			anchorNode.call(updateNode);
			anchorLink.call(updateLink);
		}
	});
}