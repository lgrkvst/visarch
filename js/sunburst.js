/** Draw radial menu - a quite undocumented module at the moment.
 * 
 * @author Christian Lagerkvist [christian.lagerkvist@seb.se]
 * Unfortunately, sunburst currently has a dependency to "groups", an array which functions as color-lookup. I'm ashamed.
	
	* Move stuff to css
 */
var radius = 180;
var sunburstColor = d3.scale.category20b();

var x = d3.scale.linear()
	.range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
	.range([0, radius]);


var partition = d3.layout.partition()
	.sort(null)
	.value(function(d) {
		return 1;
	});

var arc = d3.svg.arc()
	.startAngle(function(d, i) {
		return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
	})
	.endAngle(function(d) {
		return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
	})
	.innerRadius(function(d) {
		return Math.max(0, y(d.y));
	})
	.outerRadius(function(d) {
		return Math.max(0, y(d.y + d.dy));
	});

function drawRadial(root, n) {
	var sunburst = svg.append("g").attr("class", "radial");
	sunburst.attr("transform", "translate(" + n.x + "," + n.y + ")");
	var group = sunburst.datum(root).selectAll("g")
		.data(partition.nodes)
		.enter().append("g")
		.on("mouseover", function(n) {
			this.setAttribute("class", "arc mouseover");
			console.log(n.depth);
			if (n.depth > 0) {
				console.log(n.depth + " > 0");
				expand(n);
			}
		})
		.on("mouseout", function(n) {
			this.setAttribute("class", "arc");
		})
		.on("mouseup", function(n) {
			if (n.callback) {
				n.callback(n);
				sunburst.remove();
			} else {
				expand(n);
			}
		});

	var path = group.append("path")
		.attr("d", arc)
		.attr("id", function(d, i) {
			return "path" + i;
		})
		.attr("fill-opacity", function(d, i) {
			return d.depth ? 1 : 0;
		}) // hide inner ring
	.style("fill", function(d, i) {
		return "url(#m" + Math.floor(i / 3) % 20 + ")";
	})
		.style("stroke", "#272727").style("stroke-width", "3px");

	var clip_path = group.append("clipPath")
		.attr("id", function(d, i) {
			return "clipPath" + i;
		})
		.append("use")
		.attr("xlink:href", function(n, i) {
			return "#path" + i;
		});

	var text = group.append("g")
		.attr("clip-path", function(n, i) {
			return "url(#clipPath" + i + ")";
		})
		.append("text")
		.attr("dy", function(d, i) {
			var x = d.depth;
			return 1.5 * x * x - 13.5 * x + 47;
		})
	// Text height in each circle sector
	// .attr("dy", function(d) {
	// 	console.log(d.depth)
	// 	return "27";
	// })
	.attr("class", "nodelabeltext")
		.attr("fill", function(n, i) {
			if (label(n).toUpperCase() == "GRYTET") {
				console.log("i is " + i);
				console.log(color(1));
			}
			return d3.rgb(sunburstColor(Math.floor(i / 3) % 20)).brighter();
		})
		.attr("font-size", function(n) {
			var x = n.depth;
			return 3 * x * x - 25 * x + 72;
		})
		.append("textPath")
		.attr("xlink:href", function(n, i) {
			return "#path" + i;
		})
		.text(label)
		.attr("startOffset", function(n) {
			var x = n.depth;
			return (23 + 4.5 * x - 2.5 * x * x) + "%";
		})
		.attr("text-anchor", "middle")
		.attr("letter-spacing", function(n) {
			return 3 - n.depth;
		});

	function expand(d) {

		path.transition()
			.duration(250)
			.ease("cubic-out")
			.attrTween("d", arcTweenZoom(d));
	}
}
//d3.select(self.frameElement).style("height", h + "px");


// When zooming: interpolate the scales.

function arcTweenZoom(d) {
	var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
		yd = d3.interpolate(y.domain(), [d.y, 1]),
		yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
	return function(d, i) {
		return i ? function(t) {
			return arc(d);
		} : function(t) {
			x.domain(xd(t));
			y.domain(yd(t)).range(yr(t));
			return arc(d);
		};
	};
}


/** Determine label text */

function label(n) {
	//								if (!n.children) return;
	var label = n.label || n.name || "";
	label = label.toUpperCase();
	//								if (n.value == 1) return label.substring(0,1);
	return label;
}

/*************** SOME COLORS...? **************/
/*	.style("fill", function(d) {
		if (d.label == "freeze") return "url(#m14)";
		if (d.label == "remove") return "url(#m6)";
		if (d.label == "rogues") return "url(#m10)";
		if (d.label == "explode") return "url(#m15)";
		// some kind of link...
		return "url(#m" + color(d.group) + ")";
		})
*/
/******************* ICONS *******************/
/*
g.filter(function (n,i){if (n.hasOwnProperty("icon")) {return true;}})
	.append("use").attr("xlink:href", function (n) {
		return n.icon;
	})
	.attr("transform", function(d) {
		var rotate = "rotate(" + (((d.x + d.dx / 2 - Math.PI / 2) / Math.PI * 180)+90) + ")"
		var x = -this.getBBox().width/2;
		var y = -radius/3*(d.depth+epicentre+1);
		var translate = "translate(" + x + "," + y + ")"

	return rotate + " " + translate;
		});

var text = radial(g);
*/
/******************* LABEL LAYOUTS *******************/
/** Radial label layout */

function radial(g) {
	return text = g.append("text")
		.attr("transform", function(d) {
			return "rotate(" + (d.x + d.dx / 2 - Math.PI / 2) / Math.PI * 180 + ")";
		})
		.attr("x", function(d) {
			if (d.depth == 1) return radius / 3 * (d.depth + epicentre);
			return radius / 3 * (d.depth + epicentre + 1);
			return Math.sqrt(d.y + d.dy);
		})
		.attr("dx", "6") // margin
	.attr("dy", function(d) {
		return ".35em"
	})
		.text(function(n) {
			if (!n.icon) return label(n)
		})
		.attr("text-anchor", function(d) {
			if (d.depth == 1) return "end";
		})
		.attr("startOffset", "50%");
}
