var explainjs = require('explainjs');

var js = '//My Library\n doSomething();';

explainjs(js, function(error, results){
  // <p>My Library</p>
  console.log(results.sections[0].comments);
	
  // doSomething();
  console.log(results.sections[0].code);
});