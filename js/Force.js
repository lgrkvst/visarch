var Force = function() {
	var force, linkConstant = 25, sizeConstant = 1, leftDrag = true; 
	var get_force = function(){ return force; };
	var linkDistance = function(l,i) {

		var linkD = Math.sqrt(l.source.weight*l.target.weight);
		var sizeD = Math.sqrt(l.source.size*l.source.size+l.target.size*l.target.size);
	
		return linkConstant*linkD+sizeD/sizeConstant-Net.nodes.length;
		};
	var linkConstantUpdate = function () {
	    linkConstant = d3.select("#linkConstant").property("value");
	    d3.select("#linkLabel").text("linkConstant: "+d3.format("f")(linkConstant));
		update();
	    return linkConstant;
		};
	var sizeConstantUpdate = function () {
	    sizeConstant = d3.select("#sizeConstant").property("value");
	    d3.select("#sizeLabel").text("sizeConstant: "+d3.format("f")(sizeConstant));
		update();
	    return sizeConstant;
		};
	var init = function (w, h) {
		force = d3.layout.force()
			.linkDistance(linkDistance)
			.gravity(0.1)
			.charge(function (n) {
				if (n.weight == 0) return -100;
				return -1200;
			})
			.friction(0.5)
			.size([w, h])
			.nodes(Net.nodes).links(Net.links);
		};
	var d3_layout_forceMouseover = function(d) { // got these from d3's force.js
	  	d.fixed |= 4; // set bit 3
	  	d.px = d.x, d.py = d.y; // set velocity to zero
		};
	var d3_layout_forceMouseout = function (d) {// got these from d3's force.js
	  	d.fixed &= ~4; // unset bit 3
		};
	var nodeDrag = d3.behavior.drag().on("dragstart", function(d){
		d.fixed |= 2; // set bit 2		  
		if (d3.event.sourceEvent.which==1 && !d3.event.sourceEvent.ctrlKey) {
			// primary mouse button, no mac contextmenu (ctrl-click)
			leftDrag = true;
			} else {
			leftDrag = false;
			}
		})
		.on("drag", function (d) {
			if (leftDrag) {
			    d.px = d3.event.x, d.py = d3.event.y;
			    force.resume();
				}
			})
		.on("dragend", function(d){
	  		d.fixed &= ~6; // unset bits 2 and 3
			leftDrag = false;
			});
	return {
		init: init,
		force: get_force,
		nodeDrag: nodeDrag,
		d3_layout_forceMouseover: d3_layout_forceMouseover,
		d3_layout_forceMouseout: d3_layout_forceMouseout,
	};
}();

