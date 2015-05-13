//Routes
var bodyParser = require('body-parser');
var apicalls = require('../apicalls');
var router = require('express-promise-router')(); //Creates new instance of router
var p = require('bluebird');


router.get('/', function(request, response) {
  return p.try(function() {
    response.render('index');
  });
});

router.post('/search', bodyParser.urlencoded({extended: true}), function(request, response) {
  var summonerName = request.body.summonerName;
  var region = request.body.region;
  var formattedName = '';
  return p.try(function() {
    return apicalls.getSummonerId(summonerName, region);//Returns the summonerId
  }).then(function (summonerId) {
    formattedName = summonerId.name;
    return apicalls.getStats(summonerId, region);//Returns the stats
  }).then(function (stats) {
    return apicalls.constructJSON(stats, region);//Returns a JSON blob
  }).then(function (json) {
    if (formattedName == '') {
      formattedName = summonerName;
    }
    response.render('list', { blob: json, name: formattedName });//Renders with json blob
  });
});

module.exports = router;
