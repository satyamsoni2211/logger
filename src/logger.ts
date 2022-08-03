import { HandlerInterfaceType, LoggerInterfaceType, RecordInterfaceType } from "./base_types";
import { Levels, LevelTags, LevelTypes } from "./enums";
import { LogRecord } from "./record";
import { current_epoc } from "./time"

class Logger implements LoggerInterfaceType {
    public handlers: Array<HandlerInterfaceType> = [];
    /**
     * property level for handler
     * @type number
     * @default 0
     */
    public level: number = 0;
    addHandler(handler: HandlerInterfaceType): void {
        this.handlers.push(handler);
    };
    /**
     * Function to set log level
     * @param {Levels} level: log level to set
     */
    setLevel(level: Levels): void {
        this.level = level;
    };
    createRecord(event: any, levelNo: number, tag: LevelTypes, time: number, props: any = {}): LogRecord {
        const record = new LogRecord(event, levelNo, tag, time, props)
        return record;
    }
    handle(record: RecordInterfaceType): void {
        for (const handler of this.handlers) {
            handler.emit(record);
        }
    };
    private filter_record(current_level: number, log_level: number): boolean {
        return (current_level > Levels.not_set && current_level <= log_level) || (current_level === Levels.not_set)
    }
    /**
     * Function to log message as info
     * @param {String} message: message to be logged
     * @param {object} props: extra parameters to support interpolation
     * @returns
     */
    info(message: string, props: any = {}): void {
        if (this.filter_record(this.level, Levels.info)) {
            const record = this.createRecord(message, Levels.info, LevelTags.info, current_epoc(), props);
            this.handle(record);
        }
    };
    debug(message: string, props: any = {}): void {
        if (this.filter_record(this.level, Levels.debug)) {
            const record = this.createRecord(message, Levels.debug, LevelTags.debug, current_epoc(), props);
            this.handle(record);
        }
    }
    warn(message: string, props: any = {}): void {
        if (this.filter_record(this.level, Levels.warn)) {
            const record = this.createRecord(message, Levels.warn, LevelTags.warn, current_epoc(), props);
            this.handle(record);
        }
    }
    error(message: string, props: any = {}): void {
        if (this.filter_record(this.level, Levels.error)) {
            const record = this.createRecord(message, Levels.error, LevelTags.error, current_epoc(), props);
            this.handle(record);
        }
    }
    critical(message: string, props: any = {}): void {
        if (this.filter_record(this.level, Levels.critical)) {
            const record = this.createRecord(message, Levels.critical, LevelTags.critical, current_epoc(), props);
            this.handle(record);
        }
    }
}

export { Logger }