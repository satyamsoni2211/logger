"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRecord = void 0;
var moment_1 = __importDefault(require("moment"));
var enums_1 = require("./enums");
var LogRecord = /** @class */ (function () {
    function LogRecord(event, levelNo, level, time, extra, context_key, args) {
        if (level === void 0) { level = enums_1.LevelTags.debug; }
        if (extra === void 0) { extra = {}; }
        if (context_key === void 0) { context_key = ""; }
        if (args === void 0) { args = []; }
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
    LogRecord.prototype.getMessage = function () {
        return this.event;
    };
    LogRecord.prototype.getTimeInMilliseconds = function () {
        return this.time;
    };
    LogRecord.prototype.getIsoFormatTime = function () {
        return moment_1.default.unix(this.time).toISOString();
    };
    LogRecord.prototype.getFormattedTime = function (format) {
        if (format === void 0) { format = "YYYY-MM-DD HH:mm:ss ZZ"; }
        return moment_1.default.unix(this.time).format(format);
    };
    return LogRecord;
}());
exports.LogRecord = LogRecord;
//# sourceMappingURL=record.js.map