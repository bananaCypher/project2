var http = require('http');

var getLatestData = function(symbol) {
  http.get('http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=%7B%22Normalized%22%3Afalse%2C%22NumberOfDays%22%3A9%2C%22DataPeriod%22%3A%22Day%22%2C%22Elements%22%3A%5B%7B%22Symbol%22%3A%22' + symbol + '%22%2C%22Type%22%3A%22price%22%2C%22Params%22%3A%5B%22c%22%5D%7D%5D%7D', function(response){
    var body = '';                                                                                                                        
    response.on('data', function(d){
      body += d;                                                                                                                          
    });
    response.on('end', function(){                                                                                                        
      res.send(JSON.parse(body));
    });
});
}
