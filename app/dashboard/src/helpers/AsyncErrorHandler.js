/**
 * Helper to log server response data when it returns error codes
 *
 * @param {*} error
 */
function AsyncErrorHandler(error) {
    if (error.response) {
        console.error(`Server returned ${error.response.status} error`, error.response.data);
    } else if (error.request) {
        console.error('No response received from server')
    } else {
        console.log(error);
    }
}

export default AsyncErrorHandler;