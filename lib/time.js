"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.custom_formatted = exports.current_epoc_millis = exports.current_epoc = exports.current_iso_time = void 0;
var moment_1 = __importDefault(require("moment"));
/**
 * Function to get current time in ISO format
 * @returns {string}
 */
var current_iso_time = function () {
    return (0, moment_1.default)().toISOString();
};
exports.current_iso_time = current_iso_time;
/**
 * Function to get current time in unix timestamp
 * @returns {number}
 */
var current_epoc = function () {
    return (0, moment_1.default)().unix();
};
exports.current_epoc = current_epoc;
/**
 * Function to get current time in unix timestamp in milliseconds
 * @returns {number}
 */
var current_epoc_millis = function () {
    return (0, moment_1.default)().valueOf();
};
exports.current_epoc_millis = current_epoc_millis;
/**
 * Function to format the current time with user defined format
 * @param {string} format - Format of the datetime
 * @returns {string} formatted datetime
 */
var custom_formatted = function (format) {
    return (0, moment_1.default)().format(format);
};
exports.custom_formatted = custom_formatted;
//# sourceMappingURL=time.js.map