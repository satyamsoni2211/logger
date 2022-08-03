import { HandlerInterfaceType, LoggerInterfaceType, RecordInterfaceType } from "./base_types";
import { Levels, LevelTypes } from "./enums";
import { LogRecord } from "./record";
declare class Logger implements LoggerInterfaceType {
    handlers: Array<HandlerInterfaceType>;
    /**
     * property level for handler
     * @type number
     * @default 0
     */
    level: number;
    addHandler(handler: HandlerInterfaceType): void;
    /**
     * Function to set log level
     * @param {Levels} level: log level to set
     */
    setLevel(level: Levels): void;
    createRecord(event: any, levelNo: number, tag: LevelTypes, time: number, props?: any): LogRecord;
    handle(record: RecordInterfaceType): void;
    private filter_record;
    /**
     * Function to log message as info
     * @param {String} message: message to be logged
     * @param {object} props: extra parameters to support interpolation
     * @returns
     */
    info(message: string, props?: any): void;
    debug(message: string, props?: any): void;
    warn(message: string, props?: any): void;
    error(message: string, props?: any): void;
    critical(message: string, props?: any): void;
}
export { Logger };
