import { Levels, LevelTags } from "./enums";
import { LogRecord } from "./record";
import { current_epoc } from "./time";
class Logger {
    handlers = [];
    /**
     * property level for handler
     * @type number
     * @default 0
     */
    level = 0;
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
        const record = new LogRecord(event, levelNo, tag, time, props);
        return record;
    }
    handle(record) {
        for (const handler of this.handlers) {
            handler.emit(record);
        }
    }
    ;
    filter_record(current_level, log_level) {
        return (current_level > Levels.not_set && current_level <= log_level) || (current_level === Levels.not_set);
    }
    /**
     * Function to log message as info
     * @param {String} message: message to be logged
     * @param {object} props: extra parameters to support interpolation
     * @returns
     */
    info(message, props = {}) {
        if (this.filter_record(this.level, Levels.info)) {
            const record = this.createRecord(message, Levels.info, LevelTags.info, current_epoc(), props);
            this.handle(record);
        }
    }
    ;
    debug(message, props = {}) {
        if (this.filter_record(this.level, Levels.debug)) {
            const record = this.createRecord(message, Levels.debug, LevelTags.debug, current_epoc(), props);
            this.handle(record);
        }
    }
    warn(message, props = {}) {
        if (this.filter_record(this.level, Levels.warn)) {
            const record = this.createRecord(message, Levels.warn, LevelTags.warn, current_epoc(), props);
            this.handle(record);
        }
    }
    error(message, props = {}) {
        if (this.filter_record(this.level, Levels.error)) {
            const record = this.createRecord(message, Levels.error, LevelTags.error, current_epoc(), props);
            this.handle(record);
        }
    }
    critical(message, props = {}) {
        if (this.filter_record(this.level, Levels.critical)) {
            const record = this.createRecord(message, Levels.critical, LevelTags.critical, current_epoc(), props);
            this.handle(record);
        }
    }
}
export { Logger };
//# sourceMappingURL=logger.js.map