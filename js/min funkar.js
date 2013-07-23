<html lang="en"><head>
		<meta charset="utf-8">
		<title>Force based label placement</title>
		<script type="text/javascript" src="js/d3.min.bm-w.cornerradius.js"></script>
		<script type="text/javascript" src="js/jquery-1.8.3-min.js"></script>
		<script type="text/javascript" src="js/jquery.autoSuggest.packed.js"></script>
		<script type="text/javascript" charset="utf-8" src="js/force_network.js"></script>
		<script type="text/javascript" src="js/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/MakeBM.js"></script>
		<link href="css/bootstrap.min.css" rel="stylesheet" type="text/css">
		<link href="css/autoSuggest.css" rel="stylesheet" type="text/css">
		<style>
			.link {
				stroke: #CCC;
				stroke-width: 10px;
				opacity:0.1;
			}
			.polygonlink {
				fill: #CCC;
				stroke: none;
				stroke-width: 0;
				opacity:0.1;
			}
			.node {
				opacity:0.8;
			}
			.fixed {
				stroke: #bbb;
				stroke-width :2.5px;
				stroke-dasharray: 4,2;
				fill:none;
			}
			.nodelabel {
				font-family: optima, sans-serif;
				filter:none !important;
			}
			text {
				fill:#fff;
			}
			.radial {
				font-size:14px;
			}
			body {
				background-color: #000000;
				background-image: url('img/bg.jpg');
				background-position: top center;
				background-repeat: no-repeat;
				background-attachment: fixed;
				margin: 0px;
				font-family:Arial, Verdana, Helvetica, sans-serif;
				font-size:12px;
				color:#fff;
			}
			
		</style>
	<style type="text/css"></style></head>
	<body>
		<div class="container-fluid">
			<div class="row-fluid">
				<span class="span1"><a id="bookmarklet" href="update({[{&quot;name&quot;:&quot;COIS&quot;,&quot;compartment&quot;:&quot;Other SEB Systems&quot;,&quot;size&quot;:7,&quot;link_count&quot;:0}]});" class="btn-small btn-warning">spara</a></span>
				<span class="span11">
					<ul class="as-selections" id="as-selections-040"><li class="as-selection-item blur" id="as-selection-475"><a class="as-close">×</a>COIS</li><li class="as-original" id="as-original-040"><input type="text" id="as-input-040" class="input-large search-query as-input" name="q" autocomplete="off"><input type="hidden" class="as-values" name="as_values_040" id="as-values-040" value="COIS,"></li></ul><div class="as-results" id="as-results-040" style="display: none;"><ul class="as-list" style="width: 902px;"><li class="as-result-item active" id="as-result-item-474"><em>COIS</em></li></ul></div>
					
				</span>
			</div>

<!--			<div class=row-fluid style="background: #888">
		        <span class="span3" id="linkLabel">link_count multiplier: </span>
		        <span class="span3"><input type="range" min="0" max="30" value="25" id="linkConstant" step="0.01"/></span>
		        <span class="span3" id="sizeLabel">size multiplier: </span><br>
		        <span class="span3"><input type="range" min="0" max="10" value="1" id="sizeConstant" step="0.01"/></span>
	    		</div>
-->
			<div class="row-fluid">
				<div class="span12" oncontextmenu="return false;"><svg></svg>
					<script type="text/javascript" charset="utf-8" src="js/force_with_labels.js"></script>
					<script type="text/javascript" charset="utf-8" src="js/sunburst.js"></script>

				</div>
			</div>
		</div><svg width="1025" height="718"><g class="links"></g><g class="nodes"><g class="node COIS" transform="translate(550.2655852345714,380.3616062857342) rotate(0)"><g class="nodelabel"><text dy=".35em" x="16.1" font-size="14.7" class="nodelabeltext" transform="rotate(0)" text-anchor="start">COIS</text></g><title>7 links
[Other SEB Systems]</title><circle r="14.8" class="halo COIS" style="fill: #g6;"></circle><circle r="7.4" style="fill: #ffffff;"></circle></g></g><filter id="blurMe"><feGaussianBlur in="SourceGraphic" stdDeviation="2"></feGaussianBlur></filter><defs><marker id="end" viewBox="0 -5 10 10" refX="35" refY="0" markerWidth="1" markerHeight="1" orient="auto"><path d="M0,-5L10,0L0,5"></path></marker><radialGradient id="m0" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#15537d" offset="0%" stop-opacity="100%"></stop><stop stop-color="#1f77b4" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m1" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#798ba2" offset="0%" stop-opacity="100%"></stop><stop stop-color="#aec7e8" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m2" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#b25809" offset="0%" stop-opacity="100%"></stop><stop stop-color="#ff7f0e" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m3" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#b28254" offset="0%" stop-opacity="100%"></stop><stop stop-color="#ffbb78" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m4" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#1e701e" offset="0%" stop-opacity="100%"></stop><stop stop-color="#2ca02c" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m5" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#6a9c60" offset="0%" stop-opacity="100%"></stop><stop stop-color="#98df8a" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m6" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#951b1c" offset="0%" stop-opacity="100%"></stop><stop stop-color="#d62728" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m7" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#b26a69" offset="0%" stop-opacity="100%"></stop><stop stop-color="#ff9896" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m8" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#674884" offset="0%" stop-opacity="100%"></stop><stop stop-color="#9467bd" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m9" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#897b95" offset="0%" stop-opacity="100%"></stop><stop stop-color="#c5b0d5" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m10" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#623c34" offset="0%" stop-opacity="100%"></stop><stop stop-color="#8c564b" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m11" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#896d67" offset="0%" stop-opacity="100%"></stop><stop stop-color="#c49c94" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m12" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#9e5387" offset="0%" stop-opacity="100%"></stop><stop stop-color="#e377c2" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m13" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#ac7f93" offset="0%" stop-opacity="100%"></stop><stop stop-color="#f7b6d2" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m14" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#585858" offset="0%" stop-opacity="100%"></stop><stop stop-color="#7f7f7f" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m15" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#8b8b8b" offset="0%" stop-opacity="100%"></stop><stop stop-color="#c7c7c7" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m16" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#838417" offset="0%" stop-opacity="100%"></stop><stop stop-color="#bcbd22" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m17" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#999962" offset="0%" stop-opacity="100%"></stop><stop stop-color="#dbdb8d" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m18" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#108590" offset="0%" stop-opacity="100%"></stop><stop stop-color="#17becf" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="m19" cx="0%" cy="0%" fx="0%" fy="0%" r="100%"><stop stop-color="#6e98a0" offset="0%" stop-opacity="100%"></stop><stop stop-color="#9edae5" offset="100%" stop-opacity="100%"></stop></radialGradient><radialGradient id="g0" cx="50%" cy="50%" r="50%"><stop stop-color="#1f77b4" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g1" cx="50%" cy="50%" r="50%"><stop stop-color="#aec7e8" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g2" cx="50%" cy="50%" r="50%"><stop stop-color="#ff7f0e" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g3" cx="50%" cy="50%" r="50%"><stop stop-color="#ffbb78" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g4" cx="50%" cy="50%" r="50%"><stop stop-color="#2ca02c" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g5" cx="50%" cy="50%" r="50%"><stop stop-color="#98df8a" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g6" cx="50%" cy="50%" r="50%"><stop stop-color="#d62728" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g7" cx="50%" cy="50%" r="50%"><stop stop-color="#ff9896" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g8" cx="50%" cy="50%" r="50%"><stop stop-color="#9467bd" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g9" cx="50%" cy="50%" r="50%"><stop stop-color="#c5b0d5" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g10" cx="50%" cy="50%" r="50%"><stop stop-color="#8c564b" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g11" cx="50%" cy="50%" r="50%"><stop stop-color="#c49c94" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g12" cx="50%" cy="50%" r="50%"><stop stop-color="#e377c2" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g13" cx="50%" cy="50%" r="50%"><stop stop-color="#f7b6d2" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g14" cx="50%" cy="50%" r="50%"><stop stop-color="#7f7f7f" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g15" cx="50%" cy="50%" r="50%"><stop stop-color="#c7c7c7" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g16" cx="50%" cy="50%" r="50%"><stop stop-color="#bcbd22" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g17" cx="50%" cy="50%" r="50%"><stop stop-color="#dbdb8d" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g18" cx="50%" cy="50%" r="50%"><stop stop-color="#17becf" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient><radialGradient id="g19" cx="50%" cy="50%" r="50%"><stop stop-color="#9edae5" offset="40%" stop-opacity="100%"></stop><stop stop-color="white" offset="75%" stop-opacity="0%"></stop></radialGradient></defs></svg>
<!--
		<script>
		    d3.select("#linkConstant")
			    .on("change",function() { d3.select("#linkLabel").text("linkConstant: "+net.linkConstantUpdate(this.value));});
			d3.select("#sizeConstant")
			    .on("change",function() { d3.select("#sizeLabel").text("sizeConstant: "+net.sizeConstantUpdate(this.value));});
		</script>			
	-->
	
</body></html>