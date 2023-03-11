// import '@babel/polyfill';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--passwordreset');

// DELEGATIONS
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm =
            document.getElementById('passwordConfirm').value;
    });
}
