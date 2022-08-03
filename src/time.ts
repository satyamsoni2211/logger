import Moment from 'moment';

type Time<T> = () => T
type FormatTime = (format: string) => string

/**
 * Function to get current time in ISO format
 * @returns {string}
 */
export const current_iso_time: Time<string> = () => {
    return Moment().toISOString();
}

/**
 * Function to get current time in unix timestamp
 * @returns {number}
 */
export const current_epoc: Time<number> = () => {
    return Moment().unix()
}

/**
 * Function to get current time in unix timestamp in milliseconds
 * @returns {number}
 */
export const current_epoc_millis: Time<number> = () => {
    return Moment().valueOf()
}

/**
 * Function to format the current time with user defined format
 * @param {string} format - Format of the datetime 
 * @returns {string} formatted datetime
 */
export const custom_formatted: FormatTime = (format: string) => {
    return Moment().format(format)
}
