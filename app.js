var app = require("express").createServer();
var express = require("express");

app.configure(function(){

	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res){
	res.render('index',{title:"VIDEO PLAYER"});
});

app.listen(3000);