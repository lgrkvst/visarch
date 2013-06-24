fs = require('fs')
xml2json = require('xml2json');
//crossfilter = require('crossfilter');

//var filename = 'Fund & Portfolio Management.emx'; 	// added 88 nodes; added 215 links; unaccounted for: 40
//var filename = 'Front System.emx'; 					// added 170 nodes; added 72 links; unaccounted for: 68
//var filename = 'Finance&Risk Systems.emx';

// kolla clientDependency - mycket sånt i Account & Liquidity...
var outpath = 'json/';
var VERBOSE = true;
var SIZE_STEP = 0.4; // increase size of node with 2.5 per link

// helper
function isArray(test_me) {
	return (Object.prototype.toString.call(test_me) === '[object Array]');
}

function L(o) {
	if (VERBOSE) console.log(o)
};

// uml:Usage
var Link = function(id, name, description, supplier, client) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.supplier = supplier;
		this.client = client;
		this.source = supplier;
		this.target = client;
	};

// uml:Component
var Node = function(filename, id, x, y, name, description, compartment, keywords) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.filename = filename;
		this.compartment = compartment;
		this.keywords = keywords;
		this.size = 4;
	};

var links = [];
var rogue = [];

// uml:Package
var Nodelist = function() {
		this.list = [];
		this.add = function(n) {
			if (this.getNode()) return;
			this.list.push(n);
		};
		this.getNode = function(id) {
			for (var i = 0; i < this.list.length; i++) if (this.list[i].id == id) return this.list[i];
			return false;
		}
		this.getNodeIndex = function(id) {
			for (var i = 0; i < this.list.length; i++) if (this.list[i].id == id) return i;
			return false;
		}
		this.getNodeOrNew = function(id) {
			for (var i = 0; i < this.list.length; i++) if (this.list[i].id == id) return this.list[i];
			return new Node();
		}
	};

var nodes = new Nodelist();

// replace option parsing with optimist module
if(process.argv[2] == '-f') var filename = process.argv[3];
if(process.argv[4] == '-f') var filename = process.argv[5];
if(process.argv[2] == '-d') var inpath = process.argv[3];
if(process.argv[4] == '-d') var inpath = process.argv[5];

if (typeof inpath == "undefined" && typeof filename == "undefined") {
	console.log("Flags: -f files -d directory [rsa/]");
	process.exit();
}

if (typeof inpath == "undefined") inpath = "rsa/";
if (typeof filename == "undefined") {
	var files = fs.readdirSync(inpath);
	files.forEach(function (filename) {
		if (filename.match(/[.]emx$/)) emx(inpath + filename, 0);
	});

} else emx(inpath + filename, nodes, 0);

// resolve id's using nodelist.list indices
var j,k;
var linksarr = [];
links.forEach(function (i) {
	// demand match on both supplier (source) and client (target)
	if ((j = nodes.getNodeIndex(i.supplier)) && (k = nodes.getNodeIndex(i.client))) {
		linksarr.push({"source":j, "target":k, "name":i.name, "description":i.description});
		nodes.list[j].size+=SIZE_STEP;
		nodes.list[k].size+=SIZE_STEP;
	}
});

var data = {"nodes":nodes.list, "links":linksarr};

fs.writeFileSync(outpath + "nodes_links.json", JSON.stringify(data, function(key, val) {if (key=="id") return undefined; else return val;}, "\t"));


/*******************************
  * EMX - THE ACTUAL PARSER
  *
  *
  *
  *
  ******************************/


function emx(filepath, depth) {
	var data = fs.readFileSync(filepath, 'utf8');
		L("Processing file " + filepath + "...");

		var result = xml2json.toJson(data, {
			object: true
		});
		if ( !! result["xmi:XMI"] && !!result["xmi:XMI"]["uml:Package"]) var n = result["xmi:XMI"]["uml:Package"];
		else if ( !! result["uml:Package"]) var n = result["uml:Package"];
		else if (!!result["xmi:XMI"] && result["xmi:XMI"]["uml:Model"]) var n = result["xmi:XMI"]["uml:Model"];

		// get compartment name
		if (!!n.name) var compartment = n.name;
		else var compartment = n["uml:Package"].name;
		
		if ( !! n.packagedElement) parsePackagedElement(n.packagedElement, 0);
		else {
			L("FATAL: root node MUST contain packagedElement.");
			process.exit();
		}

		function parsePackagedElement(n, depth) {
			for (var i = 0; i < n.length; i++) {
				if ( !! n[i]["packagedElement"]) {
					parsePackagedElement(n[i]["packagedElement"], depth + 1);
				} else if (n[i]["xmi:type"] == "uml:Component") {
					var node = new Node(); // replace with getNodeOrNew()
					node.compartment = compartment;

					// fragment, i.e has href attr
					if ( !! n[i]["href"]) {
						var filename = n[i]["href"].split("#")[0];
						filename = filename.replace(/&amp;/g, "&");
						filename = filename.replace(/%20/g, " ");
						node.filename = filename;
						node.id = n[i]["href"].match(/[#]([^?]+)[?]/)[1];

						L("	Processing file " + node.filename + "...");
						var data = fs.readFileSync(inpath + node.filename, "utf-8");
							var result = xml2json.toJson(data, {
								object: true
							});

							if ( !! result["xmi:XMI"]) var m = result["xmi:XMI"]["uml:Component"];
							else if ( !! result["uml:Component"]) var m = result["uml:Component"];
							else {
								L("FATAL: malformed file: ");
								L(result);
								L("Exiting...");
								process.exit();
							}

							if ( !! m) {
								node.name = m["name"];
							}
							nodes.getNode(node.id).name = node.name;

							//if (n.id == "_oM0ZwLM5EeKMn7FLn8deCA") L(result);
							// F&PFm reports 88 nodes and 215 links, altough I accidentaly discovered that logging i=212 inside an async call... Bug lurking?
/*
													// clientDependancy points to uml:Usage - probably a cross reference
													if (!!result["uml:Component"]["clientDependency"]) {
														for (var i=0; i<result["uml:Component"]["clientDependency"].length; i++) {
															// L(result["uml:Component"]["clientDependency"][i]["$"]["href"].split("#")[0]);
															}	
														}							
														else { // fragment has no links
													}
													*/
					}

					// inline, i.e. no fragment
					if ( !! n[i]["name"]) {
						node.id = n[i]["xmi:id"]
						node.name = n[i]["name"];
						try {
							if ( !! n[i].eAnnotations) {
								node.description = n[i].eAnnotations.details.key;
							}
						} catch (err) {
							// eAnnotation behöver inte innehålla details.key, däremot kan packagedElement innehålla ownedComment > body...
							// Kolla t ex ICP i Account & Liquidity...
							L("no details->key for: " + node.name);
						}
					}
					nodes.add(node);
				} else if (n[i]["xmi:type"] == "uml:Usage") {
					var l = new Link();
					l.id = n[i]["xmi:id"]
					if ( !! n[i]["name"]) {
						l.name = n[i]["name"];
					}
					if ( !! n[i]["eAnnotations"]) {
						try {
							if ( !! n[i]["eAnnotations"]["details"]) {
								l.description = n[i]["eAnnotations"]["details"]["key"];
							}
						} catch (err) {}
					}

					if ( !! n[i]["supplier"]) {
						if (typeof n[i]["supplier"] == "string") l.supplier = n[i]["supplier"];
						else {
							var filename = n[i]["supplier"]["href"].split("#")[0];
							filename = filename.replace(/&amp;/g, "&");
							filename = filename.replace(/%20/g, " ");
							l.filename = filename;
							l.supplier = n[i]["supplier"]["href"].match(/[#]([^?]+)[?]/)[1];
						}
					}

					if ( !! n[i]["client"]) {
						if (typeof n[i]["client"] == "string") l.client = n[i]["client"];
						else {
							// Bug in RSA emx generation: multiple, identical <client... (See Core Systems.emx:192)
							if (isArray(n[i]["client"])) var shouldBe_n_i_client_href = n[i]["client"][0];
							else var shouldBe_n_i_client_href = n[i]["client"];
							var filename = shouldBe_n_i_client_href["href"].split("#")[0];
							filename = filename.replace(/&amp;/g, "&");
							filename = filename.replace(/%20/g, " ");
							l.filename = filename;
							l.client = shouldBe_n_i_client_href["href"].match(/[#]([^?]+)[?]/)[1];
						}
					}
					links.push(l);

				} else if (n[i]["xmi:type"] == "uml:Package") {
					if (n[i]["href"]) {
						var filename = n[i]["href"].split("#")[0];
						filename = filename.replace(/&amp;/g, "&");
						filename = filename.replace(/%20/g, " ");
						emx(inpath + filename, depth + 1);
					} else { L("Warning: uml:Package without external reference: " + n[i]["name"]); }
				} else {
					L("no match for: "); L(n[i]); // uml:Interface
					// denna raden i Account & Liquidity bråkar:
					// <packagedElement xmi:type="uml:Interface" xmi:id="_Kk4j4KEXEeKWMLRKamTaBw" name="Interface1"/>

				}
			}
		}
		L(filepath + " turned up " + nodes.list.length + " nodes");
}
