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
		$("#q").autoSuggest(autoSuggest, {selectedValuesProp: "name", selectedItemProp: "name", searchObjProps: "name", startText: "Search...", selectionClick: function(elem){ console.log("selClick");elem.fadeTo("slow", 0.33); }, selectionRemoved: function(elem){ net.drop(elem2name(elem)); update(); elem.fadeTo("fast", 0, function(){ elem.remove(); }); },resultClick: function(data){ update([data.attributes]); }});
	});
	var json = JSON.parse('[{"name":"ODS","filename":"ODS_1.efx","compartment":"Fund & Portfolio Management","size":24,"link_count":1,"x":505.0909352338646,"y":305.37534861735395,"index":0,"weight":1,"px":505.117194568156,"py":305.34901234101943,"fixed":0},{"name":"MasterOfFunds","filename":"MasterOfFunds_1.efx","compartment":"Fund & Portfolio Management","size":5,"link_count":2,"x":565.078983423413,"y":279.1570968859196,"index":1,"weight":2,"px":565.0452118794856,"py":279.1471278562317,"fixed":0},{"name":"Freppen","filename":"Freppen_1.efx","compartment":"Fund & Portfolio Management","size":1,"link_count":1,"x":528.9779040231492,"y":224.54077385536712,"index":2,"weight":1,"px":528.9856256578644,"py":224.5771649834173,"fixed":0}]');
	var json2 = JSON.parse('[{"name":"COIS","description":"Output Management","compartment":"Processing Support Systems","size":6,"link_count":3,"index":0,"weight":3,"x":640.5575947907769,"y":249.7652401041375,"px":640.5575947907769,"py":249.7652401041375,"fixed":0},{"name":"VDR","description":"Archive","compartment":"Processing Support Systems","size":7,"link_count":3,"index":1,"weight":3,"x":541.7989785102069,"y":322.39137862214375,"px":541.831351837862,"py":322.40132546749464},{"name":"TCM Externa Fonder","filename":"TCM Externa Fonder_1.efx","compartment":"Fund & Portfolio Management","size":12,"link_count":1,"index":2,"weight":1,"x":526.1723849318851,"y":384.66751194136975,"px":526.2176643726731,"py":384.62993356567966,"fixed":0},{"name":"TCM Globala Fonder","filename":"TCM Globala Fonder_1.efx","compartment":"Fund & Portfolio Management","size":13,"link_count":2,"index":3,"weight":2,"x":551.0179168751013,"y":233.9042855525833,"px":551.0179168751013,"py":233.9042855525833,"fixed":0},{"name":"WODS","filename":"WODS_1.efx","compartment":"Fund & Portfolio Management","size":15,"link_count":0,"index":4,"weight":0,"x":615.9143308545406,"y":423.1853308247315,"px":615.9147650657752,"py":423.1309942729926,"fixed":0},{"name":"Amods","filename":"AMODS_1.efx","compartment":"Fund & Portfolio Management","size":6,"link_count":0,"index":5,"weight":0,"x":704.101934690794,"y":391.06552481692455,"px":704.0596022740817,"py":391.0347485599973},{"name":"BIW Core SE","description":"information warehouse","compartment":"Business Intelligence","size":15,"link_count":1,"index":6,"weight":1,"x":657.9475481256861,"y":310.8758987642387,"px":657.9475481256861,"py":310.8758987642387,"fixed":0}]');
//	update(json2);
//	update([{name: "ODS", x: 513.4825233096831, y:379.96832292114186}, {name: "MasterOfFunds", x: 484.98527632050804, y:321.02790120387453}, {name: "Freppen", x: 547.9421420574942, y:303.0621468436555}]);
//	update([{name: "ODS"},{name: "WODS"},{name: "GLOBUS"},{name: "FinanceKit"},{name: "TradeSec"},{name: "Porse"},{name: "BIW Core SE"},{name: "BNYM"},{name: "Compass"},{name: "FAS"}]);
//	update([{system:"COIS"}, {compartment:"Fund & Portfolio Management"}]);
//	update({compartment:"Processing Support Systems", description:"compartment"});
//	update([{compartment:"Fund & Portfolio Management", description:"compartment"}]);
});

// typeof filter = [node] Object, optional
function update(filter) {
	if (!!filter) {
		var n;
		console.log(typeof filter);
		console.log(filter);
		filter.forEach(function (f) {
			if (f.description == "compartment") {
				delete f.name;
				delete f.description;
			}
			if (!!f.size) /* explicit node declaration */ {
				n = [f];
			} else n = SS.filterNodes(f);
			n.forEach(function (n, i) {
				net.addNode(n);
			});
		});
//	var f = svg.append("filter").attr("id", "blurMe").append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "1");
		net.addNode({name:"[0,0]", size:"4", compartment:"ExternalSystems"});
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
	var g = node.enter().append("g")
		.attr("class", function(d) { return "node " + d.name; })
		.attr("transform", function() {return "translate(" + w/2 + "," + h/2 + ")"});
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
	.style("fill", function(d) { if (d.name == "[0,0]") return "#000"; return color(d.compartment);})
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
		})
		.attr("x", function(n) {
			return 10+0.7*n.size;
		})
		.attr("font-size", function(n){
			return 14+0.1*n.node.size;
		})
		


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

								var asd = d.name;
								console.log(asd);
								if (p = net.getNeighbors(d)[0]) {
									var link_dX=d.x-p.x;
									var link_dY=d.y-p.y;

									if (rotateLabels) {
										angle = 180*Math.atan(link_dY/link_dX) / Math.PI;
									}
									if (link_dX>0) {
										var anchor = "start";
										text.setAttribute("x", offset);
									} else {
										var anchor = "end";
										text.setAttribute("x", -offset);
									}
									text.setAttribute("text-anchor", anchor);
								}
/*							if (d.link_count==2) {
								var p1 = net.getNeighbors(d)[0];
								var p2 = net.getNeighbors(d)[1];
								var link_dX=d.x-p1.x;
								var link_dY=d.y-p1.y;
								var link2_dX=d.x-p2.x;
								var link2_dY=d.y-p2.y;

								angle1 = 180*Math.atan(link_dY/link_dX) / Math.PI;
								angle2 = 180*Math.atan(link2_dY/link2_dX) / Math.PI;

								angle = (angle1 + angle2) / 2
								if (link_dX>0) {
									var anchor = "start";
									text.setAttribute("x", offset);
								} else {
									var anchor = "end";
									text.setAttribute("x", -offset);
								}
								text.setAttribute("text-anchor", anchor);
							}
							*/
/*
						if (dX > -10) {
							text.setAttribute("x", offset);
							text.setAttribute("text-anchor", "start");
						} else {
							text.setAttribute("x", -offset);
							text.setAttribute("text-anchor", "end");			
						}
						*/
					} else console.log("fail");
				}
				if (d.name=="[0,0]") {
					d.x = net.getOpticalCenter().x;
					d.y = net.getOpticalCenter().y;
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
						if (rotateLabels && i==0) {
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