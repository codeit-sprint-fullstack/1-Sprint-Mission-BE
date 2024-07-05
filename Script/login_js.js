import * as valid from './validation.js';

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementsByClassName('login_button')[0];

    const emailErrorMessage = document.createElement('span');
    emailErrorMessage.textContent = '잘못된 이메일 입니다';
    emailErrorMessage.style.color = '#F74747';
    emailErrorMessage.style.fontSize = '15px';
    emailErrorMessage.style.fontWeight = '600';
    emailErrorMessage.style.marginTop = '-8px';
    emailErrorMessage.style.marginLeft = '16px';
    emailErrorMessage.style.display = 'none';

    emailInput.parentNode.appendChild(emailErrorMessage);

    const passwordErrorMessage = document.createElement('span');
    passwordErrorMessage.textContent = '비밀번호를 8자 이상 입력해주세요';
    passwordErrorMessage.style.color = '#F74747';
    passwordErrorMessage.style.fontSize = '15px';
    passwordErrorMessage.style.fontWeight = '600';
    passwordErrorMessage.style.marginTop = '-8px';
    passwordErrorMessage.style.marginLeft = '16px';
    passwordErrorMessage.style.display = 'none';

    passwordInput.parentNode.appendChild(passwordErrorMessage);

    emailInput.addEventListener('input', checkEmail);
    passwordInput.addEventListener('input', checkPassword);

    loginButton.addEventListener('click', (event) => {
        const confirmedEmail = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(emailInput.value.trim());
        const confirmedPassword = passwordInput.value.trim().length >= 8;

        if (!confirmedEmail || !confirmedPassword) {
            event.preventDefault();

            if (!confirmedEmail && !confirmedPassword) {
                swal.fire({
                    text: '이메일과 비밀번호를 확인해주세요',
                    icon: 'warning',
                    showCloseButton: true,
                    showConfirmButton: true
                });
            } else if (!confirmedEmail) {
                swal.fire({
                    text: '이메일을 확인해주세요',
                    icon: 'warning',
                    showCloseButton: true,
                    showConfirmButton: true
                });
            } else if (!confirmedPassword) {
                swal.fire({
                    text: '비밀번호를 확인해주세요',
                    icon: 'warning',
                    showCloseButton: true,
                    showConfirmButton: true
                });
            }
        }
    });
});