import { BaseFormatter } from "./base_classes"
import { RecordInterfaceType, JSONRecord } from "./base_types";

class BasicFormatter extends BaseFormatter {
    /**
     * @override
     */
    formatRecord(record: RecordInterfaceType): string {
        const m = `[${record.level}] ${record.getIsoFormatTime()} ${record.getMessage()}`;
        return m.replace(/\$\{(\S+)\}/g, function (all) {
            let token = all.slice(2, all.length - 1)
            return record.extra[token] || all
        })
    }
}

class JSONFormatter extends BaseFormatter {
    /**
     * Function to check if the message is an Error or not
     * @param {any} message - Message to check for Error instance
     * @returns {boolean} True if the message is an Error instance, false otherwise
     */
    isError(message: any): boolean {
        if (message instanceof Error) {
            return true;
        }
        return false
    }
    /**
     * Function to Get the stack from message if it is an Error instance
     * @param {RecordInterfaceType} record - Record Instance to get stack from
     * @returns {string|undefined} Stack from the error instance if exists, otherwise undefined
     */
    getStack(record: RecordInterfaceType): string | undefined {
        const message = record.getMessage();
        if (this.isError(message)) {
            return (message as Error).stack
        }
    }
    /**
     * Function to interpolateRecord if extra parameters are present
     * @param {string} record - record to interpolate
     * @param {object} extra - extra arguments to interpolate 
     * @returns {string} interpolated message
     */
    interpolateRecord(record: string, extra: { [key: string]: any }): string {
        return record.replace(/\$\{(\S+)\}/g, function (all) {
            let token = all.slice(2, all.length - 1)
            return extra[token] || all
        })
    }
    /**
     * Function to format message from the record to log
     * @param record - Log record 
     * @returns {string} formatted message
     */
    formatMessage(record: RecordInterfaceType): string {
        const message = record.getMessage();
        let formattedMessage: string;
        if (message instanceof Error) {
            formattedMessage = `${message.message}`;
        } else {
            formattedMessage = this.interpolateRecord(
                message,
                record.extra
            );
        }
        return formattedMessage;
    }
    /**
     * @override
     */
    formatRecord(record: RecordInterfaceType): string {
        const fr: JSONRecord = {
            message: this.formatMessage(record),
            timestamp: record.getIsoFormatTime(),
            level: record.level,
            context: record.extra,
            user: record.extra?.user
        }
        if (this.isError(record.getMessage())) {
            fr.stack_info = this.getStack(record)
        }
        return JSON.stringify(fr)
    }
}

export { BasicFormatter, JSONFormatter };