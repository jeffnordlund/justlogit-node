"use strict";

var https = require('https');

module.exports = function (token) {
  var _this = this;
  this.token = token;

  let _actionloginterval = 60; // default to 60 seconds
  this.appactions = {};



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

    const json = JSON.stringify(obj);

    let options = {
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
        //console.log('data received');
      });
      res.on('end', function () {
        if (typeof callback !== 'undefined' && callback) callback(null);
      });
    });

    req.on('error', function (e) {
      if (typeof callback !== 'undefined' && callback) callback(e);
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

  function getstartdate() {
    const start = new Date();

    // calculate the start time
    const startseconds = _actionloginterval % 60;
    let offsetseconds = 0;

    if (startseconds === 0) {
      offsetseconds = start.getUTCSeconds();
    }
    else {
      offsetseconds = startseconds % start.getUTCSeconds();
    }
    
    start.setUTCSeconds(start.getUTCSeconds() - offsetseconds);
    start.setUTCMilliseconds(0);
    return start;
  }

  function createappaction(start) {
    if (typeof start === 'undefined' || !start) start = getstartdate();

    // create the first action
    const action = {};
    action.interval = _actionloginterval;
    action.start = start;
    action.end = new Date(start.getTime() + (_actionloginterval * 1000));
    action.instances = [];

    return action;
  }


  function summarizeinstances(instances) {
    const result = {};
    result.count = instances.length;

    const timinginstances = instances.filter(function (item) {
      return (item.hasOwnProperty('timing') && item.timing);
    });

    // sort by timing
    if (timinginstances.length > 0) {
      timinginstances.sort(function (i1, i2) {
        return i1.timing - i2.timing;
      });

      result.mintiming = timinginstances[0].timing;
      result.maxtiming = timinginstances[timinginstances.length - 1].timing;

      // total up the timings
      result.timing = 0;
      timinginstances.forEach(function(item) {
        result.timing += parseInt(item.timing, 10);
      });
    }

    return result;
  }


  function saveappaction(name, appaction, cb) {

    const pids = [];

    for (let i = 0; i < appaction.instances.length; i++) {
      let instance = appaction.instances[i];
      if (typeof instance.pid !== 'undefined' && instance.pid) {
        if (pids.indexOf(instance.pid) === -1) pids.push(instance.pid);
      }
    }

    if (pids.length > 0) {
      for (let i = 0; i < pids.length; i++) {
        let pid = pids[i];
        let items = appaction.instances.filter(function(item) {
          return (item.pid === pid);
        });

        let result = summarizeinstances(items);
        result.name = name;
        result.timestamp = appaction.start.getTime();
        result.interval = _actionloginterval;
        result.pid = pid;

        executePost('appaction', result, cb);
      }
    }
    else {
      let result = summarizeinstances(appaction.instances);
      result.name = name;
      result.timestamp = appaction.start.getTime();
      result.interval = _actionloginterval;
      result.pid = pid;

      executePost('appaction', result, cb);
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
        if (typeof cb !== 'undefined' && cb) cb(e);
      });
    }
    else {
      if (typeof cb !== 'undefined' && cb) cb(null);
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
        if (typeof cb !== 'undefined' && cb) cb(err);
      });
    }
    else {
      if (typeof cb !== 'undefined' && cb) cb(null);
    }
  };

  this.logEvent = function (name, description, user, statevalues, cb) {
    if (this.token) {
      var category = 'event';
      var query = 'n=' + encodeURIComponent(name) + '&d=' + encodeURIComponent(description);
      if (user) query += '&u=' + encodeURIComponent(user);

      query += getStateQueryValues(statevalues);

      executeGet(category, query, function (err) {
        if (typeof cb !== 'undefined' && cb) cb(err);
      });
    }
    else {
      if (typeof cb !== 'undefined' && cb) cb(null);
    }
  };

  this.logInformation = function (method, details, user, statevalues, cb) {
    if (this.token) {
      var category = 'info';
      var query = 'm=' + encodeURIComponent(method) + '&d=' + encodeURIComponent(details);
      if (user) query += '&u=' + encodeURIComponent(user);

      query += getStateQueryValues(statevalues);

      executeGet(category, query, function (err) {
        if (typeof cb !== 'undefined' && cb) cb(err);
      });
    }
    else {
      if (typeof cb !== 'undefined' && cb) cb(null);
    }
  };

  /*
    Call this to change the default app action logging interval.  The default 
    interval is 60 seconds.  The lowest interval allowed is 10 seconds.
  */
  this.setAppActionLogInterval = function (seconds) {
    let value = parseInt(seconds, 10);
    // make sure this is a number at least 10 seconds
    if (!isNaN(value) && value >= 10) _actionloginterval = value;
  };

  /*
    Log the app action.  The name is the only thing required, but the process identifier (pid)
    will allow more granular process tracking (if you are running multiple process instances on a single
    server).  Using the timing will allow both action count tracking as well as action performance.
  */
  this.logAppAction = function (name, pid, timing, cb) {
    if (typeof name === 'undefined' || !name) return;

    const now = new Date();

    const instance = {};
    if (typeof pid !== 'undefined' && pid) instance.pid = pid;
    if (typeof timing !== 'undefined' && timing) instance.timing = timing;

    if (this.appactions.hasOwnProperty(name)) {
      const nowtime = now.getTime();
      if (nowtime >= this.appactions[name].start.getTime() && nowtime < this.appactions[name].end.getTime()) {
        this.appactions[name].instances.push(instance);
        if (typeof cb !== 'undefined' && cb) cb(null);
      }
      else {
        const appaction = this.appactions[name];
        this.appactions[name] = createappaction(appaction.end);
        this.appactions[name].instances.push(instance);
        // post the old app action block
        saveappaction(name, appaction, cb);
      }
    }
    else {
      this.appactions[name] = createappaction();
      this.appactions[name].instances.push(instance);
      if (typeof cb !== 'undefined' && cb) cb(null);
    }
  };

};