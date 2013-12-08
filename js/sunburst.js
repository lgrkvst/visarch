function drawRadial(root, n) {

var radius = 90;
var scale = d3.scale.linear().domain([10, 90]).range([0, 5]);
var epicentre = scale(n.size); // break-through
var arc = d3.svg.arc()
	.startAngle(function(d) {
		return d.x;
		})
	.endAngle(function(d) {
		return d.x + d.dx;
		})
	.innerRadius(function(d) {
		if (d.label == "explode") return radius/3*(d.depth+epicentre+0.30);
		return radius/3*(d.depth+epicentre);
		})
	.outerRadius(function(d) {
		return radius/3*(d.depth+epicentre+1);
		})
//	.cornerRadius(6) /* OBS anpassad version av d3.min.js från bm-w (via github), pull-req men ej merge:ad, idag är det 2013-07-19... */;

var partition = d3.layout.partition()
	.sort(function(a, b) {
		return (a.compartment < b.compartment) ? 1 : -1; 
		})
	.size([2 * Math.PI, radius * radius])
	.value(function(d) {
	return Math.sqrt(d.size); // try d.size for action
});
//	console.log(arc.innerRadius("150"));

/*************** BASE CONTAINER **************/
var sunburst = svg.append("g").attr("class", "radial");
sunburst.attr("transform", "translate(" + n.x + "," + n.y + ")");
/*************** BASE PALLET **************/
var pallet = sunburst.append("circle").attr("r", function (){
	return radius/3*(4+epicentre);
	})
	.attr("class", "pallet");

/*************** INTERACTION **************/
var g = sunburst.datum(root).selectAll("g").data(partition.nodes).enter().append("g").attr("transform","rotate(0)").on("mouseover", function(n) {
	var path = this.childNodes[0];
	path.setAttribute("class", "arc mouseover");
}).on("mouseout", function(n) {
	var path = this.childNodes[0];
	path.setAttribute("class", "arc");
}).on("mouseup", function(node) {
	sunburst.remove();
	if (node.callback) {
		node.callback(node);
	}

	});
/*************** ARCS / PARTITIONS **************/

g.append("path")
	.attr("display", function(d) {
		return d.depth ? null : "none";
		}) // hide inner ring
	.attr("class", "arc")
	.attr("d", arc)
	.attr("id", function(d, i) {
		return "path" + i;
		})
	.style("stroke", "#272727").style("stroke-width", "3px")
	.style("fill", function(d) {
		if (d.label == "freeze") return "url(#m14)";
		if (d.label == "remove") return "url(#m6)";
		if (d.label == "rogues") return "url(#m10)";
		if (d.label == "explode") return "url(#m15)";
		return "url(#m" + Compartments.RSA().indexOf(d.compartment) + ")";
		})
	.style("fill-rule", "evenodd"); /*  why? */

/******************* ICONS *******************/

g.filter(function (n,i){if (n.hasOwnProperty("icon")) {return true;}})
	.append("use").attr("xlink:href", function (n) {
		return n.icon;
	})
	.attr("transform", function(d) {
		var rotate = "rotate(" + (((d.x + d.dx / 2 - Math.PI / 2) / Math.PI * 180)+90) + ")"
		var x = -this.getBBox().width/2;
		var y = -radius/3*(d.depth+epicentre+1); /* radie */
		var translate = "translate(" + x + "," + y + ")"

	return rotate + " " + translate;
		});

var text = radial(g);

/******************* LABEL LAYOUTS *******************/

function horizontal(g) {
	return text = g.append("text").attr("transform", function(d) {
			var sizefactor = 1.3;
			var x = arc.centroid(d)[0] * sizefactor;
			var y = arc.centroid(d)[1] * sizefactor;
			return "translate(" + x + "," + y + ")";
			})
		.attr("dy", function(d) {
			return ".35em";
			})
		.attr("class", "nodelabeltext").text(function(d) {
			return d.label;
			})
		.text(function(n){
			if (!n.icon) return label(n);
			})
		.attr("text-anchor", function(d) {
			if (d.depth == 1) return "middle"
			if (arc.centroid(d)[0] < 0) return "end";
			else return "start";
			});
		}

function radial(g) {
	return text = g.append("text")
		.attr("transform", function(d) {
			return "rotate(" + (d.x + d.dx / 2 - Math.PI / 2) / Math.PI * 180 + ")";
			})
		.attr("x", function(d) {
			if (d.depth == 1) return radius/3*(d.depth+epicentre);
			return radius/3*(d.depth+epicentre+1);
			return Math.sqrt(d.y + d.dy);
			})
		.attr("dx", "6") // margin
		.attr("dy", function(d) {
			return ".35em"
			})
		.text(function(n) {
			if (!n.icon) return label(n)
			})
		.attr("text-anchor", function (d) {
			if (d.depth == 1) return "end";
			})
		.attr("startOffset", "50%");
	}

function curved(g) {
	return text = g.append("text")
		.attr("dy", function(d) {
			if (d.depth == 1) return "23";
			return "18";
			})
		.attr("x", function(d) {
			return Math.sqrt(d.y);
			})
	// Textens höjd i respektive cirkelsektor
	// .attr("dy", function(d) {
	// 	console.log(d.depth)
	// 	return "27";
	// })
		.attr("class", "nodelabeltext").append("textPath").attr("xlink:href", function(n, i) {
			return "#path" + i;
			})
		.text(function(n) {
			if (label(n).length > 7) return label(n).substring(0, 7) + ".";
			else return label(n)+""
			})
		.attr("startOffset", function(n){
			if (n.depth==1) return "0%";
			return "9%";
			})
		.attr("text-anchor", "middle");
	}
}

function label(n) {
if (n.label) return n.label;
if (n.name) return n.name;
return "";
}