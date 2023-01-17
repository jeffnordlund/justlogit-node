"use strict";


class AppActionList {
    constructor(token, logginginterval) {
        this.loggingintervalseconds = (typeof logginginterval === 'number' && logginginterval) ? logginginterval : 60;
        this.actions = [];
        this.loggingtoken = token;
        if (!this.loggingtoken) throw 'No logging token assigned';
    }

    findaction(name, pid) {
        for (let i = 0; i < this.actions.length; i++) {
            if (this.actions[i].name === name) {
                if (this.actions[i].processid && this.actions[i].processid === pid) return this.actions[i];
            }
        }

        return null;
    }

    removeaction(name, pid) {
        for (let i = 0; i < this.actions.length; i++) {
            if (this.actions[i].name === name) {
                if (this.actions[i].processid && this.actions[i].processid === pid) {
                    this.actions.splice(i, 1);
                    return;
                }
            }
        }
    }

    addaction(action) {

        let existingaction = this.findaction(action.name, action.processid);

        if (!existingaction) {
            this.actions.push(action);
        }
        else {
            existingaction.count += 1;
            existingaction.timing += action.timing;
            if (action.timing < existingaction.mintiming) existingaction.mintiming = action.timing;
            if (action.timing > existingaction.maxtiming) existingaction.maxtiming = action.timing;

            // see if we should be logging the action
            let now = new Date();
            now.setSeconds(now.getSeconds() - this.loggingintervalseconds);
            if (now.getTime() > existingaction.logstart.getTime()) {
                this.removeaction(existingaction.name, existingaction.processid);
                existingaction.log(this.loggingtoken, this.loggingintervalseconds);
            }
        }
    }

    setlogginginterval(interval) {
        this.loggingintervalseconds = (typeof interval === 'number') ? interval : parseInt(interval, 10);
    }
}

module.exports = AppActionList;
