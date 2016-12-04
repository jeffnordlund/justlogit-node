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


  this.logError = function (obj) {
    if (this.token) {
      var category = 'error';
      executePost(category, obj, function (err) {
      });
    }
    else {
      return null;
    }
  };

  this.logPerformance = function (method, timing, user, details) {
    if (this.token) {
      var category = 'perf';
      var query = 'm=' + encodeURIComponent(method) + '&t=' + encodeURIComponent(timing);
      if (user) query += '&u=' + encodeURIComponent(user);
      if (details) query += '&d=' + encodeURIComponent(details);

      executeGet(category, query, function(err) {
      });
    }
    else {
      return null;
    }
  };

  this.logEvent = function (name, description, user) {
    if (this.token) {
      var category = 'event';
      var query = 'n=' + encodeURIComponent(name) + '&d=' + encodeURIComponent(description);
      if (user) query += '&u=' + encodeURIComponent(user);

      executeGet(category, query, function (err) {
      });
    }
    else {
      return null;
    }
  };

  this.logInformation = function (method, details, user) {
    if (this.token) {
      var category = 'info';
      var query = 'm=' + encodeURIComponent(method) + '&d=' + encodeURIComponent(details);
      if (user) query += '&u=' + encodeURIComponent(user);

      executeGet(category, query, function (err) {
      });
    }
    else {
      return null;
    }
  };
};