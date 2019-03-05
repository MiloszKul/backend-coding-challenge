'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _suggestions = require('./suggestions');

var _suggestions2 = _interopRequireDefault(_suggestions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

//routes loader for all api paths under the application
//in the case of this service this will only be the suggestions paths but this could easily be expanded according to same logic for all necessary paths


var api = function api() {
    router.use('/suggestions', _suggestions2.default.routes);
    return router;
};

exports.default = api;