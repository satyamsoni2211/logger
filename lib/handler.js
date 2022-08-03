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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SumoHandler = exports.ConsoleHandler = void 0;
var axios_1 = __importDefault(require("axios"));
var base_classes_1 = require("./base_classes");
var ConsoleHandler = /** @class */ (function (_super) {
    __extends(ConsoleHandler, _super);
    function ConsoleHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Function to fetch console handler corresponding to
     * log level
     * @param {string} level - Log level to fetch console handler
     * @returns {Function}
     */
    ConsoleHandler.prototype.getConsoleMethod = function (level) {
        var method;
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
    };
    /**
     * @override
     */
    ConsoleHandler.prototype.emit = function (record) {
        if (this.filter(record.levelNo)) {
            var message = this.formatter.format(record);
            var method = this.getConsoleMethod(record.level);
            method.call(this, message);
        }
    };
    ;
    return ConsoleHandler;
}(base_classes_1.BaseHandler));
exports.ConsoleHandler = ConsoleHandler;
var SumoHandler = /** @class */ (function (_super) {
    __extends(SumoHandler, _super);
    /**
     * @constructor
     * @param {Object} props - Props for the constructor
     * @property {string} endpoint - Endpoint to post data to sumo logic
     */
    function SumoHandler(props) {
        var _this = _super.call(this) || this;
        _this.endpoint = props.endpoint;
        return _this;
    }
    /**
     * Function to post data to sumo logic
     * @param {string} message - Message to be posted to sumo logic
     */
    SumoHandler.prototype.postToSumo = function (message) {
        axios_1.default.post(this.endpoint, message, {
            headers: { 'Content-Type': 'application/json' },
        }).then(function (response) {
            console.log(response.data);
        });
    };
    /**
     * @override
     */
    SumoHandler.prototype.emit = function (record) {
        var message = this.formatter.format(record);
        this.postToSumo(message);
    };
    return SumoHandler;
}(base_classes_1.BaseHandler));
exports.SumoHandler = SumoHandler;
//# sourceMappingURL=handler.js.map