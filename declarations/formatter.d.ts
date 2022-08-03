import { BaseFormatter } from "./base_classes";
import { RecordInterfaceType } from "./base_types";
declare class BasicFormatter extends BaseFormatter {
    /**
     * @override
     */
    formatRecord(record: RecordInterfaceType): string;
}
declare class JSONFormatter extends BaseFormatter {
    /**
     * Function to check if the message is an Error or not
     * @param {any} message - Message to check for Error instance
     * @returns {boolean} True if the message is an Error instance, false otherwise
     */
    isError(message: any): boolean;
    /**
     * Function to Get the stack from message if it is an Error instance
     * @param {RecordInterfaceType} record - Record Instance to get stack from
     * @returns {string|undefined} Stack from the error instance if exists, otherwise undefined
     */
    getStack(record: RecordInterfaceType): string | undefined;
    /**
     * Function to interpolateRecord if extra parameters are present
     * @param {string} record - record to interpolate
     * @param {object} extra - extra arguments to interpolate
     * @returns {string} interpolated message
     */
    interpolateRecord(record: string, extra: {
        [key: string]: any;
    }): string;
    /**
     * Function to format message from the record to log
     * @param record - Log record
     * @returns {string} formatted message
     */
    formatMessage(record: RecordInterfaceType): string;
    /**
     * @override
     */
    formatRecord(record: RecordInterfaceType): string;
}
export { BasicFormatter, JSONFormatter };
