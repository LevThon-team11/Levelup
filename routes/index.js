var express = require('express');
var router = express.Router();
var mysql_dbc = require('./db_conf')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('indexPage');
  res.render('index', { title: 'Express' });
});

router.get('/test', function (req, res) {
  var stmt = 'select * from test1';
  connection.query(stmt, function (err, result) {
      console.log(result);
	  console.log(result[0][1]);
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
