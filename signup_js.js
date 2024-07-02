document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const nicknameInput = document.getElementById('nickname');
    const passwordInput = document.getElementById('password');
    const pwConfirmInput = document.getElementById('pw_confirm')
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

    const pwConfirmErrorMessage = document.createElement('span');
    passwordErrorMessage.textContent = '비밀번호가 일치하지 않습니다';
    passwordErrorMessage.style.color = '#F74747';
    passwordErrorMessage.style.fontSize = '15px';
    passwordErrorMessage.style.fontWeight = '600';
    passwordErrorMessage.style.marginTop = '-8px';
    passwordErrorMessage.style.marginLeft = '16px';
    passwordErrorMessage.style.display = 'none';

    pwConfirmInput.parentNode.appendChild(pwConfirmErrorMessage);

    const nicknameErrorMessage = document.createElement('span');
    passwordErrorMessage.textContent = '닉네임을 입력해 주세요';
    passwordErrorMessage.style.color = '#F74747';
    passwordErrorMessage.style.fontSize = '15px';
    passwordErrorMessage.style.fontWeight = '600';
    passwordErrorMessage.style.marginTop = '-8px';
    passwordErrorMessage.style.marginLeft = '16px';
    passwordErrorMessage.style.display = 'none';

    nicknameInput.parentNode.appendChild(nicknameErrorMessage);

    function checkPassword() {
        if (passwordInput.value.trim() == "") {
            passwordErrorMessage.style.display = 'none';
            passwordInput.style.border = 'none'
        }
        else if (passwordInput.value.trim().length >= 8) {
            passwordErrorMessage.style.display = 'none';
            passwordInput.style.border = 'none'
        } else {
            passwordErrorMessage.style.display = 'block';
            passwordInput.style.border = '1px solid #F74747';
            passwordInput.style.borderRadius = '12px'
        }
        InputCheck();
    }

    function checkConfirmPassword() {
        if (passwordConfirmInput.value.trim() == passwordInput.value.trim()) {
            passwordErrorMessage.style.display = 'none';
            passwordInput.style.border = 'none'
        }
        else if (passwordInput.value.trim().length >= 8) {
            passwordErrorMessage.style.display = 'none';
            passwordInput.style.border = 'none'
        } else {
            passwordErrorMessage.style.display = 'block';
            passwordInput.style.border = '1px solid #F74747';
            passwordInput.style.borderRadius = '12px'
        }
        InputCheck();
    }

    function InputCheck() {
        const confirmedEmail = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(emailInput.value.trim());
        const confirmedPassword = passwordInput.value.trim().length >= 8;
        const confirmedNickname = nicknameInput.value.trim().length >= 1;

        if (confirmedEmail && confirmedPassword && confirmedNickname) {
            loginButton.style.backgroundColor = '#3692FF';
            loginButton.style.border = 'none';
        } else {
            loginButton.style.backgroundColor = '#ccc';
            loginButton.style.border = '1px solid #ccc';      
        }
    }

})