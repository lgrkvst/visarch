var labels2force = false;
var rotateLabels = false;
var drawOrigo = false;
var drawAngles = false;
var color = d3.scale.category20().domain(Compartments.RSA());

// http://stackoverflow.com/questions/9539294/adding-new-nodes-to-force-directed-layout

var w = $(window).width(),
	h = $(window).height();

net.setup(w,h);

var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
var link = svg.insert("g").attr("class", "links").selectAll(".link");
var node = svg.insert("g").attr("class", "nodes").selectAll(".node");

svg.append("filter").attr("id", "blurMe").append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "2.5");

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

	(JSON.parse(JSON.stringify(Compartments.all))).forEach(function (c) {
		autoSuggest.push(c);
	});

	$(function(){
		$("#q").autoSuggest(autoSuggest, {selectedValuesProp: "name", selectedItemProp: "name", searchObjProps: "name", startText: "Search...", selectionClick: function(elem){ console.log("selClick");elem.fadeTo("slow", 0.33); }, selectionRemoved: function(elem){ net.drop(elem2name(elem)); update(); elem.fadeTo("fast", 0, function(){ elem.remove(); }); },resultClick: function(data){ update([data.attributes]); }});
	});
	var json = JSON.parse('[{"name":"ODS","filename":"ODS_1.efx","compartment":"Fund & Portfolio Management","size":24,"link_count":1,"x":505.0909352338646,"y":305.37534861735395,"index":0,"weight":1,"px":505.117194568156,"py":305.34901234101943,"fixed":0},{"name":"MasterOfFunds","filename":"MasterOfFunds_1.efx","compartment":"Fund & Portfolio Management","size":5,"link_count":2,"x":565.078983423413,"y":279.1570968859196,"index":1,"weight":2,"px":565.0452118794856,"py":279.1471278562317,"fixed":0},{"name":"Freppen","filename":"Freppen_1.efx","compartment":"Fund & Portfolio Management","size":1,"link_count":1,"x":528.9779040231492,"y":224.54077385536712,"index":2,"weight":1,"px":528.9856256578644,"py":224.5771649834173,"fixed":0}]');
	var json2 = JSON.parse('[{"name":"COIS","description":"Output Management","compartment":"Processing Support Systems","size":6,"link_count":3,"index":0,"weight":3,"x":640.5575947907769,"y":249.7652401041375,"px":640.5575947907769,"py":249.7652401041375,"fixed":0},{"name":"VDR","description":"Archive","compartment":"Processing Support Systems","size":7,"link_count":3,"index":1,"weight":3,"x":541.7989785102069,"y":322.39137862214375,"px":541.831351837862,"py":322.40132546749464},{"name":"TCM Externa Fonder","filename":"TCM Externa Fonder_1.efx","compartment":"Fund & Portfolio Management","size":12,"link_count":1,"index":2,"weight":1,"x":526.1723849318851,"y":384.66751194136975,"px":526.2176643726731,"py":384.62993356567966,"fixed":0},{"name":"TCM Globala Fonder","filename":"TCM Globala Fonder_1.efx","compartment":"Fund & Portfolio Management","size":13,"link_count":2,"index":3,"weight":2,"x":551.0179168751013,"y":233.9042855525833,"px":551.0179168751013,"py":233.9042855525833,"fixed":0},{"name":"WODS","filename":"WODS_1.efx","compartment":"Fund & Portfolio Management","size":15,"link_count":0,"index":4,"weight":0,"x":615.9143308545406,"y":423.1853308247315,"px":615.9147650657752,"py":423.1309942729926,"fixed":0},{"name":"Amods","filename":"AMODS_1.efx","compartment":"Fund & Portfolio Management","size":6,"link_count":0,"index":5,"weight":0,"x":704.101934690794,"y":391.06552481692455,"px":704.0596022740817,"py":391.0347485599973},{"name":"BIW Core SE","description":"information warehouse","compartment":"Business Intelligence","size":15,"link_count":1,"index":6,"weight":1,"x":657.9475481256861,"y":310.8758987642387,"px":657.9475481256861,"py":310.8758987642387,"fixed":0}]');
	var json3 = JSON.parse('[{"name":"COIS","description":"Output Management","compartment":"Processing Support Systems","size":6,"link_count":1,"index":0,"weight":1,"x":647.210128940091,"y":414.4309034812764,"px":647.2232026565242,"py":414.4042045289921},{"name":"VDR","description":"Archive","compartment":"Processing Support Systems","size":7,"link_count":1,"index":1,"weight":1,"x":680.2222633257404,"y":360.50271244339194,"px":680.2104216467378,"py":360.51671495527694}]');
	var json4 = JSON.parse('[{"name":"ODS","filename":"ODS_1.efx","compartment":"Fund & Portfolio Management","size":24,"link_count":5,"index":0,"weight":5,"x":412.9381926062938,"y":569.1096493467539,"px":413.0768231507089,"py":569.0837781845803,"fixed":0},{"name":"WODS","filename":"WODS_1.efx","compartment":"Fund & Portfolio Management","size":15,"link_count":4,"index":1,"weight":4,"x":496.46652891451185,"y":743.3296871224875,"px":496.551729052007,"py":743.2270270380333,"fixed":0},{"name":"GLOBUS","filename":"GLOBUS_1.efx","compartment":"Fund & Portfolio Management","size":4,"link_count":2,"index":2,"weight":2,"x":581.3780395987019,"y":710.937125201789,"px":581.4177906789886,"py":710.8400675838049},{"name":"FinanceKit","filename":"FinanceKit_1.efx","compartment":"Fund & Portfolio Management","size":16,"link_count":4,"index":3,"weight":4,"x":397.51929136566366,"y":686.9850032832983,"px":397.6339405651427,"py":686.9172131999335,"fixed":0},{"name":"TradeSec","filename":"TradeSec_1.efx","compartment":"Fund & Portfolio Management","size":2,"link_count":2,"index":4,"weight":2,"x":498.49328804332913,"y":554.1416274889941,"px":498.5836030691126,"py":554.1144820095976,"fixed":0},{"name":"Porse","filename":"Porse_1.efx","compartment":"Fund & Portfolio Management","size":14,"link_count":4,"index":5,"weight":4,"x":535.4548429432465,"y":477.4883305011132,"px":535.5091962446238,"py":477.5084071567847,"fixed":0},{"name":"BIW Core SE","description":"information warehouse","compartment":"Business Intelligence","size":15,"link_count":2,"index":6,"weight":2,"x":514.9401142112059,"y":385.40792693698904,"px":515.0253598266889,"py":385.49038306421505,"fixed":0},{"name":"BNYM","description":"Outsourced FA/TA","compartment":"Fund & Portfolio Management","size":2,"link_count":1,"index":7,"weight":1,"x":607.7588181341603,"y":609.1307544171352,"px":607.7731332822357,"py":609.0872243284282,"fixed":0},{"name":"Compass","filename":"Compass_1.efx","compartment":"Fund & Portfolio Management","size":7,"link_count":1,"index":8,"weight":1,"x":469.6583495350637,"y":474.99993748805355,"px":469.7825296301845,"py":475.0255669471061,"fixed":0},{"name":"FAS","filename":"FAS_1.efx","compartment":"Fund & Portfolio Management","size":13,"link_count":8,"index":9,"weight":8,"x":546.6573227403569,"y":626.4653019539851,"px":546.7291255773573,"py":626.4092077471961,"fixed":0},{"name":"CAS","description":"Channel","compartment":"Core Systems","size":13,"link_count":2,"index":10,"weight":2,"x":847.0978491985433,"y":470.232352209953,"px":847.0135803445659,"py":470.25261727957724,"fixed":0},{"name":"Utlandsregistret","compartment":"Core Systems","size":9,"link_count":1,"index":11,"weight":1,"x":794.3779863439358,"y":390.11553757638205,"px":794.3124434186716,"py":390.19034582237816,"fixed":0},{"name":"PARC","compartment":"Core Systems","size":5,"link_count":1,"index":12,"weight":1,"x":642.438194791027,"y":301.36645909481535,"px":642.4352652897275,"py":301.49134253804107,"fixed":0},{"name":"Kurre","compartment":"Core Systems","size":8,"link_count":1,"index":13,"weight":1,"x":614.5300939481174,"y":414.85824956518655,"px":614.5536343816682,"py":414.8907058824117,"fixed":0},{"name":"Konny","compartment":"Core Systems","size":2,"link_count":3,"index":14,"weight":3,"x":757.9137517517908,"y":445.6424651626992,"px":757.8815360364625,"py":445.65710069470106},{"name":"Informationsregister","compartment":"Core Systems","size":4,"link_count":0,"index":15,"weight":0,"x":715.0048726376167,"y":692.8342003362295,"px":714.9871096287377,"py":692.7440501631605,"fixed":0},{"name":"Sebis","filename":"SEBIS.efx","compartment":"Core Systems","size":2,"link_count":0,"index":16,"weight":0,"x":874.7958354329393,"y":321.33427176313484,"px":874.6939636233986,"py":321.429496897199},{"name":"SwiftNet","compartment":"Core Systems","size":0,"link_count":0,"index":17,"weight":0,"x":923.5587929631553,"y":630.2168411675657,"px":923.428634169762,"py":630.1622414000692,"fixed":0},{"name":"SWIFT","compartment":"Core Systems","size":1,"link_count":0,"index":18,"weight":0,"x":612.2777860934974,"y":791.4638388115302,"px":612.3104736993289,"py":791.3283469621971},{"name":"SAAInterfacet","compartment":"Core Systems","size":4,"link_count":0,"index":19,"weight":0,"x":406.4863531361598,"y":390.79859629314876,"px":406.62188110383386,"py":390.85279793910513,"fixed":0},{"name":"Ebba","description":"Misc","compartment":"Core Systems","size":2,"link_count":0,"index":20,"weight":0,"x":505.92698759488087,"y":281.27923511843204,"px":506.0096310951103,"py":281.39912392944694},{"name":"InformationRegister","description":"Misc","compartment":"Core Systems","size":0,"link_count":0,"index":21,"weight":0,"x":860.0075701430483,"y":693.3558719523123,"px":859.911734224244,"py":693.2693675583633},{"name":"SEBIS MT","filename":"SEBIS MT.efx","compartment":"Core Systems","size":3,"link_count":1,"index":22,"weight":1,"x":766.944102114498,"y":614.186190513476,"px":766.8826076785568,"py":614.1313554226411,"fixed":0},{"name":"SEBIS DDA","filename":"SEBIS DDA.efx","compartment":"Core Systems","size":3,"link_count":1,"index":23,"weight":1,"x":712.6432400185261,"y":580.762981924255,"px":712.6262158085837,"py":580.7326758361544,"fixed":0},{"name":"SEBIS BT","filename":"SEBIS BT.efx","compartment":"Core Systems","size":0,"link_count":0,"index":24,"weight":0,"x":642.2102379800106,"y":223.29170298626502,"px":642.2136097466712,"py":223.4408638115295,"fixed":0},{"name":"SAA","description":"Channel","compartment":"Core Systems","size":2,"link_count":0,"index":25,"weight":0,"x":805.1724793152009,"y":762.3405953017398,"px":805.1048380409778,"py":762.2186255586156},{"name":"Skval","description":"Ledger","compartment":"Core Systems","size":6,"link_count":1,"index":26,"weight":1,"x":905.4165132417373,"y":439.1033408067004,"px":905.2845918965029,"py":439.1580824964411,"fixed":0},{"name":"Borre","compartment":"Core Systems","size":3,"link_count":0,"index":27,"weight":0,"x":845.2981702724245,"y":565.8343936711765,"px":845.2034053022513,"py":565.8127736442079,"fixed":0},{"name":"COIS","description":"Output Management","compartment":"Processing Support Systems","size":6,"link_count":4,"index":28,"weight":4,"x":600.9812907189455,"y":350.61097163502194,"px":601.0211928286919,"py":350.7059312546562,"fixed":0},{"name":"VDR","description":"Archive","compartment":"Processing Support Systems","size":7,"link_count":2,"index":29,"weight":2,"x":693.4123165517915,"y":378.2250476711671,"px":693.3845866765735,"py":378.2940804993551,"fixed":0},{"name":"Physical Mail","compartment":"Processing Support Systems","size":2,"link_count":0,"index":30,"weight":0,"x":667.4169502435471,"y":510.2446607141504,"px":667.4241127087272,"py":510.24378841535344,"fixed":0},{"name":"CLXP","description":"Misc","compartment":"Processing Support Systems","size":4,"link_count":0,"index":31,"weight":0,"x":953.7047116089554,"y":529.8338357584432,"px":953.5628862007716,"py":529.8345373788195},{"name":"TopCall","description":"Fax & sms","compartment":"Processing Support Systems","size":2,"link_count":0,"index":32,"weight":0,"x":707.9697578390592,"y":785.001848017494,"px":707.9506797059859,"py":784.8648602126041},{"name":"Kofax","description":"Capture","compartment":"Processing Support Systems","size":0,"link_count":0,"index":33,"weight":0,"x":773.1756534036199,"y":262.43964492958287,"px":773.1189913185615,"py":262.5621735271188}]');
//	update(json4);
//	update(json2);
//	update([{name: "ODS", x: 513.4825233096831, y:379.96832292114186}, {name: "MasterOfFunds", x: 484.98527632050804, y:321.02790120387453}, {name: "Freppen", x: 547.9421420574942, y:303.0621468436555}]);
//	update([{name: "ODS"},{name: "WODS"},{name: "GLOBUS"},{name: "FinanceKit"},{name: "TradeSec"},{name: "Porse"},{name: "BIW Core SE"},{name: "BNYM"},{name: "Compass"},{name: "FAS"}]);
//	update([{system:"COIS"}, {compartment:"Fund & Portfolio Management"}]);
//	update([{compartment:"Processing Support Systems", description:"compartment"}]);
//	update([{compartment:"Fund & Portfolio Management", description:"compartment"}]);
});

// typeof filter = [node] Object, optional
function update(filter) {
	if (!!filter) {
		var n;
		filter.forEach(function (f) {
			if (f.description == "compartment") {
				delete f.name;
				delete f.description;
			}
			if (!!f.size) /* explicit node declaration */ {
				n = [f];
			} else n = SS.filterNodes(f);
			n.forEach(function (n, i) {
				net.addNode(n, false);
			});
		});
	}

	// call start before doing svg stuff, since we want any new nodes instantiated
	net.force.start();

	link = link.data(net.force.links(), function (l) {
		return l.source.name + "-" + l.target.name;});
	link.enter().append("line", ".node").attr("class", "link");
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
			.attr("class", "nodelabeltext")
		    .text(function(n) {
				return n.name; });
		// add a hover:title in each group
		g.append("title").text(function(d) {
			return d.size + " links\n[" + d.compartment + "]";
		});
	}
	// put a circle in each group
	g.append("circle").attr("r", function(n) {
		return (4+n.size*0.5);
	})
	.style("fill", function(d) { return color(d.compartment);});
	/*
	if (!!filter && filter.length == 1) {
		//console.log(g.data());
		g.append("circle").attr("r", function(n) {
			return (16+n.size*0.5);
		})
		.attr("class", function(d) { return "node " + d.name; })
		.style("fill", function(d) { return "none";})
		.style("stroke", function(d) {return "#fff" }) //color(d.compartment);
		.style("stroke-width", "2px")
		.style("stroke-dasharray", "4,2");
	}
	*/
	
	node.exit().remove();
	g.selectAll("circle").on("click", function(n){
		n.fixed=true;
		console.log(n);
	});
	
	
	node.call(net.force.drag);
	
	if (drawOrigo) {
		var origo = svg.append("g").attr("id", "origo");
		origo.append("circle").attr("r", 4).style("fill", "#fff");
		origo.append("circle").attr("r", 7).style("stroke", "#fff").style("fill", "none").style("stroke-width", "1.5px");
	}
	
	if (labels2force) {
		var labelAnchors = [];
		var labelAnchorLinks = [];

		var force2 = d3.layout.force()
			.gravity(0)
			.linkDistance(0)
			.linkStrength(6)
			.charge(function (n, i) {
				if (i%2) return 0; else return -300;
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
		.attr("class", "nodelabeltext")

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
		var center = net.getCenter();
		if (drawOrigo) svg.select("#origo").attr("transform", "translate("+center.x+","+center.y+")");
			
			this.attr("transform", function(d,i) {
				var angle = 0;
				if (!labels2force) {
					if (text = this.childNodes[0].childNodes[0]) {
						var offset = 10+0.5*d.size;

						if (rotateLabels) {
							if (d.link_count==1) {
								if (p = net.getNeighbors(d)[0]) {
										var link_dX=d.x-p.x;
										var link_dY=d.y-p.y;
										angle = 57*myAtan(link_dY, link_dX);
										if (drawAngles) text.textContent = Math.floor(angle);
								}
							}
							if (d.link_count==2) {
								var p1 = net.getNeighbors(d)[0];
								var p2 = net.getNeighbors(d)[1];
								var link_dX=d.x-p1.x;
								var link_dY=d.y-p1.y;
								var link2_dX=d.x-p2.x;
								var link2_dY=d.y-p2.y;

								angle1 = 57*myAtan(link_dY, link_dX);
								angle2 = 57*myAtan(link2_dY, link2_dX);

								angle = (angle1 + angle2) / 2
								if (drawAngles) text.textContent = Math.floor(angle);
							}
							if (Math.abs(angle) > 90) {
								var anchor = "end";
								var offset = -offset
								var rotate = 180;
							} else {
								var anchor = "start";
								var rotate = 0;
							}
							text.setAttribute("transform", "rotate("+rotate+")");
							text.setAttribute("x", offset);
							text.setAttribute("text-anchor", anchor);

/*
							// always do:
							if (link_dX>0) {
								var anchor = "start";
								text.setAttribute("x", offset);
							} else {
								var anchor = "end";
								text.setAttribute("x", -offset);
							}
							text.setAttribute("text-anchor", anchor);
*/
						} else {
							var dX = d.x-center.x;
	//						var dY = d.y-center.y;

							if (dX>0) {
								var anchor = "start";
								text.setAttribute("x", offset);
							} else {
								var anchor = "end";
								text.setAttribute("x", -offset);
							}
							text.setAttribute("text-anchor", anchor);

						}
					} else console.log("node " + d.index + " has no label to align");
				}
				
				return "translate(" + d.x + "," + d.y + ") rotate("+angle+")";
			});
		}
FPS.init();
	net.force.on("tick", function(e) {
	//	FPS.sample();
		
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