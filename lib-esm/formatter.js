"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONFormatter = exports.BasicFormatter = void 0;
const base_classes_1 = require("./base_classes");
class BasicFormatter extends base_classes_1.BaseFormatter {
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
exports.BasicFormatter = BasicFormatter;
class JSONFormatter extends base_classes_1.BaseFormatter {
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
exports.JSONFormatter = JSONFormatter;
//# sourceMappingURL=formatter.js.map