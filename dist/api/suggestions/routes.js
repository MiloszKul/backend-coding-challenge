'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _suggestionEngine = require('../../suggestionEngine');

var _suggestionEngine2 = _interopRequireDefault(_suggestionEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

//using jsonschema library to validate the input received on requests
var reqValidator = require('jsonschema').validate;
var reqSchema = {
    'type': 'object',
    'properties': {
        'q': { 'type': 'string' }
    },
    'required': ['q']

    //get method handle for returning event  with optional query eventName
};router.get('', function (req, res) {

    //id for logging;
    var reqId = req.headers.ip + '-' + new Date().toISOString();
    _logger2.default.info('req: ' + reqId);

    try {
        //invalid request in this case the q parameter was not set
        if (reqValidator(req.query, reqSchema).errors.length > 0) {
            var error = {
                status: 400,
                message: 'Malformed request \'q\' parameter is required'
            };

            res.status(400).send(error);
            _logger2.default.error('req:' + reqId + ' error');
            _logger2.default.error(error);

            //valid request processing
        } else {
            var matches = _suggestionEngine2.default.search(req.query);
            res.status(200).send({ "suggestions": matches });
            _logger2.default.info('req: ' + reqId + 'completed successfully');
        }
    } catch (e) {
        res.status(500).send('Server Error');
        _logger2.default.error('req:' + reqId + ' Unhandled Error ');
        _logger2.default.error(new Error(e));
    }
});

//respond 405 to block all other method calls
router.all('', function (req, res) {
    res.status(405).send('');
});

exports.default = router;