/* global */

"use strict";

const Logger = require('../index.js');
const assert = require('assert');

const token = 'z1bekO69T-d'; // token for the test app

describe('logger', function () {
  
  describe('logError', function () {

    it('should log an error', function (done) {
      var error = new Error('test error');
      error.stack = 'error stack';
      error.details = 'some error details';

      var logger = new Logger(token);
      logger.logError(error, null, null, function (err) {
        assert(!err, 'Error returned from logging call');
        done();
      });
      
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

    it ('should handle an error with quotes', function (done) {
      var error = new Error('test "2" error');
      error.stack = 'error "nice" stack';
      error.details = 'some error details';

      var logger = new Logger(token);
      logger.logError(error, null, null, function (err) {
        assert(!err, 'Error returned from error logger');
        done();
      });
    });

    it ('should handle async calls successfully', async function () {
      var error = new Error('async test error');
      error.stack = 'error "nice" stack';
      error.details = 'some error details';

      var logger = new Logger(token);
      try {
        await logger.logError(error, null, null);
      }
      catch(e) {
        assert(false, 'Error returned from the async call');
      }
    });

    it ('should handle state values correctly', async function () {
      const statevalues = [];
      statevalues.push({ name: 'statevalue1', value: 'Value 1'});
      statevalues.push({ name: 'statevalue2', value: 'Value 2'});

      var error = new Error('async test error');
      error.stack = 'error "nice" stack';
      error.details = 'some error details';

      var logger = new Logger(token);
      try {
        await logger.logError(error, null, statevalues);
        assert(true);
      }
      catch(e) {
        assert(false, 'Error returned from the async call');
      }
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

    it ('should handle state values correctly', async function () {
      const statevalues = [];
      statevalues.push({ name: 'statevalue1', value: 'Value 1'});
      statevalues.push({ name: 'statevalue2', value: 'Value 2'});

      var logger = new Logger(token);
      try {
        await logger.logPerformance('testMethod', 1000, null, null, statevalues);
        assert(true);
      }
      catch(e) {
        assert(false, 'Error was generated during the performance log attempt');
      }
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

    it ('should handle state values correctly', async function () {
      const statevalues = [];
      statevalues.push({ name: 'statevalue1', value: 'Value 1'});
      statevalues.push({ name: 'statevalue2', value: 'Value 2'});

      var logger = new Logger(token);
      try {
        await logger.logEvent('some event', 'some event occurred', null, statevalues);
        assert(true);
      }
      catch(e) {
        assert(false, 'Error was generated during the event log attempt');
      }
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
      }, 11000);
    }).timeout(12000);
    
  });

});