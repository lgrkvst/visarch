fs = require('fs')
xml2js = require('xml2js');
//crossfilter = require('crossfilter');

var inpath = 'rsa/';
var filename = 'Fund & Portfolio Management.emx';
var outpath = 'json/';

// uml:Usage
var Link = function(id, name, description, supplier, client) {
	this.id = id; this.name = name; this.description = description; this.supplier = supplier; this.client = client;
};

// uml:Component
var Node = function(filename, id, x, y, name, description, compartment, keywords) {
	this.filename = filename; this.id = id; this.x = x; this.y = y; this.name = name; this.description = description; this.compartment = compartment; this.keywords = keywords; this.links = [];
	this.add = function (n) { // adds a link to this node (i.e. a Usage to this Component)

		for (var i = 0; i<this.links.length;i++) { // assert unique id before inserting
			if (this.links[i].id == n.id) return;
		}

		this.links.push(n);
		};
};

var foreign = new Node("foreign", "0", "0", "0", "foreign", "uml:Usage with suppliers or clients outside compartment");

// uml:Package
var Nodelist = function() {	
	this.list = [];
	this.add = function(n) {
		if (this.getNode()) return;
		this.list.push(n);
	};
	this.getNode = function(id) {
		for (var i = 0; i<this.list.length;i++)	if (this.list[i].id == id) return this.list[i];
		return false;
	}
};

var nodes = new Nodelist();

fs.readFile(inpath + filename, 'utf8', function (err,data) {
	if (err) {
			console.log(err);
			return;
		}

		// To display the whole deal, you can use console.log(util.inspect(result, false, null)), which displays the whole result.
		// https://github.com/Leonidas-from-XIV/node-xml2js
	xml2js.parseString(data, function(err, result) {
		if (err) {
			console.log(err);
			return;
			}
			
		// get compartment name
		var compartment = result["xmi:XMI"]["uml:Package"][0]["$"]["name"];
		for (r in result["xmi:XMI"]["uml:Package"][0]["packagedElement"]) {
			var n = result["xmi:XMI"]["uml:Package"][0]["packagedElement"][r]["packagedElement"];
			for (rr in result["xmi:XMI"]["uml:Package"][0]["packagedElement"][r]["packagedElement"]) { //should probably be recursive...
				var n = result["xmi:XMI"]["uml:Package"][0]["packagedElement"][r]["packagedElement"][rr];
				if (n["$"]["xmi:type"] == "uml:Component") {
					var node = new Node();
					node.compartment = compartment;

					// inline, i.e. no fragment
					if (!!n["$"]["name"]) {
						node.id = n["$"]["xmi:id"]
						node.name = n["$"]["name"];
						if (!!n["eAnnotations"]) {
							node.description = n["eAnnotations"][0]["details"][0]["$"]["key"];
						}
					}
					// fragment, i.e has href attr
					if (!!n["$"]["href"]) {
						var filename = n["$"]["href"].split("#")[0];
						filename = filename.replace(/&amp;/g, "&");
						filename = filename.replace(/%20/g, " ");
						node.filename = filename;
						node.id = n["$"]["href"].match(/[#]([^?]+)[?]/)[1];
					}
					
					nodes.add(node);
				}
				else if(n["$"]["xmi:type"] == "uml:Usage"){
					var l = new Link();

					l.id = n["$"]["xmi:id"]
					if (!!n["$"]["name"]) {	l.name = n["$"]["name"]; }
/*					if (!!n["eAnnotations"]) {
						if(!!n["eAnnotations"][0]["details"]) {
							l.description = n["eAnnotations"][0]["details"][0]["$"]["key"];
						}
					}
	*/
					if (!!n["$"]["supplier"]) { l.supplier = n["$"]["supplier"]; }					// inline suppliers (i.e. no fragments) are attributes of uml:Usage, instead of children(!). Thanks IBM...
					else if (!!n["supplier"]) {	
						var filename = n["supplier"][0]["$"]["href"].split("#")[0];
						filename = filename.replace(/&amp;/g, "&");
						filename = filename.replace(/%20/g, " ");
						l.filename = filename;
						l.supplier = n["supplier"][0]["$"]["href"].match(/[#]([^?]+)[?]/)[1];
					}

					if (!!n["$"]["client"]) { l.client = n["$"]["client"]; }								// inline clients (i.e. no fragments) are attributes of uml:Usage, instead of children(!). Thanks IBM...
					else if (!!n["client"]) {	
						var filename = n["client"][0]["$"]["href"].split("#")[0];
						filename = filename.replace(/&amp;/g, "&");
						filename = filename.replace(/%20/g, " ");
						l.filename = filename;
						l.client = n["client"][0]["$"]["href"].match(/[#]([^?]+)[?]/)[1];
					}

					var candidateNode = nodes.getNode(l.supplier);
					if (!!candidateNode){
						candidateNode.add(l);
					}	else foreign.add(l);

					var candidateNode = nodes.getNode(l.client);
					if (!!candidateNode){
						candidateNode.add(l);
					}	else foreign.add(l);

				}
			}
		}



/*	var inspect = 4;
		console.log("name: "+result["xmi:XMI"]["uml:Package"][0]["packagedElement"][inspect]["$"]["name"]);
		console.log(JSON.stringify(result["xmi:XMI"]["uml:Package"][0]["packagedElement"][inspect]["packagedElement"][0]));
*/
	//	console.log(result["xmi:XMI"]["uml:Package"][0]["packagedElement"][1]["$"]);
/*
		// <gammal>
		for (r in result["xmi:XMI"]["uml:Package"][0]["eAnnotations"][0]["references"]) {
			if (result["xmi:XMI"]["uml:Package"][0]["eAnnotations"][0]["references"][r]["$"]["xmi:type"] == "uml:Component") {
				// these should all be fragments:
				// <eAnnotations xmi:id="_6IMQQKHMEeKtYoxsgUitoA" source="com.ibm.xtools.uml.msl.fragments">
				// example href: Alfons_1.efx#_j2aw0JI1EeKAG8JDQZGr8A?Fund%20&%20Portfolio%20Management/Fund%20&%20Portfolio%20systems/Alfons?
				var href = result["xmi:XMI"]["uml:Package"][0]["eAnnotations"][0]["references"][r]["$"]["href"];
				var n = new Node(href.split("#")[0], href.match(/[#]([^?]+)[?]/)[1]);
				nodes.add(n);
				}
		}
		// </gammal>
		var r = result["umlnotation:UMLDiagram"];
		if (typeof r == "undefined") {
			console.log("ERR: Top node must be umlnotation:UMLDiagram");
			return;
			}
		
		for (c in r["children"]) {
			if (r["children"][c]["$"]["xmi:type"] == "umlnotation:UMLComponent") {
				var x = r["children"][c]["layoutConstraint"][0]["$"]["x"];
				var y = r["children"][c]["layoutConstraint"][0]["$"]["y"];
				var id = r["children"][c]["$"]["xmi:id"];
				var url = r["children"][c]["element"][0]["$"]["href"];

				filename = url.split("#")[0];
				filename = filename.replace(/&amp;/g, "&");
				filename = filename.replace(/%20/g, " ");

				nodes.add(id, url, x, y, filename);
				/*
				// read url and get real component name
				fs.readFile(inpath + filename, 'utf8', function (err,data) {
					if (err) {
						return;
						}
					console.log(x);
					});
					
			}
		}
		*/
		//console.log(nodes.list());
//	console.log(JSON.stringify(result["umlnotation:UMLDiagram"]));

//		console.log(JSON.stringify(result).substring(0,200));
		})
});


/*
fs.readdir(inpath, function (err, files) {
  if (err) {
    console.log(err);
    return;
  }
//  forEachFile("SEBmisc.log20130331");
	for (var i=0; i<files.length;i++) {
		forEachFile(files[i]);			
		}
});

function forEachFile(filename) {
	fs.readFile(inpath + filename, 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  var JSONstring = lceslog2lcesjson(data);
		if (JSONstring.length > 2) {
			fs.writeFile(outpath+filename + ".json", JSONstring);
		}
	});
}

function lceslog2lcesjson(s) {
		var i,j;
		var json=[];
//Wed May 29 02:47:24 CEST 2013;INFO;SALJSTOD;AD;multiExMerge;/Applications/A7510/1.0/A7510.xdp;successful pages:3
//Wed May 29 06:41:56 CEST 2013;INFO;SALJSTOD;AD;multiExMerge;/Applications/A7510/1.0/A7510.xdp;successful pages:3
			var lines = s.split("\n");
			for (i=0;i<lines.length;i++) {
				var o = {};
				var line = lines[i].split(";");
				if (line[1] == "INFO") {
					if (line[2] == "SALJSTOD" && line[3] == "AD") {
						// get date
						if (line[0].match(/CEST/)) var timestamp = new Date(line[0].replace(/CEST/, '+0200'));
						else if (line[0].match(/CET/)) var timestamp = new Date(line[0].replace(/CET/, '+0100'));
					else {console.log("error in line " + line);}
						
						o.t = timestamp.getTime();
						// formid
						o.f = line[5].split("/")[2];
						// pages
						var temp;
						if (temp = line[6].match(/pages:(\d)/)) {
							o.p = temp[1];
						}
						// channel
						switch(line[4]) {
							case "xml2pdf": o.c = "T"; break;
							case "singleExMergeA7479": o.c = "T"; break;
							case "multiExMerge": o.c = "K"; break;
							case "multiExMergeA7479": o.c = "K"; break;
						}
						json.push(o);

					} else {
					//NOT ;SALJSTOD;
					}
				} else {
					//;ERROR;
					}
			}
			return JSON.stringify(json);
	}
	
*/