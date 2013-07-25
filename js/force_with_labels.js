var color = d3.scale.category20().domain(Compartments.RSA());

var w = $(window).width(),
	h = $(window).height()-42*2;

Net.init(w, h, ALL.node2links);

var svg = d3.select("#observatory").attr("width", w).attr("height", h)
	.on("mouseup", function () {
		var sunburst = svg.selectAll("g.radial");
		sunburst.remove();
	});
var link = svg.insert("g").attr("class", "links").selectAll(".link");
var node = svg.insert("g").attr("class", "nodes").selectAll(".node");

var bookmarks = ["javascript:(function(){update(JSON.parse('[]'),false,true);})();", "javascript:(function(){update(JSON.parse('[]'),false,true);})();"];
var d3bookmarks = d3.select("#bookmarks").selectAll("a");

svg.append("filter").attr("id", "blurMe").append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "2");

// build the arrow.
svg.append("svg:defs").selectAll("marker")
	.data(["end"]) // Different link/path types can be defined here
.enter().append("svg:marker") // This section adds in the arrows
.attr("id", String)
	.attr("viewBox", "0 -5 10 10")
	.attr("refX", 35)
	.attr("refY", 0)
	.attr("markerWidth", 1)
	.attr("markerHeight", 1)
	.attr("orient", "auto")
	.append("svg:path")
	.attr("d", "M0,-5L10,0L0,5");

	// define gradients
	// varför gs två gånger?
var gs = svg.selectAll("defs").selectAll("menuGradients")
		.data(color.range())
		.enter()
		.append("radialGradient")
		.attr("id", function (n, i) {
		return "m" + i;
	}).attr("cx", "0%").attr("cy", "0%").attr("fx", "0%").attr("fy", "0%").attr("r", "100%");
	gs.append("stop").attr("stop-color", function (n) {
		return d3.rgb(n).darker();
	}).attr("offset", "0%").attr("stop-opacity", "100%");
	gs.append("stop").attr("stop-color", function (n) {
		return n;
	}).attr("offset", "100%").attr("stop-opacity", "100%");



var gs = svg.selectAll("defs").selectAll("radialGradient")
	.data(color.range())
	.enter()
	.append("radialGradient")
	.attr("id", function (n, i) {
	return "g" + i;
}).attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
gs.append("stop").attr("stop-color", function (n) {
	return n;
}).attr("offset", "40%").attr("stop-opacity", "100%");
gs.append("stop").attr("stop-color", "white").attr("offset", "75%").attr("stop-opacity", "0%");



// import RSA components and relationships
d3.json("json/nodes_links.json", function (error, graph) {

	ALL.init(graph.nodes, graph.links);
	
	var autoSuggest = [];
	graph.nodes.forEach(function (n) {
		autoSuggest.push({
			name: n.name,
			id: n.id,
			description: n.description,
			color: color(n.compartment),
			compartment: Compartments.RSA2name(n.compartment)
		});
	});

	autoSuggest = autoSuggest.concat(Compartments.all.map(function (c){return {name:c.name, color: color(c.compartment),compartment:c.name, id:c.compartment, description:"compartment"};}));
	$('#q').typeahead({
		name: 'stellar',
		local: autoSuggest,
		valueKey: 'name',
		limit:16,
		template: [
				'<span class="tt-name">{{name}}</span>',
				'<span style="background:{{color}}" class="label label-info pull-right">{{compartment}}</span>',
				'<div class="tt-description"><em>{{description}}</em></div>'
		].join(''),
		engine: Hogan
	});
	
	try {
		JsonReady();
	} catch (err) {console.log(err);}
});
function update() {
		// everything is set up for rendering - create a bookmarklet for saving:
		// <a id="bookmarklet" href="javascript:null;" class="btn-small btn-warning">spara</a>		
		bookmarks.push(Net.exportN(false));
		bookmarks.shift();
		d3bookmarks = d3bookmarks.data(bookmarks, function (n) {return n;});
		d3bookmarks.enter().append("a");
		d3bookmarks.text(function(n,i) { return (i ? "current" : "previous");});
		d3bookmarks.attr("href", function(d){return d;}).attr("class", function (n,i) { return i ? "btn-small btn-success" : "btn-small btn-danger"; });
		d3bookmarks.exit().remove();
	
	// call start before doing svg stuff, since we want any new nodes instantiated
	Net.force().start();

	

	node = node.data(Net.nodes, function (n) {
		return n.id;
	});

	link = link.data(Net.links, function (n) {
		return (n.source.id + n.target.id);
	});
	// 	Adding basic links
	//	link.enter().append("line").attr("class", "link");

	link.enter()
        .append('path')
        .attr("class", "polygonlink");

		/*
	    var edgelabels = svg.selectAll(".edgelabel")
	        .data(Net.links)
		        .enter()
		        .append('text')
		        .style("pointer-events", "none")
		        .attr({'class':'edgelabel',
		               'id':function(d,i){return 'edgelabel'+i},
		               'dx':50,
		               'dy':8,
		               'font-size':12});

		var textPath = edgelabels.append('textPath')
		        .attr('xlink:href',function(d,i) {return '#edgepath'+i})
		        .style("pointer-events", "none")
		        .text(Net.linkDistance);
		*/	


		link.exit().remove();

		/*.append("line")
			.attr("class", "link")
			.attr("marker-end", "url(#end)");
		*/


	
	// draw an svg:group for each node	
	var g = node.enter().append("g")
		.attr("class", function (d) {
		return d.name;
	})
		.attr("transform", function () {
		return "translate(" + w / 2 + "," + h / 2 + ")"
	});
	// type the node name in each group
	var g_label = g.append("g").attr("class", "nodelabel");
	g_label.append("text")
		.attr("dy", ".35em")
		.attr("x", function (n) {
		return 14 + 0.3 * n.size;
	})
		.attr("font-size", function (n) {
		return 14 + 0.1 * n.size;
	})
		.attr("class", "nodelabeltext")
		.text(function (n) {
		return n.name;
	});
	// add a hover:title in each group
	g.append("title").text(function (d) {
		return d.size + " links\n[" + d.compartment + "]";
	});

	// halo
	g.append("circle").attr("r", function (n) {
		return (12 + n.size * 0.4);
	})
		.attr("class", function (d) {
		return "halo " + d.name;
	})
		.style("fill", function (d) {
		return "url(#g" + Compartments.RSA().indexOf(d.compartment) + ")";
	});

	// put a circle in each group
	g.append("circle").attr("r", function (n) {
		return (6 + n.size * 0.2);
	})
	.attr("class", "node")
	.on("mouseover", Net.d3_layout_forceMouseover)
	.on("mouseout", Net.d3_layout_forceMouseout);
/*
	// mark fixed nodes
	g.append("circle")
		.attr("r", function (n) {
			return (20 + n.size * 0.4);
		})
		.attr("class", "fixed")
		.style("display", "none");
*/
	node.exit().remove();





























	// menu
	g.selectAll("circle")
		.on("mouseup", function () {
			var sunburst = svg.selectAll("g.radial");
			sunburst.remove();
		})	
		.on("contextmenu", function (n) {
		var links = ALL.getLinks(n);
		var tree = {
			"size": n.size,
			"children": [{
					"label": "REMOVE",
					"name": n.name,
					"size": "10",
					"children": [{"name": "rogues"}],
					"callback": function (node) {Net.drop(node.name);update();}
					}, {
					"label": "EXPLODE",
					"name": n.name,
					"size": "10",
					"children": [],
					"callback": function (node) {Net.addNode(ALL.filterNodes({"name":node.name})[0], true);update();} // fix addnode to provide callback
					}, {
					"label": "FREEZE",
					"name": n.name,
					"size": "10",
					"callback": function (node) {Net.toggleFixed(node.name);update();}
				}]
		};
		/*
		links.forEach(function (l) {
			var c = ALL.nodes[l.target].name == n.name ? ALL.nodes[l.source] : ALL.nodes[l.target];
			var push = {};
			push.name = c.name;
			push.compartment = c.compartment;
			push.callback = function(node){update([{"name": node.name}])};
			//
			
			tree.children[1].children.push(push);
		});
		*/
//		console.log("var tree = JSON.parse('" + JSON.stringify(tree) + "');");
//		console.log("var n = JSON.parse('" + JSON.stringify(n) + "');");
		drawRadial(tree, n);
	});
	
	node.call(Net.nodeDrag);

	if (Settings.drawOrigo) {
		var origo = svg.append("g").attr("id", "origo");
		origo.append("circle").attr("r", 4).style("fill", "#fff");
		origo.append("circle").attr("r", 7).style("stroke", "#fff").style("fill", "none").style("stroke-width", "1.5px");
	}


	/* ---------------------------- FOR SIMULATION ----------------------------- */

	var updateLink = function () {
		this.attr('d', function(d) {

			var sx = d.source.x; var sy = d.source.y; var tx = d.target.x; var ty = d.target.y;
			var Dx = tx-sx; var Dy = ty-sy; // D as in Delta
			var pDx = Dy; var pDy = -Dx; 	// p as in perpendicular
			// normalize
			var length = Math.sqrt(pDx*pDx+pDy*pDy);
			pDx /= length;
			pDy /= length;


			var sC = 1;
			var tC = 0.6;
//			var sS = 6 + d.source.size * 0.2;
//			var tS = 6 + d.target.size * 0.2;
			var sS = 7*sC;
			var tS = 7*tC;

			var s1x = sx+pDx*sS;
			var s1y = sy+pDy*sS;

			var s2x = sx-pDx*sS;
			var s2y = sy-pDy*sS;

			var t1x = tx+pDx*tS;
			var t1y = ty+pDy*tS;

			var t2x = tx-pDx*tS;
			var t2y = ty-pDy*tS;
			if (!sx) {console.log(d.source.name + "(FAIL) -> " + d.target.name);}
			if (!tx) {console.log(d.source.name + " -> (FAIL)" + d.target.name);}
			var path = "M " + s1x + " " + s1y;
			path +=   " L " + t1x + " " + t1y;
			path +=   " L " + t2x + " " + t2y;
			path +=   " L " + s2x + " " + s2y;
			path +=   " Z";
						
			return path;
		});

		/*
		// for svg:line objects
		this.attr("x1", function (d) {
			return d.source.x;
		}).attr("y1", function (d) {
			return d.source.y;
		}).attr("x2", function (d) {
			return d.target.x;
		}).attr("y2", function (d) {
			return d.target.y;
		});
		*/
	}

	var updateNode = function () {
		var center = Net.getCenter();
		if (Settings.drawOrigo) svg.select("#origo").attr("transform", "translate(" + center.x + "," + center.y + ")");

		this.attr("transform", function (d, i) {
//			this.childNodes[4].setAttribute("style", "display: "+ (d.fixed ? "block" : "none"));
			
			var angle = 0;
			if (text = this.childNodes[0].childNodes[0]) {
				var offset = 14 + 0.3 * d.size;

				if (Settings.rotateLabels) {
					var ns = Net.getNeighbors(d.id);
					if (ns.length) {
						ns.x = d3.mean(ns, function(n){return n.x;});
						ns.y = d3.mean(ns, function(n){return n.y;});
						angle = 57 * myAtan((d.y-ns.y), (d.x-ns.x));
					} else angle = 0;
					
					if (Math.abs(angle) > 90) {
						var anchor = "end";
						var offset = -offset
						var rotate = 180;
					} else {
						var anchor = "start";
						var rotate = 0;
					}

					text.setAttribute("transform", "rotate(" + rotate + ")");
					text.setAttribute("x", offset);
					text.setAttribute("text-anchor", anchor);

					if (Settings.drawAngles) text.textContent = Math.floor(angle);

				} else {
					var dX = d.x - center.x;
					//						var dY = d.y-center.y;

					if (dX > 0) {
						var anchor = "start";
						text.setAttribute("x", offset);
					} else {
						var anchor = "end";
						offset = -offset
					}
					text.setAttribute("x", offset);
					text.setAttribute("text-anchor", anchor);
					text.setAttribute("transform", "rotate(" + 0 + ")");
					
				}
			}
			return "translate(" + d.x + "," + d.y + ") rotate(" + angle + ")";
		});
	}
	FPS.init();
//	console.time("doit")
	Net.force().on("tick", tick);
	Net.force().on("end", stop);
	
	function stop() {
		console.log("stop");
	}
	function tick (e) {
//		console.timeEnd("doit");
		
		if (e.alpha >0.098) {
//			console.clear();
//			console.log(Net.nodes);
		}
		// benchmark
		// SVG filter: 60, 57, 63, 55, 63
		// no filter: 72, 83, 83, 90
		// opacity: 83, 84, 77
//		FPS.sample();

		node.call(updateNode);
		link.call(updateLink);
	}
}