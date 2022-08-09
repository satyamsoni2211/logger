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

/**
 * Abstract base class for Handler
 * Can be used to create a new Handler instance
 */
class BaseHandler {
    formatter;
    /**
     * Level number corresponding to the log levle
     * of handler. By default this is 1 (debug)
     * This can be overridden by setLevel() method
     * @type {number}
     */
    level;
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
     * Endpoint to post data to sumo logic
     * @type {string}
     */
    endpoint;
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
        const fr = {
            message: this.formatMessage(record),
            timestamp: record.getIsoFormatTime(),
            level: record.level,
            context: record.extra,
            user: record.extra?.user
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubWpzIiwic291cmNlcyI6WyJsaWIvZW51bXMuanMiLCJsaWIvcmVjb3JkLmpzIiwibGliL3RpbWUuanMiLCJsaWIvbG9nZ2VyLmpzIiwibGliL2Jhc2VfY2xhc3Nlcy5qcyIsImxpYi9oYW5kbGVyLmpzIiwibGliL2Zvcm1hdHRlci5qcyIsImxpYi91dGlscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTGV2ZWxzO1xuKGZ1bmN0aW9uIChMZXZlbHMpIHtcbiAgICBMZXZlbHNbTGV2ZWxzW1wibm90X3NldFwiXSA9IDBdID0gXCJub3Rfc2V0XCI7XG4gICAgTGV2ZWxzW0xldmVsc1tcImRlYnVnXCJdID0gMV0gPSBcImRlYnVnXCI7XG4gICAgTGV2ZWxzW0xldmVsc1tcImluZm9cIl0gPSAyXSA9IFwiaW5mb1wiO1xuICAgIExldmVsc1tMZXZlbHNbXCJ3YXJuXCJdID0gM10gPSBcIndhcm5cIjtcbiAgICBMZXZlbHNbTGV2ZWxzW1wiZXJyb3JcIl0gPSA0XSA9IFwiZXJyb3JcIjtcbiAgICBMZXZlbHNbTGV2ZWxzW1wiY3JpdGljYWxcIl0gPSA1XSA9IFwiY3JpdGljYWxcIjtcbn0pKExldmVscyB8fCAoTGV2ZWxzID0ge30pKTtcbnZhciBMZXZlbFRhZ3M7XG4oZnVuY3Rpb24gKExldmVsVGFncykge1xuICAgIExldmVsVGFnc1tcIm5vdF9zZXRcIl0gPSBcIk5PVF9TRVRcIjtcbiAgICBMZXZlbFRhZ3NbXCJkZWJ1Z1wiXSA9IFwiREVCVUdcIjtcbiAgICBMZXZlbFRhZ3NbXCJpbmZvXCJdID0gXCJJTkZPXCI7XG4gICAgTGV2ZWxUYWdzW1wid2FyblwiXSA9IFwiV0FSTlwiO1xuICAgIExldmVsVGFnc1tcImVycm9yXCJdID0gXCJFUlJPUlwiO1xuICAgIExldmVsVGFnc1tcImNyaXRpY2FsXCJdID0gXCJDUklUSUNBTFwiO1xufSkoTGV2ZWxUYWdzIHx8IChMZXZlbFRhZ3MgPSB7fSkpO1xuZXhwb3J0IHsgTGV2ZWxzLCBMZXZlbFRhZ3MgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVudW1zLmpzLm1hcCIsImltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IExldmVsVGFncyB9IGZyb20gJy4vZW51bXMnO1xuZXhwb3J0IGNsYXNzIExvZ1JlY29yZCB7XG4gICAgZXZlbnQ7XG4gICAgbGV2ZWw7XG4gICAgbGV2ZWxObztcbiAgICBleHRyYTtcbiAgICBjb250ZXh0X2tleTtcbiAgICBhcmdzID0gW107XG4gICAgdGltZTtcbiAgICBjb25zdHJ1Y3RvcihldmVudCwgbGV2ZWxObywgbGV2ZWwgPSBMZXZlbFRhZ3MuZGVidWcsIHRpbWUsIGV4dHJhID0ge30sIGNvbnRleHRfa2V5ID0gXCJcIiwgYXJncyA9IFtdKSB7XG4gICAgICAgIHRoaXMuZXZlbnQgPSBldmVudDtcbiAgICAgICAgdGhpcy5sZXZlbCA9IGxldmVsO1xuICAgICAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgICAgICB0aGlzLmV4dHJhID0gZXh0cmE7XG4gICAgICAgIHRoaXMuY29udGV4dF9rZXkgPSBjb250ZXh0X2tleTtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICAgICAgdGhpcy5sZXZlbE5vID0gbGV2ZWxObztcbiAgICAgICAgdGhpcy5nZXRNZXNzYWdlID0gdGhpcy5nZXRNZXNzYWdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzID0gdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5nZXRJc29Gb3JtYXRUaW1lID0gdGhpcy5nZXRJc29Gb3JtYXRUaW1lLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZ2V0Rm9ybWF0dGVkVGltZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkVGltZS5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBnZXRNZXNzYWdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudDtcbiAgICB9XG4gICAgZ2V0VGltZUluTWlsbGlzZWNvbmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50aW1lO1xuICAgIH1cbiAgICBnZXRJc29Gb3JtYXRUaW1lKCkge1xuICAgICAgICByZXR1cm4gbW9tZW50LnVuaXgodGhpcy50aW1lKS50b0lTT1N0cmluZygpO1xuICAgIH1cbiAgICBnZXRGb3JtYXR0ZWRUaW1lKGZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzcyBaWlwiKSB7XG4gICAgICAgIHJldHVybiBtb21lbnQudW5peCh0aGlzLnRpbWUpLmZvcm1hdChmb3JtYXQpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlY29yZC5qcy5tYXAiLCJpbXBvcnQgTW9tZW50IGZyb20gJ21vbWVudCc7XG4vKipcbiAqIEZ1bmN0aW9uIHRvIGdldCBjdXJyZW50IHRpbWUgaW4gSVNPIGZvcm1hdFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IGN1cnJlbnRfaXNvX3RpbWUgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE1vbWVudCgpLnRvSVNPU3RyaW5nKCk7XG59O1xuLyoqXG4gKiBGdW5jdGlvbiB0byBnZXQgY3VycmVudCB0aW1lIGluIHVuaXggdGltZXN0YW1wXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnQgY29uc3QgY3VycmVudF9lcG9jID0gKCkgPT4ge1xuICAgIHJldHVybiBNb21lbnQoKS51bml4KCk7XG59O1xuLyoqXG4gKiBGdW5jdGlvbiB0byBnZXQgY3VycmVudCB0aW1lIGluIHVuaXggdGltZXN0YW1wIGluIG1pbGxpc2Vjb25kc1xuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IGN1cnJlbnRfZXBvY19taWxsaXMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE1vbWVudCgpLnZhbHVlT2YoKTtcbn07XG4vKipcbiAqIEZ1bmN0aW9uIHRvIGZvcm1hdCB0aGUgY3VycmVudCB0aW1lIHdpdGggdXNlciBkZWZpbmVkIGZvcm1hdFxuICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdCAtIEZvcm1hdCBvZiB0aGUgZGF0ZXRpbWVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGZvcm1hdHRlZCBkYXRldGltZVxuICovXG5leHBvcnQgY29uc3QgY3VzdG9tX2Zvcm1hdHRlZCA9IChmb3JtYXQpID0+IHtcbiAgICByZXR1cm4gTW9tZW50KCkuZm9ybWF0KGZvcm1hdCk7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGltZS5qcy5tYXAiLCJpbXBvcnQgeyBMZXZlbHMsIExldmVsVGFncyB9IGZyb20gXCIuL2VudW1zXCI7XG5pbXBvcnQgeyBMb2dSZWNvcmQgfSBmcm9tIFwiLi9yZWNvcmRcIjtcbmltcG9ydCB7IGN1cnJlbnRfZXBvYyB9IGZyb20gXCIuL3RpbWVcIjtcbmNsYXNzIExvZ2dlciB7XG4gICAgaGFuZGxlcnMgPSBbXTtcbiAgICAvKipcbiAgICAgKiBwcm9wZXJ0eSBsZXZlbCBmb3IgaGFuZGxlclxuICAgICAqIEB0eXBlIG51bWJlclxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICBsZXZlbCA9IDA7XG4gICAgYWRkSGFuZGxlcihoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICB9XG4gICAgO1xuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRvIHNldCBsb2cgbGV2ZWxcbiAgICAgKiBAcGFyYW0ge0xldmVsc30gbGV2ZWw6IGxvZyBsZXZlbCB0byBzZXRcbiAgICAgKi9cbiAgICBzZXRMZXZlbChsZXZlbCkge1xuICAgICAgICB0aGlzLmxldmVsID0gbGV2ZWw7XG4gICAgfVxuICAgIDtcbiAgICBjcmVhdGVSZWNvcmQoZXZlbnQsIGxldmVsTm8sIHRhZywgdGltZSwgcHJvcHMgPSB7fSkge1xuICAgICAgICBjb25zdCByZWNvcmQgPSBuZXcgTG9nUmVjb3JkKGV2ZW50LCBsZXZlbE5vLCB0YWcsIHRpbWUsIHByb3BzKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZDtcbiAgICB9XG4gICAgaGFuZGxlKHJlY29yZCkge1xuICAgICAgICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgdGhpcy5oYW5kbGVycykge1xuICAgICAgICAgICAgaGFuZGxlci5lbWl0KHJlY29yZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgO1xuICAgIGZpbHRlcl9yZWNvcmQoY3VycmVudF9sZXZlbCwgbG9nX2xldmVsKSB7XG4gICAgICAgIHJldHVybiAoY3VycmVudF9sZXZlbCA+IExldmVscy5ub3Rfc2V0ICYmIGN1cnJlbnRfbGV2ZWwgPD0gbG9nX2xldmVsKSB8fCAoY3VycmVudF9sZXZlbCA9PT0gTGV2ZWxzLm5vdF9zZXQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0byBsb2cgbWVzc2FnZSBhcyBpbmZvXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2U6IG1lc3NhZ2UgdG8gYmUgbG9nZ2VkXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHByb3BzOiBleHRyYSBwYXJhbWV0ZXJzIHRvIHN1cHBvcnQgaW50ZXJwb2xhdGlvblxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgaW5mbyhtZXNzYWdlLCBwcm9wcyA9IHt9KSB7XG4gICAgICAgIGlmICh0aGlzLmZpbHRlcl9yZWNvcmQodGhpcy5sZXZlbCwgTGV2ZWxzLmluZm8pKSB7XG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmNyZWF0ZVJlY29yZChtZXNzYWdlLCBMZXZlbHMuaW5mbywgTGV2ZWxUYWdzLmluZm8sIGN1cnJlbnRfZXBvYygpLCBwcm9wcyk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZShyZWNvcmQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIDtcbiAgICBkZWJ1ZyhtZXNzYWdlLCBwcm9wcyA9IHt9KSB7XG4gICAgICAgIGlmICh0aGlzLmZpbHRlcl9yZWNvcmQodGhpcy5sZXZlbCwgTGV2ZWxzLmRlYnVnKSkge1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVSZWNvcmQobWVzc2FnZSwgTGV2ZWxzLmRlYnVnLCBMZXZlbFRhZ3MuZGVidWcsIGN1cnJlbnRfZXBvYygpLCBwcm9wcyk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZShyZWNvcmQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHdhcm4obWVzc2FnZSwgcHJvcHMgPSB7fSkge1xuICAgICAgICBpZiAodGhpcy5maWx0ZXJfcmVjb3JkKHRoaXMubGV2ZWwsIExldmVscy53YXJuKSkge1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVSZWNvcmQobWVzc2FnZSwgTGV2ZWxzLndhcm4sIExldmVsVGFncy53YXJuLCBjdXJyZW50X2Vwb2MoKSwgcHJvcHMpO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlcnJvcihtZXNzYWdlLCBwcm9wcyA9IHt9KSB7XG4gICAgICAgIGlmICh0aGlzLmZpbHRlcl9yZWNvcmQodGhpcy5sZXZlbCwgTGV2ZWxzLmVycm9yKSkge1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVSZWNvcmQobWVzc2FnZSwgTGV2ZWxzLmVycm9yLCBMZXZlbFRhZ3MuZXJyb3IsIGN1cnJlbnRfZXBvYygpLCBwcm9wcyk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZShyZWNvcmQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNyaXRpY2FsKG1lc3NhZ2UsIHByb3BzID0ge30pIHtcbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyX3JlY29yZCh0aGlzLmxldmVsLCBMZXZlbHMuY3JpdGljYWwpKSB7XG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmNyZWF0ZVJlY29yZChtZXNzYWdlLCBMZXZlbHMuY3JpdGljYWwsIExldmVsVGFncy5jcml0aWNhbCwgY3VycmVudF9lcG9jKCksIHByb3BzKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgeyBMb2dnZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxvZ2dlci5qcy5tYXAiLCIvKipcbiAqIEFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIEhhbmRsZXJcbiAqIENhbiBiZSB1c2VkIHRvIGNyZWF0ZSBhIG5ldyBIYW5kbGVyIGluc3RhbmNlXG4gKi9cbmNsYXNzIEJhc2VIYW5kbGVyIHtcbiAgICBmb3JtYXR0ZXI7XG4gICAgLyoqXG4gICAgICogTGV2ZWwgbnVtYmVyIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGxvZyBsZXZsZVxuICAgICAqIG9mIGhhbmRsZXIuIEJ5IGRlZmF1bHQgdGhpcyBpcyAxIChkZWJ1ZylcbiAgICAgKiBUaGlzIGNhbiBiZSBvdmVycmlkZGVuIGJ5IHNldExldmVsKCkgbWV0aG9kXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBsZXZlbDtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvciBmb3IgSGFuZGxlciBjbGFzc1xuICAgICAqIGJ5IGRlZmF1bHQgaXQgc2V0cyBsZXZlbCB0byBkZWJ1Z1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxldmVsID0gMTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgZm9ybWF0dGVyXG4gICAgICogdGhpcyBpcyByZXF1aXJlZCBhcyBieSBkZWZhdWx0IG5vIGZvcm1hdHRlciBpcyBzZXRcbiAgICAgKiBAcGFyYW0ge0Zvcm1hdHRlckludGVyZmFjZVR5cGV9IGZvcm1hdHRlciAtIEZvcm1hdHRlciBpbnN0YW5jZVxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIHNldEZvcm1hdHRlcihmb3JtYXR0ZXIpIHtcbiAgICAgICAgdGhpcy5mb3JtYXR0ZXIgPSBmb3JtYXR0ZXI7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRvIG92ZXJyaWRlIGxvZyBsZXZlbCBvZlxuICAgICAqIGhhbmRsZXIgY2xhc3NcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGV2ZWwgLSBMb2cgbGV2ZWwgdG8gb3ZlcnJpZGUgKDEsNSlcbiAgICAgKi9cbiAgICBzZXRMZXZlbChsZXZlbCkge1xuICAgICAgICB0aGlzLmxldmVsID0gbGV2ZWw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpbHRlciBmdW5jdGlvbiB0byBjaGVjayBpZiBoYW5kbGVyIG5lZWRzIHRvIHByb2Nlc3MgdGhlIHJlY29yZFxuICAgICAqIG9yIHNraXAgaXQgYmFzZWQgb2YgaXRzIGxvZyBsZXZlbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZXZlbCAtIExvZyBsZXZlbCB0byBjaGVjayBmb3IgZmlsdGVyaW5nXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgZmlsdGVyKGxldmVsKSB7XG4gICAgICAgIGlmICh0aGlzLmxldmVsIDw9IGxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuLyoqXG4gKiBBYnN0cmFjdCBiYXNlIGNsYXNzIGZvciBGb3JtYXR0ZXJcbiAqIENhbiBiZSB1c2VkIHRvIGNyZWF0ZSBhIG5ldyBGb3JtYXR0ZXIgaW5zdGFuY2VcbiAqL1xuY2xhc3MgQmFzZUZvcm1hdHRlciB7XG4gICAgZm9ybWF0KHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG0gPSB0aGlzLmZvcm1hdFJlY29yZCh2YWx1ZSk7XG4gICAgICAgIHJldHVybiBtO1xuICAgIH1cbn1cbmV4cG9ydCB7IEJhc2VIYW5kbGVyLCBCYXNlRm9ybWF0dGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1iYXNlX2NsYXNzZXMuanMubWFwIiwiaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IHsgQmFzZUhhbmRsZXIgfSBmcm9tIFwiLi9iYXNlX2NsYXNzZXNcIjtcbmNsYXNzIENvbnNvbGVIYW5kbGVyIGV4dGVuZHMgQmFzZUhhbmRsZXIge1xuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRvIGZldGNoIGNvbnNvbGUgaGFuZGxlciBjb3JyZXNwb25kaW5nIHRvXG4gICAgICogbG9nIGxldmVsXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxldmVsIC0gTG9nIGxldmVsIHRvIGZldGNoIGNvbnNvbGUgaGFuZGxlclxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBnZXRDb25zb2xlTWV0aG9kKGxldmVsKSB7XG4gICAgICAgIGxldCBtZXRob2Q7XG4gICAgICAgIHN3aXRjaCAobGV2ZWwudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgY2FzZSBcImRlYnVnXCI6XG4gICAgICAgICAgICAgICAgbWV0aG9kID0gY29uc29sZS5kZWJ1ZztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJpbmZvXCI6XG4gICAgICAgICAgICAgICAgbWV0aG9kID0gY29uc29sZS5pbmZvO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIndhcm5cIjpcbiAgICAgICAgICAgICAgICBtZXRob2QgPSBjb25zb2xlLndhcm47XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiY3JpdGljYWxcIjpcbiAgICAgICAgICAgICAgICBtZXRob2QgPSBjb25zb2xlLmVycm9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImVycm9yXCI6XG4gICAgICAgICAgICAgICAgbWV0aG9kID0gY29uc29sZS5lcnJvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgbWV0aG9kID0gY29uc29sZS5sb2c7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1ldGhvZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQG92ZXJyaWRlXG4gICAgICovXG4gICAgZW1pdChyZWNvcmQpIHtcbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyKHJlY29yZC5sZXZlbE5vKSkge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuZm9ybWF0dGVyLmZvcm1hdChyZWNvcmQpO1xuICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gdGhpcy5nZXRDb25zb2xlTWV0aG9kKHJlY29yZC5sZXZlbCk7XG4gICAgICAgICAgICBtZXRob2QuY2FsbCh0aGlzLCBtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICA7XG59XG5jbGFzcyBTdHJlYW1IYW5kbGVyIGV4dGVuZHMgQmFzZUhhbmRsZXIge1xuICAgIC8qKlxuICAgICAqIEVuZHBvaW50IHRvIHBvc3QgZGF0YSB0byBzdW1vIGxvZ2ljXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICBlbmRwb2ludDtcbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgLSBQcm9wcyBmb3IgdGhlIGNvbnN0cnVjdG9yXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGVuZHBvaW50IC0gRW5kcG9pbnQgdG8gcG9zdCBkYXRhIHRvIHN1bW8gbG9naWNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVuZHBvaW50ID0gcHJvcHMuZW5kcG9pbnQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRvIHBvc3QgZGF0YSB0byBzdW1vIGxvZ2ljXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBNZXNzYWdlIHRvIGJlIHBvc3RlZCB0byBzdW1vIGxvZ2ljXG4gICAgICovXG4gICAgcG9zdFRvU3VtbyhtZXNzYWdlKSB7XG4gICAgICAgIGF4aW9zLnBvc3QodGhpcy5lbmRwb2ludCwgbWVzc2FnZSwge1xuICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAb3ZlcnJpZGVcbiAgICAgKi9cbiAgICBlbWl0KHJlY29yZCkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5mb3JtYXR0ZXIuZm9ybWF0KHJlY29yZCk7XG4gICAgICAgIHRoaXMucG9zdFRvU3VtbyhtZXNzYWdlKTtcbiAgICB9XG59XG5leHBvcnQgeyBDb25zb2xlSGFuZGxlciwgU3RyZWFtSGFuZGxlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFuZGxlci5qcy5tYXAiLCJpbXBvcnQgeyBCYXNlRm9ybWF0dGVyIH0gZnJvbSBcIi4vYmFzZV9jbGFzc2VzXCI7XG5jbGFzcyBCYXNpY0Zvcm1hdHRlciBleHRlbmRzIEJhc2VGb3JtYXR0ZXIge1xuICAgIC8qKlxuICAgICAqIEBvdmVycmlkZVxuICAgICAqL1xuICAgIGZvcm1hdFJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgY29uc3QgbSA9IGBbJHtyZWNvcmQubGV2ZWx9XSAke3JlY29yZC5nZXRJc29Gb3JtYXRUaW1lKCl9ICR7cmVjb3JkLmdldE1lc3NhZ2UoKX1gO1xuICAgICAgICByZXR1cm4gbS5yZXBsYWNlKC9cXCRcXHsoXFxTKylcXH0vZywgZnVuY3Rpb24gKGFsbCkge1xuICAgICAgICAgICAgbGV0IHRva2VuID0gYWxsLnNsaWNlKDIsIGFsbC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIHJldHVybiByZWNvcmQuZXh0cmFbdG9rZW5dIHx8IGFsbDtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuY2xhc3MgSlNPTkZvcm1hdHRlciBleHRlbmRzIEJhc2VGb3JtYXR0ZXIge1xuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRvIGNoZWNrIGlmIHRoZSBtZXNzYWdlIGlzIGFuIEVycm9yIG9yIG5vdFxuICAgICAqIEBwYXJhbSB7YW55fSBtZXNzYWdlIC0gTWVzc2FnZSB0byBjaGVjayBmb3IgRXJyb3IgaW5zdGFuY2VcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgbWVzc2FnZSBpcyBhbiBFcnJvciBpbnN0YW5jZSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgaXNFcnJvcihtZXNzYWdlKSB7XG4gICAgICAgIGlmIChtZXNzYWdlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdG8gR2V0IHRoZSBzdGFjayBmcm9tIG1lc3NhZ2UgaWYgaXQgaXMgYW4gRXJyb3IgaW5zdGFuY2VcbiAgICAgKiBAcGFyYW0ge1JlY29yZEludGVyZmFjZVR5cGV9IHJlY29yZCAtIFJlY29yZCBJbnN0YW5jZSB0byBnZXQgc3RhY2sgZnJvbVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd8dW5kZWZpbmVkfSBTdGFjayBmcm9tIHRoZSBlcnJvciBpbnN0YW5jZSBpZiBleGlzdHMsIG90aGVyd2lzZSB1bmRlZmluZWRcbiAgICAgKi9cbiAgICBnZXRTdGFjayhyZWNvcmQpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHJlY29yZC5nZXRNZXNzYWdlKCk7XG4gICAgICAgIGlmICh0aGlzLmlzRXJyb3IobWVzc2FnZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXNzYWdlLnN0YWNrO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRvIGludGVycG9sYXRlUmVjb3JkIGlmIGV4dHJhIHBhcmFtZXRlcnMgYXJlIHByZXNlbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVjb3JkIC0gcmVjb3JkIHRvIGludGVycG9sYXRlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV4dHJhIC0gZXh0cmEgYXJndW1lbnRzIHRvIGludGVycG9sYXRlXG4gICAgICogQHJldHVybnMge3N0cmluZ30gaW50ZXJwb2xhdGVkIG1lc3NhZ2VcbiAgICAgKi9cbiAgICBpbnRlcnBvbGF0ZVJlY29yZChyZWNvcmQsIGV4dHJhKSB7XG4gICAgICAgIHJldHVybiByZWNvcmQucmVwbGFjZSgvXFwkXFx7KFxcUyspXFx9L2csIGZ1bmN0aW9uIChhbGwpIHtcbiAgICAgICAgICAgIGxldCB0b2tlbiA9IGFsbC5zbGljZSgyLCBhbGwubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICByZXR1cm4gZXh0cmFbdG9rZW5dIHx8IGFsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRvIGZvcm1hdCBtZXNzYWdlIGZyb20gdGhlIHJlY29yZCB0byBsb2dcbiAgICAgKiBAcGFyYW0gcmVjb3JkIC0gTG9nIHJlY29yZFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGZvcm1hdHRlZCBtZXNzYWdlXG4gICAgICovXG4gICAgZm9ybWF0TWVzc2FnZShyZWNvcmQpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHJlY29yZC5nZXRNZXNzYWdlKCk7XG4gICAgICAgIGxldCBmb3JtYXR0ZWRNZXNzYWdlO1xuICAgICAgICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRNZXNzYWdlID0gYCR7bWVzc2FnZS5tZXNzYWdlfWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRNZXNzYWdlID0gdGhpcy5pbnRlcnBvbGF0ZVJlY29yZChtZXNzYWdlLCByZWNvcmQuZXh0cmEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmb3JtYXR0ZWRNZXNzYWdlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAb3ZlcnJpZGVcbiAgICAgKi9cbiAgICBmb3JtYXRSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIGNvbnN0IGZyID0ge1xuICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5mb3JtYXRNZXNzYWdlKHJlY29yZCksXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHJlY29yZC5nZXRJc29Gb3JtYXRUaW1lKCksXG4gICAgICAgICAgICBsZXZlbDogcmVjb3JkLmxldmVsLFxuICAgICAgICAgICAgY29udGV4dDogcmVjb3JkLmV4dHJhLFxuICAgICAgICAgICAgdXNlcjogcmVjb3JkLmV4dHJhPy51c2VyXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLmlzRXJyb3IocmVjb3JkLmdldE1lc3NhZ2UoKSkpIHtcbiAgICAgICAgICAgIGZyLnN0YWNrX2luZm8gPSB0aGlzLmdldFN0YWNrKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGZyKTtcbiAgICB9XG59XG5leHBvcnQgeyBCYXNpY0Zvcm1hdHRlciwgSlNPTkZvcm1hdHRlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zm9ybWF0dGVyLmpzLm1hcCIsImltcG9ydCB7IEJhc2ljRm9ybWF0dGVyIH0gZnJvbSAnLi9mb3JtYXR0ZXInO1xuaW1wb3J0IHsgQ29uc29sZUhhbmRsZXIgfSBmcm9tICcuL2hhbmRsZXInO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9sb2dnZXInO1xuLyoqXG4gKiBGdW5jdGlvbiB0byBnZXQgYmFzaWMgbG9nZ2VyIGluc3RhbmNlXG4gKiBUaGlzIHJldHVybnMgYSBjb25zb2xlIGxvZ2dlciB3aXRoIGJhc2ljIGxvZ2dpbmdcbiAqIEByZXR1cm5zIHtMb2dnZXJ9IExvZ2dlciBpbnN0YW5jZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0X2Jhc2ljX2xvZ2dlcigpIHtcbiAgICBjb25zdCBsID0gbmV3IExvZ2dlcigpO1xuICAgIGNvbnN0IGggPSBuZXcgQ29uc29sZUhhbmRsZXIoKTtcbiAgICBjb25zdCBmID0gbmV3IEJhc2ljRm9ybWF0dGVyKCk7XG4gICAgaC5zZXRGb3JtYXR0ZXIoZik7XG4gICAgbC5hZGRIYW5kbGVyKGgpO1xuICAgIHJldHVybiBsO1xufVxuLyoqXG4gKiBGdW5jdGlvbiB0byBnZXQgY3VzdG9tIGxvZ2dlciBpbnN0YW5jZVxuICogQHBhcmFtIHtDdXN0b21Mb2dnZXJQcm9wc30gcHJvcHMgLSAgQ3VzdG9tTG9nZ2VyUHJvcHMgb2JqZWN0IGNvbnRhaW5pbmcgaGFuZGxlcnMsIGZvcm1hdHRlciBhbmQgbGV2ZWxcbiAqIEBwYXJhbSB7QXJyYXk8QmFzZUhhbmRsZXI+fSBbcHJvcHMuaGFuZGxlcnM9W25ldyBDb25zb2xlSGFuZGxlcigpXV0gLSBMaXN0IG9mIGhhbmRsZXJzIHRvIGFkZCB0byBsb2dnZXJcbiAqIEBwYXJhbSB7QmFzZUZvcm1hdHRlcn0gW3Byb3BzLmZvcm1hdHRlcj1uZXcgQmFzaWNGb3JtYXR0ZXIoKV0gLSBGb3JtYXR0ZXIgdG8gdXNlIGZvciBsb2dnaW5nIG1lc3NhZ2VzXG4gKiBAcGFyYW0gezF8MnwzfDR8NX0gW3Byb3BzLmxldmVsPTFdIC0gTG9nIGxldmVsIHRvIHVzZSBmb3IgbG9nZ2luZyBtZXNzYWdlc1xuICogQHJldHVybnMge0xvZ2dlcn0gTG9nZ2VyIGluc3RhbmNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRfY3VzdG9tX2xvZ2dlcihwcm9wcykge1xuICAgIGNvbnN0IHsgaGFuZGxlcnMgPSBbbmV3IENvbnNvbGVIYW5kbGVyKCldLCBsZXZlbCA9IDEsIGZvcm1hdHRlciA9IG5ldyBCYXNpY0Zvcm1hdHRlcigpIH0gPSBwcm9wcztcbiAgICBjb25zdCBsID0gbmV3IExvZ2dlcigpO1xuICAgIGhhbmRsZXJzLmZvckVhY2goaCA9PiB7XG4gICAgICAgIGguc2V0TGV2ZWwobGV2ZWwpO1xuICAgICAgICBoLnNldEZvcm1hdHRlcihmb3JtYXR0ZXIpO1xuICAgICAgICBsLmFkZEhhbmRsZXIoaCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGw7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlscy5q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RUFBRSxFQUFFO0FBQy9CLFFBQVEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzFELFlBQVksTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVHLFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoQyxTQUFTO0FBQ1QsS0FBSztBQUNMLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFO0FBQzlCLFFBQVEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3pELFlBQVksTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFHLFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoQyxTQUFTO0FBQ1QsS0FBSztBQUNMLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFO0FBQy9CLFFBQVEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzFELFlBQVksTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVHLFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFN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
