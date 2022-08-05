import Moment from 'moment';
/**
 * Function to get current time in ISO format
 * @returns {string}
 */
export const current_iso_time = () => {
    return Moment().toISOString();
};
/**
 * Function to get current time in unix timestamp
 * @returns {number}
 */
export const current_epoc = () => {
    return Moment().unix();
};
/**
 * Function to get current time in unix timestamp in milliseconds
 * @returns {number}
 */
export const current_epoc_millis = () => {
    return Moment().valueOf();
};
/**
 * Function to format the current time with user defined format
 * @param {string} format - Format of the datetime
 * @returns {string} formatted datetime
 */
export const custom_formatted = (format) => {
    return Moment().format(format);
};
//# sourceMappingURL=time.js.map