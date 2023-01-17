"use strict";

const JLIError = require('./jlierror'),
  JLIPerformanceEntry = require('./jliperformanceentry'),
  JLIEventEntry = require('./jlievententry'),
  JLIInformationEntry = require('./jliinformationentry'),
  JLIAppAction = require('./jliappaction'),
  AppActionList = require('./appactionlist');

class Logger {
    constructor(token) {
        this.token = token;
        if (!this.token) {
            console.log('No token provided for the justlogit logger.  Logging will not function.');
        }
        else {
            this.appactionlist = new AppActionList(this.token, 60);
        }
    }

    async logError(errorobject, user, statevalues, cb) {
        const token = this.token;
        const erroritem = new JLIError();
        erroritem.message = (errorobject.hasOwnProperty('message')) ? errorobject.message : null;
        erroritem.stack = (errorobject.hasOwnProperty('stack')) ? errorobject.stack : null;
        erroritem.user = (typeof user !== 'undefined' && user) ? user : null;
    
        if (typeof statevalues !== 'undefined' && statevalues && Array.isArray(statevalues)) {
            erroritem.addstatevalues(statevalues);
        }
    
        // capture any other error values
        for (let key in errorobject) {
            erroritem.setvalue(key, errorobject[key]);
        }

        if (typeof cb === 'undefined' || !cb) {
            return new Promise(async (success, failure) => {
                try {
                    if (token) {
                        erroritem.log(token);
                    }
                    success(null);
                }
                catch(e) {
                    failure(e);
                }
            });
        }
        else {
            if (!token) {
                if (typeof cb !== 'undefined' && cb) cb(null);
            }
            else {
                try {
                    erroritem.log(token);
                    if (typeof cb !== 'undefined' && cb) cb(null);
                }
                catch(e) {
                    if (typeof cb !== 'undefined' && cb) cb(e);
                }
            }
        }
    }

    async logPerformance(method, timing, user, details, statevalues, cb) {
        const token = this.token;
        const perfitem = new JLIPerformanceEntry();
        perfitem.method = method;
        perfitem.timing = (typeof timing === 'number') ? timing : parseInt(timing, 10);
        perfitem.user = (typeof user !== 'undefined') ? user : null;
        perfitem.details = details;
        perfitem.addstatevalues(statevalues);

        if (typeof cb !== 'undefined' && cb) {
            try {
                if (!token) {
                    if (typeof cb !== 'undefined' && cb) cb(null);
                }
                else {
                    perfitem.log(token);
                    if (typeof cb !== 'undefined' && cb) cb(null);
                }
            }
            catch(e) {
                if (typeof cb !== 'undefined' && cb) cb(e);
            }
        }
        else {
            return new Promise(async (success, failure) => {
                try {
                    if (token) {
                        perfitem.log(token);
                    }
                    success(null);
                }
                catch(e) {
                    failure(e);
                }
            });
        }
    }

    async logEvent(name, description, user, statevalues, cb) {
        const token = this.token;
        const eventitem = new JLIEventEntry();
        eventitem.name = name;
        eventitem.description = description;
        eventitem.user = (typeof user !== 'undefined' && user) ? user : null;
        eventitem.addstatevalues(statevalues);

        if (typeof cb !== 'undefined' && cb) {
            try {
                if (!token) {
                    if (typeof cb !== 'undefined' && cb) cb(null);
                }
                else {
                    eventitem.log(token);
                    if (typeof cb !== 'undefined' && cb) cb(null);
                }
            }
            catch(e) {
                if (typeof cb !== 'undefined' && cb) cb(e);
            }
        }
        else {
            return new Promise(async (success, failure) => {
                try {
                    if (token) {
                        eventitem.log(token);
                    }
                    success(null);
                }
                catch(e) {
                    failure(e);
                }
            });
        }
    }

    async logInformation(method, details, user, statevalues, cb) {
        const token = this.token;
        const infoitem = new JLIInformationEntry();
        infoitem.method = method;
        infoitem.details = details;
        infoitem.user = (typeof user !== 'undefined' && user) ? user : null;
        infoitem.addstatevalues(statevalues);

        if (typeof cb !== 'undefined' && cb) {
            try {
                if (!token) {
                    if (typeof cb !== 'undefined' && cb) cb(null);
                }
                else {
                    infoitem.log(token);
                    if (typeof cb !== 'undefined' && cb) cb(null);
                }
            }
            catch(e) {
                if (typeof cb !== 'undefined' && cb) cb(e);
            }
        }
        else {
            return new Promise(async (success, failure) => {
                try {
                    if (token) {
                        infoitem.log(token);
                    }
                    success(null);
                }
                catch(e) {
                    failure(e);
                }
            });
        }
    }

    async logAppAction(name, pid, timing, cb) {
        const appactionitem = new JLIAppAction(name, timing, pid);
        this.appactionlist.addaction(appactionitem);

        if (typeof cb !== 'undefined' && cb) {
            if (typeof cb !== 'undefined' && cb) cb(null);
        }
        else {
            return new Promise(async (success, failure) => {
                success(null);
            });
        }
    }

    setAppActionLogInterval(seconds) {
        this.appactionlist.setlogginginterval(seconds);
    }
}

module.exports = Logger;