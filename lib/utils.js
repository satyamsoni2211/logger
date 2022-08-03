"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_custom_logger = exports.get_basic_logger = void 0;
var formatter_1 = require("./formatter");
var handler_1 = require("./handler");
var logger_1 = require("./logger");
/**
 * Function to get basic logger instance
 * This returns a console logger with basic logging
 * @returns {Logger} Logger instance
 */
function get_basic_logger() {
    var l = new logger_1.Logger();
    var h = new handler_1.ConsoleHandler();
    var f = new formatter_1.BasicFormatter();
    h.setFormatter(f);
    l.addHandler(h);
    return l;
}
exports.get_basic_logger = get_basic_logger;
/**
 * Function to get custom logger instance
 * @param {CustomLoggerProps} props -  CustomLoggerProps object containing handlers, formatter and level
 * @param {Array<BaseHandler>} [props.handlers=[new ConsoleHandler()]] - List of handlers to add to logger
 * @param {BaseFormatter} [props.formatter=new BasicFormatter()] - Formatter to use for logging messages
 * @param {1|2|3|4|5} [props.level=1] - Log level to use for logging messages
 * @returns {Logger} Logger instance
 */
function get_custom_logger(props) {
    var _a = props.handlers, handlers = _a === void 0 ? [new handler_1.ConsoleHandler()] : _a, _b = props.level, level = _b === void 0 ? 1 : _b, _c = props.formatter, formatter = _c === void 0 ? new formatter_1.BasicFormatter() : _c;
    var l = new logger_1.Logger();
    handlers.forEach(function (h) {
        h.setLevel(level);
        h.setFormatter(formatter);
        l.addHandler(h);
    });
    return l;
}
exports.get_custom_logger = get_custom_logger;
//# sourceMappingURL=utils.js.map