/** __config.js__ defines data sources for nodes and links. It has a number of convenience methods for selecting nodes and links by name, id, group and neighbors.
 *
 * @author Christian Lagerkvist [christian.lagerkvist@seb.se]
 */

var faucet = function() {
	var sources = {
		"APP": {
			"name": "Applications",
			"background-color": "#9740FB",
			"display": 'name',
			"api": {
				"index": "http://localhost:3001/index",
				"node": "http://localhost:3001/node/id/:id",
				"nodesInGroup": "http://localhost:3001/group/id/:id",
				"nodeLinks": "http://localhost:3001/node/id/:id/links"
			},
			precomp: function(node) {
				var description = node.description || '&nbsp;';
				var ret = '<div><span class="tt-name">' + node.name + '<span class="tt-description"><em>' + description + '</em></span></span><span style="background:' + color(node.group) + '" class="label label-info pull-right">' + node.group + '</span></div>';
				return ret;
			}
		}
	};

	var Node = {
		'name': null,
		'group': null,
		'size': null
	};

	var get_typeahead_datasets = function() {
		var datasets = [];
		for (key in sources) {
			source = sources[key];
			datasets.push({
				"displayKey": source.display,
				"limit": 10,
				"templates": {
					header: '<h4 style="background-color: ' + source["background-color"] + '" class="faucet_header">' + source.name + '</h3>',
					suggestion: source.precomp
				},
				"source": new Bloodhound({
					datumTokenizer: function(d) {
					        var test = Bloodhound.tokenizers.whitespace(d.name);
					            $.each(test,function(k,v){
					                i = 0;
					                while( (i+1) < v.length ){
					                    test.push(v.substr(i,v.length));
					                    i++;
					                }
					            })
					            return test;
					        },
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					prefetch: {
						url: source.api.index,
						cache: false,
						transform: function(nodes) {
							source.groups = [];
							nodes.forEach(function(node) {
								node.tag = key;
								if (source.groups.indexOf(node.group) == -1) {
									source.groups.push(node.group);
								}
							});
							//source.colorize = d3.scale.category20(groups);
							return nodes;
						}
					}
				})
			});
		}
		return datasets;
	};

	var id_into_str = function(str, id) {
		return str.replace(":id", id);
	}
	/*	
	var add = function(n) {
		console.log(n);
		$.getJSON(id_into_str(data["APP"].api.node, n), function (node) {
			Net.add(node, function(){return [];});
		}).fail(function (f) {
			console.log(f);
		});
	}
*/
	/*
	var addGroup = function(n) {
		$.getJSON(id_into_str(data[n.tag].api.nodesInGroup, n.id), function (nodes) {
			nodes.forEach(function (node) {
				Net.add(node, function(){return [];});
			});
		});
	}
*/
	/*
	var getLinks = function(n) {
		$.getJSON(id_into_str(data[n.tag].api.node, n.id), function (node) {
			Net.add(node);
		});
	}

*/
	return {
		sources: sources,
		get_typeahead_datasets: get_typeahead_datasets
		/*		add: add
		 */
	};
}();
