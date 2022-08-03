"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var enums_1 = require("./enums");
var record_1 = require("./record");
var time_1 = require("./time");
var Logger = /** @class */ (function () {
    function Logger() {
        this.handlers = [];
        /**
         * property level for handler
         * @type number
         * @default 0
         */
        this.level = 0;
    }
    Logger.prototype.addHandler = function (handler) {
        this.handlers.push(handler);
    };
    ;
    /**
     * Function to set log level
     * @param {Levels} level: log level to set
     */
    Logger.prototype.setLevel = function (level) {
        this.level = level;
    };
    ;
    Logger.prototype.createRecord = function (event, levelNo, tag, time, props) {
        if (props === void 0) { props = {}; }
        var record = new record_1.LogRecord(event, levelNo, tag, time, props);
        return record;
    };
    Logger.prototype.handle = function (record) {
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler.emit(record);
        }
    };
    ;
    Logger.prototype.filter_record = function (current_level, log_level) {
        return (current_level > enums_1.Levels.not_set && current_level <= log_level) || (current_level === enums_1.Levels.not_set);
    };
    /**
     * Function to log message as info
     * @param {String} message: message to be logged
     * @param {object} props: extra parameters to support interpolation
     * @returns
     */
    Logger.prototype.info = function (message, props) {
        if (props === void 0) { props = {}; }
        if (this.filter_record(this.level, enums_1.Levels.info)) {
            var record = this.createRecord(message, enums_1.Levels.info, enums_1.LevelTags.info, (0, time_1.current_epoc)(), props);
            this.handle(record);
        }
    };
    ;
    Logger.prototype.debug = function (message, props) {
        if (props === void 0) { props = {}; }
        if (this.filter_record(this.level, enums_1.Levels.debug)) {
            var record = this.createRecord(message, enums_1.Levels.debug, enums_1.LevelTags.debug, (0, time_1.current_epoc)(), props);
            this.handle(record);
        }
    };
    Logger.prototype.warn = function (message, props) {
        if (props === void 0) { props = {}; }
        if (this.filter_record(this.level, enums_1.Levels.warn)) {
            var record = this.createRecord(message, enums_1.Levels.warn, enums_1.LevelTags.warn, (0, time_1.current_epoc)(), props);
            this.handle(record);
        }
    };
    Logger.prototype.error = function (message, props) {
        if (props === void 0) { props = {}; }
        if (this.filter_record(this.level, enums_1.Levels.error)) {
            var record = this.createRecord(message, enums_1.Levels.error, enums_1.LevelTags.error, (0, time_1.current_epoc)(), props);
            this.handle(record);
        }
    };
    Logger.prototype.critical = function (message, props) {
        if (props === void 0) { props = {}; }
        if (this.filter_record(this.level, enums_1.Levels.critical)) {
            var record = this.createRecord(message, enums_1.Levels.critical, enums_1.LevelTags.critical, (0, time_1.current_epoc)(), props);
            this.handle(record);
        }
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map