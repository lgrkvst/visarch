					var arc = d3.svg.arc()
						.startAngle(function (d) {
						return d.x;
					}) /* d.x+0.05 = tänder... */
						.endAngle(function (d) {
						return d.x + d.dx;
					})
						.innerRadius(function (d) {
						return Math.sqrt(d.y);
					})
						.outerRadius(function (d) {
						return Math.sqrt(d.y + d.dy);
					});

					function drawRadial(root, n) {
						var radius = 240; // lagom för size = 7
						//						console.log(arc.innerRadius(215))

						var partition = d3.layout.partition()
							.sort(null)
							.size([2 * Math.PI, radius * radius])
							.value(function (d) {
							return d.size; // try d.size for action
						});

						//	console.log(arc.innerRadius("150"));
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
							.on("mouseup", function (node) {
							if (node.name == "SOURCE") {
								net.addNode(n, true)
								update();
							} else if (node.name == "REMOVE") {
								net.drop(n.name);
								update();
							} else {
								update([{
										"name": node.name
									}]);
							}
							sunburst.remove();
						});
						g.append("path")
							.attr("display", function (d) {
							return d.depth ? null : "none";
						}) // hide inner ring
						.attr("d", arc)
							.attr("id", function (d, i) {
							return "path" + i;
						})
							.style("stroke", "#fff")
							.style("fill", function (d) {
							if (d.name == "SOURCE") return "#444";
							if (d.name == "TARGET") return "#888";
							if (d.name == "REMOVE") return "#c00";
							if (d.compartment) {
								var hsl = d3.hsl(color(d.compartment));
								//				hsl.s = 0.1;
								//				hsl.l = 0.4;
								return hsl.darker();
							}
						})
							.style("fill-rule", "evenodd");

						var text = g.append("text")
							.attr("dy", function (d) {
							if (d.depth == 1) return "23";
							return "18";
						})
							.attr("letter-spacing", function (d) {
							if (d.depth > 1) return 0;
							return 2
						})
							.attr("transform", function (d) {
							if (d.name == "SOURCE") return "0";
							if (d.name == "TARGET") return "0";
							if (d.name == "REMOVE") return "0";

							return "rotate(" + (d.x + d.dx / 2 - Math.PI / 2) / Math.PI * 180 + ")";
						})
							.attr("x", function (d) {
							if (d.name == "SOURCE") return "0";
							if (d.name == "TARGET") return "0";
							if (d.name == "REMOVE") return "0";
							return Math.sqrt(d.y);
						})

						//   									// RUNTOMKRING
						//   				  			      	.attr("transform", function(d) {
						//   											var x = arc.centroid(d)[0];
						//   											var y = arc.centroid(d)[1];
						//   											if (x<0) x-=this.getBBox().width;
						//   											
						//   				  							return "translate("+x+","+y+")"; 
						//   				  						})

						.attr("dx", "6") // margin
						.attr("dy", function (d) {
							if (d.name == "SOURCE") return "1.6em";
							if (d.name == "TARGET") return "1.6em";
							if (d.name == "REMOVE") return "1.6em";

							return ".35em"
						}) // vertical-align
						.attr("font-size", function (n) {
							return 14 + 0.1 * n.size;
						})
							.attr("class", "nodelabeltext")
							.text(function (d) {
							if (d.name == "SOURCE") return "";
							if (d.name == "TARGET") return "";
							if (d.name == "REMOVE") return "";
							return d.name;
						})
						//   				  						.attr("text-anchor", function(d) {
						//   				  							if (d.depth == 1) return "middle"
						//   				  							if (arc.centroid(d)[0]<0) return "end";
						//   				  							else return "start";
						//   				  						})
						.attr("display", function (d) {
							return d.depth ? null : "none";
						}); // hide inner
						// visar namnet längs med varje båge
						// funkar för små menyer

						/*

											// visar namnet längs med varje båge
											// funkar för små menyer
											var text = g.append("text")
												.attr("dy", function(d) {
													if (d.depth == 1) return "18";
													return "15";
												})
												.attr("letter-spacing", function(d){
													if (d.depth > 1) return 0;
													return 2
												});
*/

						text.append("textPath")
							.attr("xlink:href", function (n, i) {
							return "#path" + i;
						})
							.text(function (n) {
							if (n.name != "SOURCE" && n.name != "TARGET" && n.name != "REMOVE") return "";
							if (!n.depth) return "";
							if (n.name.length > 9) return n.name.substring(0, 9) + ".";
							else return n.name
						})
							.attr("startOffset", "23%")
							.attr("text-anchor", "middle");

					}