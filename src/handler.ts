import axios from "axios";
import { BaseHandler } from "./base_classes";
import { RecordInterfaceType } from "./base_types";


class ConsoleHandler extends BaseHandler {
    /**
     * Function to fetch console handler corresponding to 
     * log level
     * @param {string} level - Log level to fetch console handler
     * @returns {Function}
     */
    private getConsoleMethod(level: string): Function {
        let method: any;
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
    emit(record: RecordInterfaceType) {

        if (this.filter(record.levelNo)) {
            const message = this.formatter.format(record);
            const method = this.getConsoleMethod(record.level);
            method.call(this, message);
        }
    };
}

class StreamHandler extends BaseHandler {
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
    constructor(props: { endpoint: string; }) {
        super();
        this.endpoint = props.endpoint;
    }
    /**
     * Function to post data to sumo logic
     * @param {string} message - Message to be posted to sumo logic
     */
    postToSumo(message: string): void {
        axios.post(this.endpoint, message, {
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            console.log(response.data);
        })
    }
    /**
     * @override
     */
    emit(record: RecordInterfaceType): void {
        const message = this.formatter.format(record);
        this.postToSumo(message);
    }
}

export { ConsoleHandler, StreamHandler };