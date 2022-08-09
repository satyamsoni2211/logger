/**
 * Abstract base class for Handler
 * Can be used to create a new Handler instance
 */
class BaseHandler {
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
    setFormatter(formatter) {
        this.formatter = formatter;
    }
    /**
     * Function to override log level of
     * handler class
     * @param {number} level - Log level to override (1,5)
     */
    setLevel(level) {
        this.level = level;
    }
    /**
     * Filter function to check if handler needs to process the record
     * or skip it based of its log level
     * @param {number} level - Log level to check for filtering
     * @returns {boolean}
     */
    filter(level) {
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
class BaseFormatter {
    format(value) {
        const m = this.formatRecord(value);
        return m;
    }
}
export { BaseHandler, BaseFormatter };
//# sourceMappingURL=base_classes.js.map