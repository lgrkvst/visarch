/** __draw__ binds it all together: visualization, the RSA model and the interaction.
 * 
 * @author Christian Lagerkvist [christian.lagerkvist@seb.se]
 */

// Setup draw area - the subtraction of the constant is for adjusting the area for the height of header+footer
var w = $(window).width(),
	h = $(window).height()-42*2;

// Create a handy color range - one theme color per group
var color = d3.scale.category20();

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
		return "url(#g" + faucet.sources[d.tag].groups.indexOf(d.group) + ")";
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
					"id": n.id, // used for what exaclty? We're sending in the node as well...
					"icon": "#icon_remove",
					// inject a callback for each menu item, what to execute on selection. Maybe I'm a decent js-coder afterall?
					"callback": function (node) {Net.drop(node.id);update();}
					}, {
					"label": "Applications",
					"id": n.id,
					"children": [],
					"callback": function (node) {Net.supernova(node.id);update();}
					}, {
					"label": "Processes",
					"id": n.id,
					"children": [],
					"callback": function (node) {Net.supernova(node.id);update();}
					}, {
					"label": "Platforms",
					"id": n.id,
					"children": [],
					"callback": function (node) {Net.supernova(node.id);update();}
					}]
		};
//			var links = ALL.ls(n.id);
			// push all links/edge menu items onto the radial menu JSON
			
			tree.children[2].children.push({"label":"Retail", "children": []});
			tree.children[2].children[0].children.push({"label": "Enkla Lånet"});

			tree.children[3].children.push({"label":"Rissne", "children":[]});
			tree.children[3].children.push({"label":"Grytet", "children":[]});
			tree.children[3].children[0].children.push({"label":"wsp1001a"});
			tree.children[3].children[0].children.push({"label":"wsp1001b"});
			tree.children[3].children[0].children.push({"label":"wsp1001c"});
			tree.children[3].children[1].children.push({"label":"wsp1002a"});
			tree.children[3].children[1].children.push({"label":"wsp1002b"});
			tree.children[3].children[1].children.push({"label":"wsp1002c"});



			$.when(n.links()).done(function(links) {
				links.forEach(function (l) {
					console.log(l);
					var l = jQuery.extend(true, {"callback" : function(node){Net.add(node); update()}}, l);
					tree.children[1].children.push(l);
				});
				console.log(tree);
				console.A = JSON.stringify(tree);
				console.tree = tree;
				drawRadial(tree, n);
				update();
			});
	});
	
	node.call(Force.nodeDrag);

		if (Settings.drawOrigo && !Settings.rotateLabels) {
		var origo = svg.append("g").attr("id", "origo");
		origo.append("circle").attr("r", 4).style("fill", "#fff");
		origo.append("circle").attr("r", 7).style("stroke", "#fff").style("fill", "none").style("stroke-width", "1.5px");
	}


	/* ---------------------------- FOR SIMULATION ----------------------------- */

	var updateLink = function () {
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