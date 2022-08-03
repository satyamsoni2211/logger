"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFormatter = exports.BaseHandler = void 0;
/**
 * Abstract base class for Handler
 * Can be used to create a new Handler instance
 */
var BaseHandler = /** @class */ (function () {
    /**
     * constructor for Handler class
     * by default it sets level to debug
     */
    function BaseHandler() {
        this.level = 1;
    }
    /**
     * Function to override the default formatter
     * this is required as by default no formatter is set
     * @param {FormatterInterfaceType} formatter - Formatter instance
     * @returns {void}
     */
    BaseHandler.prototype.setFormatter = function (formatter) {
        this.formatter = formatter;
    };
    /**
     * Function to override log level of
     * handler class
     * @param {number} level - Log level to override (1,5)
     */
    BaseHandler.prototype.setLevel = function (level) {
        this.level = level;
    };
    /**
     * Filter function to check if handler needs to process the record
     * or skip it based of its log level
     * @param {number} level - Log level to check for filtering
     * @returns {boolean}
     */
    BaseHandler.prototype.filter = function (level) {
        if (this.level <= level) {
            return true;
        }
        return false;
    };
    return BaseHandler;
}());
exports.BaseHandler = BaseHandler;
/**
 * Abstract base class for Formatter
 * Can be used to create a new Formatter instance
 */
var BaseFormatter = /** @class */ (function () {
    function BaseFormatter() {
    }
    BaseFormatter.prototype.format = function (value) {
        var m = this.formatRecord(value);
        return m;
    };
    return BaseFormatter;
}());
exports.BaseFormatter = BaseFormatter;
//# sourceMappingURL=base_classes.js.map