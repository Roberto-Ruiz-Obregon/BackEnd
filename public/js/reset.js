/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

/**
 * It takes in an email, password, passwordConfirm, and token, and then it sends a PATCH request to the
 * server with the data. If the server responds with a status of success, then it shows an alert and
 * redirects the user to the home page
 * @param email - 'test@test.com'
 * @param password - "123456789"
 * @param passwordConfirm - "123456789"
 * @param token - the token that was sent to the user's email
 */
export const reset = async (
    email,
    password,
    passwordConfirm,
    token,
    userType
) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/v1/${userType}/resetpassword/${token}`,
            data: {
                email,
                password,
                passwordConfirm,
            },
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Has cambiado tu contraseña!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
