/* eslint-disable */

/**
 * If there is an element with the class of alert, remove it from the DOM.
 */
export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

/**
 * The showAlert function takes in three arguments, type, msg, and time, and then inserts a div with
 * the class alert alert-- and the message  into the body of the document, and then after
 * the time argument has passed, the hideAlert function is called.
 * @param type - the type of alert, e.g. success, error, etc.
 * @param msg - The message you want to display
 * @param [time=7] - The time in seconds that the alert will be displayed.
 */
export const showAlert = (type, msg, time = 7) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    // console.log(document.querySelector('body'));
    window.setTimeout(hideAlert, time * 1000);
};
