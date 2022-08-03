import { BaseHandler, BaseFormatter } from './base_classes';
import { Logger } from './logger';
declare type CustomLoggerProps = {
    level?: 1 | 2 | 3 | 4 | 5;
    handlers?: Array<BaseHandler>;
    formatter?: BaseFormatter;
};
/**
 * Function to get basic logger instance
 * This returns a console logger with basic logging
 * @returns {Logger} Logger instance
 */
export declare function get_basic_logger(): Logger;
/**
 * Function to get custom logger instance
 * @param {CustomLoggerProps} props -  CustomLoggerProps object containing handlers, formatter and level
 * @param {Array<BaseHandler>} [props.handlers=[new ConsoleHandler()]] - List of handlers to add to logger
 * @param {BaseFormatter} [props.formatter=new BasicFormatter()] - Formatter to use for logging messages
 * @param {1|2|3|4|5} [props.level=1] - Log level to use for logging messages
 * @returns {Logger} Logger instance
 */
export declare function get_custom_logger(props: CustomLoggerProps): Logger;
export {};
