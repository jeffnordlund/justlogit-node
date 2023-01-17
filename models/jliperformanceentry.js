"use strict";

const HttpInterface = require('./httpinterface');


class JLIPerformanceEntry {

    constructor() {
        this.method = '';
        this.timing = 0;
        this.user = null;
        this.details = null;
        this.statevalues = null;
    }

    isvalid() {
        if (!this.method) return false;
        if (this.timing === null || this.timing < 0) return false;

        return true;
    }

    addstatevalues(statevalues) {
        if (typeof statevalues !== 'undefined' && statevalues) {
            this.statevalues = {};
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

    getquerystring() {
        const queryitems = [];
        queryitems.push('m=' + encodeURIComponent(this.method));
        queryitems.push('t=' + this.timing);
        if (this.user) {
            queryitems.push('u=' + encodeURIComponent(this.user));
        }
        if (this.details) {
            queryitems.push('d=' + encodeURIComponent(this.details));
        }

        if (this.statevalues) {
            for (let key in this.statevalues) {
                queryitems.push(encodeURIComponent(key) + '=' + encodeURIComponent(this.statevalues[key]));
            }
        }
        
        return queryitems.join('&');
    }

    async log(loggingtoken) {
        const me = this;
        return new Promise(async (success, failure) => {
            try {
                // format the query string
                const querystring = me.getquerystring();
                await HttpInterface.get(loggingtoken, 'perf', querystring);
                success(null);
            }
            catch(e) {
                failure(e);
            }
        });
    }
}

module.exports = JLIPerformanceEntry;
