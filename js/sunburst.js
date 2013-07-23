					var radius = Math.min(w, h) / 2;
					var radius = 100;


					var partition = d3.layout.partition()
						.sort(null)
						.size([2*Math.PI, radius*radius])
						.value(function (d) {
						return 1; // try d.size for action
					});



					var arc = d3.svg.arc()
					    .startAngle(function(d) { return d.x; }) /* d.x+0.05 = tänder... */
					    .endAngle(function(d) { return d.x + d.dx; })
					    .innerRadius(function(d) { return Math.sqrt(d.y); })
					    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

					function drawRadial(root, n) {
						var sunburst = svg.append("g").attr("class", "radial");
						sunburst.attr("transform", "translate(" + n.x + "," + n.y + ")");
						var g = sunburst.datum(root)
							.selectAll("g")
							.data(partition.nodes)
							.enter()
							.append("g")
							.on("mouseover", function (n) {
								var path = this.childNodes[0];
								path.style.fill = d3.rgb(path.style.fill).darker();
							})
							.on("mouseout", function (n) {
								var path = this.childNodes[0];
								path.style.fill = d3.rgb(path.style.fill).brighter();
							})
							.on("mouseup", function(n) {
								update([{"name": n.name}]);
								sunburst.remove();
							});
						g.append("path")
							.attr("display", function (d) {
									return d.depth ? null : "none";
								}) // hide inner ring
							.attr("d", arc)
							.attr("id", function (d,i) {return "path"+i;})
							.style("stroke", "#fff")
							.style("fill", function (d) {
								if (d.name=="source") return "#444";
								if (d.name=="target") return "#888";
								return color(d.compartment);
							})
							.style("fill-rule", "evenodd");

						/*
						var path = svg.append("path")
						    .attr("d", arc)
						    .attr("id", "path1")
						    .attr("transform", "translate(200,200)")
						    .attr("fill","#ccf")

						// Add a text label.
						var text = svg.append("text")
						    .attr("x", 6)
						    .attr("dy", 15);

						text.append("textPath")
						    .attr("stroke","black")
						    .attr("xlink:href","#path1")
						    .text("abc");
						*/


						var text = g.append("text")
							.attr("dy", "14")
							.attr("letter-spacing", function(d){
								if (d.depth > 1) return 0;
								return 2
							});
							
						text.append("textPath")
							.attr("xlink:href", function(n,i) {return "#path"+i;})
							.text(function (n){return n.name;})
							.attr("startOffset", "23%")
							.attr("text-anchor", "middle");

//  			      	.attr("transform", function(d) {
//  							return "translate("+arc.centroid(d)+")"; 
//  						})
//  				      	.attr("x", "6") // margin
//  				      	.attr("dy", ".35em") // vertical-align
//  						.attr("font-size", function (n) {
//  							return 14 + 0.1 * n.size;
//  						})
//  						.attr("class", "nodelabeltext")
//  						.text(function (n) {
//  							return n.name;
//  						})
//  						.attr("text-anchor", function(d) {
//  							console.log(this.getBBox())
//  							console.log(d);
//  							if (d.depth == 1) return "middle"
//  							if (arc.centroid(d)[0]<0) return "end";
//  							else return "start";
//  						})
//  						.attr("display", function(d) {return d.depth ? null : "none"; }); // hide inner
					}