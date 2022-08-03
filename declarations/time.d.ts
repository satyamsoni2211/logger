declare type Time<T> = () => T;
declare type FormatTime = (format: string) => string;
/**
 * Function to get current time in ISO format
 * @returns {string}
 */
export declare const current_iso_time: Time<string>;
/**
 * Function to get current time in unix timestamp
 * @returns {number}
 */
export declare const current_epoc: Time<number>;
/**
 * Function to get current time in unix timestamp in milliseconds
 * @returns {number}
 */
export declare const current_epoc_millis: Time<number>;
/**
 * Function to format the current time with user defined format
 * @param {string} format - Format of the datetime
 * @returns {string} formatted datetime
 */
export declare const custom_formatted: FormatTime;
export {};
