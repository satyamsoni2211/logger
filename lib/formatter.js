"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONFormatter = exports.BasicFormatter = void 0;
var base_classes_1 = require("./base_classes");
var BasicFormatter = /** @class */ (function (_super) {
    __extends(BasicFormatter, _super);
    function BasicFormatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @override
     */
    BasicFormatter.prototype.formatRecord = function (record) {
        var m = "[".concat(record.level, "] ").concat(record.getIsoFormatTime(), " ").concat(record.getMessage());
        return m.replace(/\$\{(\S+)\}/g, function (all) {
            var token = all.slice(2, all.length - 1);
            return record.extra[token] || all;
        });
    };
    return BasicFormatter;
}(base_classes_1.BaseFormatter));
exports.BasicFormatter = BasicFormatter;
var JSONFormatter = /** @class */ (function (_super) {
    __extends(JSONFormatter, _super);
    function JSONFormatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Function to check if the message is an Error or not
     * @param {any} message - Message to check for Error instance
     * @returns {boolean} True if the message is an Error instance, false otherwise
     */
    JSONFormatter.prototype.isError = function (message) {
        if (message instanceof Error) {
            return true;
        }
        return false;
    };
    /**
     * Function to Get the stack from message if it is an Error instance
     * @param {RecordInterfaceType} record - Record Instance to get stack from
     * @returns {string|undefined} Stack from the error instance if exists, otherwise undefined
     */
    JSONFormatter.prototype.getStack = function (record) {
        var message = record.getMessage();
        if (this.isError(message)) {
            return message.stack;
        }
    };
    /**
     * Function to interpolateRecord if extra parameters are present
     * @param {string} record - record to interpolate
     * @param {object} extra - extra arguments to interpolate
     * @returns {string} interpolated message
     */
    JSONFormatter.prototype.interpolateRecord = function (record, extra) {
        return record.replace(/\$\{(\S+)\}/g, function (all) {
            var token = all.slice(2, all.length - 1);
            return extra[token] || all;
        });
    };
    /**
     * Function to format message from the record to log
     * @param record - Log record
     * @returns {string} formatted message
     */
    JSONFormatter.prototype.formatMessage = function (record) {
        var message = record.getMessage();
        var formattedMessage;
        if (message instanceof Error) {
            formattedMessage = "".concat(message.message);
        }
        else {
            formattedMessage = this.interpolateRecord(message, record.extra);
        }
        return formattedMessage;
    };
    /**
     * @override
     */
    JSONFormatter.prototype.formatRecord = function (record) {
        var _a;
        var fr = {
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
    };
    return JSONFormatter;
}(base_classes_1.BaseFormatter));
exports.JSONFormatter = JSONFormatter;
//# sourceMappingURL=formatter.js.map