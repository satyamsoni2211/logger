import { HandlerInterfaceType, FormatterInterfaceType, RecordInterfaceType } from "./base_types";

/**
 * Abstract base class for Handler
 * Can be used to create a new Handler instance
 */
abstract class BaseHandler implements HandlerInterfaceType {
    formatter!: FormatterInterfaceType;
    /**
     * Level number corresponding to the log levle
     * of handler. By default this is 1 (debug)
     * This can be overridden by setLevel() method
     * @type {number}
     */
    level: number;
    /**
     * constructor for Handler class
     * by default it sets level to debug
     */
    constructor() {
        this.level = 1;
    }
    /**
     * Function to override the default formatter
     * this is required as by default no formatter is set
     * @param {FormatterInterfaceType} formatter - Formatter instance
     * @returns {void}
     */
    setFormatter(formatter: FormatterInterfaceType) {
        this.formatter = formatter;
    }
    /**
     * Abstract method which needs to be overridden in the derived
     * classes to emit the record that is logged.
     * This is the call on every record emittion my logger
     * @param {RecordInterfaceType} record: Log record to emit
     */
    abstract emit(record: RecordInterfaceType): void;
    /**
     * Function to override log level of 
     * handler class
     * @param {number} level - Log level to override (1,5)
     */
    setLevel(level: number) {
        this.level = level;
    }
    /**
     * Filter function to check if handler needs to process the record
     * or skip it based of its log level
     * @param {number} level - Log level to check for filtering
     * @returns {boolean}
     */
    filter(level: number): boolean {
        if (this.level <= level) {
            return true;
        }
        return false;
    }
}

/**
 * Abstract base class for Formatter
 * Can be used to create a new Formatter instance
 */
abstract class BaseFormatter implements FormatterInterfaceType {
    abstract formatRecord(record: RecordInterfaceType): string;
    format(value: RecordInterfaceType): string {
        const m = this.formatRecord(value)
        return m;
    }
}

export { BaseHandler, BaseFormatter };