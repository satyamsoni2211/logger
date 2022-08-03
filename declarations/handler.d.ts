import { BaseHandler } from "./base_classes";
import { RecordInterfaceType } from "./base_types";
declare class ConsoleHandler extends BaseHandler {
    /**
     * Function to fetch console handler corresponding to
     * log level
     * @param {string} level - Log level to fetch console handler
     * @returns {Function}
     */
    private getConsoleMethod;
    /**
     * @override
     */
    emit(record: RecordInterfaceType): void;
}
declare class SumoHandler extends BaseHandler {
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
    constructor(props: {
        endpoint: string;
    });
    /**
     * Function to post data to sumo logic
     * @param {string} message - Message to be posted to sumo logic
     */
    postToSumo(message: string): void;
    /**
     * @override
     */
    emit(record: RecordInterfaceType): void;
}
export { ConsoleHandler, SumoHandler };
