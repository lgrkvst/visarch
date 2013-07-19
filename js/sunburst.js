var scale = d3.scale.linear().domain([0, 90]).range([50, 200]);

function drawRadial(root, n) {
	var arc = d3.svg.arc().startAngle(function(d) {
		return d.x;
	}) /* d.x+0.05 = tänder... */
	.endAngle(function(d) {
		return d.x + d.dx;
	}).innerRadius(function(d) {
		//	return d.depth*scale(0); //n.size...
		return (d.y) / radius;
	}).cornerRadius(6) /* OBS anpassad version av d3.min.js från bm-w (via github), pull-req men ej merge:ad, idag är det 2013-07-19... */
	.outerRadius(function(d) {
		console.log("depth = " + d.depth + ", d[x,y] = [" + Math.floor(d.x) + "," + Math.floor(d.y) + "]  d[dx,dy] = [" + Math.floor(d.dx) + "," + Math.floor(d.dy) + "] (" + label(n) + ")");
		return 30 + (d.y) / radius;
		return Math.sqrt(d.y) + 25;
		//return 20+d.depth*scale(0); //n.size...
		return Math.sqrt(d.y + d.dy);
	});


	var radius = 220; // lagom för size = 7
	//						console.log(arc.innerRadius(215))
	var partition = d3.layout.partition().sort(function(a, b) {
		return d3.ascending(a.label, b.label);
	}).size([2 * Math.PI, radius * radius]).value(function(d) {
		return 1; // try d.size for action
	});
	//	console.log(arc.innerRadius("150"));
	var sunburst = svg.append("g").attr("class", "radial");
	sunburst.attr("transform", "translate(" + n.x + "," + n.y + ")");
	var g = sunburst.datum(root).selectAll("g").data(partition.nodes).enter().append("g").on("mouseover", function(n) {
		var path = this.childNodes[0];
		path.style.fill = d3.rgb(path.style.fill).darker();
	}).on("mouseout", function(n) {
		var path = this.childNodes[0];
		path.style.fill = d3.rgb(path.style.fill).brighter();
	}).on("mouseup", function(node) {
		sunburst.remove();
		console.log("node in sunburst:");
		console.log(node);
		if (node.callback) {
			node.callback(node);
		}

		});
	g.append("path")
	//			.attr("display", function(d) {
	//			return d.depth ? null : "none";
	//		}) // hide inner ring
	.attr("d", arc).attr("id", function(d, i) {
		return "path" + i;
	}).style("stroke", "#272727").style("stroke-width", "3px")
/*
				.style("fill", function(d) {
				if (d.label == "SOURCE") return "#444";
				if (d.label == "TARGET") return "#888";
				if (d.label == "REMOVE") return "#c33";
				if (d.compartment) {
					var hsl = d3.hsl(color(d.compartment));
									hsl.s = 0.05;
					//				hsl.l = 0.4;
					return hsl.darker();
				}
			})*/
	.style("fill", function(d) {
		console.log(d.label)
		if (d.label == "FREEZE") return "url(#m15)";
		if (d.label == "REMOVE") return "url(#m6)";
		if (d.label == "rogues") return "url(#m10)";
		if (d.label == "EXPLODE") return "url(mg14)";

		return "url(#m" + Compartments.RSA().indexOf(d.compartment) + ")";
	})

	.style("fill-rule", "evenodd");


	var text = curved(g);



	function horizontal(g) {
		return text = g.append("text").attr("transform", function(d) {
			var sizefactor = 1.15;
			var x = arc.centroid(d)[0] * sizefactor;
			var y = arc.centroid(d)[1] * sizefactor;
			return "translate(" + x + "," + y + ")";
		}).attr("dy", function(d) {
			return ".35em";
		}).attr("class", "nodelabeltext").text(function(d) {
			return d.label;
		}).attr("text-anchor", function(d) {
			if (d.depth == 1) return "middle"
			if (arc.centroid(d)[0] < 0) return "end";
			else return "start";
		})
	}

	function radial(g) {
		return text = g.append("text").attr("dy", function(d) {
			if (d.depth == 1) return "23";
			return "18";
		}).attr("transform", function(d) {
			if (d.label == "SOURCE") return "0";
			if (d.label == "TARGET") return "0";
			if (d.label == "REMOVE") return "0";

			return "rotate(" + (d.x + d.dx / 2 - Math.PI / 2) / Math.PI * 180 + ")";
		}).attr("x", function(d) {
			if (d.label == "SOURCE") return "-1.5em";
			if (d.label == "TARGET") return "-1.5em";
			if (d.label == "REMOVE") return "-1.5em";
			return Math.sqrt(d.y + d.dy);
		})

		.attr("dx", "6") // margin
		.attr("dy", function(d) {
			if (d.label == "SOURCE") return "1.6em";
			if (d.label == "TARGET") return "1.6em";
			if (d.label == "REMOVE") return "1.6em";

			return ".35em"
		}) // vertical-align
		.attr("class", "nodelabeltext").text(function(d) {
			if (d.label == "SOURCE") return "";
			if (d.label == "TARGET") return "";
			if (d.label == "REMOVE") return "";
			return d.label;
		}).append("textPath").attr("xlink:href", function(n, i) {
			return "#path" + i;
		}).text(function(n) {
			if (label(n) != "SOURCE" && label(n) != "TARGET" && label(n) != "REMOVE") return "";
			if (!n.depth) return "";
			if (label(n).length > 9) return label(n).substring(0, 9) + ".";
			else return label(n)
		}).attr("text-anchor", "middle").attr("startOffset", "23%");
	}

	function curved(g) {
		return text = g.append("text").attr("dy", function(d) {
			if (d.depth == 1) return "23";
			return "18";
		}).attr("x", function(d) {
			return Math.sqrt(d.y);
		})
		// Textens höjd i respektive cirkelsektor
		// .attr("dy", function(d) {
		// 	console.log(d.depth)
		// 	return "27";
		// })
		.attr("class", "nodelabeltext").append("textPath").attr("xlink:href", function(n, i) {
			return "#path" + i;
		}).text(function(n) {
			console.log(n);
			if (label(n).length > 9) return label(n).substring(0, 9) + ".";
			else return label(n)
		}).attr("startOffset", "30%").attr("text-anchor", "middle");
	}
}

function label(n) {
	if (n.label) return n.label;
	if (n.name) return n.name;
	return "";
}
