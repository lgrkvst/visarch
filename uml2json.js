// example:
// Emma:visarch cla$ node uml2json.js -d rsa/

fs = require('fs')
xml2json = require('xml2json');
//crossfilter = require('crossfilter');

//var filename = 'Fund & Portfolio Management.emx'; 	// added 88 nodes; added 215 links; unaccounted for: 40
//var filename = 'Front System.emx'; 					// added 170 nodes; added 72 links; unaccounted for: 68
//var filename = 'Finance&Risk Systems.emx';

// kolla clientDependency - mycket sånt i Account & Liquidity...
var outpath = 'json/';
var VERBOSE = true;

// helper
function isArray(test_me) {
	return (Object.prototype.toString.call(test_me) === '[object Array]');
}

function L(o) {
	if (VERBOSE) console.log(o)
};

// Link is up to shape and encapsulated - also supports function chaining, i.e link.name("daName").type("uml:Usage");
function Link(id) {
	if (!id) throw ("Error: Link must be invoked with id");
 	this._id = id;
	this._name = this._type = this._description = this._source = this._target = this._filename = undefined;
}

Link.prototype.id = function(a)			{ if (a) { this._id = a; 			return this; } return this._id; }
Link.prototype.name = function(a)		{ if (a) { this._name = a; 			return this; } return this._name; }
Link.prototype.description = function(a){ if (a) { this._description = a;	return this; } return this._description; }
Link.prototype.filename = function(a)	{ if (a) { this._filename = a;		return this; } return this._filename; }
Link.prototype.source = function(a)		{ if (a) { this._source = a; 		return this; } return this._source; }
Link.prototype.target = function(a)		{ if (a) { this._target = a; 		return this; } return this._target; }
Link.prototype.type = function(a)		{ if (a) { if (a == "uml:Usage" || a == "uml:InformationFlow") { this._type = a; return this; } else throw("Error: Link object only supports uml:Usage and uml:InformationFlow (tried to pass: " + a + ")") } return this._type; }
Link.prototype.sourceString = function(){
	if (!this._type) throw("Error: cannot get sourceString without a _type");
	if (this._type == "uml:Usage") return "supplier";
	if (this._type == "uml:InformationFlow") return "informationSource";
	throw("Cannot return sourceString for _type: "+this._type);
}
Link.prototype.targetString = function(){
	if (!this._type) throw("Error: cannot get targetString without a _type");
	if (this._type == "uml:Usage") return "client";
	if (this._type == "uml:InformationFlow") return "informationTarget";
	throw("Cannot return targetString for _type: "+this._type);
}

// uml:Component
var Node = function(filename, id, x, y, name, description, compartment, keywords) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.filename = filename;
		this.compartment = compartment;
		this.keywords = keywords;
		this.size = 0;
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
	// demand match on both source and target
	if ((j = nodes.getNodeIndex(i.source())) && (k = nodes.getNodeIndex(i.target()))) {
//		/* represent links as indices into nodes array */
		linksarr.push({"source":j, "target":k, "name":i.name(), "type": i.type(), "description":i.description()});
//		/* represent links as id's refering nodes array */
//		linksarr.push({"source":i.source(), "target":i.target(), "name":i.name(), "type": i.type(), "description":i.description()});
		nodes.list[j].size++;
		nodes.list[k].size++;
	}
});

var data = {"nodes":nodes.list, "links":linksarr};

fs.writeFileSync(outpath + "nodes_links.json", JSON.stringify(data, function(key, val) {return val;}, "\t"));


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
		
			 if (!!result["xmi:XMI"] && !!result["xmi:XMI"]["uml:Package"]) var n = result["xmi:XMI"]["uml:Package"];
		else if (!!result["uml:Package"]) var n = result["uml:Package"];
		else if (!!result["uml:Model"]) var n = result["uml:Model"];
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
				} /*  removed else if since packagedElement can be both of type uml:Component AND have a packagedElement child. For instance:
				CAS
				Safewatch LU
				TFS
				CM-Caesar
				CTM
				Intranet - Global
				TLS
				PACS
				Global Service Provider
				ISAT
				PALS Stockholm
				*/
				if (n[i]["xmi:type"] == "uml:Component") {

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
				} else if (n[i]["xmi:type"] == "uml:Usage" || n[i]["xmi:type"] == "uml:InformationFlow") {
					var l = new Link(n[i]["xmi:id"]);
					l.type(n[i]["xmi:type"]);
					if ( !! n[i]["name"]) {
						l.name(n[i]["name"]);
					}
					if ( !! n[i]["eAnnotations"]) {
						try {
							if ( !! n[i]["eAnnotations"]["details"]) {
								l.description(n[i]["eAnnotations"]["details"]["key"]);
							}
						} catch (err) {}
					}
					
					if ( !! n[i][l.sourceString()]) {
						if (typeof n[i][l.sourceString()] == "string") l.source(n[i][l.sourceString()]);
						else {
							var filename = n[i][l.sourceString()]["href"].split("#")[0];
							filename = filename.replace(/&amp;/g, "&");
							filename = filename.replace(/%20/g, " ");
							l.filename(filename);
							l.source(n[i][l.sourceString()]["href"].match(/[#]([^?]+)[?]/)[1]);
						}
					}

					if ( !! n[i][l.targetString()]) {
						if (typeof n[i][l.targetString()] == "string") l.target(n[i][l.targetString()]);
						else {
							// Bug in RSA emx generation: multiple, identical <client... (See Core Systems.emx:192)
							if (isArray(n[i][l.targetString()])) var shouldBe_n_i_client_href = n[i][l.targetString()][0];
							else var shouldBe_n_i_client_href = n[i][l.targetString()];
							var filename = shouldBe_n_i_client_href["href"].split("#")[0];
							filename = filename.replace(/&amp;/g, "&");
							filename = filename.replace(/%20/g, " ");
							l.filename(filename);
							l.target(shouldBe_n_i_client_href["href"].match(/[#]([^?]+)[?]/)[1]);
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
