/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const reset = async (email, password, passwordConfirm, token) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/users/resetpassword/${token}`,
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
        console.log(err.response);
        showAlert('error', err.response.data.message);
    }
};
