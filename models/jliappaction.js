"use strict";

const HttpInterface = require('./httpinterface');

class JLIAppAction {

    constructor(name, timing, processid) {
        this.name = name;
        this.processid = (typeof processid !== 'undefined' && processid) ? processid : null;
        this.timing = (typeof timing === 'number') ? timing : parseInt(timing, 10);
        if (isNaN(this.timing)) throw 'Invalid timing value';
        
        this.count = 1;
        this.mintiming = this.timing;
        this.maxtiming = this.timing;
        
        this.logstart = new Date();
    }

    isvalid() {
        if (!this.name) return false;
        if (!this.timing) return false;

        return true;
    }

    async log(loggingtoken, logginginterval) {
        const me = this;
        return new Promise(async (success, failure) => {
            try {
                const actioninstance = {};
                actioninstance.name = me.name;
                actioninstance.count = me.count;
                actioninstance.timestamp = me.logstart.getTime();
                actioninstance.interval = logginginterval;
                actioninstance.processid = me.processid;
                actioninstance.mintiming = me.mintiming;
                actioninstance.maxtiming = me.maxtiming;
                actioninstance.timing = me.timing;

                await HttpInterface.post(loggingtoken, 'appaction', actioninstance);
                success(null);
            }
            catch(e) {
                failure(e);
            }
        });
    }
}


module.exports = JLIAppAction;
