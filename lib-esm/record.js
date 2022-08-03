"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRecord = void 0;
const moment_1 = __importDefault(require("moment"));
const enums_1 = require("./enums");
class LogRecord {
    constructor(event, levelNo, level = enums_1.LevelTags.debug, time, extra = {}, context_key = "", args = []) {
        this.args = [];
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
        return moment_1.default.unix(this.time).toISOString();
    }
    getFormattedTime(format = "YYYY-MM-DD HH:mm:ss ZZ") {
        return moment_1.default.unix(this.time).format(format);
    }
}
exports.LogRecord = LogRecord;
//# sourceMappingURL=record.js.map