/* global */

"use strict";

var Logger = require('../index.js');
var assert = require('assert');

// unit test

// set up the object
describe('logger', function () {

  // describe the method/functionality
  describe('logError', function () {

    it('should log an error', function (done) {
      var error = new Error('test error');
      error.stack = 'error stack';
      error.details = 'some error details';

      var logger = new Logger('123456');
      logger.logError(error);
      setTimeout(function () {
        done();
      }, 1200);
    });

    it ('should log an error with a user', function (done) {
      var error = new Error('user error');
      error.stack = 'some shit happened at line 1';
      
      var logger = new Logger('123456');
      logger.logError(error, 'johnsmith', null, function (err) {
        assert(!err, 'Error returned from error logger');
        done();
      });
    });
  });


  describe('logPerformance', function () {
    it('should log a performace entry', function (done) {
      var logger = new Logger('123456');
      logger.logPerformance('testMethod', 1000);
      setTimeout(function () {
        done();
      }, 1000);
    });
  });


  describe ('logEvent', function () {
    it('should log an event entry', function (done) {
      var logger = new Logger('123456');
      logger.logEvent('some event', 'some event occurred');
      setTimeout(function () {
        done();
      }, 1000);
    });
  });


  describe ('logInformation', function () {
    it ('should log an info entry', function (done) {
      var logger = new Logger('123456');
      logger.logInformation('someMethod', 'running some method');
      setTimeout(function () {
        done();
      }, 1000);
    });
  });

});