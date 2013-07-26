var FPS = function () {
	var s, tick, tot = [];
	return {
		init: function () {
			tick = 0;
			s = (new Date()).getSeconds();
		},
		sample: function () {
			tick++;
			var d = (new Date()).getSeconds();
			if (d != s) {
				tot.push(tick);
				s = d;
				this.report();
				tick = 0;
			} else {
				tick++;
			}
		},
		report: function () {
			var total = 0;
			tot.forEach(function (t) {
				total += t;
			});
			console.log("this: " + tick + " - average: " + total / tot.length);
			// false: false: 56, 64, 60, 63
			// rotate_labels = true: 34, 32, 37
			// force2: 28, 28
			// rot & force2: 
		}
	};
}();


function myAtan(y, x) { // http://dspguru.com/dsp/tricks/fixed-point-atan2-with-self-normalization
	var coeff_1 = Math.PI / 4;
	var coeff_2 = 3 * coeff_1;
	var abs_y = y > 0 ? y : -y;
	var angle, r;
	if (x >= 0) {
		r = (x - abs_y) / (x + abs_y);
		angle = coeff_1 - coeff_1 * r;
	} else {
		r = (x + abs_y) / (abs_y - x);
		angle = coeff_2 - coeff_1 * r;
	}
	return y < 0 ? -angle : angle;
}

/*
// SATELLITE

g.append("circle").attr("r", function (n) {
	return (3);
})
	.style("fill", function (d) {
	return "#fff";
})
//	.attr("transform", function (n) {var offset=9+n.size*0.2; return "translate("+offset+","+offset+")";})
.attr("cx", function (n) {
	return 9 + n.size * 0.2;
})
	.attr("cy", function (n) {
	return 9 + n.size * 0.2;
})
	.append("animateTransform")
	.attr("attributeType", "xml")
	.attr("attributeName", "transform")
	.attr("type", "rotate")
	.attr("from", function (n) {
	var offset = n.size * 0.02;
	return "0 -" + offset + " -" + offset;
})
	.attr("to", function (n) {
	var offset = n.size * 0.02;
	return "1000 -" + offset + " -" + offset;
})
	.attr("dur", "10s")
	.attr("repeatCount", "indefinately");
*/
