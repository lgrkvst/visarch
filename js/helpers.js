var FPS = function () {
	var s, tick, tot = [];
	return {
		init: function () {
			tick = 0;
			s = (new Date()).getSeconds();
			tot = [];
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

function atan2lut(x, y) {
	var BRAD_PI_SHIFT=14;
	var BRAD_PI = 1<<BRAD_PI_SHIFT;
	if (y==0) return (x>=0 ? 0 : BRAD_PI);
	
	var ATAN_ONE = 0x1000;
	var ATAN_FP= 12;
	var ATANLUT_STRIDE = ATAN_ONE / 0x80;
	var ATANLUT_STRIDE_SHIFT= 5;
	var BRAD_HPI= BRAD_PI/2;
	var BRAD_2PI= BRAD_PI*2;
	
	var atanLUT = [0x0000,0x0146,0x028C,0x03D2,0x0517,0x065D,0x07A2,0x08E7,0x0A2C,0x0B71,0x0CB5,0x0DF9,0x0F3C,0x107F,0x11C1,0x1303,0x1444,0x1585,0x16C5,0x1804,0x1943,0x1A80,0x1BBD,0x1CFA,     0x1E35,0x1F6F,0x20A9,0x21E1,0x2319,0x2450,0x2585,0x26BA,     0x27ED,0x291F,0x2A50,0x2B80,0x2CAF,0x2DDC,0x2F08,0x3033,     0x315D,0x3285,0x33AC,0x34D2,0x35F6,0x3719,0x383A,0x395A,     0x3A78,0x3B95,0x3CB1,0x3DCB,0x3EE4,0x3FFB,0x4110,0x4224,     0x4336,0x4447,0x4556,0x4664,0x4770,0x487A,0x4983,0x4A8B,0x4B90,0x4C94,0x4D96,0x4E97,0x4F96,0x5093,0x518F,0x5289,     0x5382,0x5478,0x556E,0x5661,0x5753,0x5843,0x5932,0x5A1E,     0x5B0A,0x5BF3,0x5CDB,0x5DC1,0x5EA6,0x5F89,0x606A,0x614A,     0x6228,0x6305,0x63E0,0x64B9,0x6591,0x6667,0x673B,0x680E,     0x68E0,0x69B0,0x6A7E,0x6B4B,0x6C16,0x6CDF,0x6DA8,0x6E6E,     0x6F33,0x6FF7,0x70B9,0x717A,0x7239,0x72F6,0x73B3,0x746D,     0x7527,0x75DF,0x7695,0x774A,0x77FE,0x78B0,0x7961,0x7A10,0x7ABF,0x7B6B,0x7C17,0x7CC1,0x7D6A,0x7E11,0x7EB7,0x7F5C,0x8000,0x80A2];
		
	var phi=0;
	var t;
	
	if(y< 0) {     x= -x;     y= -y; phi += 4; }
	if(x<= 0) { t= x;  x=   y; y= -t; phi += 2; }
	if(x<=y) { t= y-x; x= x+y; y=  t; phi += 1; }
	
	phi *= BRAD_PI/4;
	
	t = Math.floor(y/x);
	return (phi + atanLUT[(t/32)]/8)/0x2000;
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
