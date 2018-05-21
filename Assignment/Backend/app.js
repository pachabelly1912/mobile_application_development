var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api =  require('./routes/api');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.sendStatus(400);
});

// error handler
app.use(function(err, req, res, next) {
  res.sendStatus(500);
});

module.exports = app;
