fs = require('fs')
xml2js = require('xml2js');
//crossfilter = require('crossfilter');

var inpath = 'C:/CC/EAModels/Maintenance object level/';
var filename = 'Fund & Portfolio Management.emx';
var outpath = 'json/';
var Node = function(id, url, x, y, name) {
	this.id = id; this.url = url; this.x = x; this.y = y, this.name = name;
	}

var nodes = function() {	
	var nodelist = [];
	return {
		add: function(id, url, x, y, name) {

			var n = new Node(id, url, x, y, name);
			nodelist.push(n);
		},
		list: function() {return nodelist;}
	}
}();

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
		for (r in result["xmi:XMI"]["uml:Package"][0]["eAnnotations"][0]["references"]) {
			if (result["xmi:XMI"]["uml:Package"][0]["eAnnotations"][0]["references"][r]["$"]["xmi:type"] == "uml:Component") {
				console.log(result["xmi:XMI"]["uml:Package"][0]["eAnnotations"][0]["references"][r]["$"]["href"]);
				}
		}
/*
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