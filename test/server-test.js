var chai = require('chai');
var server = require('../dist/index');
var supertest = require('supertest');
var expect = chai.expect;
var request = supertest(server);

describe('GET api/suggestions?q=lalalala', function () {
    it('expecting', function (done) {
        var expected = {
            "suggestions": []
            }
      request.get('/api/suggestions?q=lalalala')
        .expect(200) // expected return code
        .expect(expected) // body if necessary
        .end(function (err, res) { //end function + error report
          done(err);
        })
    });
  });