var chai = require('chai');
var server = require('../dist/index');
var supertest = require('supertest');
var expect = chai.expect;
var request = supertest(server);

//test invalid path 
describe('GET /api/notExistingPath', function () {
    it('expecting to fail: 404 not found', function (done) {
        request.get('/api/notExistingPath')
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
            .expect(405)
            .end(function (err, res) {
                done(err);
            });
    });
});

describe('POST /api/suggestions', function () {
    it('expecting to fail: 405 not allowed method', function (done) {
        request.post('/api/suggestions')
            .expect(405)
            .end(function (err, res) {
                done(err);
            });
    });
});

describe('DELETE /api/suggestions', function () {
    it('expecting to fail: 405 not allowed method', function (done) {
        request.delete('/api/suggestions')
            .expect(405)
            .end(function (err, res) {
                done(err);
            });
    });
});

//test correct handling of malformed request (missing q param)
describe('GET /api/suggestions missing q param', function () {
    it('expecting to return 400 with indication \'q\' param must be supplied', function (done) {
        var expected = {
            "status": 400,
            "message": "Malformed request",
            "errors": [
                "requires property \"q\""
            ]
        };
        request.get('/api/suggestions')
            .expect(400)
            .expect(expected)
            .end(function (err, res) {
                done(err);
            });
    });
});
//test giving forgetting latitutde
describe('GET /api/suggestions longitutde no latitutde', function () {
    it('expecting to return 400 with message to provide latitude', function (done) {
        var expected = {
            "status": 400,
            "message": "Malformed request",
            "errors": [
                "property latitude not found, required by instance.longitude"
            ]
        };
        request.get('/api/suggestions?q=a&longitude=45')
            .expect(400)
            .expect(expected)
            .end(function (err, res) {
                done(err);
            });
    });
});
//test giving forgetting longitutde  causes error
describe('GET /api/suggestions latitutde no longitude', function () {
    it('expecting to return 400 with message to provide longitude', function (done) {
        var expected = {
            "status": 400,
            "message": "Malformed request",
            "errors": [
                "property longitude not found, required by instance.latitude"
            ]
        };
        request.get('/api/suggestions?q=a&latitude=45')
            .expect(400)
            .expect(expected)
            .end(function (err, res) {
                done(err);
            });
    });
});

//test result with no suggestions
describe('GET /api/suggestions?q=middleOfNowhere', function () {
    it('expecting to return 200 with empty suggestion set', function (done) {
        var expected = {
            "suggestions": []
        }
        request.get('/api/suggestions?q=middleOfNowhere')
            .expect(200)
            .expect(expected)
            .end(function (err, res) {
                done(err);
            });
    });
});

//test result with suggestions
describe('GET /api/suggestions?q=toronto', function () {
    it('expecting to return 200 with suggestion set', function (done) {
        request.get('/api/suggestions?q=toronto')
            .expect(200)
            .expect(function (res) {

                //validate length of results
                expect(res.body.suggestions.length === 14)
                //valid 1st result in set
                expect(res.body.suggestions[0]).to.deep.equal({
                    "name": "Toronto, ON, CA",
                    "latitude": "43.70011",
                    "longitude": "-79.4163",
                    "score": 1
                })
            })
            .end(function (err, res) {
                done(err);
            });
    });
});

//test if giving latitutde and longitude changes score
describe('GET /api/suggestions?q=toronto&longitude=-73.430040&latitude=45.579680', function () {
    it('expecting to return 200 with suggestion set', function (done) {

        request.get('/api/suggestions?q=toronto&longitude=-73.430040&latitude=45.579680')
            .expect(200)
            .expect(function (res) {

                //validate length of results
                expect(res.body.suggestions.length === 14)
                //valid 1st result in set
                expect(res.body.suggestions[0]).to.deep.equal({
                    "name": "Toronto, ON, CA",
                    "latitude": "43.70011",
                    "longitude": "-79.4163",
                    "score": 0.9741705953777785
                })
            })
            .end(function (err, res) {
                done(err);
            });
    });
});

