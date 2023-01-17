"use strict";

const HttpInterface = require('./httpinterface');


class JLIEventEntry {

    constructor() {
        this.name = '';
        this.description = '';
        this.user = null;
        this.statevalues = null;
    }

    isvalid() {
        if (!this.name) return false;
        if (!this.description) return false;

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
        queryitems.push('n=' + encodeURIComponent(this.name));
        queryitems.push('d=' + encodeURIComponent(this.description));
        if (this.user) {
            queryitems.push('u=' + encodeURIComponent(this.user));
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
                await HttpInterface.get(loggingtoken, 'event', querystring);
                success(null);
            }
            catch(e) {
                failure(e);
            }
        });
    }
}

module.exports = JLIEventEntry;