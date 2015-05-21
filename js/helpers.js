/** Santa's little __helpers__ - basically a bunch of utility functions
 * 
 * @author Christian Lagerkvist [christian.lagerkvist@seb.se]
 */

/** __FPS__ for benchmarking each iteration */
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

/** Got this neat atan2 from Jim Shima (14 years ahead of my time) http://dspguru.com/dsp/tricks/fixed-point-atan2-with-self-normalization (Public Domain) */
function myAtan(y, x) {
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
// SATELLITE snippet, nifty stuff but I'll save it for a rainy day

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

/** Make bookmarklet - stole this from somewhere, although forgot the source */
function MakeBM(Text) {


	// Standardize newlines
	Text = Text.replace(/\r/g, '\n');

	// Remove comments
	Text = RemoveComments(Text);

	// No multiple spaces
	Text = Text.replace(/[\t ]+/g, ' ');

	// Shameful hack to avoid replacing inside literal strings
	Text = Text.replace(/'/g, '"<$<$<$<$<$<');

	// Replace line-by-line
	var NewlineArray = Text.split('\n');
	var LineCount = NewlineArray.length;
	var QuoteArray = Array();
	var SplitCount = 0;

	for ( i = 0; i < LineCount; i++ ) {

		// Trim each line
		NewlineArray[i] = NewlineArray[i].replace(/^[\t ]+/g, '');
		NewlineArray[i] = NewlineArray[i].replace(/[\t ]+$/g, '');

		QuoteArray = NewlineArray[i].split('"');
		SplitCount = QuoteArray.length;

		for ( j = 0; j < SplitCount; j++ ) {
			if ( (j % 2) == 0 ) QuoteArray[j] = MakeReplaces(QuoteArray[j]);
		}

		NewlineArray[i] = QuoteArray.join('"');

	}

	Text = NewlineArray.join('');

	// Restore single quotes
	Text = Text.replace(/"<\$<\$<\$<\$<\$</g, "'");

	// Percent-encode special characters
	Text = Text.replace(/%/g, '%25');
	Text = Text.replace(/"/g, '%22');
	Text = Text.replace(/</g, '%3C');
	Text = Text.replace(/>/g, '%3E');
	Text = Text.replace(/#/g, '%23');
	Text = Text.replace(/@/g, '%40');
	Text = Text.replace(/ /g, '%20');
	Text = Text.replace(/\&/g, '%26');
	Text = Text.replace(/\?/g, '%3F');

	if ( Text.substring(0, 11) == 'javascript:' ) Text = Text.substring(11);
	TextLength = Text.length;

	if ( (Text.substring(0, 12) + Text.substring(TextLength - 5)) != '(function(){})();' ) Text = '(function(){' + Text + '})();';
	Text = 'javascript:' + Text;

	return Text;
}

function MakeReplaces(Text) {
	Text = Text.replace(/ ?; ?/g, ';');
	Text = Text.replace(/ ?: ?/g, ':');
	Text = Text.replace(/ ?, ?/g, ',');
	Text = Text.replace(/ ?= ?/g, '=');
	Text = Text.replace(/ ?% ?/g, '%');
	Text = Text.replace(/ ?\+ ?/g, '+');
	Text = Text.replace(/ ?\* ?/g, '*');
	Text = Text.replace(/ ?\? ?/g, '?');
	Text = Text.replace(/ ?\{ ?/g, '{');
	Text = Text.replace(/ ?\} ?/g, '}');
	Text = Text.replace(/ ?\[ ?/g, '[');
	Text = Text.replace(/ ?\] ?/g, ']');
	Text = Text.replace(/ ?\( ?/g, '(');
	Text = Text.replace(/ ?\) ?/g, ')');
	return Text;
}

/*
	Comment removal code from:
	http://james.padolsey.com/javascript/removing-comments-in-javascript/
*/

function RemoveComments(str) {
	str = ('__' + str + '__').split('');
	var mode = {
		singleQuote: false,
		doubleQuote: false,
		regex: false,
		blockComment: false,
		lineComment: false,
		condComp: false 
	};
	for (var i = 0, l = str.length; i < l; i++) {
 
		if (mode.regex) {
			if (str[i] === '/' && str[i-1] !== '\\') {
				mode.regex = false;
			}
			continue;
		}
 
		if (mode.singleQuote) {
			if (str[i] === "'" && str[i-1] !== '\\') {
				mode.singleQuote = false;
			}
			continue;
		}
 
		if (mode.doubleQuote) {
			if (str[i] === '"' && str[i-1] !== '\\') {
				mode.doubleQuote = false;
			}
			continue;
		}
 
		if (mode.blockComment) {
			if (str[i] === '*' && str[i+1] === '/') {
				str[i+1] = '';
				mode.blockComment = false;
			}
			str[i] = '';
			continue;
		}
 
		if (mode.lineComment) {
			if (str[i+1] === '\n' || str[i+1] === '\r') {
				mode.lineComment = false;
			}
			str[i] = '';
			continue;
		}
 
		if (mode.condComp) {
			if (str[i-2] === '@' && str[i-1] === '*' && str[i] === '/') {
				mode.condComp = false;
			}
			continue;
		}
 
		mode.doubleQuote = str[i] === '"';
		mode.singleQuote = str[i] === "'";
 
		if (str[i] === '/') {
 
			if (str[i+1] === '*' && str[i+2] === '@') {
				mode.condComp = true;
				continue;
			}
			if (str[i+1] === '*') {
				str[i] = '';
				mode.blockComment = true;
				continue;
			}
			if (str[i+1] === '/') {
				str[i] = '';
				mode.lineComment = true;
				continue;
			}
			mode.regex = true;
 
		}
 
	}
	return str.join('').slice(2, -2);
}