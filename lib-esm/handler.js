"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SumoHandler = exports.ConsoleHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const base_classes_1 = require("./base_classes");
class ConsoleHandler extends base_classes_1.BaseHandler {
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
exports.ConsoleHandler = ConsoleHandler;
class SumoHandler extends base_classes_1.BaseHandler {
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
        axios_1.default.post(this.endpoint, message, {
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
exports.SumoHandler = SumoHandler;
//# sourceMappingURL=handler.js.map