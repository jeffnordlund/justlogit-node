"use strict";

const HttpInterface = require('./httpinterface');


class JLIError {

    constructor() {
        this.message = '';
        this.stack = '';
        this.user = null;

        this.extravalues = {};
        this.statevalues = {};
    }

    isvalid() {
        if (!this.message) return false;

        return true;
    }

    setvalue(key, value) {
        if (key !== 'message' && key !== 'stack' && key !== 'user' && !this.extravalues.hasOwnProperty(key)) {
            this.extravalues[key] = value;
        }
    }

    addstatevalues(statevalues) {
        if (typeof statevalues !== 'undefined' && statevalues) {
            for (let i = 0; i < statevalues.length; i++) {
                let statevalue = statevalues[i];
                if (statevalue.hasOwnProperty('name') && statevalue.hasOwnProperty('value')) {
                    if (!this.hasOwnProperty(statevalue.name)) {
                        this.statevalues[statevalue.name] = statevalue.value;
                    }
                }
            }
        }
    }

    async log(loggingtoken) {
        const me = this;
        return new Promise(async (success, failure) => {
            try {
                const logobject = {};
                logobject.message = me.message;
                logobject.stack = me.stack;
                logobject.user = me.user;

                if (me.extravalues) {
                    for (let key in me.extravalues) {
                        if (!logobject.hasOwnProperty(key)) {
                            logobject[key] = me.extravalues[key];
                        }
                    }
                }

                if (me.statevalues) {
                    for (let key in me.statevalues) {
                        if (!logobject.hasOwnProperty(key)) {
                            logobject[key] = me.statevalues[key];
                        }
                    }
                }

                await HttpInterface.post(loggingtoken, 'error', logobject);
                success();
            }
            catch(e) {
                failure(e);
            }
        });
    }
}

module.exports = JLIError;
