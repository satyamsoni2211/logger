import Moment from 'moment';
import axios from 'axios';

var Levels;
(function (Levels) {
    Levels[Levels["not_set"] = 0] = "not_set";
    Levels[Levels["debug"] = 1] = "debug";
    Levels[Levels["info"] = 2] = "info";
    Levels[Levels["warn"] = 3] = "warn";
    Levels[Levels["error"] = 4] = "error";
    Levels[Levels["critical"] = 5] = "critical";
})(Levels || (Levels = {}));
var LevelTags;
(function (LevelTags) {
    LevelTags["not_set"] = "NOT_SET";
    LevelTags["debug"] = "DEBUG";
    LevelTags["info"] = "INFO";
    LevelTags["warn"] = "WARN";
    LevelTags["error"] = "ERROR";
    LevelTags["critical"] = "CRITICAL";
})(LevelTags || (LevelTags = {}));

class LogRecord {
    constructor(event, levelNo, level = LevelTags.debug, time, extra = {}, context_key = "", args = []) {
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
        return Moment.unix(this.time).toISOString();
    }
    getFormattedTime(format = "YYYY-MM-DD HH:mm:ss ZZ") {
        return Moment.unix(this.time).format(format);
    }
}

/**
 * Function to get current time in unix timestamp
 * @returns {number}
 */
const current_epoc = () => {
    return Moment().unix();
};

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

/**
 * Abstract base class for Handler
 * Can be used to create a new Handler instance
 */
class BaseHandler {
    /**
     * constructor for Handler class
     * by default it sets level to debug
     */
    constructor() {
        this.level = 1;
    }
    /**
     * Function to override the default formatter
     * this is required as by default no formatter is set
     * @param {FormatterInterfaceType} formatter - Formatter instance
     * @returns {void}
     */
    setFormatter(formatter) {
        this.formatter = formatter;
    }
    /**
     * Function to override log level of
     * handler class
     * @param {number} level - Log level to override (1,5)
     */
    setLevel(level) {
        this.level = level;
    }
    /**
     * Filter function to check if handler needs to process the record
     * or skip it based of its log level
     * @param {number} level - Log level to check for filtering
     * @returns {boolean}
     */
    filter(level) {
        if (this.level <= level) {
            return true;
        }
        return false;
    }
}
/**
 * Abstract base class for Formatter
 * Can be used to create a new Formatter instance
 */
class BaseFormatter {
    format(value) {
        const m = this.formatRecord(value);
        return m;
    }
}

class ConsoleHandler extends BaseHandler {
    /**
     * Function to fetch console handler corresponding to
     * log level
     * @param {string} level - Log level to fetch console handler
     * @returns {Function}
     */
    getConsoleMethod(level) {
        let method;
        switch (level.toLowerCase()) {
            case "debug":
                method = console.debug;
                break;
            case "info":
                method = console.info;
                break;
            case "warn":
                method = console.warn;
                break;
            case "critical":
                method = console.error;
                break;
            case "error":
                method = console.error;
                break;
            default:
                method = console.log;
        }
        return method;
    }
    /**
     * @override
     */
    emit(record) {
        if (this.filter(record.levelNo)) {
            const message = this.formatter.format(record);
            const method = this.getConsoleMethod(record.level);
            method.call(this, message);
        }
    }
    ;
}
class StreamHandler extends BaseHandler {
    /**
     * @constructor
     * @param {Object} props - Props for the constructor
     * @property {string} endpoint - Endpoint to post data to sumo logic
     */
    constructor(props) {
        super();
        this.endpoint = props.endpoint;
    }
    /**
     * Function to post data to sumo logic
     * @param {string} message - Message to be posted to sumo logic
     */
    postToSumo(message) {
        axios.post(this.endpoint, message, {
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            console.log(response.data);
        });
    }
    /**
     * @override
     */
    emit(record) {
        const message = this.formatter.format(record);
        this.postToSumo(message);
    }
}

var handler = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ConsoleHandler: ConsoleHandler,
    StreamHandler: StreamHandler
});

class BasicFormatter extends BaseFormatter {
    /**
     * @override
     */
    formatRecord(record) {
        const m = `[${record.level}] ${record.getIsoFormatTime()} ${record.getMessage()}`;
        return m.replace(/\$\{(\S+)\}/g, function (all) {
            let token = all.slice(2, all.length - 1);
            return record.extra[token] || all;
        });
    }
}
class JSONFormatter extends BaseFormatter {
    /**
     * Function to check if the message is an Error or not
     * @param {any} message - Message to check for Error instance
     * @returns {boolean} True if the message is an Error instance, false otherwise
     */
    isError(message) {
        if (message instanceof Error) {
            return true;
        }
        return false;
    }
    /**
     * Function to Get the stack from message if it is an Error instance
     * @param {RecordInterfaceType} record - Record Instance to get stack from
     * @returns {string|undefined} Stack from the error instance if exists, otherwise undefined
     */
    getStack(record) {
        const message = record.getMessage();
        if (this.isError(message)) {
            return message.stack;
        }
    }
    /**
     * Function to interpolateRecord if extra parameters are present
     * @param {string} record - record to interpolate
     * @param {object} extra - extra arguments to interpolate
     * @returns {string} interpolated message
     */
    interpolateRecord(record, extra) {
        return record.replace(/\$\{(\S+)\}/g, function (all) {
            let token = all.slice(2, all.length - 1);
            return extra[token] || all;
        });
    }
    /**
     * Function to format message from the record to log
     * @param record - Log record
     * @returns {string} formatted message
     */
    formatMessage(record) {
        const message = record.getMessage();
        let formattedMessage;
        if (message instanceof Error) {
            formattedMessage = `${message.message}`;
        }
        else {
            formattedMessage = this.interpolateRecord(message, record.extra);
        }
        return formattedMessage;
    }
    /**
     * @override
     */
    formatRecord(record) {
        var _a;
        const fr = {
            message: this.formatMessage(record),
            timestamp: record.getIsoFormatTime(),
            level: record.level,
            context: record.extra,
            user: (_a = record.extra) === null || _a === void 0 ? void 0 : _a.user
        };
        if (this.isError(record.getMessage())) {
            fr.stack_info = this.getStack(record);
        }
        return JSON.stringify(fr);
    }
}

var formatter = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BasicFormatter: BasicFormatter,
    JSONFormatter: JSONFormatter
});

/**
 * Function to get basic logger instance
 * This returns a console logger with basic logging
 * @returns {Logger} Logger instance
 */
function get_basic_logger() {
    const l = new Logger();
    const h = new ConsoleHandler();
    const f = new BasicFormatter();
    h.setFormatter(f);
    l.addHandler(h);
    return l;
}
/**
 * Function to get custom logger instance
 * @param {CustomLoggerProps} props -  CustomLoggerProps object containing handlers, formatter and level
 * @param {Array<BaseHandler>} [props.handlers=[new ConsoleHandler()]] - List of handlers to add to logger
 * @param {BaseFormatter} [props.formatter=new BasicFormatter()] - Formatter to use for logging messages
 * @param {1|2|3|4|5} [props.level=1] - Log level to use for logging messages
 * @returns {Logger} Logger instance
 */
function get_custom_logger(props) {
    const { handlers = [new ConsoleHandler()], level = 1, formatter = new BasicFormatter() } = props;
    const l = new Logger();
    handlers.forEach(h => {
        h.setLevel(level);
        h.setFormatter(formatter);
        l.addHandler(h);
    });
    return l;
}

var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get_basic_logger: get_basic_logger,
    get_custom_logger: get_custom_logger
});

export { Levels, Logger, formatter as formatters, handler as handlers, utils };
//# sourceMappingURL=index.mjs.map
