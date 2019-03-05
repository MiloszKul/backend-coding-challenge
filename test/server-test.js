var chai = require('chai');
var server = require('../dist/index');
var supertest = require('supertest');
var expect = chai.expect;
var request = supertest(server);

//test invalid path 
describe('GET /api/notExistingPath', function () {
    it('expecting to fail: 404 not found', function (done) {
        request.put('/api/notExistingPath')
            .send({ event: 'test' })
            .expect(404)
            .end(function (err, res) {
                done(err);
            });
    });
});

//test not allowed methods are blocked correctly
describe('PUT /api/suggestions', function () {
    it('expecting to fail: 405 not allowed method', function (done) {
        request.put('/api/suggestions')
            .send({ event: 'test' })
            .expect(405)
            .end(function (err, res) {
                done(err);
            });
    });
});

describe('POST /api/suggestions', function () {
    it('expecting to fail: 405 not allowed method', function (done) {
        request.put('/api/suggestions')
            .send({ event: 'test' })
            .expect(405)
            .end(function (err, res) {
                done(err);
            });
    });
});

describe('DELETE /api/suggestions', function () {
    it('expecting to fail: 405 not allowed method', function (done) {
        request.put('/api/suggestions')
            .send({ event: 'test' })
            .expect(405)
            .end(function (err, res) {
                done(err);
            });
    });
});

//test correct handling of malformed request (missing q param)
describe('GET /api/suggestions', function () {
    it('expecting to return 400 with indication \'q\' param must be supplied', function (done) {
        var expected = {
            "status": 400,
            "message": "Malformed request 'q' parameter is required"
        }
        request.get('/api/suggestions')
            .send({ event: 'test' })
            .expect(400)
            .expect(expected)
            .end(function (err, res) {
                done(err);
            });
    });
});
//test result with no suggestions

//test correct handling of malformed request (missing q param)
describe('GET /api/suggestions?q=middleOfNowhere', function () {
    it('expecting to return 200 with empty suggestion set', function (done) {
        var expected = {
            "suggestions": ['a']
            }
        request.get('/api/suggestions?q=middleOfNowhere')
            .send({ event: 'test' })
            .expect(200)
            .expect(expected)
            .end(function (err, res) {
                done(err);
            });
    });
});


