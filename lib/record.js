import moment from 'moment';
import { LevelTags } from './enums';
export class LogRecord {
    event;
    level;
    levelNo;
    extra;
    context_key;
    args = [];
    time;
    constructor(event, levelNo, level = LevelTags.debug, time, extra = {}, context_key = "", args = []) {
        this.event = event;
        this.level = level;
        this.time = time;
        this.extra = extra;
        this.context_key = context_key;
        this.args = args;
        this.levelNo = levelNo;
        this.getMessage = this.getMessage.bind(this);
        this.getTimeInMilliseconds = this.getTimeInMilliseconds.bind(this);
        this.getIsoFormatTime = this.getIsoFormatTime.bind(this);
        this.getFormattedTime = this.getFormattedTime.bind(this);
    }
    getMessage() {
        return this.event;
    }
    getTimeInMilliseconds() {
        return this.time;
    }
    getIsoFormatTime() {
        return moment.unix(this.time).toISOString();
    }
    getFormattedTime(format = "YYYY-MM-DD HH:mm:ss ZZ") {
        return moment.unix(this.time).format(format);
    }
}
//# sourceMappingURL=record.js.map