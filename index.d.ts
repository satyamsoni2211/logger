declare enum Levels {
    not_set = 0,
    debug = 1,
    info = 2,
    warn = 3,
    error = 4,
    critical = 5
}
declare type LevelTypes = Uppercase<Exclude<keyof typeof Levels, "not_set">>;

interface FormatterInterface {
    format(value: RecordInterface): string;
}
interface HandlerInterface {
    formatter: FormatterInterface;
    level: number;
    setFormatter(formatter: FormatterInterface): void;
    emit(record: RecordInterface): void;
    setLevel(level: number): void;
    filter(level: number): boolean;
}
interface LoggerInterface {
    addHandler(handler: HandlerInterface): void;
    setLevel(level: number): void;
    handle(record: RecordInterface): void;
    debug(message: string, props?: Record<string, any>): void;
    info(message: string, props?: Record<string, any>): void;
    warn(message: string, props?: Record<string, any>): void;
    error(message: string, props?: Record<string, any>): void;
    critical(message: string, props?: Record<string, any>): void;
}
interface RecordInterface {
    event: any;
    level: LevelTypes;
    levelNo: number;
    extra: any;
    context_key: string;
    time: number;
    getMessage(): any;
    args: Array<string>;
    getTimeInMilliseconds(): number;
    getIsoFormatTime(): string;
    getFormattedTime(format?: string): string;
}
declare type FormatterInterfaceType = FormatterInterface;
declare type HandlerInterfaceType = HandlerInterface;
declare type LoggerInterfaceType = LoggerInterface;
declare type RecordInterfaceType = RecordInterface;

declare class LogRecord implements RecordInterfaceType {
    event: any;
    level: LevelTypes;
    levelNo: number;
    extra: object;
    context_key: string;
    args: Array<string>;
    time: number;
    constructor(event: any, levelNo: number, level: "ERROR" | "DEBUG" | "INFO" | "WARN" | "CRITICAL" | undefined, time: number, extra?: object, context_key?: string, args?: Array<any>);
    getMessage(): any;
    getTimeInMilliseconds(): number;
    getIsoFormatTime(): string;
    getFormattedTime(format?: string): string;
}

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

/**
 * Abstract base class for Handler
 * Can be used to create a new Handler instance
 */
declare abstract class BaseHandler implements HandlerInterfaceType {
    formatter: FormatterInterfaceType;
    /**
     * Level number corresponding to the log levle
     * of handler. By default this is 1 (debug)
     * This can be overridden by setLevel() method
     * @type {number}
     */
    level: number;
    /**
     * constructor for Handler class
     * by default it sets level to debug
     */
    constructor();
    /**
     * Function to override the default formatter
     * this is required as by default no formatter is set
     * @param {FormatterInterfaceType} formatter - Formatter instance
     * @returns {void}
     */
    setFormatter(formatter: FormatterInterfaceType): void;
    /**
     * Abstract method which needs to be overridden in the derived
     * classes to emit the record that is logged.
     * This is the call on every record emittion my logger
     * @param {RecordInterfaceType} record: Log record to emit
     */
    abstract emit(record: RecordInterfaceType): void;
    /**
     * Function to override log level of
     * handler class
     * @param {number} level - Log level to override (1,5)
     */
    setLevel(level: number): void;
    /**
     * Filter function to check if handler needs to process the record
     * or skip it based of its log level
     * @param {number} level - Log level to check for filtering
     * @returns {boolean}
     */
    filter(level: number): boolean;
}
/**
 * Abstract base class for Formatter
 * Can be used to create a new Formatter instance
 */
declare abstract class BaseFormatter implements FormatterInterfaceType {
    abstract formatRecord(record: RecordInterfaceType): string;
    format(value: RecordInterfaceType): string;
}

declare class ConsoleHandler extends BaseHandler {
    /**
     * Function to fetch console handler corresponding to
     * log level
     * @param {string} level - Log level to fetch console handler
     * @returns {Function}
     */
    private getConsoleMethod;
    /**
     * @override
     */
    emit(record: RecordInterfaceType): void;
}
declare class StreamHandler extends BaseHandler {
    /**
     * Endpoint to post data to sumo logic
     * @type {string}
     */
    endpoint: string;
    /**
     * @constructor
     * @param {Object} props - Props for the constructor
     * @property {string} endpoint - Endpoint to post data to sumo logic
     */
    constructor(props: {
        endpoint: string;
    });
    /**
     * Function to post data to sumo logic
     * @param {string} message - Message to be posted to sumo logic
     */
    postToSumo(message: string): void;
    /**
     * @override
     */
    emit(record: RecordInterfaceType): void;
}

type handler_d_ConsoleHandler = ConsoleHandler;
declare const handler_d_ConsoleHandler: typeof ConsoleHandler;
type handler_d_StreamHandler = StreamHandler;
declare const handler_d_StreamHandler: typeof StreamHandler;
declare namespace handler_d {
  export {
    handler_d_ConsoleHandler as ConsoleHandler,
    handler_d_StreamHandler as StreamHandler,
  };
}

declare class BasicFormatter extends BaseFormatter {
    /**
     * @override
     */
    formatRecord(record: RecordInterfaceType): string;
}
declare class JSONFormatter extends BaseFormatter {
    /**
     * Function to check if the message is an Error or not
     * @param {any} message - Message to check for Error instance
     * @returns {boolean} True if the message is an Error instance, false otherwise
     */
    isError(message: any): boolean;
    /**
     * Function to Get the stack from message if it is an Error instance
     * @param {RecordInterfaceType} record - Record Instance to get stack from
     * @returns {string|undefined} Stack from the error instance if exists, otherwise undefined
     */
    getStack(record: RecordInterfaceType): string | undefined;
    /**
     * Function to interpolateRecord if extra parameters are present
     * @param {string} record - record to interpolate
     * @param {object} extra - extra arguments to interpolate
     * @returns {string} interpolated message
     */
    interpolateRecord(record: string, extra: {
        [key: string]: any;
    }): string;
    /**
     * Function to format message from the record to log
     * @param record - Log record
     * @returns {string} formatted message
     */
    formatMessage(record: RecordInterfaceType): string;
    /**
     * @override
     */
    formatRecord(record: RecordInterfaceType): string;
}

type formatter_d_BasicFormatter = BasicFormatter;
declare const formatter_d_BasicFormatter: typeof BasicFormatter;
type formatter_d_JSONFormatter = JSONFormatter;
declare const formatter_d_JSONFormatter: typeof JSONFormatter;
declare namespace formatter_d {
  export {
    formatter_d_BasicFormatter as BasicFormatter,
    formatter_d_JSONFormatter as JSONFormatter,
  };
}

declare type CustomLoggerProps = {
    level?: 1 | 2 | 3 | 4 | 5;
    handlers?: Array<BaseHandler>;
    formatter?: BaseFormatter;
};
/**
 * Function to get basic logger instance
 * This returns a console logger with basic logging
 * @returns {Logger} Logger instance
 */
declare function get_basic_logger(): Logger;
/**
 * Function to get custom logger instance
 * @param {CustomLoggerProps} props -  CustomLoggerProps object containing handlers, formatter and level
 * @param {Array<BaseHandler>} [props.handlers=[new ConsoleHandler()]] - List of handlers to add to logger
 * @param {BaseFormatter} [props.formatter=new BasicFormatter()] - Formatter to use for logging messages
 * @param {1|2|3|4|5} [props.level=1] - Log level to use for logging messages
 * @returns {Logger} Logger instance
 */
declare function get_custom_logger(props: CustomLoggerProps): Logger;

declare const utils_d_get_basic_logger: typeof get_basic_logger;
declare const utils_d_get_custom_logger: typeof get_custom_logger;
declare namespace utils_d {
  export {
    utils_d_get_basic_logger as get_basic_logger,
    utils_d_get_custom_logger as get_custom_logger,
  };
}

export { Levels, Logger, formatter_d as formatters, handler_d as handlers, utils_d as utils };
