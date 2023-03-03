/**
 * Handle any errors of a given function and send them with the next function to the error controller.
 * @param {function} fn - The function to handle.
 * @return {function} - A function whose errors are passed to the error controller
 */
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
