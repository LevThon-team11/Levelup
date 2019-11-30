var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var mysql_dbc = require('./db_conf')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);
var mysql = require('mysql');


/* GET users listing. */
router.get('/login', function(req, res, next) {
	console.log(req.session.loginInfo);
	if(req.session.loginInfo != undefined) {
		res.redirect('/');
	} else {
		res.render('login');
	}
});

router.post('/login', function(req, res, next) {
	var userId = '';
	var userPw = '';
	req.on('data', function(chunk) {
		var data = querystring.parse(chunk.toString());
		userId = data.userId;
		userPw = data.userPw;
		var stmt = 'select * from user where user_id = ' + mysql.escape(userId) + ' and password = ' + mysql.escape(userPw);
		connection.query(stmt, function (err, result) {
			if(result.length > 0 && userId == result[0].user_id && userPw == result[0].password) {
				req.session.loginInfo = result[0];
				console.log(req.session.loginInfo.name);
				res.send({result:'Success'});
			} else {
				res.send({result:'Fail'});
			}
		});
	});
});

router.get('/logout', function(req, res, next) {
	console.log('logout');
	req.session.destroy();
	res.clearCookie('sid');
	res.redirect('/');
});

router.get('/join', function(req, res, next) {
	console.log('join');
	if(req.session.loginInfo != undefined) {
		res.redirect('/');
	} else {
		res.render('join');
	}
});

router.post('/join', function(req, res, next) {
	var userId = '';
	var userPw = '';
	var userNm = '';
	var email  = '';
	var phone  = '';
	req.on('data', function(chunk) {
		var data = querystring.parse(chunk.toString());
		userId = data.userId;
		userPw = data.userPw;
		userNm = data.userNm;
		email  = data.email;
		phone  = data.phone;
		var stmt = 'insert into user values (' + mysql.escape(userId) + ', ' + mysql.escape(userPw) + ', ' + mysql.escape(userNm) + ', ' + mysql.escape(email) + ', '
		stmt += mysql.escape(phone) + ')';
		connection.query(stmt, function (err, result) {
			if(err) {
				res.send({result : 'Fail'});
			} else {
				res.send({result : 'Success'});
			}
		});
	});
});

router.post('/idCheck', function(req, res, next) {
	console.log('idCheck');
	var userId = '';
	req.on('data', function(chunk) {
		var data = querystring.parse(chunk.toString());
		userId = data.userId;
		var stmt = 'select count(1) as count from user where user_id = ' + mysql.escape(userId);
		connection.query(stmt, function(err, rows, fields){
			if(rows[0].count == 0) {
				res.send({result : 'Success'});	
			} else {
				res.send({result : 'Fail'});
			}
		});
	});
});

module.exports = router;
