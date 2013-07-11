var compartments = ["Account & Liquidity System", "Business Intelligence", "Core Systems", "FinancingLoans Systems", "Front System", "Fund & Portfolio Management", "Other SEB Systems", "Payment Systems", "Processing Support Systems", "Securities Systems", "Trading Systems", "ExternalSystems", "Finance Systems", "Risk Systems", "Compliance Systems"];
var labels2force = false;
var rotateLabels = false;
var color = d3.scale.category20().domain(compartments);

// http://stackoverflow.com/questions/9539294/adding-new-nodes-to-force-directed-layout

var w = $(window).width(),
	h = $(window).height();

net.setup(w,h);

var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
var link = svg.insert("g").attr("class", "links").selectAll(".link");
var node = svg.insert("g").attr("class", "nodes").selectAll(".node");

// build the arrow.
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

// import nodes and links
d3.json("json/nodes_links.json", function(error, graph) {

	SS.nodes = graph.nodes;
	SS.links = graph.links;

	var autoSuggest = [];
	graph.nodes.forEach(function (n) {
		autoSuggest.push({name:n.name});
	});
	autoSuggest.push({name:"[Account & Liquidity]", compartment:"Account & Liquidity System", description:"compartment"});
	autoSuggest.push({name:"[Business Intelligence]", compartment:"Business Intelligence", description:"compartment"});
	autoSuggest.push({name:"[Core]", compartment:"Core Systems", description:"compartment"});
	autoSuggest.push({name:"[Financing & Loans]", compartment:"FinancingLoans Systems", description:"compartment"});
	autoSuggest.push({name:"[Front]", compartment:"Front System", description:"compartment"});
	autoSuggest.push({name:"[Fund & Portfolio Management]", compartment:"Fund & Portfolio Management", description:"compartment"});
	autoSuggest.push({name:"[Rogue Systems]", compartment:"Other SEB Systems", description:"compartment"});
	autoSuggest.push({name:"[Payments]", compartment:"Payment Systems", description:"compartment"});
	autoSuggest.push({name:"[Processing Support]", compartment:"Processing Support Systems", description:"compartment"});
	autoSuggest.push({name:"[Securities]", compartment:"Securities Systems", description:"compartment"});
	autoSuggest.push({name:"[Trading]", compartment:"Trading Systems", description:"compartment"});
	autoSuggest.push({name:"[Outside SEB]", compartment:"ExternalSystems", description:"compartment"});
	autoSuggest.push({name:"[Finance & Risk] Finance systems", compartment:"Finance Systems", description:"compartment"});
	autoSuggest.push({name:"[Finance & Risk] Risk systems", compartment:"Risk Systems", description:"compartment"});
	autoSuggest.push({name:"[Finance & Risk] Compliance Systems", compartment:"Compliance Systems", description:"compartment"});

	$(function(){
		$("#q").autoSuggest(autoSuggest, {selectedValuesProp: "name", selectedItemProp: "name", searchObjProps: "name", startText: "Search...", selectionClick: function(elem){ console.log("selClick");elem.fadeTo("slow", 0.33); }, selectionRemoved: function(elem){ net.drop(elem2name(elem)); update(); elem.fadeTo("fast", 0, function(){ elem.remove(); }); },resultClick: function(data){ update(data.attributes); }});
	});
	
//	update([{system:"COIS"}, {compartment:"Fund & Portfolio Management"}]);
//	update({compartment:"Processing Support Systems", description:"compartment"});
//	update({compartment:"Fund & Portfolio Management", description:"compartment"});
});

// typeof filter = [node] Object, optional
function update(filter) {
	if (!!filter) {
		console.log(filter);
		filter.forEach(function (f) {
			if (f.description == "compartment") {
				delete f.name;
				delete f.description;
			}
			var n = SS.filterNodes(f);
			n.forEach(function (n) {
				net.addNode(n);
			});
			var l = [];
			if (true) l = SS.filterLinks(n);

			l.forEach(function (l) {
				net.addLink(SS.nodes[l.source], SS.nodes[l.target]);
	//		net.addLinkAggressive(SS.nodes[l.source], SS.nodes[l.target]);
			});
		});
//	var f = svg.append("filter").attr("id", "blurMe").append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "1");
	}

	// call start before doing svg stuff, since we want any new nodes instantiated
	net.force.start();

	link = link.data(net.force.links(), function (l) {
		return l.source.name + "-" + l.target.name;});
	link.enter().insert("line", ".node").attr("class", "link");
	link.exit().remove();	
	
	/*.append("line")
		.attr("class", "link")
		.attr("marker-end", "url(#end)");
	*/

	node = node.data(net.nodes, function(n){return n.name;});
	// draw an svg:group for each node
	var g = node.enter().append("g").attr("class", function(d) { return "node " + d.name; });
	// type the node name in each group
	if (!labels2force)
		{
		var g_label = g.append("g").attr("class", "nodelabel");	
		g_label.append("text")
		    .attr("dy", ".35em")
			.attr("x", function(n) {
				return 10+0.5*n.size;
			})
			.attr("font-size", function(n){
				return 14+0.1*n.size;
			})
		    .text(function(n) { return n.name; });
		// add a hover:title in each group
		g.append("title").text(function(d) {
			return d.size + " links\n[" + d.compartment + "]";
		});
	}
	// put a circle in each group
	g.append("circle").attr("r", function(n) {
		return (4+n.size*0.5);
	})
	.style("fill", function(d) { return color(d.compartment);})
	.style("stroke", "#FFF").style("stroke-width", 3);

	node.exit().remove();

	node.call(net.force.drag);
	
	if (labels2force) {
		var labelAnchors = [];
		var labelAnchorLinks = [];

		var force2 = d3.layout.force()
			.gravity(0)
			.linkDistance(0)
			.linkStrength(6)
			.charge(function (n, i) {
				if (i%2) return -0; else return -300;
			})
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
		var anchorLink = svg.selectAll("line.anchorLink").data(labelAnchorLinks).enter().append("svg:line").attr("class", "anchorLink")/*.style("stroke", "#999")*/;
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
			this.attr("transform", function(d,i) {
				var angle = 0;
				if (!labels2force) {
					var offset = 10+0.5*d.size;

					if (text = this.childNodes[0].childNodes[0]) {
						var dX = d.x-w/2;
						var dY = d.y-h/2;

						if (rotateLabels) angle = 180*Math.atan(dY/dX) / Math.PI;

						if (dX > -10) {
							text.setAttribute("x", offset);
							text.setAttribute("text-anchor", "start");
						} else {
							text.setAttribute("x", -offset);
							text.setAttribute("text-anchor", "end");			
						}
					}
				}
				return "translate(" + d.x + "," + d.y + ") rotate("+angle+")";
			});
		}

	net.force.on("tick", function(e) {

		node.call(updateNode);
		link.call(updateLink);

		if (labels2force) {
			force2.start();
			var angle = 0;
			anchorNode.each(function(d, i) {
				if(i % 2 == 0) {
					d.x = d.node.x;
					d.y = d.node.y;
				} else {
						if (rotateLabels) {
							var dX = d.x-w/2;
							var dY = d.y-h/2;

							angle = 180*Math.atan(dY/dX) / Math.PI;
							if (dX > -10) {
								this.setAttribute("text-anchor", "start");
							} else {
								this.setAttribute("text-anchor", "end");			
							}
							this.childNodes[1].setAttribute("dy", ".35em")
						}
					var b = this.childNodes[1].getBBox();

					var diffX = d.x - d.node.x;
					var diffY = d.y - d.node.y;

					var dist = Math.sqrt(diffX * diffX + diffY * diffY);

					var shiftX = b.width * (diffX - dist) / (dist * 2);
					shiftX = Math.max(-b.width, Math.min(0, shiftX));
					var shiftY = 0;
				    
					this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ") rotate(" + angle + ")");
				}
			});

			anchorNode.call(updateNode);
			anchorLink.call(updateLink);
		}
	});
}