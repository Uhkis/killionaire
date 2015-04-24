//Routes
var bodyParser = require('body-parser');
var apicalls = require('../index');

module.exports = function (app) {
  app.get('/', function(request, response) {
    response.render('index', { title: 'Hey', message: 'Hello there!' });
  });

  app.get('/about', function (request, response) {
    response.render('about.html');
  });

  app.post('/', bodyParser.urlencoded({extended: true}), function(request, response) {
    var summonerName = request.body.summonerName;
    console.log(summonerName);
    apicalls.getSummonerId(summonerName, 'na')//Returns the summonerId
    .then(apicalls.getStats.bind(null, 'na'), console.log)//Returns the stats
    .then(apicalls.constructJSON, console.log)//Returns a JSON blob
    .then(function (json) {
      response.render('list', json);
    }, console.log);
  });
};
