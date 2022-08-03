import { BaseHandler, BaseFormatter } from './base_classes';
import { BasicFormatter } from './formatter';
import { ConsoleHandler } from './handler';
import { Logger } from './logger';

type CustomLoggerProps = {
    level?: 1 | 2 | 3 | 4 | 5;
    handlers?: Array<BaseHandler>;
    formatter?: BaseFormatter;
}
/**
 * Function to get basic logger instance
 * This returns a console logger with basic logging
 * @returns {Logger} Logger instance
 */
export function get_basic_logger(): Logger {
    const l = new Logger()
    const h = new ConsoleHandler();
    const f = new BasicFormatter();
    h.setFormatter(f);
    l.addHandler(h)
    return l
}

/**
 * Function to get custom logger instance
 * @param {CustomLoggerProps} props -  CustomLoggerProps object containing handlers, formatter and level
 * @param {Array<BaseHandler>} [props.handlers=[new ConsoleHandler()]] - List of handlers to add to logger
 * @param {BaseFormatter} [props.formatter=new BasicFormatter()] - Formatter to use for logging messages
 * @param {1|2|3|4|5} [props.level=1] - Log level to use for logging messages
 * @returns {Logger} Logger instance
 */
export function get_custom_logger(props: CustomLoggerProps): Logger {
    const { handlers = [new ConsoleHandler()],
        level = 1,
        formatter = new BasicFormatter()
    } = props;
    const l = new Logger()
    handlers.forEach(h => {
        h.setLevel(level)
        h.setFormatter(formatter)
        l.addHandler(h)
    });
    return l
}