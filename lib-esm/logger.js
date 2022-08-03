"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const enums_1 = require("./enums");
const record_1 = require("./record");
const time_1 = require("./time");
class Logger {
    constructor() {
        this.handlers = [];
        /**
         * property level for handler
         * @type number
         * @default 0
         */
        this.level = 0;
    }
    addHandler(handler) {
        this.handlers.push(handler);
    }
    ;
    /**
     * Function to set log level
     * @param {Levels} level: log level to set
     */
    setLevel(level) {
        this.level = level;
    }
    ;
    createRecord(event, levelNo, tag, time, props = {}) {
        const record = new record_1.LogRecord(event, levelNo, tag, time, props);
        return record;
    }
    handle(record) {
        for (const handler of this.handlers) {
            handler.emit(record);
        }
    }
    ;
    filter_record(current_level, log_level) {
        return (current_level > enums_1.Levels.not_set && current_level <= log_level) || (current_level === enums_1.Levels.not_set);
    }
    /**
     * Function to log message as info
     * @param {String} message: message to be logged
     * @param {object} props: extra parameters to support interpolation
     * @returns
     */
    info(message, props = {}) {
        if (this.filter_record(this.level, enums_1.Levels.info)) {
            const record = this.createRecord(message, enums_1.Levels.info, enums_1.LevelTags.info, (0, time_1.current_epoc)(), props);
            this.handle(record);
        }
    }
    ;
    debug(message, props = {}) {
        if (this.filter_record(this.level, enums_1.Levels.debug)) {
            const record = this.createRecord(message, enums_1.Levels.debug, enums_1.LevelTags.debug, (0, time_1.current_epoc)(), props);
            this.handle(record);
        }
    }
    warn(message, props = {}) {
        if (this.filter_record(this.level, enums_1.Levels.warn)) {
            const record = this.createRecord(message, enums_1.Levels.warn, enums_1.LevelTags.warn, (0, time_1.current_epoc)(), props);
            this.handle(record);
        }
    }
    error(message, props = {}) {
        if (this.filter_record(this.level, enums_1.Levels.error)) {
            const record = this.createRecord(message, enums_1.Levels.error, enums_1.LevelTags.error, (0, time_1.current_epoc)(), props);
            this.handle(record);
        }
    }
    critical(message, props = {}) {
        if (this.filter_record(this.level, enums_1.Levels.critical)) {
            const record = this.createRecord(message, enums_1.Levels.critical, enums_1.LevelTags.critical, (0, time_1.current_epoc)(), props);
            this.handle(record);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map