'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _suggestionEngine = require('./suggestionEngine');

var _suggestionEngine2 = _interopRequireDefault(_suggestionEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//main server definition 

//express app definition
var app = (0, _express2.default)();

//handling of json in body using body parser
app.use(_bodyParser2.default.json());

//start the suggestion engine
_suggestionEngine2.default.start();

//api routes load 
app.use('/api', _api2.default.router());

//start the rest service
app.listen(process.env.APPLICATION_PORT);

_logger2.default.info('App Started On localhost:' + process.env.APPLICATION_PORT);

//export the app module will be used for testing here
module.exports = app;