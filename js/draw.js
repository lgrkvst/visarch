/** __draw__ binds it all together: visualization, the RSA model and the interaction.
 * 
 * @author Christian Lagerkvist [christian.lagerkvist@seb.se]
 */

// Create a handy color range - one theme color per group
var color = d3.scale.category20();

// Setup draw area - the subtraction of the constant is for adjusting the area for the height of header+footer
var w = $(window).width(),
	h = $(window).height()-42*2;

// Initialize the Net object with a callback (ALL.nodeSource) allowing it to obtain a node's links.
Net.init(ALL.nodeSource);
Force.init(w, h);

// Attach d3 to the DOM. Load it with our radial menu.
var svg = d3.select("#background").append("svg:svg").attr("id", "observatory").attr("width", w).attr("height", h)
	.on("mouseup", function () {
		var sunburst = svg.selectAll("g.radial");
		sunburst.remove();
	});
	
// attrs vital to PhantomJS (svg2png goes m.i.a. without them)
svg.attr("xmlns", "http://www.w3.org/2000/svg").attr("version", "1.1");

var link = svg.insert("g").attr("class", "links").selectAll(".link");
var node = svg.insert("g").attr("class", "nodes").selectAll(".node");

// svg filter for adding halos to nodes
svg.append("filter").attr("id", "blurMe").append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "2");

// Experimental: display an arrow between nodes marking directions
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

/**** node gradients ***/
var gs = svg.selectAll("defs").selectAll("menuGradients")
		.data(color.range())
		.enter()
		.append("radialGradient")
		.attr("id", function (n, i) {
		return "m" + i;
	}).attr("cx", "0%").attr("cy", "0%").attr("fx", "0%").attr("fy", "0%").attr("r", "100%");
	gs.append("stop").attr("stop-color", function (n) {
		return d3.rgb(n).brighter();
	}).attr("offset", "0%").attr("stop-opacity", "100%");
	gs.append("stop").attr("stop-color", function (n) {
		return n;
	}).attr("offset", "100%").attr("stop-opacity", "100%");

/**** radial gradients ***/
var gs = svg.selectAll("defs").selectAll("radialGradient")
	.data(color.range())
	.enter()
	.append("radialGradient")
	.attr("id", function (n, i) {
		return "g" + i;
	})
	.attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
	
gs.append("stop").attr("stop-color", function (n) {
	return n;
}).attr("offset", "40%").attr("stop-opacity", "100%");
gs.append("stop").attr("stop-color", "white").attr("offset", "75%").attr("stop-opacity", "0%");

/**** radial menu icons ***/
// trash can
svg.selectAll("defs")
	.append("g")
	.attr("id", "icon_remove")
	.append("polygon")
	.attr("points", "438.393,374.595 319.757,255.977 438.378,137.348 374.595,73.607 255.995,192.225 137.375,73.622 73.607,137.352 192.246,255.983 73.622,374.625 137.352,438.393 256.002,319.734 374.652,438.378")
	.attr("fill", "white")
	.attr("transform", "scale(0.03) translate(-80,150)");

// magnet icon
svg.selectAll("defs")
	.append("g")
	.attr("id", "icon_fixed")
	.append("path")
	.attr("d", "M20.812,19.5h5.002v-6.867c-0.028-1.706-0.61-3.807-2.172-5.841c-1.539-2.014-4.315-3.72-7.939-3.687C12.076,3.073,9.3,4.779,7.762,6.792C6.2,8.826,5.617,10.928,5.588,12.634V19.5h5v-6.866c-0.027-0.377,0.303-1.789,1.099-2.748c0.819-0.979,1.848-1.747,4.014-1.778c2.165,0.032,3.195,0.799,4.013,1.778c0.798,0.959,1.126,2.372,1.099,2.748V19.5L20.812,19.5zM25.814,25.579c0,0,0-2.354,0-5.079h-5.002c0,2.727,0,5.08,0,5.08l5.004-0.001H25.814zM5.588,25.58h5c0,0,0-2.354,0-5.08h-5C5.588,23.227,5.588,25.58,5.588,25.58z")
	.attr("fill", "white")
	.attr("transform", "scale(0.52) translate(-5,10)");

// supernova icon (explosion, or rather an asterisk...)
svg.selectAll("defs")
	.append("g")
	.attr("id", "icon_explode")
	.append("path")
	.attr("d", "m567.072327,32.324581l-142.898529,364.1077l-390.230839,26.652069l302.105686,248.419556l-95.20694,379.358398l329.609894,-210.542419l331.372925,207.780212l-98.380493,-378.565002l300.019348,-250.946625l-390.436523,-23.39035l-145.954529,-362.873539z")
	.attr("fill", "white")
	.attr("transform", "scale(0.015) translate(0,130)");

// add icon (plus)
svg.selectAll("defs")
	.append("g")
	.attr("id", "icon_add")
	.append("path")
	.attr("d", "M301.588,150.794C301.588,67.513,234.075,0,150.794,0S0,67.513,0,150.794c0,62.362,37.857,115.879,91.842,138.832V420c0,28.167,22.833,51,51,51h15c28.167,0,51-22.833,51-51V290.002C263.307,267.265,301.588,213.502,301.588,150.794z")
	.attr("fill", "#272727")
	.attr("transform", "scale(0.04) translate(0,260)");



// import RSA components and relationships
	var graph = nodes_links;
	// Load everything into __ALL__
	ALL.init(graph.nodes, graph.links);
	var groups = [];
	var groupObjects = [];
	
	var autoSuggest = [];
	// add __group__ to autoSuggest
	graph.nodes.forEach(function (n) {
		autoSuggest.push({
			name: n.name,
			id: n.id,
			description: n.description,
			color: color(n.group),
			group: n.group
		});
		if (groups.indexOf(n.group) == -1) {
			groups.push(n.group);
		}
	});
	groupObjects = groups.map(function(n) {return {"name": "[" + n + "]", "group": n, "color": color(n), "id": n, description: "group"};});
	// init autoSuggest
	autoSuggest = autoSuggest.concat(groupObjects);

	$('#q').typeahead({
		name: 'stellar',
		local: autoSuggest,
		valueKey: 'name',
		limit:16,
		template: [
				'<span class="tt-name">{{name}}</span>',
				'<span style="background:{{color}}" class="label label-info pull-right">{{group}}</span>',
				'<div class="tt-description"><em>{{description}}</em></div>'
		].join(''),
		engine: Hogan
	});
	
	// Provides a hook for index.html for displaying systems on page load
	try {
		JsonReady();
	} catch (err) {console.log(err);}

/** __update__ takes care of drawing and interaction. Quite d3 intense... */
function update() {
	// call start before doing svg stuff, since we want any new nodes instantiated
	Force.force().start();
	
	node = node.data(Net.nodes, function (n) {
		return n.id;
	});

	link = link.data(Net.links, function (n) {
		return (n.source.id + n.target.id);
	});

	// 	Adding basic links
	link.enter().append("line").attr("class", "link");
	// experimental: put arrows on links
	//.attr("marker-end", "url(#end)");


/*	// polygonlinks
	link.enter()
        .append('path')
		.attr("class", "polygonlink");
*/	

		// experimental: link labels
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

		

	
	// draw an svg:group for each node	
	var g = node.enter().append("g")
		.attr("class", function (d) {
		return d.group;
	})
		.attr("transform", function () {
		return "translate(" + w / 2 + "," + h / 2 + ")"
	});
	// type the node name in each group
	var g_label = g.append("g")
		.attr("class", "node_label");
		
	g_label.append("rect")
		.attr("class", "label_background")
		.style("fill", function (d) {
			return d3.rgb(color(d.group)).darker();
			});
	g_label.append("text")
		.attr("dy", ".35em")
		.attr("x", function (n) {
		return 14 + 0.3 * n.size;
	})
		.attr("font-size", function (n) {
		return 14 + 0.1 * n.size;
	})
		.attr("class", "label_text")
		.text(function (n) {
		return n.name;
	});
	// add a hover:title in each group
	g.append("title").text(function (d) {
		return (d.description ? d.description + "\n" : "") + "[" + d.group + "]";
	});

	// halo
	g.append("circle").attr("r", function (n) {
		return (12 + n.size * 0.4);
	})
		.attr("class", function (d) {
		return "halo";
	})
		.style("fill", function (d) {
		return "url(#g" + (groups.indexOf(d.group)) + ")";
	});

	// put a circle in each group
	g.append("circle").attr("r", function (n) {
		return (6 + n.size * 0.2);
	})
	.attr("class", "node")
	.on("mouseover", Force.d3_layout_forceMouseover)
	.on("mouseout", Force.d3_layout_forceMouseout);

/*
	// Experimental but really cool:
	// Mark fixed nodes
	g.append("circle")
		.attr("r", function (n) {
			return (20 + n.size * 0.4);
		})
		.attr("class", "fixed")
		.style("display", "none");
*/
	// get rid of obsolete nodes (deleted through the radial menu's trash can in a previous iteration)
	node.exit().remove();





























	// Build the radial menu
	g.selectAll("circle")
		.on("mouseup", function () {
			var sunburst = svg.selectAll("g.radial");
			sunburst.remove();
		})	
		.on("contextmenu", function (n) {
		// The radial menu function takes a JSON structure, according to d3's docs on pie menus.
		var tree = {
			"size": n.size,
			"children": [{
					"label": "remove",
					"id": n.id,
					"icon": "#icon_remove",
					"size": "10",
		// we inject a callback for each menu item, what to execute on selection. Maybe I can become a decent js-coder afterall?
					"callback": function (node) {Net.drop(node.id);update();}
					}, {
					"label": "explode",
					"id": n.id,
					"icon": "#icon_explode",
					"size": "10",
					"children": [],
					"callback": function (node) {Net.supernova(node.id);update();}
					}, {
					"label": "freeze",
					"id": n.id,
					"icon": "#icon_fixed",
					"size": "10",
					"callback": function (node) {Net.toggleFixed(node.id);update();}
					}/*, {
					"label": "add",
					"id": n.id,
					"icon": "#icon_add",
					"size": "15",
					"callback": function (node) {Net.derive(node.id);update();}
				}*/]
		};
		//
		if (n.description == "user added") {
			// push all Net.nodes onto the radial menu JSON
			Net.nodes.forEach(function (node) {
				var push = {};
				push.name = node.name;
				push.id = node.id;
				push.group = node.group;
				push.size = node.size;
				// not properly updated since implemented id's instead of indices:
				var arg = {"source":{"id":n.id}, "target": {"id":node.id}};
				push.callback = function(){Net.addLink(arg); update();};
				tree.children[1].children.push(push);
				});
		} else {
			var links = ALL.nodeSource(n.id);
			// push all links/edge menu items onto the radial menu JSON
			links.forEach(function (l) {
				var c = l.target == n.id ? ALL.n(l.source) : ALL.n(l.target);
				c = jQuery.extend(true, {"callback" : function(node){Net.add(ALL.n(node.id)); update()}}, c);
				tree.children[1].children.push(c);
				
			});
		}		
		drawRadial(tree, n);
	});
	
	node.call(Force.nodeDrag);

		if (Settings.drawOrigo && !Settings.rotateLabels) {
		var origo = svg.append("g").attr("id", "origo");
		origo.append("circle").attr("r", 4).style("fill", "#fff");
		origo.append("circle").attr("r", 7).style("stroke", "#fff").style("fill", "none").style("stroke-width", "1.5px");
	}


	/* ---------------------------- FOR SIMULATION ----------------------------- */

	// links are actually little trapezoids (arrows). You can barely see the link direction...
	var updateLink = function () {
		/*
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
			var path = "M " + s1x + " " + s1y;
			path +=   " L " + t1x + " " + t1y;
			path +=   " L " + t2x + " " + t2y;
			path +=   " L " + s2x + " " + s2y;
			path +=   " Z";
			return path;
		});
*/
		// Deprecated:
		// Plain svg:line objects
		this.attr("x1", function (d) {
			return d.source.x;
		}).attr("y1", function (d) {
			return d.source.y;
		}).attr("x2", function (d) {
			return d.target.x;
		}).attr("y2", function (d) {
			return d.target.y;
		});
	}

	var updateNode = function () {
		if (!Settings.rotateLabels) {
			var center = Net.getCenter();
			if (Settings.drawOrigo) svg.select("#origo").attr("transform", "translate(" + center.x + "," + center.y + ")");
				
		}

		this.attr("transform", function (d, i) {
//			this.childNodes[4].setAttribute("style", "display: "+ (d.fixed ? "block" : "none"));
			
			var angle = rotate = 0, anchor = "start";
			
			if (text = this.childNodes[0].childNodes[1]) {
				var offset = 14 + 0.3 * d.size;				

				// rotate labels
				if (Settings.rotateLabels) {
					var ns = Net.getNeighbors(d.id);
					if (ns.length) {
						// my intricate (read 'cheap') rotation algorithm for avoiding labels blocking other nodes or links.
						ns.x = d3.mean(ns, function(n){return n.x;});
						ns.y = d3.mean(ns, function(n){return n.y;});
						angle = 57 * myAtan((d.y-ns.y), (d.x-ns.x)); // Seems DRAWING rotated text is the speed hog, NOT myAtan...
					} else angle = 0;
					
					// Rotating isn't everything - here's some alignment so labels won't cover nodes
					if (Math.abs(angle) > 90) {
						var anchor = "end";
						var offset = -offset
						var rotate = 180;
					}
					
					text.setAttribute("transform", "rotate(" + rotate + ")");
					text.setAttribute("x", offset);
					text.setAttribute("text-anchor", anchor);

					if (Settings.drawAngles) text.textContent = Math.floor(angle);

				} else {
					// no text rotations
					var dX = d.x - center.x;

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

			// we have all we need - now draw the label
			var margin = 5;
			var rect = this.childNodes[0].childNodes[0];
			var textbox = text.getBBox();
			rect.setAttribute("x", textbox.x-margin);
			rect.setAttribute("y", textbox.y);
			rect.setAttribute("width", textbox.width+2*margin);
			rect.setAttribute("height", textbox.height);
			rect.setAttribute("transform", "rotate(" + rotate + ")");
			
			return "translate(" + d.x + "," + d.y + ") rotate(" + angle + ")";
		});
	}

	// Hooking bookmarklet generation into the simulation sequence
	Force.force().on("start", start());
	Force.force().on("tick", tick);
	Force.force().on("end", end);
	
	function start() {
		//	FPS.init();
		// everything is set up for rendering - create a bookmarklet for saving:
		if (Net.nodes.length) {
			$("#buttonbar").show();
			$("#bookmarklet").attr("class", "btn-sm btn-warning");
		}
	}
	
	function end() {
		$("#bookmarklet").attr("class", "btn-sm btn-success");
		$("#bookmarklet").attr("href", Net.exportN());		
	}

	// Do this every iteration
	function tick (e) {
		// update percent counter
		$("#bookmarklet").text(Math.floor(1000*(0.1-(Force.force().alpha()))) + 6 + "%")

		// for benchmarking
		// FPS.sample();


		node.call(updateNode);
		link.call(updateLink);
	}
}