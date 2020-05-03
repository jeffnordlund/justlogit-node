/* global */

"use strict";

const Logger = require('../index.js');
const assert = require('assert');

const token = 'z1bekO69T'; // token for the test app

// unit test

// set up the object

describe('logger', function () {

  
  describe('logError', function () {

    it('should log an error', function (done) {
      var error = new Error('test error');
      error.stack = 'error stack';
      error.details = 'some error details';

      var logger = new Logger(token);
      logger.logError(error);
      setTimeout(function () {
        done();
      }, 1200);
    });

    it ('should log an error with a user', function (done) {
      var error = new Error('user error');
      error.stack = 'some shit happened at line 1';
      
      var logger = new Logger(token);
      logger.logError(error, 'johnsmith', null, function (err) {
        assert(!err, 'Error returned from error logger');
        done();
      });
    });


    it ('should handle an error with quotes', function () {
      var error = new Error('test "2" error');
      error.stack = 'error "nice" stack';
      error.details = 'some error details';

      var logger = new Logger(token);
      logger.logError(error);
      setTimeout(function () {
        done();
      }, 1200);
    });
  });


  describe('logPerformance', function () {
    it('should log a performace entry', function (done) {
      var logger = new Logger(token);
      logger.logPerformance('testMethod', 1000);
      setTimeout(function () {
        done();
      }, 1000);
    });
  });


  describe ('logEvent', function () {
    it('should log an event entry', function (done) {
      var logger = new Logger(token);
      logger.logEvent('some event', 'some event occurred');
      setTimeout(function () {
        done();
      }, 1000);
    });
  });


  describe ('logInformation', function () {
    it ('should log an info entry', function (done) {
      var logger = new Logger(token);
      logger.logInformation('someMethod', 'running some method');
      setTimeout(function () {
        done();
      }, 1000);
    });
  });


  describe ('logappaction', function () {
    it ('should log an appaction entry', function (done) {
      var logger = new Logger(token);
      logger.setAppActionLogInterval(10);
      logger.logAppAction('Action 1', 'process1', 1000);
      logger.logAppAction('Action 1', 'process1', 1500);
      logger.logAppAction('Action 1', 'process1', 1200);
      setTimeout(function () {
        logger.logAppAction('Action 1', 'process1', 1250, function(err) {
          assert(err === null);
          done();
        });
      }, 12000);
    }).timeout(20000);
  });

});