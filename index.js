"use strict";

var https = require('https');

module.exports = function (token) {
  var _this = this;
  this.token = token;


  function executeGet(method, query, callback) {

    var url = 'https://addto.justlog.it/v1/log/' + _this.token + '/' + method + '?' + query;

    https.get(url, function(res) {
      res.on('data', function (d) {
        callback(null);
      });

    }).on('error', function(e) {
      console.log('justlog.it - request error: ' + e);
      callback(e);
    });
  }

  function executePost(method, obj, callback) {

    var json = JSON.stringify(obj);

    var options = {
      hostname : 'addto.justlog.it',
      port: 443,
      path: '/v1/log/' + _this.token + '/' + method,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length' : json.length
      }
    };

    var req = https.request(options, function (res) {
      res.setEncoding('utf8');
      res.on('data', function (d) {
        console.log('data received');
      });
      res.on('end', function () {
        callback(null);
      });
    });

    req.on('error', function (e) {
      callback(e);
    });

    req.write(json);
    req.end();
  }

  function addStateValues(obj, statevalues) {
    if (statevalues && Array.isArray(statevalues)) {
      for (var i = 0; i < statevalues.length; i++) {
        var val = statevalues[i];
        if (val.hasOwnProperty('name') && val.hasOwnProperty('value')) {
          obj[val.name] = val.value;
        }
      }
    }
  }

  function getStateQueryValues(statevalues) {
    var result = [];
    if (statevalues && Array.isArray(statevalues)) {
      for (var i = 0; i < statevalues.length; i++) {
        var val = statevalues[i];
        if (val.hasOwnProperty('name') && val.hasOwnProperty('value')) {
          result.push(encodeURIComponent(val.name) + '=' + encodeURIComponent(val.value));
        }
      }
    }

    if (result.length > 0) {
      return '&' + result.join('&');
    }
    else {
      return '';
    }
  }


  this.logError = function (obj, user, statevalues, cb) {
    if (this.token) {
      var category = 'error';

      // convert into an error object
      var err = {};
      if (obj.hasOwnProperty('message')) err.message = obj.message;
      if (obj.hasOwnProperty('stack')) err.stack = obj.stack;

      for (var key in obj) {
        if (key !== 'message' && key !== 'stack') err[key] = obj[key];
      }

      if (user !== undefined && user) err.user = user;
      addStateValues(err, statevalues);

      executePost(category, err, function (e) {
        if (cb) cb(e);
      });
    }
    else {
      if (cb) cb(null);
    }
  };

  this.logPerformance = function (method, timing, user, details, statevalues, cb) {
    if (this.token) {
      var category = 'perf';
      var query = 'm=' + encodeURIComponent(method) + '&t=' + encodeURIComponent(timing);
      if (user) query += '&u=' + encodeURIComponent(user);
      if (details) query += '&d=' + encodeURIComponent(details);

      query += getStateQueryValues(statevalues);

      executeGet(category, query, function(err) {
        if (cb) cb(err);
      });
    }
    else {
      cb(null);
    }
  };

  this.logEvent = function (name, description, user, statevalues, cb) {
    if (this.token) {
      var category = 'event';
      var query = 'n=' + encodeURIComponent(name) + '&d=' + encodeURIComponent(description);
      if (user) query += '&u=' + encodeURIComponent(user);

      query += getStateQueryValues(statevalues);

      executeGet(category, query, function (err) {
        if (cb) cb(err);
      });
    }
    else {
      cb(null);
    }
  };

  this.logInformation = function (method, details, user, statevalues, cb) {
    if (this.token) {
      var category = 'info';
      var query = 'm=' + encodeURIComponent(method) + '&d=' + encodeURIComponent(details);
      if (user) query += '&u=' + encodeURIComponent(user);

      query += getStateQueryValues(statevalues);

      executeGet(category, query, function (err) {
        if (cb) cb(err);
      });
    }
    else {
      cb(null);
    }
  };
};