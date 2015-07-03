// http://stackoverflow.com/questions/27042222/create-custom-a-d3-generator

function circleGen() {
  //set defaults
  var r = function(d) { return d.radius; },
      x = function(d) { return d.x; },
      y = function(d) { return d.y; };

  //returned function to generate circle path
  function circle(d) {
    var cx = d3.functor(x).call(this, d),
        cy = d3.functor(y).call(this, d),
        myr = d3.functor(r).call(this, d);

    return "M" + cx + "," + cy + " " +
           "m" + -myr + ", 0 " +
           "a" + myr + "," + myr + " 0 1,0 " + myr*2  + ",0 " +
           "a" + myr + "," + myr + " 0 1,0 " + -myr*2 + ",0Z";
  }

  //getter-setter methods
  circle.r = function(value) {
    if (!arguments.length) return r; r = value; return circle;
  };  
  circle.x = function(value) {
    if (!arguments.length) return x; x = value; return circle;
  };  
  circle.y = function(value) {
    if (!arguments.length) return y; y = value; return circle;
  };

  return circle;
}