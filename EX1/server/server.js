var express = require('express');
var bodyParser = require('body-parser');//get param form POST method

var routes = require('./router'); 

var app = express();
var server = require('http').Server(app);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set up port for server to listen on
var port = process.env.PORT || 3000;


routes.configure(express, app); // config goi funtion congigures ben router.js

server.listen(port);
console.log('Runing on ' + port);